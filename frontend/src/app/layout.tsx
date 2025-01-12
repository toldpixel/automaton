import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ScrapeResultProvider } from "@/context/ScrapeResultContext";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={roboto.className}>
        <ScrapeResultProvider>
          <div className="bg-black">{children}</div>
        </ScrapeResultProvider>
      </body>
    </html>
  );
}
