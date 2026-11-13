import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import ClearData from "./clear-data.vue";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("clear data page", () => {
	let store: ReturnType<typeof useEcaasStore>;

	beforeEach(() => {
		store = useEcaasStore();
	});

	it("renders page correctly", async () => {
		await renderSuspended(ClearData);

		expect(screen.getByTestId("clearDataPanel")).toBeDefined();
		expect(screen.getByTestId("clearDataButton")).toBeDefined();
		expect(screen.getByTestId("taskListLink")).toBeDefined();
		expect(screen.getByTestId("backLink")).toBeDefined();
	});

	it("clears state and navigates to task list when clear data button is clicked", async () => {
		beforeEach(() => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceZoneParameters: {
						data: state,
						complete: true,
					},
				},
			});
		});
	
		const user = userEvent.setup();

		const state: DwellingSpaceZoneParametersData = {
			volume: 10,
			livingZoneArea: 15,
			groundFloorArea: 12,
			restOfDwellingArea: 8,

		};		

		await renderSuspended(ClearData);

		await user.click(screen.getByRole("button", { name: /Clear data/ }));

		expect(store.dwellingFabric.dwellingSpaceZoneParameters).toStrictEqual({ data: {} });
		expect(navigateToMock).toBeCalledWith("/");
	});

	it("navigates to task list when back link is clicked", async () => {
		const user = userEvent.setup();

		await renderSuspended(ClearData);

		await user.click(screen.getByTestId("backLink"));

		expect(navigateToMock).toBeCalledWith("/");
	});

	it("navigates to task list when go back to task list link is clicked", async () => {
		const user = userEvent.setup();

		await renderSuspended(ClearData);

		await user.click(screen.getByTestId("taskListLink"));

		expect(navigateToMock).toBeCalledWith("/");
	});
});