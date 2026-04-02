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
        Insert: { id: string, email: string, full_name: string, role?: 'admin' | 'business' | 'agent', phone?: string | null }
        Update: { id?: string, email?: string, full_name?: string, role?: 'admin' | 'business' | 'agent', phone?: string | null }
        Relationships: []
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
        Insert: {
          id?: string
          user_id?: string | null
          business_name: string
          owner_name: string
          email: string
          phone: string
          description?: string | null
          status?: 'pending' | 'active' | 'suspended'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          business_name?: string
          owner_name?: string
          email?: string
          phone?: string
          description?: string | null
          status?: 'pending' | 'active' | 'suspended'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "businesses_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Insert: {
          id?: string
          user_id?: string | null
          referral_code: string
          bank_name: string
          account_number: string
          account_name: string
          status?: 'pending' | 'active' | 'suspended'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          referral_code?: string
          bank_name?: string
          account_number?: string
          account_name?: string
          status?: 'pending' | 'active' | 'suspended'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agents_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Insert: {
          id?: string
          business_id: string
          title: string
          description?: string | null
          price: number
          image_url?: string | null
          category: string
          commission_type: 'percent' | 'fixed'
          commission_value: number
          status?: 'active' | 'draft' | 'out_of_stock'
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          title?: string
          description?: string | null
          price?: number
          image_url?: string | null
          category?: string
          commission_type?: 'percent' | 'fixed'
          commission_value?: number
          status?: 'active' | 'draft' | 'out_of_stock'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          }
        ]
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
        Insert: {
          id?: string
          product_id: string
          business_id: string
          agent_id?: string | null
          customer_name: string
          customer_phone: string
          customer_address: string
          quantity: number
          total_amount: number
          commission_amount: number
          order_status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          business_id?: string
          agent_id?: string | null
          customer_name?: string
          customer_phone?: string
          customer_address?: string
          quantity?: number
          total_amount?: number
          commission_amount?: number
          order_status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_agent_id_fkey"
            columns: ["agent_id"]
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
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
        Insert: {
          id?: string
          order_id: string
          agent_id: string
          amount: number
          payout_status?: 'pending' | 'approved' | 'paid' | 'rejected'
          paid_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          agent_id?: string
          amount?: number
          payout_status?: 'pending' | 'approved' | 'paid' | 'rejected'
          paid_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_agent_id_fkey"
            columns: ["agent_id"]
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
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
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: 'order' | 'commission' | 'payout' | 'system'
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'order' | 'commission' | 'payout' | 'system'
          read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Insert: {
          id?: string
          agent_id: string
          amount: number
          bank_name: string
          account_number: string
          account_name: string
          status?: 'pending' | 'processing' | 'paid' | 'failed'
          reference?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          amount?: number
          bank_name?: string
          account_number?: string
          account_name?: string
          status?: 'pending' | 'processing' | 'paid' | 'failed'
          reference?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_agent_id_fkey"
            columns: ["agent_id"]
            referencedRelation: "agents"
            referencedColumns: ["id"]
          }
        ]
      }
      referral_clicks: {
        Row: {
          id: string
          agent_id: string
          product_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          product_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          product_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_clicks_agent_id_fkey"
            columns: ["agent_id"]
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_clicks_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
    }
  }
}
