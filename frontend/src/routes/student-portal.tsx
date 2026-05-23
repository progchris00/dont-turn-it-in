import { createFileRoute } from "@tanstack/react-router";

import StudentPortal from "@/components/StudentPortal/StudentPortal";

export const Route = createFileRoute("/student-portal")({
  component: StudentPortal,
  head: () => ({
    meta: [
      {
        title: "Student Portal - Don't Turn it in",
      },
    ],
  }),
});
