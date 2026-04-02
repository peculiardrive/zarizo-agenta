import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/dashboard/StatCard'
import { Building2, Plus, Search, Filter, MoreVertical } from 'lucide-react'

export default async function AdminBusinessesPage() {
  const supabase = createClient()
  
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*, users(full_name), products(count)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between flex-wrap gap-6">
        <h1 className="text-4xl display text-ink">Businesses</h1>
        <button className="btn-gold flex items-center gap-2 px-8 py-4">
           <Plus className="w-5 h-5" />
           Add Business
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatCard label="Total Businesses" value={businesses?.length || 0} icon={<Building2 className="w-5 h-5" />} variant="ink" />
         <StatCard label="Pending Approval" value={businesses?.filter(b => b.status === 'pending').length || 0} icon={<Search className="w-5 h-5" />} variant="gold" />
         <StatCard label="Active" value={businesses?.filter(b => b.status === 'active').length || 0} icon={<Building2 className="w-5 h-5" />} variant="teal" />
      </div>

      <div className="bg-white rounded-[40px] border border-border shadow-soft overflow-hidden">
         {/* Search/Filter Bar */}
         <div className="p-8 border-b border-border flex flex-col md:flex-row gap-6 items-center">
            <div className="relative w-full md:max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
               <input className="w-full bg-snow border-0 h-14 pl-12 pr-6 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold outline-none" placeholder="Search businesses..." />
            </div>
            <div className="flex items-center gap-2">
               <button className="h-14 px-6 bg-mist text-text-2 font-bold uppercase tracking-widest text-[10px] rounded-2xl border border-border hover:border-gold transition-all">Filter: All Status</button>
               <button className="h-14 px-6 bg-mist text-text-2 font-bold uppercase tracking-widest text-[10px] rounded-2xl border border-border hover:border-gold transition-all">Sort: Newest First</button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-snow border-b border-border">
                  <tr>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Business Name</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Owner</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Contact</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Products</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Revenue</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Status</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {businesses?.map((biz) => (
                     <tr key={biz.id} className="hover:bg-snow/50 transition-colors group">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-mist rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">🏬</div>
                              <span className="text-sm font-bold text-ink">{biz.business_name}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-text-2 font-bold">{biz.owner_name}</td>
                        <td className="px-8 py-6">
                           <p className="text-sm text-ink font-bold">{biz.email}</p>
                           <p className="text-xs text-text-3 mt-1 underline decoration-gold/30">{biz.phone}</p>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-sm font-bold text-ink">{biz.products?.[0]?.count || 0}</span>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-ink">₦0.00</td>
                        <td className="px-8 py-6">
                           <span className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                              biz.status === 'active' ? 'bg-teal-light text-teal border-teal/20 shadow-glow-teal' :
                              biz.status === 'pending' ? 'bg-gold-light text-gold border-gold/10 shadow-glow' :
                              'bg-mist text-text-3 border-border'
                           }`}>
                              {biz.status}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex items-center justify-end gap-2">
                              {biz.status === 'pending' && <button className="bg-teal text-white w-9 h-9 flex items-center justify-center rounded-xl hover:scale-110 transition-all shadow-glow-teal">✓</button>}
                              <button className="bg-mist text-text-2 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gold transition-all">
                                 <MoreVertical className="w-4 h-4" />
                              </button>
                           </div>
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
