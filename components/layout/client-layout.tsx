"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";

const inter = Inter({ 
  subsets: ["latin"], 
  display: "swap",
  variable: "--font-inter"
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname.startsWith("/studio");

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
      <div className="relative flex min-h-screen flex-col bg-background">
        {!isStudio && <Header />}
        <main className="flex-1 relative">{children}</main>
        {!isStudio && <Footer />}
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
