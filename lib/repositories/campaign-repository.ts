import { SupabaseClient } from '@supabase/supabase-js';
import { Campaign, CampaignStatus, ContentType, Platform } from '@/lib/types';

interface CampaignFilters {
  status?: string;
  brandId?: string;
}

interface CreateCampaignData {
  brand_id: string;
  title: string;
  description: string;
  content_type: ContentType;
  target_platform: Platform | 'multi';
  target_categories: string[];
  min_subscribers?: number | null;
  max_subscribers?: number | null;
  target_audience_age?: string[];
  target_audience_gender?: string | null;
  budget_min: number;
  budget_max: number;
  campaign_start?: string | null;
  campaign_end?: string | null;
  content_deadline?: string | null;
  requirements?: string | null;
  max_revisions?: number;
  status?: CampaignStatus;
}

export async function getCampaigns(
  supabase: SupabaseClient,
  filters?: CampaignFilters
): Promise<Campaign[]> {
  let query = supabase
    .from('campaigns')
    .select('*, brand:brands(*, profile:profiles(*))');

  const status = filters?.status ?? 'active';
  query = query.eq('status', status);

  if (filters?.brandId) {
    query = query.eq('brand_id', filters.brandId);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) throw error;

  return data ?? [];
}

export async function getCampaignById(
  supabase: SupabaseClient,
  id: string
): Promise<Campaign | null> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*, brand:brands(*, profile:profiles(*))')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

export async function createCampaign(
  supabase: SupabaseClient,
  data: CreateCampaignData
): Promise<Campaign> {
  const insertData = {
    ...data,
    target_categories: data.target_categories ?? [],
    target_audience_age: data.target_audience_age ?? [],
    max_revisions: data.max_revisions ?? 2,
    status: data.status ?? ('draft' as CampaignStatus),
  };

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .insert(insertData)
    .select('*, brand:brands(*, profile:profiles(*))')
    .single();

  if (error) throw error;

  return campaign;
}

export async function updateCampaign(
  supabase: SupabaseClient,
  id: string,
  data: Partial<Campaign>
): Promise<Campaign> {
  const { data: campaign, error } = await supabase
    .from('campaigns')
    .update(data)
    .eq('id', id)
    .select('*, brand:brands(*, profile:profiles(*))')
    .single();

  if (error) throw error;

  return campaign;
}
