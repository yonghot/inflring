import { SupabaseClient } from '@supabase/supabase-js';
import { Creator, Platform } from '@/lib/types';
import { CreatorOnboardingInput, CreatorProfileInput } from '@/lib/validations';
import {
  createCreator,
  getCreators as getCreatorsRepo,
  getCreatorById as getCreatorByIdRepo,
  getCreatorByProfileId,
  updateCreator,
} from '@/lib/repositories/creator-repository';
import { detectPlatform } from '@/lib/utils';
import {
  AuthorizationError,
  ValidationError,
} from '@/lib/utils/api-helpers';

interface CreatorFilters {
  platform?: string;
  category?: string;
  minSubscribers?: number;
  maxSubscribers?: number;
  available?: boolean;
}

export async function onboard(
  supabase: SupabaseClient,
  profileId: string,
  data: CreatorOnboardingInput
): Promise<Creator> {
  const existing = await getCreatorByProfileId(supabase, profileId);
  if (existing) {
    throw new ValidationError('이미 크리에이터로 등록되어 있습니다');
  }

  const detectedPlatform = detectPlatform(data.channelUrl);
  const platform: Platform = (detectedPlatform as Platform) ?? data.platform;

  return createCreator(supabase, {
    profile_id: profileId,
    channel_name: data.channelName,
    channel_url: data.channelUrl,
    platform,
    content_category: [],
  });
}

export async function getCreators(
  supabase: SupabaseClient,
  filters?: CreatorFilters
): Promise<Creator[]> {
  return getCreatorsRepo(supabase, filters);
}

export async function getCreatorById(
  supabase: SupabaseClient,
  id: string
): Promise<Creator> {
  const creator = await getCreatorByIdRepo(supabase, id);
  if (!creator) {
    throw new ValidationError('크리에이터를 찾을 수 없습니다');
  }
  return creator;
}

export async function updateCreatorProfile(
  supabase: SupabaseClient,
  id: string,
  profileId: string,
  data: CreatorProfileInput
): Promise<Creator> {
  const creator = await getCreatorByIdRepo(supabase, id);
  if (!creator) {
    throw new ValidationError('크리에이터를 찾을 수 없습니다');
  }

  if (creator.profile_id !== profileId) {
    throw new AuthorizationError('본인의 프로필만 수정할 수 있습니다');
  }

  const updateData: Partial<Creator> = {};

  if (data.isAvailable !== undefined) updateData.is_available = data.isAvailable;
  if (data.minPrice !== undefined) updateData.min_price = data.minPrice;
  if (data.maxPrice !== undefined) updateData.max_price = data.maxPrice;
  if (data.preferredCategories !== undefined)
    updateData.preferred_categories = data.preferredCategories;
  if (data.blockedCategories !== undefined)
    updateData.blocked_categories = data.blockedCategories;
  if (data.maxMonthlyDeals !== undefined)
    updateData.max_monthly_deals = data.maxMonthlyDeals;
  if (data.maxRevisions !== undefined)
    updateData.max_revisions = data.maxRevisions;
  if (data.thumbnailAutonomy !== undefined)
    updateData.thumbnail_autonomy = data.thumbnailAutonomy;
  if (data.titleAutonomy !== undefined)
    updateData.title_autonomy = data.titleAutonomy;

  return updateCreator(supabase, id, updateData);
}
