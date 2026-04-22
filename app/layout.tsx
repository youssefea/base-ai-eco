import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase,
  title: "Base AI Ecosystem",
  description:
    "Explore the Base AI ecosystem — an interactive 3D galaxy of protocols, wallets, inference, and DeFi projects building on Base.",
  openGraph: {
    title: "Base AI Ecosystem",
    description: "Interactive 3D galaxy of projects building on Base.",
    images: [{ url: "/ecosystem-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base AI Ecosystem",
    description: "Interactive 3D galaxy of projects building on Base.",
    images: ["/ecosystem-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="h-full" style={{ margin: 0, padding: 0, background: "#00020f" }}>
        {children}
      </body>
    </html>
  );
}
