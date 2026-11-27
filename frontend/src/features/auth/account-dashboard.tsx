"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = { id: string; name: string; email: string };
export function AccountDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    fetch("/api/v1/auth/me", { credentials: "include", cache: "no-store" })
      .then(async (response) => {
        if (!active) return;
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        if (!response.ok) throw new Error("Unavailable");
        const result = await response.json();
        if (active) setUser(result.user);
      })
      .catch(() => {
        if (active)
          setError("We couldn’t load your account. Refresh to try again.");
      });
    return () => {
      active = false;
    };
  }, [router]);
  async function logout() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Unavailable");
      router.replace("/login");
    } catch {
      setError("We couldn’t log you out. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main id="main-content" className="page-shell account-page">
      <p className="eyebrow">YOUR PREPBUDDY ACCOUNT</p>
      <h1>{user ? `Welcome, ${user.name.split(" ")[0]}.` : "Your account"}</h1>
      {error && <p role="alert">{error}</p>}
      {!user && !error && <p role="status">Loading your account…</p>}
      {user && (
        <>
          <p>You’re signed in as {user.email}.</p>
          <section className="dashboard-note">
            <h2>A good beginning.</h2>
            <p>
              Your account is ready. Interview practice and group discussions
              are coming in the next phase.
            </p>
          </section>
          <div className="hero-actions">
            <Link className="text-link" href="/">
              Explore the home page
            </Link>
            <button className="button" onClick={logout} disabled={busy}>
              {busy ? "Logging out…" : "Log out"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
