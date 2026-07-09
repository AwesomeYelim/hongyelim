"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import classNames from "classnames";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function NavBar() {
  const { data: session } = useSession();
  const location = usePathname();

  const [navInfo, setNavInfo] = useState({ to: 0, hide: true });
  const [dark, setDark] = useState(Cookies.get("theme") === "dark");
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToHide = useCallback(() => {
    const currentY = window.pageYOffset;
    setNavInfo((prev) => {
      if (prev.to < currentY) {
        return { to: currentY, hide: false };
      } else if (prev.to > currentY) {
        return { to: currentY, hide: true };
      }
      return { ...prev, to: currentY };
    });
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        scrollToHide();
        ticking = false;
      });
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => document.removeEventListener("scroll", onScroll);
  }, [scrollToHide]);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <header
      className={classNames("nav_wrapper", { "nav-hidden": !navInfo.hide && !mobileOpen })}
    >
      <Link href="/" className="logo">
        <i />
      </Link>

      <button
        className="hamburger"
        aria-label="메뉴 열기"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={classNames({ open: mobileOpen })}>
        <button
          className="icon-btn mode"
          aria-label="다크모드 전환"
          onClick={() => {
            const next = !dark;
            setDark(next);
            document.documentElement.dataset.theme = next ? "dark" : "light";
            Cookies.set("theme", next ? "dark" : "light");
          }}
        />
        <button
          className="icon-btn login-btn"
          title={session?.user ? "logout" : "login"}
          aria-label={session?.user ? "로그아웃" : "로그인"}
          onClick={() => {
            if (session?.user) return signOut();
            return signIn();
          }}
        >
          <i className={classNames("login", { logout: !!session?.user })} />
        </button>
        {session?.user && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session?.user.image as string}
            style={{ width: 25, height: 25, borderRadius: "50%" }}
            alt={`${session.user.name} 프로필`}
          />
        )}
        <Link
          href="/profile"
          className={classNames({ active: location?.includes("/profile") })}
        >
          Profile
        </Link>
        <Link
          href="/posts"
          className={classNames({ active: location?.includes("/posts") })}
        >
          Posts
        </Link>
        <Link
          href="/archives"
          className={classNames({ active: location?.includes("/archives") })}
        >
          Archives
        </Link>
      </nav>
    </header>
  );
}
