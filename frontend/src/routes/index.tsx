import { Link as RouterLink, createFileRoute } from "@tanstack/react-router";
import { GraduationCap, LayoutDashboard, ShieldCheck } from "lucide-react";

import { Navbar } from "@/components/Common/Navbar";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      {
        title: "Don't Turn it in - Select Role",
      },
    ],
  }),
});

function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center">
          <div className="flex items-center gap-2 rounded-md bg-orange-100 px-6 py-2 text-sm font-semibold text-orange-600">
            <LayoutDashboard size={16} />
            CHOOSE YOUR PORTAL
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Select your role
            </h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
              Access the dashboard tailored to your needs. Pick a role to <br />
              explore the platform.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <RouterLink
              to="/student-portal"
              className="flex w-72 flex-col justify-between rounded-lg border border-orange-200 bg-card p-6 text-left transition-shadow hover:shadow-lg"
            >
              <div>
                <div className="mb-4 inline-flex rounded-md bg-orange-100 p-3 text-orange-600">
                  <GraduationCap size={24} />
                </div>
                <h2 className="mb-2 text-lg font-semibold">Student</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Enter the student portal to review activities and past
                  submissions.
                </p>
              </div>
              <span className="mt-auto text-sm font-medium text-orange-600">
                Enter Portal →
              </span>
            </RouterLink>

            <RouterLink
              to="/admin"
              className="flex w-72 flex-col justify-between rounded-lg border border-border bg-card p-6 text-left transition-shadow hover:shadow-lg"
            >
              <div>
                <div className="mb-4 inline-flex rounded-md bg-muted p-3 text-foreground">
                  <ShieldCheck size={24} />
                </div>
                <h2 className="mb-2 text-lg font-semibold">Administrator</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Monitor student submissions, analyze AI usage patterns, and
                  get predictive insights for your classroom.
                </p>
              </div>
              <span className="mt-auto text-sm font-medium text-foreground">
                Enter Dashboard →
              </span>
            </RouterLink>
          </div>
          <p className="mt-6 text-sm text-gray-500 flex flex-row gap-1 cursor-pointer">
            Want to see a quick demo?
            <span className="text-orange-600 font-medium">
              Explore as a Guest
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
