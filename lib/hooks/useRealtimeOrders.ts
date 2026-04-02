import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

export function useRealtimeOrders(businessId?: string, agentId?: string) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let query = supabase
      .from('orders')
      .select('*, products(title, price, image_url)')
      .order('created_at', { ascending: false })

    if (businessId) query = query.eq('business_id', businessId)
    if (agentId) query = query.eq('agent_id', agentId)

    const fetchInitial = async () => {
      const { data, error } = await query
      if (data) setOrders(data)
      setLoading(false)
    }

    fetchInitial()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('realtime_orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: businessId ? `business_id=eq.${businessId}` : agentId ? `agent_id=eq.${agentId}` : undefined
        },
        async (payload) => {
          console.log('Order Change:', payload)
          if (payload.eventType === 'INSERT') {
            // Need to fetch full order to get related product info
            const { data } = await supabase
              .from('orders')
              .select('*, products(title, price, image_url)')
              .eq('id', payload.new.id)
              .single()
            
            if (data) setOrders(prev => [data, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => 
              prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } : o)
            )
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(o => o.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [businessId, agentId, supabase])

  return { orders, loading }
}
