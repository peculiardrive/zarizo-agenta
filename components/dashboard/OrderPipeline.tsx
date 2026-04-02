'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRealtimeOrders } from '@/lib/hooks/useRealtimeOrders'
import { Package, User, Wallet } from 'lucide-react'

const columns = [
  { id: 'pending', label: 'Pending', color: 'bg-gold' },
  { id: 'confirmed', label: 'Confirmed', color: 'bg-teal-light text-teal' },
  { id: 'processing', label: 'Processing', color: 'bg-ink text-white' },
  { id: 'delivered', label: 'Delivered', color: 'bg-teal text-white' },
]

export function OrderPipeline() {
  const { orders, loading } = useRealtimeOrders()

  if (loading) return <div className="h-96 flex items-center justify-center text-text-3 font-bold uppercase tracking-widest">Waking up Pipeline...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {columns.map((column) => (
        <div key={column.id} className="flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2 h-2 rounded-full ${column.color.split(' ')[0]}`}></span>
            <h4 className="text-sm font-bold uppercase tracking-widest text-text-3">{column.label}</h4>
            <span className="bg-mist text-text-2 px-2 py-0.5 rounded-lg text-xs font-bold">
               {orders.filter(o => o.order_status === column.id).length}
            </span>
          </div>
          
          <div className="flex-1 min-h-[400px] flex flex-col gap-4">
            <AnimatePresence>
              {orders
                .filter(o => o.order_status === column.id)
                .map((order) => (
                  <motion.div
                    key={order.id}
                    layoutId={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white p-6 rounded-3xl border border-border shadow-soft hover:shadow-glow transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-gold uppercase tracking-widest">{order.id}</span>
                      <span className="text-[10px] text-text-3 font-bold uppercase tracking-widest">
                         {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <h5 className="font-bold text-ink mb-2 line-clamp-1">{order.products?.title}</h5>
                    
                    <div className="space-y-2 mb-6">
                       <div className="flex items-center gap-2 text-xs text-text-2">
                          <User className="w-3 h-3" />
                          <span className="font-medium truncate">{order.customer_name}</span>
                       </div>
                       <div className="flex items-center gap-2 text-xs text-text-2">
                          <Wallet className="w-3 h-3" />
                          <span className="font-medium">₦{Number(order.total_amount).toLocaleString()}</span>
                       </div>
                    </div>

                    <div className="pt-4 border-t border-mist flex items-center justify-between">
                       <span className={`px-2 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest ${order.agent_id ? 'bg-gold-light text-gold' : 'bg-mist text-text-3'}`}>
                          {order.agent_id ? 'Agent Referral' : 'Direct Sale'}
                       </span>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  )
}
