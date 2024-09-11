import { MailWarning } from "lucide-react";

interface Props {
  message: string;
}
export default function ErrorMessage({ message }: Props) {
  return (
    <div className="mt-4 flex items-center space-x-2 text-destructive">
      <MailWarning className="size-5" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
