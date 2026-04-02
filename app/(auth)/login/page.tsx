'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.refresh()
    }
  }

  const handleDemoLogin = async (role: 'admin' | 'business' | 'agent') => {
    setLoading(true)
    setError(null)
    
    // In a real app we'd have specific demo accounts
    // For this prototype, I'll log a warning and let the user know
    const demoAccounts = {
      admin: { email: 'admin@zarizo.com', password: 'password123' },
      business: { email: 'biz@naturalglow.com', password: 'password123' },
      agent: { email: 'tunde@zarizo.com', password: 'password123' }
    }

    const { error } = await supabase.auth.signInWithPassword(demoAccounts[role])

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-snow p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-border shadow-soft">
        <div className="text-center mb-8">
          <h1 className="text-3xl display text-ink mb-2">Welcome Back</h1>
          <p className="text-text-2">Login to your Zarizo account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/auth/forgot-password" title="Forgot Password" className="text-sm text-gold hover:text-gold-2">Forgot password?</Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}

          <Button type="submit" name="submit-login" id="submit-login" disabled={loading} className="w-full btn-gold text-ink font-bold">
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-center text-text-3 mb-4 uppercase tracking-wider font-bold">Or use demo account</p>
          <div className="grid grid-cols-3 gap-2">
            <Button onClick={() => handleDemoLogin('admin')} name="demo login admin" id="demo login admin" variant="outline" className="text-xs">Admin</Button>
            <Button onClick={() => handleDemoLogin('business')} name="demo login business" id="demo login business" variant="outline" className="text-xs">Business</Button>
            <Button onClick={() => handleDemoLogin('agent')} name="demo login agent" id="demo login agent" variant="outline" className="text-xs">Agent</Button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-text-2">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-gold font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
