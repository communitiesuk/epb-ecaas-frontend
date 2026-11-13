import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const resetState = async (page: Page) => {
	await page.goto("/");
	await page.waitForLoadState("networkidle");
	await page.evaluate(() => localStorage.clear());
};
const navigateToGeneralDetails = async (page: Page) => {
	await page.getByTestId("taskList_dwellingDetails").click();
	await page.getByTestId("taskList_generalSpecifications").click(); 
	await page.waitForLoadState("networkidle");
	
};
const fillGeneralDetailsForm = async (page: Page) => {
	await page.getByTestId("typeOfDwelling_house").click();
	await page.getByTestId("storeysInDwelling").fill("2");
	await page.getByTestId("buildingLength").fill("12");
	await page.getByTestId("buildingWidth").fill("11");
	await page.getByTestId("numOfBedrooms").fill("3");
	await page.getByTestId("numOfUtilityRooms").fill("1");
	await page.getByTestId("numOfBathrooms").fill("3");
	await page.getByTestId("numOfHabitableRooms").fill("7");
	await page.getByTestId("numOfRoomsWithTappingPoints").fill("1");
	await page.getByTestId("numOfWetRooms").fill("4");
	await page.getByTestId("canExportToGrid_no_export").click();
	await page.getByTestId("isPartGCompliant_yes").click();
	await page.getByTestId("partOActiveCoolingRequired_no").click();

	//save form
	await page.getByTestId("saveAndComplete").click();
	await page.waitForLoadState("networkidle");
};

test.beforeEach(async ({ page }) => {
	await resetState(page);
	await navigateToGeneralDetails(page);
	await fillGeneralDetailsForm(page);
});

test.describe("General details form data persistence", () => {

	test("should persist data when revisiting the form page", async ({ page }) => {

		await page.click('a[href="/dwelling-details/general-details"]');

		await expect(page.getByTestId("typeOfDwelling_house")).toBeChecked();
		await expect(page.getByTestId("storeysInDwelling")).toHaveValue("2");
		await expect(page.getByTestId("buildingLength")).toHaveValue("12");
		await expect(page.getByTestId("buildingWidth")).toHaveValue("11");
		await expect(page.getByTestId("numOfBedrooms")).toHaveValue("3");
		await expect(page.getByTestId("numOfUtilityRooms")).toHaveValue("1");
		await expect(page.getByTestId("numOfBathrooms")).toHaveValue("3");
		await expect(page.getByTestId("numOfHabitableRooms")).toHaveValue("7");
		await expect(page.getByTestId("numOfRoomsWithTappingPoints")).toHaveValue("1");
		await expect(page.getByTestId("fuelType_electricity")).toBeChecked();
		await expect(page.getByTestId("numOfWetRooms")).toHaveValue("4");
		await expect(page.getByTestId("canExportToGrid_no_export")).toBeChecked();
		await expect(page.getByTestId("isPartGCompliant_yes")).toBeChecked();
		await expect(page.getByTestId("partOActiveCoolingRequired_no")).toBeChecked();
	});

	test("should persist data when page is reloaded", async ({ page }) => {

		await page.reload();
		await page.click('a[href="/dwelling-details/general-details"]');

		await expect(page.getByTestId("typeOfDwelling_house")).toBeChecked();
		await expect(page.getByTestId("storeysInDwelling")).toHaveValue("2");
		await expect(page.getByTestId("buildingLength")).toHaveValue("12");
		await expect(page.getByTestId("buildingWidth")).toHaveValue("11");
		await expect(page.getByTestId("numOfBedrooms")).toHaveValue("3");
		await expect(page.getByTestId("numOfUtilityRooms")).toHaveValue("1");
		await expect(page.getByTestId("numOfBathrooms")).toHaveValue("3");
		await expect(page.getByTestId("numOfHabitableRooms")).toHaveValue("7");
		await expect(page.getByTestId("numOfRoomsWithTappingPoints")).toHaveValue("1");
		await expect(page.getByTestId("fuelType_electricity")).toBeChecked();
		await expect(page.getByTestId("numOfWetRooms")).toHaveValue("4");
		await expect(page.getByTestId("canExportToGrid_no_export")).toBeChecked();
		await expect(page.getByTestId("isPartGCompliant_yes")).toBeChecked();
		await expect(page.getByTestId("partOActiveCoolingRequired_no")).toBeChecked();
	});

	test.skip("should persist data when local storage is cleared and page is reloaded", async ({ page }) => {
		// I dont think this should be the case

		await page.evaluate(() => localStorage.clear());

		await page.reload();
		await page.waitForLoadState("networkidle");
		// form is populated with previously entered data
		await expect(page.getByTestId("typeOfDwelling_house")).toBeChecked();
		await expect(page.getByTestId("storeysInDwelling")).toHaveValue("2");
		expect(page.getByTestId("buildingLength")).toBeEditable();
		//await expect(page.getByTestId("buildingLength")).toHaveValue("12");
		await expect(page.getByTestId("buildingWidth")).toHaveValue("11");
		await expect(page.getByTestId("numOfBedrooms")).toHaveValue("3");
		await expect(page.getByTestId("numOfUtilityRooms")).toHaveValue("1");
		await expect(page.getByTestId("numOfBathrooms")).toHaveValue("3");
		await expect(page.getByTestId("numOfHabitableRooms")).toHaveValue("7");
		await expect(page.getByTestId("numOfRoomsWithTappingPoints")).toHaveValue("1");
		await expect(page.getByTestId("fuelType_electricity")).toBeChecked();
		await expect(page.getByTestId("numOfWetRooms")).toHaveValue("4");
		await expect(page.getByTestId("canExportToGrid_no_export")).toBeChecked();
		await expect(page.getByTestId("isPartGCompliant_yes")).toBeChecked();
		await expect(page.getByTestId("partOActiveCoolingRequired_no")).toBeChecked();
	});
});