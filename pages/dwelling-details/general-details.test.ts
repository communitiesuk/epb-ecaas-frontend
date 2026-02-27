import GeneralDetails from "./general-details.vue";
import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";
import type { GeneralDetailsData, HeatSourceData } from "~/stores/ecaasStore.schema";
import type { SchemaFuelTypeExtended } from "~/schema/aliases";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

const state: GeneralDetailsData = {
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
	numOfWetRooms: 3,
	fuelType: ["elecOnly"],
};

const stateWithFlat: GeneralDetailsData = {
	typeOfDwelling: "flat",
	storeyOfFlat: 1,
	storeysInDwelling: 2,
	storeysInBuilding: 1,
	buildingLength: 10,
	buildingWidth: 5,
	numOfBedrooms: 3,
	numOfUtilityRooms: 2,
	numOfBathrooms: 1,
	numOfWCs: 1,
	numOfHabitableRooms: 4,
	numOfRoomsWithTappingPoints: 2,
	numOfWetRooms: 4,
	fuelType: ["mains_gas"],
};

describe("General details", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	describe("When the dwelling type is a house", () => {

		test("data is saved to store state when form is valid", async () => {
			await renderSuspended(GeneralDetails);
	
			await user.click(screen.getByTestId("typeOfDwelling_house"));
			await user.type(screen.getByTestId("storeysInDwelling"), "2");
			await user.type(screen.getByTestId("buildingLength"), "10");
			await user.type(screen.getByTestId("buildingWidth"), "5");
			await user.type(screen.getByTestId("numOfBedrooms"), "3");
			await user.type(screen.getByTestId("numOfUtilityRooms"), "2");
			await user.type(screen.getByTestId("numOfBathrooms"), "1");
			await user.type(screen.getByTestId("numOfWCs"), "1");
			await user.type(screen.getByTestId("numOfHabitableRooms"), "4");
			await user.type(screen.getByTestId("numOfRoomsWithTappingPoints"), "2");
			await user.type(screen.getByTestId("numOfWetRooms"), "3");
			await user.click(screen.getByTestId("fuelType_elecOnly"));
	
			await user.tab();
			await user.click(screen.getByTestId("saveAndComplete"));
	
			const { data, complete } = store.dwellingDetails.generalSpecifications;
			
			expect(data).toEqual(state);
			expect(complete).toBe(true);
			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-details");
		});

		test("updated form data is automatically saved to store", async () => {
			await renderSuspended(GeneralDetails);
			
			await user.click(screen.getByTestId("typeOfDwelling_house"));
			await user.type(screen.getByTestId("storeysInDwelling"), "2");
	
			expect(store.dwellingDetails.generalSpecifications.data.typeOfDwelling).toBe("house");
			expect(store.dwellingDetails.generalSpecifications.data.storeysInDwelling).toBe("2");
		});

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				dwellingDetails: {
					generalSpecifications: {
						data: state,
					},
				},
			});
	
			await renderSuspended(GeneralDetails);
			
			expect((await screen.findByTestId("typeOfDwelling_house")).hasAttribute("checked")).toBe(true);
			expect((await screen.queryByTestId("storeyOfFlat") as HTMLInputElement)).toBe(null);
			expect((await screen.findByTestId<HTMLInputElement>("storeysInDwelling")).value).toBe("2");
			expect((await screen.findByTestId<HTMLInputElement>("buildingLength")).value).toBe("10");
			expect((await screen.findByTestId<HTMLInputElement>("buildingWidth")).value).toBe("5");
			expect((await screen.findByTestId<HTMLInputElement>("numOfBedrooms")).value).toBe("3");
			expect((await screen.findByTestId<HTMLInputElement>("numOfUtilityRooms")).value).toBe("2");
			expect((await screen.findByTestId<HTMLInputElement>("numOfBathrooms")).value).toBe("1");
			expect((await screen.findByTestId<HTMLInputElement>("numOfWCs")).value).toBe("1");
			expect((await screen.findByTestId<HTMLInputElement>("numOfHabitableRooms")).value).toBe("4");
			expect((await screen.findByTestId<HTMLInputElement>("numOfRoomsWithTappingPoints")).value).toBe("2");
			expect((await screen.findByTestId("fuelType_elecOnly")).hasAttribute("checked")).toBe(true);
		});
			
		test("required error messages are displayed when empty form is submitted", async () => {
			const user = userEvent.setup();

			await renderSuspended(GeneralDetails);

			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("typeOfDwelling_error"))).toBeDefined();
			expect((await screen.findByTestId("storeysInDwelling_error"))).toBeDefined();
			expect((await screen.findByTestId("buildingLength_error"))).toBeDefined();
			expect((await screen.findByTestId("buildingWidth_error"))).toBeDefined();
			expect((await screen.findByTestId("numOfBedrooms_error"))).toBeDefined();
			expect((await screen.findByTestId("numOfUtilityRooms_error"))).toBeDefined();
			expect((await screen.findByTestId("numOfBathrooms_error"))).toBeDefined();
			expect((await screen.findByTestId("numOfWCs_error"))).toBeDefined();
			expect((await screen.findByTestId("numOfHabitableRooms_error"))).toBeDefined();
			expect((await screen.findByTestId("fuelType_error"))).toBeDefined();

			expect(screen.queryByTestId("storeyOfFlat_error")).toBe(null);
		});

		test("error summary is displayed when an invalid form in submitted", async () => {
			const user = userEvent.setup();

			await renderSuspended(GeneralDetails);

			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("generalDetailsErrorSummary"))).toBeDefined();
		});
	});

	describe("When the type of dwelling is a flat", () => {

		test("data is saved to store state when form is valid", async () => {
			const user = userEvent.setup();

			await renderSuspended(GeneralDetails);

			await user.click(screen.getByTestId("typeOfDwelling_flat"));
			await user.type(screen.getByTestId("storeyOfFlat"), "1");
			await user.type(screen.getByTestId("storeysInDwelling"), "2");
			await user.type(screen.getByTestId("storeysInBuilding"), "1");
			await user.type(screen.getByTestId("buildingLength"), "10");
			await user.type(screen.getByTestId("buildingWidth"), "5");
			await user.type(screen.getByTestId("numOfBedrooms"), "3");
			await user.type(screen.getByTestId("numOfUtilityRooms"), "2");
			await user.type(screen.getByTestId("numOfBathrooms"), "1");
			await user.type(screen.getByTestId("numOfWCs"), "1");
			await user.type(screen.getByTestId("numOfHabitableRooms"), "4");
			await user.type(screen.getByTestId("numOfRoomsWithTappingPoints"), "2");
			await user.type(screen.getByTestId("numOfWetRooms"), "4");
			await user.click(screen.getByTestId("fuelType_mains_gas"));

			await user.tab();
			await user.click(screen.getByTestId("saveAndComplete"));

			const { data, complete } = store.dwellingDetails.generalSpecifications;
			
			expect(data).toEqual(stateWithFlat);
			expect(complete).toBe(true);
			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-details");
		});

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				dwellingDetails: {
					generalSpecifications: {
						data: stateWithFlat,
					},
				},
			});

			await renderSuspended(GeneralDetails);
			
			expect((await screen.findByTestId("typeOfDwelling_flat")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("storeyOfFlat")).value).toBe("1");
			expect((await screen.findByTestId<HTMLInputElement>("storeysInDwelling")).value).toBe("2");
			expect((await screen.findByTestId<HTMLInputElement>("storeysInBuilding")).value).toBe("1");
			expect((await screen.findByTestId<HTMLInputElement>("buildingLength")).value).toBe("10");
			expect((await screen.findByTestId<HTMLInputElement>("buildingWidth")).value).toBe("5");
			expect((await screen.findByTestId<HTMLInputElement>("numOfBedrooms")).value).toBe("3");
			expect((await screen.findByTestId<HTMLInputElement>("numOfUtilityRooms")).value).toBe("2");
			expect((await screen.findByTestId<HTMLInputElement>("numOfBathrooms")).value).toBe("1");
			expect((await screen.findByTestId<HTMLInputElement>("numOfWCs")).value).toBe("1");
			expect((await screen.findByTestId<HTMLInputElement>("numOfHabitableRooms")).value).toBe("4");
			expect((await screen.findByTestId<HTMLInputElement>("numOfRoomsWithTappingPoints")).value).toBe("2");
			expect((await screen.findByTestId("fuelType_mains_gas")).hasAttribute("checked")).toBe(true);
		});

		test("required error messages are displayed when empty form is submitted", async () => {
			const user = userEvent.setup();

			await renderSuspended(GeneralDetails);

			await user.click(screen.getByTestId("typeOfDwelling_flat"));
			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("storeyOfFlat_error"))).toBeDefined();
		});
	});
	test.each(["mains_gas", "LPG_bulk", "LPG_bottled", "LPG_condition_11F"])(
		"shows an error when form is saved and fuel type includes '%s' along with 'Electricity is the only energy source'",
		async (fuelType) => {
			await renderSuspended(GeneralDetails);
			await user.click(screen.getByTestId("fuelType_elecOnly"));
			await user.click(screen.getByTestId(`fuelType_${fuelType}`));
			await user.click(screen.getByTestId("saveAndComplete"));

			const errorSummary = await screen.findByTestId("generalDetailsErrorSummary");

			expect(
				errorSummary.textContent.includes("Select Mains gas, LPG (Liquid petroleum gas) or select Electricity is the only energy source"),
			).toBe(true);
		},
	);
	it("if fuel type is updated, it is removed from all objects which reference it", async () => {

		const heatNetworkSpaceHeating: Partial<HeatSourceData> = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c55",
			name: "Heat network 1",
			typeOfHeatSource: "heatNetwork",
			typeOfHeatNetwork: "communalHeatNetwork",
			isHeatNetworkInPcdb: true,
			energySupply: "mains_gas",
		};
		const heatBatterySpaceHeating: Partial<HeatSourceData> = {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c1111",
			name: "Heat battery 1",
			typeOfHeatSource: "heatBattery",
			typeOfHeatBattery: "heatBatteryPcm",
			productReference: "HEAT_BATTERY_SMALL",
			energySupply: "mains_gas",
		};

		const heatNetworkDHW: Partial<DomesticHotWaterHeatSourceData> = {
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
			id: "463c94f6-566c-49b2-af27-57e5c68b5c55",
			name: "Heat source 1",
			typeOfHeatSource: "heatNetwork",
			typeOfHeatNetwork: "communalHeatNetwork",
			energySupply: "mains_gas",
		};

		const heatBatteryDHW: Partial<DomesticHotWaterHeatSourceData> = {
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c1111",
			name: "Heat source 1",
			typeOfHeatSource: "heatBattery",
			typeOfHeatBattery: "heatBatteryPcm",
			energySupply: "mains_gas",
		};
		
		const pointOfUse: Partial<DomesticHotWaterHeatSourceData> = {
			id: "463c94f6-566c-49b2-af27-57e5c111111",
			name: "Point of use",
			typeOfHeatSource: "pointOfUse",
			energySupply: "mains_gas",
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",

		};

		const state: Partial<GeneralDetailsData> = {
			typeOfDwelling: "house",
			fuelType: ["mains_gas", "elecOnly", "LPG_bulk"],
		};

		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					data: state,
				},
			},
			spaceHeating: {
				heatSource: {
					data: [{ data: heatNetworkSpaceHeating }, { data: heatBatterySpaceHeating }],
				},
			},
			domesticHotWater: {
				heatSources: {
					data: [{ data: heatNetworkDHW }, { data: heatBatteryDHW }, { data: pointOfUse }],
				},
			},
		});
		await renderSuspended(GeneralDetails);
		await user.click(await screen.findByTestId("fuelType_mains_gas"));
		const spaceHeatNetwork = store.spaceHeating.heatSource.data[0];
		expect((spaceHeatNetwork?.data as { energySupply: SchemaFuelTypeExtended }).energySupply).toBeUndefined();
		expect(spaceHeatNetwork?.complete).toBe(false);


		const DHWItems = store.domesticHotWater.heatSources.data;
		expect((DHWItems[0]?.data as { energySupply: SchemaFuelTypeExtended }).energySupply).toBeUndefined();
		expect(DHWItems[0]?.complete).toBe(false);
		expect((DHWItems[1]?.data as { energySupply: SchemaFuelTypeExtended }).energySupply).toBeUndefined();
		expect(DHWItems[1]?.complete).toBe(false);
		expect((DHWItems[2]?.data as { energySupply: SchemaFuelTypeExtended }).energySupply).toBeUndefined();
		expect(DHWItems[2]?.complete).toBe(false);

	});
	
});

