export type CategoryId = 'all' | 'washer' | 'fridge' | 'tv' | 'small'
export type BrandId = 'Toshiba' | 'Samsung' | 'LG' | 'Panasonic'
export type BranchId = 'q9' | 'td'
export type BudgetId = 'any' | 'lt8' | 'lt10' | 'lt15' | 'premium'
export type OrderStatus = 'PENDING' | 'CONFIRMED'

export interface Branch {
  id: BranchId
  name: string
  district: string
  address: string
}

export interface Product {
  id?: number
  sku: string
  name: string
  category: Exclude<CategoryId, 'all'>
  brand: BrandId
  price: number
  listPrice: number
  specs: string[]
  image: string
  stock: Record<BranchId, number>
}

export interface Order {
  id: number
  sku: string
  productName: string
  quantity: number
  customerName: string
  phone: string
  address: string
  branchId: BranchId
  promoCode: string | null
  subtotal: number
  discount: number
  total: number
  status: OrderStatus
  createdAt: string
}

export const BRANCHES: Branch[] = [
  {
    id: 'q9',
    name: 'DMX Lê Văn Việt',
    district: 'District 9',
    address: '216 Lê Văn Việt, P. Tăng Nhơn Phú B, TP. Thủ Đức',
  },
  {
    id: 'td',
    name: 'DMX Võ Văn Ngân',
    district: 'Thủ Đức',
    address: '58 Võ Văn Ngân, P. Bình Thọ, TP. Thủ Đức',
  },
]

export const CATEGORIES: { id: CategoryId; label: string; vi: string }[] = [
  { id: 'all', label: 'All Categories', vi: 'Tất cả' },
  { id: 'washer', label: 'Washing Machines', vi: 'Máy giặt' },
  { id: 'fridge', label: 'Refrigerators', vi: 'Tủ lạnh' },
  { id: 'tv', label: 'Smart TVs', vi: 'Tivi' },
  { id: 'small', label: 'Small Appliances', vi: 'Gia dụng' },
]

export const BRANDS: { id: BrandId; origin: string }[] = [
  { id: 'Toshiba', origin: 'Japan' },
  { id: 'Samsung', origin: 'Korea' },
  { id: 'LG', origin: 'Korea' },
  { id: 'Panasonic', origin: 'Japan' },
]

export const BUDGETS: { id: BudgetId; label: string }[] = [
  { id: 'any', label: 'Any budget' },
  { id: 'lt8', label: '< 8M VND' },
  { id: 'lt10', label: '< 10M VND' },
  { id: 'lt15', label: '< 15M VND' },
  { id: 'premium', label: 'Premium' },
]

export function matchesBudget(price: number, budget: BudgetId) {
  switch (budget) {
    case 'lt8':
      return price < 8_000_000
    case 'lt10':
      return price < 10_000_000
    case 'lt15':
      return price < 15_000_000
    case 'premium':
      return price >= 15_000_000
    default:
      return true
  }
}

