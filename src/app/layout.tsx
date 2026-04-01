import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mega TODO X",
  description: "A 16-bit SNES-themed TODO app inspired by Mega Man X",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pressStart2P.variable}>
      <body className="font-pressStart bg-megaman-dark min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
