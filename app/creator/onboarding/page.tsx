'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { creatorOnboardingSchema } from '@/lib/validations';
import type { CreatorOnboardingInput } from '@/lib/validations';
import type { ApiResponse, Creator } from '@/lib/types';
import { detectPlatform } from '@/lib/utils';
import { PLATFORMS } from '@/lib/constants';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

const PLATFORM_LABELS: Record<string, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  naver_blog: '네이버 블로그',
};

export default function CreatorOnboardingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreatorOnboardingInput>({
    channelName: '',
    channelUrl: '',
    platform: '' as CreatorOnboardingInput['platform'],
  });
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof CreatorOnboardingInput, string>>>({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value;
      setFormData((prev) => ({ ...prev, channelUrl: url }));
      setErrors((prev) => ({ ...prev, channelUrl: undefined }));
      setServerError('');

      const detected = detectPlatform(url);
      setDetectedPlatform(detected);

      if (detected) {
        setFormData((prev) => ({
          ...prev,
          channelUrl: url,
          platform: detected as CreatorOnboardingInput['platform'],
        }));
        setErrors((prev) => ({ ...prev, platform: undefined }));
      }
    },
    []
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError('');
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError('');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError('');

    const parsed = creatorOnboardingSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof CreatorOnboardingInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof CreatorOnboardingInput;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      const result: ApiResponse<Creator> = await response.json();

      if (!result.success) {
        setServerError(result.error ?? '등록에 실패했습니다');
        setIsLoading(false);
        return;
      }

      router.push('/creator/dashboard');
    } catch {
      setServerError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md hover:shadow-sm hover:translate-y-0">
        <CardHeader className="text-center">
          <p className="text-2xl font-bold text-primary mb-2">인플링</p>
          <CardTitle className="text-xl">채널 정보 입력</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                1
              </span>
              기본 정보를 입력해주세요
            </span>
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4">
            {serverError && (
              <div
                role="alert"
                className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger"
              >
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="channelName">채널명</Label>
              <Input
                id="channelName"
                name="channelName"
                type="text"
                placeholder="채널 이름을 입력하세요"
                value={formData.channelName}
                onChange={handleChange}
                error={!!errors.channelName}
                disabled={isLoading}
                aria-describedby={errors.channelName ? 'channelName-error' : undefined}
              />
              {errors.channelName && (
                <p id="channelName-error" className="text-sm text-danger">
                  {errors.channelName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="channelUrl">채널 URL</Label>
              <Input
                id="channelUrl"
                name="channelUrl"
                type="url"
                placeholder="https://youtube.com/@channel"
                value={formData.channelUrl}
                onChange={handleUrlChange}
                error={!!errors.channelUrl}
                disabled={isLoading}
                aria-describedby={
                  errors.channelUrl
                    ? 'channelUrl-error'
                    : detectedPlatform
                      ? 'channelUrl-detected'
                      : undefined
                }
              />
              {detectedPlatform && !errors.channelUrl && (
                <p
                  id="channelUrl-detected"
                  className="text-sm text-accent font-medium"
                >
                  {PLATFORM_LABELS[detectedPlatform]} 감지됨
                </p>
              )}
              {errors.channelUrl && (
                <p id="channelUrl-error" className="text-sm text-danger">
                  {errors.channelUrl}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">플랫폼</Label>
              <Select
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleSelectChange}
                error={!!errors.platform}
                disabled={isLoading}
                aria-describedby={errors.platform ? 'platform-error' : undefined}
              >
                <option value="" disabled>
                  플랫폼을 선택하세요
                </option>
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </Select>
              {errors.platform && (
                <p id="platform-error" className="text-sm text-danger">
                  {errors.platform}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  등록 중...
                </>
              ) : (
                '시작하기'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
