import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get("SUPABASE_URL")
const supabaseAnonKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

serve(async (req) => {
  const payload = await req.json()
  const order = payload.record

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // 1. Fetch related data
  const { data: product } = await supabase
    .from('products')
    .select('*, businesses(*, users(email))')
    .eq('id', order.product_id)
    .single()

  const { data: agent } = order.agent_id ? await supabase
    .from('agents')
    .select('*, users(email)')
    .eq('id', order.agent_id)
    .single() : { data: null }

  // 2. Send SMS to customer via Termii
  console.log(`Sending SMS to customer ${order.customer_phone}: Order Received ${order.id}`)
  await fetch(`https://api.ng.termii.com/api/sms/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: order.customer_phone,
      from: "Zarizo",
      sms: `Your order ${order.id} has been received. We will contact you to confirm delivery. — Zarizo`,
      type: 'plain',
      channel: 'generic',
      api_key: Deno.env.get("TERMII_API_KEY")
    })
  })

  // 3. Send email to business
  if (product.businesses?.users?.email) {
    console.log(`Sending email to business ${product.businesses.users.email}: New order received for ${product.title}`)
  }

  // 4. Send email to agent
  if (agent?.users?.email) {
    console.log(`Sending email to agent ${agent.users.email}: New order via your link! Check earnings.`)
  }

  return new Response(JSON.stringify({ success: true }))
})
