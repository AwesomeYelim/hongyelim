import { Inter, Notable } from "next/font/google";
import Link from "next/link";
import Head from "next/head";
import NavBar from "./components/NavBar";

import "./styles/reset.scss";
import "./styles/layout.scss";
import "./styles/dark.scss";
import { Footer } from "./Footer";
import StyledComponentsRegistry from "./registry";
import Recoil from "./components/Recoil";
import ReactQuery from "./components/ReactQuery";

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
        <meta name="google-site-verification" content="2s1XEZhZCijhcLEsQR5t6LFthsxawdQRPmx15i9n_XI" />
        <meta name="naver-site-verification" content="02dbe79f29534a18b8d52a58d5ccfeeabfc07b3d" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            const modecookie = document.cookie.match('theme=([^;]*)(;|$)')
            document.documentElement.dataset.theme = modecookie[1]
          `,
          }}></script>
      </head>
      <StyledComponentsRegistry>
        <body className={inter.className}>
          <div className="wrapper">
            <NavBar />
            <Recoil>
              <ReactQuery>
                <div className="content">{children}</div>
              </ReactQuery>
            </Recoil>
            <Footer detail={true} />
          </div>
        </body>
      </StyledComponentsRegistry>
    </html>
  );
}
