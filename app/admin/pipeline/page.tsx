import { OrderPipeline } from '@/components/dashboard/OrderPipeline'

export default function AdminPipelinePage() {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl display text-ink">Master Pipeline</h1>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-border shadow-soft">
           <div className="live-dot"></div>
           <span className="text-xs font-bold text-teal uppercase tracking-widest leading-none mt-0.5">Live Delivery Monitoring</span>
        </div>
      </div>
      
      <OrderPipeline />
    </div>
  )
}
