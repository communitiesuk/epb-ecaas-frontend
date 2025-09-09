import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import LinearBridging from "./[bridging].vue";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("linear thermal bridges", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const state: EcaasForm<LinearThermalBridgeData> = {
		data: {
			name: "E1: Steel lintel with perforated steel base plate",
			typeOfThermalBridge: "e1",
			linearThermalTransmittance: 1,
			length: 2
		}
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.selectOptions(screen.getByTestId("typeOfThermalBridge"), "e1");
		await user.type(screen.getByTestId("linearThermalTransmittance"), "1");
		await user.type(screen.getByTestId("length"), "2");
		await user.tab();
	};
	
	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(LinearBridging, {
			route: {
				params: { linear: "create" },
			},
		});

		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges;

		expect(data[0]).toEqual({ ...state, complete: true });
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceThermalBridging: {
					dwellingSpaceLinearThermalBridges: {
						data: [state]
					}
				}
			}
		});

		await renderSuspended(LinearBridging, {
			route: {
				params: { bridging: "0" }
			}
		});

		expect((await screen.findByTestId<HTMLSelectElement>("typeOfThermalBridge")).value).toBe("e1");
		expect((await screen.findByTestId<HTMLInputElement>("linearThermalTransmittance")).value).toBe("1");
		expect((await screen.findByTestId<HTMLInputElement>("length")).value).toBe("2");
	});

	it("shows required error messages when empty form is submitted", async () => {
		await renderSuspended(LinearBridging);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("typeOfThermalBridge_error"))).toBeDefined();
		expect((await screen.findByTestId("linearThermalTransmittance_error"))).toBeDefined();
		expect((await screen.findByTestId("length_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(LinearBridging);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("linearBridgeErrorSummary"))).toBeDefined();
	});

	it("navigates to thermal bridging page when valid form is completed", async () => {
		await renderSuspended(LinearBridging);
	
		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-space/thermal-bridging");
	});

	it("navigates to thermal bridging page when save progress button is clicked", async () => {
		await renderSuspended(LinearBridging);

		await populateValidForm();
		await user.click(screen.getByTestId("saveProgress"));

		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-space/thermal-bridging");
	});

	describe("partially saving data", () => {
		it("creates a new thermal linear bridge automatically with name derived from selected type", async () => {
			await renderSuspended(LinearBridging, {
				route: {
					params: { linear: "create" }
				}
			});

			await user.selectOptions(screen.getByTestId("typeOfThermalBridge"), "e1");
			await user.tab();

			const actualLinearBridge = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges.data[0]!;
			expect(actualLinearBridge.data.name).toBe("E1: Steel lintel with perforated steel base plate");
			expect(actualLinearBridge.data.length).toBeUndefined();
		});

		it("creates a new thermal linear bridge automatically with default name after other data is entered", async () => {
			await renderSuspended(LinearBridging, {
				route: {
					params: { linear: "create" }
				}
			});

			await user.type(screen.getByTestId("linearThermalTransmittance"), "5");
			await user.tab();

			const actualLinearBridge = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges.data[0]!;
			expect(actualLinearBridge.data.name).toBe("Linear thermal bridge");
			expect(actualLinearBridge.data.linearThermalTransmittance).toBe(5);
			expect(actualLinearBridge.data.length).toBeUndefined();
		});

		it("saves updated form data to correct store object automatically", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceThermalBridging: {
						dwellingSpaceLinearThermalBridges: {
							data: [state, state]
						}
					}
				}
			});

			await renderSuspended(LinearBridging, {
				route: {
					params: { linear: "1" }
				}
			});

			await user.clear(screen.getByTestId("length"));
			await user.clear(screen.getByTestId("linearThermalTransmittance"));
			await user.tab();

			await user.type(screen.getByTestId("length"), "14");
			await user.type(screen.getByTestId("linearThermalTransmittance"), "6");
			await user.tab();

			const actualLinearBridge = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges.data[1]!;
			expect(actualLinearBridge.data.length).toBe(14);
			expect(actualLinearBridge.data.linearThermalTransmittance).toBe(6);
		});
	});
});