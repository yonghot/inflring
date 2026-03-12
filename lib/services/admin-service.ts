import { SupabaseClient } from '@supabase/supabase-js';
import {
  listUsers,
  listCreators,
  listCampaigns,
  listMatches,
  listContracts,
  listReviews,
} from '@/lib/repositories/admin-repository';
import { Profile, Creator, Campaign, Match, Contract, Review } from '@/lib/types';

interface AdminStats {
  totalUsers: number;
  totalCreators: number;
  totalBrands: number;
  totalCampaigns: number;
  totalMatches: number;
  recentActivity: {
    newUsersToday: number;
    newCampaignsToday: number;
    newMatchesToday: number;
  };
}

interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export async function getStats(supabase: SupabaseClient): Promise<AdminStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();

  const [
    profilesResult,
    creatorsResult,
    brandsResult,
    campaignsResult,
    matchesResult,
    newUsersResult,
    newCampaignsResult,
    newMatchesResult,
  ] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('creators').select('id', { count: 'exact', head: true }),
    supabase.from('brands').select('id', { count: 'exact', head: true }),
    supabase.from('campaigns').select('id', { count: 'exact', head: true }),
    supabase.from('matches').select('id', { count: 'exact', head: true }),
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', todayIso),
    supabase
      .from('campaigns')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', todayIso),
    supabase
      .from('matches')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', todayIso),
  ]);

  return {
    totalUsers: profilesResult.count ?? 0,
    totalCreators: creatorsResult.count ?? 0,
    totalBrands: brandsResult.count ?? 0,
    totalCampaigns: campaignsResult.count ?? 0,
    totalMatches: matchesResult.count ?? 0,
    recentActivity: {
      newUsersToday: newUsersResult.count ?? 0,
      newCampaignsToday: newCampaignsResult.count ?? 0,
      newMatchesToday: newMatchesResult.count ?? 0,
    },
  };
}

export async function getUsers(
  supabase: SupabaseClient,
  role?: string,
  page = 1,
  limit = 20
): Promise<PaginatedResult<Profile>> {
  const { data, count } = await listUsers(supabase, role, { page, limit });
  return { data, meta: { total: count, page, limit } };
}

export async function getCreators(
  supabase: SupabaseClient,
  platform?: string,
  page = 1,
  limit = 20
): Promise<PaginatedResult<Creator>> {
  const { data, count } = await listCreators(supabase, platform, { page, limit });
  return { data, meta: { total: count, page, limit } };
}

export async function getCampaigns(
  supabase: SupabaseClient,
  status?: string,
  page = 1,
  limit = 20
): Promise<PaginatedResult<Campaign>> {
  const { data, count } = await listCampaigns(supabase, status, { page, limit });
  return { data, meta: { total: count, page, limit } };
}

export async function getMatches(
  supabase: SupabaseClient,
  status?: string,
  page = 1,
  limit = 20
): Promise<PaginatedResult<Match>> {
  const { data, count } = await listMatches(supabase, status, { page, limit });
  return { data, meta: { total: count, page, limit } };
}

export async function getContracts(
  supabase: SupabaseClient,
  status?: string,
  page = 1,
  limit = 20
): Promise<PaginatedResult<Contract>> {
  const { data, count } = await listContracts(supabase, status, { page, limit });
  return { data, meta: { total: count, page, limit } };
}

export async function getReviews(
  supabase: SupabaseClient,
  page = 1,
  limit = 20
): Promise<PaginatedResult<Review>> {
  const { data, count } = await listReviews(supabase, { page, limit });
  return { data, meta: { total: count, page, limit } };
}
