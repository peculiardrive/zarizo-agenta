import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

export class ReferralService {
  private static supabase = createClient()

  static async generateCode(fullName: string): Promise<string> {
    const initials = fullName
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase()
    
    let isUnique = false
    let code = ''
    
    while (!isUnique) {
      const randomNum = Math.floor(100 + Math.random() * 900)
      code = initials + randomNum
      
      const { data, error } = await this.supabase
        .from('agents')
        .select('id')
        .eq('referral_code', code)
        .single()
      
      if (error && error.code === 'PGRST116') { // code meaning row not found
        isUnique = true
      }
    }

    return code
  }

  static async resolveAgent(refCode: string) {
    const { data, error } = await this.supabase
      .from('agents')
      .select('*, users(full_name)')
      .eq('referral_code', refCode)
      .eq('status', 'active')
      .single()

    if (error) return null
    return data
  }

  static async trackClick(agentId: string, productId: string) {
    const { error } = await this.supabase
      .from('referral_clicks')
      .insert({
        agent_id: agentId,
        product_id: productId
      })

    if (error) console.error("Could not track click.", error)
  }

  static async getConversionRate(agentId: string) {
    const { count: clicks } = await this.supabase
      .from('referral_clicks')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', agentId)

    const { count: orders } = await this.supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', agentId)

    if (!clicks) return '0.0%'
    return ((orders || 0) / clicks * 100).toFixed(1) + '%'
  }

  static buildReferralLink(agentCode: string, productId?: string) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zarizo.vercel.app'
    const shopUrl = productId ? `${baseUrl}/shop/${productId}` : `${baseUrl}/shop`
    return `${shopUrl}?ref=${agentCode}`
  }
}
