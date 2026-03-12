'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Video, Megaphone } from 'lucide-react';
import { signupSchema } from '@/lib/validations';
import type { SignupInput } from '@/lib/validations';
import type { ApiResponse, Profile } from '@/lib/types';
import { cn } from '@/lib/utils';
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

type RoleOption = 'creator' | 'brand';

interface SignupResponseData {
  user: { id: string; email: string };
  profile: Profile;
}

const ONBOARDING_ROUTES: Record<RoleOption, string> = {
  creator: '/creator/onboarding',
  brand: '/brand/onboarding',
};

const ROLE_OPTIONS: { value: RoleOption; label: string; description: string; icon: typeof Video }[] = [
  {
    value: 'creator',
    label: '크리에이터',
    description: '콘텐츠를 만들고 광고를 수주합니다',
    icon: Video,
  },
  {
    value: 'brand',
    label: '광고주',
    description: '크리에이터에게 광고를 의뢰합니다',
    icon: Megaphone,
  },
];

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupInput>({
    email: '',
    password: '',
    displayName: '',
    role: '' as SignupInput['role'],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignupInput, string>>>({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError('');
  }

  function handleRoleSelect(role: RoleOption) {
    setFormData((prev) => ({ ...prev, role }));
    setErrors((prev) => ({ ...prev, role: undefined }));
    setServerError('');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError('');

    const parsed = signupSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof SignupInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof SignupInput;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      const result: ApiResponse<SignupResponseData> = await response.json();

      if (!result.success) {
        setServerError(result.error ?? '회원가입에 실패했습니다');
        setIsLoading(false);
        return;
      }

      const role = parsed.data.role as RoleOption;
      router.push(ONBOARDING_ROUTES[role]);
    } catch {
      setServerError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md hover:shadow-sm hover:translate-y-0">
      <CardHeader className="text-center">
        <p className="text-2xl font-bold text-primary mb-2">인플링</p>
        <CardTitle className="text-xl">회원가입</CardTitle>
        <CardDescription>인플링에 가입하고 시작하세요</CardDescription>
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
            <Label>역할 선택</Label>
            <div className="grid grid-cols-2 gap-3">
              {ROLE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.role === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleRoleSelect(option.value)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-all duration-200',
                      'hover:border-primary/50 hover:bg-primary/5',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border bg-white text-text-secondary'
                    )}
                    aria-pressed={isSelected}
                    disabled={isLoading}
                  >
                    <Icon
                      className={cn(
                        'h-6 w-6',
                        isSelected ? 'text-primary' : 'text-text-muted'
                      )}
                    />
                    <span className="text-sm font-semibold">{option.label}</span>
                    <span className="text-xs leading-tight">{option.description}</span>
                  </button>
                );
              })}
            </div>
            {errors.role && (
              <p className="text-sm text-danger">{errors.role}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">이름</Label>
            <Input
              id="displayName"
              name="displayName"
              type="text"
              placeholder="이름을 입력하세요"
              autoComplete="name"
              value={formData.displayName}
              onChange={handleChange}
              error={!!errors.displayName}
              disabled={isLoading}
              aria-describedby={errors.displayName ? 'displayName-error' : undefined}
            />
            {errors.displayName && (
              <p id="displayName-error" className="text-sm text-danger">
                {errors.displayName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              disabled={isLoading}
              aria-describedby={errors.email ? 'signup-email-error' : undefined}
            />
            {errors.email && (
              <p id="signup-email-error" className="text-sm text-danger">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="6자 이상 입력하세요"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              disabled={isLoading}
              aria-describedby={errors.password ? 'signup-password-error' : undefined}
            />
            {errors.password && (
              <p id="signup-password-error" className="text-sm text-danger">
                {errors.password}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                가입 중...
              </>
            ) : (
              '회원가입'
            )}
          </Button>

          <p className="text-sm text-text-secondary text-center">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              로그인
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
