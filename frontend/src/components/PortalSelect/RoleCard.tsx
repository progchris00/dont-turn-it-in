import { ArrowRight } from "lucide-react"
import type { ReactNode } from "react"

// ─── Types ────

export interface RoleCardProps {
  /** Card title either "Student" or "Administrator" */
  title: string
  /** Short description of what this role offers */
  description: string
  /** Icon element rendered in the icon box */
  icon: ReactNode
  /** href / route to navigate to on click */
  href: string
  /** When true, applies the active/highlighted orange-accent style */
  isActive?: boolean
}

// ─── Component ────

/**
 * RoleCard
 * Clickable card for selecting a portal role (Student / Administrator).
 *
 * Inactive variant: white/gray background, neutral border.
 * Active variant: warm peach background, orange border.
 */
export function RoleCard({
  title,
  description,
  icon,
  href,
  isActive = false,
}: RoleCardProps) {
  const containerBase =
    "group flex flex-col gap-4 rounded-2xl border-2 p-6 transition-all duration-200"

  const containerVariant = isActive
    ? "border-orange-400 bg-[#fef3ec] shadow-md hover:shadow-lg hover:border-orange-500"
    : "border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-gray-300"

  const iconBoxVariant = isActive
    ? "bg-[#fde8d8] text-orange-600"
    : "bg-gray-100 text-gray-500"

  return (
    <article className={`${containerBase} ${containerVariant}`}>
      {/* Icon box */}
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-xl ${iconBoxVariant}`}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-600">{description}</p>
      </div>

      {/* CTA link */}
      <a
        href={href}
        className={`mt-auto inline-flex items-center gap-1 text-sm font-medium transition-colors ${
          isActive
            ? "text-orange-600 hover:text-orange-700"
            : "text-gray-600 hover:text-gray-800"
        }`}
        aria-label={`Enter ${title} Dashboard`}
      >
        Enter Dashboard
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </a>
    </article>
  )
}

export default RoleCard
