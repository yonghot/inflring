'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  Building2,
  Megaphone,
  UserPlus,
  CalendarPlus,
  Handshake,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper';
import type { ApiResponse } from '@/lib/types';

interface AdminStats {
  totalUsers: number;
  totalCreators: number;
  totalBrands: number;
  totalCampaigns: number;
  todayNewUsers: number;
  todayNewCampaigns: number;
  todayNewMatches: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const result: ApiResponse<AdminStats> = await res.json();
        if (result.success && result.data) {
          setStats(result.data);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} lines={1} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} lines={1} />
          ))}
        </div>
      </div>
    );
  }

  const overviewCards = [
    {
      label: '총 사용자',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: '크리에이터',
      value: stats?.totalCreators ?? 0,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: '광고주',
      value: stats?.totalBrands ?? 0,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: '캠페인',
      value: stats?.totalCampaigns ?? 0,
      icon: Megaphone,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const todayCards = [
    {
      label: '오늘 신규 사용자',
      value: stats?.todayNewUsers ?? 0,
      icon: UserPlus,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: '오늘 신규 캠페인',
      value: stats?.todayNewCampaigns ?? 0,
      icon: CalendarPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: '오늘 신규 매칭',
      value: stats?.todayNewMatches ?? 0,
      icon: Handshake,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-8">
      <FadeIn>
        <h1 className="text-2xl font-bold text-text-primary">관리자 대시보드</h1>
      </FadeIn>

      {/* Overview stats */}
      <div>
        <FadeIn delay={0.1}>
          <h2 className="text-lg font-semibold text-text-primary mb-4">전체 현황</h2>
        </FadeIn>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <StaggerItem key={stat.label}>
                <Card className="hover:shadow-md hover:-translate-y-0.5">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                      <Icon size={24} className={stat.color} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>

      {/* Today stats */}
      <div>
        <FadeIn delay={0.3}>
          <h2 className="text-lg font-semibold text-text-primary mb-4">오늘</h2>
        </FadeIn>
        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {todayCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <StaggerItem key={stat.label}>
                <Card className="hover:shadow-md hover:-translate-y-0.5">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                      <Icon size={24} className={stat.color} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </div>
  );
}
