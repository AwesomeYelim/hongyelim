"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import classNames from "classnames";
import Cookies from "js-cookie";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { collection, addDoc, getDocs, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { DefaultSession } from "next-auth";

const Nav = styled.div<{ $hide: boolean }>`
  height: ${({ $hide }) => ($hide ? "111px" : "0px")};
`;
export default function NavBar() {
  const { data: session } = useSession();
  const location = usePathname();

  const userAdd = async (user: DefaultSession["user"]) => {
    // const db = getFirestore(app);
    // const id = await addDoc(collection(db, "user"), user);
    const id = await getDocs(collection(db, "user"));
    // id.forEach((doc) => {
    //   console.log(doc.id, doc.data());
    // });

    // const data = doc(db, "user", user?.email as string);
    // await setDoc(data, user);

    // await updateDoc(data, {
    //   name: "yesGirl ~",
    // });
  };

  useEffect(() => {
    if (session?.user?.email) userAdd(session?.user);
  }, [session?.user]);

  const {
    navInfo: [navInfo, setNavInfo],
    dark: [dark, setDark],
  } = {
    navInfo: useState({ to: 0, hide: true }),
    dark: useState(Cookies.get("theme") === "dark"),
  };

  const admin = session?.user?.email === "uiop01900@gmail.com";

  const scrollToHide = useCallback(() => {
    setNavInfo((prev) => ({ ...prev, to: window.pageYOffset }));
    //  스크롤 아래로 내릴때
    if (navInfo.to < window.pageYOffset) {
      setNavInfo({ to: window.pageYOffset, hide: false });
      //  스크롤 위로 올릴때
    } else if (navInfo.to > window.pageYOffset) {
      setNavInfo({ to: window.pageYOffset, hide: true });
    }
  }, [navInfo]);

  useEffect(() => {
    document.addEventListener("scroll", scrollToHide);
    return () => document.removeEventListener("scroll", scrollToHide);
  }, [navInfo]);

  useEffect(() => {
    if (dark) {
      document.documentElement.dataset.theme = "dark";
    } else {
      document.documentElement.dataset.theme = "light";
    }
  }, []);

  return (
    <Nav $hide={navInfo.hide} className="nav_wrapper">
      <Link href="/" className="logo">
        <i />
      </Link>
      <nav>
        <i
          className="mode"
          onClick={() => {
            setDark(!dark);
            if (dark) {
              document.documentElement.dataset.theme = "light";
              Cookies.set("theme", "light");
            } else {
              document.documentElement.dataset.theme = "dark";
              Cookies.set("theme", "dark");
            }
          }}
        />
        <i
          title={(() => {
            if (session?.user) {
              return "logout";
            }
            return "login";
          })()}
          className={classNames("login", { logout: !!session?.user })}
          onClick={() => {
            if (session?.user) {
              return signOut();
            }
            return signIn();
          }}
        />
        {session?.user && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session?.user.image as string}
            style={{ width: 25, height: 25, borderRadius: "50%" }}
            alt="profile-img"
          />
        )}
        <Link href="/profile" className={classNames({ active: location?.includes("/profile") })}>
          Profile
        </Link>
        <Link href="/posts" className={classNames({ active: location?.includes("/posts") })}>
          Posts
        </Link>
        <Link href="/memo" className={classNames({ active: location?.includes("/memo") })}>
          Memo
        </Link>
        <Link href="/archives" className={classNames({ active: location?.includes("/archives") })}>
          Archives
        </Link>
      </nav>
    </Nav>
  );
}
