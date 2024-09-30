import { cn } from "@/lib/utils";
import { CheckCircle2Icon, MailWarning } from "lucide-react";

interface Props {
  message: string;
  className?: string;
}
export function ErrorMessage({ message, className }: Props) {
  return (
    <div
      className={cn(
        "mt-4 flex items-center space-x-2 text-destructive",
        className
      )}
    >
      <MailWarning className="size-5" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function SuccessMessage({ message, className }: Props) {
  return (
    <div
      className={cn(
        "mt-4 flex items-center space-x-2 text-green-500",
        className
      )}
    >
      <CheckCircle2Icon className="size-5" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
