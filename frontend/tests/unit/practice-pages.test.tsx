import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import InterviewPage from "@/app/(dashboard)/interview-practice/page";
import DiscussionPage from "@/app/(dashboard)/group-discussions/page";

test.each([
  ["Interview Practice", InterviewPage],
  ["Group Discussions", DiscussionPage],
])("%s has an honest standalone placeholder", (title, Page) => {
  render(<Page />);
  expect(
    screen.getByRole("heading", { level: 1, name: title }),
  ).toBeInTheDocument();
  expect(screen.getByText("Coming soon")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute(
    "href",
    "/",
  );
  expect(document.querySelector("form")).toBeNull();
});
