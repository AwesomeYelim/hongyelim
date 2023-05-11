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
    <html lang="en" style={{ height: "100%" }}>
      <body className={inter.className}>
        <div
          style={{ width: "100%", padding: 10, display: "flex", justifyContent: "space-between", marginBottom: 100 }}>
          <Link href="/">AwesomeYelim</Link>

          <nav style={{ display: "flex", gap: 10 }}>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/posts">Post</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
        {children}
      </body>
    </html>
  );
}