export const PROMO_CODES: Record<string, { label: string; compute: (subtotal: number) => number }> = {
  MWG5: {
    label: 'Giảm 5% toàn đơn',
    compute: (subtotal) => Math.round(subtotal * 0.05),
  },
  TET2027: {
    label: 'Tết 2027 · Giảm 10% (tối đa 1.500.000 ₫)',
    compute: (subtotal) => Math.min(Math.round(subtotal * 0.1), 1_500_000),
  },
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    sku: 'DMX-MG-001',
    name: 'Máy giặt Toshiba Inverter 8.5 kg TW-BK95S3V lồng ngang',
    category: 'washer',
    brand: 'Toshiba',
    price: 7_490_000,
    listPrice: 9_190_000,
    specs: ['Inverter', 'Front Load 8.5kg', 'Steam Wash'],
    image: '/products/washer-front.png',
    stock: { q9: 4, td: 2 },
  },
  {
    sku: 'DMX-MG-002',
    name: 'Máy giặt Samsung AI Ecobubble Inverter 10 kg WW10TP44DSB/SV',
    category: 'washer',
    brand: 'Samsung',
    price: 11_990_000,
    listPrice: 14_490_000,
    specs: ['AI Wash', 'Front Load 10kg', 'Ecobubble'],
    image: '/products/washer-front.png',
    stock: { q9: 0, td: 5 },
  },
  {
    sku: 'DMX-MG-003',
    name: 'Máy giặt LG Inverter 12 kg T2312VSAB lồng đứng',
    category: 'washer',
    brand: 'LG',
    price: 6_890_000,
    listPrice: 8_290_000,
    specs: ['Inverter', 'Top Load 12kg', 'TurboDrum'],
    image: '/products/washer-top.png',
    stock: { q9: 7, td: 3 },
  },
  {
    sku: 'DMX-MG-004',
    name: 'Máy giặt Panasonic 9 kg NA-FD90X1LRV lồng đứng',
    category: 'washer',
    brand: 'Panasonic',
    price: 8_290_000,
    listPrice: 9_690_000,
    specs: ['Active Foam', 'Top Load 9kg', 'StainMaster+'],
    image: '/products/washer-top.png',
    stock: { q9: 2, td: 0 },
  },
  {
    sku: 'DMX-TL-001',
    name: 'Tủ lạnh Samsung Inverter 655 lít Side By Side RS62R5001B4/SV',
    category: 'fridge',
    brand: 'Samsung',
    price: 14_990_000,
    listPrice: 19_990_000,
    specs: ['Digital Inverter', 'Side by Side 655L', 'All-Around Cooling'],
    image: '/products/fridge-sbs.png',
    stock: { q9: 3, td: 1 },
  },
  {
    sku: 'DMX-TL-002',
    name: 'Tủ lạnh LG Inverter 635 lít Side By Side InstaView GR-X257BG',
    category: 'fridge',
    brand: 'LG',
    price: 32_490_000,
    listPrice: 38_900_000,
    specs: ['InstaView', 'Side by Side 635L', 'UVnano'],
    image: '/products/fridge-sbs.png',
    stock: { q9: 0, td: 0 },
  },
  {
    sku: 'DMX-TL-003',
    name: 'Tủ lạnh Panasonic Inverter 495 lít Multi Door NR-CW530XMMV',
    category: 'fridge',
    brand: 'Panasonic',
    price: 24_990_000,
    listPrice: 29_490_000,
    specs: ['Prime Fresh+', 'Multi Door 495L', 'Nanoe X'],
    image: '/products/fridge-multi.png',
    stock: { q9: 1, td: 4 },
  },
  {
    sku: 'DMX-TL-004',
    name: 'Tủ lạnh Toshiba Inverter 515 lít Multi Door GR-RF610WE-PGV',
    category: 'fridge',
    brand: 'Toshiba',
    price: 18_490_000,
    listPrice: 22_990_000,
    specs: ['Origin Inverter', 'Multi Door 515L', 'Ag+ Bio'],
    image: '/products/fridge-multi.png',
    stock: { q9: 5, td: 2 },
  },
  {
    sku: 'DMX-TV-001',
    name: 'Smart Tivi OLED LG 4K 55 inch OLED55C4PSA',
    category: 'tv',
    brand: 'LG',
    price: 29_900_000,
    listPrice: 39_900_000,
    specs: ['OLED evo', '4K 120Hz', 'webOS 24'],
    image: '/products/tv-oled.png',
    stock: { q9: 2, td: 3 },
  },
  {
    sku: 'DMX-TV-002',
    name: 'Smart Tivi QLED Samsung 4K 65 inch QA65Q70D',
    category: 'tv',
    brand: 'Samsung',
    price: 17_490_000,
    listPrice: 23_900_000,
    specs: ['Quantum Dot', '4K 120Hz', 'Tizen OS'],
    image: '/products/tv-qled.png',
    stock: { q9: 6, td: 0 },
  },
  {
    sku: 'DMX-TV-003',
    name: 'Google Tivi Toshiba 4K 55 inch 55C350NP',
    category: 'tv',
    brand: 'Toshiba',
    price: 9_490_000,
    listPrice: 12_490_000,
    specs: ['Google TV', '4K HDR10', 'Dolby Atmos'],
    image: '/products/tv-qled.png',
    stock: { q9: 8, td: 6 },
  },
  {
    sku: 'DMX-TV-004',
    name: 'Smart Tivi Panasonic 4K 50 inch TH-50MX700V',
    category: 'tv',
    brand: 'Panasonic',
    price: 10_990_000,
    listPrice: 13_990_000,
    specs: ['HDR Cinema', '4K 50"', 'Google TV'],
    image: '/products/tv-oled.png',
    stock: { q9: 0, td: 2 },
  },
  {
    sku: 'DMX-GD-001',
    name: 'Nồi chiên không dầu Toshiba 5.5 lít MM-AF55PVN',
    category: 'small',
    brand: 'Toshiba',
    price: 1_990_000,
    listPrice: 2_790_000,
    specs: ['5.5L', 'Digital Touch', '8 Presets'],
    image: '/products/airfryer.png',
    stock: { q9: 12, td: 9 },
  },
  {
    sku: 'DMX-GD-002',
    name: 'Nồi cơm điện cao tần Panasonic 1.5 lít SR-HL151KRA',
    category: 'small',
    brand: 'Panasonic',
    price: 4_290_000,
    listPrice: 5_190_000,
    specs: ['Induction IH', '1.5L', 'Diamond Coat'],
    image: '/products/ricecooker.png',
    stock: { q9: 3, td: 0 },
  },
  {
    sku: 'DMX-GD-003',
    name: 'Nồi cơm điện tử Samsung 1.8 lít Fuzzy Logic',
    category: 'small',
    brand: 'Samsung',
    price: 2_490_000,
    listPrice: 2_990_000,
    specs: ['Fuzzy Logic', '1.8L', 'Keep Warm 24h'],
    image: '/products/ricecooker.png',
    stock: { q9: 0, td: 7 },
  },
  {
    sku: 'DMX-GD-004',
    name: 'Nồi chiên không dầu LG 6 lít Smart Inverter',
    category: 'small',
    brand: 'LG',
    price: 3_190_000,
    listPrice: 3_990_000,
    specs: ['6L', 'Smart Inverter', 'ThinQ App'],
    image: '/products/airfryer.png',
    stock: { q9: 5, td: 4 },
  },
]

