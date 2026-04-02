import type { Metadata } from "next";
import { Syne, DM_Sans, Inter } from "next/font/google";
import "./globals.css";

const syne = Syne({ 
  subsets: ["latin"],
  variable: "--font-syne",
  display: 'swap',
});

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ['400', '500', '700'],
  display: 'swap',
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Zarizo | Grow Sales. Expand Reach.",
  description: "Agent-first digital sales and distribution platform for African businesses and independent sales agents.",
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmSans.variable} ${inter.variable} font-inter bg-white text-brand-black antialiased`}>
        {children}
      </body>
    </html>
  );
}
