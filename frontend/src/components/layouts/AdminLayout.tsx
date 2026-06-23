import { Link, Outlet, useLocation, NavLink } from 'react-router-dom'

const items = [
  { to: '/admin', label: 'Dashboard', exact: true },
  { to: '/admin/products', label: 'Products', exact: false },
  { to: '/admin/categories', label: 'Categories', exact: false },
  { to: '/admin/enquiries', label: 'Enquiries', exact: false },
  { to: '/admin/page-photos', label: 'Page Photos', exact: false },
  { to: '/admin/banners', label: 'Banners', exact: false },
  { to: '/admin/instagram', label: 'Instagram', exact: false },
]

export default function AdminLayout() {
  const location = useLocation()
  return (
    <div className="min-h-dvh bg-[#07060b] text-white">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 py-6">
        <div className="flex gap-6 items-start">
          <aside className="w-[240px] hidden lg:block">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-sm text-white/70 mb-4">
                Admin <span className="text-yellow-200">Panel</span>
              </div>
              <nav className="flex flex-col gap-2">
                {items.map((i) => (
                  <NavLink
                    key={i.to}
                    to={i.to}
                    end={i.exact}
                    className={({ isActive }) =>
                      isActive
                        ? 'rounded-xl bg-yellow-200/15 border border-yellow-200/25 px-3 py-2 text-yellow-200 block'
                        : 'rounded-xl border border-transparent hover:border-white/15 px-3 py-2 text-white/80 block'
                    }
                  >
                    {i.label}
                  </NavLink>
                ))}
              </nav>
              <div className="mt-5 text-xs text-white/40">
                Manage products, visibility & enquiries.
              </div>
            </div>
          </aside>

          <section className="flex-1 w-full">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-white/60">
                  {location.pathname}
                </div>
                <Link
                  to="/"
                  className="hidden sm:inline-flex rounded-full px-4 py-2 bg-white/10 border border-white/15 hover:bg-white/15 transition-colors"
                >
                  View site
                </Link>
              </div>
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

