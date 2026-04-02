import { ActivityFeed } from '@/components/dashboard/ActivityFeed'

export default function AdminActivityPage() {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl display text-ink">Global Event Stream</h1>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-border shadow-soft">
           <div className="live-dot"></div>
           <span className="text-xs font-bold text-teal uppercase tracking-widest leading-none mt-0.5">Watching Realtime Events</span>
        </div>
      </div>
      
      <div className="bg-ink text-white p-12 rounded-[50px] border border-white/5 shadow-2xl h-[750px] flex flex-col">
         <ActivityFeed />
      </div>
    </div>
  )
}
