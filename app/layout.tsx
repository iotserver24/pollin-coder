import type { Metadata } from "next";
import PlausibleProvider from "next-plausible";
import "./globals.css";

let title = "Pollin Coder – AI Code Generator by R3AP3R editz";
let description = "Generate your next app with Pollin Coder";
let url = "https://polli-coder.megavault.in/";
let ogimage = "https://polli-coder.megavault.in/og-image.png";
let sitename = "polli-coder.megavault.in";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <PlausibleProvider domain="polli-coder.megavault.in" />
      </head>

      {children}
    </html>
  );
}
