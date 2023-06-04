import classNames from "classnames";
import { Inter, Notable } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import logo from "../../public/images/logo.svg";
import "./reset.scss";

const inter = Inter({ subsets: ["latin"] });
const notable = Notable({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "ylblog",
  description: "this is yelim blog :)",
  icons: {
    shortcut: "/images/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" style={{ height: "100%" }}>
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
              <Image src={logo} alt="logo" width={20} height={10} priority />
            </Link>
          </div>

          <div style={{ marginTop: 200, padding: 20 }}>{children}</div>
          <nav className={notable.className} style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/posts">Post</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </body>
    </html>
  );
}
