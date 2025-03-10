import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cinemelon | Your Personal Movie Companion",
  description: "Watch your favorite movies online",
  keywords: ["movies", "film recommendations", "mood-based movies", "cinema", "entertainment"],
  authors: [{ name: "Cinemelon Team" }],
  creator: "Kel Kel",
  publisher: "Cinemelon",
  robots: "index, follow",
  metadataBase: new URL('https://cinemelon.vercel.app'), // Replace with your actual domain
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cinemelon.vercel.app",
    title: "Cinemelon | Your Personal Movie Companion",
    description: "Find the perfect film that resonates with your mood and elevates your moment.",
    siteName: "Cinemelon",
    images: [
      {
        url: "https://cinemelon.vercel.app/images/cinemelon-project-image.png",
        width: 1200,
        height: 630,
        alt: "Cinemelon - Movie Recommendation Platform",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cinemelon | Your Personal Movie Companion",
    description: "Find the perfect film that resonates with your mood and elevates your moment.",
    creator: "@cinemelon",
    images: ["https://cinemelon.vercel.app/images/cinemelon-project-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
    other: [
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "/favicon.svg",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon.svg",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon.svg",
      },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
