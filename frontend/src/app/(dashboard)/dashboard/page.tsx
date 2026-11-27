import type { Metadata } from "next";
import { AccountDashboard } from "@/features/auth/account-dashboard";
export const metadata: Metadata = { title: "Your account" };
export default function DashboardPage() { return <AccountDashboard />; }
