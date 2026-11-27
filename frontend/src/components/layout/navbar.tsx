"use client";

import Link from "next/link";
import { Menu, X, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useAccount } from "@/features/auth/use-account";

export function Navbar() {
  const account = useAccount();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    const desktop = window.matchMedia?.("(min-width: 768px)");
    function onResize(event: MediaQueryListEvent) {
      if (event.matches) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    desktop?.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop?.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="page-shell nav-shell">
        <Link href="/" className="wordmark" aria-label="PrepBuddy home">
          prep<span>buddy</span>
          <span className="brand-dot" aria-hidden="true">
            .
          </span>
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          <Link href="/interview-practice">Interview Practice</Link>
          <Link href="/group-discussions">Group Discussions</Link>
          <Link href="/#how-it-works">How it works</Link>
        </nav>
        <div className="account-actions">
          {account ? (
            <Link
              href="/dashboard"
              className="profile-link"
              aria-label={`${account.name} — Your account`}
            >
              <span className="profile-icon">
                <UserRound size={19} aria-hidden="true" />
              </span>
              <span className="profile-name">{account.name}</span>
            </Link>
          ) : (
            <>
              <Link href="/login" className="login-link">
                Log in
              </Link>
              <Link href="/register" className="button button-small">
                Register
              </Link>
            </>
          )}
        </div>
        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <X size={22} aria-hidden="true" />
          ) : (
            <Menu size={22} aria-hidden="true" />
          )}
        </button>
      </div>
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className="mobile-nav page-shell"
        hidden={!open}
      >
        <Link href="/interview-practice" onClick={() => setOpen(false)}>
          Interview Practice
        </Link>
        <Link href="/group-discussions" onClick={() => setOpen(false)}>
          Group Discussions
        </Link>
        <Link href="/#how-it-works" onClick={() => setOpen(false)}>
          How it works
        </Link>
        {account ? (
          <Link href="/dashboard" onClick={() => setOpen(false)}>
            Your account
          </Link>
        ) : (
          <>
            <Link href="/login" onClick={() => setOpen(false)}>
              Log in
            </Link>
            <Link href="/register" onClick={() => setOpen(false)}>
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
