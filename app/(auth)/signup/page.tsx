'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function BusinessSignupPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

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
          full_name: formData.ownerName,
          role: 'business'
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
        full_name: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        role: 'business'
      })

      if (userError) {
        setError(userError.message)
        setLoading(false)
        return
      }

      // Create business record
      const { error: bizError } = await supabase.from('businesses').insert({
        user_id: authData.user.id,
        business_name: formData.businessName,
        owner_name: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        description: formData.description,
        status: 'pending'
      })

      if (bizError) {
        setError(bizError.message)
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
          <h1 className="text-2xl display text-ink mb-4">Application Submitted</h1>
          <p className="text-text-2 mb-8">Your business application is being reviewed. We will notify you once it's approved.</p>
          <Link href="/auth/login" className="btn-gold block">Back to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-snow p-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-2xl border border-border shadow-soft">
        <div className="text-center mb-8">
          <h1 className="text-3xl display text-ink mb-2">Register Business</h1>
          <p className="text-text-2">Join Zarizo and scale your sales</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input 
                id="businessName" 
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input 
                id="ownerName" 
                value={formData.ownerName}
                onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                required 
              />
            </div>
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

          <div className="space-y-2">
            <Label htmlFor="description">Business Description</Label>
            <textarea 
              id="description"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
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

          <Button type="submit" name="submit-biz-signup" id="submit-biz-signup" disabled={loading} className="w-full btn-gold">
            {loading ? 'Creating Account...' : 'Submit Application'}
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
