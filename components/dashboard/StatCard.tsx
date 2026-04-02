'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  variant: 'ink' | 'gold' | 'teal' | 'danger'
}

const variants = {
  ink: 'border-ink/10 text-ink shadow-soft group-hover:shadow-glow',
  gold: 'border-gold/10 text-gold shadow-gold-light group-hover:shadow-glow',
  teal: 'border-teal/10 text-teal shadow-teal-light group-hover:shadow-glow-teal',
  danger: 'border-danger/10 text-danger shadow-danger-light group-hover:shadow-danger',
}

const iconColors = {
  ink: 'bg-mist text-ink',
  gold: 'bg-gold-light text-gold',
  teal: 'bg-teal-light text-teal',
  danger: 'bg-danger/10 text-danger',
}

export function StatCard({ label, value, icon, variant }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "group flex flex-col p-6 rounded-3xl border bg-white transition-all duration-300",
        variants[variant]
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform",
        iconColors[variant]
      )}>
        {icon}
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-text-3 mb-1 line-clamp-1">{label}</p>
      <h3 className="text-2xl display font-bold truncate">{value}</h3>
    </motion.div>
  )
}
