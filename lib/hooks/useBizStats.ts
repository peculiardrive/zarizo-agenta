import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useBizStats(businessId: string) {
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    activeProducts: 0,
    agentCount: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId)

      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      const { count: todayOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId)
        .gte('created_at', startOfDay.toISOString())

      const { data: revenueData } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('business_id', businessId)
        .eq('payment_status', 'paid')
      
      const totalRevenue = (revenueData as any[])?.reduce((acc, o) => acc + Number(o.total_amount), 0) || 0

      const { count: activeProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId)
        .eq('status', 'active')

      const { data: orderData } = await supabase
        .from('orders')
        .select('agent_id')
        .eq('business_id', businessId)
        .not('agent_id', 'is', null)
      
      const agentCount = new Set((orderData as any[])?.map(o => o.agent_id) || []).size

      setStats({
        totalOrders: totalOrders || 0,
        todayOrders: todayOrders || 0,
        totalRevenue,
        activeProducts: activeProducts || 0,
        agentCount
      })
      setLoading(false)
    }

    fetchStats()

    const channel = supabase
      .channel(`biz_stats_${businessId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `business_id=eq.${businessId}` }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products', filter: `business_id=eq.${businessId}` }, fetchStats)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [businessId, supabase])

  return { stats, loading }
}
