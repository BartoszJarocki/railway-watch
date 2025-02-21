'use client';

import { ExternalLink } from 'lucide-react';

import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const RESOURCES = {
  DOCS: {
    link: 'https://docs.railway.com',
    title: 'Railway documentation',
  },
  BLOG: {
    link: 'https://blog.railway.com',
    title: 'Railway Blog',
  },
  SUPPORT: {
    link: 'https://help.railway.com',
    title: 'Support Center',
  },
} as const;

export function NavResources() {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarGroupLabel>Resources</SidebarGroupLabel>
      {Object.entries(RESOURCES).map(([key, resource]) => {
        return (
          <SidebarMenuItem key={key}>
            <SidebarMenuButton>
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!isMobile && (
                      <span className="truncate text-xs">{resource.title}</span>
                    )}
                  </div>
                  <ExternalLink className={cn('h-4 w-4 shrink-0 ml-auto')} />
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
