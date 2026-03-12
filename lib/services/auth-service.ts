import { SupabaseClient } from '@supabase/supabase-js';
import { Profile, UserRole } from '@/lib/types';
import { SignupInput, LoginInput } from '@/lib/validations';
import { createAdminClient } from '@/lib/supabase/admin';
import { createProfile, getProfileById } from '@/lib/repositories/profile-repository';

interface SignupResult {
  user: { id: string; email: string };
  profile: Profile;
}

interface LoginResult {
  user: { id: string; email: string };
  session: { access_token: string; refresh_token: string };
}

interface CurrentUserResult {
  user: { id: string; email: string };
  profile: Profile;
}

export async function signup(data: SignupInput): Promise<SignupResult> {
  const admin = createAdminClient();

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
  });

  if (authError) {
    if (authError.message.includes('already')) {
      throw new Error('이미 등록된 이메일입니다');
    }
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error('사용자 생성에 실패했습니다');
  }

  const profile = await createProfile(admin, {
    id: authData.user.id,
    role: data.role as UserRole,
    display_name: data.displayName,
    email: data.email,
  });

  return {
    user: { id: authData.user.id, email: data.email },
    profile,
  };
}

export async function login(
  supabase: SupabaseClient,
  data: LoginInput
): Promise<LoginResult> {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
  }

  if (!authData.session) {
    throw new Error('세션 생성에 실패했습니다');
  }

  return {
    user: { id: authData.user.id, email: authData.user.email ?? '' },
    session: {
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
    },
  };
}

export async function getCurrentUser(
  supabase: SupabaseClient
): Promise<CurrentUserResult> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('인증이 필요합니다');
  }

  const profile = await getProfileById(supabase, user.id);

  if (!profile) {
    throw new Error('프로필을 찾을 수 없습니다');
  }

  return {
    user: { id: user.id, email: user.email ?? '' },
    profile,
  };
}
