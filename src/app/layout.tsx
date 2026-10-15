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
        {/* WEBA demo notice: this demo and its content belong to WEBA (webaservices.com/terms.html) */}
        <p
          style={{ margin: 0, padding: "14px 76px", background: "#05070d", color: "#9fb3c8", font: "12px/1.6 system-ui, sans-serif", textAlign: "center", borderTop: "1px solid rgba(142,229,255,.18)" }}
        >
          Demo ιστοσελίδα από τη{" "}
          <a href="https://webaservices.com" style={{ color: "#8ee5ff", fontWeight: 700 }}>WEBA</a>
          {" "}· © 2026 WEBA · Με την επιφύλαξη παντός δικαιώματος. Απαγορεύεται η αντιγραφή ή η επαναχρησιμοποίηση χωρίς γραπτή άδεια.
        </p>
      </body>
    </html>
  );
}
