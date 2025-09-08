import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { screen } from "@testing-library/vue";
import Lighting from "./lighting.vue";
import userEvent from "@testing-library/user-event";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

const state: DwellingSpaceLightingData = {
	numberOfLEDBulbs: 9,
	numberOfIncandescentBulbs: 0,
};

describe("lighting", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	beforeEach(() => {
		store.$reset();
	});

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(Lighting);

		await user.type(screen.getByTestId("numberOfLEDBulbs"), "9");
		await user.type(screen.getByTestId("numberOfIncandescentBulbs"), "0");
		await user.tab();
		await user.click(screen.getByRole("button"));

		const { data, complete } = store.dwellingFabric.dwellingSpaceLighting;

		expect(data).toEqual(state);
		expect(complete).toBe(true);
		expect(navigateToMock).toBeCalledWith("/dwelling-space");
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceLighting: { data: state }
			}
		});

		await renderSuspended(Lighting);

		expect((await screen.findByTestId<HTMLInputElement>("numberOfLEDBulbs")).value).toBe("9");
		expect((await screen.findByTestId<HTMLInputElement>("numberOfIncandescentBulbs")).value).toBe("0");
	});
			
	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(Lighting);

		await user.click(screen.getByRole("button"));

		expect((await screen.findByTestId("numberOfLEDBulbs_error"))).toBeDefined();
		expect((await screen.findByTestId("numberOfIncandescentBulbs_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(Lighting);

		await user.click(screen.getByRole("button"));

		expect((await screen.findByTestId("lightingErrorSummary"))).toBeDefined();
	});
});