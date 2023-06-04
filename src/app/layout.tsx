import classNames from "classnames";
import { Inter } from "next/font/google";
import Link from "next/link";
import Head from "next/head";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ylblog",
  description: "this is yelim blog :)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body className={inter.className}>
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: "100%",
              padding: "15px 20px",
              display: "flex",
              justifyContent: "space-between",
              position: "fixed",
              top: 0,
              backgroundColor: "#D6D6D6",
            }}
            className={classNames()}>
            <Link href="/" style={{ fontWeight: 650, fontSize: "1.5rem" }}>
              AwesomeYelim
            </Link>

            <nav style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/posts">Post</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>

          <div style={{ marginTop: 200, padding: 20 }}>{children}</div>
        </div>
      </body>
    </html>
  );
}
