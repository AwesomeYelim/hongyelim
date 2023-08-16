import { Inter, Notable } from "next/font/google";
import Link from "next/link";
import Head from "next/head";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { getPosts } from "@/service/posts";
import { Footer } from "./Footer";
import NavBar from "./components/NavBar";
import Recoil from "./components/Recoil";
import ReactQuery from "./components/ReactQuery";
import AuthSession from "./components/AuthSession";
import StyledComponentsRegistry from "./registry";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const posts = await getPosts();
  const session = await getServerSession();
  console.log(session);

  return (
    <html lang="ko" suppressHydrationWarning={true}>
      <head>
        <meta name="google-site-verification" content="2s1XEZhZCijhcLEsQR5t6LFthsxawdQRPmx15i9n_XI" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            const modecookie = document.cookie.match('theme=([^;]*)(;|$)')
            document.documentElement.dataset.theme = modecookie[1]
          `,
          }}></script>
      </head>
      <StyledComponentsRegistry>
        <AuthSession>
          <body className={inter.className}>
            <div className="wrapper">
              <NavBar />
              <ReactQuery>
                <Recoil>
                  <div className="content">{children}</div>
                </Recoil>
              </ReactQuery>
              <Footer detail={true} />
            </div>
          </body>
        </AuthSession>
      </StyledComponentsRegistry>
    </html>
  );
}
