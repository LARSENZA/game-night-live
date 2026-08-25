import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Game Night ZA",
  description: "A real-time, host-controlled team game built for TikTok Live.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
