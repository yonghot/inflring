import { SupabaseClient } from '@supabase/supabase-js';
import { Match, MatchStatus, UserRole } from '@/lib/types';
import { MatchCreateInput, MatchUpdateInput } from '@/lib/validations';
import {
  createMatch as createMatchRepo,
  getMatchesByCreatorProfileId,
  getMatchesByBrandProfileId,
  getMatchById as getMatchByIdRepo,
  updateMatch,
  checkDuplicateMatch,
} from '@/lib/repositories/match-repository';
import {
  AuthorizationError,
  ValidationError,
} from '@/lib/utils/api-helpers';

export async function createMatch(
  supabase: SupabaseClient,
  profileId: string,
  data: MatchCreateInput
): Promise<Match> {
  const isDuplicate = await checkDuplicateMatch(
    supabase,
    data.campaignId,
    data.creatorId
  );

  if (isDuplicate) {
    throw new ValidationError('이미 해당 캠페인과 크리에이터 간 매칭이 존재합니다');
  }

  return createMatchRepo(supabase, {
    campaign_id: data.campaignId,
    creator_id: data.creatorId,
    direction: data.direction,
    reverse_pitch_message: data.reversePitchMessage ?? null,
  });
}

export async function getMyMatches(
  supabase: SupabaseClient,
  profileId: string,
  role: UserRole
): Promise<Match[]> {
  if (role === 'creator') {
    return getMatchesByCreatorProfileId(supabase, profileId);
  }

  if (role === 'brand') {
    return getMatchesByBrandProfileId(supabase, profileId);
  }

  throw new ValidationError('유효하지 않은 역할입니다');
}

export async function updateMatchStatus(
  supabase: SupabaseClient,
  matchId: string,
  profileId: string,
  data: MatchUpdateInput
): Promise<Match> {
  const match = await getMatchByIdRepo(supabase, matchId);

  if (!match) {
    throw new ValidationError('매칭을 찾을 수 없습니다');
  }

  const isCreatorParty = match.creator?.profile_id === profileId;
  const isBrandParty = match.campaign?.brand?.profile_id === profileId;

  if (!isCreatorParty && !isBrandParty) {
    throw new AuthorizationError('해당 매칭의 당사자만 상태를 변경할 수 있습니다');
  }

  return updateMatch(supabase, matchId, {
    status: data.status as MatchStatus,
  });
}
