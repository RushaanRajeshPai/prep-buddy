import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import LoginPage from "@/app/(auth)/login/page";
import RegisterPage from "@/app/(auth)/register/page";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));
afterEach(() => { vi.unstubAllGlobals(); replace.mockReset(); });

test("registration submits name/email/password and opens the account dashboard", async () => {
  const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ user: { id: "1", name: "Test Student", email: "student@example.com" } }) });
  vi.stubGlobal("fetch", fetcher);
  render(<RegisterPage />);
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Full name"), "Test Student");
  await user.type(screen.getByLabelText("Email address"), "student@example.com");
  await user.type(screen.getByLabelText("Password"), "test-password-123");
  await user.click(screen.getByRole("button", { name: "Create account" }));
  await waitFor(() => expect(replace).toHaveBeenCalledWith("/dashboard"));
  expect(fetcher).toHaveBeenCalledWith("/api/v1/auth/register", expect.objectContaining({ method: "POST", credentials: "include", body: JSON.stringify({ name: "Test Student", email: "student@example.com", password: "test-password-123" }) }));
});

test("login surfaces an API error and does not navigate", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ detail: "Invalid email or password" }) }));
  render(<LoginPage />);
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Email address"), "student@example.com");
  await user.type(screen.getByLabelText("Password"), "bad-password");
  await user.click(screen.getByRole("button", { name: "Log in" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Invalid email or password");
  expect(replace).not.toHaveBeenCalled();
});
