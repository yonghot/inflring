'use client';

import { cn } from '@/lib/utils';

interface CategoryCheckboxGridProps {
  categories: readonly string[];
  selected: string[];
  onToggle: (category: string) => void;
  variant?: 'primary' | 'danger';
}

export function CategoryCheckboxGrid({
  categories,
  selected,
  onToggle,
  variant = 'primary',
}: CategoryCheckboxGridProps) {
  const activeClasses =
    variant === 'danger'
      ? 'border-danger bg-danger/5 text-danger'
      : 'border-primary bg-primary/5 text-primary';

  const checkboxClasses =
    variant === 'danger'
      ? 'border-danger bg-danger text-white'
      : 'border-primary bg-primary text-white';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {categories.map((cat) => {
        const isSelected = selected.includes(cat);
        return (
          <label
            key={cat}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors',
              isSelected ? activeClasses : 'border-border hover:bg-slate-50'
            )}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(cat)}
              className="sr-only"
            />
            <span
              className={cn(
                'flex h-4 w-4 items-center justify-center rounded border',
                isSelected ? checkboxClasses : 'border-border'
              )}
              aria-hidden="true"
            >
              {isSelected && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            {cat}
          </label>
        );
      })}
    </div>
  );
}
