import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/dashboard/StatCard'
import { ShoppingCart, Search, Eye, Filter, CheckCircle2, Clock } from 'lucide-react'

export default async function AgentOrdersPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: agent } = await supabase
    .from('agents')
    .select('id')
    .eq('user_id', user?.id)
    .single()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, products(title)')
    .eq('agent_id', agent?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between flex-wrap gap-6">
        <h1 className="text-4xl display text-ink">My Referral Sales</h1>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-border shadow-soft">
           <div className="live-dot"></div>
           <span className="text-xs font-bold text-teal uppercase tracking-widest leading-none mt-0.5">Live Sales Stream</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <StatCard label="Total Sold" value={orders?.length || 0} icon={<ShoppingCart className="w-5 h-5" />} variant="ink" />
         <StatCard label="Pending" value={orders?.filter(o => o.order_status === 'pending').length || 0} icon={<Clock className="w-5 h-5" />} variant="gold" />
         <StatCard label="Delivered" value={orders?.filter(o => o.order_status === 'delivered').length || 0} icon={<CheckCircle2 className="w-5 h-5" />} variant="teal" />
         <StatCard label="Total Commission" value={`₦${orders?.reduce((acc, o) => acc + Number(o.commission_amount || 0), 0).toLocaleString()}`} icon={<ShoppingCart className="w-5 h-5" />} variant="ink" />
      </div>

      <div className="bg-white rounded-[40px] border border-border shadow-soft overflow-hidden">
         <div className="p-8 border-b border-border flex flex-col md:flex-row gap-6 items-center">
            <div className="relative w-full md:max-w-md">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
               <input className="w-full bg-snow border-0 h-14 pl-12 pr-6 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold outline-none" placeholder="Search by Order ID or Product..." />
            </div>
            <div className="flex items-center gap-2">
               <button className="h-14 px-6 bg-mist text-text-2 font-bold uppercase tracking-widest text-[10px] rounded-2xl border border-border hover:border-gold transition-all">Filter: Status All</button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-snow border-b border-border">
                  <tr>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Order Info</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Product Sold</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Order Amount</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest whitespace-nowrap">Your Earn</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Status</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest text-right">Preview</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {orders?.map((order) => (
                     <tr key={order.id} className="hover:bg-snow/50 transition-colors group">
                        <td className="px-8 py-6">
                           <p className="text-sm font-bold text-ink mb-1">{order.id}</p>
                           <p className="text-[10px] text-text-3 font-bold uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</p>
                        </td>
                        <td className="px-8 py-6 text-sm text-ink font-bold line-clamp-1">{order.products?.title}</td>
                        <td className="px-8 py-6 text-sm font-medium text-text-2">₦{Number(order.total_amount).toLocaleString()}</td>
                        <td className="px-8 py-6 text-sm font-bold text-teal-2 whitespace-nowrap">₦{Number(order.commission_amount || 0).toLocaleString()}</td>
                        <td className="px-8 py-6">
                           <span className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                              order.order_status === 'delivered' ? 'bg-teal-light text-teal border-teal/20' :
                              order.order_status === 'pending' ? 'bg-gold-light text-gold border-gold/10' :
                              'bg-mist text-text-3 border-border'
                           }`}>
                              {order.order_status}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button className="bg-mist text-text-2 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gold transition-all ml-auto">
                              <Eye className="w-4 h-4" />
                           </button>
                        </td>
                     </tr>
                  ))}
                  {orders?.length === 0 && <tr><td colSpan={6} className="p-20 text-center text-text-3 font-bold uppercase tracking-widest">No sales yet. View catalog to start sharing!</td></tr>}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  )
}
