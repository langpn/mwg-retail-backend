import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Store, 
  ClipboardList, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  code: string;
  description: string;
}

interface Brand {
  id: number;
  name: string;
  country: string;
}

interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  description: string;
  category: Category;
  brand: Brand;
}

interface StoreBranch {
  id: number;
  branchName: string;
  district: string;
  address: string;
  phone: string;
}

interface Inventory {
  id: number;
  product: Product;
  storeBranch: StoreBranch;
  quantity: number;
}

interface CustomerOrder {
  id: number;
  customerName: string;
  phone: string;
  shippingAddress: string;
  totalAmount: number;
  status: string;
  orderDate: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'inventory' | 'orders'>('catalog');
  
  // Data state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [branches, setBranches] = useState<StoreBranch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [branchInventory, setBranchInventory] = useState<Inventory[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Order form state
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    phone: '',
    shippingAddress: '',
    productId: '',
    quantity: 1,
    promoCode: 'MWG5',
    branchId: ''
  });

  // Fetch static lookups
  useEffect(() => {
    fetch('/api/v1/products/categories')
      .then(r => r.json())
      .then(data => setCategories(data))
      .catch(() => {});

    fetch('/api/v1/products/brands')
      .then(r => r.json())
      .then(data => setBrands(data))
      .catch(() => {});

    fetch('/api/v1/inventory/branches')
      .then(r => r.json())
      .then(data => {
        setBranches(data);
        if (data.length > 0) {
          setSelectedBranchId(data[0].id);
          setOrderForm(prev => ({ ...prev, branchId: String(data[0].id) }));
        }
      })
      .catch(() => {});
  }, []);

  // Fetch products on filter change
  const fetchProducts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedBrand) params.append('brand', selectedBrand);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (searchKeyword) params.append('keyword', searchKeyword);

    fetch(`/api/v1/products?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand, maxPrice, searchKeyword]);

  // Fetch branch inventory
  useEffect(() => {
    if (selectedBranchId) {
      fetch(`/api/v1/inventory/branch/${selectedBranchId}`)
        .then(r => r.json())
        .then(data => setBranchInventory(data))
        .catch(() => {});
    }
  }, [selectedBranchId]);

  // Fetch orders
  const fetchOrders = () => {
    fetch('/api/v1/orders')
      .then(r => r.json())
      .then(data => setOrders(data))
      .catch(() => {});
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Handle Order Submit
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.customerName || !orderForm.phone || !orderForm.productId) {
      alert('Vui lòng điền đầy đủ tên, số điện thoại và chọn sản phẩm!');
      return;
    }

    const payload = {
      customerName: orderForm.customerName,
      phone: orderForm.phone,
      shippingAddress: orderForm.shippingAddress || 'Nhận tại siêu thị',
      promoCode: orderForm.promoCode,
      branchId: Number(orderForm.branchId),
      items: [
        {
          productId: Number(orderForm.productId),
          quantity: Number(orderForm.quantity)
        }
      ]
    };

    fetch('/api/v1/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(savedOrder => {
        showToast(`Đặt hàng thành công! Mã đơn: #${savedOrder.id} - Tổng tiền: ${savedOrder.totalAmount?.toLocaleString('vi-VN')} đ`);
        fetchOrders();
        // refresh branch inventory
        if (selectedBranchId) {
          fetch(`/api/v1/inventory/branch/${selectedBranchId}`)
            .then(res => res.json())
            .then(data => setBranchInventory(data));
        }
        setOrderForm(prev => ({
          ...prev,
          customerName: '',
          phone: '',
          shippingAddress: ''
        }));
      })
      .catch(err => alert('Lỗi đặt hàng: ' + err));
  };

  // Handle Stock Update
  const handleUpdateStock = (productId: number, currentQty: number) => {
    const newQtyStr = prompt('Nhập số lượng tồn kho mới cho chi nhánh này:', String(currentQty));
    if (newQtyStr === null) return;
    const newQty = parseInt(newQtyStr, 10);
    if (isNaN(newQty) || newQty < 0) {
      alert('Số lượng tồn kho không hợp lệ!');
      return;
    }

    fetch('/api/v1/inventory/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        branchId: selectedBranchId,
        quantity: newQty
      })
    })
      .then(r => r.json())
      .then(() => {
        showToast('Cập nhật số lượng tồn kho thành công!');
        if (selectedBranchId) {
          fetch(`/api/v1/inventory/branch/${selectedBranchId}`)
            .then(res => res.json())
            .then(data => setBranchInventory(data));
        }
      })
      .catch(err => alert('Lỗi cập nhật: ' + err));
  };

  const formatVND = (amount: number) => {
    return (amount || 0).toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div>
      {/* HEADER */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-group">
            <div className="brand-logo-badge">
              <ShoppingBag size={20} />
              <span>ĐIỆN MÁY XANH</span>
            </div>
            <div className="brand-titles">
              <h1>Hệ Thống Dữ Liệu Bán Lẻ Đa Chi Nhánh</h1>
              <p>Spring Boot 3 + MySQL 10 Bảng + React SPA</p>
            </div>
          </div>
          <div className="badge-iuh">
            Đồ Án Môn Học: Công Cụ Web & Website Hướng Dữ Liệu (IUH)
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="app-container">
        
        {/* NAV TABS */}
        <nav className="tabs-nav">
          <button 
            className={`tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            <ShoppingBag size={18} />
            <span>1. Danh Mục & Sản Phẩm</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <Store size={18} />
            <span>2. Tồn Kho Đa Chi Nhánh</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ClipboardList size={18} />
            <span>3. Đặt Hàng & Quản Lý Đơn</span>
          </button>
        </nav>

        {/* TOAST ALERT */}
        {toast && (
          <div className="toast-success">
            <CheckCircle2 size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
            {toast}
          </div>
        )}

        {/* TAB 1: PRODUCT CATALOG */}
        {activeTab === 'catalog' && (
          <section>
            {/* Filter Bar */}
            <div className="filter-card">
              <div className="filter-field">
                <label><SlidersHorizontal size={13} style={{ display: 'inline', marginRight: 4 }} /> Danh mục</label>
                <select 
                  className="filter-select"
                  value={selectedCategory} 
                  onChange={e => setSelectedCategory(e.target.value)}
                >
                  <option value="">-- Tất cả danh mục --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="filter-field">
                <label>Thương hiệu</label>
                <select 
                  className="filter-select"
                  value={selectedBrand} 
                  onChange={e => setSelectedBrand(e.target.value)}
                >
                  <option value="">-- Tất cả thương hiệu --</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.name}>{b.name} ({b.country})</option>
                  ))}
                </select>
              </div>

              <div className="filter-field">
                <label><TrendingDown size={13} style={{ display: 'inline', marginRight: 4 }} /> Ngân sách tối đa</label>
                <select 
                  className="filter-select"
                  value={maxPrice} 
                  onChange={e => setMaxPrice(e.target.value)}
                >
                  <option value="">-- Mọi mức giá --</option>
                  <option value="8000000">Dưới 8 triệu đ</option>
                  <option value="10000000">Dưới 10 triệu đ</option>
                  <option value="15000000">Dưới 15 triệu đ</option>
                </select>
              </div>

              <div className="filter-field" style={{ flex: 1.5 }}>
                <label><Search size={13} style={{ display: 'inline', marginRight: 4 }} /> Tìm kiếm từ khóa</label>
                <input 
                  type="text"
                  className="filter-input"
                  placeholder="Nhập tên máy giặt, tủ lạnh, tivi..."
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                />
              </div>

              <button 
                className="btn-buy" 
                style={{ height: 40, alignSelf: 'flex-end', padding: '0 18px' }}
                onClick={fetchProducts}
              >
                <RefreshCw size={14} style={{ display: 'inline', marginRight: 4 }} /> Làm mới
              </button>
            </div>

            {/* Product Grid */}
            {loading ? (
              <p style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Đang nạp dữ liệu sản phẩm từ Spring Boot REST API...</p>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 50, background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
                <AlertCircle size={40} color="#f59e0b" style={{ margin: '0 auto 10px auto' }} />
                <h3>Không tìm thấy sản phẩm phù hợp!</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 4 }}>Hãy thử thay đổi tiêu chí lọc hoặc ngân sách tìm kiếm.</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(p => (
                  <div key={p.id} className="product-card">
                    <div className="card-media">
                      <span className="card-sku-pill">{p.sku}</span>
                      <span className="card-brand-pill">{p.brand?.name || 'Chính Hãng'}</span>
                      <Sparkles size={48} color="#0284c7" opacity={0.35} />
                    </div>
                    <div className="card-body">
                      <div className="card-category">{p.category?.name}</div>
                      <h3 className="card-title">{p.name}</h3>
                      <p className="card-desc">{p.description}</p>
                      <div className="card-footer">
                        <div className="price-tag">{formatVND(p.price)}</div>
                        <button 
                          className="btn-buy"
                          onClick={() => {
                            setOrderForm(prev => ({ ...prev, productId: String(p.id) }));
                            setActiveTab('orders');
                          }}
                        >
                          Mua ngay <ChevronRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: INVENTORY MATRIX */}
        {activeTab === 'inventory' && (
          <section>
            <div className="data-table-card">
              <div className="table-header-bar">
                <div>
                  <h2>Quản Lý Tồn Kho Theo Siêu Thị Chi Nhánh</h2>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 2 }}>
                    Dữ liệu thời gian thực phục vụ cho AI Agent kiểm tra tồn kho tại từng chi nhánh
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Chọn chi nhánh:</label>
                  <select 
                    className="filter-select"
                    value={selectedBranchId || ''}
                    onChange={e => setSelectedBranchId(Number(e.target.value))}
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.branchName} ({b.district})</option>
                    ))}
                  </select>
                </div>
              </div>

              <table className="mwg-table">
                <thead>
                  <tr>
                    <th>Mã SKU</th>
                    <th>Tên Sản Phẩm</th>
                    <th>Danh Mục</th>
                    <th>Giá Niêm Yết</th>
                    <th>Số Lượng Tồn</th>
                    <th>Trạng Thái</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {branchInventory.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: 30, color: '#64748b' }}>
                        Chưa có dữ liệu tồn kho cho chi nhánh này.
                      </td>
                    </tr>
                  ) : (
                    branchInventory.map(inv => {
                      const inStock = inv.quantity > 0;
                      return (
                        <tr key={inv.id}>
                          <td><strong>{inv.product?.sku}</strong></td>
                          <td>{inv.product?.name}</td>
                          <td><span className="badge-iuh">{inv.product?.category?.name}</span></td>
                          <td><span style={{ color: '#dc2626', fontWeight: 700 }}>{formatVND(inv.product?.price)}</span></td>
                          <td style={{ fontSize: '1rem', fontWeight: 700 }}>{inv.quantity} máy</td>
                          <td>
                            <span className={`badge-stock ${inStock ? 'badge-in-stock' : 'badge-out-of-stock'}`}>
                              {inStock ? '✓ Còn Hàng' : '✕ Hết Hàng'}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn-buy"
                              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                              onClick={() => handleUpdateStock(inv.product?.id, inv.quantity)}
                            >
                              Sửa tồn kho (PUT)
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 3: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <section className="order-layout">
            {/* Left: Create Order Form */}
            <div className="panel-card">
              <h2><ClipboardList size={20} color="#0284c7" /> Tạo Đơn Hàng Mới (HTTP POST)</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 16 }}>
                Khi đặt hàng, hệ thống sẽ tự động trừ số lượng tồn kho tương ứng tại chi nhánh đã chọn.
              </p>
              <form onSubmit={handleCreateOrder}>
                <div className="form-group">
                  <label>Chọn sản phẩm đặt mua (*):</label>
                  <select 
                    className="form-control"
                    value={orderForm.productId}
                    onChange={e => setOrderForm({ ...orderForm, productId: e.target.value })}
                    required
                  >
                    <option value="">-- Chọn sản phẩm --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({formatVND(p.price)})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>Số lượng (*):</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="10"
                      className="form-control"
                      value={orderForm.quantity}
                      onChange={e => setOrderForm({ ...orderForm, quantity: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Mã giảm giá:</label>
                    <input 
                      type="text" 
                      placeholder="MWG5 hoặc TET2027"
                      className="form-control"
                      value={orderForm.promoCode}
                      onChange={e => setOrderForm({ ...orderForm, promoCode: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Chi nhánh lấy hàng:</label>
                  <select 
                    className="form-control"
                    value={orderForm.branchId}
                    onChange={e => setOrderForm({ ...orderForm, branchId: e.target.value })}
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.branchName} ({b.district})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Họ tên khách hàng (*):</label>
                  <input 
                    type="text" 
                    placeholder="Nguyễn Văn A"
                    className="form-control"
                    value={orderForm.customerName}
                    onChange={e => setOrderForm({ ...orderForm, customerName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Số điện thoại (*):</label>
                  <input 
                    type="text" 
                    placeholder="0901234567"
                    className="form-control"
                    value={orderForm.phone}
                    onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Địa chỉ giao hàng:</label>
                  <input 
                    type="text" 
                    placeholder="Số nhà, tên đường, phường..."
                    className="form-control"
                    value={orderForm.shippingAddress}
                    onChange={e => setOrderForm({ ...orderForm, shippingAddress: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-submit-order">
                  Xác Nhận Đặt Hàng (Gửi JSON sang Spring Boot)
                </button>
              </form>
            </div>

            {/* Right: Orders List */}
            <div className="panel-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2><Store size={20} color="#0284c7" /> Danh Sách Đơn Hàng ({orders.length})</h2>
                <button 
                  className="btn-buy" 
                  style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  onClick={fetchOrders}
                >
                  <RefreshCw size={13} style={{ display: 'inline', marginRight: 4 }} /> Tải lại
                </button>
              </div>

              <div style={{ maxHeight: 520, overflowY: 'auto' }}>
                {orders.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Chưa có đơn hàng nào trong hệ thống.</p>
                ) : (
                  orders.map(o => (
                    <div 
                      key={o.id} 
                      style={{ 
                        border: '1px solid #e2e8f0', 
                        borderRadius: 10, 
                        padding: 14, 
                        marginBottom: 10,
                        background: '#fafafa'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 800, color: '#0284c7' }}>Đơn hàng #{o.id}</span>
                        <span className="badge-stock badge-in-stock">{o.status}</span>
                      </div>
                      <div style={{ fontSize: '0.88rem', color: '#334155' }}>
                        Khách hàng: <strong>{o.customerName}</strong> ({o.phone})
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                        Địa chỉ: {o.shippingAddress}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 6, borderTop: '1px dashed #e2e8f0' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Tổng tiền sau giảm giá:</span>
                        <span style={{ fontWeight: 800, color: '#dc2626' }}>{formatVND(o.totalAmount)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="app-footer">
          <p><strong>Đồ án môn học:</strong> Công cụ Web và Website hướng dữ liệu • <strong>Đề tài:</strong> Hệ Thống Bán Lẻ Đa Chi Nhánh Điện Máy Xanh</p>
          <p style={{ marginTop: 4 }}>
            <strong>Nhóm sinh viên thực hiện:</strong> Phạm Ngọc Lang (25765251) - Nhóm trưởng | Bạn Diễm | Bạn Toàn • <strong>Lớp:</strong> 21BVL
          </p>
          <p style={{ marginTop: 4, color: '#94a3b8' }}>
            Backend: Java 17, Spring Boot 3, Spring Data JPA, MySQL 10 Bảng • Frontend: React TypeScript Single-Page Application
          </p>
        </footer>

      </div>
    </div>
  );
}
