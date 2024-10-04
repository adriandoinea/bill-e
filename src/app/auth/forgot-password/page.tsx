import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default async function Page() {
  return <ForgotPasswordForm />;
}
