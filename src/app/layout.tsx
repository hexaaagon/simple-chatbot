import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";

import ThemeProvider from "@/components/ThemeProvider";
import TrpcProvider from "@/lib/trpc/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Chatbot",
  description: "Simple AI Chatbot for sure.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <TrpcProvider cookies={cookieStore.toString()}>
          <ThemeProvider>{children}</ThemeProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}
