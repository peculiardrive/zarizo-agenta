import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get("SUPABASE_URL")
const supabaseAnonKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

serve(async (req) => {
  const { payout_id } = await req.json()

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // 1. Fetch payout record
  const { data: payout } = await supabase
    .from('payouts')
    .select('*, agents(*, users(*))')
    .eq('id', payout_id)
    .single()

  if (!payout) return new Response(JSON.stringify({ error: "Payout not found" }))

  // 2. Log attempt to Paystack
  console.log(`Processing payout ${payout_id} for ${payout.agents.users.full_name} via Paystack Transfer API...`)
  
  try {
    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY")
    const response = await fetch(`https://api.paystack.co/transfer`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${paystackSecret}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        source: 'balance',
        amount: payout.amount * 100, // Paystack uses kobo (subunits)
        recipient: payout.agents.account_number, // In real V2, we'd use a recipient code
        reason: 'Commission payout - Zarizo'
      })
    })

    const result = await response.json()
    
    // 3. Update payout record with reference
    const { error: updateError } = await supabase
      .from('payouts')
      .update({ 
        status: 'processing',
        reference: result.data?.transfer_code || "N/A"
      })
      .eq('id', payout_id)
    
    if (updateError) throw updateError
    
    return new Response(JSON.stringify({ success: true, reference: result.data?.transfer_code }))
  } catch (err) {
    console.error("Paystack transfer failed", err)
    return new Response(JSON.stringify({ error: "Paystack transfer failed" }))
  }
})
