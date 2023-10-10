import './globals.css';
import { Inter } from 'next/font/google';
import { Header } from '@/components/header/header';
import localFont from 'next/font/local';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Dr. AI',
  description: 'A first-time AI helper',
};

const myFont = localFont({
  src: '../public/fonts/SUITE-Variable.woff2',
  display: 'swap',
  variable: '--font-suite',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={myFont.className}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
