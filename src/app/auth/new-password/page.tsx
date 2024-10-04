import NewPasswordForm from "@/components/auth/new-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Password",
};

export default function Page() {
  return <NewPasswordForm />;
}
