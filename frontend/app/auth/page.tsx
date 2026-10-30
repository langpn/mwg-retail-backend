'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Eye, EyeOff, Lock, LogIn, Phone, ShieldCheck, User, UserPlus } from 'lucide-react'
import { StoreProvider } from '@/components/dmx/store-provider'
import { AppHeader } from '@/components/dmx/app-header'
import { SiteFooter } from '@/components/dmx/site-footer'

export default function AuthPage() {
  return (
    <StoreProvider>
      <AuthContent />
    </StoreProvider>
  )
}

function AuthContent() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form state
  const [regName, setRegName] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setNotification('Đăng nhập thành công! Đang chuyển hướng về trang chủ...')
    setTimeout(() => {
      router.push('/')
    }, 900)
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setNotification('Đăng ký tài khoản thành viên thành công! Vui lòng đăng nhập.')
    setMode('login')
    setTimeout(() => {
      setNotification(null)
    }, 2500)
  }

  function quickAdminLogin() {
    setNotification('Xác thực quyền Quản trị viên! Đang mở Dashboard...')
    setTimeout(() => {
      router.push('/dashboard')
    }, 700)
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-foreground">
      <AppHeader />

      {/* Nội dung trung tâm */}
      <main className="flex flex-1 items-center justify-center p-4 py-12">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          {/* Chuyển tab Đăng nhập / Đăng ký */}
          <div className="flex border-b border-border bg-secondary/30 p-1">
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setNotification(null)
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all ${
                mode === 'login'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LogIn className="size-4" />
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register')
                setNotification(null)
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all ${
                mode === 'register'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <UserPlus className="size-4" />
              Đăng ký
            </button>
          </div>

          <div className="p-6">
            {notification && (
              <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800 animate-in fade-in">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>{notification}</span>
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-foreground">
                    Số điện thoại hoặc Email
                  </label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="0903 123 456 hoặc email@gmail.com"
                      className="h-11 w-full rounded-xl border border-border bg-card pr-4 pl-10 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">Mật khẩu</label>
                    <a href="#" className="text-[11px] font-semibold text-primary hover:underline">
                      Quên mật khẩu?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 w-full rounded-xl border border-border bg-card pr-11 pl-10 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-white shadow-sm transition-all hover:bg-primary-deep"
                >
                  Đăng nhập thành viên
                </button>

                <div className="relative my-2 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <span className="relative bg-card px-3 text-[11px] font-semibold text-muted-foreground uppercase">
                    Hoặc truy cập nhanh
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNotification('Đăng nhập với tài khoản Khách hàng mẫu!')
                      setTimeout(() => router.push('/'), 700)
                    }}
                    className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary/50 text-xs font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <User className="size-3.5 text-primary" />
                    Khách hàng mẫu
                  </button>

                  <button
                    type="button"
                    onClick={quickAdminLogin}
                    className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-50 text-xs font-bold text-amber-800 transition-colors hover:bg-amber-100"
                  >
                    <ShieldCheck className="size-3.5 text-amber-600" />
                    Quyền Admin
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
                <div>
                  <label className="mb-1 block text-xs font-bold text-foreground">Họ và tên</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Nguyễn Văn An"
                    className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-foreground">Số điện thoại</label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0903 456 789"
                    className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-foreground">Email (tùy chọn)</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="an.nguyen@email.com"
                    className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-foreground">Mật khẩu khởi tạo</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 flex h-11 items-center justify-center rounded-xl bg-accent text-sm font-extrabold text-foreground shadow-sm transition-all hover:bg-amber-400"
                >
                  Đăng ký thành viên mới
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
