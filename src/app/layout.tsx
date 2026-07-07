import { Inter } from "next/font/google";
import { Footer } from "./Footer";
import NavBar from "./components/NavBar";
import Providers from "./components/Providers";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { Metadata } from "next";

import "./styles/variables.scss";
import "./styles/reset.scss";
import "./styles/layout.scss";
import "./styles/dark.scss";

const inter = Inter({ subsets: ["latin"] });

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
  robots: "index, follow",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning={true}>
      <GoogleAnalytics />
      <head>
        <meta name="googlebot" content="index, follow" />
        <meta name="google-site-verification" content="2s1XEZhZCijhcLEsQR5t6LFthsxawdQRPmx15i9n_XI" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            try {
              var modecookie = document.cookie.match('theme=([^;]*)(;|$)');
              document.documentElement.dataset.theme = modecookie ? modecookie[1] : 'light';
            } catch(e) {
              document.documentElement.dataset.theme = 'light';
            }
          `,
          }}></script>
      </head>
      <Providers>
        <body className={inter.className}>
          <div className="wrapper">
            <NavBar />
            <main className="content">{children}</main>
            <Footer detail={true} />
          </div>
        </body>
      </Providers>
    </html>
  );
}
