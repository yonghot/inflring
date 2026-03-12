'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Profile, ApiResponse } from '@/lib/types';
import type { User } from '@supabase/supabase-js';

interface UseAuthReturn {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me');
      const result: ApiResponse<{ user: { id: string; email: string }; profile: Profile }> =
        await response.json();

      if (result.success && result.data) {
        setProfile(result.data.profile);
      } else {
        setProfile(null);
      }
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile();
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push('/login');
  }, [supabase, router]);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  return { user, profile, loading, signOut, refreshProfile };
}
