import { ReportService } from '@/lib/services/ReportService'
import Link from 'next/link'
import { FeaturedProducts } from '@/components/products/FeaturedProducts'
import { LiveCounter } from '@/components/dashboard/LiveCounter'

export default async function HomePage() {
  const summary = await ReportService.getPlatformSummary()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-ink text-white pt-24 pb-32 px-4 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full filter blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal rounded-full filter blur-[150px] animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl display mb-6 leading-tight">
            Grow Sales.<br />
            <span className="text-gold">Expand Reach.</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-3 mb-10 max-w-2xl mx-auto leading-relaxed">
            The agent-first marketplace for African businesses. List your products and let a network of verified agents grow your brand.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/shop" className="w-full sm:w-auto btn-gold text-lg px-10 py-5 flex items-center justify-center gap-2">
              Browse Products
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
            <Link href="/auth/signup" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-10 py-5 rounded-full border border-white/20 transition-all text-lg flex items-center justify-center">
              Register Business
            </Link>
          </div>

          <LiveCounter 
            orders={summary.totalOrders || 0} 
            agents={summary.activeAgents || 0} 
            businesses={summary.activeBusinesses || 0} 
          />
        </div>
      </section>

      {/* Featured Storefront */}
      <section className="py-24 px-4 bg-snow">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl text-ink mb-2">Featured Products</h2>
              <div className="flex items-center gap-2">
                <span className="live-dot"></span>
                <span className="text-sm font-bold text-teal uppercase tracking-widest">Live Storefront</span>
              </div>
            </div>
            <Link href="/shop" className="text-gold font-bold hover:underline flex items-center gap-2">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </Link>
          </div>

          <FeaturedProducts />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl text-ink mb-16">How it works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: '🛍️', title: 'List Products', text: 'Businesses list their products and set amazing commissions for agents.' },
              { icon: '🔗', title: 'Get Referral Links', text: 'Verified agents generate unique referral links for any product they want to sell.' },
              { icon: '📱', title: 'Share & Promote', text: 'Agents share links with their audience and communities privately or on social media.' },
              { icon: '💰', title: 'Auto Payouts', text: "Commissions are auto-calculated and approved as soon as the customer's order is delivered." },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gold-light rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-text-2 text-sm leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Businesses Section */}
      <section className="py-24 px-4 bg-ink text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl display mb-8">Scale your brand with an army of agents.</h2>
            <ul className="space-y-6 mb-10">
              {[
                'Zero upfront marketing costs',
                'Only pay when you make a sale',
                'Automatic commission tracking',
                'Dedicated dashboard for orders',
                'Real-time inventory management'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-lg">
                  <div className="w-6 h-6 bg-teal rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/auth/signup" className="btn-gold px-8 py-4 inline-block text-lg">Register a Business</Link>
          </div>
          <div className="flex-1 w-full flex justify-center">
             <div className="w-full max-w-sm aspect-square bg-gradient-to-br from-gold/20 to-teal/20 rounded-3xl border border-white/10 flex items-center justify-center text-8xl shadow-2xl">
                🚀
             </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-16 px-4 bg-gold">
         <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <h2 className="text-3xl display text-ink text-center md:text-left">Ready to start earning commissions?</h2>
            <Link href="/auth/agent-signup" className="bg-ink text-white font-bold px-10 py-5 rounded-full hover:bg-ink-2 transition-all text-xl">
               Become an Agent
            </Link>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-4 bg-white border-t border-border">
         <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
               <h3 className="text-3xl display text-ink mb-6">Zarizo</h3>
               <p className="text-text-2 text-lg max-w-md">The agent-first digital sales and distribution platform for African businesses and independent agents.</p>
            </div>
            <div>
               <h4 className="font-bold text-ink uppercase tracking-widest text-sm mb-6">Quick Links</h4>
               <ul className="space-y-4">
                  <li><Link href="/shop" className="text-text-2 hover:text-gold">Product Catalog</Link></li>
                  <li><Link href="/about" className="text-text-2 hover:text-gold">About Zarizo</Link></li>
                  <li><Link href="/contact" className="text-text-2 hover:text-gold">Contact Support</Link></li>
                  <li><Link href="/auth/login" className="text-text-2 hover:text-gold">Partner Login</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold text-ink uppercase tracking-widest text-sm mb-6">Legal</h4>
               <ul className="space-y-4">
                  <li><Link href="/terms" className="text-text-2 hover:text-gold">Terms of Service</Link></li>
                  <li><Link href="/privacy" className="text-text-2 hover:text-gold">Privacy Policy</Link></li>
                  <li><Link href="/legal" className="text-text-2 hover:text-gold">Legal Information</Link></li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto pt-12 border-t border-border text-center text-text-3 text-sm">
            <p>© 2024 Zarizo. Grow Sales. Expand Reach.</p>
         </div>
      </footer>
    </div>
  )
}
