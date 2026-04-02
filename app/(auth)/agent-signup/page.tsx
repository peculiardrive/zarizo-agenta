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
    <div className="min-h-screen flex items-center justify-center bg-snow p-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-2xl border border-border shadow-soft">
        <div className="text-center mb-8">
          <h1 className="text-3xl display text-ink mb-2">Join as Agent</h1>
          <p className="text-text-2">Earn commissions by referring products</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName" 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="bg-mist p-4 rounded-xl space-y-4">
            <Label className="uppercase tracking-wider text-xs font-bold text-text-3">Payout Details (GTB, Zenith, Bank accounts)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input 
                  id="bankName" 
                  value={formData.bankName}
                  onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input 
                  id="accountNumber" 
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input 
                id="accountName" 
                value={formData.accountName}
                onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required 
              />
            </div>
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}

          <Button type="submit" name="submit-agent-signup" id="submit-agent-signup" disabled={loading} className="w-full btn-teal block">
            {loading ? 'Creating Account...' : 'Register as Agent'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-text-2">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-gold font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}
