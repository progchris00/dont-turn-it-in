import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Calendar } from 'lucide-react'
import { ROUTES } from '@/constants'

export default function RoleSelection() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface-bg font-sans">
      <Navbar />

      <main className="flex flex-col items-center justify-center px-4 pt-20 pb-32">
        {/* Label */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-600 text-xs font-semibold uppercase tracking-widest mb-6">
          <Calendar className="w-3.5 h-3.5" />
          Choose Your Portal
        </div>

        <h1 className="text-4xl font-bold text-gray-900 text-center">Select your Role</h1>
        <p className="mt-3 text-gray-500 text-center max-w-sm">
          Access the dashboard tailored to your needs. Pick a role to explore the platform.
        </p>

        {/* Cards */}
        <div className="mt-12 flex flex-col sm:flex-row gap-5 w-full max-w-2xl">
          <RoleCard
            icon="🎓"
            title="Student"
            description="Submit assignments, track deadlines, receive feedback, and view your academic progress dashboard"
            active
            onClick={() => navigate(ROUTES.STUDENT_DASHBOARD)}
          />
          <RoleCard
            icon="👤"
            title="Administrator"
            description="Monitor student submissions, analyze AI usage patterns, and get predictive insights for your classroom"
            onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
          />
        </div>

        {/* Guest */}
        <p className="mt-8 text-sm text-gray-400">
          Want to see a quick demo?{' '}
          <button
            onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
            className="text-brand-600 font-medium hover:underline"
          >
            Explore as a Guest
          </button>
        </p>
      </main>
    </div>
  )
}

interface RoleCardProps {
  icon:        string
  title:       string
  description: string
  active?:     boolean
  onClick:     () => void
}

function RoleCard({ icon, title, description, active, onClick }: RoleCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 text-left p-7 rounded-2xl border-2 transition-all shadow-card hover:shadow-cardHover
        ${active
          ? 'border-brand-500 bg-brand-50'
          : 'border-gray-100 bg-white hover:border-brand-300'
        }`}
    >
      <span className={`w-14 h-14 flex items-center justify-center rounded-xl text-2xl mb-5
        ${active ? 'bg-brand-100' : 'bg-gray-100'}`}>
        {icon}
      </span>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="mt-2 text-sm text-gray-500 leading-relaxed">{description}</p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
        Enter Dashboard →
      </span>
    </button>
  )
}
