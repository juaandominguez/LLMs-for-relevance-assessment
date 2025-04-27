import { expect, test } from "@playwright/test";

test("Workflow", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page.getByRole("button", { name: "Or login as a Guest" }).click();
  await expect(page).toHaveURL("http://localhost:3000");
  await page.getByRole("button", { name: "Toggle Sidebar" }).click();
  await page.getByRole("link", { name: "50. Tiananmen Square" }).click();
  await page.getByRole("link", { name: "Income Tax Evasion" }).click();
  await page.getByRole("button", { name: "2" }).click();
  await page.getByRole("button").filter({ hasText: /^$/ }).nth(1).click();
  await expect(page.getByText("Assessment submitted").first()).toBeVisible();
  await page.getByRole("button", { name: "1" }).click();
  await page.getByRole("button").filter({ hasText: /^$/ }).nth(1).click();
  await expect(page.getByText("Assessment submitted").first()).toBeVisible();
  await page.getByRole("button", { name: "0" }).click();
  await page.getByRole("button").filter({ hasText: /^$/ }).nth(1).click();
  await expect(page.getByText("Assessment submitted").first()).toBeVisible();
});
