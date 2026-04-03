import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/dashboard/StatCard'
import { Package, Plus, Search, MoreVertical, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default async function BusinessProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: businessData } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user?.id as string)
    .single()
  
  const business = businessData as any

  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', business?.id)
    .order('created_at', { ascending: false })

  const products = (productsData || []) as any[]

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between flex-wrap gap-6">
        <h1 className="text-4xl display text-ink">My Inventory</h1>
        <Link href="/business/products/add" className="btn-gold flex items-center gap-2 px-8 py-4 shadow-glow">
           <Plus className="w-5 h-5" />
           New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatCard label="Total Listed" value={products?.length || 0} icon={<Package className="w-5 h-5" />} variant="ink" />
         <StatCard label="Active Items" value={products?.filter(p => p.status === 'active').length || 0} icon={<Package className="w-5 h-5" />} variant="teal" />
         <StatCard label="Draft/Out of Stock" value={products?.filter(p => p.status !== 'active').length || 0} icon={<Package className="w-5 h-5" />} variant="gold" />
      </div>

      <div className="bg-white rounded-[40px] border border-border shadow-soft overflow-hidden">
         <div className="p-8 border-b border-border flex flex-col md:flex-row gap-6 items-center">
            <div className="relative w-full md:max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
               <input className="w-full bg-snow border-0 h-14 pl-12 pr-6 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold outline-none" placeholder="Search in your inventory..." />
            </div>
            <div className="flex items-center gap-2">
               <button className="h-14 px-6 bg-mist text-text-2 font-bold uppercase tracking-widest text-[10px] rounded-2xl border border-border hover:border-gold transition-all">Filter: All Categories</button>
               <button className="h-14 px-6 bg-mist text-text-2 font-bold uppercase tracking-widest text-[10px] rounded-2xl border border-border hover:border-gold transition-all">Sort: Recently Added</button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-snow border-b border-border">
                  <tr>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Product Details</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Price</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Commission</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Category</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest">Status</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-text-3 uppercase tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {products?.map((product) => (
                     <tr key={product.id} className="hover:bg-snow/50 transition-colors group">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-mist rounded-2xl flex items-center justify-center text-xl shadow-sm border border-border group-hover:scale-110 transition-transform overflow-hidden font-bold">
                                 {product.image_url ? <img src={product.image_url} alt="" className="w-full h-full object-cover" /> : '📦'}
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-sm font-bold text-ink mb-1 line-clamp-1">{product.title}</span>
                                 <span className="text-[10px] text-text-3 font-bold uppercase tracking-widest">Added {new Date(product.created_at).toLocaleDateString()}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-ink font-bold">₦{Number(product.price).toLocaleString()}</td>
                        <td className="px-8 py-6">
                           <span className="text-sm font-bold text-teal">
                              {product.commission_type === 'percent' ? `${product.commission_value}%` : `₦${product.commission_value}`}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-sm text-text-2 font-bold">{product.category}</td>
                        <td className="px-8 py-6">
                           <span className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${
                              product.status === 'active' ? 'bg-teal-light text-teal border-teal/20' : 'bg-mist text-text-3 border-border'
                           }`}>
                              {product.status}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex items-center justify-end gap-3 translate-x-2">
                              <button className="bg-mist text-text-2 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gold hover:text-ink transition-all border border-border group/btn">
                                 <Edit className="w-4 h-4" />
                              </button>
                              <button className="bg-danger/10 text-danger w-10 h-10 flex items-center justify-center rounded-xl hover:bg-danger hover:text-white transition-all border border-danger/10">
                                 <Trash2 className="w-4 h-4" />
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
