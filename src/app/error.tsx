"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <AlertTriangle
            className="mx-auto h-12 w-12 text-yellow-400"
            aria-hidden="true"
          />
          <h2 className="mt-6 text-3xl font-extrabold">
            Oops! Something went wrong
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We apologize for the inconvenience. You can find more details below.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md bg-yellow-100 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Error details
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>{error.message || "An unexpected error occurred."}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              variant="secondary"
              className="w-full sm:w-40 order-1 sm:order-none"
              onClick={() => {
                router.back();
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Go back
            </Button>
            <Button
              onClick={() => reset()}
              className="group relative w-full sm:w-40"
              variant="custom"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <RotateCcw className="h-5 w-5" aria-hidden="true" />
              </span>
              Try again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
