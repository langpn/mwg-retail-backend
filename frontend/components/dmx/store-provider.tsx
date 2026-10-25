'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  PROMO_CODES,
  matchesBudget,
  type BranchId,
  type BrandId,
  type BudgetId,
  type CategoryId,
  type Order,
  type Product,
} from '@/lib/dmx-data'

export type ViewTab = 'catalog' | 'inventory' | 'orders'

export interface ApiLogEntry {
  id: number
  method: 'PUT' | 'POST' | 'PATCH'
  path: string
  status: number
  detail: string
  at: string
}

interface NewOrderInput {
  sku: string
  quantity: number
  customerName: string
  phone: string
  address: string
  branchId: BranchId
  promoCode: string
}

interface StoreValue {
  products: Product[]
  filteredProducts: Product[]
  orders: Order[]
  apiLog: ApiLogEntry[]
  branchId: BranchId
  setBranchId: (id: BranchId) => void
  category: CategoryId
  setCategory: (id: CategoryId) => void
  brands: BrandId[]
  toggleBrand: (id: BrandId) => void
  budget: BudgetId
  setBudget: (id: BudgetId) => void
  query: string
  setQuery: (q: string) => void
  resetFilters: () => void
  tab: ViewTab
  setTab: (tab: ViewTab) => void
  orderSku: string
  startOrder: (sku: string) => void
  setOrderSku: (sku: string) => void
  updateStock: (sku: string, branchId: BranchId, quantity: number) => void
  placeOrder: (input: NewOrderInput) => Order | { error: string }
  confirmOrder: (id: number) => void
}

const StoreContext = createContext<StoreValue | null>(null)

let logCounter = 1

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS)
  const [apiLog, setApiLog] = useState<ApiLogEntry[]>([])
  const [branchId, setBranchId] = useState<BranchId>('q9')
  const [category, setCategory] = useState<CategoryId>('all')
  const [brands, setBrands] = useState<BrandId[]>([])
  const [budget, setBudget] = useState<BudgetId>('any')
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<ViewTab>('catalog')
  const [orderSku, setOrderSku] = useState(INITIAL_PRODUCTS[0].sku)

  const toggleBrand = useCallback((id: BrandId) => {
    setBrands((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]))
  }, [])

  const resetFilters = useCallback(() => {
    setCategory('all')
    setBrands([])
    setBudget('any')
    setQuery('')
  }, [])

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false
      if (brands.length > 0 && !brands.includes(p.brand)) return false
      if (!matchesBudget(p.price, budget)) return false
      if (q && !`${p.name} ${p.sku} ${p.brand} ${p.specs.join(' ')}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [products, category, brands, budget, query])

  const pushLog = useCallback((entry: Omit<ApiLogEntry, 'id' | 'at'>) => {
    setApiLog((prev) => [{ ...entry, id: logCounter++, at: new Date().toISOString() }, ...prev].slice(0, 6))
  }, [])

  const updateStock = useCallback(
    (sku: string, target: BranchId, quantity: number) => {
      const safe = Math.max(0, Math.min(999, Math.floor(quantity)))
      setProducts((prev) =>
        prev.map((p) => (p.sku === sku ? { ...p, stock: { ...p.stock, [target]: safe } } : p)),
      )
      pushLog({
        method: 'PUT',
        path: `/api/v1/inventory/${sku}?branch=${target.toUpperCase()}`,
        status: 200,
        detail: `{ "quantity": ${safe} }`,
      })
    },
    [pushLog],
  )

  const startOrder = useCallback((sku: string) => {
    setOrderSku(sku)
    setTab('orders')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const placeOrder = useCallback(
    (input: NewOrderInput): Order | { error: string } => {
      const product = products.find((p) => p.sku === input.sku)
      if (!product) return { error: 'Sản phẩm không tồn tại.' }
      const qty = Math.floor(input.quantity)
      if (!Number.isFinite(qty) || qty < 1 || qty > 5) return { error: 'Số lượng phải từ 1 đến 5.' }
      if (product.stock[input.branchId] < qty)
        return { error: `Chi nhánh chỉ còn ${product.stock[input.branchId]} sản phẩm.` }

      const subtotal = product.price * qty
      const code = input.promoCode.trim().toUpperCase()
      const promo = PROMO_CODES[code]
      const discount = promo ? promo.compute(subtotal) : 0
      const order: Order = {
        id: Math.max(...orders.map((o) => o.id), 10247) + 1,
        sku: product.sku,
        productName: product.name,
        quantity: qty,
        customerName: input.customerName.trim(),
        phone: input.phone.trim(),
        address: input.address.trim() || 'Nhận tại cửa hàng',
        branchId: input.branchId,
        promoCode: promo ? code : null,
        subtotal,
        discount,
        total: subtotal - discount,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      }
      setOrders((prev) => [...prev, order])
      setProducts((prev) =>
        prev.map((p) =>
          p.sku === product.sku
            ? { ...p, stock: { ...p.stock, [input.branchId]: p.stock[input.branchId] - qty } }
            : p,
        ),
      )
      pushLog({
        method: 'POST',
        path: '/api/v1/orders',
        status: 201,
        detail: `{ "id": ${order.id}, "sku": "${order.sku}", "qty": ${qty} }`,
      })
      return order
    },
    [products, orders, pushLog],
  )

  const confirmOrder = useCallback(
    (id: number) => {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'CONFIRMED' } : o)))
      pushLog({
        method: 'PATCH',
        path: `/api/v1/orders/${id}/status`,
        status: 200,
        detail: '{ "status": "CONFIRMED" }',
      })
    },
    [pushLog],
  )

  const value: StoreValue = {
    products,
    filteredProducts,
    orders,
    apiLog,
    branchId,
    setBranchId,
    category,
    setCategory,
    brands,
    toggleBrand,
    budget,
    setBudget,
    query,
    setQuery,
    resetFilters,
    tab,
    setTab,
    orderSku,
    startOrder,
    setOrderSku,
    updateStock,
    placeOrder,
    confirmOrder,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