export const INITIAL_ORDERS: Order[] = [
  {
    id: 10248,
    sku: 'DMX-TV-001',
    productName: 'Smart Tivi OLED LG 4K 55 inch OLED55C4PSA',
    quantity: 1,
    customerName: 'Nguyễn Minh Khang',
    phone: '0903 412 886',
    address: '12 Đường số 6, P. Linh Chiểu, TP. Thủ Đức',
    branchId: 'td',
    promoCode: 'TET2027',
    subtotal: 29_900_000,
    discount: 1_500_000,
    total: 28_400_000,
    status: 'CONFIRMED',
    createdAt: '2026-10-25T08:42:00+07:00',
  },
  {
    id: 10249,
    sku: 'DMX-MG-001',
    productName: 'Máy giặt Toshiba Inverter 8.5 kg TW-BK95S3V lồng ngang',
    quantity: 1,
    customerName: 'Trần Thị Bảo Ngọc',
    phone: '0938 220 517',
    address: '45 Man Thiện, P. Hiệp Phú, TP. Thủ Đức',
    branchId: 'q9',
    promoCode: 'MWG5',
    subtotal: 7_490_000,
    discount: 374_500,
    total: 7_115_500,
    status: 'PENDING',
    createdAt: '2026-10-25T09:15:00+07:00',
  },
  {
    id: 10250,
    sku: 'DMX-GD-001',
    productName: 'Nồi chiên không dầu Toshiba 5.5 lít MM-AF55PVN',
    quantity: 2,
    customerName: 'Lê Hoàng Phúc',
    phone: '0977 105 334',
    address: 'Nhận tại cửa hàng',
    branchId: 'q9',
    promoCode: null,
    subtotal: 3_980_000,
    discount: 0,
    total: 3_980_000,
    status: 'PENDING',
    createdAt: '2026-10-25T09:31:00+07:00',
  },
]

const vndFormatter = new Intl.NumberFormat('vi-VN')

export function formatVND(value: number) {
  return `${vndFormatter.format(value)} ₫`
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
}

export function getBranch(id: BranchId) {
  return BRANCHES.find((b) => b.id === id) ?? BRANCHES[0]
}

export function getBrandOrigin(brand: BrandId) {
  return BRANDS.find((b) => b.id === brand)?.origin ?? ''
}
