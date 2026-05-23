import { Link } from 'react-router-dom'

interface NavbarProps {
  role?: 'student' | 'admin' | 'guest'
  onSwitchRole?: () => void
}

export function Navbar({ role, onSwitchRole }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black text-sm">
            7
          </span>
          <span className="font-bold text-gray-900 text-sm tracking-tight">
            Don't Turn It In
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm text-gray-500 font-medium">
          {['Features', 'How It Works', 'Pricing', 'Testimonials'].map((item) => (
            <a key={item} href="#" className="hover:text-gray-900 transition-colors">
              {item}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {role ? (
            <button
              onClick={onSwitchRole}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 hover:border-brand-600 hover:text-brand-600 transition-colors"
            >
              Switch Role: {role === 'admin' ? 'Admin' : 'Student'}
            </button>
          ) : (
            <>
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Sign In
              </button>
              <button className="text-sm font-semibold px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors">
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
