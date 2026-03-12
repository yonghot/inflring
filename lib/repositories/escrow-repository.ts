import { SupabaseClient } from '@supabase/supabase-js';
import { Escrow } from '@/lib/types';

export async function getEscrowByContractId(
  supabase: SupabaseClient,
  contractId: string
): Promise<Escrow | null> {
  const { data, error } = await supabase
    .from('escrow')
    .select('*')
    .eq('contract_id', contractId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

export async function createEscrow(
  supabase: SupabaseClient,
  data: {
    contract_id: string;
    amount: number;
    platform_fee: number;
    status: Escrow['status'];
  }
): Promise<Escrow> {
  const { data: escrow, error } = await supabase
    .from('escrow')
    .insert(data)
    .select('*')
    .single();

  if (error) throw error;

  return escrow;
}

export async function updateEscrow(
  supabase: SupabaseClient,
  id: string,
  data: Partial<Escrow>
): Promise<Escrow> {
  const { data: escrow, error } = await supabase
    .from('escrow')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;

  return escrow;
}
