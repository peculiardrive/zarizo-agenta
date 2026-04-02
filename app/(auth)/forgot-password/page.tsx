'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-snow p-4">
        <div className="max-w-md w-full bg-white p-12 rounded-[40px] border border-border shadow-soft text-center">
          <div className="w-16 h-16 bg-teal-light text-teal rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-glow-teal animate-pulse">
             <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-2xl display text-ink mb-4">Email Sent</h1>
          <p className="text-text-2 mb-8">Instructions to reset your password have been sent to <span className="text-ink font-bold">{email}</span>.</p>
          <Link href="/auth/login" className="btn-gold block w-full py-4 font-bold uppercase tracking-widest text-sm">Back to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-snow p-4">
      <div className="max-w-md w-full bg-white p-10 rounded-[40px] border border-border shadow-soft">
        <div className="mb-8">
          <Link href="/auth/login" className="flex items-center gap-2 text-text-3 font-bold hover:text-gold uppercase tracking-widest text-xs mb-10 group">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
             Back to Login
          </Link>
          <h1 className="text-3xl display text-ink mb-2">Forgot Password?</h1>
          <p className="text-text-2">Enter your email and we'll send you reset instructions.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="uppercase tracking-widest text-xs font-bold text-text-3">Email address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@company.com" 
              className="h-14 rounded-2xl bg-mist border-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full btn-gold py-6 text-xl">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </div>
    </div>
  )
}
