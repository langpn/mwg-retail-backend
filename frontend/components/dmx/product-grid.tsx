'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, PackageSearch, Store } from 'lucide-react'
import { BRANCHES, formatVND, getBranch, type BranchId, type Product } from '@/lib/dmx-data'
import { useStore } from './store-provider'
import { cn } from '@/lib/utils'

export function ProductGrid() {
  const { filteredProducts, resetFilters } = useStore()

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-20 text-center">
        <PackageSearch className="size-10 text-muted-foreground" aria-hidden="true" />
        <p className="text-base font-bold text-foreground">Không tìm thấy sản phẩm phù hợp</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Vui lòng thử chọn danh mục, thương hiệu khác hoặc mức giá phù hợp hơn.
        </p>
        <button
          type="button"
          onClick={resetFilters}
          className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary-deep"
        >
          Đặt lại bộ lọc
        </button>
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredProducts.map((p) => (
        <li key={p.sku} className="h-full">
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  )
}

function ProductCard({ product }: { product: Product }) {
  const router = useRouter()
  const { branchId, addToCart } = useStore()
  const branch = getBranch(branchId)
  const qty = product.stock[branchId]
  const otherBranch = BRANCHES.find((b) => b.id !== branchId) as (typeof BRANCHES)[number]
  const otherQty = product.stock[otherBranch.id as BranchId]
  const discountPct = Math.round((1 - product.price / product.listPrice) * 100)
  const soldOutEverywhere = qty === 0 && otherQty === 0

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
      <Link href={`/product/${product.sku}`} className="relative aspect-[4/3] bg-gradient-to-b from-secondary/70 to-card block overflow-hidden">
        <img
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          className="absolute inset-0 size-full object-contain p-6 mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.05]"
        />
        {discountPct > 0 && (
          <div className="absolute top-3 left-3 flex flex-col items-start">
            <span className="tabular rounded-md bg-price px-2 py-0.5 text-xs font-extrabold text-white shadow-sm">
              -{discountPct}%
            </span>
          </div>
        )}
        <span className="absolute top-3 right-3 rounded-full border border-border bg-card/90 px-2.5 py-0.5 text-[11px] font-bold text-foreground shadow-xs backdrop-blur">
          {product.brand}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <span className="font-mono text-[11px] font-semibold text-muted-foreground">{product.sku}</span>
          <Link href={`/product/${product.sku}`}>
            <h3 className="line-clamp-2 min-h-[2.75rem] text-[15px] leading-snug font-bold text-foreground text-pretty hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

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

        <div className="flex flex-col gap-1.5 rounded-lg bg-secondary/60 px-3 py-2.5">
          <p className="flex items-center gap-2 text-xs font-semibold">
            <span
              className={cn('size-2 shrink-0 rounded-full', qty > 0 ? 'bg-success' : 'bg-danger')}
              aria-hidden="true"
            />
            {qty > 0 ? (
              <span className="text-success-ink">
                Sẵn hàng tại {branch.district} <span className="tabular font-bold">({qty} máy)</span>
              </span>
            ) : (
              <span className="text-danger-ink">Tạm hết hàng tại {branch.district}</span>
            )}
          </p>
          <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Store className="size-3" aria-hidden="true" />
            ĐMX {otherBranch.district}:{' '}
            <span className="tabular font-semibold text-body">
              {otherQty > 0 ? `Còn ${otherQty} máy` : 'Tạm hết hàng'}
            </span>
          </p>
        </div>

        <button
          type="button"
          disabled={soldOutEverywhere}
          onClick={() => {
            addToCart(product, 1)
            router.push('/cart')
          }}
          className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-deep focus-visible:ring-4 focus-visible:ring-primary/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-secondary disabled:text-muted-foreground"
        >
          {soldOutEverywhere
            ? 'Tạm hết hàng toàn hệ thống'
            : qty > 0
              ? 'Mua ngay / Giữ hàng tại siêu thị'
              : `Đặt chuyển từ ĐMX ${otherBranch.district}`}
          {!soldOutEverywhere && <ArrowRight className="size-4" aria-hidden="true" />}
        </button>
      </div>
    </article>
  )
}
