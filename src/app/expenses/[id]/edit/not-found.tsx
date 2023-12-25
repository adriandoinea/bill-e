import { Frown } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <Frown className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find the requested expense.</p>
      <Link
        href="/expenses"
        className="mt-4 rounded-md bg-customAccent px-4 py-2 text-sm text-secondary transition duration-300 hover:bg-customAccent-foreground"
      >
        Go Back
      </Link>
    </main>
  );
}
