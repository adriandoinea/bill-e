import LoginForm from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in",
};

export default async function Page() {
  return <LoginForm />;
}
