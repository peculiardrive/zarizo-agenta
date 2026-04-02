'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProductCard } from '@/components/products/ProductCard'
import { Input } from '@/components/ui/input'
import { Search, SlidersHorizontal } from 'lucide-react'

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  
  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
  }, [category, sortBy]) // Initial fetch and on filter/sort change

  // Debounced search effect
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
    
    if (search) {
      query = query.ilike('title', `%${search}%`)
    }
    
    if (category !== 'All') {
      query = query.eq('category', category)
    }

    if (sortBy === 'newest') query = query.order('created_at', { ascending: false })
    if (sortBy === 'price-low') query = query.order('price', { ascending: true })
    if (sortBy === 'price-high') query = query.order('price', { ascending: false })

    const { data } = await query
    setProducts(data || [])
    setLoading(false)
  }

  const categories = ['All', 'Beauty & Skincare', 'Fashion & Apparel', 'Organic Food', 'Haircare', 'Makeup']

  return (
    <div className="min-h-screen bg-snow pt-32 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header and Filters */}
        <div className="mb-16">
          <h1 className="text-5xl display text-ink mb-12 text-center md:text-left">Product Catalog</h1>
          
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-6 rounded-3xl border border-border shadow-soft">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-3" />
              <Input 
                placeholder="Search products..." 
                className="pl-12 h-14 rounded-2xl border-border bg-snow"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <SlidersHorizontal className="w-5 h-5 text-text-3 flex-shrink-0" />
              <span className="text-sm font-bold text-ink uppercase tracking-wider flex-shrink-0 mr-2">Filter</span>
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-6 py-3 rounded-full text-sm font-bold transition-all flex-shrink-0 whitespace-nowrap shadow-sm border ${
                      category === cat ? 'bg-gold text-ink border-gold' : 'bg-white text-text-2 border-border hover:border-gold'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <select 
                className="w-full md:w-48 h-14 bg-mist border-border rounded-2xl px-4 text-sm font-bold text-ink focus:ring-2 focus:ring-gold outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[4/6] bg-mist animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border border-border">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl text-ink font-bold mb-2">No products found</h2>
            <p className="text-text-2">Try adjusting your filters or search terms.</p>
            <button onClick={() => {setSearch(''); setCategory('All')}} className="mt-8 text-gold font-bold hover:underline">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  )
}
