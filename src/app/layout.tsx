import type { Metadata } from "next";
import { Space_Mono, VT323 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { AuthProvider } from "@/components/auth-provider";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-retro",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fpp Business",
  description: "Aplikasi perencanaan keuangan untuk UMKM",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceMono.variable} ${vt323.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
