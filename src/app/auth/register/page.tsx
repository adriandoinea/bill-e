import RegisterForm from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
};

export default async function Page() {
  return <RegisterForm />;
}
