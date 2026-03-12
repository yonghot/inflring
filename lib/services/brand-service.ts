import { SupabaseClient } from '@supabase/supabase-js';
import { Brand } from '@/lib/types';
import { BrandOnboardingInput } from '@/lib/validations';
import {
  createBrand,
  getBrandById as getBrandByIdRepo,
  getBrandByProfileId,
} from '@/lib/repositories/brand-repository';
import { ValidationError } from '@/lib/utils/api-helpers';

export async function onboard(
  supabase: SupabaseClient,
  profileId: string,
  data: BrandOnboardingInput
): Promise<Brand> {
  const existing = await getBrandByProfileId(supabase, profileId);
  if (existing) {
    throw new ValidationError('이미 광고주로 등록되어 있습니다');
  }

  return createBrand(supabase, {
    profile_id: profileId,
    company_name: data.companyName,
    business_category: data.businessCategory,
    contact_name: data.contactName,
    contact_email: data.contactEmail,
    contact_phone: data.contactPhone ?? null,
    website_url: data.websiteUrl || null,
  });
}

export async function getBrandById(
  supabase: SupabaseClient,
  id: string
): Promise<Brand> {
  const brand = await getBrandByIdRepo(supabase, id);
  if (!brand) {
    throw new ValidationError('광고주를 찾을 수 없습니다');
  }
  return brand;
}
