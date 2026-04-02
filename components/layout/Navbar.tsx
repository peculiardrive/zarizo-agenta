'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { Plus, Search, Menu, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
      }
    })
  }, [])

  const getPageTitle = () => {
    const parts = pathname.split('/').filter(Boolean)
    if (parts.length <= 1) return 'Dashboard'
    const last = parts[parts.length - 1]
    return last.charAt(0).toUpperCase() + last.slice(1).replace('-', ' ')
  }

  return (
    <header className="h-24 bg-white/50 backdrop-blur-xl border-b border-border sticky top-0 z-40 px-6 md:px-10 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <button className="md:hidden p-2 hover:bg-mist rounded-xl text-ink">
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-2xl display text-ink hidden md:block">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden lg:flex items-center relative group">
          <Search className="absolute left-4 w-4 h-4 text-text-3 group-focus-within:text-gold transition-colors" />
          <input 
            placeholder="Search dashboard..." 
            className="bg-mist border-0 rounded-2xl h-11 pl-12 pr-6 text-sm font-bold w-64 focus:ring-2 focus:ring-gold outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />
          
          <div className="h-10 w-[1px] bg-border mx-2"></div>

          <Link href="/profile" className="flex items-center gap-3 group">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-ink leading-tight uppercase tracking-widest">{user?.user_metadata?.full_name || 'Partner Account'}</p>
                <p className="text-[10px] text-text-3 font-bold uppercase tracking-widest">Active Partner</p>
             </div>
             <div className="w-10 h-10 bg-gold-light rounded-2xl border border-gold/10 flex items-center justify-center overflow-hidden">
                {user?.user_metadata?.avatar_url ? (
                   <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : <User className="w-5 h-5 text-gold" />}
             </div>
          </Link>
        </div>
      </div>
    </header>
  )
}
