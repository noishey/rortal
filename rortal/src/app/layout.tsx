import type { Metadata } from "next";
import { Exo_2, Montserrat } from "next/font/google";
import "./styles/globals.css";

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rortal - Digital Art & NFTs",
  description: "A creative space for digital art and NFTs. Leave your mark on the blockchain.",
  keywords: ["NFT", "digital art", "blockchain", "crypto art", "web3"],
  authors: [{ name: "Rortal" }],
  openGraph: {
    title: "Rortal - Digital Art & NFTs",
    description: "A creative space for digital art and NFTs. Leave your mark on the blockchain.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body
        className={`${exo2.variable} ${montserrat.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
