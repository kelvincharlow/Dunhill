import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dunhill Building Contractors | Building Excellence",
  description: "Dunhill Building Contractors delivers building construction, civil engineering and industrial projects across Kenya.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#101820" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth" className={`${manrope.variable} ${cormorant.variable}`}><body>{children}</body></html>;
}
