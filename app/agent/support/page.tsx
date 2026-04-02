import React from 'react'
import Link from 'next/link'
import { HelpCircle, ExternalLink, MessageCircle, Mail, AlertCircle, FileText } from 'lucide-react'

const AGENT_FAQ = [
  { q: "My referral isn't showing up?", a: "Clicks are recorded immediately, but orders appear once payment is confirmed via Paystack. If a payment was made but it's missing, contact support with the customer's phone number." },
  { q: "How do I update my bank details?", a: "Go to your 'Profile' page. Note that bank changes may require a 48-hour security validation before your next payout." },
  { q: "Can I promote on Facebook?", a: "Absolutely! You can share your links on any social platform. Just ensure you aren't using spammy techniques." }
]

export default function AgentSupportPage() {
  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl display text-ink">Agent Help Center</h1>
        <div className="flex items-center gap-2 bg-teal-light px-4 py-2 rounded-xl border border-teal/10">
           <div className="live-dot font-bold"></div>
           <span className="text-[10px] font-bold text-teal uppercase tracking-widest mt-0.5">Support Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white p-10 rounded-[50px] border border-border shadow-soft group hover:border-gold transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-10 -mt-10"></div>
            <MessageCircle className="w-10 h-10 text-gold mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl display text-ink mb-2">WhatsApp Support</h3>
            <p className="text-sm text-text-3 font-bold mb-8 uppercase tracking-widest">Instant Resolution</p>
            <a href="https://wa.me/234000000000" className="btn-gold block text-center py-4 text-xs font-bold uppercase tracking-widest">Chat on WhatsApp</a>
         </div>

         <div className="bg-ink p-10 rounded-[50px] text-white shadow-soft relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
            <Mail className="w-10 h-10 text-gold mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl display text-white mb-2">Email Support</h3>
            <p className="text-sm text-text-3 font-bold mb-8 uppercase tracking-widest">Business Inquiries</p>
            <a href="mailto:support@zarizo.com" className="bg-white/10 hover:bg-white/20 block text-center py-4 text-xs font-bold uppercase tracking-widest rounded-2xl border border-white/5">agent@zarizo.com</a>
         </div>

         <div className="bg-white p-10 rounded-[50px] border border-border shadow-soft group hover:border-gold transition-all">
            <FileText className="w-10 h-10 text-teal mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl display text-ink mb-2">Legal Policies</h3>
            <p className="text-sm text-text-3 font-bold mb-8 uppercase tracking-widest">Payout & Commissions</p>
            <Link href="/payout-policy" className="btn-ink block text-center py-4 text-xs font-bold uppercase tracking-widest">Review Polices</Link>
         </div>
      </div>

      <div className="bg-white rounded-[40px] border border-border shadow-soft overflow-hidden p-12">
         <h2 className="text-2xl display text-ink mb-10 border-b border-border pb-8">Common Agent Questions</h2>
         <div className="space-y-8">
            {AGENT_FAQ.map((faq, i) => (
               <div key={i} className="group cursor-pointer">
                  <h4 className="text-lg font-bold text-ink mb-3 flex items-center gap-3">
                     <span className="w-6 h-6 bg-gold-light text-gold rounded-lg flex items-center justify-center text-xs">Q</span>
                     {faq.q}
                  </h4>
                  <p className="text-text-2 font-medium leading-relaxed pl-9 border-l-2 border-mist group-hover:border-gold transition-colors">{faq.a}</p>
               </div>
            ))}
         </div>
      </div>

      <div className="bg-gold-light/50 p-12 rounded-[50px] border border-gold/10 flex flex-col items-center text-center">
         <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm text-3xl">📘</div>
         <h2 className="text-3xl display text-ink mb-4">The Agent Academy</h2>
         <p className="text-text-2 max-w-lg mb-8 font-medium italic">"The most successful Zarizo agents focus on one high-quality product at a time and share it with a personal recommendation story."</p>
         <Link href="/faq" className="text-ink font-bold uppercase tracking-[0.2em] text-xs hover:text-gold transition-all flex items-center gap-2">
            Visit Universal FAQ <ExternalLink className="w-4 h-4" />
         </Link>
      </div>
    </div>
  )
}
