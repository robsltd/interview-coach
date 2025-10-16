import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { cn } from "@/utils";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { InterviewProvider } from "@/context/InterviewContext"; // Import the provider

export const metadata: Metadata = {
  title: "interview-coach",
  description: "interview-coach description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          "flex flex-col min-h-screen"
        )}
      >
        <InterviewProvider> {/* Add the provider */}
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Nav />
            {children}
            <Toaster position="top-center" richColors={true} />
          </ThemeProvider>
        </InterviewProvider>
      </body>
    </html>
  );
}