import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import PointBridging from "./[bridging].vue";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("point thermal bridges", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const state: EcaasForm<PointThermalBridgeData> = {
		data: {
			name: "Point 1",
			heatTransferCoefficient: 1
		}
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Point 1");
		await user.type(screen.getByTestId("heatTransferCoefficient"), "1");
		await user.tab();
	};
	
	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(PointBridging, {
			route: {
				params: { system: "create" },
			},
		});

		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpacePointThermalBridges;
		expect(data[0]).toEqual({ ...state, complete: true });
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceThermalBridging: {
					dwellingSpacePointThermalBridges: {
						data: [state]
					}
				}
			}
		});

		await renderSuspended(PointBridging, {
			route: {
				params: { bridging: "0" }
			}
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Point 1");
		expect((await screen.findByTestId<HTMLInputElement>("heatTransferCoefficient")).value).toBe("1");
	});

	it("shows required error messages when empty form is submitted", async () => {
		await renderSuspended(PointBridging);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("heatTransferCoefficient_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(PointBridging);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("pointBridgeErrorSummary"))).toBeDefined();
	});

	it("navigates to thermal bridging page when valid form is completed", async () => {
		await renderSuspended(PointBridging);
	
		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));
		
		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-space/thermal-bridging");
	});

	it("navigates to thermal bridging page when save progress button is clicked", async () => {
		await renderSuspended(PointBridging);

		await populateValidForm();
		await user.click(screen.getByTestId("saveProgress"));

		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-space/thermal-bridging");
	});
});