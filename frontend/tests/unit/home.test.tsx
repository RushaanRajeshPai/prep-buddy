import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
beforeEach(() =>
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401 })),
);
afterEach(() => vi.unstubAllGlobals());
import HomePage from "@/app/page";

test("both Explore buttons open the dashboard for signed-in users", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: async () => ({
          user: { id: "1", name: "Student", email: "student@example.com" },
        }),
      }),
  );
  render(<HomePage />);
  const { waitFor } = await import("@testing-library/react");
  await waitFor(() => {
    const links = screen.getAllByRole("link", { name: "Explore PrepBuddy" });
    expect(links).toHaveLength(2);
    for (const link of links)
      expect(link).toHaveAttribute("href", "/dashboard");
  });
});

test("home explains preparation and links to honest account access and a real explainer", () => {
  render(<HomePage />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Practice before the real interview.",
  );
  for (const link of screen.getAllByRole("link", {
    name: "Explore PrepBuddy",
  })) {
    expect(link).toHaveAttribute("href", "/register");
  }
  expect(
    screen.getByRole("link", { name: "See how it works" }),
  ).toHaveAttribute("href", "#how-it-works");
  expect(document.getElementById("how-it-works")).not.toBeNull();
  expect(document.getElementById("practice")).not.toBeNull();
  expect(
    screen.getByRole("heading", { name: "Interview practice" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Group discussions" }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Static example, not a live session/),
  ).toBeInTheDocument();
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
});
