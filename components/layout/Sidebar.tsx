'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Wallet, 
  Bell, 
  Settings, 
  BarChart3, 
  Activity, 
  KanbanSquare,
  Building2,
  LogOut,
  HelpCircle,
  UserCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const adminLinks = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/pipeline', label: 'Order Pipeline', icon: KanbanSquare },
  { href: '/admin/businesses', label: 'Businesses', icon: Building2 },
  { href: '/admin/agents', label: 'Agents', icon: Users },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/commissions', label: 'Commissions', icon: Wallet },
  { href: '/admin/activity', label: 'Live Activity', icon: Activity },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

const bizLinks = [
  { href: '/business', label: 'Overview', icon: LayoutDashboard },
  { href: '/business/products', label: 'My Products', icon: Package },
  { href: '/business/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/business/agents', label: 'My Agents', icon: Users },
  { href: '/business/reports', label: 'Reports', icon: BarChart3 },
  { href: '/business/profile', label: 'Profile', icon: UserCircle },
  { href: '/business/support', label: 'Support', icon: HelpCircle },
]

const agentLinks = [
  { href: '/agent', label: 'Overview', icon: LayoutDashboard },
  { href: '/agent/products', label: 'Browse & Share', icon: Package },
  { href: '/agent/orders', label: 'My Orders', icon: ShoppingCart },
  { href: '/agent/commissions', label: 'Commissions', icon: Wallet },
  { href: '/agent/notifications', label: 'Notifications', icon: Bell },
  { href: '/agent/profile', label: 'Profile', icon: UserCircle },
  { href: '/agent/support', label: 'Support', icon: HelpCircle },
]

export function Sidebar({ role }: { role: 'admin' | 'business' | 'agent' }) {
  const pathname = usePathname()
  const supabase = createClient()

  const links = role === 'admin' ? adminLinks : role === 'business' ? bizLinks : agentLinks

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  return (
    <aside className="hidden md:flex flex-col w-[230px] bg-ink h-screen fixed top-0 left-0 border-r border-white/5 z-50">
      <div className="p-8 h-24 flex items-center">
        <Link href="/" className="text-2xl display text-white font-bold tracking-tight">Zarizo<span className="text-gold">.</span></Link>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto scrollbar-hide">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== `/${role}` && pathname.startsWith(link.href))
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm group ${
                isActive 
                ? 'bg-gold text-ink' 
                : 'text-text-3 hover:text-white hover:bg-white/5'
              }`}
            >
              <link.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-ink' : 'text-text-3'}`} />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-6 border-t border-white/5 mx-2 mb-2">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-text-3 hover:text-danger hover:bg-danger/10 rounded-xl transition-all font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </aside>
  )
}
