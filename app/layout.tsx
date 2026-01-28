import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { EncryptionProvider } from "@/lib/encryption-context";
import EncryptedApp from "@/components/EncryptedApp";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "Clarity - Master ADHD Naturally",
  description: "AI-powered personal coach for managing ADHD through diet, exercise, and mindfulness",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Clarity',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}
      >
        <EncryptionProvider>
          <EncryptedApp>{children}</EncryptedApp>
        </EncryptionProvider>
      </body>
    </html>
  );
}
