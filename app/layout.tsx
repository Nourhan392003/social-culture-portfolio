import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Social Culture",
  description: "شريكك الرقمي المتكامل",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans bg-black`}>
        {children}

        {/* 🔥 Toast System */}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#0f2a1f",
              color: "#00ff88",
              border: "1px solid #00ff88",
              borderRadius: "12px",
              padding: "12px 18px",
              fontWeight: "600",
            },
            success: {
              iconTheme: {
                primary: "#00ff88",
                secondary: "#0f2a1f",
              },
            },
            error: {
              iconTheme: {
                primary: "#ff4d4d",
                secondary: "#0f2a1f",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
