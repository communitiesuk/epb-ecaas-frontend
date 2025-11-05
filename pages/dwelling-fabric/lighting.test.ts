import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { screen } from "@testing-library/vue";
import Lighting from "./lighting.vue";
import userEvent from "@testing-library/user-event";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

const state: DwellingSpaceLightingData = {
	numberOfBulbs: 9,
	power: 5,
	efficacy: 120,
};

const store = useEcaasStore();
const user = userEvent.setup();

beforeEach(() => {
	store.$reset();
});

describe("lighting", () => {

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(Lighting);

		await user.type(screen.getByTestId("numberOfBulbs"), "9");
		await user.type(screen.getByTestId("power"), "5");
		await user.type(screen.getByTestId("efficacy"), "120");
		await user.tab();
		await(user.click(screen.getByTestId("saveAndComplete")));


		const { data, complete } = store.dwellingFabric.dwellingSpaceLighting;

		expect(data).toEqual(state);
		expect(complete).toBe(true);
		expect(navigateToMock).toBeCalledWith("/dwelling-fabric");
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceLighting: { data: state },
			},
		});

		await renderSuspended(Lighting);

		expect((await screen.findByTestId<HTMLInputElement>("numberOfBulbs")).value).toBe("9");
		expect((await screen.findByTestId<HTMLInputElement>("power")).value).toBe("5");
		expect((await screen.findByTestId<HTMLInputElement>("efficacy")).value).toBe("120");
	});
			
	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(Lighting);

		await(user.click(screen.getByTestId("saveAndComplete")));

		expect((await screen.findByTestId("numberOfBulbs_error"))).toBeDefined();
		expect((await screen.findByTestId("power_error"))).toBeDefined();
		expect((await screen.findByTestId("efficacy_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(Lighting);

		await(user.click(screen.getByTestId("saveAndComplete")));

		expect((await screen.findByTestId("lightingErrorSummary"))).toBeDefined();
	});

	test("save progress button navigates user to the dwelling fabric overview page", async () => {
		await renderSuspended(Lighting);
	
		await user.type(screen.getByTestId("numberOfBulbs"), "10");
		await user.click(screen.getByTestId("saveProgress"));
				
		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric");
	});
});


describe("Partially saving data", () => {
	
	test("form data is automatically saved to store", async () => {
		await renderSuspended(Lighting);

		await user.type(screen.getByTestId("numberOfBulbs"), "9");
		await user.tab();

		expect(
			store.dwellingFabric.dwellingSpaceLighting.data.numberOfBulbs,
		).toBe(9);
	});
});
