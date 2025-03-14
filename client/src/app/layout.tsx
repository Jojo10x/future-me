import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Loader from "@/components/Loader";
import { Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import Head from "next/head";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Future Me",
  description: "Your Path to a Better Future Starts Here.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="client/public/logo--text----future-me.svg" />
      </Head>
      <body
        className={`${inter.variable} ${firaCode.variable} antialiased bg-gray-50 `}
      >
        <Suspense fallback={<Loader />}>
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
