import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ylblog",
  description: "this is yelim blog :)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div style={{ width: "100%" }}>
          <h1>AwesomeYelim</h1>
          <nav>
            <Link href="/home">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/post">Post</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
        {children}
      </body>
    </html>
  );
}
