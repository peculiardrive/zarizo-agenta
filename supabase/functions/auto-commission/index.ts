import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get("SUPABASE_URL")
const supabaseAnonKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
const termiiKey = Deno.env.get("TERMII_API_KEY")

serve(async (req) => {
  const payload = await req.json()
  const order = payload.record

  if (!order.agent_id) return new Response(JSON.stringify({ message: "No agent for this order" }))

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // 1. Fetch product
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', order.product_id)
    .single()

  if (!product) throw new Error("Product not found")

  // 2. Calculate commission
  let amount = 0
  if (product.commission_type === 'percent') {
    amount = Math.round((product.price * order.quantity * product.commission_value) / 100)
  } else {
    amount = product.commission_value * order.quantity
  }

  // 3. Insert Commission
  await supabase.from('commissions').insert({
    order_id: order.id,
    agent_id: order.agent_id,
    amount,
    payout_status: 'pending'
  })

  // 4. Update order with calculation
  await supabase.from('orders').update({ commission_amount: amount }).eq('id', order.id)

  // 5. Notify agent
  const { data: agentUser } = await supabase
    .from('agents')
    .select('user_id, users(phone)')
    .eq('id', order.agent_id)
    .single()

  if (agentUser) {
    await supabase.from('notifications').insert({
      user_id: agentUser.user_id,
      title: 'New Commission!',
      message: `You earned ₦${amount} from order ${order.id}`,
      type: 'commission'
    })

    // 6. Send SMS via Termii
    if (agentUser.users?.phone) {
      await fetch(`https://api.ng.termii.com/api/sms/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: agentUser.users.phone,
          from: "Zarizo",
          sms: `New order ${order.id} via your link! You've earned ₦${amount}. Check your dashboard. — Zarizo`,
          type: 'plain',
          channel: 'generic',
          api_key: termiiKey
        })
      })
    }
  }

  return new Response(JSON.stringify({ success: true }))
})
