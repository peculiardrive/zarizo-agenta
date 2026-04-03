import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/products/ProductCard'

const FALLBACK_PRODUCTS = [
  {
    id: 'seed-1',
    title: 'Aura Bloom Anti-Aging Serum',
    price: 12500,
    commission_type: 'percent',
    commission_value: 15,
    image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    description: 'A premium organic serum for radiant skin.',
    businesses: { business_name: 'Aura Cosmetics' }
  },
  {
    id: 'seed-2',
    title: 'SmartHome Pro Hub V2',
    price: 45000,
    commission_type: 'fixed',
    commission_value: 5000,
    image_url: 'https://images.unsplash.com/photo-1558002038-103792e07a70?auto=format&fit=crop&q=80&w=800',
    description: 'Control your entire home with one simple device.',
    businesses: { business_name: 'TechNode Africa' }
  },
  {
    id: 'seed-3',
    title: 'Zarizo Digital Growth Kit',
    price: 7500,
    commission_type: 'percent',
    commission_value: 20,
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    description: 'Everything you need to scale your online brand.',
    businesses: { business_name: 'Zarizo Labs' }
  },
  {
    id: 'seed-4',
    title: 'Heritage Leather Weekender',
    price: 32000,
    commission_type: 'percent',
    commission_value: 10,
    image_url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800',
    description: 'Handcrafted leather travel bag for the modern explorer.',
    businesses: { business_name: 'Oluwa Crafts' }
  }
]

export async function FeaturedProducts() {
  const supabase = await createClient()
  
  let products: any[] = []
  try {
    const { data } = await supabase
      .from('products')
      .select('*, businesses(business_name)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(4)
    
    if (data && data.length > 0) {
      products = data
    } else {
      products = FALLBACK_PRODUCTS
    }
  } catch (err) {
    products = FALLBACK_PRODUCTS
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
