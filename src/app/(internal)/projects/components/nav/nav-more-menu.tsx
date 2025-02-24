"use client";

import { EllipsisIcon, ExternalLinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "../../../../../lib/utils";

const RESOURCES = {
  DOCS: {
    link: "https://docs.railway.com",
    title: "Railway documentation",
  },
  BLOG: {
    link: "https://blog.railway.com",
    title: "Railway Blog",
  },
  SUPPORT: {
    link: "https://help.railway.com",
    title: "Support Center",
  },
} as const;

export function NavMoreMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 font-mono text-xs"
        align="end"
        alignOffset={4}
      >
        <DropdownMenuLabel>Links</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {Object.entries(RESOURCES).map(([key, resource]) => {
            return (
              <DropdownMenuItem key={key}>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-xs">{resource.title}</span>
                    </div>
                    <ExternalLinkIcon
                      className={cn("h-4 w-4 shrink-0 ml-auto")}
                    />
                  </div>
                </a>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
