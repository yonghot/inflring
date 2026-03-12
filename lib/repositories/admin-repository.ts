import { SupabaseClient } from '@supabase/supabase-js';
import { Profile, Creator, Campaign, Match, Contract, Review } from '@/lib/types';

interface PaginationParams {
  page: number;
  limit: number;
}

interface ListResult<T> {
  data: T[];
  count: number;
}

// 페이지네이션 범위 계산
function calcRange(page: number, limit: number): { from: number; to: number } {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { from, to };
}

export async function listUsers(
  supabase: SupabaseClient,
  role: string | undefined,
  pagination: PaginationParams
): Promise<ListResult<Profile>> {
  const { from, to } = calcRange(pagination.page, pagination.limit);

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (role) {
    query = query.eq('role', role);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return { data: data ?? [], count: count ?? 0 };
}

export async function listCreators(
  supabase: SupabaseClient,
  platform: string | undefined,
  pagination: PaginationParams
): Promise<ListResult<Creator>> {
  const { from, to } = calcRange(pagination.page, pagination.limit);

  let query = supabase
    .from('creators')
    .select(
      '*, profile:profiles(display_name, email, avatar_url)',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(from, to);

  if (platform) {
    query = query.eq('platform', platform);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return { data: data ?? [], count: count ?? 0 };
}

export async function listCampaigns(
  supabase: SupabaseClient,
  status: string | undefined,
  pagination: PaginationParams
): Promise<ListResult<Campaign>> {
  const { from, to } = calcRange(pagination.page, pagination.limit);

  let query = supabase
    .from('campaigns')
    .select(
      '*, brand:brands(company_name)',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return { data: data ?? [], count: count ?? 0 };
}

export async function listMatches(
  supabase: SupabaseClient,
  status: string | undefined,
  pagination: PaginationParams
): Promise<ListResult<Match>> {
  const { from, to } = calcRange(pagination.page, pagination.limit);

  let query = supabase
    .from('matches')
    .select(
      '*, campaign:campaigns(title), creator:creators(channel_name)',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return { data: data ?? [], count: count ?? 0 };
}

export async function listContracts(
  supabase: SupabaseClient,
  status: string | undefined,
  pagination: PaginationParams
): Promise<ListResult<Contract>> {
  const { from, to } = calcRange(pagination.page, pagination.limit);

  let query = supabase
    .from('contracts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return { data: data ?? [], count: count ?? 0 };
}

export async function listReviews(
  supabase: SupabaseClient,
  pagination: PaginationParams
): Promise<ListResult<Review>> {
  const { from, to } = calcRange(pagination.page, pagination.limit);

  const { data, error, count } = await supabase
    .from('reviews')
    .select(
      '*, reviewer:profiles!reviewer_id(display_name), reviewee:profiles!reviewee_id(display_name)',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return { data: data ?? [], count: count ?? 0 };
}
