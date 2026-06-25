import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: "%s | ShopKart",
    default: "ShopKart - India's Best Online Shopping Platform",
  },
  description:
    "ShopKart offers the best deals on Electronics, Fashion, Home Appliances, Beauty, Books, Sports, Toys & more. Shop online with fast delivery and easy returns.",
  keywords: [
    "online shopping",
    "ecommerce",
    "electronics",
    "fashion",
    "ShopKart",
    "best deals",
    "india",
  ],
  authors: [{ name: "ShopKart" }],
  openGraph: {
    title: "ShopKart - India's Best Online Shopping Platform",
    description:
      "Shop millions of products at the best prices. Fast delivery, easy returns.",
    type: "website",
    locale: "en_IN",
    siteName: "ShopKart",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopKart - Online Shopping",
    description: "Best deals on all products",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-[#f1f3f6]">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
