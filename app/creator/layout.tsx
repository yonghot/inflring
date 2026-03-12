'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Megaphone,
  Handshake,
  UserCog,
} from 'lucide-react';
import { AuthProvider, useAuthContext } from '@/components/features/auth/auth-provider';
import {
  DashboardSidebar,
  type SidebarMenuItem,
} from '@/components/layout/dashboard-sidebar';

const CREATOR_MENU: SidebarMenuItem[] = [
  { href: '/creator/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/creator/campaigns', label: '캠페인 피드', icon: Megaphone },
  { href: '/creator/deals', label: '내 딜', icon: Handshake },
  { href: '/creator/profile/edit', label: '프로필 설정', icon: UserCog },
];

function CreatorLayoutInner({ children }: { children: React.ReactNode }) {
  const { profile, loading, signOut } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !profile) {
      router.push('/login');
    }
  }, [loading, profile, router]);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-surface">
      <DashboardSidebar
        menuItems={CREATOR_MENU}
        userName={profile.display_name}
        onSignOut={signOut}
      />
      <main className="md:ml-64 pt-14 md:pt-0">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CreatorLayoutInner>{children}</CreatorLayoutInner>
    </AuthProvider>
  );
}
