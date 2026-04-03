import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/dashboard/StatCard'
import { ShoppingCart, Package, Users, TrendingUp, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function BusinessDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: businessData } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user?.id as string)
    .single()

  const business: any = businessData
  const bizId = business?.id

  // Stats
  const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('business_id', bizId)
  const { data: revenueData } = await supabase.from('orders').select('total_amount').eq('business_id', bizId).eq('payment_status', 'paid')
  const totalRevenue = (revenueData as any[])?.reduce((acc, o) => acc + Number(o.total_amount), 0) || 0
  const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('business_id', bizId)

  const { data: orderData } = await supabase
    .from('orders')
    .select('*, products(title), agents(users(full_name))')
    .eq('business_id', bizId)
    .order('created_at', { ascending: false })
    .limit(5)

  const recentOrders = (orderData || []) as any[]

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl display text-ink">Business Dashboard</h1>
        <div className="flex items-center gap-4">
           <Link href="/business/products/add" className="btn-gold flex items-center gap-2 px-8 py-4 shadow-glow">
              <Plus className="w-5 h-5" />
              Add Product
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
         <StatCard label="Total Orders" value={totalOrders || 0} icon={<ShoppingCart className="w-5 h-5" />} variant="ink" />
         <StatCard label="Revenue" value={`₦${totalRevenue.toLocaleString()}`} icon={<TrendingUp className="w-5 h-5" />} variant="teal" />
         <StatCard label="Products" value={productsCount || 0} icon={<Package className="w-5 h-5" />} variant="ink" />
         <StatCard label="Agents" value={2} icon={<Users className="w-5 h-5" />} variant="gold" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl display text-ink mb-6">Recent Store Orders</h3>
            <div className="bg-white rounded-[40px] border border-border shadow-soft overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-snow border-b border-border">
                     <tr>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">ID</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Product</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Customer</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {recentOrders?.map((order) => (
                        <tr key={order.id} className="hover:bg-snow/50 transition-colors group">
                           <td className="px-8 py-6 text-sm font-bold text-ink">{order.id}</td>
                           <td className="px-8 py-6 text-sm text-text-2 font-bold">{order.products?.title}</td>
                           <td className="px-8 py-6">
                              <p className="text-sm text-ink font-bold">{order.customer_name}</p>
                              <p className="text-xs text-text-3 font-mono mt-1 underline decoration-gold/30">{order.customer_phone}</p>
                           </td>
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
                     {!recentOrders?.length && <tr><td colSpan={4} className="p-20 text-center text-text-3 font-bold uppercase tracking-widest">No orders yet. Start listing products!</td></tr>}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="space-y-6">
            <h3 className="text-xl display text-ink mb-6">Store Health</h3>
            <div className="bg-ink text-white p-10 rounded-[50px] border border-white/5 shadow-2xl relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal rounded-full filter blur-[100px] opacity-20 group-hover:scale-150 transition-all duration-700"></div>
               <div className="relative z-10 space-y-10">
                  <div className="flex items-center justify-between">
                     <p className="text-xs font-bold text-text-3 uppercase tracking-widest">Pending Fulfillment</p>
                     <span className="text-3xl font-bold">{totalOrders || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <p className="text-xs font-bold text-text-3 uppercase tracking-widest">Agent Commission Due</p>
                     <span className="text-3xl font-bold text-gold">₦0</span>
                  </div>
                  <div className="pt-6 border-t border-white/10 space-y-4">
                     <p className="text-[10px] font-bold text-text-3 uppercase tracking-widest">Growth Plan: Zarizo Scale</p>
                     <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-1/3 h-full bg-gold"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
