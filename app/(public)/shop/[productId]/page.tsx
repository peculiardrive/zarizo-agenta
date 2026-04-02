'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/products/ProductCard'
import { Share2, Copy, Check, ChevronLeft, Minus, Plus } from 'lucide-react'
import { ReferralService } from '@/lib/services/ReferralService'

export default function ProductDetailPage() {
  const { productId } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [user, setUser] = useState<any>(null)
  const [agent, setAgent] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    fetchProduct()
    fetchUser()
  }, [productId])

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      const { data: agentData } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()
      if (agentData) setAgent(agentData)
    }
  }

  const fetchProduct = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*, businesses(*)')
      .eq('id', productId)
      .single()

    if (error || !data) {
      router.push('/shop')
      return
    }

    setProduct(data)
    
    // Fetch related products
    const { data: relatedData } = await supabase
      .from('products')
      .select('*, businesses(*)')
      .eq('category', data.category)
      .neq('id', data.id)
      .limit(4)
    
    setRelated(relatedData || [])
    setLoading(false)
  }

  const handleCopyLink = () => {
    if (agent) {
      const link = ReferralService.buildReferralLink(agent.referral_code, productId as string)
      navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) return <div className="min-h-screen bg-snow pt-40 text-center text-text-3">Loading Product...</div>

  const commissionText = product.commission_type === 'percent' 
    ? `${product.commission_value}%` 
    : `₦${product.commission_value.toLocaleString()}`

  return (
    <div className="min-h-screen bg-snow pt-32 pb-24 px-4 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-text-2 hover:text-gold font-bold mb-12 uppercase tracking-widest text-sm">
          <ChevronLeft className="w-5 h-5" />
          Back to Shop
        </button>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Gallery */}
          <div className="aspect-[4/5] bg-mist rounded-[40px] border border-border shadow-soft overflow-hidden flex items-center justify-center text-[10rem]">
            {product.image_url ? (
               <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
            ) : '📦'}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-2 bg-mist text-ink border border-border rounded-xl text-xs font-bold uppercase tracking-widest">
                {product.category}
              </span>
              <span className="px-4 py-2 bg-teal-light text-teal font-bold rounded-xl text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal"></span>
                In Stock
              </span>
            </div>

            <h1 className="text-5xl display text-ink mb-6">{product.title}</h1>
            
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-gold-light rounded-full flex items-center justify-center text-2xl">🏬</div>
               <div className="text-xl font-bold text-ink">
                  {product.businesses?.business_name}
               </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-border mt-4 mb-12">
               <div className="text-4xl font-bold text-ink mb-4">
                  ₦{Number(product.price).toLocaleString()}
               </div>
               <p className="text-text-2 leading-relaxed mb-8">
                  {product.description || "No description provided for this product."}
               </p>

               <div className="flex items-center gap-4 py-6 border-y border-border mb-8">
                  <span className="text-sm font-bold text-text-3 uppercase tracking-widest">Amount</span>
                  <div className="flex items-center bg-mist rounded-2xl p-2">
                     <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all">
                        <Minus className="w-4 h-4 text-ink" />
                     </button>
                     <span className="w-16 text-center text-2xl font-bold text-ink">{quantity}</span>
                     <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all">
                        <Plus className="w-4 h-4 text-ink" />
                     </button>
                  </div>
               </div>

               <div className="flex flex-col gap-4">
                  <Link href={`/shop/${product.id}/order?quantity=${quantity}`} className="w-full btn-teal py-5 text-xl">
                     Place Order
                  </Link>
                  <p className="text-center text-xs font-bold text-teal mt-2">
                     Agents earn <span className="underline">{commissionText}</span> per sale
                  </p>
               </div>
            </div>

            {/* Agent Link Box */}
            {agent && (
              <div className="bg-ink text-white p-8 rounded-3xl border border-white/10 mt-8 relative overflow-hidden group">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold rounded-full filter blur-[80px] opacity-20 pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                 <div className="relative z-10">
                    <h3 className="text-xl display mb-4 flex items-center gap-3">
                       <span className="text-gold">🔗</span> Your Referral Link
                    </h3>
                    <p className="text-text-3 text-sm mb-6">Share this link to earn commission on every sale. Tracking is automatic.</p>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-4 font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap text-gold-2">
                           {ReferralService.buildReferralLink(agent.referral_code, productId as string)}
                        </div>
                        <Button 
                           variant="outline" 
                           className="bg-gold text-ink border-gold hover:bg-gold-2 p-4 h-auto rounded-2xl" 
                           onClick={handleCopyLink}
                        >
                           {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </Button>
                        <Button variant="outline" className="bg-white/10 text-white border-white/20 p-4 h-auto rounded-2xl">
                           <Share2 className="w-5 h-5" />
                        </Button>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-32">
            <h2 className="text-3xl text-ink mb-12">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
