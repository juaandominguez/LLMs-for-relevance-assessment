import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast'
import { SidebarProvider } from "@/components/ui/sidebar"

import { Inter } from 'next/font/google';
import { AppSidebar } from "@/components/sidebar";

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
        <SidebarProvider defaultOpen={false} style={{
          "--sidebar-width": "25rem",
          "--sidebar-width-mobile": "20rem",
        } as React.CSSProperties}>
          <AppSidebar />
          <main className="bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] h-full w-full">
            {children}
          </main>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
