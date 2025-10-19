import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { P2PProvider } from "@/components/providers/P2PProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VYNRYX - Decentralized Freelance Platform",
  description: "Verify Your Network, Realize Your eXpertise - Platform içi Waiqtion (WQT) token ile çalışan P2P freelance platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <LanguageProvider>
          <P2PProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </P2PProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
