import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/dashboard/StatCard'
import { Users, Search, Filter, MoreVertical, Check, X } from 'lucide-react'
import { GovernorActions } from '@/components/admin/GovernorActions'

export default async function AdminAgentsPage() {
  const supabase = createClient()
  
  const { data: agents } = await supabase
    .from('agents')
    .select('*, users(full_name, email, phone)')
    .order('created_at', { ascending: false })

  const activeAgents = agents?.filter(a => a.status === 'active') || []
  const pendingAgents = agents?.filter(a => a.status === 'pending') || []

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between flex-wrap gap-6">
        <h1 className="text-4xl display text-ink">Agent Network</h1>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-border shadow-soft transition-all hover:-translate-y-1">
           <div className="live-dot"></div>
           <span className="text-xs font-bold text-teal uppercase tracking-widest leading-none mt-0.5">Network Monitoring</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <StatCard label="Total Agents" value={agents?.length || 0} icon={<Users className="w-5 h-5" />} variant="ink" />
         <StatCard label="Active Status" value={activeAgents.length} icon={<Users className="w-5 h-5" />} variant="teal" />
         <StatCard label="Pending Approval" value={pendingAgents.length} icon={<Users className="w-5 h-5" />} variant="gold" />
         <StatCard label="Network Growth" value="+12%" icon={<Users className="w-5 h-5" />} variant="teal" />
      </div>

      {/* Pending Approvals Table */}
      {pendingAgents.length > 0 && (
        <div className="space-y-6">
           <h3 className="text-xl display text-gold uppercase tracking-widest text-[10px] bg-gold-light/50 border border-gold/10 inline-block px-4 py-2 rounded-xl shadow-glow">Waiting for Approval ({pendingAgents.length})</h3>
           <div className="bg-white rounded-[40px] border border-border shadow-soft overflow-hidden animate-pulse-subtle">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-gold-light/20 border-b border-border">
                       <tr>
                          <th className="px-8 py-5 text-[10px] font-bold text-ink uppercase tracking-widest">Full Name</th>
                          <th className="px-8 py-5 text-[10px] font-bold text-ink uppercase tracking-widest">Contact Details</th>
                          <th className="px-8 py-5 text-[10px] font-bold text-ink uppercase tracking-widest">Applied Date</th>
                          <th className="px-8 py-5 text-[10px] font-bold text-ink uppercase tracking-widest">Bank</th>
                          <th className="px-8 py-5 text-[10px] font-bold text-ink uppercase tracking-widest text-right">Approval</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                       {pendingAgents.map((agent) => (
                          <tr key={agent.id} className="hover:bg-snow/50 transition-colors group">
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-gold/10">👤</div>
                                   <span className="text-sm font-bold text-ink">{agent.users.full_name}</span>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <p className="text-sm text-ink font-bold">{agent.users.email}</p>
                                <p className="text-xs text-text-3 mt-1 underline decoration-gold/30">{agent.users.phone}</p>
                             </td>
                             <td className="px-8 py-6 text-sm text-text-2 font-bold">{new Date(agent.created_at).toLocaleDateString()}</td>
                             <td className="px-8 py-6 text-sm font-bold text-ink">{agent.bank_name}</td>
                             <td className="px-8 py-6 text-right">
                                <GovernorActions id={agent.id} type="agent" status={agent.status} />
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {/* Active Agents Table */}
      <div className="space-y-6 pt-6">
         <h3 className="text-xl display text-ink uppercase tracking-widest text-[10px] bg-mist border border-border inline-block px-4 py-2 rounded-xl">Verified Network</h3>
         <div className="bg-white rounded-[40px] border border-border shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-snow border-b border-border">
                     <tr>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Agent Info</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Referral Code</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Earnings</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Withdrawals</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {activeAgents.map((agent) => (
                        <tr key={agent.id} className="hover:bg-snow/50 transition-colors group">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-mist rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">🎓</div>
                                 <div className="flex flex-col">
                                    <span className="text-sm font-bold text-ink">{agent.users.full_name}</span>
                                    <span className="text-xs text-text-3 font-bold uppercase tracking-widest">Verified {new Date(agent.created_at).getFullYear()}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-sm text-gold font-bold font-mono tracking-widest">{agent.referral_code}</td>
                           <td className="px-8 py-6 text-sm font-bold text-ink">₦0.00</td>
                           <td className="px-8 py-6 text-sm font-bold text-ink">₦0.00</td>
                           <td className="px-8 py-6">
                              <span className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-teal-light text-teal border border-teal/20">Active</span>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <button className="bg-mist text-text-2 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gold transition-all ml-auto">
                                 <MoreVertical className="w-4 h-4" />
                              </button>
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
