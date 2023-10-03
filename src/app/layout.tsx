import { Inter } from "next/font/google";
import { Footer } from "./Footer";
import NavBar from "./components/NavBar";
import Recoil from "./components/Recoil";
import ReactQuery from "./components/ReactQuery";
import AuthSession from "./components/AuthSession";
import GoogleAnalytics from "./components/GoogleAnalytics";
import StyledComponentsRegistry from "./registry";

import "./styles/reset.scss";
import "./styles/layout.scss";
import "./styles/dark.scss";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });
// const notable = Notable({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "hongyelim",
  description: "https://hongyelim.vercel.app/",
  authors: {
    name: "hongyelim",
  },
  creator: "hongyelim",
  publisher: "hongyelim",
  icons: {
    shortcut: "/images/favicon.png",
  },
  openGraph: {
    title: "YelimBlog",
    images: "https://hongyelim.vercel.app/images/main.jpg",
  },
  robots : "index, follow",
  
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning={true}>
      <GoogleAnalytics />
      <head>
        <meta name="googlebot" content="index, follow" />
        {/* <meta
          name="google-site-verification"
          content="2s1XEZhZCijhcLEsQR5t6LFthsxawdQRPmx15i9n_XI"
        /> */}

        <script
          dangerouslySetInnerHTML={{
            __html: `
            const modecookie = document.cookie.match('theme=([^;]*)(;|$)')
            document.documentElement.dataset.theme = modecookie[1]
          `,
          }}
        ></script>
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
