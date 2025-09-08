import ExternalFactors from "./external-factors.vue";
import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";
import type { ExternalFactorsData } from "~/stores/ecaasStore.schema";
import { TerrainClass, VentilationShieldClass } from "~/schema/api-schema.types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

const state: ExternalFactorsData = {
	altitude: 3,
	typeOfExposure: VentilationShieldClass.Shielded,
	terrainType: TerrainClass.Suburban,
	noiseNuisance: false
};

describe("External factors", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(ExternalFactors);

		await user.type(screen.getByTestId("altitude"), "3");
		await user.click(screen.getByTestId("typeOfExposure_Shielded"));
		await user.click(screen.getByTestId("terrainType_Suburban"));
		await user.click(screen.getByTestId("noiseNuisance_no"));
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data, complete } = store.dwellingDetails.externalFactors;
		
		expect(data).toEqual(state);
		expect(complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-details");
	});

	test("updated form data is automatically saved to store", async () => {
		await renderSuspended(ExternalFactors);
		
		await user.type(screen.getByTestId("altitude"), "3");
		await user.click(screen.getByTestId("typeOfExposure_Shielded"));

		const { data } = store.dwellingDetails.externalFactors;

		expect(data.altitude).toBe(3);
		expect(data.typeOfExposure).toBe("Shielded");
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingDetails: {
				externalFactors: {
					data: state
				}
			}
		});

		await renderSuspended(ExternalFactors);
		
		expect((await screen.findByTestId<HTMLInputElement>("altitude")).value).toBe("3");
		expect((await screen.findByTestId("typeOfExposure_Shielded")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("terrainType_Suburban")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("noiseNuisance_no")).hasAttribute("checked")).toBe(true);
	});
		
	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(ExternalFactors);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("altitude_error"))).toBeDefined();
		expect((await screen.findByTestId("typeOfExposure_error"))).toBeDefined();
		expect((await screen.findByTestId("terrainType_error"))).toBeDefined();
		expect((await screen.findByTestId("noiseNuisance_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(ExternalFactors);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("externalFactorsErrorSummary"))).toBeDefined();
	});
});
