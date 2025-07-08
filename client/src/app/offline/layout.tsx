// src/app/offline/layout.tsx
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: 'Offline - Future Me',
  description: 'You are currently offline',
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}