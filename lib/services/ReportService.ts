import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

export class ReportService {
  private static supabase = createClient()

  static async getPlatformSummary() {
    const { count: totalOrders } = await this.supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })

    const { count: activeAgents } = await this.supabase
      .from('agents')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    const { count: activeBusinesses } = await this.supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    const { data: revenueData } = await this.supabase
      .from('orders')
      .select('total_amount')
      .eq('payment_status', 'paid')

    const totalRevenue = revenueData?.reduce((acc, o) => acc + Number(o.total_amount), 0) || 0

    const { data: commissionData } = await this.supabase
      .from('commissions')
      .select('amount, payout_status')

    const pendingCommissions = commissionData?.filter(c => c.payout_status === 'pending').reduce((acc, c) => acc + Number(c.amount), 0) || 0
    const paidCommissions = commissionData?.filter(c => c.payout_status === 'paid').reduce((acc, c) => acc + Number(c.amount), 0) || 0

    return { totalOrders, totalRevenue, activeAgents, activeBusinesses, pendingCommissions, paidCommissions }
  }

  static async getAgentLeaderboard() {
    const { data, error } = await this.supabase
      .from('agents')
      .select('*, users(full_name), commissions(amount)')
      .eq('status', 'active')
    
    if (error) throw error

    const leaderboard = data.map(agent => ({
      name: agent.users.full_name,
      code: agent.referral_code,
      totalEarned: agent.commissions.reduce((acc, c) => acc + Number(c.amount), 0)
    })).sort((a, b) => b.totalEarned - a.totalEarned).slice(0, 10)

    return leaderboard
  }

  static async getBusinessPerformance(bizId: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*, products(title)')
      .eq('business_id', bizId)

    if (error) throw error

    const performance = {
      orders: data.length,
      revenue: data.reduce((acc, o) => acc + Number(o.total_amount), 0),
      agents: new Set(data.map(o => o.agent_id)).size,
      topProducts: this.groupByProduct(data)
    }

    return performance
  }

  private static groupByProduct(orders: any[]) {
    const products: Record<string, { title: string, count: number }> = {}
    orders.forEach(o => {
      const id = o.product_id
      if (!products[id]) products[id] = { title: o.products.title, count: 0 }
      products[id].count += 1
    })
    return Object.values(products).sort((a, b) => b.count - a.count)
  }
}
