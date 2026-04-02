export default function AboutPage() {
  return (
    <div className="min-h-screen bg-snow pt-40 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl display text-ink mb-8">Empowering African <br /><span className="text-gold">Digital Commerce.</span></h1>
        <p className="text-xl text-text-2 leading-relaxed mb-16">
          Zarizo is a mission-driven ecosystem built to bridge the gap between quality African businesses and the digital marketplace. We believe in the power of social commerce and the entrepreneurial spirit of independent sales agents.
        </p>

        <div className="grid md:grid-cols-2 gap-8 text-left mb-24">
          <div className="stat-card">
            <div className="text-4xl mb-6">🎯</div>
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-text-2">To provide a robust, agent-first sales infrastructure that allows businesses to scale effortlessly and individuals to build profitable referral businesses from anywhere.</p>
          </div>
          <div className="stat-card">
            <div className="text-4xl mb-6">💡</div>
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-text-2">To become the backbone of decentralized commerce across Africa, powering the next generation of sales professionals and high-growth brands.</p>
          </div>
        </div>

        <div className="py-24 border-t border-border mt-16">
           <h2 className="text-4xl display text-ink mb-12 text-center md:text-left uppercase tracking-widest text-sm font-bold text-text-3">The Zarizo Story</h2>
           <p className="text-lg text-text-2 leading-relaxed text-left">
              Founded in 2024, our team witnessed the hurdles businesses faced scaling sales in highly fragmented markets. At the same time, we saw a massive pool of talented sales agents waiting for the right products to represent. <br /><br />
              Zarizo was built to automate the trust and attribution between these two groups, creating a frictionless sales machine.
           </p>
        </div>
      </div>
    </div>
  )
}
