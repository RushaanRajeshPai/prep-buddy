import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// The mobile disclosure must work without pretending to be a modal.

import { afterEach, beforeEach, expect, test, vi } from "vitest";
vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard" }));
beforeEach(() =>
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401 })),
);
afterEach(() => vi.unstubAllGlobals());
import { Navbar } from "@/components/layout/navbar";

test("signed-in navigation replaces guest actions with name and profile icon", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: async () => ({
          user: { id: "1", name: "Rushaan Pai", email: "student@example.com" },
        }),
      }),
  );
  render(<Navbar />);
  const profile = await screen.findByRole("link", {
    name: "Rushaan Pai — Your account",
  });
  expect(profile).toHaveAttribute("href", "/dashboard");
  expect(profile.querySelector("svg")).not.toBeNull();
  expect(
    screen.queryByRole("link", { name: "Log in" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: "Register" }),
  ).not.toBeInTheDocument();
  await userEvent
    .setup()
    .click(screen.getByRole("button", { name: "Open navigation" }));
  expect(
    within(
      screen.getByRole("navigation", { name: "Mobile navigation" }),
    ).getByRole("link", { name: "Your account" }),
  ).toHaveAttribute("href", "/dashboard");
  expect(
    screen.queryByRole("link", { name: "Log in" }),
  ).not.toBeInTheDocument();
});

test("desktop navigation names both preparation paths", () => {
  render(<Navbar />);
  const nav = within(
    screen.getByRole("navigation", { name: "Main navigation" }),
  );
  expect(nav.getByRole("link", { name: "Interview Practice" })).toHaveAttribute(
    "href",
    "/interview-practice",
  );
  expect(nav.getByRole("link", { name: "Group Discussions" })).toHaveAttribute(
    "href",
    "/group-discussions",
  );
});

test("navigation offers real account routes and a closed mobile menu", () => {
  render(<Navbar />);
  expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute(
    "href",
    "/login",
  );
  expect(screen.getByRole("link", { name: "Register" })).toHaveAttribute(
    "href",
    "/register",
  );
  expect(
    screen.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
});

test("mobile navigation opens, closes on Escape and returns focus", async () => {
  const user = userEvent.setup();
  render(<Navbar />);
  await user.click(screen.getByRole("button", { name: "Open navigation" }));
  const toggle = screen.getByRole("button", { name: "Close navigation" });
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  const menu = screen.getByRole("navigation", { name: "Mobile navigation" });
  expect(menu).toHaveAttribute("id", toggle.getAttribute("aria-controls"));
  await user.tab();
  await user.keyboard("{Escape}");
  expect(
    screen.queryByRole("navigation", { name: "Mobile navigation" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Open navigation" })).toHaveFocus();
});

test("mobile links preserve their destinations and close the menu", async () => {
  const user = userEvent.setup();
  render(<Navbar />);
  for (const [name, href] of [
    ["Interview Practice", "/interview-practice"],
    ["Group Discussions", "/group-discussions"],
    ["How it works", "/#how-it-works"],
    ["Log in", "/login"],
    ["Register", "/register"],
  ]) {
    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    const menu = screen.getByRole("navigation", { name: "Mobile navigation" });
    const link = within(menu).getByRole("link", { name });
    expect(link).toHaveAttribute("href", href);
    // Prevent JSDOM's unsupported full-page navigation, not the menu handler.
    link.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    });
    await user.click(link);
    expect(
      screen.queryByRole("navigation", { name: "Mobile navigation" }),
    ).not.toBeInTheDocument();
  }
});
