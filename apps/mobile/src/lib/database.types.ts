// WARN: DO NOT EDIT, FILE GENERATED WITH `npm run db:types`

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      bookmarked_deals: {
        Row: {
          created_at: string;
          deal_id: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          deal_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          deal_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookmarked_deals_deal_id_fkey";
            columns: ["deal_id"];
            isOneToOne: false;
            referencedRelation: "deals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookmarked_deals_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      brands: {
        Row: {
          created_at: string;
          id: string;
          logo_background: string | null;
          logo_url: string;
          name: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          logo_background?: string | null;
          logo_url: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          logo_background?: string | null;
          logo_url?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          created_at: string;
          emoji: string;
          id: string;
          label: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          emoji: string;
          id: string;
          label: string;
        };
        Update: {
          created_at?: string;
          emoji?: string;
          id?: string;
          label?: string;
        };
        Relationships: [];
      };
      coupons: {
        Row: {
          brand_id: string;
          category_id: string;
          code: string | null;
          created_at: string;
          description: string | null;
          discount_label: string | null;
          id: string;
          old_price: number | null;
          price: number | null;
          qr_code: string | null;
          title: string;
          updated_at: string;
          valid_until: string | null;
        };
        ComputedFields: never;
        Insert: {
          brand_id: string;
          category_id: string;
          code?: string | null;
          created_at?: string;
          description?: string | null;
          discount_label?: string | null;
          id?: string;
          old_price?: number | null;
          price?: number | null;
          qr_code?: string | null;
          title: string;
          updated_at?: string;
          valid_until?: string | null;
        };
        Update: {
          brand_id?: string;
          category_id?: string;
          code?: string | null;
          created_at?: string;
          description?: string | null;
          discount_label?: string | null;
          id?: string;
          old_price?: number | null;
          price?: number | null;
          qr_code?: string | null;
          title?: string;
          updated_at?: string;
          valid_until?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "coupons_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "coupons_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      deal_votes: {
        Row: {
          created_at: string;
          deal_id: string;
          id: string;
          user_id: string;
          vote: Database["public"]["Enums"]["deal_vote"];
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          deal_id: string;
          id?: string;
          user_id: string;
          vote: Database["public"]["Enums"]["deal_vote"];
        };
        Update: {
          created_at?: string;
          deal_id?: string;
          id?: string;
          user_id?: string;
          vote?: Database["public"]["Enums"]["deal_vote"];
        };
        Relationships: [
          {
            foreignKeyName: "deal_votes_deal_id_fkey";
            columns: ["deal_id"];
            isOneToOne: false;
            referencedRelation: "deals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "deal_votes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      deals: {
        Row: {
          category_id: string;
          confirmations: number;
          coupon_code: string | null;
          created_at: string;
          created_by: string | null;
          denials: number;
          description: string | null;
          discount_label: string | null;
          id: string;
          location_id: string;
          moderation_status: Database["public"]["Enums"]["moderation_status"];
          old_price: number | null;
          price: number;
          title: string;
          updated_at: string;
          valid_until: string;
        };
        ComputedFields: never;
        Insert: {
          category_id: string;
          confirmations?: number;
          coupon_code?: string | null;
          created_at?: string;
          created_by?: string | null;
          denials?: number;
          description?: string | null;
          discount_label?: string | null;
          id?: string;
          location_id: string;
          moderation_status?: Database["public"]["Enums"]["moderation_status"];
          old_price?: number | null;
          price: number;
          title: string;
          updated_at?: string;
          valid_until: string;
        };
        Update: {
          category_id?: string;
          confirmations?: number;
          coupon_code?: string | null;
          created_at?: string;
          created_by?: string | null;
          denials?: number;
          description?: string | null;
          discount_label?: string | null;
          id?: string;
          location_id?: string;
          moderation_status?: Database["public"]["Enums"]["moderation_status"];
          old_price?: number | null;
          price?: number;
          title?: string;
          updated_at?: string;
          valid_until?: string;
        };
        Relationships: [
          {
            foreignKeyName: "deals_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "deals_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "deals_location_id_fkey";
            columns: ["location_id"];
            isOneToOne: false;
            referencedRelation: "locations";
            referencedColumns: ["id"];
          },
        ];
      };
      locations: {
        Row: {
          address: string | null;
          created_at: string;
          id: string;
          location: unknown;
          name: string;
          osm_id: string | null;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          address?: string | null;
          created_at?: string;
          id?: string;
          location: unknown;
          name: string;
          osm_id?: string | null;
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          id?: string;
          location?: unknown;
          name?: string;
          osm_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          first_name: string | null;
          id: string;
          is_verified: boolean;
          lappsy_balance: number;
          last_name: string | null;
          updated_at: string;
          username: string | null;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          first_name?: string | null;
          id: string;
          is_verified?: boolean;
          lappsy_balance?: number;
          last_name?: string | null;
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          created_at?: string;
          first_name?: string | null;
          id?: string;
          is_verified?: boolean;
          lappsy_balance?: number;
          last_name?: string | null;
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      deals_near: {
        Args: {
          p_include_expired?: boolean;
          p_latitude: number;
          p_limit?: number;
          p_longitude: number;
          p_radius_m?: number;
        };
        Returns: {
          address: string;
          category_id: string;
          category_label: string;
          confirmations: number;
          coupon_code: string;
          created_at: string;
          denials: number;
          description: string;
          discount_label: string;
          distance_m: number;
          emoji: string;
          id: string;
          is_mine: boolean;
          latitude: number;
          location_id: string;
          location_name: string;
          longitude: number;
          old_price: number;
          price: number;
          title: string;
          valid_until: string;
        }[];
      };
      get_my_profile_stats: {
        Args: Record<PropertyKey, never>;
        Returns: {
          confirmations_count: number;
          lappsy_balance: number;
          submissions_count: number;
        }[];
      };
      submit_deal: {
        Args: {
          p_category_id: string;
          p_coupon_code?: string;
          p_description?: string;
          p_discount_label?: string;
          p_location_address?: string;
          p_location_id?: string;
          p_location_latitude?: number;
          p_location_longitude?: number;
          p_location_name?: string;
          p_old_price?: number;
          p_price: number;
          p_title: string;
          p_valid_until: string;
        };
        Returns: string;
      };
    };
    Enums: {
      deal_vote: "confirm" | "deny";
      moderation_status: "pending" | "approved" | "rejected";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      deal_vote: ["confirm", "deny"],
      moderation_status: ["pending", "approved", "rejected"],
    },
  },
} as const;
