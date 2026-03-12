import { SupabaseClient } from '@supabase/supabase-js';

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
