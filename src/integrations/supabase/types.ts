export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          order_id: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          order_id?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          order_id?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      banner_settings: {
        Row: {
          button_link: string
          button_text: string
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean
          is_published: boolean | null
          secondary_button_link: string
          secondary_button_text: string
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          button_link?: string
          button_text?: string
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean
          is_published?: boolean | null
          secondary_button_link?: string
          secondary_button_text?: string
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Update: {
          button_link?: string
          button_text?: string
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean
          is_published?: boolean | null
          secondary_button_link?: string
          secondary_button_text?: string
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          courier_contact: string | null
          courier_name: string | null
          created_at: string | null
          delivery_address: Json | null
          estimated_delivery_date: string | null
          id: string
          notes: string | null
          payment_method: string | null
          payment_screenshot_url: string | null
          phone: string | null
          shipping_status: string | null
          status: string
          total_amount: number
          tracking_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          courier_contact?: string | null
          courier_name?: string | null
          created_at?: string | null
          delivery_address?: Json | null
          estimated_delivery_date?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_screenshot_url?: string | null
          phone?: string | null
          shipping_status?: string | null
          status?: string
          total_amount: number
          tracking_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          courier_contact?: string | null
          courier_name?: string | null
          created_at?: string | null
          delivery_address?: Json | null
          estimated_delivery_date?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_screenshot_url?: string | null
          phone?: string | null
          shipping_status?: string | null
          status?: string
          total_amount?: number
          tracking_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: Database["public"]["Enums"]["product_category"] | null
          created_at: string
          description: string | null
          featured: boolean | null
          features: string[] | null
          id: string
          image_url: string | null
          image_urls: string[] | null
          ingredients: string | null
          is_active: boolean | null
          name: string
          nutrition_facts: Json | null
          offer_price: number | null
          offers: string | null
          price: number
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["product_category"] | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          image_urls?: string[] | null
          ingredients?: string | null
          is_active?: boolean | null
          name: string
          nutrition_facts?: Json | null
          offer_price?: number | null
          offers?: string | null
          price: number
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["product_category"] | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          image_urls?: string[] | null
          ingredients?: string | null
          is_active?: boolean | null
          name?: string
          nutrition_facts?: Json | null
          offer_price?: number | null
          offers?: string | null
          price?: number
          stock_quantity?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          city: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          postal_code: string | null
          role: string
          state: string | null
          updated_at: string
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          postal_code?: string | null
          role?: string
          state?: string | null
          updated_at?: string
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          postal_code?: string | null
          role?: string
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          id: string
          is_verified_purchase: boolean | null
          product_id: string | null
          rating: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          is_verified_purchase?: boolean | null
          product_id?: string | null
          rating: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          is_verified_purchase?: boolean | null
          product_id?: string | null
          rating?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_reviews_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_reviews_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_is_admin: {
        Args: { check_user_id: string }
        Returns: boolean
      }
      create_admin_notification: {
        Args: {
          notification_type: string
          notification_title: string
          notification_message: string
          related_user_id?: string
          related_order_id?: string
        }
        Returns: string
      }
      create_admin_user: {
        Args: { user_email: string }
        Returns: undefined
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      promote_user_to_admin: {
        Args: { user_email: string }
        Returns: undefined
      }
    }
    Enums: {
      product_category: "chicken" | "red_meat" | "chilli_condiments" | "other"
      user_role: "admin" | "paying_user" | "free_user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      product_category: ["chicken", "red_meat", "chilli_condiments", "other"],
      user_role: ["admin", "paying_user", "free_user"],
    },
  },
} as const
