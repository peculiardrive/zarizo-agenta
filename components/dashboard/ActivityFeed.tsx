'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { ShoppingBag, Star, UserPlus, CheckCircle, Wallet, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const Icons: Record<string, any> = {
  order: ShoppingBag,
  commission: Wallet,
  agent: UserPlus,
  business: Star,
  payout: CheckCircle,
  system: Clock,
}

const Colors: Record<string, string> = {
  order: 'bg-gold-light text-gold border-gold/10',
  commission: 'bg-teal-light text-teal border-teal/20',
  agent: 'bg-ink-2 text-gold border-white/5',
  business: 'bg-gold-light text-ink border-gold/20',
  payout: 'bg-teal text-white border-teal/10',
  system: 'bg-mist text-text-3 border-border',
}

export function ActivityFeed() {
  const [events, setEvents] = useState<any[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // In a real app we'd have an activity table. For now I'll simulate it by listening to all orders & commissions
    const fetchInitial = async () => {
      const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
      const { data: comms } = await supabase.from('commissions').select('*').order('created_at', { ascending: false }).limit(5)
      
      const combined = [
        ...(orders?.map(o => ({ ...o, type: 'order', message: `New order ${o.id} placed`, timestamp: o.created_at })) || []),
        ...(comms?.map(c => ({ ...c, type: 'commission', message: `Commission of ₦${c.amount} recorded`, timestamp: c.created_at })) || [])
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      
      setEvents(combined)
    }

    fetchInitial()

    const channel = supabase
      .channel('activity_feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (p) => {
        if (!isPaused) setEvents(prev => [{ ...p.new, type: 'order', message: `New order ${p.new.id}`, timestamp: p.new.created_at }, ...prev].slice(0, 50))
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'commissions' }, (p) => {
        if (!isPaused) setEvents(prev => [{ ...p.new, type: 'commission', message: `Commission of ₦${p.new.amount} generated`, timestamp: p.new.created_at }, ...prev].slice(0, 50))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, isPaused])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-3">Live Stream</span>
        <button 
           onClick={() => setIsPaused(!isPaused)} 
           className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg border transition-all ${
             isPaused ? 'bg-gold text-ink border-gold shadow-glow' : 'text-text-3 border-white/10 hover:border-white/20'
           }`}
        >
          {isPaused ? 'Paused' : 'Monitoring'}
        </button>
      </div>

      <div className="flex-1 space-y-4 pr-2 scrollbar-hide py-2">
        <AnimatePresence>
          {events.map((event, i) => {
            const Icon = Icons[event.type] || Clock
            return (
              <motion.div
                key={event.id || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-gold/20 transition-all group"
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-transform group-hover:scale-110 ${Colors[event.type] || Colors.system}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white mb-1 line-clamp-1">{event.message}</p>
                  <p className="text-[10px] text-text-3 font-bold uppercase tracking-widest">
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {events.length === 0 && <p className="text-center text-text-3 text-xs py-10 font-bold uppercase tracking-widest">Waiting for platform events...</p>}
      </div>
    </div>
  )
}
