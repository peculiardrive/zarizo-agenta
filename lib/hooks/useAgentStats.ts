import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CommissionService } from '@/lib/services/CommissionService'
import { ReferralService } from '@/lib/services/ReferralService'

export function useAgentStats(agentId: string) {
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    pendingEarnings: 0,
    approvedEarnings: 0,
    totalEarned: 0,
    conversionRate: '0.0%'
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('agent_id', agentId)

      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)

      const { count: todayOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('agent_id', agentId)
        .gte('created_at', startOfDay.toISOString())

      const earnings = await CommissionService.getAgentEarnings(agentId)
      const conversionRate = await ReferralService.getConversionRate(agentId)

      setStats({
        totalOrders: totalOrders || 0,
        todayOrders: todayOrders || 0,
        pendingEarnings: earnings.pending,
        approvedEarnings: earnings.approved,
        totalEarned: earnings.total,
        conversionRate
      })
      setLoading(false)
    }

    fetchStats()

    // Refresh every 30 seconds (or on realtime changes)
    const interval = setInterval(fetchStats, 30000)

    // Also subscribe to changes in commissions and orders for this agent
    const orderSub = supabase
      .channel(`agent_stats_orders_${agentId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `agent_id=eq.${agentId}` }, fetchStats)
      .subscribe()
    
    const commSub = supabase
      .channel(`agent_stats_commissions_${agentId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'commissions', filter: `agent_id=eq.${agentId}` }, fetchStats)
      .subscribe()

    return () => {
      clearInterval(interval)
      supabase.removeChannel(orderSub)
      supabase.removeChannel(commSub)
    }
  }, [agentId, supabase])

  return { stats, loading }
}
