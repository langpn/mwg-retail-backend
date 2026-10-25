import { Database, GraduationCap, Server, ShoppingBag } from 'lucide-react'

const TEAM = [
  { name: 'Lang', role: 'Team Lead' },
  { name: 'Diễm', role: 'Developer' },
  { name: 'Toàn', role: 'Developer' },
]

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border bg-card">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-8 md:grid-cols-3 md:px-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-deep">
              <ShoppingBag className="size-4 text-white" aria-hidden="true" />
            </span>
            <p className="text-sm font-extrabold text-foreground">Điện Máy Xanh · Multi-Branch Retail System</p>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
            Omnichannel e-commerce & store operations platform — catalog, real-time branch inventory and fast order
            queue. Academic prototype, not affiliated with Mobile World Group.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
            <GraduationCap className="size-3.5" aria-hidden="true" />
            IUH · Software Engineering · Class 21BVL
          </p>
          <ul className="flex flex-wrap gap-2">
            {TEAM.map((m) => (
              <li key={m.name} className="flex items-center gap-2 rounded-full border border-border py-1 pr-3 pl-1">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-extrabold text-primary-deep">
                  {m.name.charAt(0)}
                </span>
                <span className="text-xs font-bold text-foreground">{m.name}</span>
                <span className="text-[11px] text-muted-foreground">{m.role}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Architecture</p>
          <ul className="flex flex-col gap-1.5 text-xs text-body">
            <li className="flex items-center gap-2">
              <Server className="size-3.5 text-primary" aria-hidden="true" />
              Spring Boot 3 · RESTful API (GET / POST / PUT / PATCH)
            </li>
            <li className="flex items-center gap-2">
              <Database className="size-3.5 text-primary" aria-hidden="true" />
              MySQL · 10-table relational schema
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-[1440px] px-4 py-3 text-[11px] text-muted-foreground md:px-8">
          © 2026 Team Lang · Diễm · Toàn — Industrial University of Ho Chi Minh City
        </p>
      </div>
    </footer>
  )
}
