"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy } from "lucide-react";
import { Toaster, toast } from "sonner";

import { LogoDark } from "./brand/logo-dark";

interface Props {
  error: Error;
}

function formatCause(cause: unknown): string {
  if (typeof cause === "string") {
    return cause;
  } else if (cause instanceof Error) {
    return cause.message;
  } else if (typeof cause === "object" && cause !== null) {
    return JSON.stringify(cause);
  }
  return String(cause);
}

export function ErrorScreen({ error }: Props) {
  const copyToClipboard = async () => {
    try {
      const textToCopy = `
        Error: ${error.name}
        Message: ${error.message}
        ${error.cause ? `Cause: ${formatCause(error.cause)}\n` : ""}
        ${error.stack ? `Stack: ${error.stack}` : ""}
      `.trim();
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Error details copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy error details");
    }
  };

  const causeText = error.cause ? formatCause(error.cause) : null;

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Toaster position="top-center" />
      <div className="mb-8">
        <LogoDark className="h-12 w-auto" />
      </div>
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-4 text-destructive">
            <span className="text-3xl font-bold">{error.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Message</h2>
            <p className="bg-muted p-4 rounded-md font-mono text-xs">
              {error.message}
            </p>
          </div>
          {causeText && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Cause</h2>
              <p className="bg-muted p-4 rounded-md font-mono text-xs">
                {causeText}
              </p>
            </div>
          )}
          {error.stack && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Stack Trace</h2>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-xs">
                {error.stack}
              </pre>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            If this error persists, please{" "}
            <a
              href="mailto:support@example.com"
              className="text-primary hover:underline"
            >
              contact support
            </a>
            .
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy Error Details
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
