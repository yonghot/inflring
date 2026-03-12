'use client';

import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { useAuthContext } from '@/components/features/auth/auth-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { FadeIn } from '@/components/shared/motion-wrapper';
import { CategoryCheckboxGrid } from '@/components/features/creator/category-checkbox-grid';
import { CONTENT_CATEGORIES, BLOCKED_CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { ApiResponse, Creator } from '@/lib/types';

interface ProfileFormData {
  is_available: boolean;
  min_price: string;
  max_price: string;
  preferred_categories: string[];
  blocked_categories: string[];
  max_monthly_deals: string;
}

export default function CreatorProfileEditPage() {
  const { refreshProfile } = useAuthContext();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    is_available: true,
    min_price: '',
    max_price: '',
    preferred_categories: [],
    blocked_categories: [],
    max_monthly_deals: '4',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchCreator() {
      try {
        const res = await fetch('/api/auth/me');
        const result: ApiResponse<{ creator?: Creator }> = await res.json();
        if (result.success && result.data?.creator) {
          const c = result.data.creator;
          setCreator(c);
          setFormData({
            is_available: c.is_available,
            min_price: c.min_price?.toString() ?? '',
            max_price: c.max_price?.toString() ?? '',
            preferred_categories: c.preferred_categories,
            blocked_categories: c.blocked_categories,
            max_monthly_deals: c.max_monthly_deals.toString(),
          });
        }
      } catch {
        setMessage({ type: 'error', text: '프로필 정보를 불러오지 못했습니다.' });
      } finally {
        setLoading(false);
      }
    }
    fetchCreator();
  }, []);

  function toggleCategory(category: string, field: 'preferred_categories' | 'blocked_categories') {
    setFormData((prev) => {
      const current = prev[field];
      const updated = current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category];
      return { ...prev, [field]: updated };
    });
    setMessage(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!creator) return;
    setSaving(true);
    setMessage(null);

    try {
      const body = {
        is_available: formData.is_available,
        min_price: formData.min_price ? Number(formData.min_price) : null,
        max_price: formData.max_price ? Number(formData.max_price) : null,
        preferred_categories: formData.preferred_categories,
        blocked_categories: formData.blocked_categories,
        max_monthly_deals: Number(formData.max_monthly_deals) || 4,
      };
      const res = await fetch(`/api/creators/${creator.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result: ApiResponse<Creator> = await res.json();
      if (result.success) {
        setMessage({ type: 'success', text: '프로필이 저장되었습니다.' });
        await refreshProfile();
      } else {
        setMessage({ type: 'error', text: result.error ?? '저장에 실패했습니다.' });
      }
    } catch {
      setMessage({ type: 'error', text: '네트워크 오류가 발생했습니다.' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <CardSkeleton lines={4} />
        <CardSkeleton lines={6} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-bold text-text-primary">프로필 설정</h1>
      </FadeIn>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FadeIn delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">광고 수용 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_available">광고 제안 받기</Label>
                <button
                  id="is_available"
                  type="button"
                  role="switch"
                  aria-checked={formData.is_available}
                  onClick={() => setFormData((prev) => ({ ...prev, is_available: !prev.is_available }))}
                  className={cn(
                    'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
                    formData.is_available ? 'bg-primary' : 'bg-slate-300'
                  )}
                >
                  <span className={cn(
                    'inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm',
                    formData.is_available ? 'translate-x-6' : 'translate-x-1'
                  )} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_price">최소 단가 (원)</Label>
                  <Input id="min_price" type="number" placeholder="100000" value={formData.min_price} onChange={(e) => setFormData((prev) => ({ ...prev, min_price: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_price">최대 단가 (원)</Label>
                  <Input id="max_price" type="number" placeholder="1000000" value={formData.max_price} onChange={(e) => setFormData((prev) => ({ ...prev, max_price: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_monthly_deals">월간 최대 건수</Label>
                <Input id="max_monthly_deals" type="number" min={1} max={30} value={formData.max_monthly_deals} onChange={(e) => setFormData((prev) => ({ ...prev, max_monthly_deals: e.target.value }))} />
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">선호 카테고리</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryCheckboxGrid
                categories={CONTENT_CATEGORIES}
                selected={formData.preferred_categories}
                onToggle={(cat) => toggleCategory(cat, 'preferred_categories')}
                variant="primary"
              />
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.3}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">제외 카테고리</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryCheckboxGrid
                categories={BLOCKED_CATEGORIES}
                selected={formData.blocked_categories}
                onToggle={(cat) => toggleCategory(cat, 'blocked_categories')}
                variant="danger"
              />
            </CardContent>
          </Card>
        </FadeIn>

        {message && (
          <div role="alert" className={cn('rounded-lg px-4 py-3 text-sm', message.type === 'success' ? 'bg-accent/10 text-green-700' : 'bg-danger/10 text-danger')}>
            {message.text}
          </div>
        )}

        <FadeIn delay={0.4}>
          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />저장 중...</>) : (<><Save className="mr-2 h-4 w-4" />저장하기</>)}
          </Button>
        </FadeIn>
      </form>
    </div>
  );
}
