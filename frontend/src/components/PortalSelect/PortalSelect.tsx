import { CalendarDays, GraduationCap, ShieldCheck } from "lucide-react"

import Navbar from "@/components/Common/Navbar"
import { RoleCard } from "./RoleCard"

// ─── Data ────

const ROLES = [
  {
    title: "Student",
    description:
      "Submit assignments, track deadlines, receive feedback, and view your academic progress dashboard",
    icon: <GraduationCap className="h-8 w-8" />,
    href: "/student-portal",
    isActive: false,
  },
  {
    title: "Administrator",
    description:
      "Monitor student submissions, analyze AI usage patterns, and get predictive insights for your classroom",
    icon: <ShieldCheck className="h-8 w-8" />,
    href: "/admin-dashboard",
    isActive: true,
  },
] as const

// ─── Component ────

/**
 * PortalSelect
 * Landing page where authenticated users choose their role portal.
 */
export function PortalSelect() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fdf4f0]">
      <Navbar />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6">
        {/* Badge */}
        <div className="mb-6 flex items-center gap-2 rounded-full border border-orange-300 bg-[#fde8d8] px-4 py-1.5">
          <CalendarDays className="h-3.5 w-3.5 text-orange-500" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-widest text-orange-700">
            Choose Your Portal
          </span>
        </div>

        {/* Heading */}
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Select your Role
        </h1>

        {/* Sub-heading */}
        <p className="mb-12 max-w-md text-center text-base text-gray-500">
          Access the dashboard tailored to your needs. Pick a role to explore
          the platform
        </p>

        {/* Role cards */}
        <section
          aria-label="Portal role options"
          className="grid w-full max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2"
        >
          {ROLES.map((role) => (
            <RoleCard key={role.title} {...role} />
          ))}
        </section>

        {/* Guest link */}
        <p className="mt-10 text-sm text-gray-500">
          Want to see a quick demo?{" "}
          <a
            href="/guest"
            className="font-medium text-orange-600 underline-offset-2 transition-colors hover:text-orange-700 hover:underline"
          >
            Explore as a Guest
          </a>
        </p>
      </main>
    </div>
  )
}

export default PortalSelect
