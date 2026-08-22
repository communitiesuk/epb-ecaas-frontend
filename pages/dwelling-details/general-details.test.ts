import GeneralDetails from "./general-details.vue";
import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";
import type { GeneralDetailsData } from "~/stores/ecaasStore.schema";

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
	numOfHabitableRooms: 4,
	numOfRoomsWithTappingPoints: 2,
	numOfWetRooms: 3,
	fuelType: ["electricity"],
	canExportToGrid: "yes",
	maxPowerExported: { amount: 50, unit: "kilowatt" },
	isPartGCompliant: true,
	partOActiveCoolingRequired: false,
};

const stateWithFlat: GeneralDetailsData = {
	typeOfDwelling: "flat",
	storeysInDwelling: 2,
	storeysInBuilding: 3,
	buildingLength: 10,
	buildingWidth: 5,
	numOfBedrooms: 3,
	numOfUtilityRooms: 2,
	numOfBathrooms: 1,
	numOfHabitableRooms: 4,
	numOfRoomsWithTappingPoints: 2,
	numOfWetRooms: 4,
	fuelType: ["electricity", "mains_gas"],
	canExportToGrid: "no_generation",
	isPartGCompliant: true,
	partOActiveCoolingRequired: false,
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
			await user.type(screen.getByTestId("numOfHabitableRooms"), "4");
			await user.type(screen.getByTestId("numOfRoomsWithTappingPoints"), "2");
			await user.type(screen.getByTestId("numOfWetRooms"), "3");
			await user.click(screen.getByTestId("canExportToGrid_yes"));
			await user.type(screen.getByTestId("maxPowerExported"), "50");
			await user.click(screen.getByTestId("isPartGCompliant_yes"));
			await user.click(screen.getByTestId("partOActiveCoolingRequired_no"));
	
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
			expect(store.dwellingDetails.generalSpecifications.data.storeysInDwelling).toBe(2);
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
			expect((await screen.findByTestId<HTMLInputElement>("storeysInDwelling")).value).toBe("2");
			expect((await screen.findByTestId<HTMLInputElement>("buildingLength")).value).toBe("10");
			expect((await screen.findByTestId<HTMLInputElement>("buildingWidth")).value).toBe("5");
			expect((await screen.findByTestId<HTMLInputElement>("numOfBedrooms")).value).toBe("3");
			expect((await screen.findByTestId<HTMLInputElement>("numOfUtilityRooms")).value).toBe("2");
			expect((await screen.findByTestId<HTMLInputElement>("numOfBathrooms")).value).toBe("1");
			expect((await screen.findByTestId<HTMLInputElement>("numOfHabitableRooms")).value).toBe("4");
			expect((await screen.findByTestId<HTMLInputElement>("numOfRoomsWithTappingPoints")).value).toBe("2");
			expect((await screen.findByTestId("canExportToGrid_yes")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId("isPartGCompliant_yes")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId("partOActiveCoolingRequired_no")).hasAttribute("checked")).toBe(true);
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
			expect((await screen.findByTestId("numOfHabitableRooms_error"))).toBeDefined();
			expect((await screen.findByTestId("canExportToGrid_error"))).toBeDefined();
			expect((await screen.findByTestId("isPartGCompliant_error"))).toBeDefined();
			expect((await screen.findByTestId("partOActiveCoolingRequired"))).toBeDefined();
		});

		test("error summary is displayed when an invalid form in submitted", async () => {
			const user = userEvent.setup();

			await renderSuspended(GeneralDetails);

			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("generalDetailsErrorSummary"))).toBeDefined();
		});

		test("if energy generated on site can be exported to the grid is true, maximum power that can be exported field shows", async() => {
			const user = userEvent.setup();

			await renderSuspended(GeneralDetails);

			await user.click(screen.getByTestId("canExportToGrid_yes"));

			expect(screen.getByTestId("maxPowerExported")).toBeDefined();
		});

		test("maximum power that can be exported field is not shown when energy cannot be exported", async () => {
			await renderSuspended(GeneralDetails);

			expect(screen.queryByTestId("maxPowerExported")).toBeNull();

			await user.click(screen.getByTestId("canExportToGrid_no_export"));

			expect(screen.queryByTestId("maxPowerExported")).toBeNull();
		});

		test("shows error if maximum power that can be exported exceeds 100 kW", async () => {
			await renderSuspended(GeneralDetails);

			await user.click(screen.getByTestId("canExportToGrid_yes"));
			await user.type(screen.getByTestId("maxPowerExported"), "101");

			await user.tab();

			await user.click(screen.getByTestId("saveAndComplete"));

			const errorSummary = screen.getByTestId("generalDetailsErrorSummary");
			expect(errorSummary.textContent).toContain("Maximum power that can be exported must be 100 kilowatts or less.");
		});
	});
	
	describe("When the type of dwelling is a flat", () => {

		test("data is saved to store state when form is valid", async () => {
			const user = userEvent.setup();

			await renderSuspended(GeneralDetails);

			await user.click(screen.getByTestId("typeOfDwelling_flat"));
			await user.type(screen.getByTestId("storeysInDwelling"), "2");
			await user.type(screen.getByTestId("storeysInBuilding"), "3");
			await user.type(screen.getByTestId("buildingLength"), "10");
			await user.type(screen.getByTestId("buildingWidth"), "5");
			await user.type(screen.getByTestId("numOfBedrooms"), "3");
			await user.type(screen.getByTestId("numOfUtilityRooms"), "2");
			await user.type(screen.getByTestId("numOfBathrooms"), "1");
			await user.type(screen.getByTestId("numOfHabitableRooms"), "4");
			await user.type(screen.getByTestId("numOfRoomsWithTappingPoints"), "2");
			await user.type(screen.getByTestId("numOfWetRooms"), "4");
			await user.click(screen.getByTestId("fuelType_mains_gas"));
			await user.click(screen.getByTestId("canExportToGrid_no_generation"));
			await user.click(screen.getByTestId("isPartGCompliant_yes"));
			await user.click(screen.getByTestId("partOActiveCoolingRequired_no"));

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
			// expect((await screen.findByTestId<HTMLInputElement>("storeyOfFlat")).value).toBe("1");
			expect((await screen.findByTestId<HTMLInputElement>("storeysInDwelling")).value).toBe("2");
			expect((await screen.findByTestId<HTMLInputElement>("storeysInBuilding")).value).toBe("3");
			expect((await screen.findByTestId<HTMLInputElement>("buildingLength")).value).toBe("10");
			expect((await screen.findByTestId<HTMLInputElement>("buildingWidth")).value).toBe("5");
			expect((await screen.findByTestId<HTMLInputElement>("numOfBedrooms")).value).toBe("3");
			expect((await screen.findByTestId<HTMLInputElement>("numOfUtilityRooms")).value).toBe("2");
			expect((await screen.findByTestId<HTMLInputElement>("numOfBathrooms")).value).toBe("1");
			expect((await screen.findByTestId<HTMLInputElement>("numOfHabitableRooms")).value).toBe("4");
			expect((await screen.findByTestId<HTMLInputElement>("numOfRoomsWithTappingPoints")).value).toBe("2");
			expect((await screen.findByTestId("fuelType_mains_gas")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId("canExportToGrid_no_generation")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId("isPartGCompliant_yes")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId("partOActiveCoolingRequired_no")).hasAttribute("checked")).toBe(true);
		});

		test("required error messages are displayed when empty form is submitted", async () => {
			const user = userEvent.setup();

			await renderSuspended(GeneralDetails);

			await user.click(screen.getByTestId("typeOfDwelling_flat"));
			await user.click(screen.getByTestId("saveAndComplete"));

		});
	});

	it("when type of dwelling is updated from flat to house, updates store so any internal door is not a front door", async () => {
		const internalDoor: EcaasForm<Partial<InternalDoorData>> = {
			data: {
				typeOfInternalDoor: "heatedSpace",
				name: "Internal 1",
				associatedItemId: "wall-id",
				isTheFrontDoor: true,
				orientation: 20,
			},
		};
		
		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					data: stateWithFlat,
				},
			},
			dwellingFabric: {
				dwellingSpaceDoors: {
					dwellingSpaceInternalDoor: {
						data: [internalDoor],
					},
				},
			},
		});

		await renderSuspended(GeneralDetails);
		await user.click(screen.getByTestId("typeOfDwelling_house"));
		expect(store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor.data[0]?.data).toEqual(
			{
				typeOfInternalDoor: "heatedSpace",
				name: "Internal 1",
				associatedItemId: "wall-id",
				isTheFrontDoor: undefined, 
				orientation: undefined,
			});
	});
});

