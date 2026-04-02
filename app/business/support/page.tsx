import React from 'react'
import Link from 'next/link'
import { Building2, Plus, Megaphone, Wallet, ExternalLink, MessageCircle, FileText } from 'lucide-react'

const BIZ_FAQ = [
  { q: "How do I get my products featured?", a: "High-quality images and clear descriptions help. Admins highlight products that show consistent high sales and positive customer feedback." },
  { q: "What's the commission cap?", a: "There is no cap. However, higher commissions (15-25%) attract the top-performing agents to your brand faster." },
  { q: "How do I handle returns?", a: "Contact the customer directly using their details in the 'Orders' tab. Once a refund is confirmed, notify Zarizo admin to reverse the commission." }
]

export default function BusinessSupportPage() {
  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl display text-ink">Vendor Success Hub</h1>
        <div className="live-dot font-bold"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-ink p-12 rounded-[60px] text-white flex items-center justify-between group hover:-translate-y-1 transition-all overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10">
               <Megaphone className="w-16 h-16 text-gold mb-8 group-hover:scale-110 transition-transform" />
               <h3 className="text-3xl display mb-4">Attract More Agents</h3>
               <p className="text-text-3 font-medium mb-12 max-w-sm">"Success on Zarizo comes from constant communication with your agents. Provide them with promotional content and high margins."</p>
               <Link href="/business/products" className="btn-gold px-12 py-5 font-bold uppercase tracking-widest text-xs">Manage Products</Link>
            </div>
         </div>

         <div className="bg-white p-12 rounded-[60px] border border-border shadow-soft flex items-center justify-between group hover:-translate-y-1 transition-all overflow-hidden relative">
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-snow rounded-full -mr-16 -mb-16"></div>
            <div className="relative z-10">
               <Wallet className="w-16 h-16 text-gold mb-8 group-hover:scale-110 transition-transform" />
               <h3 className="text-3xl display mb-4">Financial Support</h3>
               <p className="text-text-2 font-medium mb-12 max-w-sm">"Track your payout settlements and net revenue in the Reports tab. For manual billing, contact our accounting team."</p>
               <a href="mailto:finance@zarizo.com" className="btn-ink px-12 py-5 font-bold uppercase tracking-widest text-xs">Email Accounting</a>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[40px] border border-border shadow-soft overflow-hidden p-12">
         <h2 className="text-2xl display text-ink mb-10 border-b border-border pb-8">Vendor Knowledge Base</h2>
         <div className="space-y-8">
            {BIZ_FAQ.map((faq, i) => (
               <div key={i} className="group cursor-pointer">
                  <h4 className="text-lg font-bold text-ink mb-3 flex items-center gap-3">
                     <span className="w-8 h-8 bg-gold-light text-gold rounded-full flex items-center justify-center text-xs font-bold font-serif">?</span>
                     {faq.q}
                  </h4>
                  <p className="text-text-2 font-medium leading-relaxed pl-11 border-l-2 border-mist group-hover:border-gold transition-colors">{faq.a}</p>
               </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Link href="/contact" className="p-8 bg-snow rounded-3xl flex items-center justify-between group hover:bg-white border border-transparent hover:border-gold transition-all">
            <div className="flex items-center gap-4">
               <MessageCircle className="w-6 h-6 text-gold" />
               <h4 className="font-bold text-ink">Global Support</h4>
            </div>
            <ExternalLink className="w-4 h-4 text-text-3 group-hover:text-gold" />
         </Link>
         <Link href="/terms" className="p-8 bg-snow rounded-3xl flex items-center justify-between group hover:bg-white border border-transparent hover:border-gold transition-all">
            <div className="flex items-center gap-4">
               <FileText className="w-6 h-6 text-gold" />
               <h4 className="font-bold text-ink">Platform Terms</h4>
            </div>
            <ExternalLink className="w-4 h-4 text-text-3 group-hover:text-gold" />
         </Link>
         <Link href="/faq" className="p-8 bg-snow rounded-3xl flex items-center justify-between group hover:bg-white border border-transparent hover:border-gold transition-all">
            <div className="flex items-center gap-4">
               <Building2 className="w-6 h-6 text-gold" />
               <h4 className="font-bold text-ink">Public FAQ Hub</h4>
            </div>
            <ExternalLink className="w-4 h-4 text-text-3 group-hover:text-gold" />
         </Link>
      </div>
    </div>
  )
}
