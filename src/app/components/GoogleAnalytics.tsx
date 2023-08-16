"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

export function pageview(url: string) {
  window.gtag("config", process.env.NEXT_PUBLIC_GA_ID as string, {
    page_path: url,
  });
}

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value: number;
};

export function event({ action, category, label, value }: GTagEvent) {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

const gaScript = `function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","${
  process.env.NEXT_PUBLIC_GA_ID as string
}");`;

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.gtag || !pathname) return;

    pageview(pathname);
  }, [pathname]);

  return (process.env.NEXT_PUBLIC_GA_ID as string) ? (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID as string}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {gaScript}
      </Script>
    </>
  ) : null;
}
