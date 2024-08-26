"use client"; // Add this line at the top

import { Inter } from "next/font/google";
import "./globals.css";
import Appbar from "@/components/ui/appbar";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // Use usePathname to get the current path
  const noAppBarPages = ["/login", "/signup"];

  // Ensure pathname is not null before checking includes
  const showAppBar = pathname !== null && !noAppBarPages.includes(pathname);

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {showAppBar && <Appbar />}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
