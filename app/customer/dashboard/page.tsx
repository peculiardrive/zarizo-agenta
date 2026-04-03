import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/dashboard/StatCard'
import { ShoppingCart, Package, Heart, Bell } from 'lucide-react'
import { Database } from '@/lib/supabase/types'

export default async function CustomerDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: ordersData } = await supabase
    .from('orders')
    .select('*, products(title)')
    .eq('customer_phone', user?.user_metadata?.phone || '') 
    .order('created_at', { ascending: false })
    .limit(5)

  const orders = (ordersData || []) as any[]

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl display text-ink">Welcome back!</h1>
        <p className="text-text-3 font-medium">Track your orders and manage your account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Orders" 
          value={orders?.length || 0} 
          icon={<ShoppingCart className="w-5 h-5" />} 
          variant="ink" 
        />
        <StatCard 
          label="Active Orders" 
          value={orders?.filter(o => o.order_status !== 'delivered' && o.order_status !== 'cancelled').length || 0} 
          icon={<Package className="w-5 h-5" />} 
          variant="gold" 
        />
        <StatCard 
          label="Unread Notifications" 
          value={0} 
          icon={<Bell className="w-5 h-5" />} 
          variant="teal" 
        />
        <StatCard 
          label="Saved Items" 
          value={0} 
          icon={<Heart className="w-5 h-5" />} 
          variant="ink" 
        />
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-border shadow-soft">
        <h3 className="text-xl display text-ink mb-6">Recent Orders</h3>
        <div className="overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-mist border-b border-border">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-text-3 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-text-3 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-text-3 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-text-3 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders?.map((order) => (
                <tr key={order.id} className="hover:bg-snow transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-ink">{order.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4 text-sm text-text-2 font-bold">{order.products?.title}</td>
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
              {(!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-text-3 font-bold uppercase tracking-widest">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
