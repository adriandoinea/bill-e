import Link from "next/link";
import { Plus } from "lucide-react";

export default function CreateTransaction({
  type,
}: {
  type: "expense" | "income";
}) {
  return (
    <Link
      href={`/${type}s/create`}
      className="flex h-10 items-center bg-customAccent text-secondary py-2 px-4 rounded-lg hover:bg-customAccent-foreground transition duration-300"
    >
      <span className="hidden md:block">Create {type}</span>{" "}
      <Plus className="h-5 md:ml-4" />
    </Link>
  );
}
