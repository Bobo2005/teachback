
import type { Metadata } from 'next';
import { Fraunces, Inter, Caveat } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['600', '700', '900'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-annotation',
});

export const metadata: Metadata = {
  title: 'Teachback',
  description: "Explain it. We'll catch what you missed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${inter.variable} ${caveat.variable} font-body bg-board text-chalkWhite min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}