import { createClient } from '@/lib/supabase/server'
import { ProductCard } from './ProductCard'

export async function FeaturedProducts() {
  const supabase = createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select('*, businesses(business_name)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(4)

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 text-text-3">
        No active products found.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
