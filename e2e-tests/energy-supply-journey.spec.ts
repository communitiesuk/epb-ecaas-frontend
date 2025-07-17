import { test, expect } from "@playwright/test";

test("saved energy supply form data is visible when user revisits the energy supply page", async ({ page }) => {
  await page.goto("");
  await page.getByRole('link', { name: 'Heating systems' }).click();
  await page.getByRole('link', { name: 'Energy supply' }).nth(0).click();

  //add data to form page
  const checkbox = page.getByTestId("fuelType_electricity");
  await checkbox.check();

  const radio = page.getByTestId("exported_yes");
  await radio.check();

  await page.locator('button:text("Save and continue")').click();
  //confirm redirect 
  await expect(page).toHaveURL("/heating-systems")

  // revisit the Energy Supply page to confirm data persistence
  await page.goto("/heating-systems/energy-supply");
  await expect(checkbox).toBeChecked()
  await expect(radio).toBeChecked()
});

test("saved energy supply form data is visible on the heating systems summary page", async ({ page }) => {
  await page.goto("");
  await page.getByRole('link', { name: 'Heating systems' }).click();
  await page.getByRole('link', { name: 'Energy supply' }).nth(0).click();

  //add data to form page
  const checkbox = page.getByTestId("fuelType_electricity");
  await checkbox.check();

  const radio = page.getByTestId("exported_yes");
  await radio.check();

  await page.locator('button:text("Save and continue")').click();

  //navigate to Heating systems summary page
  await page.goto("/heating-systems/summary");
  
  const fuelTypeElement = page.getByTestId("summary-energySupply-fuel-type");
  const fuelType = await fuelTypeElement.locator("li").innerText();
  expect(fuelType).toBe("Electricity")

  const exportedElement = page.getByTestId("summary-energySupply-exported");
  const exported = await exportedElement.locator("dd").innerText();
  expect(exported.includes("Yes")).toBe(true);
})
