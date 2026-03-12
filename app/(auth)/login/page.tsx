'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { loginSchema } from '@/lib/validations';
import type { LoginInput } from '@/lib/validations';
import type { ApiResponse, Profile, UserRole } from '@/lib/types';
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

interface LoginResponseData {
  user: { id: string; email: string };
  session: { access_token: string; refresh_token: string };
}

const DASHBOARD_ROUTES: Record<UserRole, string> = {
  creator: '/creator/dashboard',
  brand: '/brand/dashboard',
  admin: '/admin/dashboard',
};

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError('');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError('');

    const parsed = loginSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof LoginInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof LoginInput;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      const result: ApiResponse<LoginResponseData> = await response.json();

      if (!result.success) {
        setServerError(result.error ?? '로그인에 실패했습니다');
        setIsLoading(false);
        return;
      }

      const meResponse = await fetch('/api/auth/me');
      const meResult: ApiResponse<{ profile: Profile }> = await meResponse.json();

      if (meResult.success && meResult.data) {
        const role = meResult.data.profile.role;
        router.push(DASHBOARD_ROUTES[role]);
      } else {
        router.push('/');
      }
    } catch {
      setServerError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md hover:shadow-sm hover:translate-y-0">
      <CardHeader className="text-center">
        <p className="text-2xl font-bold text-primary mb-2">인플링</p>
        <CardTitle className="text-xl">로그인</CardTitle>
        <CardDescription>계정에 로그인하세요</CardDescription>
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
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-danger">
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
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              disabled={isLoading}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-danger">
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
                로그인 중...
              </>
            ) : (
              '로그인'
            )}
          </Button>

          <p className="text-sm text-text-secondary text-center">
            계정이 없으신가요?{' '}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              회원가입
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
