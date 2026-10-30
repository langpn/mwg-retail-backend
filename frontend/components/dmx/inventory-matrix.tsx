'use client'

import { useState } from 'react'
import { Activity, Minus, Plus, Send, Terminal } from 'lucide-react'
import {
  BRANCHES,
  CATEGORIES,
  formatTime,
  formatVND,
  getBranch,
  type BranchId,
  type Product,
} from '@/lib/dmx-data'
import { useStore } from './store-provider'
import { cn } from '@/lib/utils'

export function InventoryMatrix() {
  const { filteredProducts, branchId: headerBranch } = useStore()
  const [viewBranch, setViewBranch] = useState<BranchId>(headerBranch)
  const branch = getBranch(viewBranch)
  const other = BRANCHES.find((b) => b.id !== viewBranch)!
  const totalUnits = filteredProducts.reduce((s, p) => s + p.stock[viewBranch], 0)
  const outCount = filteredProducts.filter((p) => p.stock[viewBranch] === 0).length

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
      <section aria-labelledby="matrix-title" className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="matrix-title" className="text-base font-extrabold text-foreground">
              Live Multi-Branch Inventory Matrix
            </h2>
            <p className="text-xs text-muted-foreground">
              {branch.name} · <span className="tabular">{filteredProducts.length}</span> SKUs ·{' '}
              <span className="tabular">{totalUnits}</span> units on hand ·{' '}
              <span className="tabular text-danger-ink">{outCount}</span> out of stock
            </p>
          </div>
          <div role="radiogroup" aria-label="Chọn chi nhánh" className="inline-flex rounded-lg border border-border bg-secondary/60 p-1">
            {BRANCHES.map((b) => (
              <button
                key={b.id}
                type="button"
                role="radio"
                aria-checked={viewBranch === b.id}
                onClick={() => setViewBranch(b.id)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-bold transition-colors',
                  viewBranch === b.id ? 'bg-card text-primary shadow-sm' : 'text-body hover:text-foreground',
                )}
              >
                {b.district}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-secondary/60 whitespace-nowrap text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              <tr>
                <th scope="col" className="px-3 py-2.5">SKU</th>
                <th scope="col" className="px-3 py-2.5">Product Name</th>
                <th scope="col" className="px-3 py-2.5">Category</th>
                <th scope="col" className="px-3 py-2.5 text-right">Retail Price</th>
                <th scope="col" className="px-3 py-2.5 text-right">In Stock</th>
                <th scope="col" className="px-3 py-2.5 text-right">{other.district}</th>
                <th scope="col" className="px-3 py-2.5">Real-Time Status</th>
                <th scope="col" className="px-3 py-2.5">Quick Update · PUT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((p) => (
                <InventoryRow key={`${p.sku}-${viewBranch}`} product={p} branchId={viewBranch} otherId={other.id} />
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">No SKUs match the current filters.</p>
        )}
      </section>

      <ApiLogPanel />
    </div>
  )
}

function InventoryRow({ product, branchId, otherId }: { product: Product; branchId: BranchId; otherId: BranchId }) {
  const { updateStock } = useStore()
  const qty = product.stock[branchId]
  const [draft, setDraft] = useState(qty)
  const [flash, setFlash] = useState(false)
  const dirty = draft !== qty
  const category = CATEGORIES.find((c) => c.id === product.category)

  function submit() {
    updateStock(product.sku, branchId, draft)
    setFlash(true)
    setTimeout(() => setFlash(false), 900)
  }

  return (
    <tr className={cn('transition-colors hover:bg-secondary/40', flash && 'bg-success-soft')}>
      <td className="px-3 py-2.5 font-mono text-xs font-semibold whitespace-nowrap text-foreground">{product.sku}</td>
      <td className="max-w-[240px] px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <img src={product.image || '/placeholder.svg'} alt="" className="size-8 shrink-0 rounded bg-secondary object-contain" />
          <span className="truncate font-semibold text-body" title={product.name}>
            {product.name}
          </span>
        </div>
      </td>
      <td className="px-3 py-2.5 text-xs whitespace-nowrap text-muted-foreground">{category?.label}</td>
      <td className="tabular px-3 py-2.5 text-right font-bold whitespace-nowrap text-foreground">
        {formatVND(product.price)}
      </td>
      <td className="tabular px-3 py-2.5 text-right text-base font-extrabold text-foreground">{qty}</td>
      <td className="tabular px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground">
        {product.stock[otherId]}
      </td>
      <td className="px-3 py-2.5">
        {qty > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-bold whitespace-nowrap text-success-ink">
            <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
            Available ({qty})
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-soft px-2.5 py-1 text-[11px] font-bold whitespace-nowrap text-danger-ink">
            <span className="size-1.5 rounded-full bg-danger" aria-hidden="true" />
            Out of Stock (0)
          </span>
        )}
      </td>
      <td className="px-3 py-2.5">
        <form
          className="flex items-center gap-1.5"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <div className="flex h-8 items-center rounded-lg border border-border bg-card">
            <button
              type="button"
              onClick={() => setDraft((d) => Math.max(0, d - 1))}
              className="flex h-full w-7 items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label={`Giảm tồn kho ${product.sku}`}
            >
              <Minus className="size-3.5" aria-hidden="true" />
            </button>
            <label htmlFor={`qty-${product.sku}`} className="sr-only">
              Số lượng mới cho {product.sku}
            </label>
            <input
              id={`qty-${product.sku}`}
              type="number"
              inputMode="numeric"
              min={0}
              max={999}
              value={draft}
              onChange={(e) => setDraft(Math.max(0, Math.min(999, Number(e.target.value) || 0)))}
              className="tabular h-full w-10 border-x border-border bg-transparent text-center text-sm font-bold text-foreground [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={() => setDraft((d) => Math.min(999, d + 1))}
              className="flex h-full w-7 items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label={`Tăng tồn kho ${product.sku}`}
            >
              <Plus className="size-3.5" aria-hidden="true" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!dirty}
            className="flex h-8 items-center gap-1 rounded-lg bg-primary px-2.5 font-mono text-[11px] font-bold text-primary-foreground transition-colors hover:bg-primary-deep disabled:bg-secondary disabled:text-muted-foreground"
          >
            <Send className="size-3" aria-hidden="true" />
            PUT
          </button>
        </form>
      </td>
    </tr>
  )
}

