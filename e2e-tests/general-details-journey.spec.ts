import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const fillGeneralDetailsForm = async (page: Page) => {
	//navigate to General details page
	await page.getByRole("link", { name: "Dwelling details" }).click();
	await page.getByRole("link", { name: "General details" }).nth(0).click();

	//fill out General details form 
	await page.getByTestId("typeOfDwelling_house").click();
	await expect(page.getByTestId("typeOfDwelling_house")).toBeChecked();
	await page.getByTestId("storeysInDwelling").fill("2");
	await expect(page.getByTestId("storeysInDwelling")).toHaveValue("2");
	await page.getByTestId("buildingLength").fill("12");
	await page.getByTestId("buildingWidth").fill("11");
	await page.getByTestId("numOfBedrooms").fill("3");
	await page.getByTestId("numOfUtilityRooms").fill("1");
	await page.getByTestId("numOfBathrooms").fill("3");
	await page.getByTestId("numOfWCs").fill("2");
	await page.getByTestId("numOfHabitableRooms").fill("7");
	await page.getByTestId("numOfRoomsWithTappingPoints").fill("1");
	await page.getByTestId("fuelType_electricity").click();

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
		await expect(page.getByTestId("buildingLength")).toHaveValue("12");
		await expect(page.getByTestId("buildingWidth")).toHaveValue("11");
		await expect(page.getByTestId("numOfBedrooms")).toHaveValue("3");
		await expect(page.getByTestId("numOfUtilityRooms")).toHaveValue("1");
		await expect(page.getByTestId("numOfBathrooms")).toHaveValue("3");
		await expect(page.getByTestId("numOfWCs")).toHaveValue("2");
		await expect(page.getByTestId("numOfHabitableRooms")).toHaveValue("7");
		await expect(page.getByTestId("numOfRoomsWithTappingPoints")).toHaveValue("1");
		await expect(page.getByTestId("fuelType_electricity")).toBeChecked();
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
		await expect(page.getByTestId("numOfWCs")).toHaveValue("2");
		await expect(page.getByTestId("numOfHabitableRooms")).toHaveValue("7");
		await expect(page.getByTestId("numOfRoomsWithTappingPoints")).toHaveValue("1");
		await expect(page.getByTestId("fuelType_electricity")).toBeChecked();
	});

	test.skip("should persist data when local storage is cleared and page is reloaded", async ({ page }) => {

		await page.evaluate(() => localStorage.clear());

		expect(await getLocalStorage(page)).toBeNull();

		await page.reload();
		await page.click('a[href="/dwelling-details/general-details"]');

		await expect(page.getByTestId("typeOfDwelling_house")).toBeChecked();
		await expect(page.getByTestId("storeysInDwelling")).toHaveValue("2");
		await expect(page.getByTestId("buildingLength")).toHaveValue("12");
		await expect(page.getByTestId("buildingWidth")).toHaveValue("11");
		await expect(page.getByTestId("numOfBedrooms")).toHaveValue("3");
		await expect(page.getByTestId("numOfUtilityRooms")).toHaveValue("1");
		await expect(page.getByTestId("numOfBathrooms")).toHaveValue("3");
		await expect(page.getByTestId("numOfWCs")).toHaveValue("2");
		await expect(page.getByTestId("numOfHabitableRooms")).toHaveValue("7");
		await expect(page.getByTestId("numOfRoomsWithTappingPoints")).toHaveValue("1");
		await expect(page.getByTestId("fuelType_electricity")).toBeChecked();
	});
});