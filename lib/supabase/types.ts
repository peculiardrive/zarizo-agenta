export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          role: 'admin' | 'business' | 'agent'
          created_at: string
          updated_at: string
        }
        Insert: { id: string, email: string, full_name: string, role?: 'admin' | 'business' | 'agent' }
        Update: { id?: string, email?: string, full_name?: string, role?: 'admin' | 'business' | 'agent' }
      }
      businesses: {
        Row: {
          id: string
          user_id: string | null
          business_name: string
          owner_name: string
          email: string
          phone: string
          description: string | null
          status: 'pending' | 'active' | 'suspended'
          created_at: string
        }
      }
      agents: {
        Row: {
          id: string
          user_id: string | null
          referral_code: string
          bank_name: string
          account_number: string
          account_name: string
          status: 'pending' | 'active' | 'suspended'
          created_at: string
        }
      }
      products: {
        Row: {
          id: string
          business_id: string
          title: string
          description: string | null
          price: number
          image_url: string | null
          category: string
          commission_type: 'percent' | 'fixed'
          commission_value: number
          status: 'active' | 'draft' | 'out_of_stock'
          created_at: string
        }
      }
      orders: {
        Row: {
          id: string
          product_id: string
          business_id: string
          agent_id: string | null
          customer_name: string
          customer_phone: string
          customer_address: string
          quantity: number
          total_amount: number
          commission_amount: number
          order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          created_at: string
          updated_at: string
        }
      }
      commissions: {
        Row: {
          id: string
          order_id: string
          agent_id: string
          amount: number
          payout_status: 'pending' | 'approved' | 'paid' | 'rejected'
          paid_at: string | null
          created_at: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'order' | 'commission' | 'payout' | 'system'
          read: boolean
          created_at: string
        }
      }
      payouts: {
        Row: {
          id: string
          agent_id: string
          amount: number
          bank_name: string
          account_number: string
          account_name: string
          status: 'pending' | 'processing' | 'paid' | 'failed'
          reference: string | null
          created_at: string
        }
      }
      referral_clicks: {
        Row: {
          id: string
          agent_id: string
          product_id: string | null
          created_at: string
        }
      }
    }
  }
}
