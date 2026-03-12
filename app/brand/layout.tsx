'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Megaphone,
  Search,
  Handshake,
} from 'lucide-react';
import { AuthProvider, useAuthContext } from '@/components/features/auth/auth-provider';
import {
  DashboardSidebar,
  type SidebarMenuItem,
} from '@/components/layout/dashboard-sidebar';

const BRAND_MENU: SidebarMenuItem[] = [
  { href: '/brand/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/brand/campaigns', label: '내 캠페인', icon: Megaphone },
  { href: '/brand/creators', label: '인플루언서 찾기', icon: Search },
  { href: '/brand/deals', label: '내 딜', icon: Handshake },
];

function BrandLayoutInner({ children }: { children: React.ReactNode }) {
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
        menuItems={BRAND_MENU}
        userName={profile.display_name}
        onSignOut={signOut}
      />
      <main className="md:ml-64 pt-14 md:pt-0">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <BrandLayoutInner>{children}</BrandLayoutInner>
    </AuthProvider>
  );
}
