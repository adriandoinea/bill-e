"use client";

import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import { newPassword } from "@/app/actions/accountActions";
import { ArrowRightIcon, Key } from "lucide-react";
import Link from "next/link";
import { ErrorMessage, SuccessMessage } from "./form-messages";
import { useSearchParams } from "next/navigation";

export default function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const newPasswordWithToken = newPassword.bind(null, token);
  const [formState, formAction] = useFormState(newPasswordWithToken, undefined);

  return (
    <form
      action={formAction}
      className="h-full flex justify-center items-center"
    >
      <div className="w-full max-w-sm rounded-lg bg-accent shadow-md px-8 py-10">
        <h1 className="mb-6 text-3xl font-semibold">Enter a new password</h1>
        <div className="w-full space-y-6">
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-border py-2 pl-12 pr-3 text-sm placeholder-gray-400"
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              minLength={6}
            />
            <Key className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2" />
          </div>
        </div>

        <Button className="mt-6 w-full bg-customAccent hover:bg-customAccent-foreground transition duration-300">
          Reset password <ArrowRightIcon className="ml-auto size-5" />
        </Button>
        {formState?.errors
          ? formState.errors.password?.map((message, i) => (
              <ErrorMessage key={`${message}-${i}`} message={message} />
            ))
          : formState?.message && (
              <SuccessMessage message={formState.message} />
            )}
        <div className="mt-6 text-sm text-center">
          <Link
            href="/auth/login"
            className="text-customAccent-foreground hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    </form>
  );
}
