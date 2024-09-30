import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `https://bill-e.org/auth/new-verification?token=${token}`;
  await resend.emails.send({
    from: "no-reply@bill-e.org",
    to: email,
    subject: "Confirm your email",
    react: EmailTemplate({ confirmLink }),
  });
};
