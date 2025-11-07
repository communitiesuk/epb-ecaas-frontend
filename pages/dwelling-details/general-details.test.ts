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
	numOfWCs: 1,
	numOfHabitableRooms: 4,
	numOfRoomsWithTappingPoints: 2,
	fuelType: ["electricity"],
};

const stateWithFlat: GeneralDetailsData = {
	typeOfDwelling: "flat",
	storeyOfFlat: 1,
	storeysInDwelling: 2,
	buildingLength: 10,
	buildingWidth: 5,
	numOfBedrooms: 3,
	numOfUtilityRooms: 2,
	numOfBathrooms: 1,
	numOfWCs: 1,
	numOfHabitableRooms: 4,
	numOfRoomsWithTappingPoints: 2,
	fuelType: ["electricity", "mains_gas"],
};

describe("General details", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	describe("When the dwelling type is a house", () => {

		test("electricity is preselected as fuel type", async () => {
			await renderSuspended(GeneralDetails);
			expect((await screen.findByTestId("fuelType_electricity")).hasAttribute("checked")).toBe(true);
		}),

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
			expect((await screen.findByTestId("fuelType_electricity")).hasAttribute("checked")).toBe(true);
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
			await user.type(screen.getByTestId("buildingLength"), "10");
			await user.type(screen.getByTestId("buildingWidth"), "5");
			await user.type(screen.getByTestId("numOfBedrooms"), "3");
			await user.type(screen.getByTestId("numOfUtilityRooms"), "2");
			await user.type(screen.getByTestId("numOfBathrooms"), "1");
			await user.type(screen.getByTestId("numOfWCs"), "1");
			await user.type(screen.getByTestId("numOfHabitableRooms"), "4");
			await user.type(screen.getByTestId("numOfRoomsWithTappingPoints"), "2");
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

});

