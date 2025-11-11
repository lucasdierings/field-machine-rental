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
          has_munck: boolean | null
          id: string
          images: string[] | null
          insurance_status: boolean | null
          load_capacity_kg: number | null
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
          price_per_km: number | null
          price_per_ton: number | null
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
          has_munck?: boolean | null
          id?: string
          images?: string[] | null
          insurance_status?: boolean | null
          load_capacity_kg?: number | null
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
          price_per_km?: number | null
          price_per_ton?: number | null
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
          has_munck?: boolean | null
          id?: string
          images?: string[] | null
          insurance_status?: boolean | null
          load_capacity_kg?: number | null
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
          price_per_km?: number | null
          price_per_ton?: number | null
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
      [_ in never]: never
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
      calculate_user_rating: { Args: { user_uuid: string }; Returns: number }
      can_user_review: {
        Args: { booking_uuid: string; user_uuid: string }
        Returns: boolean
      }
      check_machine_availability:
        | {
            Args: {
              p_booking_id?: string
              p_end_date: string
              p_machine_id: string
              p_start_date: string
            }
            Returns: boolean
          }
        | {
            Args: { end_dt: string; machine_uuid: string; start_dt: string }
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
      current_auth_user_id: { Args: never; Returns: string }
      get_admin_analytics_summary: {
        Args: { p_end_date?: string; p_start_date?: string }
        Returns: {
          date: string
          event_count: number
          event_type: string
          unique_sessions: number
          unique_users: number
        }[]
      }
      get_admin_bookings_list: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: {
          created_at: string
          end_date: string
          id: string
          machine_category: string
          machine_name: string
          owner_email: string
          owner_name: string
          owner_phone: string
          payment_status: string
          platform_fee: number
          renter_email: string
          renter_name: string
          renter_phone: string
          start_date: string
          status: string
          total_price: number
          updated_at: string
        }[]
      }
      get_admin_machines_list: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: {
          brand: string
          category: string
          completed_bookings: number
          created_at: string
          id: string
          location: Json
          model: string
          name: string
          owner_email: string
          owner_id: string
          owner_name: string
          owner_phone: string
          owner_verified: boolean
          price_day: number
          price_hectare: number
          price_hour: number
          status: string
          total_bookings: number
          total_revenue: number
          year: number
        }[]
      }
      get_admin_pending_documents: {
        Args: never
        Returns: {
          cpf_cnpj: string
          created_at: string
          document_type: string
          document_url: string
          id: string
          user_email: string
          user_id: string
          user_name: string
          user_phone: string
        }[]
      }
      get_admin_platform_stats: {
        Args: never
        Returns: {
          active_bookings: number
          available_machines: number
          average_rating: number
          completed_bookings: number
          confirmed_bookings: number
          new_bookings_30d: number
          new_leads_30d: number
          new_machines_30d: number
          new_users_30d: number
          new_users_7d: number
          pending_bookings: number
          rented_machines: number
          revenue_30d: number
          total_bookings: number
          total_leads: number
          total_machines: number
          total_platform_fees: number
          total_revenue: number
          total_reviews: number
          total_users: number
          verified_users: number
        }[]
      }
      get_admin_users_list: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: {
          auth_user_id: string
          cpf_cnpj: string
          created_at: string
          email: string
          full_name: string
          id: string
          last_sign_in_at: string
          machines_count: number
          pending_documents: number
          phone: string
          profile_image: string
          rating: number
          rentals_count: number
          services_count: number
          total_transactions: number
          updated_at: string
          user_types: string[]
          verified: boolean
        }[]
      }
      get_public_profile: {
        Args: { profile_user_id: string }
        Returns: {
          city: string
          full_name: string
          id: string
          profile_image: string
          rating: number
          state: string
          total_rentals: number
          total_services: number
          verified: boolean
        }[]
      }
      validate_cnpj: { Args: { cnpj: string }; Returns: boolean }
      validate_cpf: { Args: { cpf: string }; Returns: boolean }
      validate_cpf_cnpj: { Args: { doc: string }; Returns: boolean }
      validate_email: { Args: { email: string }; Returns: boolean }
      validate_phone_br: { Args: { phone: string }; Returns: boolean }
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
