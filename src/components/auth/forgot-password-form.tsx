"use client";

import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import { reset } from "@/app/actions/accountActions";
import { ArrowRightIcon, Mail } from "lucide-react";
import Link from "next/link";
import { ErrorMessage, SuccessMessage } from "./form-messages";

export default function ForgotPasswordForm() {
  const [formState, formAction] = useFormState(reset, undefined);

  return (
    <form
      action={formAction}
      className="h-full flex justify-center items-center"
    >
      <div className="w-full max-w-sm rounded-lg bg-accent shadow-md px-8 py-10">
        <h1 className="mb-6 text-3xl font-semibold">Forgot password</h1>
        <div className="w-full space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-border py-2 pl-12 pr-3 text-sm placeholder-gray-400"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2" />
            </div>
          </div>
        </div>

        <Button className="mt-6 w-full bg-customAccent hover:bg-customAccent-foreground transition duration-300">
          Send reset password link <ArrowRightIcon className="ml-auto size-5" />
        </Button>
        {formState?.errors ? (
          <ErrorMessage message={formState.message} />
        ) : (
          formState?.message && <SuccessMessage message={formState.message} />
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
