import { ReportService } from '@/lib/services/ReportService'
import { Card } from '@/components/ui/card'
import { BarChart3, TrendingUp, Users, ShoppingBag } from 'lucide-react'

export default async function AdminReportsPage() {
  const summary = await ReportService.getPlatformSummary()

  return (
    <div className="space-y-12">
      <h1 className="text-4xl display text-ink">Analytical Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         <div className="bg-white p-10 rounded-[40px] border border-border shadow-soft">
            <h3 className="text-xl display text-ink mb-10 flex items-center gap-3">
               <TrendingUp className="text-gold" /> Performance Ratios
            </h3>
            
            <div className="space-y-8">
               {[
                 { label: 'Order Conversion', value: '18.4%', sub: '+2.1% from last month', color: 'bg-gold' },
                 { label: 'Agent Retention', value: '92.0%', sub: 'Stable', color: 'bg-teal' },
                 { label: 'Avg Sale Value', value: '₦14,200', sub: '+₦1,200 from last month', color: 'bg-ink' }
               ].map((item, i) => (
                  <div key={i}>
                     <div className="flex justify-between items-end mb-3">
                        <div>
                           <p className="text-xs font-bold text-text-3 uppercase tracking-widest mb-1">{item.label}</p>
                           <h4 className="text-3xl font-bold text-ink">{item.value}</h4>
                        </div>
                        <span className="text-[10px] font-bold text-teal uppercase tracking-widest">{item.sub}</span>
                     </div>
                     <div className="w-full h-3 bg-mist rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: item.value.includes('%') ? item.value : '70%' }}></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-white p-10 rounded-[40px] border border-border shadow-soft h-full flex flex-col">
            <h3 className="text-xl display text-ink mb-10 flex items-center gap-3">
               <Users className="text-teal" /> Agent Leaderboard
            </h3>
            <div className="flex-1 space-y-6">
               {[
                 { name: 'Afolabi Gbolahan', code: 'AF831', earned: '₦432,000' },
                 { name: 'Chioma Ngige', code: 'CH120', earned: '₦215,500' },
                 { name: 'Musa Bello', code: 'MU442', earned: '₦188,200' },
                 { name: 'Sandra Idoko', code: 'SA901', earned: '₦95,000' }
               ].map((agent, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-mist rounded-2xl border border-transparent hover:border-gold transition-all group">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xs font-bold text-text-3 border border-border group-hover:bg-gold group-hover:text-ink transition-all">#{i+1}</div>
                        <div>
                           <p className="text-sm font-bold text-ink">{agent.name}</p>
                           <p className="text-[10px] font-bold text-gold uppercase tracking-widest">{agent.code}</p>
                        </div>
                     </div>
                     <p className="text-sm font-bold text-ink">{agent.earned}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>

      <div className="bg-ink text-white p-12 rounded-[50px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-12">
         <div>
            <h3 className="text-3xl display mb-4">Export Global Report</h3>
            <p className="text-text-3 text-lg">Generate a detailed Excel file containing all activities, commissions, and revenue for the current fiscal period.</p>
         </div>
         <button className="bg-gold text-ink font-bold px-12 py-6 rounded-full text-xl hover:bg-gold-2 transition-all shadow-glow whitespace-nowrap">
            Download Detailed .XLSX
         </button>
      </div>
    </div>
  )
}
