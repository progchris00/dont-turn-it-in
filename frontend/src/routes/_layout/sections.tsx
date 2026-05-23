import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { Layers3 } from "lucide-react"
import { Suspense } from "react"

import { SectionsService, UsersService } from "@/client"
import { DataTable } from "@/components/Common/DataTable"
import AddSection from "@/components/Sections/AddSection"
import { columns } from "@/components/Sections/columns"
import PendingSections from "@/components/Pending/PendingSections"

function getSectionsQueryOptions() {
  return {
    queryFn: () => SectionsService.readSections({ skip: 0, limit: 100 }),
    queryKey: ["sections"],
  }
}

export const Route = createFileRoute("/_layout/sections")({
  component: Sections,
  beforeLoad: async () => {
    const user = await UsersService.readUserMe()
    if (!user.is_superuser) {
      throw redirect({
        to: "/",
      })
    }
  },
  head: () => ({
    meta: [
      {
        title: "Sections - FastAPI Template",
      },
    ],
  }),
})

function SectionsTableContent() {
  const { data: sections } = useSuspenseQuery(getSectionsQueryOptions())

  if (sections.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Layers3 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">You don't have any sections yet</h3>
        <p className="text-muted-foreground">Add a new section to get started</p>
      </div>
    )
  }

  return <DataTable columns={columns} data={sections.data} />
}

function SectionsTable() {
  return (
    <Suspense fallback={<PendingSections />}>
      <SectionsTableContent />
    </Suspense>
  )
}

function Sections() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sections</h1>
          <p className="text-muted-foreground">Create and manage sections</p>
        </div>
        <AddSection />
      </div>
      <SectionsTable />
    </div>
  )
}