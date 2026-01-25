"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function MainContent({ children }: { children: React.ReactNode }) {
  const [isOnSubdomain, setIsOnSubdomain] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const hostname = window.location.hostname;
    const isLocalhost = hostname.includes("localhost");
    const parts = hostname.split(".");
    // In prod: german.openpolyglot.org has 3 parts. In dev: german.localhost has 2 parts but first isn't "localhost"
    const hasSubdomain = parts.length > 2 || (isLocalhost && parts[0] !== "localhost");
    setIsOnSubdomain(hasSubdomain);
  }, []);

  const isLessonPage = isOnSubdomain && /^\/[^/]+\/[^/]+\/[^/]+$/.test(pathname);

  return <main className={isLessonPage ? "" : "pt-16"}>{children}</main>;
}
