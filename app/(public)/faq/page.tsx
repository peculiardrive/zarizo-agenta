import React from 'react'
import { Plus, Minus, Search } from 'lucide-react'

const FAQS = [
  {
    category: 'For Agents',
    questions: [
      { q: "How do I start earning?", a: "Register as an agent, wait for approval, then browse the product catalog to pick an item. Share your unique referral link; whenever someone clicks and buys, you earn a commission." },
      { q: "How much can I earn?", a: "Commissions vary by product, usually between 5% and 20% of the sale price. Your total earnings depend on the volume and value of sales generated through your links." },
      { q: "When do I get paid?", a: "We process payouts twice a week (Tuesdays and Fridays). You can request a withdrawal once your approved earnings reach the ₦5,000 minimum threshold." }
    ]
  },
  {
    category: 'For Businesses',
    questions: [
      { q: "Is it free to list products?", a: "Yes, listing products on Zarizo is completely free. We prioritize a performance-based model where we only benefit when you make a sale." },
      { q: "How are orders fulfilled?", a: "When an order is placed, you will receive an immediate notification in your business dashboard with the customer's delivery details. You are responsible for shipping the item." },
      { q: "What if a customer returns a product?", a: "Our refund policy outlines the valid reasons for returns. If a refund is processed, the agent's commission is automatically reversed." }
    ]
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-snow pt-40 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-24">
           <h1 className="text-6xl display text-ink mb-6">Frequently Asked <span className="text-gold italic">Questions</span></h1>
           <p className="text-xl text-text-2 font-medium">Everything you need to know about the Zarizo network.</p>
        </div>

        <div className="space-y-16">
           {FAQS.map((group, idx) => (
              <div key={idx} className="space-y-8">
                 <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-ink border-l-4 border-gold pl-6">{group.category}</h2>
                 <div className="space-y-4">
                    {group.questions.map((faq, i) => (
                       <details key={i} className="group bg-white rounded-[32px] border border-border shadow-soft overflow-hidden transition-all hover:border-gold">
                          <summary className="flex items-center justify-between p-8 cursor-pointer list-none">
                             <h4 className="text-lg font-bold text-ink pr-8">{faq.q}</h4>
                             <div className="w-8 h-8 bg-snow rounded-xl flex items-center justify-center text-gold group-open:bg-gold group-open:text-ink transition-colors">
                                <Plus className="w-5 h-5 group-open:hidden" />
                                <Minus className="w-5 h-5 hidden group-open:block" />
                             </div>
                          </summary>
                          <div className="px-8 pb-8 text-text-2 leading-relaxed font-medium">
                             {faq.a}
                          </div>
                       </details>
                    ))}
                 </div>
              </div>
           ))}
        </div>

        <div className="mt-24 p-12 bg-ink rounded-[60px] text-center text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent"></div>
           <h3 className="text-3xl display mb-4">Still have questions?</h3>
           <p className="text-text-3 mb-10 max-w-md mx-auto">Our support team is active on WhatsApp and Email to help you with anything.</p>
           <div className="flex justify-center flex-wrap gap-4">
               <a href="https://wa.me/234000000000" className="btn-gold px-10 py-4 font-bold">Chat on WhatsApp</a>
               <a href="mailto:support@zarizo.com" className="bg-white/10 hover:bg-white/20 px-10 py-4 rounded-xl font-bold transition-all border border-white/5">Email Support</a>
           </div>
        </div>
      </div>
    </div>
  )
}
