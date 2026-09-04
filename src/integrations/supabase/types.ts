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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      brand_profiles: {
        Row: {
          avg_campaign_budget: string | null
          bank_account_number: string | null
          bank_ifsc: string | null
          brand_banner_url: string | null
          brand_description: string | null
          brand_logo_url: string | null
          business_name: string | null
          business_registration: string | null
          created_at: string
          facebook_page: string | null
          gst_number: string | null
          id: string
          industry: string | null
          instagram_handle: string | null
          legal_entity_type: string | null
          linkedin_page: string | null
          monthly_budget: string | null
          monthly_traffic: string | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          pan_number: string | null
          preferred_campaign_types: string[] | null
          target_follower_range: string | null
          target_geographies: string[] | null
          updated_at: string
          upi_id: string | null
          user_id: string
          verified: boolean | null
          website_url: string | null
          youtube_channel: string | null
        }
        Insert: {
          avg_campaign_budget?: string | null
          bank_account_number?: string | null
          bank_ifsc?: string | null
          brand_banner_url?: string | null
          brand_description?: string | null
          brand_logo_url?: string | null
          business_name?: string | null
          business_registration?: string | null
          created_at?: string
          facebook_page?: string | null
          gst_number?: string | null
          id?: string
          industry?: string | null
          instagram_handle?: string | null
          legal_entity_type?: string | null
          linkedin_page?: string | null
          monthly_budget?: string | null
          monthly_traffic?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          pan_number?: string | null
          preferred_campaign_types?: string[] | null
          target_follower_range?: string | null
          target_geographies?: string[] | null
          updated_at?: string
          upi_id?: string | null
          user_id: string
          verified?: boolean | null
          website_url?: string | null
          youtube_channel?: string | null
        }
        Update: {
          avg_campaign_budget?: string | null
          bank_account_number?: string | null
          bank_ifsc?: string | null
          brand_banner_url?: string | null
          brand_description?: string | null
          brand_logo_url?: string | null
          business_name?: string | null
          business_registration?: string | null
          created_at?: string
          facebook_page?: string | null
          gst_number?: string | null
          id?: string
          industry?: string | null
          instagram_handle?: string | null
          legal_entity_type?: string | null
          linkedin_page?: string | null
          monthly_budget?: string | null
          monthly_traffic?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          pan_number?: string | null
          preferred_campaign_types?: string[] | null
          target_follower_range?: string | null
          target_geographies?: string[] | null
          updated_at?: string
          upi_id?: string | null
          user_id?: string
          verified?: boolean | null
          website_url?: string | null
          youtube_channel?: string | null
        }
        Relationships: []
      }
      campaign_applications: {
        Row: {
          availability_date: string | null
          brand_feedback: string | null
          campaign_id: string
          content_concept: string | null
          created_at: string
          creator_user_id: string
          id: string
          pitch: string | null
          portfolio_links: string[] | null
          proposed_rate: string | null
          status: string
          updated_at: string
        }
        Insert: {
          availability_date?: string | null
          brand_feedback?: string | null
          campaign_id: string
          content_concept?: string | null
          created_at?: string
          creator_user_id: string
          id?: string
          pitch?: string | null
          portfolio_links?: string[] | null
          proposed_rate?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          availability_date?: string | null
          brand_feedback?: string | null
          campaign_id?: string
          content_concept?: string | null
          created_at?: string
          creator_user_id?: string
          id?: string
          pitch?: string | null
          portfolio_links?: string[] | null
          proposed_rate?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_applications_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_deliverables: {
        Row: {
          approval_required: boolean | null
          campaign_id: string
          content_type: string
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          max_revisions: number | null
          platform: string | null
          quantity: number | null
          revision_deadline_hours: number | null
          specifications: string | null
          usage_rights: string | null
        }
        Insert: {
          approval_required?: boolean | null
          campaign_id: string
          content_type: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          max_revisions?: number | null
          platform?: string | null
          quantity?: number | null
          revision_deadline_hours?: number | null
          specifications?: string | null
          usage_rights?: string | null
        }
        Update: {
          approval_required?: boolean | null
          campaign_id?: string
          content_type?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          max_revisions?: number | null
          platform?: string | null
          quantity?: number | null
          revision_deadline_hours?: number | null
          specifications?: string | null
          usage_rights?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_deliverables_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          applications_count: number | null
          barter_product_description: string | null
          barter_product_name: string | null
          barter_product_value: string | null
          brand_guidelines_url: string | null
          brand_user_id: string
          budget_per_creator: string | null
          campaign_type: string
          created_at: string
          creator_count: number | null
          description: string | null
          disclaimer_text: string | null
          end_date: string | null
          follower_range: string | null
          go_live_date: string | null
          hashtag_guidelines: string[] | null
          id: string
          is_barter: boolean | null
          language_requirements: string[] | null
          location_targeting: string[] | null
          min_engagement_rate: number | null
          niche_targeting: string[] | null
          payment_structure: string | null
          required_platforms: string[] | null
          slots_filled: number | null
          slots_total: number | null
          start_date: string | null
          status: string
          title: string
          total_budget: string | null
          updated_at: string
        }
        Insert: {
          applications_count?: number | null
          barter_product_description?: string | null
          barter_product_name?: string | null
          barter_product_value?: string | null
          brand_guidelines_url?: string | null
          brand_user_id: string
          budget_per_creator?: string | null
          campaign_type?: string
          created_at?: string
          creator_count?: number | null
          description?: string | null
          disclaimer_text?: string | null
          end_date?: string | null
          follower_range?: string | null
          go_live_date?: string | null
          hashtag_guidelines?: string[] | null
          id?: string
          is_barter?: boolean | null
          language_requirements?: string[] | null
          location_targeting?: string[] | null
          min_engagement_rate?: number | null
          niche_targeting?: string[] | null
          payment_structure?: string | null
          required_platforms?: string[] | null
          slots_filled?: number | null
          slots_total?: number | null
          start_date?: string | null
          status?: string
          title: string
          total_budget?: string | null
          updated_at?: string
        }
        Update: {
          applications_count?: number | null
          barter_product_description?: string | null
          barter_product_name?: string | null
          barter_product_value?: string | null
          brand_guidelines_url?: string | null
          brand_user_id?: string
          budget_per_creator?: string | null
          campaign_type?: string
          created_at?: string
          creator_count?: number | null
          description?: string | null
          disclaimer_text?: string | null
          end_date?: string | null
          follower_range?: string | null
          go_live_date?: string | null
          hashtag_guidelines?: string[] | null
          id?: string
          is_barter?: boolean | null
          language_requirements?: string[] | null
          location_targeting?: string[] | null
          min_engagement_rate?: number | null
          niche_targeting?: string[] | null
          payment_structure?: string | null
          required_platforms?: string[] | null
          slots_filled?: number | null
          slots_total?: number | null
          start_date?: string | null
          status?: string
          title?: string
          total_budget?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          campaign_id: string | null
          created_at: string
          id: string
          last_message_at: string | null
          participant_1: string
          participant_2: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant_1: string
          participant_2: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant_1?: string
          participant_2?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_profiles: {
        Row: {
          bank_account_number: string | null
          bank_ifsc: string | null
          campaign_preferences: string[] | null
          content_formats: string[] | null
          content_frequency: string | null
          created_at: string
          engagement_rate: number | null
          geographic_focus: string[] | null
          gst_number: string | null
          id: string
          industries_to_avoid: string[] | null
          instagram_followers: number | null
          instagram_handle: string | null
          language_preferences: string[] | null
          linkedin_url: string | null
          media_kit_url: string | null
          monthly_available_hours: number | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          pan_number: string | null
          primary_niche: string | null
          profile_completion: number | null
          rate_feed_post: string | null
          rate_reel: string | null
          rate_story: string | null
          rate_tiktok: string | null
          rate_youtube: string | null
          secondary_niches: string[] | null
          tiktok_followers: number | null
          tiktok_handle: string | null
          twitter_handle: string | null
          updated_at: string
          upi_id: string | null
          user_id: string
          verified: boolean | null
          youtube_channel: string | null
          youtube_subscribers: number | null
        }
        Insert: {
          bank_account_number?: string | null
          bank_ifsc?: string | null
          campaign_preferences?: string[] | null
          content_formats?: string[] | null
          content_frequency?: string | null
          created_at?: string
          engagement_rate?: number | null
          geographic_focus?: string[] | null
          gst_number?: string | null
          id?: string
          industries_to_avoid?: string[] | null
          instagram_followers?: number | null
          instagram_handle?: string | null
          language_preferences?: string[] | null
          linkedin_url?: string | null
          media_kit_url?: string | null
          monthly_available_hours?: number | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          pan_number?: string | null
          primary_niche?: string | null
          profile_completion?: number | null
          rate_feed_post?: string | null
          rate_reel?: string | null
          rate_story?: string | null
          rate_tiktok?: string | null
          rate_youtube?: string | null
          secondary_niches?: string[] | null
          tiktok_followers?: number | null
          tiktok_handle?: string | null
          twitter_handle?: string | null
          updated_at?: string
          upi_id?: string | null
          user_id: string
          verified?: boolean | null
          youtube_channel?: string | null
          youtube_subscribers?: number | null
        }
        Update: {
          bank_account_number?: string | null
          bank_ifsc?: string | null
          campaign_preferences?: string[] | null
          content_formats?: string[] | null
          content_frequency?: string | null
          created_at?: string
          engagement_rate?: number | null
          geographic_focus?: string[] | null
          gst_number?: string | null
          id?: string
          industries_to_avoid?: string[] | null
          instagram_followers?: number | null
          instagram_handle?: string | null
          language_preferences?: string[] | null
          linkedin_url?: string | null
          media_kit_url?: string | null
          monthly_available_hours?: number | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          pan_number?: string | null
          primary_niche?: string | null
          profile_completion?: number | null
          rate_feed_post?: string | null
          rate_reel?: string | null
          rate_story?: string | null
          rate_tiktok?: string | null
          rate_youtube?: string | null
          secondary_niches?: string[] | null
          tiktok_followers?: number | null
          tiktok_handle?: string | null
          twitter_handle?: string | null
          updated_at?: string
          upi_id?: string | null
          user_id?: string
          verified?: boolean | null
          youtube_channel?: string | null
          youtube_subscribers?: number | null
        }
        Relationships: []
      }
      deliverable_submissions: {
        Row: {
          application_id: string
          approved_at: string | null
          caption: string | null
          content_type: string | null
          content_url: string | null
          created_at: string
          creator_user_id: string
          deadline_at: string | null
          deliverable_id: string
          escalated: boolean | null
          hashtags: string[] | null
          id: string
          published_at: string | null
          published_screenshot_url: string | null
          published_url: string | null
          review_feedback: string | null
          revision_count: number | null
          status: string
          submission_notes: string | null
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          application_id: string
          approved_at?: string | null
          caption?: string | null
          content_type?: string | null
          content_url?: string | null
          created_at?: string
          creator_user_id: string
          deadline_at?: string | null
          deliverable_id: string
          escalated?: boolean | null
          hashtags?: string[] | null
          id?: string
          published_at?: string | null
          published_screenshot_url?: string | null
          published_url?: string | null
          review_feedback?: string | null
          revision_count?: number | null
          status?: string
          submission_notes?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          application_id?: string
          approved_at?: string | null
          caption?: string | null
          content_type?: string | null
          content_url?: string | null
          created_at?: string
          creator_user_id?: string
          deadline_at?: string | null
          deliverable_id?: string
          escalated?: boolean | null
          hashtags?: string[] | null
          id?: string
          published_at?: string | null
          published_screenshot_url?: string | null
          published_url?: string | null
          review_feedback?: string | null
          revision_count?: number | null
          status?: string
          submission_notes?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliverable_submissions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "campaign_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliverable_submissions_deliverable_id_fkey"
            columns: ["deliverable_id"]
            isOneToOne: false
            referencedRelation: "campaign_deliverables"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          against_user: string
          campaign_id: string | null
          created_at: string
          description: string | null
          evidence_urls: string[] | null
          filed_by: string
          id: string
          reason: string
          resolution: string | null
          resolution_notes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          against_user: string
          campaign_id?: string | null
          created_at?: string
          description?: string | null
          evidence_urls?: string[] | null
          filed_by: string
          id?: string
          reason: string
          resolution?: string | null
          resolution_notes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          against_user?: string
          campaign_id?: string | null
          created_at?: string
          description?: string | null
          evidence_urls?: string[] | null
          filed_by?: string
          id?: string
          reason?: string
          resolution?: string | null
          resolution_notes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachment_url: string | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          message_type: string | null
          read_at: string | null
          sender_id: string
        }
        Insert: {
          attachment_url?: string | null
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          message_type?: string | null
          read_at?: string | null
          sender_id: string
        }
        Update: {
          attachment_url?: string | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          message_type?: string | null
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          reference_id: string | null
          reference_type: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          reference_id?: string | null
          reference_type?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city_tier: string | null
          created_at: string
          full_name: string | null
          id: string
          location_city: string | null
          location_state: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city_tier?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          location_city?: string | null
          location_state?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city_tier?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          location_city?: string | null
          location_state?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          campaign_id: string | null
          comment: string | null
          communication_rating: number | null
          content_quality_rating: number | null
          created_at: string
          delivery_rating: number | null
          id: string
          is_anonymous: boolean | null
          overall_rating: number
          response: string | null
          responsiveness_rating: number | null
          reviewed_user_id: string
          reviewer_role: string
          reviewer_user_id: string
          updated_at: string
        }
        Insert: {
          campaign_id?: string | null
          comment?: string | null
          communication_rating?: number | null
          content_quality_rating?: number | null
          created_at?: string
          delivery_rating?: number | null
          id?: string
          is_anonymous?: boolean | null
          overall_rating: number
          response?: string | null
          responsiveness_rating?: number | null
          reviewed_user_id: string
          reviewer_role: string
          reviewer_user_id: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string | null
          comment?: string | null
          communication_rating?: number | null
          content_quality_rating?: number | null
          created_at?: string
          delivery_rating?: number | null
          id?: string
          is_anonymous?: boolean | null
          overall_rating?: number
          response?: string | null
          responsiveness_rating?: number | null
          reviewed_user_id?: string
          reviewer_role?: string
          reviewer_user_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_creators: {
        Row: {
          brand_user_id: string
          created_at: string
          creator_user_id: string
          id: string
        }
        Insert: {
          brand_user_id: string
          created_at?: string
          creator_user_id: string
          id?: string
        }
        Update: {
          brand_user_id?: string
          created_at?: string
          creator_user_id?: string
          id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          application_id: string | null
          campaign_id: string | null
          created_at: string
          currency: string | null
          description: string | null
          gst_amount: number | null
          id: string
          invoice_url: string | null
          payee_user_id: string
          payer_user_id: string
          payment_method: string | null
          status: string
          tds_amount: number | null
          transaction_ref: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          application_id?: string | null
          campaign_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          gst_amount?: number | null
          id?: string
          invoice_url?: string | null
          payee_user_id: string
          payer_user_id: string
          payment_method?: string | null
          status?: string
          tds_amount?: number | null
          transaction_ref?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          application_id?: string | null
          campaign_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          gst_amount?: number | null
          id?: string
          invoice_url?: string | null
          payee_user_id?: string
          payer_user_id?: string
          payment_method?: string | null
          status?: string
          tds_amount?: number | null
          transaction_ref?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "campaign_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "creator" | "brand" | "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["creator", "brand", "admin"],
    },
  },
} as const
