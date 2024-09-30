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
import Link from "next/link";

export default function NewVerificationForm() {
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerification(token)
      .then((data) => {
        if (data.errors) {
          setError(data.message);
        } else {
          setSuccess(data.message);
        }
      })
      .catch((e) => {
        setError("Something went wrong!");
        console.error(e);
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="h-full flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-center">
            Verification in Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
          <div className="text-center space-y-2">
            {success ? (
              <SuccessMessage
                message={success}
                className="flex items-center justify-center"
              />
            ) : error ? (
              <ErrorMessage
                message={error}
                className="flex items-center justify-center"
              />
            ) : (
              <p className="text-muted-foreground">
                Confirming your verification ...
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
