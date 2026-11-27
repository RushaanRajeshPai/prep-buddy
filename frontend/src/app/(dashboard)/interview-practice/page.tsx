import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export const metadata: Metadata = { title: "Interview Practice" };
export default function Page() {
  return (
    <main id="main-content" className="page-shell account-page">
      <p className="eyebrow">Coming soon</p>
      <h1>Interview Practice</h1>
      <p>
        A space to prepare thoughtful answers, practise follow-up questions, and
        build confidence for your next interview.
      </p>
      <p>We’re building this practice experience. Check back soon.</p>
      <Link href="/" className="text-link">
        <ArrowLeft size={18} aria-hidden="true" /> Back to home
      </Link>
    </main>
  );
}
