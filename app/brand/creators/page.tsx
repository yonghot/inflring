'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Users, SlidersHorizontal } from 'lucide-react';
import { CreatorCard } from '@/components/features/creator/creator-card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper';
import { PLATFORMS, CONTENT_CATEGORIES } from '@/lib/constants';
import type { ApiResponse, Creator, Platform } from '@/lib/types';

interface Filters {
  platform: Platform | '';
  category: string;
  minSubscribers: string;
  maxSubscribers: string;
}

export default function BrandCreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    platform: '',
    category: '',
    minSubscribers: '',
    maxSubscribers: '',
  });

  const fetchCreators = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.platform) params.set('platform', filters.platform);
      if (filters.category) params.set('category', filters.category);
      if (filters.minSubscribers) params.set('min_subscribers', filters.minSubscribers);
      if (filters.maxSubscribers) params.set('max_subscribers', filters.maxSubscribers);

      const url = `/api/creators${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      const result: ApiResponse<Creator[]> = await res.json();
      if (result.success && result.data) {
        setCreators(result.data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCreators();
  }, [fetchCreators]);

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div
      className="space-y-6 py-8 min-h-screen"
      style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }}
    >
      <FadeIn>
        <h1 className="text-2xl font-bold text-text-primary">인플루언서 찾기</h1>
        <p className="text-sm text-text-secondary mt-1">
          조건에 맞는 인플루언서를 검색하세요.
        </p>
      </FadeIn>

      {/* Filters - improved design */}
      <FadeIn delay={0.1}>
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal size={16} className="text-text-muted" aria-hidden="true" />
            <span className="text-sm font-medium text-text-secondary">필터</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Select
              name="platform"
              value={filters.platform}
              onChange={handleSelectChange}
              aria-label="플랫폼 필터"
            >
              <option value="">모든 플랫폼</option>
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </Select>

            <Select
              name="category"
              value={filters.category}
              onChange={handleSelectChange}
              aria-label="카테고리 필터"
            >
              <option value="">모든 카테고리</option>
              {CONTENT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>

            <Input
              name="minSubscribers"
              type="number"
              placeholder="최소 구독자"
              value={filters.minSubscribers}
              onChange={handleInputChange}
              aria-label="최소 구독자 수"
            />

            <Input
              name="maxSubscribers"
              type="number"
              placeholder="최대 구독자"
              value={filters.maxSubscribers}
              onChange={handleInputChange}
              aria-label="최대 구독자 수"
            />
          </div>
        </div>
      </FadeIn>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} lines={3} />
          ))}
        </div>
      ) : creators.length === 0 ? (
        <FadeIn delay={0.2}>
          <EmptyState
            icon={Users}
            title="조건에 맞는 인플루언서가 없습니다"
            description="검색 조건을 변경해보세요."
          />
        </FadeIn>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <StaggerItem key={creator.id}>
              <CreatorCard
                creator={creator}
                href={`/brand/creators/${creator.id}`}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
