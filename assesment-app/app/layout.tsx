import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast'

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Relevance Assessment",
  description: "Perform relevance assessments on topics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <main className="bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
