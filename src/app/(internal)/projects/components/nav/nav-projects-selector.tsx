'use client';

import { cn } from '@/lib/utils';

import { ChevronsUpDown, Check } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

import { FragmentType, useFragment } from '@/lib/network/gql';
import { ProjectsQuery } from '@/lib/network/gql/graphql';
import { ProjectFragment } from '@/lib/network/operations';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProjectParams } from '../../../../../hooks/use-project-params';

const ProjectItem = (props: {
  project: FragmentType<typeof ProjectFragment>;
  onProjectSelected: (projectId: string) => void;
  selectedProjectId: string;
}) => {
  const project = useFragment(ProjectFragment, props.project);
  const projectId = project.id;

  return (
    <CommandItem
      key={project.id}
      onSelect={() => {
        props.onProjectSelected(projectId);
      }}
      className="text-sm font-mono"
    >
      <Avatar className="mr-2 h-5 w-5">
        <AvatarImage
          src={`https://avatar.vercel.sh/${project.name}.png`}
          alt={project.name}
          className="grayscale"
        />
        <AvatarFallback>{project.name[0]}</AvatarFallback>
      </Avatar>
      {project.name}
      <Check
        className={cn(
          'ml-auto',
          props.selectedProjectId === project.id ? 'opacity-100' : 'opacity-0'
        )}
      />
    </CommandItem>
  );
};

export const NavProjectsSelector = ({ query }: { query: ProjectsQuery }) => {
  const [open, setOpen] = React.useState(false);

  const defaultProject = query.projects.edges[0].node;
  const [projectParams, setProjectParams] = useProjectParams({
    defaultProjectId: defaultProject.id,
  });
  const selectedProject = query.projects.edges.find(
    ({ node }) => node.id === projectParams.projectId
  )?.node;

  if (!selectedProject) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a project"
          className={cn('w-[200px] justify-between')}
        >
          <Avatar className="mr-2 h-5 w-5">
            <AvatarImage
              src={`https://avatar.vercel.sh/${selectedProject.name}.png`}
              alt={selectedProject.name}
              className="grayscale"
            />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          {selectedProject.name}
          <ChevronsUpDown className="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandList className="p-1">
            <CommandEmpty>No projects found.</CommandEmpty>

            {query.projects.edges.map(({ node }) => (
              <ProjectItem
                key={node.id}
                project={node}
                onProjectSelected={(projectId) => {
                  setProjectParams({ projectId, environmentId: null });
                  setOpen(false);
                }}
                selectedProjectId={selectedProject.id}
              />
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
