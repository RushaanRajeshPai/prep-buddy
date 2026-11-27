import { readFileSync } from "node:fs";
import { expect, test } from "vitest";

test("shared shell fills the viewport and pushes footer below content without an overlay", () => {
  const css = readFileSync("src/app/globals.css", "utf8");
  expect(css).toMatch(/body\s*\{[^}]*min-height:\s*100dvh/);
  expect(css).toMatch(/body\s*\{[^}]*display:\s*flex/);
  expect(css).toMatch(/body\s*\{[^}]*flex-direction:\s*column/);
  expect(css).toMatch(/body\s*>\s*main\s*\{[^}]*flex:\s*1/);
  expect(css).toMatch(/\.site-footer\s*\{[^}]*flex-shrink:\s*0/);
  expect(css).not.toMatch(
    /\.site-footer\s*\{[^}]*(?:position:\s*(?:fixed|absolute))/,
  );
});
