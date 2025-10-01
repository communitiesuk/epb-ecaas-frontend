import { test as setup } from "@playwright/test";
import path from "path";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("login authentication", async ({ page }) => {
  if (!process.env.BASE_URL) return;
	
  const username = process.env.LOGIN_USERNAME;
  const password = process.env.LOGIN_PASSWORD;

  if (!username || !password) {
    throw new Error("Missing authentication credentials");
  }

  await page.goto("/");

  await page.locator("#signInFormUsername").nth(1).fill(username);

  await page.locator("#signInFormPassword").nth(1).fill(password);

  await page.getByRole("button", { name: "submit" }).click();
  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});
