import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gamenightza.com"),
  title: {
    default: "Game Night ZA",
    template: "%s | Game Night ZA",
  },
  description:
    "Host-controlled party games for TikTok Live and shared-screen game nights. Play seven team games without player accounts.",
  applicationName: "Game Night ZA",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Game Night ZA",
    title: "Game Night ZA",
    description:
      "Seven host-controlled team games built for TikTok Live and shared screens.",
  },
  twitter: {
    card: "summary",
    title: "Game Night ZA",
    description:
      "Seven host-controlled team games built for TikTok Live and shared screens.",
  },
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
