"use client";

import { Nav } from "../nav/nav";

interface LayoutProps {
  children: React.ReactNode;
  navContent?: React.ReactNode;
}

export const ProjectLayout = ({ children, navContent }: LayoutProps) => (
  <main className="w-full h-full">
    <Nav className="h-16 m-4">{navContent}</Nav>
    <div className="pt-20">
      <div className="container mx-auto p-3 md:p-6">{children}</div>
    </div>
  </main>
);
