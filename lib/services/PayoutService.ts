import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'
import { NotificationService } from './NotificationService'

export class PayoutService {
  private static supabase = createClient()
  private static MIN_PAYOUT = 5000

  static async requestPayout(agentId: string) {
    // 1. Get all approved commissions
    const { data: approvedComms, error: commError } = await this.supabase
      .from('commissions')
      .select('*')
      .eq('agent_id', agentId)
      .eq('payout_status', 'approved')

    if (commError) throw commError

    const totalAmount = approvedComms.reduce((acc, c) => acc + Number(c.amount), 0)

    if (totalAmount < this.MIN_PAYOUT) {
      throw new Error(`Minimum payout amount is ₦${this.MIN_PAYOUT.toLocaleString()}`)
    }

    // 2. Fetch agent bank info
    const { data: agent, error: agentError } = await this.supabase
      .from('agents')
      .select('*, users(email, full_name, phone)')
      .eq('id', agentId)
      .single()

    if (agentError) throw agentError

    // 3. Create payout record
    const { data: payout, error: payoutError } = await this.supabase
      .from('payouts')
      .insert({
        agent_id: agentId,
        amount: totalAmount,
        bank_name: agent.bank_name,
        account_number: agent.account_number,
        account_name: agent.account_name,
        status: 'pending'
      })
      .select()
      .single()

    if (payoutError) throw payoutError

    // 4. Mark commissions as paid
    const { error: updateError } = await this.supabase
      .from('commissions')
      .update({ 
        payout_status: 'paid',
        paid_at: new Date().toISOString()
      })
      .in('id', approvedComms.map(c => c.id))

    if (updateError) throw updateError

    // 5. Notify agent
    await NotificationService.sendInApp(
      agent.user_id,
      'Payout Requested',
      `Your request for ₦${totalAmount.toLocaleString()} has been received and is being processed.`,
      'payout'
    )

    return payout
  }

  static async processPayoutWithPaystack(payoutId: string) {
    // [V2 Stub]
    console.log(`Processing payout ${payoutId} via Paystack Transfer API...`)
    const { error } = await this.supabase
      .from('payouts')
      .update({ 
        status: 'processing',
        reference: `PAY-${Date.now()}`
      })
      .eq('id', payoutId)
    
    if (error) throw error
  }

  static async getPayoutHistory(agentId: string) {
    const { data, error } = await this.supabase
      .from('payouts')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}
