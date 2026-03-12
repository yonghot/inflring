'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard } from 'lucide-react';
import { AuthProvider, useAuthContext } from '@/components/features/auth/auth-provider';
import {
  DashboardSidebar,
  type SidebarMenuItem,
} from '@/components/layout/dashboard-sidebar';

const ADMIN_MENU: SidebarMenuItem[] = [
  { href: '/admin/dashboard', label: '대시보드', icon: LayoutDashboard },
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
