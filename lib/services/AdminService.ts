import { createClient } from '@/lib/supabase/client'

export class AdminService {
  private static supabase = createClient()

  /**
   * Approve a business and its owner
   */
  static async approveBusiness(businessId: string) {
    const { error } = await this.supabase
      .from('businesses')
      .update({ status: 'active' })
      .eq('id', businessId)
    
    if (error) throw error

    // Create a notification for the business
    const { data: business } = await this.supabase
      .from('businesses')
      .select('user_id')
      .eq('id', businessId)
      .single()

    if (business?.user_id) {
      await this.supabase.from('notifications').insert({
        user_id: business.user_id,
        title: 'Business Approved!',
        message: 'Your business has been verified. You can now start listing products.',
        type: 'system'
      })
    }

    return true
  }

  /**
   * Approve an agent application
   */
  static async approveAgent(agentId: string) {
    const { error } = await this.supabase
      .from('agents')
      .update({ status: 'active' })
      .eq('id', agentId)
    
    if (error) throw error

    const { data: agent } = await this.supabase
      .from('agents')
      .select('user_id')
      .eq('id', agentId)
      .single()

    if (agent?.user_id) {
      await this.supabase.from('notifications').insert({
        user_id: agent.user_id,
        title: 'Agent Application Approved!',
        message: 'You are now a verified Zarizo agent. Start sharing links to earn commissions.',
        type: 'system'
      })
    }

    return true
  }

  /**
   * Suspend an item (Business, Agent, or Product)
   */
  static async suspendItem(table: 'businesses' | 'agents' | 'products', id: string) {
    const status = table === 'products' ? 'draft' : 'suspended'
    const { error } = await this.supabase
      .from(table)
      .update({ status } as any)
      .eq('id', id)
    
    if (error) throw error
    return true
  }

  /**
   * Approve a product for the marketplace
   */
  static async approveProduct(productId: string) {
    const { error } = await this.supabase
      .from('products')
      .update({ status: 'active' })
      .eq('id', productId)
    
    if (error) throw error
    return true
  }
}
