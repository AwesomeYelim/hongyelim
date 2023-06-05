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
    <html lang="ko">
      <body className={inter.className}>
        <div style={{ width: 768, margin: "5rem auto 0px;" }}>
          <div
            style={{
              padding: 15,
              display: "flex",
              position: "fixed",
              top: 0,
            }}>
            <Link href="/" style={{ fontWeight: 650, fontSize: "1.5rem" }}>
              <Image src={logo} alt="logo" width={50} height={50} priority />
            </Link>
          </div>

          <div style={{ marginTop: 200, padding: 20 }}>{children}</div>
          <nav
            className={notable.className}
            style={{
              width: "inherit",
              position: "fixed",
              bottom: 0,
              display: "flex",
              justifyContent: "space-between",
              padding: 30,
            }}>
            <Link href="/about">Profile</Link>
            <Link href="/posts">Tech blog</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </body>
    </html>
  );
}
