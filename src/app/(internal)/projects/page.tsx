"use client";

import { ErrorScreen } from "@/components/error-screen";
import { useProjectParams } from "@/hooks/use-project-params";
import { ProjectsQuery } from "@/lib/network/gql/graphql";
import { useProjects } from "@/lib/network/railway";

import { NavProjectsSelector } from "./components/nav/nav-projects-selector";
import { NavProjectsSelectorSkeleton } from "./components/nav/nav-projects-selector-skeleton";
import { ProjectDashboard } from "./components/project/project-dashboard";
import { ProjectLayout } from "./components/project/project-layout";
import { ProjectLoadingSkeleton } from "./components/project/project-loading-skeleton";
import { ProjectNotFound } from "./components/project/project-not-found";

interface ProjectsProps {
  query: ProjectsQuery;
}

/**
 * Projects component handles the display of project data
 * and selection of current project
 */
const Projects = ({ query }: ProjectsProps) => {
  const [{ projectId }] = useProjectParams();
  const allProjects = query.projects.edges.map(({ node }) => node);

  const currentProject = projectId
    ? allProjects.find((project) => project.id === projectId)
    : allProjects[0];

  if (!currentProject) {
    return <ProjectNotFound projectId={projectId} />;
  }

  return <ProjectDashboard project={currentProject} />;
};

/**
 * Constants for pagination
 */
const PROJECTS_PER_PAGE = 10;

/**
 * Main page component that handles data fetching and rendering states
 */
export default function Page() {
  const { data, isLoading, error } = useProjects({ first: PROJECTS_PER_PAGE });

  if (error) {
    return <ErrorScreen error={error} />;
  }

  if (isLoading) {
    return (
      <ProjectLayout navContent={<NavProjectsSelectorSkeleton />}>
        <ProjectLoadingSkeleton />
      </ProjectLayout>
    );
  }

  if (!data?.projects.edges.length) {
    return <ProjectLayout>No projects available</ProjectLayout>;
  }

  return (
    <ProjectLayout navContent={<NavProjectsSelector query={data} />}>
      <Projects query={data} />
    </ProjectLayout>
  );
}
