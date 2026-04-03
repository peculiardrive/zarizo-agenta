import { createClient } from '@/lib/supabase/server'
import { ReportService } from '@/lib/services/ReportService'
import { TrendingUp, ShoppingBag, Users, Zap } from 'lucide-react'

export default async function BusinessReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: businessData } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user?.id as string)
    .single()

  const business = businessData as any
  const performance = await ReportService.getBusinessPerformance(business?.id)

  return (
    <div className="space-y-12">
      <h1 className="text-4xl display text-ink">Store Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         <div className="bg-white p-10 rounded-[40px] border border-border shadow-soft h-full flex flex-col">
            <h3 className="text-xl display text-ink mb-10 flex items-center gap-3">
               <TrendingUp className="text-gold" /> Sales Funnel
            </h3>
            
            <div className="space-y-8 flex-1 flex flex-col justify-center pb-10">
               {[
                 { label: 'Total Revenue', value: `₦${performance.revenue.toLocaleString()}`, color: 'bg-teal' },
                 { label: 'Total Orders', value: performance.orders.toString(), color: 'bg-gold' },
                 { label: 'Sales via Agents', value: `${performance.agents > 0 ? (performance.orders > 0 ? Math.round((performance.orders/performance.orders)*100) : 0) : 0}%`, color: 'bg-ink' }
               ].map((item, i) => (
                  <div key={i}>
                     <div className="flex justify-between items-end mb-3">
                        <p className="text-xs font-bold text-text-3 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                        <h4 className="text-3xl font-bold text-ink leading-none">{item.value}</h4>
                     </div>
                     <div className="w-full h-3 bg-mist rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: '100%' }}></div>
                     </div>
                  </div>
               ))}
               {!performance.orders && <p className="text-center py-20 text-text-3 font-bold uppercase tracking-widest text-xs">No active data yet.</p>}
            </div>
         </div>

         <div className="bg-white p-10 rounded-[40px] border border-border shadow-soft h-full flex flex-col">
            <h3 className="text-xl display text-ink mb-10 flex items-center gap-3">
               <ShoppingBag className="text-teal" /> Best Selling Products
            </h3>
            <div className="flex-1 space-y-6">
               {performance.topProducts.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-mist rounded-2xl border border-transparent hover:border-gold transition-all group">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xs font-bold text-text-3 border border-border group-hover:bg-gold group-hover:text-ink transition-all">#{i+1}</div>
                        <p className="text-sm font-bold text-ink truncate line-clamp-1 max-w-[150px]">{p.title}</p>
                     </div>
                     <div className="flex items-center gap-3">
                        <p className="text-sm font-bold text-ink">{p.count} sales</p>
                        <div className="w-2 h-2 rounded-full bg-teal"></div>
                     </div>
                  </div>
               ))}
               {!performance.topProducts.length && <p className="text-center py-20 text-text-3 font-bold uppercase tracking-widest text-xs">No products sold yet.</p>}
            </div>
         </div>
      </div>

      <div className="bg-ink text-white p-12 rounded-[50px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-full bg-teal rounded-full filter blur-[150px] opacity-10 pointer-events-none transition-all group-hover:scale-150 duration-700"></div>
         <div>
            <h3 className="text-3xl display mb-4 flex items-center gap-3">
               <Zap className="text-gold" /> Performance Summary
            </h3>
            <p className="text-text-3 text-lg">Generate a detailed report of all sales, commissions, and agent activities for your business dashboard.</p>
         </div>
         <button className="bg-gold text-ink font-bold px-12 py-6 rounded-full text-xl hover:bg-gold-2 transition-all shadow-glow whitespace-nowrap z-10">
            Export Store Report
         </button>
      </div>
    </div>
  )
}
