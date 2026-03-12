import { SupabaseClient } from '@supabase/supabase-js';
import { Brand } from '@/lib/types';

interface CreateBrandData {
  profile_id: string;
  company_name: string;
  business_category: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string | null;
  website_url?: string | null;
}

export async function getBrandById(
  supabase: SupabaseClient,
  id: string
): Promise<Brand | null> {
  const { data, error } = await supabase
    .from('brands')
    .select('*, profile:profiles(*)')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

export async function getBrandByProfileId(
  supabase: SupabaseClient,
  profileId: string
): Promise<Brand | null> {
  const { data, error } = await supabase
    .from('brands')
    .select('*, profile:profiles(*)')
    .eq('profile_id', profileId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

export async function createBrand(
  supabase: SupabaseClient,
  data: CreateBrandData
): Promise<Brand> {
  const insertData = {
    ...data,
    total_deals: 0,
    total_spend: 0,
  };

  const { data: brand, error } = await supabase
    .from('brands')
    .insert(insertData)
    .select('*, profile:profiles(*)')
    .single();

  if (error) throw error;

  return brand;
}
