// app/layout.tsx
// Layout principal avec Breadcrumbs et ModuleSidebar

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { NavBar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ModuleSidebar } from "@/components/ModuleSidebar";
import { WagmiProviderWrapper } from "@/components/providers/WagmiProvider";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VeritasChain - Proof of Document Anchoring",
  description: "Ancrez vos documents sur la blockchain Ethereum pour une preuve d'existence immuable",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <WagmiProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col">
              <NavBar />
              <main className="flex-1">
                <div className="container py-8">
                  <Breadcrumbs />
                  <div className="flex gap-8">
                    <ModuleSidebar />
                    <div className="flex-1">
                      {children}
                    </div>
                  </div>
                </div>
              </main>
              <Footer />
            </div>
            <Toaster position="top-right" />
          </ThemeProvider>
        </WagmiProviderWrapper>
      </body>
    </html>
  );
}