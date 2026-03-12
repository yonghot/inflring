import { SupabaseClient } from '@supabase/supabase-js';
import { Match, MatchDirection, MatchStatus } from '@/lib/types';

const MATCH_SELECT_WITH_RELATIONS =
  '*, campaign:campaigns(*, brand:brands(*)), creator:creators(*, profile:profiles(*))';

interface CreateMatchData {
  campaign_id: string;
  creator_id: string;
  direction: MatchDirection;
  match_score?: number | null;
  match_reasons?: string[] | null;
  reverse_pitch_message?: string | null;
  reverse_pitch_portfolio?: Record<string, unknown>[] | null;
  status?: MatchStatus;
}

export async function getMatchesByCreatorProfileId(
  supabase: SupabaseClient,
  profileId: string
): Promise<Match[]> {
  const { data, error } = await supabase
    .from('matches')
    .select(MATCH_SELECT_WITH_RELATIONS)
    .eq('creator.profile_id', profileId)
    .not('creator', 'is', null)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function getMatchesByBrandProfileId(
  supabase: SupabaseClient,
  profileId: string
): Promise<Match[]> {
  const { data, error } = await supabase
    .from('matches')
    .select(MATCH_SELECT_WITH_RELATIONS)
    .eq('campaign.brand.profile_id', profileId)
    .not('campaign', 'is', null)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function getMatchById(
  supabase: SupabaseClient,
  id: string
): Promise<Match | null> {
  const { data, error } = await supabase
    .from('matches')
    .select(MATCH_SELECT_WITH_RELATIONS)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

export async function createMatch(
  supabase: SupabaseClient,
  data: CreateMatchData
): Promise<Match> {
  const insertData = {
    ...data,
    status: data.status ?? ('pending' as MatchStatus),
  };

  const { data: match, error } = await supabase
    .from('matches')
    .insert(insertData)
    .select(MATCH_SELECT_WITH_RELATIONS)
    .single();

  if (error) throw error;

  return match;
}

export async function updateMatch(
  supabase: SupabaseClient,
  id: string,
  data: Partial<Match>
): Promise<Match> {
  const { data: match, error } = await supabase
    .from('matches')
    .update(data)
    .eq('id', id)
    .select(MATCH_SELECT_WITH_RELATIONS)
    .single();

  if (error) throw error;

  return match;
}

export async function checkDuplicateMatch(
  supabase: SupabaseClient,
  campaignId: string,
  creatorId: string
): Promise<boolean> {
  const { count, error } = await supabase
    .from('matches')
    .select('id', { count: 'exact', head: true })
    .eq('campaign_id', campaignId)
    .eq('creator_id', creatorId);

  if (error) throw error;

  return (count ?? 0) > 0;
}
