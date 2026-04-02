'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSuccess(true)
    }, 2000)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-snow p-4">
        <div className="max-w-md w-full bg-white p-12 rounded-[40px] border border-border shadow-soft text-center">
          <div className="w-16 h-16 bg-gold-light text-gold rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">👋</div>
          <h1 className="text-2xl display text-ink mb-4">Message Sent!</h1>
          <p className="text-text-2 mb-8">Thanks for reaching out! A member of the Zarizo team will get back to you within 24 hours.</p>
          <button onClick={() => setSuccess(false)} className="btn-gold block w-full py-4 uppercase tracking-widest text-sm font-bold">Back to Contact</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-snow pt-40 pb-24 px-4 overflow-hidden relative">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-20">
        <div className="flex-1">
          <h1 className="text-6xl display text-ink mb-8 leading-tight">Get in <span className="text-gold">Touch.</span></h1>
          <p className="text-xl text-text-2 mb-12">Have questions about Zarizo or your partnership? Our support team is here to help you expand your footprint.</p>

          <div className="space-y-10 group">
             {[
               { icon: <Mail />, title: 'Email Us', desc: 'support@zarizo.com', link: 'mailto:support@zarizo.com' },
               { icon: <Phone />, title: 'Call Us', desc: '+234 800 000 0000', link: 'tel:+2348000000000' },
               { icon: <MapPin />, title: 'Visit Us', desc: 'Lagos, Nigeria', link: '#' }
             ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 group/item hover:translate-x-3 transition-transform duration-300">
                   <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-ink border border-border shadow-soft group-hover/item:bg-gold-light group-hover/item:border-gold transition-all duration-300">
                      {item.icon}
                   </div>
                   <div>
                      <h3 className="font-bold text-ink uppercase tracking-wider text-xs mb-1 text-text-3">{item.title}</h3>
                      <a href={item.link} className="text-xl font-bold text-ink hover:text-gold transition-colors">{item.desc}</a>
                   </div>
                </div>
             ))}
          </div>
        </div>

        <div className="flex-1">
           <form onSubmit={handleSubmit} className="bg-white p-12 rounded-[40px] border border-border shadow-soft space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="name" className="uppercase tracking-widest text-xs font-bold text-text-3">Your Name</Label>
                    <Input id="name" required className="h-14 rounded-2xl bg-mist border-0" />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="email" className="uppercase tracking-widest text-xs font-bold text-text-3">Email Address</Label>
                    <Input id="email" type="email" required className="h-14 rounded-2xl bg-mist border-0" />
                 </div>
              </div>
              <div className="space-y-2">
                 <Label htmlFor="subject" className="uppercase tracking-widest text-xs font-bold text-text-3">Subject</Label>
                 <Input id="subject" required className="h-14 rounded-2xl bg-mist border-0" />
              </div>
              <div className="space-y-2">
                 <Label htmlFor="message" className="uppercase tracking-widest text-xs font-bold text-text-3">Message</Label>
                 <textarea id="message" required className="w-full h-40 rounded-2xl bg-mist border-0 p-4 text-sm focus:ring-2 focus:ring-gold outline-none resize-none" />
              </div>

              <Button disabled={submitting} type="submit" className="w-full btn-gold py-6 text-xl flex items-center justify-center gap-3">
                 {submitting ? 'Sending...' : (
                    <>
                       <span>Send Message</span>
                       <Send className="w-5 h-5" />
                    </>
                 )}
              </Button>
           </form>
        </div>
      </div>
    </div>
  )
}
