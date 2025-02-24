"use client";

import Link from "next/link";
import React from "react";

import { LogoDark } from "@/components/brand/logo-dark";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useIsLocalEnvironment } from "@/hooks/use-is-local-env";
import { RAILWAY_LINKS } from "@/lib/data/links";
import { useEnvCheck } from "@/lib/network/env/use-env-check";
import { cn } from "@/lib/utils";

import { EnvVariableStatusIndicator } from "./components/env-variable-status-indicator";
import { LocalEnvironmentNotice } from "./components/local-env-notice";

const RAILWAY_API_ACCOUNT_TOKEN_ENV_VARIABLE =
  "RAILWAY_API_ACCOUNT_TOKEN" as const;

export default function RailwayMonitorPage() {
  const { data, error, isLoading } = useEnvCheck({
    variableName: RAILWAY_API_ACCOUNT_TOKEN_ENV_VARIABLE,
    refetchInterval: 5000,
  });

  const isLocalEnv = useIsLocalEnvironment();
  const isDataAvailable = !isLoading && !error && data;
  const isApplicationReady = isDataAvailable && data.exists;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      <Card
        className="p-6 rounded-lg border border-border max-w-lg"
        role="status"
        aria-live="polite"
      >
        <CardTitle className="mx-auto flex flex-col items-center gap-2">
          <a
            href={RAILWAY_LINKS.MARKETING_PAGE}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Railway Website"
          >
            <LogoDark className="w-8 h-8" />
          </a>
          <h2 className="text-lg font-semibold">Railway Monitor</h2>
        </CardTitle>

        <CardDescription className="text-center text-pretty space-y-4 mt-4">
          <p>
            Railway monitor allows you to see all your Railway projects with
            their corresponding services and deployments. It also allows you to
            scale up or down your services.
          </p>

          <div>
            Railway monitor requires the following environment variables to be
            set.{" "}
            <a
              href={RAILWAY_LINKS.ENV_VARIABLES_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              You can learn how to set environemt variables in Railway here.
            </a>
            {isLocalEnv && <LocalEnvironmentNotice />}
          </div>
        </CardDescription>

        <CardContent>
          <EnvVariableStatusIndicator
            isLoading={isLoading}
            isApplicationReady={isApplicationReady}
            variableName={RAILWAY_API_ACCOUNT_TOKEN_ENV_VARIABLE}
          />
        </CardContent>
      </Card>

      <Button
        asChild
        className={cn(
          "px-6",
          !isApplicationReady &&
            "opacity-50 pointer-events-none cursor-not-allowed",
        )}
      >
        <Link
          href="/projects"
          aria-disabled={!isApplicationReady}
          tabIndex={!isApplicationReady ? -1 : undefined}
        >
          Go to dashboard
        </Link>
      </Button>
    </div>
  );
}
