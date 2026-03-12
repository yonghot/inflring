import { SupabaseClient } from '@supabase/supabase-js';
import { Creator, Platform } from '@/lib/types';

interface CreatorFilters {
  platform?: string;
  category?: string;
  minSubscribers?: number;
  maxSubscribers?: number;
  available?: boolean;
}

interface CreateCreatorData {
  profile_id: string;
  channel_name: string;
  channel_url: string;
  platform: Platform;
  content_category: string[];
  is_available?: boolean;
  min_price?: number | null;
  max_price?: number | null;
  preferred_categories?: string[];
  blocked_categories?: string[];
  max_monthly_deals?: number;
  max_revisions?: number;
  thumbnail_autonomy?: boolean;
  title_autonomy?: boolean;
  media_kit_url?: string | null;
}

export async function getCreatorById(
  supabase: SupabaseClient,
  id: string
): Promise<Creator | null> {
  const { data, error } = await supabase
    .from('creators')
    .select('*, profile:profiles(*)')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

export async function getCreatorByProfileId(
  supabase: SupabaseClient,
  profileId: string
): Promise<Creator | null> {
  const { data, error } = await supabase
    .from('creators')
    .select('*, profile:profiles(*)')
    .eq('profile_id', profileId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

export async function getCreators(
  supabase: SupabaseClient,
  filters?: CreatorFilters
): Promise<Creator[]> {
  let query = supabase
    .from('creators')
    .select('*, profile:profiles(*)');

  const isAvailable = filters?.available ?? true;
  query = query.eq('is_available', isAvailable);

  if (filters?.platform) {
    query = query.eq('platform', filters.platform);
  }

  if (filters?.category) {
    query = query.contains('content_category', [filters.category]);
  }

  if (filters?.minSubscribers !== undefined) {
    query = query.gte('subscribers', filters.minSubscribers);
  }

  if (filters?.maxSubscribers !== undefined) {
    query = query.lte('subscribers', filters.maxSubscribers);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data ?? [];
}

// [PROD-TODO] subscribers, avg_views, engagement_rate are mock data for MVP
function generateMockMetrics(): {
  subscribers: number;
  avg_views: number;
  engagement_rate: number;
} {
  const subscribers = Math.floor(Math.random() * 500000) + 1000;
  const avg_views = Math.floor(subscribers * (Math.random() * 0.3 + 0.05));
  const engagement_rate = parseFloat((Math.random() * 10 + 1).toFixed(2));

  return { subscribers, avg_views, engagement_rate };
}

export async function createCreator(
  supabase: SupabaseClient,
  data: CreateCreatorData
): Promise<Creator> {
  const mockMetrics = generateMockMetrics();

  const insertData = {
    ...data,
    subscribers: mockMetrics.subscribers,
    avg_views: mockMetrics.avg_views,
    engagement_rate: mockMetrics.engagement_rate,
    is_available: data.is_available ?? true,
    preferred_categories: data.preferred_categories ?? [],
    blocked_categories: data.blocked_categories ?? [],
    max_monthly_deals: data.max_monthly_deals ?? 5,
    max_revisions: data.max_revisions ?? 2,
    thumbnail_autonomy: data.thumbnail_autonomy ?? true,
    title_autonomy: data.title_autonomy ?? true,
    total_deals: 0,
    total_revenue: 0,
  };

  const { data: creator, error } = await supabase
    .from('creators')
    .insert(insertData)
    .select('*, profile:profiles(*)')
    .single();

  if (error) throw error;

  return creator;
}

export async function updateCreator(
  supabase: SupabaseClient,
  id: string,
  data: Partial<Creator>
): Promise<Creator> {
  const { data: creator, error } = await supabase
    .from('creators')
    .update(data)
    .eq('id', id)
    .select('*, profile:profiles(*)')
    .single();

  if (error) throw error;

  return creator;
}
