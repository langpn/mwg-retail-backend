'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
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
import { api } from '@/lib/api'

export type ViewTab = 'catalog' | 'inventory' | 'orders'

export interface ApiLogEntry {
  id: number
  method: 'GET' | 'PUT' | 'POST' | 'PATCH'
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
  placeOrder: (input: NewOrderInput) => Promise<Order | { error: string }>
  confirmOrder: (id: number) => void
  backendConnected: boolean | null
  reloadFromBackend: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

let logCounter = 1

/* ── Mapping helpers ── */
const BRANCH_ID_MAP: Record<BranchId, number> = { q9: 1, td: 2 }
const BRANCH_KEY_MAP: Record<number, BranchId> = { 1: 'q9', 2: 'td' }

const CATEGORY_CODE_MAP: Record<string, Exclude<CategoryId, 'all'>> = {
  MAYGIAT: 'washer',
  TULANH: 'fridge',
  TIVI: 'tv',
}

function mapBackendProduct(bp: any, inventories: any[]): Product {
  const categoryCode = bp.category?.code ?? ''
  const brandName = bp.brand?.name ?? 'Toshiba'

  const stock: Record<BranchId, number> = { q9: 0, td: 0 }
  for (const inv of inventories) {
    if (inv.product?.id === bp.id) {
      const key = BRANCH_KEY_MAP[inv.storeBranch?.id]
      if (key) stock[key] = inv.quantity ?? 0
    }
  }

  // Try to find matching hardcoded product for listPrice, specs, image
  const hardcoded = INITIAL_PRODUCTS.find((p) => p.sku === bp.sku)

  return {
    id: bp.id,
    sku: bp.sku,
    name: bp.name,
    category: CATEGORY_CODE_MAP[categoryCode] ?? 'small',
    brand: brandName as BrandId,
    price: bp.price,
    listPrice: hardcoded?.listPrice ?? Math.round(bp.price * 1.25),
    specs: hardcoded?.specs ?? [bp.description ?? ''],
    image: hardcoded?.image ?? '/products/washer-front.png',
    stock,
  }
}

function mapBackendOrder(bo: any): Order {
  const item = bo.orderItems?.[0]
  return {
    id: bo.id,
    sku: item?.product?.sku ?? '',
    productName: item?.product?.name ?? '',
    quantity: item?.quantity ?? 1,
    customerName: bo.customerName,
    phone: bo.phone,
    address: bo.shippingAddress,
    branchId: 'q9', // backend doesn't store branchId on order directly
    promoCode: bo.promotion?.promoCode ?? null,
    subtotal: item ? item.unitPrice * item.quantity : bo.totalAmount,
    discount: 0,
    total: bo.totalAmount,
    status: bo.status as Order['status'],
    createdAt: bo.orderDate,
  }
}

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
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null)

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

  /* ── Load data from backend ── */
  const reloadFromBackend = useCallback(async () => {
    try {
      // Fetch products + inventories for both branches
      const [backendProducts, inv1, inv2, backendOrders] = await Promise.all([
        api.getProducts(),
        api.getBranchInventory(1),
        api.getBranchInventory(2),
        api.getOrders(),
      ])

      const allInventories = [...inv1, ...inv2]
      const mapped = (backendProducts as any[]).map((bp) => mapBackendProduct(bp, allInventories))

      pushLog({
        method: 'GET',
        path: '/api/v1/products',
        status: 200,
        detail: `Loaded ${mapped.length} products from backend`,
      })

      pushLog({
        method: 'GET',
        path: '/api/v1/inventory/branch/*',
        status: 200,
        detail: `Loaded ${allInventories.length} inventory records`,
      })

      if (mapped.length > 0) setProducts(mapped)

      const mappedOrders = (backendOrders as any[]).map(mapBackendOrder)
      pushLog({
        method: 'GET',
        path: '/api/v1/orders',
        status: 200,
        detail: `Loaded ${mappedOrders.length} orders from backend`,
      })
      if (mappedOrders.length > 0) setOrders(mappedOrders)

      setBackendConnected(true)
    } catch {
      setBackendConnected(false)
    }
  }, [pushLog])

  // Auto-load on mount (guard against React Strict Mode double-fire)
  const didLoad = useRef(false)
  useEffect(() => {
    if (didLoad.current) return
    didLoad.current = true
    reloadFromBackend()
  }, [reloadFromBackend])

  /* ── Update stock (real API) ── */
  const updateStock = useCallback(
    async (sku: string, target: BranchId, quantity: number) => {
      const safe = Math.max(0, Math.min(999, Math.floor(quantity)))
      const product = products.find((p) => p.sku === sku)

      // Optimistic update
      setProducts((prev) =>
        prev.map((p) => (p.sku === sku ? { ...p, stock: { ...p.stock, [target]: safe } } : p)),
      )

      if (backendConnected && product?.id) {
        try {
          await api.updateStock(product.id, BRANCH_ID_MAP[target], safe)
          pushLog({
            method: 'PUT',
            path: `/api/v1/inventory/update`,
            status: 200,
            detail: `{ "productId": ${product.id}, "branchId": ${BRANCH_ID_MAP[target]}, "quantity": ${safe} }`,
          })
        } catch {
          pushLog({
            method: 'PUT',
            path: `/api/v1/inventory/update`,
            status: 500,
            detail: 'Backend error — updated locally only',
          })
        }
      } else {
        pushLog({
          method: 'PUT',
          path: `/api/v1/inventory/${sku}?branch=${target.toUpperCase()}`,
          status: 200,
          detail: `{ "quantity": ${safe} } (local)`,
        })
      }
    },
    [products, backendConnected, pushLog],
  )

  const startOrder = useCallback((sku: string) => {
    setOrderSku(sku)
    setTab('orders')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  /* ── Place order (real API) ── */
  const placeOrder = useCallback(
    async (input: NewOrderInput): Promise<Order | { error: string }> => {
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

      if (backendConnected && product.id) {
        try {
          const res = await api.createOrder({
            customerName: input.customerName.trim(),
            phone: input.phone.trim(),
            shippingAddress: input.address.trim() || 'Nhận tại cửa hàng',
            promoCode: promo ? code : '',
            branchId: BRANCH_ID_MAP[input.branchId],
            items: [{ productId: product.id, quantity: qty }],
          })

          if (!res.ok) {
            const text = await res.text()
            pushLog({
              method: 'POST',
              path: '/api/v1/orders',
              status: res.status,
              detail: text || 'Bad Request',
            })
            return { error: 'Backend từ chối đơn hàng.' }
          }

          const created = await res.json()
          const order: Order = {
            id: created.id,
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
            total: created.totalAmount ?? subtotal - discount,
            status: created.status ?? 'PENDING',
            createdAt: created.orderDate ?? new Date().toISOString(),
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
        } catch {
          pushLog({
            method: 'POST',
            path: '/api/v1/orders',
            status: 500,
            detail: 'Network error — falling back to local',
          })
        }
      }

      // Fallback: local order
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
        detail: `{ "id": ${order.id}, "sku": "${order.sku}", "qty": ${qty} } (local)`,
      })
      return order
    },
    [products, orders, backendConnected, pushLog],
  )

  /* ── Confirm order (real API) ── */
  const confirmOrder = useCallback(
    async (id: number) => {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'CONFIRMED' } : o)))

      if (backendConnected) {
        try {
          await api.updateOrderStatus(id, 'CONFIRMED')
          pushLog({
            method: 'PUT' as any,
            path: `/api/v1/orders/${id}/status?status=CONFIRMED`,
            status: 200,
            detail: '{ "status": "CONFIRMED" }',
          })
        } catch {
          pushLog({
            method: 'PUT' as any,
            path: `/api/v1/orders/${id}/status`,
            status: 500,
            detail: 'Backend error — updated locally only',
          })
        }
      } else {
        pushLog({
          method: 'PATCH',
          path: `/api/v1/orders/${id}/status`,
          status: 200,
          detail: '{ "status": "CONFIRMED" } (local)',
        })
      }
    },
    [backendConnected, pushLog],
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
    backendConnected,
    reloadFromBackend,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
