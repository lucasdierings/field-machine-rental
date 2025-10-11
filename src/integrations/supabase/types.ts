export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          cep: string
          city: string
          complement: string | null
          country: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          latitude: number | null
          longitude: number | null
          neighborhood: string
          number: string | null
          state: string
          street: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cep: string
          city: string
          complement?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          latitude?: number | null
          longitude?: number | null
          neighborhood: string
          number?: string | null
          state: string
          street: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cep?: string
          city?: string
          complement?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          latitude?: number | null
          longitude?: number | null
          neighborhood?: string
          number?: string | null
          state?: string
          street?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      alerts: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_active: boolean | null
          location: Json | null
          max_power: number | null
          min_power: number | null
          price_range: Json | null
          radius_km: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          location?: Json | null
          max_power?: number | null
          min_power?: number | null
          price_range?: Json | null
          radius_km?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          location?: Json | null
          max_power?: number | null
          min_power?: number | null
          price_range?: Json | null
          radius_km?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      analytics: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          page_url: string | null
          search_query: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          page_url?: string | null
          search_query?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          page_url?: string | null
          search_query?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          views: number | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          views?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          created_at: string | null
          delivery_address: Json | null
          delivery_cost: number | null
          end_date: string
          id: string
          insurance_cost: number | null
          machine_id: string | null
          negotiation_history: Json | null
          notes: string | null
          operator_cost: number | null
          operator_included: boolean | null
          owner_id: string | null
          payment_status: string | null
          platform_fee: number | null
          price_type: string | null
          quantity: number | null
          renter_id: string | null
          start_date: string
          status: string | null
          total_price: number | null
          updated_at: string | null
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          delivery_address?: Json | null
          delivery_cost?: number | null
          end_date: string
          id?: string
          insurance_cost?: number | null
          machine_id?: string | null
          negotiation_history?: Json | null
          notes?: string | null
          operator_cost?: number | null
          operator_included?: boolean | null
          owner_id?: string | null
          payment_status?: string | null
          platform_fee?: number | null
          price_type?: string | null
          quantity?: number | null
          renter_id?: string | null
          start_date: string
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          delivery_address?: Json | null
          delivery_cost?: number | null
          end_date?: string
          id?: string
          insurance_cost?: number | null
          machine_id?: string | null
          negotiation_history?: Json | null
          notes?: string | null
          operator_cost?: number | null
          operator_included?: boolean | null
          owner_id?: string | null
          payment_status?: string | null
          platform_fee?: number | null
          price_type?: string | null
          quantity?: number | null
          renter_id?: string | null
          start_date?: string
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "admin_machines_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "available_machines_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machine_pricing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machine_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_renter_id_fkey"
            columns: ["renter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      kv_store_d2a77f5f: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      leads: {
        Row: {
          categoria: string | null
          cep: string | null
          created_at: string
          email: string
          id: string
          raio_km: number | null
          status: string | null
        }
        Insert: {
          categoria?: string | null
          cep?: string | null
          created_at?: string
          email: string
          id?: string
          raio_km?: number | null
          status?: string | null
        }
        Update: {
          categoria?: string | null
          cep?: string | null
          created_at?: string
          email?: string
          id?: string
          raio_km?: number | null
          status?: string | null
        }
        Relationships: []
      }
      machine_images: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          image_url: string
          is_primary: boolean | null
          machine_id: string
          order_index: number | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          machine_id: string
          order_index?: number | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          machine_id?: string
          order_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "machine_images_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "admin_machines_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machine_images_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "available_machines_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machine_images_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machine_pricing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machine_images_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machine_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machine_images_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
      machines: {
        Row: {
          available_from: string | null
          available_until: string | null
          brand: string | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          insurance_status: boolean | null
          location: Json | null
          maintenance_date: string | null
          min_rental_days: number | null
          model: string | null
          name: string
          operator_cost_per_day: number | null
          owner_id: string | null
          price_day: number | null
          price_hectare: number | null
          price_hour: number | null
          radius_km: number | null
          requires_operator: boolean | null
          specifications: Json | null
          status: string | null
          total_hours_worked: number | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          available_from?: string | null
          available_until?: string | null
          brand?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          insurance_status?: boolean | null
          location?: Json | null
          maintenance_date?: string | null
          min_rental_days?: number | null
          model?: string | null
          name: string
          operator_cost_per_day?: number | null
          owner_id?: string | null
          price_day?: number | null
          price_hectare?: number | null
          price_hour?: number | null
          radius_km?: number | null
          requires_operator?: boolean | null
          specifications?: Json | null
          status?: string | null
          total_hours_worked?: number | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          available_from?: string | null
          available_until?: string | null
          brand?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          insurance_status?: boolean | null
          location?: Json | null
          maintenance_date?: string | null
          min_rental_days?: number | null
          model?: string | null
          name?: string
          operator_cost_per_day?: number | null
          owner_id?: string | null
          price_day?: number | null
          price_hectare?: number | null
          price_hour?: number | null
          radius_km?: number | null
          requires_operator?: boolean | null
          specifications?: Json | null
          status?: string | null
          total_hours_worked?: number | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "machines_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          read_at: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          read_at?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "admin_bookings_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string
          read: boolean | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message: string
          read?: boolean | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string
          read?: boolean | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          communication_rating: number | null
          created_at: string | null
          equipment_rating: number | null
          id: string
          punctuality_rating: number | null
          rating: number | null
          reviewed_id: string | null
          reviewer_id: string | null
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          communication_rating?: number | null
          created_at?: string | null
          equipment_rating?: number | null
          id?: string
          punctuality_rating?: number | null
          rating?: number | null
          reviewed_id?: string | null
          reviewer_id?: string | null
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          communication_rating?: number | null
          created_at?: string | null
          equipment_rating?: number | null
          id?: string
          punctuality_rating?: number | null
          rating?: number | null
          reviewed_id?: string | null
          reviewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "admin_bookings_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewed_id_fkey"
            columns: ["reviewed_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_documents: {
        Row: {
          created_at: string | null
          document_type: string
          document_url: string
          id: string
          rejection_reason: string | null
          updated_at: string | null
          user_id: string
          verified: boolean | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          document_url: string
          id?: string
          rejection_reason?: string | null
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          document_url?: string
          id?: string
          rejection_reason?: string | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address: Json | null
          auth_user_id: string
          cpf_cnpj: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          profile_image: string | null
          rating: number | null
          total_rentals: number | null
          total_services: number | null
          total_transactions: number | null
          updated_at: string
          user_types: string[] | null
          verified: boolean | null
        }
        Insert: {
          address?: Json | null
          auth_user_id: string
          cpf_cnpj?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          profile_image?: string | null
          rating?: number | null
          total_rentals?: number | null
          total_services?: number | null
          total_transactions?: number | null
          updated_at?: string
          user_types?: string[] | null
          verified?: boolean | null
        }
        Update: {
          address?: Json | null
          auth_user_id?: string
          cpf_cnpj?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          profile_image?: string | null
          rating?: number | null
          total_rentals?: number | null
          total_services?: number | null
          total_transactions?: number | null
          updated_at?: string
          user_types?: string[] | null
          verified?: boolean | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          address: Json | null
          auth_user_id: string | null
          cpf_cnpj: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          profile_image: string | null
          rating: number | null
          total_transactions: number | null
          updated_at: string | null
          user_type: string | null
          verified: boolean | null
        }
        Insert: {
          address?: Json | null
          auth_user_id?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          profile_image?: string | null
          rating?: number | null
          total_transactions?: number | null
          updated_at?: string | null
          user_type?: string | null
          verified?: boolean | null
        }
        Update: {
          address?: Json | null
          auth_user_id?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          profile_image?: string | null
          rating?: number | null
          total_transactions?: number | null
          updated_at?: string | null
          user_type?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      admin_analytics_summary: {
        Row: {
          date: string | null
          event_count: number | null
          event_type: string | null
          unique_sessions: number | null
          unique_users: number | null
        }
        Relationships: []
      }
      admin_bookings_list: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string | null
          machine_category: string | null
          machine_name: string | null
          owner_email: string | null
          owner_name: string | null
          owner_phone: string | null
          payment_status: string | null
          platform_fee: number | null
          renter_email: string | null
          renter_name: string | null
          renter_phone: string | null
          start_date: string | null
          status: string | null
          total_price: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      admin_machines_list: {
        Row: {
          brand: string | null
          category: string | null
          completed_bookings: number | null
          created_at: string | null
          id: string | null
          location: Json | null
          model: string | null
          name: string | null
          owner_email: string | null
          owner_id: string | null
          owner_name: string | null
          owner_phone: string | null
          owner_verified: boolean | null
          price_day: number | null
          price_hectare: number | null
          price_hour: number | null
          status: string | null
          total_bookings: number | null
          total_revenue: number | null
          year: number | null
        }
        Relationships: [
          {
            foreignKeyName: "machines_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_pending_documents: {
        Row: {
          cpf_cnpj: string | null
          created_at: string | null
          document_type: string | null
          document_url: string | null
          id: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
          user_phone: string | null
        }
        Relationships: []
      }
      admin_platform_stats: {
        Row: {
          active_bookings: number | null
          available_machines: number | null
          average_rating: number | null
          completed_bookings: number | null
          confirmed_bookings: number | null
          new_bookings_30d: number | null
          new_leads_30d: number | null
          new_machines_30d: number | null
          new_users_30d: number | null
          new_users_7d: number | null
          pending_bookings: number | null
          rented_machines: number | null
          revenue_30d: number | null
          total_bookings: number | null
          total_leads: number | null
          total_machines: number | null
          total_platform_fees: number | null
          total_revenue: number | null
          total_reviews: number | null
          total_users: number | null
          verified_users: number | null
        }
        Relationships: []
      }
      admin_users_list: {
        Row: {
          auth_user_id: string | null
          cpf_cnpj: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          last_sign_in_at: string | null
          machines_count: number | null
          pending_documents: number | null
          phone: string | null
          profile_image: string | null
          rating: number | null
          rentals_count: number | null
          services_count: number | null
          total_transactions: number | null
          updated_at: string | null
          user_types: string[] | null
          verified: boolean | null
        }
        Relationships: []
      }
      available_machines_view: {
        Row: {
          all_images: Json | null
          available_from: string | null
          available_until: string | null
          brand: string | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string | null
          images: string[] | null
          insurance_status: boolean | null
          location: Json | null
          machine_rating: number | null
          maintenance_date: string | null
          min_rental_days: number | null
          model: string | null
          name: string | null
          operator_cost_per_day: number | null
          owner_id: string | null
          owner_image: string | null
          owner_name: string | null
          owner_phone: string | null
          owner_rating: number | null
          price_day: number | null
          price_hectare: number | null
          price_hour: number | null
          primary_image: string | null
          radius_km: number | null
          requires_operator: boolean | null
          specifications: Json | null
          status: string | null
          total_hours_worked: number | null
          total_rentals: number | null
          updated_at: string | null
          year: number | null
        }
        Relationships: [
          {
            foreignKeyName: "machines_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      machine_pricing: {
        Row: {
          id: string | null
          price_day: number | null
          price_hectare: number | null
          price_hour: number | null
        }
        Insert: {
          id?: string | null
          price_day?: number | null
          price_hectare?: number | null
          price_hour?: number | null
        }
        Update: {
          id?: string | null
          price_day?: number | null
          price_hectare?: number | null
          price_hour?: number | null
        }
        Relationships: []
      }
      machine_public: {
        Row: {
          brand: string | null
          category: string | null
          id: string | null
          images: string[] | null
          model: string | null
          name: string | null
          specifications: Json | null
          status: string | null
          year: number | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          id?: string | null
          images?: string[] | null
          model?: string | null
          name?: string | null
          specifications?: Json | null
          status?: string | null
          year?: number | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          id?: string | null
          images?: string[] | null
          model?: string | null
          name?: string | null
          specifications?: Json | null
          status?: string | null
          year?: number | null
        }
        Relationships: []
      }
      user_stats_view: {
        Row: {
          auth_user_id: string | null
          completed_rentals_as_owner: number | null
          completed_rentals_as_renter: number | null
          full_name: string | null
          profile_image: string | null
          rating: number | null
          total_earned: number | null
          total_machines: number | null
          total_reviews_received: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_approve_document: {
        Args: { document_id: string }
        Returns: boolean
      }
      admin_deactivate_machine: {
        Args: { machine_id: string; reason?: string }
        Returns: boolean
      }
      admin_reject_document: {
        Args: { document_id: string; reason: string }
        Returns: boolean
      }
      calculate_booking_price: {
        Args: {
          end_dt: string
          machine_uuid: string
          pricing_type: string
          quantity_val?: number
          start_dt: string
        }
        Returns: Json
      }
      calculate_user_rating: {
        Args: { user_uuid: string }
        Returns: number
      }
      can_user_review: {
        Args: { booking_uuid: string; user_uuid: string }
        Returns: boolean
      }
      check_machine_availability: {
        Args:
          | { end_dt: string; machine_uuid: string; start_dt: string }
          | {
              p_booking_id?: string
              p_end_date: string
              p_machine_id: string
              p_start_date: string
            }
        Returns: boolean
      }
      create_notification: {
        Args: {
          notif_link?: string
          notif_message: string
          notif_title: string
          notif_type: string
          user_uuid: string
        }
        Returns: string
      }
      current_auth_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      validate_cnpj: {
        Args: { cnpj: string }
        Returns: boolean
      }
      validate_cpf: {
        Args: { cpf: string }
        Returns: boolean
      }
      validate_cpf_cnpj: {
        Args: { doc: string }
        Returns: boolean
      }
      validate_email: {
        Args: { email: string }
        Returns: boolean
      }
      validate_phone_br: {
        Args: { phone: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "owner" | "renter" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "owner", "renter", "user"],
    },
  },
} as const
