'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProductCard } from '@/components/products/ProductCard'
import { Input } from '@/components/ui/input'
import { Search, SlidersHorizontal, Share2, Zap } from 'lucide-react'

export default function AgentProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  
  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
  }, [category])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const fetchProducts = async () => {
    setLoading(true)
    let query = supabase
      .from('products')
      .select('*, businesses(business_name)')
      .eq('status', 'active')
    
    if (search) query = query.ilike('title', `%${search}%`)
    if (category !== 'All') query = query.eq('category', category)

    const { data } = await query
    setProducts(data || [])
    setLoading(false)
  }

  const categories = ['All', 'Beauty & Skincare', 'Fashion & Apparel', 'Organic Food', 'Haircare', 'Makeup']

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl display text-ink">Browse & Share</h1>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-border shadow-soft">
           <Zap className="w-5 h-5 text-gold" />
           <span className="text-xs font-bold text-ink uppercase tracking-widest leading-none mt-0.5">Top Sellers Included</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-8 rounded-[40px] border border-border shadow-soft">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-3" />
          <Input 
            placeholder="Search for best selling products..." 
            className="pl-14 h-16 rounded-[22px] border-border bg-snow text-sm font-bold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <SlidersHorizontal className="w-5 h-5 text-text-3 flex-shrink-0" />
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-8 py-4 rounded-full text-xs font-bold transition-all flex-shrink-0 whitespace-nowrap shadow-sm border ${
                  category === cat ? 'bg-gold text-ink border-gold' : 'bg-white text-text-2 border-border hover:border-gold'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-[4/6] bg-mist animate-pulse rounded-[40px]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} isAgent={true} />
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="py-40 text-center bg-white rounded-[50px] border border-border">
          <h2 className="text-3xl display text-ink mb-2">No products match</h2>
          <p className="text-text-2">Try different categories or clear your search terms.</p>
        </div>
      )}
    </div>
  )
}
