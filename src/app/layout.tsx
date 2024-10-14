import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: { template: "Bill-e | %s", default: "Bill-e" },
  description: "Expense tracker",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <body className="h-svh">
        <SessionProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="system">
            <div className="h-full flex flex-col text-sm sm:flex-row sm:text-base">
              <Sidebar />
              <main className="h-full w-full flex-grow p-6 overflow-y-auto sm:p-12 2xl:px-28">
                {children}
              </main>
              <Toaster duration={3000} />
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
