import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/dashboard/StatCard'
import { Wallet, CheckCircle2, MoreVertical, CreditCard, Clock } from 'lucide-react'

export default async function AgentCommissionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: agentData } = await supabase
    .from('agents')
    .select('id')
    .eq('user_id', user?.id as string)
    .single()
  
  const agent = agentData as any

  const { data: commissionsData } = await supabase
    .from('commissions')
    .select('*, orders(id)')
    .eq('agent_id', agent?.id)
    .order('created_at', { ascending: false })

  const commissions = (commissionsData || []) as any[]

  const stats = {
    pending: commissions?.filter(c => c.payout_status === 'pending').reduce((acc, c) => acc + Number(c.amount), 0) || 0,
    approved: commissions?.filter(c => c.payout_status === 'approved').reduce((acc, c) => acc + Number(c.amount), 0) || 0,
    paid: commissions?.filter(c => c.payout_status === 'paid').reduce((acc, c) => acc + Number(c.amount), 0) || 0
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between flex-wrap gap-6">
        <h1 className="text-4xl display text-ink">My Earnings</h1>
        <button disabled={stats.approved < 5000} className="bg-teal text-white flex items-center gap-2 px-10 py-5 rounded-full font-bold hover:bg-teal-2 transition-all shadow-glow-teal disabled:opacity-50 disabled:grayscale disabled:shadow-none">
           <CreditCard className="w-5 h-5" />
           Request Withdrawal (Min: ₦5k)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <StatCard label="Pending Approval" value={`₦${stats.pending.toLocaleString()}`} icon={<Clock className="w-5 h-5" />} variant="gold" />
         <StatCard label="Ready to Pay" value={`₦${stats.approved.toLocaleString()}`} icon={<Wallet className="w-5 h-5" />} variant="teal" />
         <StatCard label="Already Paid" value={`₦${stats.paid.toLocaleString()}`} icon={<CheckCircle2 className="w-5 h-5" />} variant="ink" />
      </div>

      <div className="space-y-6">
         <h3 className="text-xl display text-ink uppercase tracking-widest text-[10px] bg-mist border border-border inline-block px-4 py-2 rounded-xl">Payment History</h3>
         
         <div className="bg-white rounded-[40px] border border-border shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-snow border-b border-border">
                     <tr>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Date</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Description</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Amount</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Reference</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {commissions?.map((comm) => (
                        <tr key={comm.id} className="hover:bg-snow/50 transition-colors group">
                           <td className="px-8 py-6">
                              <p className="text-sm font-bold text-ink">{new Date(comm.created_at).toLocaleDateString()}</p>
                              <p className="text-[10px] text-text-3 font-bold uppercase tracking-widest mt-1">{new Date(comm.created_at).toLocaleTimeString().split(':').slice(0,2).join(':')}</p>
                           </td>
                           <td className="px-8 py-6 text-sm text-text-2 font-bold">Commission from {comm.orders?.id}</td>
                           <td className="px-8 py-6 text-sm font-bold text-ink">₦{Number(comm.amount).toLocaleString()}</td>
                           <td className="px-8 py-6 text-[10px] text-text-3 font-mono">TXN-{comm.id.slice(0,8).toUpperCase()}</td>
                           <td className="px-8 py-6 text-right md:text-left">
                              <span className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                                 comm.payout_status === 'approved' ? 'bg-teal-light text-teal border-teal/20' :
                                 comm.payout_status === 'pending' ? 'bg-gold-light text-gold border-gold/10' :
                                 comm.payout_status === 'paid' ? 'bg-ink text-white border-white/5' :
                                 'bg-mist text-text-3 border-border'
                              }`}>
                                 {comm.payout_status}
                              </span>
                           </td>
                        </tr>
                     ))}
                     {commissions?.length === 0 && <tr><td colSpan={5} className="p-20 text-center text-text-3 font-bold uppercase tracking-widest">No earnings history found.</td></tr>}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  )
}
