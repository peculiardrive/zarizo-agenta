'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings, User, Bell, Shield, Wallet, Save } from 'lucide-react'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  const tabs = [
    { id: 'profile', label: 'Admin Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'System Alerts', icon: Bell },
    { id: 'billing', label: 'Payout Config', icon: Wallet },
  ]

  return (
    <div className="space-y-12">
      <h1 className="text-4xl display text-ink">Admin Configuration</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
         {/* Settings Sidebar */}
         <div className="lg:col-span-1 space-y-2">
            {tabs.map((tab) => {
               const Icon = tab.icon
               return (
                  <button 
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`w-full text-left px-6 py-4 rounded-2xl flex items-center gap-4 transition-all font-bold text-sm ${
                        activeTab === tab.id ? 'bg-ink text-white shadow-soft' : 'bg-white text-text-3 border border-border hover:border-gold'
                     }`}
                  >
                     <Icon className="w-5 h-5" />
                     {tab.label}
                  </button>
               )
            })}
         </div>

         {/* Settings Content */}
         <div className="lg:col-span-3 bg-white p-12 rounded-[50px] border border-border shadow-soft">
            <h2 className="text-2xl display text-ink mb-12 flex items-center gap-3">
               <Settings className="text-gold" /> System Preferences
            </h2>
            
            <form onSubmit={handleSave} className="space-y-10 group">
               <div className="max-w-2xl space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="uppercase tracking-widest text-[10px] font-bold text-text-3">Full Name</Label>
                        <Input defaultValue="Zarizo Admin" className="h-14 rounded-2xl bg-mist border-0" />
                     </div>
                     <div className="space-y-2">
                        <Label className="uppercase tracking-widest text-[10px] font-bold text-text-3">Email Address</Label>
                        <Input defaultValue="admin@zarizo.com" className="h-14 rounded-2xl bg-mist border-0" disabled />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label className="uppercase tracking-widest text-[10px] font-bold text-text-3">Commission Approval Mode</Label>
                     <div className="flex gap-4">
                        <label className="flex-1 p-6 bg-snow border-2 border-gold rounded-3xl cursor-pointer">
                           <input type="radio" name="comm-mode" defaultChecked className="hidden" />
                           <h4 className="font-bold text-ink mb-1">Automatic</h4>
                           <p className="text-xs text-text-3">Approve when order is delivered</p>
                        </label>
                        <label className="flex-1 p-6 bg-snow border-2 border-transparent rounded-3xl cursor-pointer hover:border-gold/30">
                           <input type="radio" name="comm-mode" className="hidden" />
                           <h4 className="font-bold text-ink mb-1">Manual</h4>
                           <p className="text-xs text-text-3">Requires admin review</p>
                        </label>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label className="uppercase tracking-widest text-[10px] font-bold text-text-3">Minimum Payout (₦)</Label>
                     <Input defaultValue="5000" className="h-14 rounded-2xl bg-mist border-0" />
                  </div>
               </div>

               <div className="pt-10 border-t border-border flex items-center gap-4">
                  <Button type="submit" disabled={loading} className="btn-gold px-12 py-5 text-lg flex items-center gap-3">
                     <Save className="w-5 h-5" />
                     {loading ? 'Saving...' : 'Save Configuration'}
                  </Button>
                  <Button type="button" variant="outline" className="px-12 py-5 text-lg font-bold text-text-3 hover:text-ink">Discard Changes</Button>
               </div>
            </form>
         </div>
      </div>
    </div>
  )
}
