import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ParticlesBackground } from "@/components/ParticlesBackground";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "GeoMaster Quiz",
  description: "Testez vos connaissances en géographie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${outfit.variable} ${outfit.className} font-sans bg-black`}>
        <ParticlesBackground />
        <main className="relative z-[2]">{children}</main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
