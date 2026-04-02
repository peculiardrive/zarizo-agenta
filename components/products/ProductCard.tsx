'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function ProductCard({ product, isAgent = false }: { product: any, isAgent?: boolean }) {
  const commissionText = product.commission_type === 'percent' 
    ? `${product.commission_value}%` 
    : `₦${product.commission_value.toLocaleString()}`

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="group bg-white rounded-3xl border border-border overflow-hidden hover:shadow-glow transition-all duration-300"
    >
      <Link href={`/shop/${product.id}`} className="block aspect-[4/5] relative bg-mist overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl bg-gray-50 border-b border-border">
            📦
          </div>
        )}
        <div className="absolute top-4 right-4 badge-teal shadow-xl border border-teal/20">
          Earn {commissionText}
        </div>
      </Link>

      <div className="p-6">
        <div className="text-xs uppercase tracking-widest text-text-3 font-bold mb-2">
          {product.businesses?.business_name || 'Generic Business'}
        </div>
        <h3 className="text-xl text-ink font-bold mb-4 line-clamp-1">{product.title}</h3>
        
        <div className="flex items-center justify-between mb-8">
           <div className="text-2xl font-bold text-ink">
              ₦{Number(product.price).toLocaleString()}
           </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
           <Link href={`/shop/${product.id}`} className="btn-gold py-3 text-sm flex items-center justify-center font-bold">
              View
           </Link>
           <Link href={`/shop/${product.id}/order`} className="btn-teal py-3 text-sm flex items-center justify-center font-bold">
              Order
           </Link>
        </div>
      </div>
    </motion.div>
  )
}
