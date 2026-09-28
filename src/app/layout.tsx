import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SHOP } from "@/lib/site";

const inter = Inter({
  subsets: ["latin", "latin-ext", "greek"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SHOP.name} — Συνεργείο Αυτοκινήτων | ${SHOP.city}`,
    template: `%s | ${SHOP.name}`,
  },
  description:
    "Bosch Car Service στην πόλη σας. Κλείστε online ραντεβού για service, φρένα, λάδια, ΚΤΕΟ και διάγνωση βλαβών.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="el" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
