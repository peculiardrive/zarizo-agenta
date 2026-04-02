import { createClient } from '@/lib/supabase/server'
import { UserCircle, Save, Wallet, Shield, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function AgentProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: agent } = await supabase
    .from('agents')
    .select('*, users(*)')
    .eq('user_id', user?.id)
    .single()

  return (
    <div className="space-y-12 pb-20">
      <h1 className="text-4xl display text-ink font-bold">Account & Payout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Profile Card Summary */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-ink text-white p-12 rounded-[50px] border border-white/5 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group h-full">
               <div className="absolute top-0 left-0 w-40 h-40 bg-gold rounded-full filter blur-[100px] opacity-10 pointer-events-none group-hover:scale-150 transition-all duration-700"></div>
               <div className="w-32 h-32 bg-white rounded-[40px] flex items-center justify-center text-5xl mb-8 shadow-2xl group-hover:rotate-6 transition-all">{agent?.users?.full_name?.[0] || '👤'}</div>
               <h2 className="text-3xl display text-white mb-2">{agent?.users?.full_name}</h2>
               <p className="text-sm font-bold text-teal-light/80 lowercase tracking-widest bg-teal-light/10 border border-teal/20 px-6 py-2 rounded-full mb-10">Referral Partner</p>
               
               <div className="w-full space-y-6 pt-10 border-t border-white/10 text-left">
                  <div className="flex items-center gap-4 text-xs font-bold text-text-3 uppercase tracking-widest group-hover:translate-x-2 transition-all">
                     <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center">🆔</div> {agent?.referral_code}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-text-3 uppercase tracking-widest group-hover:translate-x-2 transition-all">
                     <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center">📩</div> {agent?.users?.email}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-text-3 uppercase tracking-widest group-hover:translate-x-2 transition-all">
                     <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center">📱</div> {agent?.users?.phone}
                  </div>
               </div>
            </div>
         </div>

         {/* Payout & Info Tabs */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-12 rounded-[50px] border border-border shadow-soft">
               <h2 className="text-2xl display text-ink mb-12 flex items-center gap-3">
                  <Wallet className="text-gold" /> Payout Settings
               </h2>
               
               <form className="space-y-8">
                  <div className="space-y-2">
                     <Label className="uppercase tracking-widest text-[10px] font-bold text-text-3">Full Account Name</Label>
                     <Input defaultValue={agent?.account_name} className="h-16 rounded-2xl bg-mist border-0 text-sm font-bold" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="uppercase tracking-widest text-[10px] font-bold text-text-3">Bank Name</Label>
                        <Input defaultValue={agent?.bank_name} className="h-16 rounded-2xl bg-mist border-0 text-sm font-bold" />
                     </div>
                     <div className="space-y-2">
                        <Label className="uppercase tracking-widest text-[10px] font-bold text-text-3">Account Number</Label>
                        <Input defaultValue={agent?.account_number} className="h-16 rounded-2xl bg-mist border-0 text-sm font-bold" />
                     </div>
                  </div>

                  <div className="py-4 px-6 bg-gold-light border border-gold/10 rounded-2xl flex items-center gap-4 text-ink">
                     <Shield className="w-5 h-5 flex-shrink-0" />
                     <p className="text-xs font-bold uppercase tracking-widest">Withdrawals are only processed to verified bank accounts matching your legal name.</p>
                  </div>

                  <div className="pt-10 border-t border-border flex items-center gap-4">
                     <Button type="submit" className="btn-gold px-12 py-5 text-lg flex items-center gap-3 shadow-glow transition-all active:scale-95">
                        <Save className="w-5 h-5" /> Save Changes
                     </Button>
                     <Button type="button" variant="outline" className="px-12 py-5 text-lg font-bold text-text-3 border-border hover:border-gold">Identity Verification</Button>
                  </div>
               </form>
            </div>
         </div>
      </div>
    </div>
  )
}
