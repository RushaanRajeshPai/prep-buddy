import type { Metadata } from "next";
import { AccountForm } from "@/features/auth/account-form";
export const metadata: Metadata = { title: "Register" };
export default function Page() {
  return <AccountForm mode="register" />;
}
