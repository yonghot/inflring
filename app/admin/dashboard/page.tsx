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
  Shield,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
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

/** Mini sparkline bars for stat cards */
function MiniSparkline({ color, heights }: { color: string; heights: number[] }) {
  return (
    <div className="flex items-end gap-[3px] h-8 ml-auto opacity-40">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className={`w-[4px] rounded-full ${color}`}
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
        />
      ))}
    </div>
  );
}

const SPARKLINE_SETS = [
  [40, 65, 50, 80, 60, 90, 75],
  [30, 50, 70, 45, 85, 60, 95],
  [55, 70, 40, 80, 65, 50, 85],
  [60, 45, 75, 55, 80, 70, 90],
];

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
      <div className="space-y-6 py-8">
        <div className="h-20 w-full bg-slate-200 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} lines={1} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
      gradient: 'from-blue-500/10 via-blue-400/5 to-transparent',
      iconBg: 'bg-blue-500/15',
      color: 'text-primary',
      sparkColor: 'bg-primary',
    },
    {
      label: '크리에이터',
      value: stats?.totalCreators ?? 0,
      icon: UserCheck,
      gradient: 'from-green-500/10 via-green-400/5 to-transparent',
      iconBg: 'bg-green-500/15',
      color: 'text-green-600',
      sparkColor: 'bg-green-500',
    },
    {
      label: '광고주',
      value: stats?.totalBrands ?? 0,
      icon: Building2,
      gradient: 'from-purple-500/10 via-purple-400/5 to-transparent',
      iconBg: 'bg-purple-500/15',
      color: 'text-purple-600',
      sparkColor: 'bg-purple-500',
    },
    {
      label: '캠페인',
      value: stats?.totalCampaigns ?? 0,
      icon: Megaphone,
      gradient: 'from-orange-500/10 via-orange-400/5 to-transparent',
      iconBg: 'bg-orange-500/15',
      color: 'text-orange-600',
      sparkColor: 'bg-orange-500',
    },
  ];

  const todayCards = [
    {
      label: '오늘 신규 사용자',
      value: stats?.todayNewUsers ?? 0,
      icon: UserPlus,
      gradient: 'from-blue-500/10 via-blue-400/5 to-transparent',
      iconBg: 'bg-blue-500/15',
      color: 'text-primary',
      sparkColor: 'bg-primary',
    },
    {
      label: '오늘 신규 캠페인',
      value: stats?.todayNewCampaigns ?? 0,
      icon: CalendarPlus,
      gradient: 'from-green-500/10 via-green-400/5 to-transparent',
      iconBg: 'bg-green-500/15',
      color: 'text-green-600',
      sparkColor: 'bg-green-500',
    },
    {
      label: '오늘 신규 매칭',
      value: stats?.todayNewMatches ?? 0,
      icon: Handshake,
      gradient: 'from-purple-500/10 via-purple-400/5 to-transparent',
      iconBg: 'bg-purple-500/15',
      color: 'text-purple-600',
      sparkColor: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-8 py-8">
      {/* Welcome Banner */}
      <FadeIn>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 p-6 md:p-8 text-white">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
              <Shield size={16} />
              <span>관리자 대시보드</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">플랫폼 현황</h1>
            <p className="mt-2 text-white/80 text-sm md:text-base">
              인플링 플랫폼의 전체 통계를 한눈에 확인하세요.
            </p>
          </div>
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -right-4 w-32 h-32 rounded-full bg-white/5" />
        </div>
      </FadeIn>

      {/* Overview stats */}
      <div>
        <FadeIn delay={0.1}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">전체 현황</h2>
          </div>
        </FadeIn>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <StaggerItem key={stat.label}>
                <Card className="hover:shadow-md hover:-translate-y-0.5 overflow-hidden">
                  <CardContent className="p-5 relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient}`} />
                    <div className="relative flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}>
                        <Icon size={24} className={stat.color} aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-secondary">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>
                          {stat.value}
                        </p>
                      </div>
                      <MiniSparkline color={stat.sparkColor} heights={SPARKLINE_SETS[idx]} />
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
          <div className="flex items-center gap-2 mb-4">
            <CalendarPlus size={20} className="text-green-600" />
            <h2 className="text-lg font-semibold text-text-primary">오늘</h2>
          </div>
        </FadeIn>
        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {todayCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <StaggerItem key={stat.label}>
                <Card className="hover:shadow-md hover:-translate-y-0.5 overflow-hidden">
                  <CardContent className="p-5 relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient}`} />
                    <div className="relative flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}>
                        <Icon size={24} className={stat.color} aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-secondary">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>
                          {stat.value}
                        </p>
                      </div>
                      <MiniSparkline color={stat.sparkColor} heights={SPARKLINE_SETS[idx]} />
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
