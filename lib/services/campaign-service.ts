import { SupabaseClient } from '@supabase/supabase-js';
import { Campaign, CampaignStatus } from '@/lib/types';
import { CampaignInput } from '@/lib/validations';
import {
  createCampaign as createCampaignRepo,
  getCampaigns as getCampaignsRepo,
  getCampaignById as getCampaignByIdRepo,
} from '@/lib/repositories/campaign-repository';
import { getBrandByProfileId } from '@/lib/repositories/brand-repository';
import {
  AuthorizationError,
  ValidationError,
} from '@/lib/utils/api-helpers';

interface CampaignFilters {
  status?: string;
  brandId?: string;
}

export async function create(
  supabase: SupabaseClient,
  brandProfileId: string,
  data: CampaignInput
): Promise<Campaign> {
  const brand = await getBrandByProfileId(supabase, brandProfileId);
  if (!brand) {
    throw new AuthorizationError('광고주 정보를 찾을 수 없습니다');
  }

  return createCampaignRepo(supabase, {
    brand_id: brand.id,
    title: data.title,
    description: data.description,
    content_type: data.contentType,
    target_platform: data.targetPlatform,
    target_categories: data.targetCategories ?? [],
    min_subscribers: data.minSubscribers ?? null,
    max_subscribers: data.maxSubscribers ?? null,
    budget_min: data.budgetMin,
    budget_max: data.budgetMax,
    campaign_start: data.campaignStart ?? null,
    campaign_end: data.campaignEnd ?? null,
    content_deadline: data.contentDeadline ?? null,
    requirements: data.requirements ?? null,
    status: 'active' as CampaignStatus,
  });
}

export async function getCampaigns(
  supabase: SupabaseClient,
  filters?: CampaignFilters
): Promise<Campaign[]> {
  return getCampaignsRepo(supabase, filters);
}

export async function getCampaignById(
  supabase: SupabaseClient,
  id: string
): Promise<Campaign> {
  const campaign = await getCampaignByIdRepo(supabase, id);
  if (!campaign) {
    throw new ValidationError('캠페인을 찾을 수 없습니다');
  }
  return campaign;
}
