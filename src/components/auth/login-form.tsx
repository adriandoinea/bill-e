"use client";

import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import { login } from "@/app/actions/accountActions";
import { ArrowRightIcon, Key, MailWarning, Github } from "lucide-react";
import Link from "next/link";
import { signIn as clientSideSignIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSearchParams } from "next/navigation";
import ErrorMessage from "@/components/auth/error-message";

export default function LoginForm() {
  const [formState, formAction] = useFormState(login, undefined);
  const searchParams = useSearchParams();
  const urlErrorMessage =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with another provider."
      : "";

  const handleSocialClick = (provider: "github" | "google") => {
    clientSideSignIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  const handleLoginForTesting = () => {
    clientSideSignIn("credentials", {
      email: "devtestacc010@gmail.com",
      password: "aVeryStrongPassword",
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <form
      action={formAction}
      className="h-full flex justify-center items-center"
    >
      <div className="w-full max-w-sm rounded-lg bg-accent shadow-md px-8 py-10">
        <h1 className="mb-6 text-3xl font-semibold">Welcome</h1>
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
          Log in <ArrowRightIcon className="ml-auto size-5" />
        </Button>

        <div className="mt-4 relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-accent px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="mt-4 w-full border border-border hover:bg-accent-foreground/10 transition duration-300"
          onClick={() => handleSocialClick("github")}
        >
          <Github className="mr-2 size-4" />
          GitHub
        </Button>

        {formState?.errors ? (
          <ErrorMessage message={formState.message} />
        ) : urlErrorMessage ? (
          <ErrorMessage message={urlErrorMessage} />
        ) : null}

        <div className="mt-6 text-sm text-center">
          Don&rsquo;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-customAccent-foreground hover:underline"
          >
            Sign up
          </Link>
        </div>

        <Button
          type="button"
          variant="link"
          className="mt-4 w-full text-sm text-muted-foreground hover:text-customAccent-foreground transition duration-300"
          onClick={handleLoginForTesting}
        >
          Test the app without an account
        </Button>
      </div>
    </form>
  );
}
