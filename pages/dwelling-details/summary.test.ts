import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import Summary from "./summary.vue";
import { screen } from "@testing-library/vue";
import hyphenate from "../../utils/hyphenate";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

interface DwellingDetailSummary {
	generalDetails: GeneralDetailsData,
	shading: ShadingData[],
	externalFactors: ExternalFactorsData,
	appliances: AppliancesData
}

const state: DwellingDetailSummary = {
	generalDetails: {
		typeOfDwelling: "house",
		storeysInDwelling: 2,
		buildingLength: 10,
		buildingWidth: 5,
		numOfBedrooms: 3,
		numOfUtilityRooms: 2,
		numOfBathrooms: 1,
		numOfWCs: 1,
		numOfHabitableRooms: 4,
		numOfRoomsWithTappingPoints: 2,
		fuelType: ["mains_gas", "LPG_bulk"],
	},
	shading: [{
		name: "Shading 1",
		startAngle: 0,
		endAngle: 90,
		objectType: "obstacle",
		height: 1,
		distance: 4,
	}],
	externalFactors: {
		altitude: 3,
		typeOfExposure: "Shielded",
		terrainType: "Suburban",
		noiseNuisance: false,
	},
	appliances: {
		applianceType: ["Clothes_drying", "Freezer", "Clothes_washing"],
	},
};

describe("Dwelling details summary", () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it("should contain the correct tabs for dwelling details", async () => {
		await renderSuspended(Summary);

		expect(screen.getByRole("link", { name: "General details" }));
		expect(screen.getByRole("link", { name: "Shading" }));
		expect(screen.getByRole("link", { name: "External factors" }));
		expect(screen.getByRole("link", { name: "Appliances" }));
	});

	it("should display the correct data for the general details section", async () => {
		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					data: state.generalDetails,
				},
			},
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Type of dwelling": "House",
			"Number of storeys in building": "2",
			"Building length": "10 m",
			"Building width": "5 m",
			"Number of bedrooms": "3",
			"Number of utility rooms": "2",
			"Number of bathrooms": "1",
			"Number of WCs": "1",
			"Number of habitable rooms": "4",
			"Total number of rooms with tapping points": "2",
			"Energy sources": "Mains gas, LPG (Liquid petroleum gas), Electricity",
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-generalDetails-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});

	it("should display the correct data for the appliances section", async () => {
		store.$patch({
			dwellingDetails: {
				appliances: {
					data: state.appliances,
				},
			},
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Appliances": "Tumble dryer, Freezer, Washing machine",
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-appliances-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});
});