const METHOD_STYLES = {
  GET: 'text-purple-300',
  PUT: 'text-sky-300',
  POST: 'text-emerald-300',
  PATCH: 'text-amber-300',
} as const

function ApiLogPanel() {
  const { apiLog } = useStore()
  return (
    <aside
      aria-labelledby="api-log-title"
      className="flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-200"
    >
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <h2 id="api-log-title" className="flex items-center gap-2 text-sm font-bold text-white">
          <Terminal className="size-4 text-sky-400" aria-hidden="true" />
          AI Agent Observability
        </h2>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
          <Activity className="size-3.5" aria-hidden="true" />
          Live
        </span>
      </div>
      <div className="px-4 py-2 font-mono text-[11px] text-slate-500">
        spring-boot-3 · inventory-service · mysql:8 (10 tables)
      </div>
      <ol aria-live="polite" className="flex flex-1 flex-col gap-2 px-4 pb-4 font-mono text-xs">
        {apiLog.length === 0 && (
          <li className="rounded-lg border border-dashed border-slate-800 px-3 py-6 text-center text-slate-500">
            Waiting for requests… adjust a quantity and press PUT.
          </li>
        )}
        {apiLog.map((log) => (
          <li key={log.id} className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate">
                <span className={cn('font-bold', METHOD_STYLES[log.method])}>{log.method}</span>{' '}
                <span className="text-slate-300">{log.path}</span>
              </span>
              <span className={cn(
                'shrink-0 rounded px-1.5 text-[10px] font-bold',
                log.status >= 200 && log.status < 300
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : 'bg-red-500/15 text-red-300',
              )}>
                {log.status}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-slate-500">
              <span className="truncate">{log.detail}</span>
              <span className="tabular shrink-0">{formatTime(log.at)}</span>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  )
}
