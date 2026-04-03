import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/dashboard/StatCard'
import { LayoutDashboard, Package, ShoppingCart, Users, Wallet, BarChart3 } from 'lucide-react'

export default async function ResellerDashboard() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl display text-ink">Reseller Hub</h1>
        <p className="text-text-3 font-medium">Empower your network and manage your stock.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard 
          label="Total Revenue" 
          value="₦0" 
          icon={<Wallet className="w-5 h-5" />} 
          variant="ink" 
        />
        <StatCard 
          label="Inventory" 
          value={0} 
          icon={<Package className="w-5 h-5" />} 
          variant="gold" 
        />
        <StatCard 
          label="Network Size" 
          value={0} 
          icon={<Users className="w-5 h-5" />} 
          variant="teal" 
        />
        <StatCard 
          label="Recent Clicks" 
          value={0} 
          icon={<BarChart3 className="w-5 h-5" />} 
          variant="ink" 
        />
        <StatCard 
          label="New Orders" 
          value={0} 
          icon={<ShoppingCart className="w-5 h-5" />} 
          variant="gold" 
        />
        <StatCard 
          label="Active Since" 
          value="Now" 
          icon={<LayoutDashboard className="w-5 h-5" />} 
          variant="teal" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-[40px] border border-border shadow-soft">
          <h3 className="text-xl display text-ink mb-6">Partner Updates</h3>
          <p className="text-sm text-text-3 font-bold uppercase tracking-widest py-10 text-center">No new updates</p>
        </div>
        <div className="bg-ink text-white p-8 rounded-[40px] border border-white/5 shadow-soft">
          <h3 className="text-xl display text-white mb-6">Recent Network Activity</h3>
          <p className="text-sm text-text-3 font-bold uppercase tracking-widest py-10 text-center">No recent activity</p>
        </div>
      </div>
    </div>
  )
}
