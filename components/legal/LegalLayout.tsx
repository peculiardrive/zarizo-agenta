import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, FileText, Scale, Wallet, AlertCircle } from 'lucide-react'

export default function LegalLayout({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="min-h-screen bg-snow pt-32 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/contact" className="inline-flex items-center gap-2 text-text-3 font-bold uppercase tracking-widest text-[10px] mb-12 hover:text-gold transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Support Hub
        </Link>
        
        <div className="mb-16">
          <h1 className="text-6xl display text-ink mb-4">{title}</h1>
          <p className="text-xl text-text-2 font-medium">{subtitle}</p>
        </div>

        <div className="bg-white p-12 md:p-20 rounded-[60px] border border-border shadow-soft">
          <div className="prose prose-ink max-w-none prose-headings:display prose-headings:text-ink prose-p:text-text-2 prose-p:leading-relaxed prose-li:text-text-2 prose-strong:text-ink">
            {children}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-ink p-8 rounded-[40px] text-white flex items-center justify-between group cursor-pointer hover:-translate-y-1 transition-all">
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-text-3 mb-1">Need Clarification?</p>
                 <h4 className="text-xl font-bold">Contact Legal Team</h4>
              </div>
              <ShieldCheck className="w-10 h-10 text-gold group-hover:scale-110 transition-transform" />
           </div>
           <div className="bg-teal p-8 rounded-[40px] text-white flex items-center justify-between group cursor-pointer hover:-translate-y-1 transition-all">
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-teal-light mb-1">Downloads</p>
                 <h4 className="text-xl font-bold">Offline PDF Version</h4>
              </div>
              <FileText className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
           </div>
        </div>
      </div>
    </div>
  )
}
