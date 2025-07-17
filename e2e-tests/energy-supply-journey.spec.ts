import { test, expect, type Page } from "@playwright/test";

  const fillEnergySupplyForm = async (page: Page) => {
    await page.goto("");
    await page.getByRole('link', { name: 'Heating systems' }).click();
    await page.getByRole('link', { name: 'Energy supply' }).nth(0).click();
  
    await page.getByTestId("fuelType_electricity").check();
    await page.getByTestId("exported_yes").check();
    await page.locator('button:text("Save and continue")').click();
  }

test("saved energy supply form data is visible when user revisits the energy supply page", async ({ page }) => {
  await fillEnergySupplyForm(page)
  //confirm redirect 
  await expect(page).toHaveURL("/heating-systems")

  // revisit the Energy Supply page to confirm data persistence
  await page.goto("/heating-systems/energy-supply");
  await expect(page.getByTestId("fuelType_electricity")).toBeChecked()
  await expect(page.getByTestId("exported_yes")).toBeChecked()
});

test("saved energy supply form data is visible on the heating systems summary page", async ({ page }) => {
  await fillEnergySupplyForm(page)
  //navigate to Heating systems summary page
  await page.goto("/heating-systems/summary");
  
  const fuelTypeElement = page.getByTestId("summary-energySupply-fuel-type");
  const fuelType = await fuelTypeElement.locator("li").innerText();
  expect(fuelType).toBe("Electricity")

  const exportedElement = page.getByTestId("summary-energySupply-exported");
  const exported = await exportedElement.locator("dd").innerText();
  expect(exported.includes("Yes")).toBe(true);
})
