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
          created_at: string | null
          end_date: string
          id: string
          machine_id: string | null
          negotiation_history: Json | null
          owner_id: string | null
          payment_status: string | null
          platform_fee: number | null
          price_type: string | null
          quantity: number | null
          renter_id: string | null
          start_date: string
          status: string | null
          total_price: number | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          machine_id?: string | null
          negotiation_history?: Json | null
          owner_id?: string | null
          payment_status?: string | null
          platform_fee?: number | null
          price_type?: string | null
          quantity?: number | null
          renter_id?: string | null
          start_date: string
          status?: string | null
          total_price?: number | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          machine_id?: string | null
          negotiation_history?: Json | null
          owner_id?: string | null
          payment_status?: string | null
          platform_fee?: number | null
          price_type?: string | null
          quantity?: number | null
          renter_id?: string | null
          start_date?: string
          status?: string | null
          total_price?: number | null
        }
        Relationships: [
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
      machine_bookings: {
        Row: {
          created_at: string
          end_date: string
          id: string
          machine_id: string
          owner_id: string
          renter_id: string
          start_date: string
          status: string | null
          total_price: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          machine_id: string
          owner_id: string
          renter_id: string
          start_date: string
          status?: string | null
          total_price?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          machine_id?: string
          owner_id?: string
          renter_id?: string
          start_date?: string
          status?: string | null
          total_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "machine_bookings_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machine_pricing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machine_bookings_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machine_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machine_bookings_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
      machines: {
        Row: {
          brand: string | null
          category: string
          created_at: string | null
          id: string
          images: string[] | null
          insurance_status: boolean | null
          location: Json | null
          maintenance_date: string | null
          model: string | null
          name: string
          owner_id: string | null
          price_day: number | null
          price_hectare: number | null
          price_hour: number | null
          radius_km: number | null
          specifications: Json | null
          status: string | null
          total_hours_worked: number | null
          year: number | null
        }
        Insert: {
          brand?: string | null
          category: string
          created_at?: string | null
          id?: string
          images?: string[] | null
          insurance_status?: boolean | null
          location?: Json | null
          maintenance_date?: string | null
          model?: string | null
          name: string
          owner_id?: string | null
          price_day?: number | null
          price_hectare?: number | null
          price_hour?: number | null
          radius_km?: number | null
          specifications?: Json | null
          status?: string | null
          total_hours_worked?: number | null
          year?: number | null
        }
        Update: {
          brand?: string | null
          category?: string
          created_at?: string | null
          id?: string
          images?: string[] | null
          insurance_status?: boolean | null
          location?: Json | null
          maintenance_date?: string | null
          model?: string | null
          name?: string
          owner_id?: string | null
          price_day?: number | null
          price_hectare?: number | null
          price_hour?: number | null
          radius_km?: number | null
          specifications?: Json | null
          status?: string | null
          total_hours_worked?: number | null
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
      user_profiles: {
        Row: {
          address: Json | null
          auth_user_id: string
          cpf_cnpj: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
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
    }
    Functions: {
      current_auth_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
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
