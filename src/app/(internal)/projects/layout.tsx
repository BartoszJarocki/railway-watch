'use client';
import { useProjects } from '@/lib/network/railway';
import React from 'react';

import { NavProjectsSelectorSkeleton } from './components/nav/nav-projects-selector-skeleton';
import { NavProjectsSelector } from './components/nav/nav-projects-selector';
import { Nav } from './components/nav/nav';
import { ErrorScreen } from '../../../components/error-screen';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error } = useProjects({ first: 10 });

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <main className="w-full h-full">
      <Nav className="h-16 m-4">
        {isLoading ? <NavProjectsSelectorSkeleton /> : null}
        {data ? <NavProjectsSelector query={data} /> : null}
      </Nav>

      <div className="pt-20">
        <div className="container mx-auto p-3 md:p-6">{children}</div>
      </div>
    </main>
  );
}
