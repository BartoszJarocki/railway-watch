'use client';
import { useProjects } from '@/lib/network/railway';
import React from 'react';

import { NavMenu } from './components/nav/nav-menu';
import { ProjectSelectorSkeleton } from './components/nav/project-selector-skeleton';
import { ProjectSelector } from './components/nav/project-selector';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error } = useProjects({ first: 10 });

  return (
    <div className="divide-y">
      <header>
        <div className="h-16 container mx-auto px-3 md:px-6 flex items-center justify-between">
          {isLoading ? <ProjectSelectorSkeleton /> : null}
          {error ? <div>Error loading projects: {error.message}</div> : null}
          {data ? <ProjectSelector query={data} /> : null}

          <NavMenu />
        </div>
      </header>

      <div className="container mx-auto p-3 md:p-6">{children}</div>
    </div>
  );
}
