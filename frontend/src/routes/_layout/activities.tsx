import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { ClipboardList } from "lucide-react"
import { Suspense } from "react"

import { ActivitiesService, UsersService } from "@/client"
import { DataTable } from "@/components/Common/DataTable"
import AddActivity from "@/components/Activities/AddActivity"
import { columns } from "@/components/Activities/columns"
import PendingActivities from "@/components/Pending/PendingActivities"

function getActivitiesQueryOptions() {
  return {
    queryFn: () => ActivitiesService.readActivities({ skip: 0, limit: 100 }),
    queryKey: ["activities"],
  }
}

export const Route = createFileRoute("/_layout/activities")({
  component: Activities,
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
        title: "Activities - FastAPI Template",
      },
    ],
  }),
})

function ActivitiesTableContent() {
  const { data: activities } = useSuspenseQuery(getActivitiesQueryOptions())

  if (activities.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="rounded-full bg-muted p-4 mb-4">
          <ClipboardList className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">
          You don't have any activities yet
        </h3>
        <p className="text-muted-foreground">Add a new activity to get started</p>
      </div>
    )
  }

  return <DataTable columns={columns} data={activities.data} />
}

function ActivitiesTable() {
  return (
    <Suspense fallback={<PendingActivities />}>
      <ActivitiesTableContent />
    </Suspense>
  )
}

function Activities() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activities</h1>
          <p className="text-muted-foreground">Create and manage activities</p>
        </div>
        <AddActivity />
      </div>
      <ActivitiesTable />
    </div>
  )
}