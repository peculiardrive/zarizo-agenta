'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OrderService } from '@/lib/services/OrderService'
import { ReferralService } from '@/lib/services/ReferralService'

export default function PlaceOrderPage() {
  const { productId } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const refCode = searchParams.get('ref')
  const initialQty = Number(searchParams.get('quantity')) || 1

  const [product, setProduct] = useState<any>(null)
  const [agent, setAgent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    quantity: initialQty
  })

  const supabase = createClient()

  useEffect(() => {
    fetchProductAndAgent()
  }, [productId, refCode])

  const fetchProductAndAgent = async () => {
    setLoading(true)
    const { data: p } = await supabase
      .from('products')
      .select('*, businesses(*)')
      .eq('id', productId as string)
      .single()
    
    if (p) setProduct(p)

    if (refCode) {
      const agentData = await ReferralService.resolveAgent(refCode)
      if (agentData) setAgent(agentData)
    }
    setLoading(false)
  }

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: `${formData.customerPhone}@zarizo.com`,
        amount: totalAmount * 100, // Kobo
        currency: "NGN",
        callback: async (response: any) => {
          const { order }: any = await OrderService.createOrder({
            productId: productId as string,
            agentId: agent?.id,
            customerName: formData.customerName,
            customerPhone: formData.customerPhone,
            customerAddress: formData.customerAddress,
            quantity: formData.quantity,
            paymentStatus: 'paid' as any,
            paymentReference: response.reference
          })
          
          setSuccess(order.id)
          setTimeout(() => router.push('/shop'), 6000)
        },
        onClose: () => {
          setSubmitting(false)
        }
      });
      handler.openIframe();
    } catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-snow pt-40 text-center text-text-3 font-bold">Loading Checkout...</div>

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-snow p-4">
        <div className="max-w-md w-full bg-white p-12 rounded-[40px] border border-border shadow-soft text-center">
          <div className="w-24 h-24 bg-teal-light text-teal rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-glow-teal animate-bounce">
            🛍️
          </div>
          <h1 className="text-3xl display text-ink mb-4">Order Received!</h1>
          <p className="text-text-2 mb-2 font-bold uppercase tracking-widest text-xs">Order ID: <span className="text-ink">{success}</span></p>
          <p className="text-text-2 mb-8 mt-4 leading-relaxed">
             Order confirmed and payment received. Delivery tracking is available in your dashboard.
          </p>
          {agent && (
             <div className="bg-gold-light p-4 rounded-2xl mb-8 border border-gold/20 flex items-center gap-3 justify-center">
                <span className="text-xl">🏆</span>
                <p className="text-sm font-bold text-ink">Agent <span className="text-gold">{agent.users.full_name}</span> has been credited with the commission.</p>
             </div>
          )}
          <Link href="/shop" className="btn-gold block w-full py-4 uppercase tracking-widest text-sm font-bold">Back to Store (5s)</Link>
        </div>
      </div>
    )
  }

  const totalAmount = (product?.price || 0) * formData.quantity

  return (
    <>
      <script src="https://js.paystack.co/v1/inline.js" async={true} />
      <div className="min-h-screen bg-snow pt-32 pb-24 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16">
          <div className="flex-1">
            <h1 className="text-5xl display text-ink mb-4">Checkout</h1>
            <p className="text-text-2 text-lg mb-12">Complete your order details below. Payments are handled securely via Paystack.</p>

            <form onSubmit={handleOrder} className="space-y-8 bg-white p-10 rounded-[40px] border border-border shadow-soft relative overflow-hidden">
               
               {agent && (
                  <div className="bg-ink text-white p-4 -mx-10 -mt-10 mb-10 flex items-center gap-3 justify-center border-b border-white/5">
                     <div className="live-dot"></div>
                     <p className="text-xs font-bold uppercase tracking-widest">Referred by Agent: <span className="text-gold">{agent.users.full_name}</span></p>
                  </div>
               )}

              <div className="space-y-4">
                 <div>
                    <Label htmlFor="customerName" className="uppercase tracking-widest text-xs font-bold text-text-3">Full Name</Label>
                    <Input 
                      id="customerName" 
                      className="h-14 rounded-2xl bg-mist border-0 mt-2"
                      placeholder="Enter your full name"
                      value={formData.customerName}
                      onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                      required 
                    />
                 </div>
                 
                 <div>
                    <Label htmlFor="customerPhone" className="uppercase tracking-widest text-xs font-bold text-text-3">Phone Number</Label>
                    <Input 
                      id="customerPhone" 
                      className="h-14 rounded-2xl bg-mist border-0 mt-2"
                      placeholder="WhatsApp/Phone number"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                      required 
                    />
                 </div>

                 <div>
                    <Label htmlFor="customerAddress" className="uppercase tracking-widest text-xs font-bold text-text-3">Delivery Address</Label>
                    <textarea 
                      id="customerAddress"
                      className="w-full h-32 rounded-2xl bg-mist border-0 mt-2 p-4 text-sm resize-none focus:ring-2 focus:ring-gold outline-none font-bold"
                      placeholder="Complete address for delivery"
                      value={formData.customerAddress}
                      onChange={(e) => setFormData({...formData, customerAddress: e.target.value})}
                      required 
                    />
                 </div>
              </div>

              <Button type="submit" disabled={submitting} className="w-full btn-teal py-6 text-xl">
                 {submitting ? 'Processing...' : `Pay & Place Order (₦${totalAmount.toLocaleString()})`}
              </Button>
              <p className="text-center text-xs text-text-3 font-bold uppercase tracking-widest leading-loose">
                 Payments secured by Paystack. <br />Instant commission attribution for agents.
              </p>
            </form>
          </div>

          <div className="md:w-96">
             <div className="bg-white p-8 rounded-[40px] border border-border shadow-soft sticky top-32">
                <h2 className="text-xl display mb-8 text-ink">Order Summary</h2>
                
                <div className="flex gap-4 mb-8">
                   <div className="w-20 h-20 bg-mist rounded-2xl flex items-center justify-center text-3xl overflow-hidden">
                      {product?.image_url ? <img src={product.image_url} alt="" className="w-full h-full object-cover" /> : '📦'}
                   </div>
                   <div>
                      <h3 className="font-bold text-ink line-clamp-1">{product?.title}</h3>
                      <p className="text-xs text-text-3 uppercase tracking-widest mt-1 font-bold">Vendor: {product?.businesses?.business_name}</p>
                   </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-border mt-8">
                   <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-text-3 uppercase tracking-widest">Price</span>
                      <span className="text-ink">₦{Number(product?.price || 0).toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-text-3 uppercase tracking-widest">Quantity</span>
                      <span className="text-ink">x{formData.quantity}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-text-3 uppercase tracking-widest">Delivery</span>
                      <span className="text-teal uppercase tracking-widest">Calculated Later</span>
                   </div>
                </div>

                <div className="pt-8 border-t border-border mt-8 flex justify-between items-end">
                   <div>
                      <span className="text-xs font-bold text-text-3 uppercase tracking-widest block mb-1">Total Payable</span>
                      <span className="text-3xl font-bold text-ink leading-none">₦{totalAmount.toLocaleString()}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </>
  )
}
