import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const fillEnergySupplyForm = async (page: Page) => {
	//navigate to Energy supply page
	await page.getByRole("link", { name: "Heating systems" }).click();
	await page.getByRole("link", { name: "Energy supply" }).nth(0).click();

	//fill out energy supply form 
	await page.getByTestId("fuelType_electricity").click();
	await page.getByTestId("exported_yes").click();

	//save form
	await page.getByTestId("saveAndComplete").click();
};

const getLocalStorage = async (page: Page) => {
	return await page.evaluate(() => {
		const ecaasLocalStorage = localStorage.getItem("ecaas");
		return JSON.parse(ecaasLocalStorage!);
	});
};

test.beforeEach(async ({ page }) => {
	await page.goto("/");
	await fillEnergySupplyForm(page);
});

test.describe("Energy supply form data persistence", () => {

	test("should persist data when revisiting the form page", async ({ page }) => {
		
		await page.click('a[href="/heating-systems/energy-supply"]');
	
		await expect(page.getByTestId("fuelType_electricity")).toBeChecked();
		await expect(page.getByTestId("exported_yes")).toBeChecked();
	});
	
	test("should persist data on the heating systems summary page", async ({ page }) => {

		await page.click('a[href="/heating-systems/summary"]');
		
		const fuelTypeElement = page.getByTestId("summary-energySupply-fuel-type");
		await expect(fuelTypeElement.locator("dd")).toHaveText(/Electricity/);
	
		const exportedElement = page.getByTestId("summary-energySupply-exported");
		await expect(exportedElement.locator("dd")).toHaveText(/Yes/);
	});
	
	test("should persist data when page is reloaded", async ({ page }) => {

		await page.reload();
		await page.click('a[href="/heating-systems/energy-supply"]');
		
		await expect(page.getByTestId("fuelType_electricity")).toBeChecked();
		await expect(page.getByTestId("exported_yes")).toBeChecked();
	});

	test.skip("should persist data when local storage is cleared and page is reloaded", async ({ page }) => {

		await page.evaluate(() => localStorage.clear());
		
		expect(await getLocalStorage(page)).toBeNull();
		
		await page.reload();
		await page.click('a[href="/heating-systems/energy-supply"]');
		
		await expect(page.getByTestId("fuelType_electricity")).toBeChecked();
		await expect(page.getByTestId("exported_yes")).toBeChecked();
	});
});