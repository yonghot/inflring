import { SupabaseClient } from '@supabase/supabase-js';
import { Profile, UserRole } from '@/lib/types';

export async function getProfileById(
  supabase: SupabaseClient,
  id: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

export async function createProfile(
  supabase: SupabaseClient,
  data: {
    id: string;
    role: UserRole;
    display_name: string;
    email: string;
  }
): Promise<Profile> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert(data)
    .select('*')
    .single();

  if (error) throw error;

  return profile;
}

export async function updateProfile(
  supabase: SupabaseClient,
  id: string,
  data: Partial<Profile>
): Promise<Profile> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;

  return profile;
}
