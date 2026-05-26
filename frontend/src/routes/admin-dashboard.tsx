import { createFileRoute, redirect } from "@tanstack/react-router"

import { UsersService } from "@/client"
import { Footer } from "@/components/Common/Footer"
import AppSidebar from "@/components/Sidebar/AppSidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AdminDashboard from "@/components/Admin/AdminDashboard"
import { isLoggedIn } from "@/hooks/useAuth"

function AdminDashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1 text-muted-foreground" />
        </header>
        <main className="flex-1 p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            <AdminDashboard />
          </div>
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
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