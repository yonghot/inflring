'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Megaphone,
  GitMerge,
  FileText,
  Star,
} from 'lucide-react';
import { AuthProvider, useAuthContext } from '@/components/features/auth/auth-provider';
import {
  DashboardSidebar,
  type SidebarMenuItem,
} from '@/components/layout/dashboard-sidebar';

const ADMIN_MENU: SidebarMenuItem[] = [
  { href: '/admin/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/admin/users', label: '사용자 관리', icon: Users },
  { href: '/admin/creators', label: '크리에이터 관리', icon: UserCheck },
  { href: '/admin/campaigns', label: '캠페인 관리', icon: Megaphone },
  { href: '/admin/matches', label: '매칭 관리', icon: GitMerge },
  { href: '/admin/contracts', label: '계약 관리', icon: FileText },
  { href: '/admin/reviews', label: '리뷰 관리', icon: Star },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
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
        menuItems={ADMIN_MENU}
        userName={profile.display_name}
        onSignOut={signOut}
      />
      <main className="md:ml-64 pt-14 md:pt-0">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}
