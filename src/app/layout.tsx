import type {Metadata} from 'next';
import { Lora } from 'next/font/google';
import { GeistSans } from 'geist/font/sans'; // Changed import path
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

// GeistSans from 'geist/font/sans' already provides the variable and className
const geistSans = GeistSans;

export const metadata: Metadata = {
  title: 'BookOfSand',
  description: 'Explore random Wikipedia pages.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lora.variable} ${geistSans.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
