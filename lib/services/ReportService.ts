import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

export class ReportService {
  private static _supabase: any = null

  private static get supabase() {
    if (!this._supabase) {
      this._supabase = createClient()
    }
    return this._supabase
  }

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

    const totalRevenue = revenueData?.reduce((acc: number, o: any) => acc + Number(o.total_amount), 0) || 0

    const { data: commissionData } = await this.supabase
      .from('commissions')
      .select('amount, payout_status')

    const pendingCommissions = commissionData?.filter((c: any) => c.payout_status === 'pending').reduce((acc: number, c: any) => acc + Number(c.amount), 0) || 0
    const paidCommissions = commissionData?.filter((c: any) => c.payout_status === 'paid').reduce((acc: number, c: any) => acc + Number(c.amount), 0) || 0

    // Startup Metrics
    const { count: totalClicks } = await this.supabase
      .from('referral_clicks')
      .select('*', { count: 'exact', head: true })

    const conversionRate = totalClicks ? Number(((totalOrders || 0) / totalClicks * 100).toFixed(1)) : 0

    const { count: pendingOrders } = await this.supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('order_status', 'pending')

    const { count: deliveredOrders } = await this.supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('order_status', 'delivered')

    const { count: activeProducts } = await this.supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    return { 
      totalOrders: totalOrders || 0, 
      totalRevenue, 
      activeAgents: activeAgents || 0, 
      activeBusinesses: activeBusinesses || 0, 
      pendingCommissions, 
      paidCommissions,
      totalClicks: totalClicks || 0,
      conversionRate,
      pendingOrders: pendingOrders || 0,
      deliveredOrders: deliveredOrders || 0,
      activeProducts: activeProducts || 0
    }
  }

  static async getAgentLeaderboard() {
    const { data, error } = await this.supabase
      .from('agents')
      .select('*, users(full_name), commissions(amount)')
      .eq('status', 'active')
    
    if (error) throw error

    const leaderboard = data.map((agent: any) => ({
      name: agent.users.full_name,
      code: agent.referral_code,
      totalEarned: agent.commissions.reduce((acc: number, c: any) => acc + Number(c.amount), 0)
    })).sort((a: any, b: any) => b.totalEarned - a.totalEarned).slice(0, 10)

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
      revenue: data.reduce((acc: number, o: any) => acc + Number(o.total_amount), 0),
      agents: new Set(data.map((o: any) => o.agent_id)).size,
      topProducts: this.groupByProduct(data)
    }

    return performance
  }

  private static groupByProduct(orders: any[]) {
    const products: Record<string, { title: string, count: number }> = {}
    orders.forEach(o => {
      const id = o.product_id
      const title = o.products?.title || 'Unknown Product'
      if (!products[id]) products[id] = { title, count: 0 }
      products[id].count += 1
    })
    return Object.values(products).sort((a, b) => b.count - a.count)
  }
}
