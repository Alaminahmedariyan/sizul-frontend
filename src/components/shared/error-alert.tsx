import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ErrorAlert({ message }: { message?: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="size-4" />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>
        {message ?? "Please try again later."}
      </AlertDescription>
    </Alert>
  );
}
