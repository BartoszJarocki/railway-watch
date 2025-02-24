'use client';

import { cn } from '@/lib/utils';

import { ChevronsUpDown, Check } from 'lucide-react';
import React, { useCallback } from 'react';
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
import { useSearchParams, useRouter } from 'next/navigation';

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

export const ProjectSelector = ({ query }: { query: ProjectsQuery }) => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const projectId = searchParams.get('projectId');
  const defaultProject = query.projects.edges[0].node;

  const setProjectId = useCallback(
    (projectId: string) => {
      const params = new URLSearchParams();
      params.set('projectId', projectId);
      router.push(`?${params.toString()}`);
    },
    [router]
  );

  // Handle initial state
  React.useEffect(() => {
    if (!projectId) {
      setProjectId(defaultProject.id);
    }
  }, [defaultProject, projectId]);

  const selectedProject = query.projects.edges.find(
    ({ node }) => node.id === projectId
  )?.node;

  if (!selectedProject) {
    return <div>Loading...</div>;
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
          <CommandInput placeholder="Search team..." />
          <CommandList className="p-1">
            <CommandEmpty>No projects found.</CommandEmpty>

            {query.projects.edges.map(({ node }) => (
              <ProjectItem
                key={node.id}
                project={node}
                onProjectSelected={(projectId) => {
                  setProjectId(projectId);
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
