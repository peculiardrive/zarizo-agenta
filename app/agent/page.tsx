import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/dashboard/StatCard'
import { ShoppingCart, Wallet, TrendingUp, Clock, Zap, Star } from 'lucide-react'
import Link from 'next/link'

export default async function AgentOverview() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: businessData } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user?.id as string)
    .single()

  const business = businessData as any
  const bizId = business?.id

  const { data: agentData } = await supabase
    .from('agents')
    .select('*, users(full_name)')
    .eq('user_id', user?.id as string)
    .single()

  const agent = agentData as any
  const agentId = agent?.id

  // Stats
  const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('agent_id', agentId)
  const { data: earningsData } = await supabase.from('commissions').select('amount, payout_status').eq('agent_id', agentId)
  
  const rawEarnings = (earningsData || []) as any[]
  const earnings = {
    pending: rawEarnings.filter(c => c.payout_status === 'pending').reduce((acc, c) => acc + Number(c.amount), 0) || 0,
    approved: rawEarnings.filter(c => c.payout_status === 'approved').reduce((acc, c) => acc + Number(c.amount), 0) || 0,
    total: rawEarnings.reduce((acc, c) => acc + Number(c.amount), 0) || 0
  }

  const { data: orderData } = await supabase
    .from('orders')
    .select('*, products(title)')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })
    .limit(5)

  const recentOrders = (orderData || []) as any[]

  return (
    <div className="space-y-12 pb-20 px-4 md:px-0">
      <div className="flex items-center justify-between flex-wrap gap-6">
        <div>
           <h1 className="text-5xl display text-ink mb-2">Welcome, {agent?.users?.full_name?.split(' ')[0] || 'Agent'}!</h1>
           <p className="text-text-2 font-bold uppercase tracking-widest text-[10px] bg-mist px-4 py-2 rounded-xl border border-border inline-block">Partner Code: <span className="text-gold">{agent?.referral_code}</span></p>
        </div>
        <div className="flex items-center gap-4">
           <Link href="/agent/products" className="btn-teal flex items-center gap-2 px-10 py-5 shadow-glow-teal text-lg">
              <Zap className="w-5 h-5" />
              Start Selling
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
         <StatCard label="Total Referrals" value={totalOrders || 0} icon={<ShoppingCart className="w-5 h-5" />} variant="ink" />
         <StatCard label="Pending Comm." value={`₦${earnings.pending.toLocaleString()}`} icon={<Clock className="w-5 h-5" />} variant="gold" />
         <StatCard label="Approved (Payable)" value={`₦${earnings.approved.toLocaleString()}`} icon={<Wallet className="w-5 h-5" />} variant="teal" />
         <StatCard label="Conversion" value="4.2%" icon={<TrendingUp className="w-5 h-5" />} variant="ink" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 space-y-8">
            <h3 className="text-2xl display text-ink">Recent Earnings</h3>
            <div className="bg-white rounded-[40px] border border-border shadow-soft overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-snow border-b border-border">
                     <tr>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest whitespace-nowrap">Order ID</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest whitespace-nowrap">Product</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest whitespace-nowrap">Earned</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest whitespace-nowrap">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {recentOrders?.map((order) => (
                        <tr key={order.id} className="hover:bg-snow/50 transition-colors group">
                           <td className="px-8 py-6 text-sm font-bold text-ink">{order.id}</td>
                           <td className="px-8 py-6">
                              <p className="text-sm font-bold text-ink truncate line-clamp-1">{order.products?.title}</p>
                              <p className="text-[10px] text-text-3 font-bold uppercase tracking-widest mt-1">Confirmed Sale</p>
                           </td>
                           <td className="px-8 py-6 text-sm font-bold text-teal-2 font-mono whitespace-nowrap">₦{Number(order.commission_amount || 0).toLocaleString()}</td>
                           <td className="px-8 py-6">
                              <span className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                                 order.order_status === 'delivered' ? 'bg-teal-light text-teal border-teal/20' :
                                 order.order_status === 'pending' ? 'bg-gold-light text-gold border-gold/10' :
                                 'bg-mist text-text-3 border-border'
                              }`}>
                                 {order.order_status}
                              </span>
                           </td>
                        </tr>
                     ))}
                     {!recentOrders?.length && <tr><td colSpan={4} className="p-20 text-center text-text-3 font-bold uppercase tracking-widest">No sales yet. View catalog to start sharing!</td></tr>}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="space-y-10">
            <h3 className="text-2xl display text-ink">Agent Rank</h3>
            <div className="bg-ink text-white p-10 rounded-[50px] border border-white/5 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-full bg-gold rounded-full filter blur-[150px] opacity-10 pointer-events-none group-hover:scale-150 transition-all duration-700"></div>
               <div className="relative z-10 text-center">
                  <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[35px] flex items-center justify-center text-4xl mx-auto mb-10 shadow-glow shadow-gold/20">🌱</div>
                  <h4 className="text-xl display mb-2">Pioneer Agent</h4>
                  <p className="text-text-3 text-xs uppercase tracking-widest font-bold mb-10">Next Level: Rising Star (₦50k+)</p>
                  
                  <div className="space-y-2 text-left">
                     <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span>Progress</span>
                        <span className="text-gold">₦{earnings.approved.toLocaleString()} / ₦50,000</span>
                     </div>
                     <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gold transition-all duration-1000" style={{ width: `${Math.min((earnings.approved / 50000) * 100, 100)}%` }}></div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white p-10 rounded-[50px] border border-border shadow-soft flex items-center justify-center gap-6 group hover:translate-y-[-5px] transition-all cursor-pointer">
               <div className="w-16 h-16 bg-teal-light text-teal rounded-[28px] flex items-center justify-center text-3xl shadow-glow-teal group-hover:rotate-12 transition-transform">🏆</div>
               <div>
                  <h4 className="text-lg font-bold text-ink">Leaderboard</h4>
                  <p className="text-xs text-text-3 font-bold uppercase tracking-widest">You're #31 in Africa</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
