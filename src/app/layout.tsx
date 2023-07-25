import { Inter, Notable } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import logo from "../../public/images/logo.svg";
import "./reset.scss";
import "./layout.scss";

const inter = Inter({ subsets: ["latin"] });
// const notable = Notable({ subsets: ["latin"], weight: "400" });

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
        <div className="wrapper">
          <Link href="/" className="logo">
            <Image src={logo} alt="logo" width={50} height={50} priority />
          </Link>
          <nav>
            <Link href="/about">Profile</Link>
            <Link href="/posts">TechLog</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <div className="content">{children}</div>
        </div>
      </body>
    </html>
  );
}
