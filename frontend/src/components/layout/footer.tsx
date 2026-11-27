"use client";
import Link from "next/link";
import { useAccount } from "@/features/auth/use-account";

export function Footer() {
  const account = useAccount();
  return <footer className="site-footer"><div className="page-shell footer-inner"><div><Link href="/" className="wordmark" aria-label="PrepBuddy home">prep<span>buddy</span><span className="brand-dot" aria-hidden="true">.</span></Link><p>A little more prepared for what’s next.</p></div><nav aria-label="Footer navigation"><Link href="/#practice">Practice paths</Link><Link href="/#how-it-works">How it works</Link>{account ? <Link href="/dashboard">Your account</Link> : <><Link href="/login">Log in</Link><Link href="/register">Register</Link></>}</nav><span className="footer-note">Made for your next chapter.</span></div></footer>;
}
