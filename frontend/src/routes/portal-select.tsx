import { createFileRoute, redirect } from "@tanstack/react-router"

import PortalSelect from "@/components/PortalSelect/PortalSelect"
import { isLoggedIn } from "@/hooks/useAuth"

export const Route = createFileRoute("/portal-select")({
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login" })
    }
  },
  component: PortalSelect,
  head: () => ({
    meta: [
      {
        title: "Select Your Portal — Don't Turn It In",
      },
    ],
  }),
})
