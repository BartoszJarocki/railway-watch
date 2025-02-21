'use client';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useFragment, FragmentType } from '@/lib/network/gql';
import { ProjectFragment } from '../lib/network/operations';
import { ProjectsQuery } from '../lib/network/gql/graphql';
import Link from 'next/link';

const ProjectNavItem = (props: {
  project: FragmentType<typeof ProjectFragment>;
}) => {
  const project = useFragment(ProjectFragment, props.project);

  return (
    <SidebarMenuButton asChild>
      <Link href={`/projects/${project.id}`}>{project.name}</Link>
    </SidebarMenuButton>
  );
};

export function NavProjects({ query }: { query: ProjectsQuery }) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {query.projects.edges.map((item) => {
          return (
            <SidebarMenuItem key={item.node.id}>
              <ProjectNavItem project={item.node} />
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
