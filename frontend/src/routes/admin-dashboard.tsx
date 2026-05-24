import { createFileRoute, redirect } from "@tanstack/react-router"

import AdminDashboard from "@/components/AdminDashboard/AdminDashboard"
import { isLoggedIn } from "@/hooks/useAuth"

export const Route = createFileRoute("/admin-dashboard")({
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login" })
    }
    // const user = await UsersService.readUserMe()
    // if (!user.is_superuser) throw redirect({ to: "/" })
  },
  component: AdminDashboard,
  head: () => ({
    meta: [
      {
        title: "Admin Dashboard — Don't Turn It In",
      },
    ],
  }),
})
