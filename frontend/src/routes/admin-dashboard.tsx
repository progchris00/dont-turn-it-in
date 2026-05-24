import { createFileRoute, redirect } from "@tanstack/react-router"

import AdminDashboard from "@/components/AdminDashboard/AdminDashboard"
import DashboardLayout from "@/components/Common/DashboardLayout"
import { isLoggedIn } from "@/hooks/useAuth"
import { UsersService } from "@/client"

function AdminDashboardPage() {
  return (
    <DashboardLayout>
      <AdminDashboard />
    </DashboardLayout>
  )
}

export const Route = createFileRoute("/admin-dashboard")({
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login" })
    }

    const user = await UsersService.readUserMe()

    if (!user.is_superuser) {
      throw redirect({ to: "/" })
    }
  },
  component: AdminDashboardPage,
  head: () => ({
    meta: [
      {
        title: "Admin Dashboard — Don't Turn It In",
      },
    ],
  }),
})
