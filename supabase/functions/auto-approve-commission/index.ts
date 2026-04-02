import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get("SUPABASE_URL")
const supabaseAnonKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

serve(async (req) => {
  const payload = await req.json()
  const order = payload.record
  const oldOrder = payload.old_record

  // Check if status changed to delivered
  if (order.order_status !== 'delivered' || (oldOrder && oldOrder.order_status === 'delivered')) {
    return new Response(JSON.stringify({ success: false, message: "Status not changed to delivered" }))
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // 1. Find matching commission
  const { data: commission } = await supabase
    .from('commissions')
    .select('*, agents(user_id, users(email, phone))')
    .eq('order_id', order.id)
    .single()

  if (commission) {
    // 2. Approve commission
    await supabase.from('commissions').update({ payout_status: 'approved' }).eq('id', commission.id)

    // 3. Notify agent via in-app
    if (commission.agents.user_id) {
      await supabase.from('notifications').insert({
        user_id: commission.agents.user_id,
        title: 'Commission Approved!',
        message: `Your commission of ₦${commission.amount} is approved.`,
        type: 'commission'
      })
    }

    // 4. Send email and SMS (V2)
    // Using simple placeholders as in services
    console.log(`Sending email to ${commission.agents.users.email}: Commission Approved!`)
    console.log(`Sending SMS to ${commission.agents.users.phone}: Commission Approved!`)
  }

  return new Response(JSON.stringify({ success: true }))
})
