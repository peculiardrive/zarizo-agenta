'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Package, Plus, Save, Image as ImageIcon, ChevronLeft, Zap } from 'lucide-react'

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Beauty & Skincare',
    commission_type: 'percent' as 'percent' | 'fixed',
    commission_value: '',
    stock_status: 'in_stock'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user?.id)
      .single()

    if (!business) {
      setError("No business found for this account.")
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase
      .from('products')
      .insert({
        business_id: business.id,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        commission_type: formData.commission_type,
        commission_value: Number(formData.commission_value),
        status: 'active'
      })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
    } else {
      router.push('/business/products')
    }
  }

  const categories = ['Beauty & Skincare', 'Fashion & Apparel', 'Organic Food', 'Haircare', 'Makeup']

  return (
    <div className="space-y-12 pb-20">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-text-3 font-bold hover:text-gold uppercase tracking-widest text-xs group">
         <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
         Back to Inventory
      </button>

      <div className="flex items-center justify-between">
         <h1 className="text-4xl display text-ink">New Listing</h1>
         <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-border shadow-soft">
            <Zap className="w-5 h-5 text-gold" />
            <span className="text-xs font-bold text-ink uppercase tracking-widest leading-none mt-0.5">Instant Activation</span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Form Section */}
         <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white p-12 rounded-[50px] border border-border shadow-soft space-y-10 group">
               <div className="space-y-8">
                  <div className="space-y-2">
                     <Label className="uppercase tracking-widest text-[10px] font-bold text-text-3">Product Title</Label>
                     <Input 
                        placeholder="e.g. Organic Face Serum" 
                        className="h-16 rounded-2xl bg-mist border-0 font-bold"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="uppercase tracking-widest text-[10px] font-bold text-text-3">Base Price (₦)</Label>
                        <Input 
                           type="number" 
                           placeholder="0.00" 
                           className="h-16 rounded-2xl bg-mist border-0 font-bold"
                           value={formData.price}
                           onChange={(e) => setFormData({...formData, price: e.target.value})}
                           required
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="uppercase tracking-widest text-[10px] font-bold text-text-3">Category</Label>
                        <select 
                           className="w-full h-16 rounded-2xl bg-mist border-0 px-4 text-sm font-bold focus:ring-2 focus:ring-gold outline-none"
                           value={formData.category}
                           onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                           {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label className="uppercase tracking-widest text-[10px] font-bold text-text-3">Commission offered to Agents</Label>
                     <div className="flex gap-4 p-2 bg-snow rounded-[28px] border border-border">
                        <button 
                           type="button" 
                           onClick={() => setFormData({...formData, commission_type: 'percent'})}
                           className={`flex-1 py-4 rounded-[22px] font-bold text-sm transition-all ${formData.commission_type === 'percent' ? 'bg-gold text-ink shadow-soft' : 'text-text-3 hover:text-ink'}`}
                        >
                           Percentage (%)
                        </button>
                        <button 
                           type="button" 
                           onClick={() => setFormData({...formData, commission_type: 'fixed'})}
                           className={`flex-1 py-4 rounded-[22px] font-bold text-sm transition-all ${formData.commission_type === 'fixed' ? 'bg-teal text-white shadow-soft' : 'text-text-3 hover:text-ink'}`}
                        >
                           Fixed Amount (₦)
                        </button>
                     </div>
                     <div className="mt-4">
                        <Input 
                           type="number" 
                           placeholder={formData.commission_type === 'percent' ? 'e.g. 15' : 'e.g. 2500'} 
                           className="h-16 rounded-2xl bg-mist border-0 font-bold"
                           value={formData.commission_value}
                           onChange={(e) => setFormData({...formData, commission_value: e.target.value})}
                           required
                        />
                        <p className="text-[10px] font-bold text-teal uppercase tracking-widest mt-2 ml-4">High commissions attract more agents!</p>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label className="uppercase tracking-widest text-[10px] font-bold text-text-3">Detailed Description</Label>
                     <textarea 
                        className="w-full h-40 rounded-[30px] bg-mist border-0 p-6 text-sm font-bold focus:ring-2 focus:ring-gold outline-none resize-none"
                        placeholder="Tell agents and customers about this product..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        required
                     />
                  </div>
               </div>

               {error && <p className="text-danger text-sm font-bold">{error}</p>}

               <div className="pt-10 border-t border-border flex items-center gap-4">
                  <Button type="submit" disabled={loading} className="btn-gold px-12 py-6 text-xl flex items-center gap-3 shadow-glow transition-all active:scale-95">
                     <Plus className="w-5 h-5" />
                     {loading ? 'Adding...' : 'Launch Product'}
                  </Button>
               </div>
            </form>
         </div>

         {/* Visual Preview */}
         <div className="space-y-8">
            <h3 className="text-xl display text-ink">Image Upload</h3>
            <div className="bg-white p-10 rounded-[50px] border border-border shadow-soft aspect-square flex flex-col items-center justify-center text-center cursor-pointer hover:border-gold transition-all group">
               <div className="w-24 h-24 bg-mist rounded-[35px] flex items-center justify-center text-4xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all">📸</div>
               <p className="text-lg font-bold text-ink mb-1">Click to upload</p>
               <p className="text-xs text-text-3 font-bold uppercase tracking-widest">PNG, JPG up to 5MB</p>
               <input type="file" className="hidden" accept="image/*" />
            </div>

            <div className="bg-ink text-white p-8 rounded-[40px] border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-full bg-gold rounded-full filter blur-[80px] opacity-10 pointer-events-none"></div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-text-3 mb-6">Listing Tips</h4>
                <ul className="space-y-4">
                   {[
                     'Use clear, high-quality images',
                     'Be detailed in your description',
                     'Competitive pricing helps',
                     'Commission should be at least 10%'
                   ].map((tip, i) => (
                      <li key={i} className="flex gap-3 text-xs font-bold leading-relaxed">
                         <span className="text-gold">✦</span> {tip}
                      </li>
                   ))}
                </ul>
            </div>
         </div>
      </div>
    </div>
  )
}
