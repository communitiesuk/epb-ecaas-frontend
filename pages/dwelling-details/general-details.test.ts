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
	numOfBedrooms: 3,
	coolingRequired: false,
};

const stateWithFlat: GeneralDetailsData = {
	typeOfDwelling: "flat",
	storeysInDwelling: 7,
	storeyOfFlat: 3,
	numOfBedrooms: 3,
	coolingRequired: false,
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
			await user.type(screen.getByTestId("numOfBedrooms"), "3");
			await user.click(screen.getByTestId("coolingRequired_no"));
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
			expect((await screen.findByTestId<HTMLInputElement>("storeysInDwelling")).value).toBe("2");
			expect((await screen.queryByTestId("storeyOfFlat") as HTMLInputElement)).toBe(null);
			expect((await screen.findByTestId<HTMLInputElement>("numOfBedrooms")).value).toBe("3");
			expect((await screen.findByTestId("coolingRequired_no")).hasAttribute("checked")).toBe(true);
		});
			
		test("required error messages are displayed when empty form is submitted", async () => {
			const user = userEvent.setup();

			await renderSuspended(GeneralDetails);

			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("typeOfDwelling_error"))).toBeDefined();
			expect((await screen.findByTestId("storeysInDwelling_error"))).toBeDefined();
			expect((await screen.findByTestId("numOfBedrooms_error"))).toBeDefined();
			expect((await screen.findByTestId("coolingRequired_error"))).toBeDefined();

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
			await user.type(screen.getByTestId("storeysInDwelling"), "7");
			await user.type(screen.getByTestId("storeyOfFlat"), "3");
			await user.type(screen.getByTestId("numOfBedrooms"), "3");
			await user.click(screen.getByTestId("coolingRequired_no"));
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
			expect((await screen.findByTestId<HTMLInputElement>("storeysInDwelling")).value).toBe("7");
			expect((await screen.findByTestId<HTMLInputElement>("storeyOfFlat")).value).toBe("3");
			expect((await screen.findByTestId<HTMLInputElement>("numOfBedrooms")).value).toBe("3");
			expect((await screen.findByTestId("coolingRequired_no")).hasAttribute("checked")).toBe(true);
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

