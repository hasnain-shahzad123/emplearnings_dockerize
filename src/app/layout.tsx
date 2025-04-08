import type { Metadata } from "next";
import { Inter, Poppins } from 'next/font/google';
import { AlertProvider } from "@/contexts/AlertContext";
import CustomAlert from "@/components/shared/generalAlert/CustomAlert";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"

// Configure fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Empowered Learnings",
  description: "Learn Anything, Succeed Everywhere!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable} font-poppins`}>
        <AlertProvider>
        <CustomAlert />
        {children}
        <SpeedInsights />
        </AlertProvider>
      </body>
    </html>
  );
}

