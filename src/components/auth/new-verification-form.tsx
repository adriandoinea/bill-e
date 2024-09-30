"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/app/actions/accountActions";
import { ErrorMessage, SuccessMessage } from "./form-messages";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewVerificationForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (!token) {
      setError("Missing token!");
      setIsLoading(false);
      return;
    }

    try {
      const data = await newVerification(token);
      if (data.errors) {
        setError(data.message);
      } else {
        setSuccess(data.message);
      }
    } catch (e) {
      setError("Something went wrong!");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="h-full flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-center">
            {isLoading
              ? "Verification in Progress"
              : success
              ? "Verification Successful"
              : "Verification Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <>
              <div className="flex justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
              <p className="text-center text-muted-foreground">
                Confirming your verification...
              </p>
            </>
          ) : success ? (
            <SuccessMessage
              message={success}
              className="flex items-center justify-center"
            />
          ) : (
            error && (
              <ErrorMessage
                message={error}
                className="flex items-center justify-center"
              />
            )
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {!isLoading && (
            <Button asChild variant="link">
              <Link href="/login">Back to Login</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
