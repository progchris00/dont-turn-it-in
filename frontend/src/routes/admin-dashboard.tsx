import { createFileRoute, redirect } from "@tanstack/react-router"
import { UsersService } from "@/client"
import AdminDashboard from "@/components/Admin/AdminDashboard"
import { AuthLayout } from "@/components/Common/AuthLayout"
import { isLoggedIn } from "@/hooks/useAuth"

function AdminDashboardPage() {
  return (
    <AuthLayout>
      <AdminDashboard />
    </AuthLayout>
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
