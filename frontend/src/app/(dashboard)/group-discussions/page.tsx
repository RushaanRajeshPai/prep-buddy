import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export const metadata: Metadata = { title: "Group Discussions" };
export default function Page() {
  return (
    <main id="main-content" className="page-shell account-page">
      <p className="eyebrow">Coming soon</p>
      <h1>Group Discussions</h1>
      <p>
        A space to share your perspective, consider other viewpoints, and
        practise making your contribution count.
      </p>
      <p>We’re building this practice experience. Check back soon.</p>
      <Link href="/" className="text-link">
        <ArrowLeft size={18} aria-hidden="true" /> Back to home
      </Link>
    </main>
  );
}
