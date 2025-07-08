import type { Metadata, Viewport } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Loader from "@/components/Loader";
import { Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import PWAProvider from '@/components/PWAProvider';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Future Me - Your Path to a Better Future",
  description: "Your Path to a Better Future Starts Here",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/android/android-launchericon-192-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/android/android-launchericon-512-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/ios/180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Future Me",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${firaCode.variable} antialiased bg-gray-50`}
      >
        <PWAProvider>
          <Suspense fallback={<Loader />}>
            <AuthProvider>{children}</AuthProvider>
          </Suspense>
        </PWAProvider>
      </body>
    </html>
  );
}