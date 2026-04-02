import { createClient } from '@/lib/supabase/server'
import { Building2, Save, UserCircle, Globe, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function BusinessProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user?.id)
    .single()

  return (
    <div className="space-y-12 pb-20">
      <h1 className="text-4xl display text-ink font-bold">Business Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Profile Card Summary */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-ink text-white p-12 rounded-[50px] border border-white/5 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group h-full">
               <div className="absolute top-0 left-0 w-40 h-40 bg-gold rounded-full filter blur-[100px] opacity-10 pointer-events-none group-hover:scale-150 transition-all duration-700"></div>
               <div className="w-32 h-32 bg-white rounded-[40px] flex items-center justify-center text-5xl mb-8 shadow-2xl group-hover:rotate-6 transition-all">{business?.business_name?.[0] || '🏬'}</div>
               <h2 className="text-3xl display text-white mb-2">{business?.business_name}</h2>
               <p className="text-sm font-bold text-teal lowercase tracking-widest bg-teal-light/10 border border-teal/20 px-4 py-1.5 rounded-full mb-10">{business?.status} Partner</p>
               
               <div className="w-full space-y-4 pt-10 border-t border-white/5">
                  <div className="flex items-center gap-3 text-sm text-text-3 font-bold group-hover:translate-x-2 transition-all">
                     <UserCircle className="w-4 h-4 text-gold" /> {business?.owner_name}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-3 font-bold group-hover:translate-x-2 transition-all">
                     <Mail className="w-4 h-4 text-gold" /> {business?.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-3 font-bold group-hover:translate-x-2 transition-all">
                     <Phone className="w-4 h-4 text-gold" /> {business?.phone}
                  </div>
               </div>
            </div>
         </div>

         {/* Edit Profile Form */}
         <div className="lg:col-span-2 bg-white p-12 rounded-[50px] border border-border shadow-soft">
            <h2 className="text-2xl display text-ink mb-12 flex items-center gap-3">
               <Building2 className="text-gold" /> Update Information
            </h2>
            
            <form className="space-y-8">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <Label className="uppercase tracking-widest text-[10px] font-bold text-text-3">Business Name</Label>
                     <Input defaultValue={business?.business_name} className="h-14 rounded-2xl bg-mist border-0" />
                  </div>
                  <div className="space-y-2">
                     <Label className="uppercase tracking-widest text-[10px] font-bold text-text-3">Official Phone</Label>
                     <Input defaultValue={business?.phone} className="h-14 rounded-2xl bg-mist border-0" />
                  </div>
               </div>

               <div className="space-y-2">
                  <Label className="uppercase tracking-widest text-[10px] font-bold text-text-3">Business Description</Label>
                  <textarea defaultValue={business?.description || ''} className="w-full h-32 rounded-2xl bg-mist border-0 p-4 text-sm font-bold focus:ring-2 focus:ring-gold outline-none resize-none" />
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <Label className="uppercase tracking-widest text-[10px] font-bold text-text-3">Owner Full Name</Label>
                     <Input defaultValue={business?.owner_name} className="h-14 rounded-2xl bg-mist border-0" />
                  </div>
                  <div className="space-y-2">
                     <Label className="uppercase tracking-widest text-[10px] font-bold text-text-3">Support Email</Label>
                     <Input defaultValue={business?.email} className="h-14 rounded-2xl bg-mist border-0" />
                  </div>
               </div>

               <div className="pt-10 border-t border-border flex items-center gap-4">
                  <Button type="submit" className="btn-gold px-12 py-5 text-lg flex items-center gap-3 shadow-glow transition-all active:scale-95">
                     <Save className="w-5 h-5" /> Save Profile
                  </Button>
                  <Button type="button" variant="outline" className="px-12 py-5 text-lg font-bold text-text-3 border-border hover:border-gold">Change Logo</Button>
               </div>
            </form>
         </div>
      </div>
    </div>
  )
}
