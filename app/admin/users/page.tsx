'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper';
import type { ApiResponse, Profile, UserRole } from '@/lib/types';

/** 역할 Badge 색상 맵 */
const ROLE_BADGE: Record<UserRole, { label: string; className: string }> = {
  creator: { label: '크리에이터', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  brand: { label: '광고주', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  admin: { label: '관리자', className: 'bg-red-100 text-red-700 border-red-200' },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page), limit: '20' });
        if (roleFilter) params.set('role', roleFilter);
        const res = await fetch(`/api/admin/users?${params}`);
        const result: ApiResponse<Profile[]> = await res.json();
        if (result.success && result.data) {
          setUsers(result.data);
          if (result.meta?.total) {
            setTotalPages(Math.ceil(result.meta.total / 20));
          }
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [page, roleFilter]);

  return (
    <div className="space-y-6 py-8">
      <FadeIn>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">사용자 관리</h1>
            <p className="text-sm text-text-secondary mt-1">플랫폼 전체 사용자를 조회합니다.</p>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">전체</option>
            <option value="creator">크리에이터</option>
            <option value="brand">광고주</option>
            <option value="admin">관리자</option>
          </select>
        </div>
      </FadeIn>

      {loading ? (
        <TableSkeleton rows={8} cols={5} />
      ) : users.length === 0 ? (
        <FadeIn>
          <EmptyState icon={Users} title="사용자가 없습니다" description="조건에 맞는 사용자가 없습니다." />
        </FadeIn>
      ) : (
        <StaggerContainer>
          <StaggerItem>
            <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">이름</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">이메일</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">역할</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">신뢰점수</th>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary">가입일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => {
                    const badge = ROLE_BADGE[user.role];
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-text-primary">{user.display_name}</td>
                        <td className="px-4 py-3 text-text-secondary">{user.email}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={badge.className}>{badge.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-text-secondary">{user.trust_score}</td>
                        <td className="px-4 py-3 text-text-secondary">
                          {new Date(user.created_at).toLocaleDateString('ko-KR')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </StaggerItem>
        </StaggerContainer>
      )}

      {!loading && users.length > 0 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            이전
          </Button>
          <span className="text-sm text-text-secondary">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
