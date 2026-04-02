import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for admin access

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function getDemoUsers() {
  console.log('--- Zarizo Demo Accounts ---')
  
  // 1. Get businesses
  const { data: businesses } = await supabase.from('businesses').select('email, business_name').limit(2)
  console.log('\n🏢 Business Accounts:')
  businesses?.forEach(b => console.log(`- ${b.email} (Business: ${b.business_name})`))
  
  // 2. Get agents
  const { data: agents } = await supabase.from('agents').select('id, referral_code, users(email, full_name)').limit(3)
  console.log('\n🎓 Agent Accounts:')
  agents?.forEach(a => console.log(`- ${(a as any).users?.email} (Agent: ${(a as any).users?.full_name}, Code: ${a.referral_code})`))
  
  // 3. Get profiles for admin
  const { data: profiles } = await supabase.from('profiles').select('email, role').eq('role', 'admin').limit(1)
  console.log('\n🛡️ Admin Accounts:')
  profiles?.forEach(p => console.log(`- ${p.email} (Role: Admin)`))
  
  console.log('\n💡 Note: passwords are usually "password123" or similar in demo seeds.')
}

getDemoUsers()
