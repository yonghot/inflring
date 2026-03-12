export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export type UserRole = 'creator' | 'brand' | 'admin';

export type Platform = 'youtube' | 'instagram' | 'tiktok' | 'naver_blog';

export type ContentType = 'branded' | 'ppl' | 'review' | 'unboxing' | 'shorts' | 'other';

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';

export type MatchDirection = 'campaign_to_creator' | 'creator_apply' | 'creator_reverse_pitch' | 'brand_direct_offer';

export type MatchStatus = 'pending' | 'viewed' | 'accepted' | 'rejected' | 'negotiating' | 'contracted';

export type ContractStatus = 'draft' | 'pending_sign' | 'active' | 'content_submitted' | 'under_review' | 'revision_requested' | 'approved' | 'completed' | 'disputed' | 'cancelled';

export type EscrowStatus = 'pending' | 'deposited' | 'released' | 'refunded' | 'disputed';

export type NotificationType = 'match' | 'message' | 'contract' | 'review' | 'system';

export type MessageType = 'text' | 'image' | 'file' | 'system';

export type ReviewScoreField = 'communication_score' | 'quality_score' | 'timeliness_score';

export type FileUploadContext = 'message' | 'contract' | 'portfolio' | 'profile';

export interface Profile {
  id: string;
  role: UserRole;
  display_name: string;
  email: string;
  avatar_url: string | null;
  trust_score: number;
  created_at: string;
  updated_at: string;
}

export interface Creator {
  id: string;
  profile_id: string;
  channel_name: string;
  channel_url: string;
  platform: Platform;
  subscribers: number;
  avg_views: number;
  engagement_rate: number;
  content_category: string[];
  audience_demographics: Record<string, unknown> | null;
  top_videos: Record<string, unknown>[] | null;
  is_available: boolean;
  min_price: number | null;
  max_price: number | null;
  preferred_categories: string[];
  blocked_categories: string[];
  max_monthly_deals: number;
  max_revisions: number;
  thumbnail_autonomy: boolean;
  title_autonomy: boolean;
  media_kit_url: string | null;
  total_deals: number;
  total_revenue: number;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Brand {
  id: string;
  profile_id: string;
  company_name: string;
  business_category: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  website_url: string | null;
  total_deals: number;
  total_spend: number;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Campaign {
  id: string;
  brand_id: string;
  title: string;
  description: string;
  content_type: ContentType;
  target_platform: Platform | 'multi';
  target_categories: string[];
  min_subscribers: number | null;
  max_subscribers: number | null;
  target_audience_age: string[];
  target_audience_gender: string | null;
  budget_min: number;
  budget_max: number;
  campaign_start: string | null;
  campaign_end: string | null;
  content_deadline: string | null;
  requirements: string | null;
  max_revisions: number;
  status: CampaignStatus;
  created_at: string;
  updated_at: string;
  brand?: Brand;
}

export interface Match {
  id: string;
  campaign_id: string;
  creator_id: string;
  match_score: number | null;
  match_reasons: string[] | null;
  direction: MatchDirection;
  reverse_pitch_message: string | null;
  reverse_pitch_portfolio: Record<string, unknown>[] | null;
  status: MatchStatus;
  created_at: string;
  updated_at: string;
  campaign?: Campaign;
  creator?: Creator;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

export interface ChatRoom {
  id: string;
  match_id: string;
  creator_id: string;
  brand_id: string;
  last_message_at: string | null;
  created_at: string;
  match?: Match;
}

export interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  message_type: MessageType;
  file_url: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Contract {
  id: string;
  match_id: string;
  creator_id: string;
  brand_id: string;
  amount: number;
  platform_fee: number;
  content_requirements: string;
  delivery_deadline: string;
  revision_count: number;
  max_revisions: number;
  status: ContractStatus;
  signed_by_creator: boolean;
  signed_by_brand: boolean;
  signed_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  match?: Match;
  escrow?: Escrow;
}

export interface Escrow {
  id: string;
  contract_id: string;
  amount: number;
  platform_fee: number;
  status: EscrowStatus;
  paid_at: string | null;
  released_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  contract_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  communication_score: number | null;
  quality_score: number | null;
  timeliness_score: number | null;
  comment: string | null;
  is_public: boolean;
  created_at: string;
  reviewer?: Profile;
  reviewee?: Profile;
}

export interface FileUpload {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  context: FileUploadContext;
  context_id: string | null;
  created_at: string;
}
