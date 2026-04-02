import React from 'react'
import Link from 'next/link'
import { CheckCircle, Globe, Users, TrendingUp, ShieldCheck } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-snow">
      {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 bg-ink text-white relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-brand-blue/10 rounded-full filter blur-[150px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-7xl md:text-8xl display mb-8 tracking-tighter leading-none">Modernizing <br/><span className="text-gold italic">Sales</span> for Africa.</h1>
          <p className="text-xl md:text-2xl text-text-3 max-w-3xl mx-auto font-medium leading-relaxed">Zarizo is a decentralized marketplace infrastructure that empowers businesses to scale and agents to earn through automated referral technology.</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
           <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-4">Our Mission</p>
              <h2 className="text-5xl display text-ink mb-8 leading-tight">Eliminating the <br/>Marketing Barrier.</h2>
              <p className="text-lg text-text-2 mb-8 leading-relaxed font-medium">For too long, small and medium businesses have struggled with the high costs of digital advertising. Zarizo was born to change that by connecting brands directly with a motivated network of local agents.</p>
              <p className="text-lg text-text-2 mb-12 leading-relaxed font-medium">We believe in a future where anyone with a smartphone can become an entrepreneur, and every great product can find its audience without a massive marketing budget.</p>
              
              <div className="grid grid-cols-2 gap-8">
                 <div className="p-8 bg-white rounded-[40px] border border-border shadow-soft">
                    <h3 className="text-4xl font-bold text-ink mb-2">1,000+</h3>
                    <p className="text-xs font-bold text-text-3 uppercase tracking-widest leading-none">Verified Agents</p>
                 </div>
                 <div className="p-8 bg-white rounded-[40px] border border-border shadow-soft">
                    <h3 className="text-4xl font-bold text-ink mb-2">₦5M+</h3>
                    <p className="text-xs font-bold text-text-3 uppercase tracking-widest leading-none">Commissions Paid</p>
                 </div>
              </div>
           </div>

           <div className="relative">
              <div className="aspect-[4/5] bg-mist rounded-[60px] overflow-hidden shadow-soft border border-border">
                 <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200" alt="Zarizo in Action" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-gold p-10 rounded-[40px] text-ink font-bold shadow-glow border border-gold/20 max-w-xs transition-all hover:scale-105 active:scale-95">
                 <p className="text-sm uppercase tracking-widest mb-4">Core Value</p>
                 <h4 className="text-2xl display mb-2 leading-tight text-ink">Trust through Automation.</h4>
              </div>
           </div>
        </div>
      </section>

      {/* Why Zarizo */}
      <section className="py-32 px-4 bg-mist/50">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-24">
              <h2 className="text-5xl display text-ink mb-6">Built for the Next Generation</h2>
              <p className="text-lg text-text-2 max-w-2xl mx-auto">Our platform is engineered for speed, transparency, and scale.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Zero Upfront Cost', desc: 'Businesses list for free. We only earn when you make a sale.', icon: <Globe className="w-8 h-8 text-gold group-hover:text-ink" /> },
                { title: 'Instant Attribution', desc: 'Secure referral tracking ensures every click is counted and credited.', icon: <ShieldCheck className="w-8 h-8 text-gold group-hover:text-ink" /> },
                { title: 'Mobile First', desc: 'Designed for the African mobile environment with low-data optimization.', icon: <TrendingUp className="w-8 h-8 text-gold group-hover:text-ink" /> }
              ].map((feat, i) => (
                <div key={i} className="bg-white p-12 rounded-[50px] border border-border shadow-soft group hover:border-gold transition-all">
                   <div className="w-16 h-16 bg-snow rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-gold transition-all">
                      {feat.icon}
                   </div>
                   <h3 className="text-2xl display text-ink mb-4">{feat.title}</h3>
                   <p className="text-text-2 leading-relaxed font-medium">{feat.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto bg-ink p-16 md:p-24 rounded-[80px] text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-teal/20 to-transparent"></div>
           <h2 className="text-5xl md:text-6xl display text-white mb-10 relative z-10">Start your journey <br/>with <span className="text-gold italic">Zarizo</span> today.</h2>
           <div className="flex flex-col md:flex-row gap-6 justify-center relative z-10">
              <Link href="/signup" className="btn-gold px-12 py-5 text-lg font-bold">Register Business</Link>
              <Link href="/agent-signup" className="bg-white text-ink px-12 py-5 rounded-2xl shadow-sm hover:scale-105 active:scale-95 transition-all text-lg font-bold">Join as Agent</Link>
           </div>
        </div>
      </section>
    </div>
  )
}
