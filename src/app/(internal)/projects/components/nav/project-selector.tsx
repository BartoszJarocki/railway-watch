'use client';

import { cn } from '@/lib/utils';
import { useQueryState, parseAsString } from 'nuqs';

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

const ProjectItem = (props: {
  project: FragmentType<typeof ProjectFragment>;
  onProjectIdSelected: (projectId: string) => void;
  selectedProjectId: string;
}) => {
  const project = useFragment(ProjectFragment, props.project);

  return (
    <CommandItem
      key={project.id}
      onSelect={() => {
        props.onProjectIdSelected(project.id);
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
  const defaultProjectId = query.projects.edges[0]?.node.id;
  const [selectedProjectId, setSelectedProjectId] = useQueryState(
    'projectId',
    parseAsString.withDefault(defaultProjectId).withOptions({
      clearOnDefault: false,
    })
  );

  const selectedProject = query.projects.edges.find(
    ({ node }) => node.id === selectedProjectId
  )?.node;
  if (!selectedProject) {
    return <div>Selected project does not exist.</div>;
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
                onProjectIdSelected={(projectId) => {
                  setSelectedProjectId(projectId);
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
