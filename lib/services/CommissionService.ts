import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

export class CommissionService {
  private static supabase = createClient()

  static calculateCommission(price: number, quantity: number, type: 'percent' | 'fixed', value: number): number {
    if (type === 'percent') {
      return Math.round((price * quantity * value) / 100)
    }
    return value * quantity
  }

  static async createCommission(orderId: string, agentId: string, amount: number) {
    const { data, error } = await this.supabase
      .from('commissions')
      .insert({
        order_id: orderId,
        agent_id: agentId,
        amount,
        payout_status: 'pending'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async approveCommission(commissionId: string) {
    const { data, error } = await this.supabase
      .from('commissions')
      .update({ payout_status: 'approved' })
      .eq('id', commissionId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async markPaid(commissionId: string) {
    const { data, error } = await this.supabase
      .from('commissions')
      .update({ 
        payout_status: 'paid',
        paid_at: new Date().toISOString()
      })
      .eq('id', commissionId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getAgentEarnings(agentId: string) {
    const { data, error } = await this.supabase
      .from('commissions')
      .select('amount, payout_status')
      .eq('agent_id', agentId)

    if (error) throw error

    const stats = {
      pending: 0,
      approved: 0,
      paid: 0,
      total: 0
    }

    data.forEach(c => {
      if (c.payout_status === 'pending') stats.pending += Number(c.amount)
      if (c.payout_status === 'approved') stats.approved += Number(c.amount)
      if (c.payout_status === 'paid') stats.paid += Number(c.amount)
      stats.total += Number(c.amount)
    })

    return stats
  }

  static async approveAllDelivered() {
    // This is better done in an Edge Function or SQL trigger, but here's the service method
    const { data: deliveredOrders, error: orderError } = await this.supabase
      .from('orders')
      .select('id')
      .eq('order_status', 'delivered')

    if (orderError) throw orderError

    const orderIds = deliveredOrders.map(o => o.id)

    const { error: updateError } = await this.supabase
      .from('commissions')
      .update({ payout_status: 'approved' })
      .in('order_id', orderIds)
      .eq('payout_status', 'pending')

    if (updateError) throw updateError
  }
}
