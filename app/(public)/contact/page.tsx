import Link from 'next/link'
import { Mail, MessageCircle, ShieldCheck, FileText, Lock, Landmark, Scale } from 'lucide-react'

const policies = [
  { 
    title: 'Terms of Service', 
    href: '/terms', 
    icon: FileText, 
    desc: 'The rules of the Zarizo network for all users.' 
  },
  { 
    title: 'Privacy Policy', 
    href: '/privacy', 
    icon: Lock, 
    desc: 'How we protect your data and sensitive information.' 
  },
  { 
    title: 'Commission Policy', 
    href: '/commission-policy', 
    icon: Scale, 
    desc: 'Transparent rules on earnings and attribution.' 
  },
  { 
    title: 'Payout & Dispute Policy', 
    href: '/payout-policy', 
    icon: Landmark, 
    desc: 'Withdrawal schedules and handling of failed orders.' 
  }
]

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-snow selection:bg-brand-blue/20">
      {/* Header */}
      <section className="pt-32 pb-20 px-4 bg-white border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <div className="pill-badge mb-6 mx-auto">Support Center</div>
          <h1 className="text-5xl md:text-7xl display text-ink mb-6">How can we help?</h1>
          <p className="text-xl text-text-2 font-medium max-w-2xl mx-auto">
            Get answers to your questions, explore our legal framework, or talk to a person in our network hub.
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-24 px-4 overflow-visible">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 -mt-32">
          {/* WhatsApp Support */}
          <div className="bg-white p-12 rounded-[50px] border border-border shadow-soft flex flex-col items-center text-center group hover:translate-y-[-10px] transition-all">
            <div className="w-20 h-20 bg-teal-light text-teal rounded-[30px] flex items-center justify-center mb-8 shadow-glow-teal group-hover:rotate-12 transition-transform">
              <MessageCircle className="w-10 h-10" />
            </div>
            <h3 className="text-3xl display text-ink mb-4">Chat on WhatsApp</h3>
            <p className="text-text-2 mb-8 text-lg font-medium">Get instant support for orders, payouts, and technical issues from our active agent support team.</p>
            <a 
              href="https://wa.me/234000000000" 
              className="px-10 py-4 bg-teal text-white rounded-full font-bold shadow-glow-teal hover:scale-105 transition-all"
            >
              Start Chat (WhatsApp)
            </a>
          </div>

          {/* Email Support */}
          <div className="bg-ink p-12 rounded-[50px] border border-white/5 shadow-2xl flex flex-col items-center text-center group hover:translate-y-[-10px] transition-all">
            <div className="w-20 h-20 bg-white/5 text-white rounded-[30px] flex items-center justify-center mb-8 border border-white/10 group-hover:-rotate-12 transition-transform">
              <Mail className="w-10 h-10" />
            </div>
            <h3 className="text-3xl display text-white mb-4">Email Support</h3>
            <p className="text-text-3 mb-8 text-lg font-medium">For business inquiries, bulk sponsorships, and marketplace listings, send us a detailed request.</p>
            <a 
              href="mailto:support@zarizo.com" 
              className="px-10 py-4 bg-white text-ink rounded-full font-bold hover:scale-105 transition-all"
            >
              support@zarizo.com
            </a>
          </div>
        </div>
      </section>

      {/* Policies Grid */}
      <section className="py-32 px-4 bg-snow">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl display text-ink mb-6">Legal & Transparency</h2>
              <p className="text-xl text-text-2 font-medium">We build trust through clear rules and fair commission attribution.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {policies.map((p) => (
              <Link 
                key={p.href} 
                href={p.href} 
                className="bg-white p-8 rounded-[40px] border border-border hover:border-gold transition-all group"
              >
                <div className="w-12 h-12 bg-mist text-ink rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold-light group-hover:text-gold transition-colors">
                  <p.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-ink mb-4">{p.title}</h4>
                <p className="text-sm text-text-3 font-medium leading-relaxed">{p.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Badge */}
      <section className="pb-32 px-4">
        <div className="max-w-4xl mx-auto bg-white border border-border rounded-[50px] p-12 text-center">
          <div className="flex justify-center gap-4 mb-8">
             <ShieldCheck className="w-12 h-12 text-teal" />
          </div>
          <h3 className="text-2xl display text-ink mb-4">Your safety is our priority</h3>
          <p className="text-text-2 font-medium">Zarizo uses bank-grade encryption (SSL) and secure Paystack integration to ensure that all payments and personal data are 100% protected.</p>
        </div>
      </section>
    </div>
  )
}
