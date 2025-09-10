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
	
	it("data is saved to store state when form is valid", async () => {
		await renderSuspended(PointBridging, {
			route: {
				params: { point: "create" },
			},
		});

		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpacePointThermalBridges;
		expect(data[0]).toEqual({ ...state, complete: true });
	});

	it("form is prepopulated when data exists in state", async () => {
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

	describe("partially saving data", () => {
		it("creates a new thermal point bridge automatically with given name", async () => {
			await renderSuspended(PointBridging, {
				route: {
					params: { point: "create" }
				}
			});

			await user.type(screen.getByTestId("name"), "New point bridge");
			await user.tab();

			const actualPointBridge = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpacePointThermalBridges.data[0]!;
			expect(actualPointBridge.data.name).toBe("New point bridge");
			expect(actualPointBridge.data.heatTransferCoefficient).toBeUndefined();
		});

		it("creates a new thermal point bridge automatically with default name after other data is entered", async () => {
			await renderSuspended(PointBridging, {
				route: {
					params: { point: "create" }
				}
			});

			await user.type(screen.getByTestId("heatTransferCoefficient"), "2");
			await user.tab();

			const actualPointBridge = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpacePointThermalBridges.data[0]!;
			expect(actualPointBridge.data.name).toBe("Point thermal bridge");
			expect(actualPointBridge.data.heatTransferCoefficient).toBe(2);
		});

		it("saves updated form data to correct store object automatically", async () => {
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
					params: { point: "0" }
				}
			});

			await user.clear(screen.getByTestId("name"));
			await user.clear(screen.getByTestId("heatTransferCoefficient"));

			await user.type(screen.getByTestId("name"), "Updated point bridge");
			await user.type(screen.getByTestId("heatTransferCoefficient"), "4");
			await user.tab();

			const actualPointBridge = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpacePointThermalBridges.data[0]!;
			expect(actualPointBridge.data.name).toBe("Updated point bridge");
			expect(actualPointBridge.data.heatTransferCoefficient).toBe(4);
		});
	});
});