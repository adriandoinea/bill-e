import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="w-full max-w-sm rounded-lg bg-accent shadow-md px-8 py-10">
        <div className="flex flex-col items-center">
          <AlertTriangle className="text-destructive size-16 mb-6" />
          <h1 className="mb-2 text-3xl font-semibold">Oops!</h1>
          <p className="mb-6 text-center text-muted-foreground">
            An unexpected error occurred.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href={"/auth/login"}
            className="w-full rounded-md py-3 bg-customAccent hover:bg-customAccent-foreground text-secondary flex items-center justify-center gap-1"
          >
            <ArrowLeft className="mr-2 size-4" />
            Go To Login
          </Link>
        </div>
      </div>
    </div>
  );
}
