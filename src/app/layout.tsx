import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sawdesi — Ancient Wisdom, Modern Nourishment",
    template: "%s | Sawdesi",
  },
  description:
    "Premium Ayurvedic superfoods, A2 ghee, and traditional wellness products rooted in India's ancient wisdom. 100% natural, preservative-free, lab-certified.",
  keywords: [
    "ayurvedic products",
    "A2 ghee",
    "chyawanprash",
    "moringa",
    "ashwagandha",
    "natural supplements",
    "Indian superfoods",
    "organic wellness",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Sawdesi",
    title: "Sawdesi — Ancient Wisdom, Modern Nourishment",
    description:
      "Premium Ayurvedic superfoods and natural wellness products. From India's soil to your table.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sawdesi — Ancient Wisdom, Modern Nourishment",
    description: "Premium Ayurvedic superfoods and natural wellness products.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream font-sans">
        <Providers>
          <AnnouncementBar />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#FAF7F2",
                border: "1px solid #E8E0D5",
                color: "#1C1C1C",
                fontFamily: "var(--font-inter)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
