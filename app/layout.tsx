import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  title: "NutriAI — Predictive Health Intelligence",
  description: "AI-powered nutrition tracking with predictive health insights, mood intelligence, and smart meal planning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          <TopNav />
          <main className="page-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
