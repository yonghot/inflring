'use client';

import { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import type { Profile } from '@/lib/types';
import type { User } from '@supabase/supabase-js';

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md space-y-4 p-6">
        <Skeleton className="h-8 w-32 mx-auto" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-4 w-2/3 mx-auto" />
      </div>
    </div>
  );
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  if (auth.loading) {
    return <AuthLoadingSkeleton />;
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
