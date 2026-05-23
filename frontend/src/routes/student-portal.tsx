import { createFileRoute, redirect } from "@tanstack/react-router"

import StudentPortal from "@/components/StudentPortal/StudentPortal"
import { isLoggedIn } from "@/hooks/useAuth"

export const Route = createFileRoute("/student-portal")({
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login" })
    }
  },
  component: StudentPortal,
  head: () => ({
    meta: [
      {
        title: "Student Portal - Don't Turn it in",
      },
    ],
  }),
})
