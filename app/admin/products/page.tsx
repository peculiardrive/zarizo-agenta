import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/dashboard/StatCard'
import { Package, Search, Filter, Check, X, Building2 } from 'lucide-react'
import { GovernorActions } from '@/components/admin/GovernorActions'

export default async function AdminProductsPage() {
  const supabase = createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select('*, businesses(business_name)')
    .order('created_at', { ascending: false })

  const pendingCount = products?.filter(p => p.status === 'pending').length || 0
  const activeCount = products?.filter(p => p.status === 'active').length || 0

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between flex-wrap gap-6">
        <h1 className="text-4xl display text-ink">Product Queue</h1>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-border shadow-soft transition-all hover:-translate-y-1">
           <div className="live-dot"></div>
           <span className="text-xs font-bold text-teal uppercase tracking-widest leading-none mt-0.5">Inventory Monitor</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <StatCard label="Catalog Size" value={products?.length || 0} icon={<Package className="w-5 h-5" />} variant="ink" />
         <StatCard label="Approve Queue" value={pendingCount} icon={<Package className="w-5 h-5" />} variant="gold" />
         <StatCard label="Live Products" value={activeCount} icon={<Package className="w-5 h-5" />} variant="teal" />
         <StatCard label="Monthly Growth" value="+24%" icon={<Package className="w-5 h-5" />} variant="teal" />
      </div>

      <div className="bg-white rounded-[40px] border border-border shadow-soft overflow-hidden">
         {/* Search/Filter Bar */}
         <div className="p-8 border-b border-border flex flex-col md:flex-row gap-6 items-center">
            <div className="relative w-full md:max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
               <input className="w-full bg-snow border-0 h-14 pl-12 pr-6 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold outline-none" placeholder="Search product queue..." />
            </div>
            <div className="flex items-center gap-2">
               <button className="h-14 px-6 bg-mist text-text-2 font-bold uppercase tracking-widest text-[10px] rounded-2xl border border-border hover:border-gold transition-all">All Vendors</button>
               <button className="h-14 px-6 bg-mist text-text-2 font-bold uppercase tracking-widest text-[10px] rounded-2xl border border-border hover:border-gold transition-all">Category: All</button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-snow border-b border-border">
                  <tr>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Product Details</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Business/Vendor</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Pricing</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Commission</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Status</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest text-right">Review</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {products?.map((product) => (
                     <tr key={product.id} className={`hover:bg-snow/50 transition-colors group ${product.status === 'pending' ? 'bg-gold-light/10 animate-pulse-subtle' : ''}`}>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-mist rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-border overflow-hidden">
                                 {product.image_url ? <img src={product.image_url} alt="" className="w-full h-full object-cover" /> : '📦'}
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-ink">{product.title}</p>
                                 <p className="text-[10px] text-text-3 font-bold uppercase tracking-widest mt-1">ID: {product.id.slice(0, 8)}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-ink font-bold">
                           <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-text-3" />
                              {product.businesses?.business_name}
                           </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-ink">₦{product.price.toLocaleString()}</td>
                        <td className="px-8 py-6">
                           <span className="text-sm font-bold text-teal">
                              {product.commission_type === 'percent' ? `${product.commission_value}%` : `₦${product.commission_value.toLocaleString()}`}
                           </span>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                              product.status === 'active' ? 'bg-teal-light text-teal border-teal/20' :
                              product.status === 'pending' ? 'bg-gold-light text-gold border-gold/10 shadow-glow' :
                              'bg-mist text-text-3 border-border'
                           }`}>
                              {product.status}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           {/* Using string literal for type since GovernorActions takes 'business' | 'agent' - I should update it to take 'product' too */}
                           <GovernorActions id={product.id} type="agent" status={product.status === 'active' ? 'active' : 'pending'} />
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
