import "./globals.css";
import Provider from "@/components/auth/provider";
import { Header } from "@/components/header/header";
import localFont from "next/font/local";

export const metadata = {
  title: "Dr. AI",
  description: "A first-time AI helper",
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

const myFont = localFont({
  src: "../public/fonts/suit/SUIT-Variable.woff2",
  display: "swap",
  variable: "--font-suite",
});

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en" className={myFont.className}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="h-screen">
        <Provider>
          <Header />
          {children}
          {modal}
        </Provider>
      </body>
    </html>
  );
}
