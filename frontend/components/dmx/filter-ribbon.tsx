'use client'

import { Refrigerator, RotateCcw, Sparkles, Tv, WashingMachine, LayoutGrid, CookingPot } from 'lucide-react'
import { BRANDS, BUDGETS, CATEGORIES, type CategoryId } from '@/lib/dmx-data'
import { useStore } from './store-provider'
import { cn } from '@/lib/utils'

const CATEGORY_ICONS: Record<CategoryId, typeof Tv> = {
  all: LayoutGrid,
  washer: WashingMachine,
  fridge: Refrigerator,
  tv: Tv,
  small: CookingPot,
}

export function FilterRibbon() {
  const { products, category, setCategory, brands, toggleBrand, budget, setBudget, resetFilters, query } =
    useStore()
  const hasFilters = category !== 'all' || brands.length > 0 || budget !== 'any' || query !== ''

  return (
    <section aria-label="Bộ lọc nhanh" className="rounded-xl border border-border bg-card">
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto border-b border-border px-4 py-3">
        {CATEGORIES.map((c) => {
          const Icon = CATEGORY_ICONS[c.id]
          const count = c.id === 'all' ? products.length : products.filter((p) => p.category === c.id).length
          const active = category === c.id
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(c.id)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                active
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'border-border bg-card text-body hover:border-primary/50 hover:text-primary',
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {c.label}
              <span
                className={cn(
                  'tabular rounded-full px-1.5 text-[11px] font-bold',
                  active ? 'bg-white/20 text-white' : 'bg-secondary text-muted-foreground',
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:gap-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Brand</span>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {BRANDS.map((b) => {
              const active = brands.includes(b.id)
              return (
                <button
                  key={b.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleBrand(b.id)}
                  className={cn(
                    'flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 transition-colors',
                    active
                      ? 'border-foreground bg-foreground text-white'
                      : 'border-border bg-card text-foreground hover:border-foreground/40',
                  )}
                >
                  <span className="text-sm font-extrabold tracking-tight">{b.id}</span>
                  <span className={cn('text-[11px] font-medium', active ? 'text-white/70' : 'text-muted-foreground')}>
                    ({b.origin})
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="hidden h-6 w-px bg-border lg:block" aria-hidden="true" />

        <div className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Budget</span>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {BUDGETS.filter((b) => b.id !== 'any').map((b) => {
              const active = budget === b.id
              return (
                <button
                  key={b.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setBudget(active ? 'any' : b.id)}
                  className={cn(
                    'flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors',
                    active
                      ? 'border-accent bg-accent text-foreground'
                      : 'border-border bg-card text-body hover:border-accent hover:bg-accent/10',
                  )}
                >
                  {b.id === 'premium' && <Sparkles className="size-3.5" aria-hidden="true" />}
                  {b.label}
                </button>
              )
            })}
          </div>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex shrink-0 items-center gap-1.5 self-start text-xs font-semibold text-muted-foreground hover:text-primary lg:ml-auto lg:self-auto"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Reset filters
          </button>
        )}
      </div>
    </section>
  )
}
