"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface RevealProps {
  children: ReactNode;
  /** 지연 단계 (0~5). 단계당 80ms 씩 늦게 나타남 */
  delay?: number;
  className?: string;
}

/** 스크롤 시 요소가 아래에서 부드럽게 떠오르는 래퍼 (Toss 스타일) */
export default function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay * 80}ms, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay * 80}ms`,
      }}
    >
      {children}
    </div>
  );
}
