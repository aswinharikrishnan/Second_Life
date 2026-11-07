import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SecondLife — Used Smartphone Valuation",
  description:
    "ML-powered resale price prediction for used smartphones. Supporting UN SDG 12.5 — Reduce, Reuse, Recycle.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
