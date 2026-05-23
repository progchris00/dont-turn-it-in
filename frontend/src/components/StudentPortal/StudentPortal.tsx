import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Common/Navbar";
import ActivityTab from "@/components/StudentPortal/ActivityTab";
import SubmissionTab from "@/components/StudentPortal/SubmissionTab";
import type { Activity, Submission } from "@/components/StudentPortal/types";

const activityPreview: Activity[] = [
  {
    id: 1,
    activityTitle: "Essay Draft Review",
    description:
      "Upload your draft for a quick AI-assisted review before the deadline.",
    deadline: "today at 5:00 PM",
  },
  {
    id: 2,
    activityTitle: "Reading Reflection",
    description: "Reflect on this week’s reading and submit your response.",
    deadline: "tomorrow at 11:59 PM",
  },
  {
    id: 3,
    activityTitle: "Project Check-in",
    description:
      "Share your current progress and blockers with your instructor.",
    deadline: "Friday",
  },
];

const submissionPreview: Submission[] = [
  {
    id: 1,
    activityTitle: "Essay Draft Review",
    studentName: "Alex Johnson",
    submittedAt: "Submitted 2 hours ago",
    aiflag: "AI flagged",
    aiPercent: 82,
  },
  {
    id: 2,
    activityTitle: "Reading Reflection",
    studentName: "Alex Johnson",
    submittedAt: "Submitted yesterday",
    aiflag: "Human reviewed",
    aiPercent: 24,
  },
  {
    id: 3,
    activityTitle: "Weekly Quiz",
    studentName: "Alex Johnson",
    submittedAt: "Submitted last week",
    aiflag: "Needs revision",
    aiPercent: 53,
  },
];

function EmptyState({
  title,
  description,
  buttonLabel,
}: {
  title: string;
  description: string;
  buttonLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
        {description}
      </p>
      <Button className="mt-6 bg-orange-600 text-white hover:bg-orange-700">
        {buttonLabel}
      </Button>
    </div>
  );
}

export function StudentPortal() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="activity" className="flex flex-1 flex-col">
          <TabsList className="mb-6 w-fit">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="submission">Submission</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-0 flex-1 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Active Activities
                </h2>
                <p className="text-sm text-muted-foreground">
                  Review the tasks that are currently available to you.
                </p>
              </div>
              <Button variant="outline">Refresh</Button>
            </div>

            <ActivityTab
              activities={activityPreview}
              loading={false}
              error={null}
              onRetry={() => undefined}
              onSubmit={() => undefined}
              submittingId={null}
            />
          </TabsContent>

          <TabsContent value="submission" className="mt-0 flex-1 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Past Submissions
                </h2>
                <p className="text-sm text-muted-foreground">
                  A quick view of recent work you have already turned in.
                </p>
              </div>
              <Button variant="outline">View all</Button>
            </div>

            <SubmissionTab
              submissions={submissionPreview}
              loading={false}
              error={null}
              onRetry={() => undefined}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-10">
          <EmptyState
            title="Nothing to submit right now"
            description="Once the hooks are added, this area can show loading, empty, and error states driven by live data."
            buttonLabel="Explore Portal"
          />
        </div>
      </main>
    </div>
  );
}

export default StudentPortal;
