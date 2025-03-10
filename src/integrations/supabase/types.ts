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
      content_locker_links: {
        Row: {
          active: boolean | null
          createdat: string | null
          id: string
          name: string
          url: string
        }
        Insert: {
          active?: boolean | null
          createdat?: string | null
          id?: string
          name: string
          url: string
        }
        Update: {
          active?: boolean | null
          createdat?: string | null
          id?: string
          name?: string
          url?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          category: string | null
          code: string
          contentlockerlinkid: string | null
          createdat: string | null
          description: string | null
          discount: string | null
          expirydate: string | null
          featured: boolean | null
          id: string
          image: string | null
          lastverified: string | null
          rating: number | null
          redirecturl: string | null
          status: string | null
          store: string
          updatedat: string | null
          usedcount: number | null
        }
        Insert: {
          category?: string | null
          code: string
          contentlockerlinkid?: string | null
          createdat?: string | null
          description?: string | null
          discount?: string | null
          expirydate?: string | null
          featured?: boolean | null
          id?: string
          image?: string | null
          lastverified?: string | null
          rating?: number | null
          redirecturl?: string | null
          status?: string | null
          store: string
          updatedat?: string | null
          usedcount?: number | null
        }
        Update: {
          category?: string | null
          code?: string
          contentlockerlinkid?: string | null
          createdat?: string | null
          description?: string | null
          discount?: string | null
          expirydate?: string | null
          featured?: boolean | null
          id?: string
          image?: string | null
          lastverified?: string | null
          rating?: number | null
          redirecturl?: string | null
          status?: string | null
          store?: string
          updatedat?: string | null
          usedcount?: number | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          colors: Json | null
          created_at: string | null
          general: Json | null
          id: string
          navbar: Json | null
          seo: Json | null
          text_content: Json | null
          theme: string | null
          updated_at: string | null
        }
        Insert: {
          colors?: Json | null
          created_at?: string | null
          general?: Json | null
          id?: string
          navbar?: Json | null
          seo?: Json | null
          text_content?: Json | null
          theme?: string | null
          updated_at?: string | null
        }
        Update: {
          colors?: Json | null
          created_at?: string | null
          general?: Json | null
          id?: string
          navbar?: Json | null
          seo?: Json | null
          text_content?: Json | null
          theme?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
