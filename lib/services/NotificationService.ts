import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

export class NotificationService {
  private static supabase = createClient()

  static async sendInApp(userId: string, title: string, message: string, type: 'order' | 'commission' | 'payout' | 'system') {
    const { data, error } = await this.supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        read: false
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async sendSMS(phone: string, message: string) {
    // Stub for Termii API
    console.log(`Sending SMS to ${phone}: ${message}`)
    try {
      const response = await fetch(`${process.env.TERMII_BASE_URL}/api/sms/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phone,
          from: process.env.TERMII_SENDER_ID,
          sms: message,
          type: 'plain',
          channel: 'generic',
          api_key: process.env.TERMII_API_KEY
        })
      })
      return await response.json()
    } catch (e) {
      console.warn("SMS sending failed, likely missing credentials.", e)
    }
  }

  static async sendEmail(to: string, subject: string, template: string, data: any) {
    // Stub for Resend API
    console.log(`Sending Email to ${to}: ${subject} [${template}]`)
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL,
          to,
          subject,
          html: `<p>${subject}</p><p>${JSON.stringify(data)}</p>`
        })
      })
      return await response.json()
    } catch (e) {
      console.warn("Email sending failed, likely missing credentials.", e)
    }
  }

  static async markRead(notificationId: string) {
    const { error } = await this.supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)

    if (error) throw error
  }

  static async getUnread(userId: string) {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('read', false)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}
