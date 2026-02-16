import { ProjectView } from "@/components/dashboard/ProjectView";
import { Suspense } from "react";

export const metadata = {
  title: "Projects | FlowBoard",
  description: "Manage your active project modules and objectives.",
};

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center opacity-50">Loading Project Engine...</div>}>
      <ProjectView />
    </Suspense>
  );
}
