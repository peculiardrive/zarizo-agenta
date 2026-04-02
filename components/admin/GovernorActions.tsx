'use client'

import React, { useState } from 'react'
import { Check, X, Ban, MoreVertical } from 'lucide-react'
import { AdminService } from '@/lib/services/AdminService'
import { useRouter } from 'next/navigation'

interface GovernorActionsProps {
  id: string
  type: 'business' | 'agent' | 'product'
  status: 'pending' | 'active' | 'suspended'
}

export function GovernorActions({ id, type, status }: GovernorActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleApprove = async () => {
    setLoading(true)
    try {
      if (type === 'business') {
        await AdminService.approveBusiness(id)
      } else if (type === 'agent') {
        await AdminService.approveAgent(id)
      } else {
        await AdminService.approveProduct(id)
      }
      router.refresh()
    } catch (err) {
      console.error("Approval flow failed:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSuspend = async () => {
    if (!confirm('Are you sure you want to suspend this item?')) return
    
    setLoading(true)
    try {
      const tableMap = {
        'business': 'businesses',
        'agent': 'agents',
        'product': 'products'
      } as const

      await AdminService.suspendItem(tableMap[type], id)
      router.refresh()
    } catch (err) {
      console.error("Suspension flow failed:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-end gap-2">
         <div className="w-5 h-5 border-2 border-gold border-t-transparent animate-spin rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-end gap-3">
      {status === 'pending' && (
        <button 
          onClick={handleApprove}
          title="Approve User"
          className="bg-teal text-white w-9 h-9 flex items-center justify-center rounded-xl hover:scale-110 transition-all shadow-glow-teal"
        >
          <Check className="w-5 h-5" />
        </button>
      )}
      
      {status === 'active' && (
        <button 
          onClick={handleSuspend}
          title="Suspend User"
          className="bg-danger/10 text-danger w-9 h-9 flex items-center justify-center rounded-xl hover:bg-danger hover:text-white transition-all border border-danger/10"
        >
          <Ban className="w-4 h-4" />
        </button>
      )}

      {status === 'suspended' && (
        <button 
          onClick={handleApprove}
          title="Reactivate User"
          className="bg-gold-light text-gold w-9 h-9 flex items-center justify-center rounded-xl hover:scale-110 transition-all shadow-glow"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      )}

      <button className="bg-mist text-text-2 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gold transition-all">
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
  )
}

function RefreshCcw({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582M20 20v-5h-.581M18.418 5.76C17.067 4.394 15.184 3.5 13.1 3.5c-3.535 0-6.4 2.865-6.4 6.4h1.1a5.3 5.3 0 0110.6 0"></path></svg>
  )
}
