'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/shared/motion-wrapper';
import {
  CampaignFormFields,
  INITIAL_CAMPAIGN_FORM,
  type CampaignFormData,
} from '@/components/features/campaign/campaign-form-fields';
import type { ApiResponse, Campaign } from '@/lib/types';

export default function BrandCampaignNewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CampaignFormData>(INITIAL_CAMPAIGN_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  }

  function toggleCategory(cat: string) {
    setFormData((prev) => {
      const current = prev.target_categories;
      const updated = current.includes(cat)
        ? current.filter((c) => c !== cat)
        : [...current, cat];
      return { ...prev, target_categories: updated };
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) { setError('캠페인 제목을 입력하세요.'); return; }
    if (!formData.description.trim()) { setError('캠페인 설명을 입력하세요.'); return; }
    if (!formData.content_type) { setError('콘텐츠 유형을 선택하세요.'); return; }
    if (!formData.target_platform) { setError('플랫폼을 선택하세요.'); return; }
    if (!formData.budget_min || !formData.budget_max) { setError('예산 범위를 입력하세요.'); return; }

    setIsLoading(true);

    try {
      const body = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        content_type: formData.content_type,
        target_platform: formData.target_platform,
        target_categories: formData.target_categories,
        min_subscribers: formData.min_subscribers ? Number(formData.min_subscribers) : null,
        max_subscribers: formData.max_subscribers ? Number(formData.max_subscribers) : null,
        budget_min: Number(formData.budget_min),
        budget_max: Number(formData.budget_max),
        campaign_start: formData.campaign_start || null,
        campaign_end: formData.campaign_end || null,
        requirements: formData.requirements.trim() || null,
      };

      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result: ApiResponse<Campaign> = await res.json();

      if (result.success) {
        router.push('/brand/campaigns');
      } else {
        setError(result.error ?? '캠페인 등록에 실패했습니다.');
        setIsLoading(false);
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <FadeIn>
        <Card className="hover:shadow-sm hover:translate-y-0">
          <CardHeader>
            <CardTitle className="text-xl">새 캠페인 등록</CardTitle>
            <CardDescription>캠페인 정보를 입력해주세요.</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} noValidate>
            <CardContent className="space-y-5">
              {error && (
                <div role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
                  {error}
                </div>
              )}

              <CampaignFormFields
                formData={formData}
                onChange={handleChange}
                onSelectChange={handleSelectChange}
                onToggleCategory={toggleCategory}
                disabled={isLoading}
              />
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />등록 중...</>
                ) : (
                  '캠페인 등록'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </FadeIn>
    </div>
  );
}
