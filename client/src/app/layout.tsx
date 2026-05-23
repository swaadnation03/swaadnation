"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WebsiteSettingsProvider, useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import Providers from "./providers";
import Script from "next/script";
import { defaultSeoConfig } from "@/config/seo.config";
import ScrollToTop from "@/components/ScrollToTop";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Note: metadata can't be used in "use client" components
// So we'll move the actual layout to a separate client component

function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const settings = useWebsiteSettings();
  
  return (
    <div style={{ backgroundColor: settings.bodyBackgroundColor, minHeight: "100vh" }}>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2E7D32" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <Providers>
          <WebsiteSettingsProvider>
            <RootLayoutClient>
              {children}
            </RootLayoutClient>
          </WebsiteSettingsProvider>
        </Providers>

        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
            `,
          }}
        />

        {/* Facebook Pixel - Disabled: Invalid Pixel ID. Configure NEXT_PUBLIC_FB_PIXEL_ID env var to enable */}

        <ScrollToTop />
      </body>
    </html>
  );
}