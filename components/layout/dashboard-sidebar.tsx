'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface SidebarMenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface DashboardSidebarProps {
  menuItems: SidebarMenuItem[];
  userName: string;
  onSignOut: () => void;
}

export function DashboardSidebar({
  menuItems,
  userName,
  onSignOut,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string): boolean {
    if (href === pathname) return true;
    if (href !== '/' && pathname.startsWith(href + '/')) return true;
    return false;
  }

  const sidebarContent = (
    <nav className="flex flex-col h-full" aria-label="사이드바 메뉴">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-border">
        <Link
          href="/"
          className="text-xl font-bold text-primary"
          aria-label="인플링 홈으로 이동"
        >
          인플링
        </Link>
      </div>

      {/* Menu items */}
      <ul className="flex-1 px-3 py-4 space-y-1" role="list">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
                  active
                    ? 'bg-white shadow-sm text-primary font-medium'
                    : 'text-text-secondary hover:bg-white/60 hover:text-text-primary'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={20} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className="border-t border-border px-3 py-4 space-y-2">
        <p className="px-3 text-xs text-text-muted truncate">{userName}</p>
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:bg-white/60 hover:text-danger transition-colors"
          aria-label="로그아웃"
        >
          <LogOut size={20} aria-hidden="true" />
          <span>로그아웃</span>
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-slate-50 border-r border-border z-30"
        aria-label="사이드바"
      >
        {sidebarContent}
      </aside>

      {/* Mobile hamburger button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-primary">
          인플링
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          aria-label="메뉴 열기"
          aria-expanded={mobileOpen}
        >
          <Menu size={24} />
        </Button>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-50 border-r border-border md:hidden"
              aria-label="모바일 사이드바"
            >
              <div className="absolute right-3 top-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                  aria-label="메뉴 닫기"
                >
                  <X size={20} />
                </Button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
