import { Inter, Notable } from "next/font/google";
import Link from "next/link";
import Head from "next/head";
import NavBar from "./components/NavBar";

import "./styles/reset.scss";
import "./styles/layout.scss";
import "./styles/dark.scss";

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
          <div className="footer_wrapper">
            <footer>
              <div className="icon_group">
                <Link href="mailto:uiop01900@gmail.com" target="_blank">
                  <i className="email" />
                </Link>
                <Link href="https://github.com/AwesomeYelim" target="_blank">
                  <i className="github" />
                </Link>
                <Link href="https://www.instagram.com/honyelim" target="_blank">
                  <i className="instagram" />
                </Link>
              </div>
              <div className="detail">
                <Link href="/">© 2023 hongyelim. All Rights Reserved.</Link>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
