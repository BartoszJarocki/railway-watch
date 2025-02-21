'use client';

import { useEnvCheck } from '@/lib/network/env/use-env-check';
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { LogoDark } from '../components/brand/logo-dark';
import { Code } from '@/components/code';
import { Badge } from '@/components/ui/badge';
import { cn } from '../lib/utils';
import React from 'react';
import { RAILWAY_LINKS } from '../lib/data/links';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { useIsLocalEnvironment } from '../hooks/use-is-local-env';

const RAILWAY_API_TOKEN_ENV_VARIABLE = 'RAILWAY_API_TOKEN';

export default function Page() {
  const { data, error, isLoading } = useEnvCheck({
    variableName: RAILWAY_API_TOKEN_ENV_VARIABLE,
    refetchInterval: 5000,
  });
  const isLocalEnv = useIsLocalEnvironment();

  const renderStatus = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse" />
          <p>Checking status...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center gap-2 text-red-500">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <p>
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      );
    }

    if (!data) return null;

    return (
      <>
        <div className="flex items-center justify-center gap-6">
          <span className="relative inline-flex">
            <div className="inline-flex items-center leading-6 font-semibold transition duration-150 ease-in-out">
              <Code>{RAILWAY_API_TOKEN_ENV_VARIABLE}</Code>
            </div>
            <span className="absolute top-0 right-0 -mt-1 -mr-0.5 flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-muted-foreground opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-muted-foreground"></span>
            </span>
          </span>

          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                className={cn(
                  `text-xs ${data.exists ? 'bg-green-500' : 'bg-red-500'}`
                )}
              >
                {data.exists ? 'Configured' : 'Not set'}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs font-mono">
                Last checked:{' '}
                <span className="tabular-nums">
                  {new Date(data.timestamp).toLocaleTimeString()}
                </span>
              </p>
            </TooltipContent>
          </Tooltip>

          <a
            className="text-xs text-foreground"
            href={RAILWAY_LINKS.CREATE_TOKEN_PAGE}
            target="_blank"
          >
            How to create a token?
          </a>
        </div>
      </>
    );
  };

  return (
    <div className="w-full h-full flex">
      <Card
        className={`m-auto p-6 rounded-lg border border-border max-w-lg`}
        role="status"
        aria-live="polite"
      >
        <CardHeader className="mx-auto flex flex-col items-center gap-2">
          <a href={RAILWAY_LINKS.MARKETING_PAGE} target="_blank">
            <LogoDark className="w-8 h-8" />
          </a>
          <h2 className="text-lg font-semibold">Railway Monitor</h2>
        </CardHeader>
        <CardDescription className="text-center text-pretty">
          Railway monitor requires the following environment variables to be
          set.{' '}
          <a href={RAILWAY_LINKS.ENV_VARIABLES_PAGE} target="_blank">
            You can learn how to set environemt variables in Railway here.
          </a>
          {isLocalEnv ? (
            <div className="mt-6 bg-muted rounded-md px-3 py-2 text-xs text-muted-foreground text-pretty">
              On local environment, you can set the environment variables by
              creating <Code className="px-0">.env</Code> or{' '}
              <Code className="px-0">.env.local</Code> file in the root of your
              project.
            </div>
          ) : null}
        </CardDescription>
        <CardContent>{renderStatus()}</CardContent>
      </Card>
    </div>
  );
}
