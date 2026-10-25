'use client'

import { ArrowRight, PackageSearch, Store } from 'lucide-react'
import { Card3DTilt } from './card-3d-tilt'
import { BRANCHES, formatVND, getBranch, getBrandOrigin, type BranchId, type Product } from '@/lib/dmx-data'
import { useStore } from './store-provider'
import { cn } from '@/lib/utils'

export function ProductGrid() {
  const { filteredProducts, resetFilters } = useStore()

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-20 text-center">
        <PackageSearch className="size-10 text-muted-foreground" aria-hidden="true" />
        <p className="text-base font-bold text-foreground">Không có sản phẩm phù hợp</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Try a different category, brand, or budget range to see more products.
        </p>
        <button
          type="button"
          onClick={resetFilters}
          className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary-deep"
        >
          Reset filters
        </button>
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredProducts.map((p) => (
        <li key={p.sku}>
          <Card3DTilt>
            <ProductCard product={p} />
          </Card3DTilt>
        </li>
      ))}
    </ul>
  )
}

function ProductCard({ product }: { product: Product }) {
  const { branchId, startOrder } = useStore()
  const branch = getBranch(branchId)
  const qty = product.stock[branchId]
  const otherBranch = BRANCHES.find((b) => b.id !== branchId) as (typeof BRANCHES)[number]
  const otherQty = product.stock[otherBranch.id as BranchId]
  const discountPct = Math.round((1 - product.price / product.listPrice) * 100)
  const soldOutEverywhere = qty === 0 && otherQty === 0

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <div className="relative aspect-[4/3] bg-gradient-to-b from-secondary/70 to-card">
        <img
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          className="absolute inset-0 size-full object-contain p-6 mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          <span className="rounded-md bg-foreground px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-white">
            {product.sku}
          </span>
          {discountPct > 0 && (
            <span className="tabular rounded-md bg-price px-1.5 py-0.5 text-[11px] font-extrabold text-white">
              -{discountPct}%
            </span>
          )}
        </div>
        <span className="absolute top-3 right-3 rounded-full border border-border bg-card/90 px-2 py-0.5 text-[11px] font-semibold text-body backdrop-blur">
          {product.brand} · {getBrandOrigin(product.brand)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 min-h-[2.75rem] text-[15px] leading-snug font-bold text-foreground text-pretty">
          {product.name}
        </h3>

        <ul className="flex flex-wrap gap-1.5" aria-label="Thông số nổi bật">
          {product.specs.map((s) => (
            <li
              key={s}
              className="rounded-md border border-primary/15 bg-primary/5 px-2 py-0.5 text-[11px] font-semibold text-primary-deep"
            >
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="tabular text-xl font-extrabold tracking-tight text-price">{formatVND(product.price)}</span>
            <span className="tabular text-xs font-medium text-muted-foreground line-through">
              {formatVND(product.listPrice)}
            </span>
          </div>
          <span className="w-fit rounded-md bg-accent/15 px-2 py-0.5 text-[11px] font-bold text-amber-800">
            Trả góp 0%
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-lg bg-secondary/60 px-3 py-2">
          <p className="flex items-center gap-2 text-xs font-semibold">
            <span
              className={cn('size-2 shrink-0 rounded-full', qty > 0 ? 'bg-success' : 'bg-danger')}
              aria-hidden="true"
            />
            {qty > 0 ? (
              <span className="text-success-ink">
                In Stock at {branch.district} <span className="tabular">({qty} units)</span>
              </span>
            ) : (
              <span className="text-danger-ink">Out of stock at {branch.district}</span>
            )}
          </p>
          <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Store className="size-3" aria-hidden="true" />
            {otherBranch.district}: <span className="tabular font-semibold text-body">{otherQty} units</span>
          </p>
        </div>

        <button
          type="button"
          disabled={soldOutEverywhere}
          onClick={() => startOrder(product.sku)}
          className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-deep focus-visible:ring-4 focus-visible:ring-primary/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-secondary disabled:text-muted-foreground"
        >
          {soldOutEverywhere ? 'Sold out · All branches' : qty > 0 ? 'Buy Now / Reserve at Store' : `Reserve from ${otherBranch.district}`}
          {!soldOutEverywhere && <ArrowRight className="size-4" aria-hidden="true" />}
        </button>
      </div>
    </article>
  )
}
