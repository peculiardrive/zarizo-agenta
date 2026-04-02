import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/dashboard/StatCard'
import { Wallet, Check, CheckCircle2, MoreVertical, CreditCard } from 'lucide-react'

export default async function AdminCommissionsPage() {
  const supabase = createClient()
  
  const { data: commissions } = await supabase
    .from('commissions')
    .select('*, orders(id), agents(users(full_name, bank_name, account_number))')
    .order('created_at', { ascending: false })

  const stats = {
    pending: commissions?.filter(c => c.payout_status === 'pending').reduce((acc, c) => acc + Number(c.amount), 0) || 0,
    approved: commissions?.filter(c => c.payout_status === 'approved').reduce((acc, c) => acc + Number(c.amount), 0) || 0,
    paid: commissions?.filter(c => c.payout_status === 'paid').reduce((acc, c) => acc + Number(c.amount), 0) || 0
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between flex-wrap gap-6">
        <h1 className="text-4xl display text-ink">Commission Management</h1>
        <button className="bg-teal text-white flex items-center gap-2 px-8 py-4 rounded-full font-bold hover:bg-teal-2 transition-all shadow-glow-teal">
           <CheckCircle2 className="w-5 h-5" />
           Pay All Approved
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatCard label="Pending Approval" value={`₦${stats.pending.toLocaleString()}`} icon={<Wallet className="w-5 h-5" />} variant="gold" />
         <StatCard label="Approved (Payable)" value={`₦${stats.approved.toLocaleString()}`} icon={<CheckCircle2 className="w-5 h-5" />} variant="teal" />
         <StatCard label="Total Paid Out" value={`₦${stats.paid.toLocaleString()}`} icon={<CreditCard className="w-5 h-5" />} variant="ink" />
      </div>

      {/* Tabs / Filter Panel */}
      <div className="space-y-6">
         <div className="flex items-center gap-2 bg-mist p-2 rounded-2xl w-fit border border-border">
            {['Pending', 'Approved', 'Paid History'].map((tab, i) => (
               <button key={tab} className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${i === 0 ? 'bg-white text-ink shadow-sm' : 'text-text-3 hover:text-ink'}`}>
                  {tab}
               </button>
            ))}
         </div>

         <div className="bg-white rounded-[40px] border border-border shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-snow border-b border-border">
                     <tr>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Order ID</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Agent Details</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Commission</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Payout Info</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {commissions?.map((comm) => (
                        <tr key={comm.id} className="hover:bg-snow/50 transition-colors group">
                           <td className="px-8 py-6">
                              <p className="text-sm font-bold text-ink mb-1">{comm.orders?.id}</p>
                              <p className="text-[10px] text-text-3 font-bold uppercase tracking-widest">{new Date(comm.created_at).toLocaleDateString()}</p>
                           </td>
                           <td className="px-8 py-6">
                              <p className="text-sm text-ink font-bold">{comm.agents?.users?.full_name}</p>
                              <p className="text-[10px] text-text-3 mt-1 underline decoration-gold/30 uppercase tracking-widest">Referral Partner</p>
                           </td>
                           <td className="px-8 py-6 text-sm font-bold text-teal-2">₦{Number(comm.amount).toLocaleString()}</td>
                           <td className="px-8 py-6">
                              <p className="text-xs text-ink font-bold">{comm.agents?.users?.bank_name || 'N/A'}</p>
                              <p className="text-[10px] text-text-3 mt-1 font-mono">{comm.agents?.users?.account_number || 'N/A'}</p>
                           </td>
                           <td className="px-8 py-6">
                              <span className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                                 comm.payout_status === 'approved' ? 'bg-teal-light text-teal border-teal/20 shadow-glow-teal' :
                                 comm.payout_status === 'pending' ? 'bg-gold-light text-gold border-gold/10 shadow-glow' :
                                 comm.payout_status === 'paid' ? 'bg-ink text-white border-ink/10' :
                                 'bg-mist text-text-3 border-border uppercase'
                              }`}>
                                 {comm.payout_status}
                              </span>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                 {comm.payout_status === 'pending' && (
                                    <button className="bg-gold text-ink w-9 h-9 flex items-center justify-center rounded-xl hover:scale-110 shadow-glow transition-all">✨</button>
                                 )}
                                 <button className="bg-mist text-text-2 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gold transition-all">
                                    <MoreVertical className="w-4 h-4" />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  )
}
