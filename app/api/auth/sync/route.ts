import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const payload = await req.json()
  const { id, email, raw_user_meta_data } = payload.record

  const fullName = raw_user_meta_data?.full_name || 'Anonymous User'
  const role = raw_user_meta_data?.role || 'agent' // Default to agent

  // 1. Create user in public.users
  const { error: userError } = await supabaseAdmin
    .from('users')
    .upsert({
      id,
      email,
      full_name: fullName,
      role
    })

  if (userError) {
    console.error("Auth Sync Error (User):", userError)
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  // 2. If agent role, create agent record if not exists
  if (role === 'agent') {
    const initials = fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    const refCode = initials + Math.floor(100 + Math.random() * 900)

    await supabaseAdmin
      .from('agents')
      .insert({
        user_id: id,
        referral_code: refCode,
        status: 'pending'
      })
  }

  return NextResponse.json({ success: true })
}
