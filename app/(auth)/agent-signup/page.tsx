'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AgentSignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    bankName: '',
    accountName: '',
    accountNumber: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const generateReferralCode = (name: string) => {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
    const random = Math.floor(100 + Math.random() * 900)
    return initials + random
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: formData.fullName,
          role: 'agent'
        }
      }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (authData.user) {
      // Create user record in public.users
      const { error: userError } = await supabase.from('users').insert({
        id: authData.user.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: 'agent'
      })

      if (userError) {
        setError(userError.message)
        setLoading(false)
        return
      }

      const referralCode = generateReferralCode(formData.fullName)

      // Create agent record
      const { error: agentError } = await supabase.from('agents').insert({
        user_id: authData.user.id,
        referral_code: referralCode,
        bank_name: formData.bankName,
        account_name: formData.accountName,
        account_number: formData.accountNumber,
        status: 'pending'
      })

      if (agentError) {
        setError(agentError.message)
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-snow p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-border shadow-soft text-center">
          <div className="w-16 h-16 bg-teal-light text-teal rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h1 className="text-2xl display text-ink mb-4">You're Registered!</h1>
          <p className="text-text-2 mb-8">Your agent application is under review. You can log in once it's approved.</p>
          <Link href="/auth/login" className="btn-gold block">Back to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-snow">
      {/* Left Decoration / Info */}
      <div className="hidden lg:flex bg-ink p-20 flex-col justify-between relative overflow-hidden">
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gold/10 rounded-full filter blur-[120px] pointer-events-none"></div>
        <div className="relative z-10">
           <h2 className="text-6xl display text-white mb-10 leading-none">Turn your <span className="text-teal">influence</span> <br/>into income.</h2>
           <p className="text-xl text-text-3 font-medium max-w-md">Become a professional Zarizo agent and earn 10-30% commission on every sale you generate through your unique links.</p>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-8">
           {[
             { title: 'Zero Setup Cost', desc: 'Pick any product and start earning immediately.' },
             { title: 'Fast Withdrawals', desc: '₦5k minimum payout threshold, processed bi-weekly.' },
             { title: 'Secure Tracking', desc: 'Cryptographic referral attribution ensures you get paid for every click.' }
           ].map((feat, i) => (
             <div key={i} className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-gold flex-shrink-0 mt-1 shadow-glow font-bold flex items-center justify-center text-[10px] text-ink">✓</div>
                <div>
                   <h4 className="text-white font-bold mb-1">{feat.title}</h4>
                   <p className="text-sm text-text-3 font-medium">{feat.desc}</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white p-12 rounded-[40px] border border-border shadow-soft">
          <div className="text-center mb-10">
            <h1 className="text-3xl display text-ink mb-2">Join as Agent</h1>
            <p className="text-text-2 font-medium">Earn commissions by referring products</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="uppercase tracking-widest text-[10px] font-bold text-text-3">Full Name</Label>
              <Input 
                id="fullName" 
                className="h-14 rounded-2xl bg-mist border-0"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="uppercase tracking-widest text-[10px] font-bold text-text-3">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  className="h-14 rounded-2xl bg-mist border-0"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="uppercase tracking-widest text-[10px] font-bold text-text-3">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel"
                  className="h-14 rounded-2xl bg-mist border-0"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="bg-snow p-6 rounded-3xl space-y-4 border border-border">
              <Label className="uppercase tracking-widest text-[10px] font-bold text-text-3">Payout Details (Bank Info)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName" className="text-[10px] font-bold text-text-2">Bank Name</Label>
                  <Input 
                    id="bankName" 
                    className="h-12 rounded-xl bg-white border-border"
                    value={formData.bankName}
                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber" className="text-[10px] font-bold text-text-2">Account Number</Label>
                  <Input 
                    id="accountNumber" 
                    className="h-12 rounded-xl bg-white border-border"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountName" className="text-[10px] font-bold text-text-2">Account Name</Label>
                <Input 
                  id="accountName" 
                  className="h-12 rounded-xl bg-white border-border"
                  value={formData.accountName}
                  onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="uppercase tracking-widest text-[10px] font-bold text-text-3">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  className="h-14 rounded-2xl bg-mist border-0"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="uppercase tracking-widest text-[10px] font-bold text-text-3">Confirm</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  className="h-14 rounded-2xl bg-mist border-0"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required 
                />
              </div>
            </div>

            {error && <p className="text-danger text-sm font-bold">{error}</p>}

            <Button type="submit" name="submit-agent-signup" id="submit-agent-signup" disabled={loading} className="w-full btn-teal py-4 uppercase tracking-widest text-sm shadow-glow-teal">
              {loading ? 'Processing...' : 'Register as Agent'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-text-2 font-medium">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-gold font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
