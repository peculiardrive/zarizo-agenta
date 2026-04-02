'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Bell, LucideIcon, Package, Wallet, CheckCircle, Info, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRealtimeNotifications } from '@/lib/hooks/useRealtimeNotifications'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'

const Icons: Record<string, LucideIcon> = {
  order: Package,
  commission: Wallet,
  payout: CheckCircle,
  system: Info,
}

const Colors: Record<string, string> = {
  order: 'bg-gold-light text-gold',
  commission: 'bg-teal-light text-teal',
  payout: 'bg-teal-light text-teal-2',
  system: 'bg-mist text-text-2',
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [supabase])

  const { notifications, unreadCount, markRead, markAllRead } = useRealtimeNotifications(userId || '')

  const lastUnread = notifications[0]

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={unreadCount > 0 ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.5, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 3 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all ${
          unreadCount > 0 ? 'bg-gold-light border-gold text-gold shadow-glow' : 'bg-mist border-border text-text-3'
        }`}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-96 bg-white rounded-3xl border border-border shadow-2xl overflow-hidden z-[60]"
          >
            <div className="p-6 border-b border-border flex items-center justify-between bg-white sticky top-0 z-10">
              <h3 className="text-xl display text-ink">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllRead} 
                  className="text-xs font-bold text-teal hover:text-teal-2 uppercase tracking-widest flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[500px] overflow-y-auto scrollbar-hide py-2">
              {notifications.length > 0 ? (
                notifications.slice(0, 20).map((n) => {
                  const Icon = Icons[n.type] || Info
                  return (
                    <button 
                      key={n.id} 
                      onClick={() => markRead(n.id)}
                      className={`w-full text-left px-6 py-5 flex gap-5 hover:bg-mist transition-colors group relative ${
                        !n.read ? 'bg-gold-light/20' : ''
                      }`}
                    >
                      {!n.read && (
                        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gold rounded-full"></div>
                      )}
                      
                      <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform ${Colors[n.type] || Colors.system}`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`font-bold text-sm truncate ${!n.read ? 'text-ink' : 'text-text'}`}>{n.title}</p>
                          <p className="text-[10px] text-text-3 font-bold uppercase tracking-widest whitespace-nowrap ml-2">
                            {formatDistanceToNow(new Date(n.created_at), { addSuffix: true }).replace('about ', '')}
                          </p>
                        </div>
                        <p className="text-sm text-text-2 line-clamp-2 leading-relaxed">{n.message}</p>
                      </div>
                    </button>
                  )
                })
              ) : (
                <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-mist rounded-full flex items-center justify-center mx-auto mb-6 text-4xl grayscale opacity-30">🔔</div>
                  <h4 className="text-lg font-bold text-ink mb-1">All caught up!</h4>
                  <p className="text-sm text-text-3">No new notifications at the moment.</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-4 border-t border-border bg-mist text-center">
                <Link href="/agent/notifications" className="text-xs font-bold text-text-2 hover:text-gold uppercase tracking-widest">
                  View All Notifications
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
