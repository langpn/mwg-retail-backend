'use client'

import { ArrowUpDown, Boxes, LayoutGrid, Store } from 'lucide-react'
import { motion } from 'motion/react'
import { getBranch } from '@/lib/dmx-data'
import { useStore, type SortOption, type ViewTab } from './store-provider'
import { cn } from '@/lib/utils'

const TABS: { id: ViewTab; label: string; icon: typeof Boxes }[] = [
  { id: 'catalog', label: '1. Danh mục Sản phẩm', icon: LayoutGrid },
  { id: 'inventory', label: '2. Tra cứu Tồn kho Siêu thị', icon: Boxes },
]

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'default', label: 'Nổi bật nhất' },
  { id: 'price-asc', label: 'Giá thấp → cao' },
  { id: 'price-desc', label: 'Giá cao → thấp' },
  { id: 'discount', label: 'Giảm nhiều nhất' },
]

export function ViewTabs() {
  const { tab, setTab, filteredProducts, products, branchId, sort, setSort } = useStore()
  const branch = getBranch(branchId)
  const units = products.reduce((sum, p) => sum + p.stock[branchId], 0)
  const outOfStock = products.filter((p) => p.stock[branchId] === 0).length

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* 2 Tab chính */}
      <div
        role="tablist"
        aria-label="Chế độ xem"
        className="no-scrollbar inline-flex w-full overflow-x-auto rounded-xl border border-border bg-card p-1 sm:w-auto"
      >
        {TABS.map((t, i) => {
          const active = tab === t.id
          const Icon = t.icon
          return (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              role="tab"
              type="button"
              aria-selected={active}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={cn(
                'relative flex flex-1 shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold whitespace-nowrap transition-colors sm:flex-none',
                active ? 'text-primary-foreground' : 'text-body hover:bg-secondary',
              )}
            >
              {active && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 rounded-lg bg-primary shadow-xs"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={cn(
                  'relative z-10 tabular flex size-5 items-center justify-center rounded text-[11px] font-extrabold',
                  active ? 'bg-white/20 text-white' : 'bg-secondary text-muted-foreground',
                )}
              >
                {i + 1}
              </span>
              <Icon className="relative z-10 size-4" aria-hidden="true" />
              <span className="relative z-10">{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* Khu vực bên phải: Bộ Sắp Xếp khi xem Sản phẩm / Tóm tắt khi xem Tồn kho */}
      {tab === 'catalog' ? (
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto rounded-xl border border-border bg-card p-1 shadow-2xs">
          <span className="flex items-center gap-1 pl-2.5 pr-1 text-xs font-bold text-muted-foreground whitespace-nowrap">
            <ArrowUpDown className="size-3.5 text-primary" />
            <span>Sắp xếp:</span>
          </span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSort(opt.id)}
              className={cn(
                'rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors',
                sort === opt.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-body hover:bg-secondary hover:text-foreground',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground shadow-2xs">
          <Store className="size-4 text-primary" />
          <span>
            {branch.name}: <strong className="text-foreground">{units} máy sẵn có</strong>
          </span>
          <span className="h-3.5 w-px bg-border" />
          <span>
            Tạm hết: <strong className="text-danger">{outOfStock} mã</strong>
          </span>
        </div>
      )}
    </div>
  )
}
