'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, GraduationCap, MapPin, Search, ShoppingBag, X } from 'lucide-react'
import { BRANCHES, CATEGORIES, formatVND, getBranch, type CategoryId } from '@/lib/dmx-data'
import { useStore } from './store-provider'
import { cn } from '@/lib/utils'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 md:px-8 lg:flex-nowrap">
        <Logo />
        <div className="order-3 w-full lg:order-none lg:flex-1">
          <GlobalSearch />
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <BranchSelector />
          <OrderCounter />
          <AcademicBadge />
        </div>
      </div>
    </header>
  )
}

function Logo() {
  return (
    <a href="#" className="flex shrink-0 items-center gap-3" aria-label="Điện Máy Xanh — trang chủ">
      <span className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-deep shadow-sm ring-1 ring-primary-deep/20">
        <ShoppingBag className="size-5 text-white" strokeWidth={2.25} aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[17px] font-extrabold tracking-tight text-foreground">
          Điện Máy <span className="text-primary">Xanh</span>
        </span>
        <span className="text-[11px] font-medium text-muted-foreground">Multi-Branch Retail System</span>
      </span>
    </a>
  )
}

function GlobalSearch() {
  const { products, query, setQuery, setCategory, setTab } = useStore()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(query)
  const wrapRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => setDraft(query), [query])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const suggestions = useMemo(() => {
    const q = draft.trim().toLowerCase()
    if (!q) return products.slice(0, 4)
    return products
      .filter((p) => `${p.name} ${p.sku} ${p.brand}`.toLowerCase().includes(q))
      .slice(0, 6)
  }, [draft, products])

  function commit(value: string) {
    setQuery(value)
    setTab('catalog')
    setOpen(false)
  }

  function pickCategory(id: CategoryId) {
    setCategory(id)
    setQuery('')
    setDraft('')
    setTab('catalog')
    setOpen(false)
  }

  return (
    <div ref={wrapRef} className="relative mx-auto w-full max-w-2xl">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          commit(draft)
        }}
      >
        <label htmlFor="global-search" className="sr-only">
          Tìm kiếm sản phẩm
        </label>
        <Search
          className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id="global-search"
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false)
          }}
          placeholder="Search washers, fridges, smart TVs, SKUs..."
          className="h-11 w-full rounded-lg border border-border bg-muted/60 pr-24 pl-10 text-sm font-medium text-body placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/15 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        <div className="absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center gap-1">
          {draft && (
            <button
              type="button"
              onClick={() => {
                setDraft('')
                commit('')
              }}
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Xoá tìm kiếm"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
          <button
            type="submit"
            className="h-8 rounded-md bg-primary px-3 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary-deep"
          >
            Search
          </button>
        </div>
      </form>

      {open && (
        <div
          id={listId}
          className="absolute inset-x-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
        >
          <div className="flex flex-wrap items-center gap-1.5 border-b border-border px-3 py-2.5">
            <span className="mr-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Danh mục
            </span>
            {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => pickCategory(c.id)}
                className="rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-body transition-colors hover:border-primary hover:text-primary"
              >
                {c.vi}
              </button>
            ))}
          </div>
          <ul role="listbox" aria-label="Gợi ý sản phẩm" className="max-h-80 overflow-y-auto py-1">
            {suggestions.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                Không tìm thấy sản phẩm cho “{draft}”
              </li>
            )}
            {suggestions.map((p) => (
              <li key={p.sku} role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(p.sku)
                    commit(p.sku)
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-secondary"
                >
                  <img src={p.image || '/placeholder.svg'} alt="" className="size-10 rounded-md bg-muted object-contain" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-foreground">{p.name}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">{p.sku}</span>
                  </span>
                  <span className="tabular shrink-0 text-sm font-extrabold text-price">{formatVND(p.price)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function BranchSelector() {
  const { branchId, setBranchId } = useStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const branch = getBranch(branchId)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        className="flex h-10 items-center gap-2 rounded-full border border-primary/25 bg-primary/5 pr-3 pl-2 text-left transition-colors hover:border-primary/50 hover:bg-primary/10"
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-white">
          <MapPin className="size-3.5" aria-hidden="true" />
        </span>
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">Supermarket</span>
          <span className="text-xs font-bold whitespace-nowrap text-foreground">
            {branch.name} <span className="font-medium text-muted-foreground">({branch.district})</span>
          </span>
        </span>
        <ChevronDown
          className={cn('size-4 text-muted-foreground transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Chọn chi nhánh"
          className="absolute right-0 top-[calc(100%+6px)] z-50 w-80 overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-lg"
        >
          {BRANCHES.map((b) => {
            const active = b.id === branchId
            return (
              <li key={b.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    setBranchId(b.id)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                    active ? 'bg-primary/8' : 'hover:bg-secondary',
                  )}
                >
                  <MapPin
                    className={cn('mt-0.5 size-4 shrink-0', active ? 'text-primary' : 'text-muted-foreground')}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-foreground">
                      {b.name} · {b.district}
                    </span>
                    <span className="block text-xs text-muted-foreground">{b.address}</span>
                  </span>
                  {active && <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function OrderCounter() {
  const { orders, setTab } = useStore()
  const pending = orders.filter((o) => o.status === 'PENDING').length
  return (
    <button
      type="button"
      onClick={() => setTab('orders')}
      className="relative flex size-10 items-center justify-center rounded-lg border border-border bg-card text-body transition-colors hover:border-primary hover:text-primary"
      aria-label={`Hàng đợi đơn hàng: ${orders.length} đơn, ${pending} đang chờ`}
    >
      <ShoppingBag className="size-[18px]" aria-hidden="true" />
      <span className="tabular absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-extrabold text-foreground ring-2 ring-card">
        {orders.length}
      </span>
    </button>
  )
}

function AcademicBadge() {
  return (
    <div className="hidden items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-2.5 py-1.5 xl:flex">
      <GraduationCap className="size-4 text-amber-700" aria-hidden="true" />
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] font-bold tracking-wide text-amber-800 uppercase">IUH Software Engineering</span>
        <span className="text-[11px] font-semibold text-body">Project · Class 21BVL</span>
      </span>
    </div>
  )
}
