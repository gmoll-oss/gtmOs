import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryProvider } from "@/lib/queryClient";
import "./globals.css";

export const metadata: Metadata = {
  title: "GTM Cockpit - Fideltour",
  description: "GTM Cockpit for Fideltour - B2B SaaS lead generation and enrichment platform for the hospitality industry",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
