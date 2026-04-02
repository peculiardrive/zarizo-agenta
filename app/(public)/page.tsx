import { ReportService } from '@/lib/services/ReportService'
import Link from 'next/link'
import { FeaturedProducts } from '@/components/products/FeaturedProducts'
import { LiveCounter } from '@/components/dashboard/LiveCounter'

export default async function HomePage() {
  let summary: any = { totalOrders: 0, activeAgents: 0, activeBusinesses: 0 }
  
  try {
    const data = await ReportService.getPlatformSummary()
    if (data) summary = data
  } catch (err) {
    console.warn("Home Page Data Fetch Error:", err)
  }

  return (
    <div className="flex flex-col min-h-screen selection:bg-brand-blue/20">
      {/* Floating Modern Nav */}
      <nav className="floating-nav">
        <Link href="/" className="text-xl font-black text-brand-black tracking-tighter">
          Zarizo.
        </Link>
        <div className="hidden md:flex gap-4">
          <Link href="/shop" className="nav-link">Marketplace</Link>
          <Link href="/about" className="nav-link">Network</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
        </div>
        <div className="flex gap-4">
          <Link href="/auth/login" className="nav-link hidden sm:block">Log in</Link>
          <Link href="/auth/signup" className="btn-black">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-4 flex flex-col items-center justify-center text-center overflow-visible">
        {/* Subtle radial glow background */}
        <div className="absolute top-0 inset-x-0 w-full h-[600px] opacity-[0.4] -z-20 bg-[radial-gradient(ellipse_at_center,#3b82f61a_0%,transparent_100%)] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="pill-badge mb-10 animate-fade-in mx-auto">
             <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
             <span>The Next-Gen Digital Sales Network</span>
          </div>

          <h1 className="hero-heading">
            Grow sales. <br />
            <span className="text-gradient-blue">Expand reach.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 mb-14 max-w-3xl mx-auto font-medium leading-relaxed">
            The modern infrastructure for African commerce. Connect your products to a decentralized network of professional agents and scale instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
            <Link href="/shop" className="w-full sm:w-auto btn-black group px-10 py-4 text-lg">
              Explore Marketplace
              <svg className="w-5 h-5 ml-2 inline-block transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </Link>
            <Link href="/auth/signup" className="w-full sm:w-auto btn-ghost px-10 py-4 text-lg">
              List Your Brand
            </Link>
          </div>

          <div className="max-w-4xl mx-auto p-4 rounded-[40px] bg-white shadow-[0_0_100px_rgba(0,0,0,0.03)] border border-gray-50">
             <LiveCounter 
                orders={summary.totalOrders || 0} 
                agents={summary.activeAgents || 0} 
                businesses={summary.activeBusinesses || 0} 
             />
          </div>
        </div>
      </section>

      {/* Grid section divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>

      {/* Product Highlight */}
      <section className="py-40 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-3xl">
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-brand-black">Curated Selection</h2>
              <p className="text-xl text-gray-500 font-medium">High-performing products selected for our agent network. Scale with confidence using our verified catalog.</p>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-3 text-blue-600 font-bold text-xl hover:translate-x-1 transition-all">
               Full Catalog
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-12">
             <FeaturedProducts />
          </div>
        </div>
      </section>

      {/* Feature Bento Section */}
      <section className="py-40 px-4">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-8 h-auto">
            
            {/* Main Feature - Bento 1 */}
            <div className="md:col-span-4 md:row-span-1 p-12 bg-white rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all duration-500">
               <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold mb-8">⚡</div>
                  <h3 className="text-4xl font-black mb-6 tracking-tighter">Automated Commissions</h3>
                  <p className="text-xl text-gray-500 max-w-lg">Our engine calculates and approves commissions instantly once orders are verified. Scaling has never been this frictionless.</p>
               </div>
            </div>

            {/* Feature - Bento 2 */}
            <div className="md:col-span-2 md:row-span-1 p-12 bg-black text-white rounded-[40px] flex flex-col justify-between overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                  <svg className="w-60 h-60 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="0.5" strokeDasharray="4 4"/></svg>
               </div>
               <h3 className="text-3xl font-black tracking-tighter relative z-10">Real-Time Dashboards</h3>
               <p className="text-gray-400 relative z-10">Monitor your reach, clicks, and earnings live as agents across the network promote your brand.</p>
            </div>

            {/* Feature - Bento 3 */}
            <div className="md:col-span-2 md:row-span-1 p-12 bg-blue-50 rounded-[40px] flex flex-col justify-between hover:bg-blue-100 transition-colors">
               <h3 className="text-3xl font-black tracking-tighter text-blue-900 mb-8">Unique Referral Logic</h3>
               <p className="text-blue-700/70 font-medium">Every agent gets an encrypted cryptographic link to track and attribute every sale with 100% accuracy.</p>
            </div>

            {/* Feature - Bento 4 */}
            <div className="md:col-span-4 md:row-span-1 p-12 bg-white rounded-[40px] border border-gray-100 flex flex-col md:flex-row gap-12 items-center">
               <div className="flex-1">
                  <h3 className="text-[40px] font-black tracking-tighter mb-6 leading-none">Security Built-in. Not Bolted-on.</h3>
                  <p className="text-xl text-gray-500 mb-8">Enterprise-grade architecture ensures your funds and data are always protected from point of sale to payout.</p>
                  <Link href="/about" className="px-6 py-2 border border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-colors">Learn More</Link>
               </div>
               <div className="hidden lg:block flex-1 bg-gradient-to-br from-blue-500 to-violet-600 h-full rounded-[30px] p-8 text-white relative overflow-hidden">
                  <div className="absolute bottom-[-20%] right-[-10%] w-60 h-60 bg-white/20 blur-[80px] rounded-full"></div>
                  <div className="relative z-10 font-mono text-[10px] opacity-40">ENCRYPTION ACTIVE</div>
                  <div className="mt-4 text-2xl font-black tracking-widest uppercase">ZARIZO SECURE</div>
               </div>
            </div>
         </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-32 px-4 border-t border-gray-100">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
            <div className="max-w-sm">
               <h3 className="text-3xl font-black mb-8 tracking-tighter font-geist">Zarizo.</h3>
               <p className="text-lg text-gray-500 leading-relaxed font-medium">The future of distributed commerce in Africa. Scaling brands through trusted agent networks.</p>
            </div>
            <div className="grid grid-cols-2 gap-24">
               <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 font-geist">Platform</h4>
                  <ul className="space-y-4 font-medium">
                     <li><Link href="/shop" className="text-brand-black hover:text-blue-600 transition-colors">Explore</Link></li>
                     <li><Link href="/auth/signup" className="text-brand-black hover:text-blue-600 transition-colors">Register</Link></li>
                  </ul>
               </div>
               <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 font-geist">Connect</h4>
                  <ul className="space-y-4 font-medium">
                     <li><span className="text-brand-black cursor-pointer hover:text-blue-600 transition-colors">Twitter X</span></li>
                     <li><span className="text-brand-black cursor-pointer hover:text-blue-600 transition-colors">Telegram</span></li>
                  </ul>
               </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-gray-50 text-gray-400 text-xs font-bold uppercase tracking-tightest">
            © 2024 ZARIZO LABS. ALL SYSTEMS ACTIVE.
         </div>
      </footer>
    </div>
  )
}
