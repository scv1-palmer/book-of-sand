import type {Metadata} from 'next';
import { Lora, Geist_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

const geistSans = Geist_Sans({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

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
