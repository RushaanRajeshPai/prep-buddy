import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AccountPreview({ title }: { title: "Log in" | "Register" }) {
  return <main id="main-content" className="page-shell account-page"><p className="eyebrow">A WORK IN PROGRESS</p><h1>{title}</h1><h2>Account access is being built.</h2><p>PrepBuddy is taking shape. Registration and login aren’t available yet, and this page does not collect or submit any credentials.</p><Link href="/" className="text-link"><ArrowLeft size={18} aria-hidden="true" /> Back to home</Link></main>;
}
