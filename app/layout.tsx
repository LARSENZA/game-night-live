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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Game Night ZA — seven team games built for live streams",
      },
    ],
    type: "website",
    url: "/",
    siteName: "Game Night ZA",
    title: "Game Night ZA",
    description:
      "Seven host-controlled team games built for TikTok Live and shared screens.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Night ZA",
    description:
      "Seven host-controlled team games built for TikTok Live and shared screens.",
    images: ["/og-image.png"],
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
