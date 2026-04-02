import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/dashboard/StatCard'
import { OrderPipeline } from '@/components/dashboard/OrderPipeline'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { ReportService } from '@/lib/services/ReportService'
import { Package, Users, ShoppingCart, Wallet, CheckCircle, Clock } from 'lucide-react'

export default async function AdminOverview() {
  const summary = await ReportService.getPlatformSummary()
  
  const supabase = createClient()
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*, products(title), agents(users(full_name))')
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: pendingAgents } = await supabase
    .from('agents')
    .select('*, users(full_name, email, phone)')
    .eq('status', 'pending')
    .limit(5)

  return (
    <div className="space-y-12">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard 
          label="Total Orders" 
          value={summary.totalOrders || 0} 
          icon={<ShoppingCart className="w-5 h-5" />} 
          variant="ink" 
        />
        <StatCard 
          label="Pending Orders" 
          value={summary.totalOrders - 3} // Placeholder for pending count
          icon={<Clock className="w-5 h-5" />} 
          variant="gold" 
        />
        <StatCard 
          label="Delivered" 
          value={3} // Placeholder for delivered
          icon={<CheckCircle className="w-5 h-5" />} 
          variant="teal" 
        />
        <StatCard 
          label="Active Agents" 
          value={summary.activeAgents || 0} 
          icon={<Users className="w-5 h-5" />} 
          variant="ink" 
        />
        <StatCard 
          label="Pending Comm." 
          value={`₦${summary.pendingCommissions.toLocaleString()}`} 
          icon={<Wallet className="w-5 h-5" />} 
          variant="gold" 
        />
        <StatCard 
          label="Total Revenue" 
          value={`₦${summary.totalRevenue.toLocaleString()}`} 
          icon={<Package className="w-5 h-5" />} 
          variant="teal" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Order Pipeline */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl display text-ink">Live Order Pipeline</h3>
            <span className="live-dot"></span>
          </div>
          <OrderPipeline />
          
          <div className="pt-10">
             <h3 className="text-xl display text-ink mb-6">Recent Orders</h3>
             <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-soft">
                <table className="w-full text-left">
                   <thead className="bg-mist border-b border-border">
                      <tr>
                         <th className="px-6 py-4 text-xs font-bold text-text-3 uppercase tracking-widest">ID</th>
                         <th className="px-6 py-4 text-xs font-bold text-text-3 uppercase tracking-widest">Product</th>
                         <th className="px-6 py-4 text-xs font-bold text-text-3 uppercase tracking-widest">Agent</th>
                         <th className="px-6 py-4 text-xs font-bold text-text-3 uppercase tracking-widest">Amount</th>
                         <th className="px-6 py-4 text-xs font-bold text-text-3 uppercase tracking-widest">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-border">
                      {recentOrders?.map((order) => (
                         <tr key={order.id} className="hover:bg-snow transition-colors group">
                            <td className="px-6 py-4 text-sm font-bold text-ink">{order.id}</td>
                            <td className="px-6 py-4 text-sm text-text-2 font-bold">{order.products?.title}</td>
                            <td className="px-6 py-4 text-sm text-gold font-bold">{order.agents?.users?.full_name || 'Direct'}</td>
                            <td className="px-6 py-4 text-sm font-bold text-ink">₦{Number(order.total_amount).toLocaleString()}</td>
                            <td className="px-6 py-4">
                               <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                  order.order_status === 'pending' ? 'bg-gold-light text-gold border-gold/20' :
                                  order.order_status === 'delivered' ? 'bg-teal-light text-teal border-teal/20' :
                                  'bg-mist text-text-2 border-border'
                               }`}>
                                  {order.order_status}
                               </span>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* Side Panel: Actions & Activity */}
        <div className="space-y-10">
           <div className="bg-white p-8 rounded-[40px] border border-border shadow-soft h-[500px] flex flex-col">
              <h3 className="text-xl display text-ink mb-6">Pending Approvals</h3>
              <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide">
                 {pendingAgents?.map((agent) => (
                    <div key={agent.id} className="bg-mist p-4 rounded-2xl border border-border hover:border-gold transition-all group">
                       <p className="text-sm font-bold text-ink mb-1">{agent.users.full_name}</p>
                       <p className="text-xs text-text-3 mb-4">{agent.users.email}</p>
                       <div className="grid grid-cols-2 gap-2">
                          <button className="bg-teal text-white py-2 rounded-xl text-xs font-bold hover:bg-teal-2 transition-all">Approve</button>
                          <button className="bg-white text-danger border border-danger/10 py-2 rounded-xl text-xs font-bold hover:bg-danger/5 transition-all">Reject</button>
                       </div>
                    </div>
                 ))}
                 {!pendingAgents?.length && <p className="text-center text-text-3 text-sm py-10 font-bold uppercase tracking-widest">No pending agents</p>}
              </div>
           </div>

           <div className="bg-ink text-white p-8 rounded-[40px] border border-white/5 h-[500px] flex flex-col">
              <h3 className="text-xl display text-white mb-6 flex items-center gap-2">
                 Activity <div className="live-dot"></div>
              </h3>
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                 <ActivityFeed />
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
