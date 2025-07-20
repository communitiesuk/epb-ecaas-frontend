import { test, expect  } from "@playwright/test";
import type {Page} from "@playwright/test";

const fillEnergySupplyForm = async (page: Page) => {
	await page.goto("");
	await page.getByRole('link', { name: 'Heating systems' }).click();
	await page.getByRole('link', { name: 'Energy supply' }).nth(0).click();
  
	await page.getByTestId("fuelType_electricity").check();
	await page.getByTestId("exported_yes").click();
	await page.locator('button:text("Save and continue")').click();
};

const getLocalStorage = async (page: Page) => {
	return await page.evaluate(() => {
		return localStorage.getItem("ecaas") || "{}";
	});
};

test("saved energy supply form data is visible when user revisits the energy supply page", async ({ page }) => {
	await fillEnergySupplyForm(page);

	// revisit the Energy Supply page to confirm data persistence
	await page.click('a[href="/heating-systems/energy-supply"]');

	await expect(page.getByTestId("fuelType_electricity")).toBeChecked();
	await expect(page.getByTestId("exported_yes")).toBeChecked();
});

test("saved energy supply form data is visible on the heating systems summary page", async ({ page }) => {
	await fillEnergySupplyForm(page);
	//navigate to Heating systems summary page
	await page.click('a[href="/heating-systems/summary"]');
  
	const fuelTypeElement = page.getByTestId("summary-energySupply-fuel-type");
	expect(await fuelTypeElement.locator("li").innerText()).toBe("Electricity");

	const exportedElement = page.getByTestId("summary-energySupply-exported");
	const exported = await exportedElement.locator("dd").innerText();
	expect(exported.includes("Yes")).toBe(true);
});

test("saved energy supply form data is persisted to local storage", async ({ page }) => {
	await page.goto("");

	//check localStorage is empty before adding form data
	expect(await getLocalStorage(page)).toBe("{}");

	//add form data
	await fillEnergySupplyForm(page);

	const storedData = JSON.parse(await getLocalStorage(page));
	const { data } = storedData.heatingSystems.energySupply; 

	//check localStorage contains energy supply data
	expect(data.fuelType[0]).toBe("electricity");
	expect(data.exported).toBe(true);
});

test("saved energy supply form data persists on page reload and is reflected in the summary", async ({ page }) => {
	await fillEnergySupplyForm(page);

	//reload energy supply page to check data persists
	await page.getByRole('link', { name: 'Energy supply' }).nth(0).click();
	await page.reload();

	await expect(page.getByTestId("fuelType_electricity")).toBeChecked({timeout:10000});
	await expect(page.getByTestId("exported_yes")).toBeChecked();
	
	//check data is persisted on the summary page
	await page.click('a[href="/heating-systems/summary"]');

	const fuelTypeElement = page.getByTestId("summary-energySupply-fuel-type");
	expect(await fuelTypeElement.locator("li").innerText()).toBe("Electricity");

	const exportedElement = page.getByTestId("summary-energySupply-exported");
	const exported = await exportedElement.locator("dd").innerText();
	expect(exported.includes("Yes")).toBe(true);
});

test.skip("saved energy supply form data persists when local storage is cleared", async ({ page }) => {
	await fillEnergySupplyForm(page);

	//clear localStorage
	await page.evaluate(() => localStorage.clear());
  
	//check localStorage is empty
	expect(await getLocalStorage(page)).toBe("{}");

	//reload page and navigate to the heating systems summary page
	await page.reload();
	await page.click('a[href="/heating-systems/summary"]');

	//check data is readded to localStorage 
	expect(await getLocalStorage(page)).not.toBe("{}");

	//check the UI reflects hydrated data
	const fuelTypeElement = page.getByTestId("summary-energySupply-fuel-type");
	expect(await fuelTypeElement.locator("li").innerText()).toBe("Electricity");
  
	const exportedElement = page.getByTestId("summary-energySupply-exported");
	const exported = await exportedElement.locator("dd").innerText();
	expect(exported.includes("Yes")).toBe(true);
});