import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import ClickSpark from "@/components/ClickSpark";
import GradualBlur from "@/components/GradualBlur";

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
      <body className={`${outfit.variable} ${outfit.className} font-sans bg-[#0B0914]`}>
        <ParticlesBackground />
        <ClickSpark
          sparkColor='#fff'
          sparkSize={10}
          sparkRadius={15}
          sparkCount={8}
          duration={400}
        >
          <main className="relative z-[2]">{children}</main>
        </ClickSpark>
        <GradualBlur
          preset="page-footer"
          height="12rem"
          strength={3}
          curve="bezier"
        />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
