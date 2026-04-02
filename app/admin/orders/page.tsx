import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/dashboard/StatCard'
import { ShoppingCart, Search, Filter, Download, MoreVertical, Calendar } from 'lucide-react'

export default async function AdminOrdersPage() {
  const supabase = createClient()
  
  const { data: orders } = await supabase
    .from('orders')
    .select('*, products(title), businesses(business_name), agents(users(full_name))')
    .order('created_at', { ascending: false })

  const stats = {
    total: orders?.length || 0,
    revenue: orders?.reduce((acc, o) => acc + Number(o.total_amount), 0) || 0,
    delivered: orders?.filter(o => o.order_status === 'delivered').length || 0,
    commissions: orders?.reduce((acc, o) => acc + Number(o.commission_amount), 0) || 0
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between flex-wrap gap-6">
        <h1 className="text-4xl display text-ink">Global Orders</h1>
        <button className="bg-teal text-white flex items-center gap-2 px-8 py-4 rounded-full font-bold hover:bg-teal-2 transition-all shadow-glow-teal">
           <Download className="w-5 h-5" />
           Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <StatCard label="Total Orders" value={stats.total} icon={<ShoppingCart className="w-5 h-5" />} variant="ink" />
         <StatCard label="Total Revenue" value={`₦${stats.revenue.toLocaleString()}`} icon={<ShoppingCart className="w-5 h-5" />} variant="teal" />
         <StatCard label="Commissions" value={`₦${stats.commissions.toLocaleString()}`} icon={<ShoppingCart className="w-5 h-5" />} variant="gold" />
         <StatCard label="Avg Order" value={`₦${(stats.revenue / (stats.total || 1)).toLocaleString()}`} icon={<ShoppingCart className="w-5 h-5" />} variant="ink" />
      </div>

      <div className="bg-white rounded-[40px] border border-border shadow-soft overflow-hidden">
         {/* Advanced Filter Panel */}
         <div className="p-8 border-b border-border space-y-6">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
               <div className="relative w-full lg:max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                  <input className="w-full bg-snow border-0 h-14 pl-12 pr-6 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold outline-none" placeholder="Search Order ID, Customer, Phone..." />
               </div>
               
               <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                  <div className="flex items-center gap-2 px-6 h-14 bg-mist rounded-2xl border border-border group cursor-pointer hover:border-gold transition-all shrink-0">
                     <Calendar className="w-4 h-4 text-text-3 group-hover:text-gold transition-colors" />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-text-3">Last 30 Days</span>
                  </div>
                  <select className="h-14 px-6 bg-mist text-text-2 font-bold uppercase tracking-widest text-[10px] rounded-2xl border border-border outline-none focus:ring-2 focus:ring-gold shrink-0">
                     <option>Status: All</option>
                     <option>Pending</option>
                     <option>Delivered</option>
                     <option>Cancelled</option>
                  </select>
                  <select className="h-14 px-6 bg-mist text-text-2 font-bold uppercase tracking-widest text-[10px] rounded-2xl border border-border outline-none focus:ring-2 focus:ring-gold shrink-0">
                     <option>Agent: All</option>
                     <option>Tunde Jimoh</option>
                     <option>Aisha Kolo</option>
                  </select>
               </div>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-snow border-b border-border">
                  <tr>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest whitespace-nowrap">ID / Date</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest whitespace-nowrap">Customer</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest whitespace-nowrap">Product / Vendor</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest whitespace-nowrap">Source</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest whitespace-nowrap">Amount</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest whitespace-nowrap">Status</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {orders?.map((order) => (
                     <tr key={order.id} className="hover:bg-snow/50 transition-colors group">
                        <td className="px-8 py-6">
                           <p className="text-sm font-bold text-ink mb-1">{order.id}</p>
                           <p className="text-[10px] text-text-3 font-bold uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</p>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-sm text-ink font-bold">{order.customer_name}</p>
                           <p className="text-[10px] text-text-3 mt-1 font-mono">{order.customer_phone}</p>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-sm text-ink font-bold line-clamp-1">{order.products?.title}</p>
                           <p className="text-[10px] text-teal mt-1 font-bold uppercase tracking-widest">{order.businesses?.business_name}</p>
                        </td>
                        <td className="px-8 py-6">
                           {order.agents?.users?.full_name ? (
                              <div className="flex flex-col">
                                 <span className="text-xs font-bold text-gold uppercase tracking-widest">Agent Link</span>
                                 <span className="text-[10px] text-text-3 mt-1">{order.agents.users.full_name}</span>
                              </div>
                           ) : (
                              <span className="text-xs font-bold text-text-2 uppercase tracking-widest">Direct</span>
                           )}
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-sm font-bold text-ink">₦{Number(order.total_amount).toLocaleString()}</p>
                           <p className="text-[10px] text-teal-2 font-bold uppercase tracking-widest mt-1">Comm: ₦{Number(order.commission_amount).toLocaleString()}</p>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                              order.order_status === 'delivered' ? 'bg-teal-light text-teal border-teal/20 shadow-glow-teal' :
                              order.order_status === 'pending' ? 'bg-gold-light text-gold border-gold/10 shadow-glow' :
                              'bg-mist text-text-3 border-border uppercase'
                           }`}>
                              {order.order_status}
                           </span>
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
  )
}
