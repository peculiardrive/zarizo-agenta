import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/dashboard/StatCard'
import { Users, Search, MoreVertical, MessageCircle, ShoppingBag } from 'lucide-react'

export default async function BusinessAgentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: businessData } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user?.id as string)
    .single()

  const bizId = (businessData as any)?.id

  // Fetch unique agents who have sold for this business
  const { data: orderAgentsData } = await supabase
    .from('orders')
    .select('agent_id, agents(*, users(full_name, email, phone))')
    .eq('business_id', bizId)
    .not('agent_id', 'is', null)

  const orderAgents = (orderAgentsData || []) as any[]

  const uniqueAgents = Array.from(new Set(orderAgents.map(oa => oa.agent_id))).map(id => {
     return orderAgents.find(oa => oa.agent_id === id)?.agents
  }).filter(Boolean)

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between flex-wrap gap-6">
        <h1 className="text-4xl display text-ink">Store Sales Agents</h1>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-border shadow-soft">
           <div className="live-dot"></div>
           <span className="text-xs font-bold text-teal uppercase tracking-widest leading-none mt-0.5">Active Network</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatCard label="My Total Agents" value={uniqueAgents.length} icon={<Users className="w-5 h-5" />} variant="ink" />
         <StatCard label="Recent Sales" value={orderAgents?.length || 0} icon={<ShoppingBag className="w-5 h-5" />} variant="teal" />
         <StatCard label="Agent Coverage" value="6 Cities" icon={<Users className="w-5 h-5" />} variant="gold" />
      </div>

      <div className="bg-white rounded-[40px] border border-border shadow-soft overflow-hidden">
         <div className="p-8 border-b border-border flex flex-col md:flex-row gap-6 items-center">
            <div className="relative w-full md:max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
               <input className="w-full bg-snow border-0 h-14 pl-12 pr-6 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold outline-none" placeholder="Search your sales team..." />
            </div>
            <div className="flex items-center gap-2">
               <button className="h-14 px-6 bg-mist text-text-2 font-bold uppercase tracking-widest text-[10px] rounded-2xl border border-border hover:border-gold transition-all">Sort: Performance</button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-snow border-b border-border">
                  <tr>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Agent Name</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Commission Code</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Orders Sold</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Total Earned</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {uniqueAgents.map((agent: any) => (
                     <tr key={agent.id} className="hover:bg-snow/50 transition-colors group">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-mist rounded-2xl flex items-center justify-center text-xl shadow-sm border border-border group-hover:scale-110 transition-transform">👤</div>
                              <div className="flex flex-col">
                                 <span className="text-sm font-bold text-ink mb-1 truncate line-clamp-1">{agent.users.full_name}</span>
                                 <span className="text-xs text-text-3 font-bold uppercase tracking-widest">{agent.users.email}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-gold font-bold font-mono tracking-widest">{agent.referral_code}</td>
                        <td className="px-8 py-6 text-sm font-bold text-ink">
                           {orderAgents?.filter(oa => oa.agent_id === agent.id).length || 0}
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-ink">₦0.00</td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex items-center justify-end gap-3 translate-x-2">
                              <button className="bg-teal text-white w-10 h-10 flex items-center justify-center rounded-xl hover:scale-110 shadow-glow-teal transition-all">
                                 <MessageCircle className="w-4 h-4" />
                              </button>
                              <button className="bg-mist text-text-2 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gold transition-all ml-auto">
                                 <MoreVertical className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
                  {uniqueAgents.length === 0 && <tr><td colSpan={5} className="p-20 text-center text-text-3 font-bold uppercase tracking-widest">No agents have sold your products yet.</td></tr>}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  )
}
