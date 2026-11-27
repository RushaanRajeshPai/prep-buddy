"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Account = { id: string; name: string; email: string };
export function useAccount() {
  const pathname = usePathname();
  const [user, setUser] = useState<Account | null>(null);
  useEffect(() => {
    let active = true;
    fetch("/api/v1/auth/me", { credentials: "include", cache: "no-store" })
      .then(async (response) => {
        const account = response.ok ? (await response.json()).user : null;
        if (active) setUser(account);
      })
      .catch(() => {
        if (active) setUser(null);
      });
    return () => {
      active = false;
    };
  }, [pathname]);
  return user;
}
