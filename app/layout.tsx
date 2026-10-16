import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

// viewport-fit=cover lets the page extend under phone notches; the navbar and chat button
// then offset themselves with env(safe-area-inset-*)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050505",
};

export const metadata: Metadata = {
  title: "Bhyresh BS | AI & ML Engineer",
  description: "Portfolio of Bhyresh BS - AI & Machine Learning Engineer",
  icons: {
    icon: "/media/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-tier="full"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["dark", "light"]}
          enableSystem={false}
          disableTransitionOnChange
        >
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
