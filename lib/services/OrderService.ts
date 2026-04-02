import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'
import { CommissionService } from './CommissionService'
import { NotificationService } from './NotificationService'

export class OrderService {
  private static supabase = createClient()

  static async generateOrderId(): Promise<string> {
    const { count, error } = await this.supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    const nextNum = (count || 0) + 1
    return `ORD-${nextNum.toString().padStart(6, '0')}`
  }

  static async createOrder(data: {
    productId: string
    agentId?: string
    customerName: string
    customerPhone: string
    customerAddress: string
    quantity: number
    paymentStatus?: 'pending' | 'paid' | 'failed'
    paymentReference?: string
  }) {
    const orderId = await this.generateOrderId()

    // 1. Fetch product to get business_id and commission info
    const { data: product, error: productError } = await this.supabase
      .from('products')
      .select('*, businesses(*)')
      .eq('id', data.productId)
      .single()

    if (productError) throw productError

    const totalAmount = product.price * data.quantity
    const commissionAmount = data.agentId 
      ? CommissionService.calculateCommission(
          product.price, 
          data.quantity, 
          product.commission_type as 'percent' | 'fixed', 
          product.commission_value
        )
      : 0

    // 2. Insert order
    const { data: order, error: orderError } = await this.supabase
      .from('orders')
      .insert({
        id: orderId,
        product_id: data.productId,
        business_id: product.business_id,
        agent_id: data.agentId || null,
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_address: data.customerAddress,
        quantity: data.quantity,
        total_amount: totalAmount,
        commission_amount: commissionAmount,
        order_status: 'pending',
        payment_status: data.paymentStatus || 'pending',
        payment_reference: data.paymentReference || null
      })
      .select()
      .single()

    if (orderError) throw orderError

    // 3. Create commission record if agent exists
    if (data.agentId && commissionAmount > 0) {
      await CommissionService.createCommission(orderId, data.agentId, commissionAmount)
      
      // 4. Notify agent
      const { data: agentUser } = await this.supabase
        .from('agents')
        .select('user_id')
        .eq('id', data.agentId)
        .single()
      
      if (agentUser) {
        await NotificationService.sendInApp(
          agentUser.user_id,
          'New Order!',
          `You've earned ₦${commissionAmount.toLocaleString()} from a new order via your link.`,
          'order'
        )
      }
    }

    // 5. Notify business
    const { data: businessUser } = await this.supabase
      .from('businesses')
      .select('user_id')
      .eq('id', product.business_id)
      .single()

    if (businessUser) {
      await NotificationService.sendInApp(
        businessUser.user_id,
        'Incoming Order',
        `New order ${orderId} for ${product.title}`,
        'order'
      )
    }

    return { order, commissionAmount }
  }

  static async updateStatus(orderId: string, status: Database['public']['Tables']['orders']['Row']['order_status']) {
    const { data, error } = await this.supabase
      .from('orders')
      .update({ 
        order_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error

    if (status === 'delivered') {
      // In a real app we might use a webhook or more robust logic
      const { data: comm } = await this.supabase
        .from('commissions')
        .select('id')
        .eq('order_id', orderId)
        .single()
      
      if (comm) {
        await CommissionService.approveCommission(comm.id)
      }
    }

    return data
  }

  static async getOrdersByAgent(agentId: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*, products(title, image_url)')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async getOrdersByBusiness(businessId: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*, products(*)')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}
