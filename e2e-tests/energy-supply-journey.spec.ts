import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const fillGeneralDetailsForm = async (page: Page) => {
	//navigate to General details page
	await page.getByRole("link", { name: "Dwelling details" }).click();
	await page.getByRole("link", { name: "General details" }).nth(0).click();

	//fill out General details form 
	await page.getByTestId("typeOfDwelling_house").click();
	await page.getByTestId("storeysInDwelling").fill("2");
	await page.getByTestId("numOfBedrooms").fill("3");
	await page.getByTestId("coolingRequired_yes").click();

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
	await fillGeneralDetailsForm(page);
});

test.describe("General details form data persistence", () => {

	test("should persist data when revisiting the form page", async ({ page }) => {

		await page.click('a[href="/dwelling-details/general-details"]');

		await expect(page.getByTestId("typeOfDwelling_house")).toBeChecked();
		await expect(page.getByTestId("storeysInDwelling")).toHaveValue("2");
		await expect(page.getByTestId("numOfBedrooms")).toHaveValue("3");
		await expect(page.getByTestId("coolingRequired_yes")).toBeChecked();
	});

	test("should persist data on the Dwelling details summary page", async ({ page }) => {

		await page.click('a[href="/dwelling-details/summary"]');

		const typeOfDwellingElement = page.getByTestId("summary-generalDetails-type-of-dwelling");
		await expect(typeOfDwellingElement.locator("dd")).toHaveText(/House/);

		const numOfBedroomsElement = page.getByTestId("summary-generalDetails-number-of-storeys-in-building");
		await expect(numOfBedroomsElement.locator("dd")).toHaveText(/2/);

		const storiesElement = page.getByTestId("summary-generalDetails-number-of-bedrooms");
		await expect(storiesElement.locator("dd")).toHaveText(/3/);

		const coolingRequiredElement = page.getByTestId("summary-generalDetails-cooling-required");
		await expect(coolingRequiredElement.locator("dd")).toHaveText(/Yes/);
	});

	test("should persist data when page is reloaded", async ({ page }) => {

		await page.reload();
		await page.click('a[href="/dwelling-details/general-details"]');

		await expect(page.getByTestId("typeOfDwelling_house")).toBeChecked();
		await expect(page.getByTestId("storeysInDwelling")).toHaveValue("2");
		await expect(page.getByTestId("numOfBedrooms")).toHaveValue("3");
		await expect(page.getByTestId("coolingRequired_yes")).toBeChecked();
	});

	test.skip("should persist data when local storage is cleared and page is reloaded", async ({ page }) => {

		await page.evaluate(() => localStorage.clear());

		expect(await getLocalStorage(page)).toBeNull();

		await page.reload();
		await page.click('a[href="/dwelling-details/general-details"]');

		await expect(page.getByTestId("typeOfDwelling_house")).toBeChecked();
		await expect(page.getByTestId("storeysInDwelling")).toHaveValue("2");
		await expect(page.getByTestId("numOfBedrooms")).toHaveValue("3");
		await expect(page.getByTestId("coolingRequired_yes")).toBeChecked();
	});
});