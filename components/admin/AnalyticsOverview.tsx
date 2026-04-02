import React from 'react'
import { TrendingUp, MousePointer2, ShoppingCart, Wallet, RefreshCcw, Users } from 'lucide-react'

interface AnalyticsCardProps {
  label: string
  value: string | number
  change: string
  isPositive: boolean
  icon: React.ReactNode
  chartColor: string
}

function AnalyticsCard({ label, value, change, isPositive, icon, chartColor }: AnalyticsCardProps) {
  return (
    <div className="bg-white p-8 rounded-[40px] border border-border shadow-soft group hover:translate-y-[-5px] transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${chartColor}`}>
          {icon}
        </div>
        <div className={`text-xs font-bold px-3 py-1 rounded-full ${isPositive ? 'bg-teal-light text-teal' : 'bg-danger/10 text-danger'}`}>
          {isPositive ? '+' : ''}{change}%
        </div>
      </div>
      <p className="text-text-3 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-3xl font-black text-ink tracking-tight mb-6">{value}</h3>
      
      {/* Mock Sparkline */}
      <div className="flex items-end gap-1 h-8">
        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-t-sm transition-all duration-500 group-hover:opacity-100 opacity-40 ${i === 3 ? 'h-[100%] bg-gold' : `h-[${h}%] bg-gray-200`}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export function AnalyticsOverview({ data }: { data: any }) {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl display text-ink">Startup Metrics</h2>
        <div className="flex gap-2">
           <span className="px-4 py-1.5 rounded-full bg-mist text-text-2 text-xs font-bold border border-border">Last 30 Days</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <AnalyticsCard 
          label="Conversion" 
          value={`${data.conversionRate}%`} 
          change="2.4" 
          isPositive={true}
          icon={<TrendingUp className="w-6 h-6" />}
          chartColor="bg-blue-50 text-blue-500"
        />
        <AnalyticsCard 
          label="Total Clicks" 
          value={data.totalClicks.toLocaleString()} 
          change="12" 
          isPositive={true}
          icon={<MousePointer2 className="w-6 h-6" />}
          chartColor="bg-violet-50 text-violet-500"
        />
        <AnalyticsCard 
          label="Total Orders" 
          value={data.totalOrders} 
          change="8" 
          isPositive={true}
          icon={<ShoppingCart className="w-6 h-6" />}
          chartColor="bg-gold-light text-gold"
        />
        <AnalyticsCard 
          label="Total Revenue" 
          value={`₦${(data.totalRevenue / 1000).toFixed(1)}k`} 
          change="15" 
          isPositive={true}
          icon={<Wallet className="w-6 h-6" />}
          chartColor="bg-teal-light text-teal"
        />
        <AnalyticsCard 
          label="Avg. Order" 
          value={`₦${(data.totalRevenue / (data.totalOrders || 1)).toFixed(0)}`} 
          change="3" 
          isPositive={false}
          icon={<RefreshCcw className="w-6 h-6" />}
          chartColor="bg-mist text-text-2"
        />
        <AnalyticsCard 
          label="New Agents" 
          value={data.activeAgents} 
          change="5" 
          isPositive={true}
          icon={<Users className="w-6 h-6" />}
          chartColor="bg-blue-50 text-blue-500"
        />
      </div>
    </div>
  )
}
