import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import { AccountDashboard } from "@/features/auth/account-dashboard";
const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock("next/navigation", () => { const router = { replace }; return { useRouter: () => router }; });
afterEach(() => { vi.unstubAllGlobals(); replace.mockReset(); });
test("dashboard requires a server-validated session", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 401, ok: false }));
  render(<AccountDashboard />);
  await waitFor(() => expect(replace).toHaveBeenCalledWith("/login"));
});
test("signed-in account can log out", async () => {
  const fetcher = vi.fn().mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ user: { id: "1", name: "Test Student", email: "student@example.com" } }) }).mockResolvedValueOnce({ ok: true });
  vi.stubGlobal("fetch", fetcher);
  render(<AccountDashboard />);
  expect(await screen.findByText("Welcome, Test.")).toBeInTheDocument();
  await userEvent.setup().click(screen.getByRole("button", { name: "Log out" }));
  await waitFor(() => expect(replace).toHaveBeenCalledWith("/login"));
  expect(fetcher).toHaveBeenLastCalledWith("/api/v1/auth/logout", { method: "POST", credentials: "include" });
});
