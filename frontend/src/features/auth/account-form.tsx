"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";

export function AccountForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const registering = mode === "register";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const payload = registering
      ? { name: String(data.get("name")), email: String(data.get("email")), password: String(data.get("password")) }
      : { email: String(data.get("email")), password: String(data.get("password")) };
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/v1/auth/${mode}`, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(typeof result.detail === "string" ? result.detail : "Check your details and try again.");
        return;
      }
      router.replace("/dashboard");
    } catch {
      setError("We couldn’t connect. Please try again in a moment.");
    } finally { setBusy(false); }
  }

  return <main id="main-content" className="page-shell account-page auth-layout">
    <div className="auth-intro"><p className="eyebrow">YOUR NEXT CHAPTER</p><h1>{registering ? <>A little practice.<br /><em>A fresh start.</em></> : <>Welcome<br /><em>back.</em></>}</h1><p>{registering ? "Create your PrepBuddy account. Give your next interview a more confident beginning." : "Good to see you again. Your next step starts with showing up."}</p><p className="availability-note">Interview and group-discussion sessions are coming next.</p></div>
    <section className="auth-card" aria-labelledby="account-heading"><h2 id="account-heading">{registering ? "Create your account" : "Log in"}</h2><p className="auth-subtitle">{registering ? "A space to grow into your own voice." : "Pick up where you left off."}</p>
      <form onSubmit={submit} aria-busy={busy}>
        {registering && <div className="form-field"><label htmlFor="name">Full name</label><input id="name" name="name" autoComplete="name" required minLength={2} maxLength={80} placeholder="Your full name" disabled={busy} /></div>}
        <div className="form-field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" disabled={busy} /></div>
        <div className="form-field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete={registering ? "new-password" : "current-password"} required minLength={registering ? 8 : 1} maxLength={128} aria-describedby={registering ? "password-hint" : undefined} disabled={busy} />{registering && <p id="password-hint" className="field-hint">Use at least 8 characters.</p>}</div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button auth-submit" type="submit" disabled={busy}>{busy ? (registering ? "Creating account…" : "Logging in…") : (registering ? "Create account" : "Log in")}<ArrowRight size={18} aria-hidden="true" /></button>
      </form>
      <p className="auth-switch">{registering ? "Already have an account? " : "New to PrepBuddy? "}<Link href={registering ? "/login" : "/register"}>{registering ? "Log in" : "Create an account"}</Link></p>
    </section>
  </main>;
}
