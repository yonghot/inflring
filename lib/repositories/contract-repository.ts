import { SupabaseClient } from '@supabase/supabase-js';
import { Contract } from '@/lib/types';

const CONTRACT_SELECT = '*, match:matches(*, campaign:campaigns(*, brand:brands(*)), creator:creators(*, profile:profiles(*))), escrow:escrow(*)';

export async function getContractById(
  supabase: SupabaseClient,
  id: string
): Promise<Contract | null> {
  const { data, error } = await supabase
    .from('contracts')
    .select(CONTRACT_SELECT)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

export async function getContractByMatchId(
  supabase: SupabaseClient,
  matchId: string
): Promise<Contract | null> {
  const { data, error } = await supabase
    .from('contracts')
    .select(CONTRACT_SELECT)
    .eq('match_id', matchId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

export async function getContractsByUserId(
  supabase: SupabaseClient,
  userId: string
): Promise<Contract[]> {
  const { data, error } = await supabase
    .from('contracts')
    .select(CONTRACT_SELECT)
    .or(`creator_id.eq.${userId},brand_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function createContract(
  supabase: SupabaseClient,
  data: {
    match_id: string;
    creator_id: string;
    brand_id: string;
    amount: number;
    platform_fee: number;
    content_requirements: string;
    delivery_deadline: string;
    max_revisions: number;
    status: Contract['status'];
  }
): Promise<Contract> {
  const { data: contract, error } = await supabase
    .from('contracts')
    .insert({
      ...data,
      revision_count: 0,
      signed_by_creator: false,
      signed_by_brand: false,
    })
    .select(CONTRACT_SELECT)
    .single();

  if (error) throw error;

  return contract;
}

export async function updateContract(
  supabase: SupabaseClient,
  id: string,
  data: Partial<Contract>
): Promise<Contract> {
  const { data: contract, error } = await supabase
    .from('contracts')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(CONTRACT_SELECT)
    .single();

  if (error) throw error;

  return contract;
}
