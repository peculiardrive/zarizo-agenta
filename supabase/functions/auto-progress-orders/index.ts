import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get("SUPABASE_URL")
const supabaseAnonKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

serve(async (req) => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // 1. Pending to Confirmed (> 10 mins)
  const { data: ordersToConfirm } = await supabase
    .from('orders')
    .update({ 
      order_status: 'confirmed', 
      updated_at: new Date().toISOString() 
    })
    .eq('order_status', 'pending')
    .lt('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString())
    .select()

  // 2. Confirmed to Processing (> 1 hour)
  const { data: ordersToProcess } = await supabase
    .from('orders')
    .update({ 
      order_status: 'processing', 
      updated_at: new Date().toISOString() 
    })
    .eq('order_status', 'confirmed')
    .lt('updated_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
    .select()

  // 3. Processing to Delivered (> 2 hours)
  const { data: ordersToDeliver } = await supabase
    .from('orders')
    .update({ 
      order_status: 'delivered', 
      updated_at: new Date().toISOString() 
    })
    .eq('order_status', 'processing')
    .lt('updated_at', new Date(Date.now() - 120 * 60 * 1000).toISOString())
    .select()

  // For each delivered order, approve commission
  if (ordersToDeliver) {
    for (const order of ordersToDeliver) {
      await supabase
        .from('commissions')
        .update({ payout_status: 'approved' })
        .eq('order_id', order.id)
      
      // Notify agent
      if (order.agent_id) {
        const { data: agentUser } = await supabase
          .from('agents')
          .select('user_id')
          .eq('id', order.agent_id)
          .single()
        
        if (agentUser) {
          await supabase.from('notifications').insert({
            user_id: agentUser.user_id,
            title: 'Commission Approved!',
            message: `Your commission for order ${order.id} is now approved for payout.`,
            type: 'commission'
          })
        }
      }
    }
  }

  return new Response(JSON.stringify({ 
    success: true, 
    confirmed: ordersToConfirm?.length || 0,
    processing: ordersToProcess?.length || 0,
    delivered: ordersToDeliver?.length || 0
  }))
})
