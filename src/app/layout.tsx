import { Inter, Notable } from "next/font/google";
import Link from "next/link";
import Head from "next/head";
import NavBar from "./components/NavBar";

import "./styles/reset.scss";
import "./styles/layout.scss";
import "./styles/dark.scss";
import { Footer } from "./Footer";

const inter = Inter({ subsets: ["latin"] });
// const notable = Notable({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "hongyelim",
  description: "this is yelim blog :)",
  icons: {
    shortcut: "/images/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning={true}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            const modecookie = document.cookie.match('theme=([^;]*)(;|$)')
            document.documentElement.dataset.theme = modecookie[1]
          `,
          }}></script>
      </head>
      <body className={inter.className}>
        <div className="wrapper">
          <NavBar />
          <div className="content">{children}</div>
          <Footer detail />
        </div>
      </body>
    </html>
  );
}
