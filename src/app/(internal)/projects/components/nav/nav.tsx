import Link from "next/link";

import { LogoDark } from "../../../../../components/brand/logo-dark";
import { cn } from "../../../../../lib/utils";
import { NavMoreMenu } from "./nav-more-menu";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export const Nav = ({ className, children }: Props) => {
  return (
    <header className={cn("flex fixed inset-0 bg-background z-10", className)}>
      <nav className="container mx-auto px-3 md:px-6 flex items-center justify-between border border-border shadow-md rounded-lg">
        <Link href="/projects">
          <LogoDark className="size-8" />
        </Link>

        <div className="container mx-auto px-3 md:px-6 flex items-center justify-between">
          {children}
        </div>
        <NavMoreMenu />
      </nav>
    </header>
  );
};
