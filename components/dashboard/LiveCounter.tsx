'use client'

import { motion } from 'framer-motion'

export function LiveCounter({ orders, agents, businesses }: { orders: number, agents: number, businesses: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 pt-16 border-t border-white/10">
      {[
        { label: 'Orders Processed', value: orders, color: 'text-teal' },
        { label: 'Verified Agents', value: agents, color: 'text-gold' },
        { label: 'Active Businesses', value: businesses, color: 'text-white' }
      ].map((stat, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="text-center"
        >
          <div className={`text-4xl md:text-5xl display font-bold mb-2 ${stat.color}`}>
            {stat.value.toLocaleString()}
          </div>
          <div className="text-text-3 font-bold uppercase tracking-widest text-sm">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
