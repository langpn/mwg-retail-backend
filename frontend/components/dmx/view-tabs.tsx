'use client'

import { Boxes, ClipboardList, LayoutGrid } from 'lucide-react'
import { motion } from 'motion/react'
import { getBranch } from '@/lib/dmx-data'
import { useStore, type ViewTab } from './store-provider'
import { cn } from '@/lib/utils'

const TABS: { id: ViewTab; label: string; icon: typeof Boxes }[] = [
  { id: 'catalog', label: 'Product Showcase', icon: LayoutGrid },
  { id: 'inventory', label: 'Multi-Branch Inventory', icon: Boxes },
  { id: 'orders', label: 'Fast Order & Queue', icon: ClipboardList },
]

export function ViewTabs() {
  const { tab, setTab, filteredProducts, products, orders, branchId } = useStore()
  const branch = getBranch(branchId)
  const units = products.reduce((sum, p) => sum + p.stock[branchId], 0)
  const outOfStock = products.filter((p) => p.stock[branchId] === 0).length
  const pending = orders.filter((o) => o.status === 'PENDING').length

  const stats = [
    { label: 'SKUs in view', value: filteredProducts.length },
    { label: `Units · ${branch.district}`, value: units },
    { label: 'Out of stock', value: outOfStock, tone: 'danger' as const },
    { label: 'Pending orders', value: pending, tone: 'accent' as const },
  ]

  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div
        role="tablist"
        aria-label="Chế độ xem"
        className="no-scrollbar inline-flex w-full overflow-x-auto rounded-lg border border-border bg-card p-1 xl:w-auto"
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
                'relative flex flex-1 shrink-0 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-bold whitespace-nowrap transition-colors xl:flex-none',
                active ? 'text-primary-foreground' : 'text-body hover:bg-secondary',
              )}
            >
              {active && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 rounded-md bg-primary shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={cn(
                  'relative z-10 tabular flex size-5 items-center justify-center rounded text-[11px]',
                  active ? 'bg-white/20' : 'bg-secondary text-muted-foreground',
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

      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:flex xl:gap-0 xl:divide-x xl:divide-border xl:rounded-lg xl:border xl:border-border xl:bg-card">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col rounded-lg border border-border bg-card px-4 py-2 xl:rounded-none xl:border-0 xl:bg-transparent"
          >
            <dt className="text-[11px] font-medium whitespace-nowrap text-muted-foreground">{s.label}</dt>
            <dd
              className={cn(
                'tabular text-lg leading-tight font-extrabold',
                s.tone === 'danger' ? 'text-danger' : s.tone === 'accent' ? 'text-amber-600' : 'text-foreground',
              )}
            >
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
