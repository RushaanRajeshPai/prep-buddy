import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "PrepBuddy — Find your voice", template: "%s | PrepBuddy" },
  description: "A space for students and job aspirants to prepare for interviews and group discussions. Explore the practice paths coming to PrepBuddy.",
};
export const viewport: Viewport = { themeColor: "#f8f7f2", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a href="#main-content" className="skip-link">Skip to content</a><Navbar />{children}<Footer /></body></html>;
}
