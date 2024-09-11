"use client";

import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import { register } from "@/app/actions/accountActions";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  Key,
  MailWarning,
} from "lucide-react";
import Link from "next/link";
import ErrorMessage from "@/components/auth/error-message";

export default function RegisterForm() {
  const [formState, formAction] = useFormState(register, undefined);

  return (
    <form
      action={formAction}
      className="h-full flex justify-center items-center"
    >
      <div className="w-full max-w-sm rounded-lg bg-accent shadow-md px-8 py-10">
        <h1 className="mb-6 text-3xl font-semibold">Sign up</h1>
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
              <MailWarning className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium"
              htmlFor="password"
            >
              Password
            </label>
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
        </div>

        <Button className="mt-6 w-full bg-customAccent hover:bg-customAccent-foreground transition duration-300">
          Sign up <ArrowRightIcon className="ml-auto size-5" />
        </Button>

        {formState?.errors ? (
          <ErrorMessage message={formState.message} />
        ) : (
          formState?.message && (
            <div className="mt-4 flex items-center space-x-2 text-green-500">
              <CheckCircle2Icon className="size-5" />
              <p className="text-sm">{formState?.message}</p>
            </div>
          )
        )}

        <div className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-customAccent hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </form>
  );
}
