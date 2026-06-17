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
			typeOfThermalBridge: "E1",
			linearThermalTransmittance: 1,
			length: 2,
			reference: "Ref",
		},
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.selectOptions(screen.getByTestId("typeOfThermalBridge"), "E1");
		await user.type(screen.getByTestId("linearThermalTransmittance"), "1");
		await user.type(screen.getByTestId("length"), "2");
		await user.type(screen.getByTestId("reference"), "Ref");
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
						data: [state],
					},
				},
			},
		});

		await renderSuspended(LinearBridging, {
			route: {
				params: { bridging: "0" },
			},
		});

		expect((await screen.findByTestId<HTMLSelectElement>("typeOfThermalBridge")).value).toBe("E1");
		expect((await screen.findByTestId<HTMLInputElement>("linearThermalTransmittance")).value).toBe("1");
		expect((await screen.findByTestId<HTMLInputElement>("length")).value).toBe("2");
		expect((await screen.findByTestId<HTMLInputElement>("reference")).value).toBe("Ref");
	});

	it("shows required error messages when empty form is submitted", async () => {
		await renderSuspended(LinearBridging);

		await user.click(screen.getByTestId("saveAndComplete"));
		expect((await screen.findByTestId("typeOfThermalBridge_error"))).toBeDefined();
	});

	it("shows required error messages when only type of thermal bridge is submitted", async () => {
		await renderSuspended(LinearBridging);

		await user.selectOptions(screen.getByTestId("typeOfThermalBridge"), "E1");
		await user.click(screen.getByTestId("saveAndComplete"));

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

		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/thermal-bridging");
	});

	it("navigates to thermal bridging page when save progress button is clicked", async () => {
		await renderSuspended(LinearBridging);

		await populateValidForm();
		await user.click(screen.getByTestId("saveProgress"));

		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/thermal-bridging");
	});

	describe("partially saving data", () => {
		it("creates a new thermal linear bridge automatically with a default name", async () => {
			await renderSuspended(LinearBridging, {
				route: {
					params: { linear: "create" },
				},
			});

			await user.selectOptions(screen.getByTestId("typeOfThermalBridge"), "E1");
			await user.tab();

			const actualLinearBridge = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges.data[0]!;
			expect(actualLinearBridge.data.name).toBe("E1: Steel lintel with perforated steel base plate");
			expect(actualLinearBridge.data.length).toBeUndefined();
		});

		it("creates a new thermal linear bridge automatically with default name after other data is entered", async () => {
			await renderSuspended(LinearBridging, {
				route: {
					params: { linear: "create" },
				},
			});

			await user.selectOptions(screen.getByTestId("typeOfThermalBridge"), "E1");
			await user.type(screen.getByTestId("linearThermalTransmittance"), "5");
			await user.tab();

			const actualLinearBridge = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges.data[0]!;

			expect(actualLinearBridge.data.name).toBe("E1: Steel lintel with perforated steel base plate");
			expect(actualLinearBridge.data.linearThermalTransmittance).toBe(5);
			expect(actualLinearBridge.data.length).toBeUndefined();
		});

		it("saves updated form data to correct store object automatically", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceThermalBridging: {
						dwellingSpaceLinearThermalBridges: {
							data: [state, state],
						},
					},
				},
			});

			await renderSuspended(LinearBridging, {
				route: {
					params: { linear: "1" },
				},
			});

			await user.selectOptions(screen.getByTestId("typeOfThermalBridge"), "E1");
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

		test("linear bridge and linear bridges section are set as 'not complete' after user edits an item", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceThermalBridging: {
						dwellingSpaceLinearThermalBridges: {
							data: [{ ...state, complete: true }],
							complete: true,
						},
					},
				},
			});

			await renderSuspended(LinearBridging, {
				route: {
					params: { linear: "0" },
				},
			});

			await user.selectOptions(screen.getByTestId("typeOfThermalBridge"), "E1");
			await user.type(screen.getByTestId("length"), "10");
			await user.tab();

			const linearBridging = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges;

			expect(linearBridging.data[0]!.complete).not.toBe(true);
			expect(linearBridging.complete).not.toBe(true);
		});

		it("updates the name to the default name once the user unselects the type of thermal bridge", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceThermalBridging: {
						dwellingSpaceLinearThermalBridges: {
							data: [{ ...state }],
						},
					},
				},
			});
			
			await renderSuspended(LinearBridging, {
				route: {
					params: { linear: "0" },
				},
			});

			await user.selectOptions(screen.getByTestId("typeOfThermalBridge"), "");
			await user.tab();

			const linearBridging = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges;
			expect(linearBridging.data[0]!.data.name).toBe("Linear thermal bridge");
		});
	});

	describe("E5 thermal bridge type", () => {
		const groundFloor: Partial<GroundFloorData> = {
			id: "0d5b322a-8bd7-4f45-8027-ebe9f2056e70",
			name: "Ground 1",
			perimeter: 40,
		};

		beforeEach(async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceGroundFloor: {
							data: [{ data: groundFloor }],
						},
					},
				},
			});

			await renderSuspended(LinearBridging, {
				route: {
					params: { bridging: "create" },
				},
			});

			await user.selectOptions(screen.getByTestId("typeOfThermalBridge"), "E5");
		});

		test("displays associated ground floor input", async () => {
			expect(screen.getByTestId(`associatedItemId_${groundFloor.id}`)).toBeDefined();
		});

		test("displays required error message when associated ground floor is not selected", async () => {
			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("associatedItemId_error"))).toBeDefined();
		});

		test("stores selected associated ground floor", async () => {
			await populateValidForm();

			await user.selectOptions(screen.getByTestId("typeOfThermalBridge"), "E5");
			await user.click(screen.getByTestId(`associatedItemId_${groundFloor.id}`));
			await user.click(screen.getByTestId("saveAndComplete"));

			const { data } = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges;

			expect(data[0]?.data).toHaveProperty("associatedItemId");

			if ("associatedItemId" in data[0]!.data) {
				expect(data[0]!.data.associatedItemId).toBe(groundFloor.id);
			}
		});
	});

	describe("E6 thermal bridge type", () => {
		const floorAboveHeatedBasement: Partial<FloorAboveUnheatedBasementData> = {
			id: "0d5b322a-8bd7-4f45-8027-ebe9f2056e70",
			name: "Floor above unheated basement 1",
			perimeter: 40,
		};

		beforeEach(async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceFloorAboveUnheatedBasement: {
							data: [{ data: floorAboveHeatedBasement }],
						},
					},
				},
			});

			await renderSuspended(LinearBridging, {
				route: {
					params: { bridging: "create" },
				},
			});

			await user.selectOptions(screen.getByTestId("typeOfThermalBridge"), "E6");
		});

		test("displays associated floor above unheated basement input", async () => {
			expect(screen.getByTestId(`associatedItemId_${floorAboveHeatedBasement.id}`)).toBeDefined();
			expect(screen.getByTestId("associatedItemId_none")).toBeDefined();
		});

		test("displays required error message when associated floor above unheated basement is not selected", async () => {
			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("associatedItemId_error"))).toBeDefined();
		});

		test("stores selected associated floor above unheated basement", async () => {
			await populateValidForm();

			await user.selectOptions(screen.getByTestId("typeOfThermalBridge"), "E6");
			await user.click(screen.getByTestId(`associatedItemId_${floorAboveHeatedBasement.id}`));
			await user.click(screen.getByTestId("saveAndComplete"));

			const { data } = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges;

			expect(data[0]?.data).toHaveProperty("associatedItemId");

			if ("associatedItemId" in data[0]!.data) {
				expect(data[0]!.data.associatedItemId).toBe(floorAboveHeatedBasement.id);
			}
		});
	});

	describe("E22 thermal bridge type", () => {
		const heatedBasementFloor: Partial<FloorOfHeatedBasementData> = {
			id: "0d5b322a-8bd7-4f45-8027-ebe9f2056e70",
			name: "Heated basement floor 1",
			//perimeter: 40,
		};

		beforeEach(async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceFloorOfHeatedBasement: {
							data: [{ data: heatedBasementFloor }],
						},
					},
				},
			});

			await renderSuspended(LinearBridging, {
				route: {
					params: { bridging: "create" },
				},
			});

			await user.selectOptions(screen.getByTestId("typeOfThermalBridge"), "E22");
		});

		test("displays associated heated basement floor input", async () => {
			expect(screen.getByTestId(`associatedItemId_${heatedBasementFloor.id}`)).toBeDefined();
		});

		test("displays required error message when associated heated basement floor is not selected", async () => {
			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("associatedItemId_error"))).toBeDefined();
		});

		test("stores selected associated heated basement floor", async () => {
			await populateValidForm();

			await user.selectOptions(screen.getByTestId("typeOfThermalBridge"), "E22");
			await user.click(screen.getByTestId(`associatedItemId_${heatedBasementFloor.id}`));
			await user.click(screen.getByTestId("saveAndComplete"));

			const { data } = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges;

			expect(data[0]?.data).toHaveProperty("associatedItemId");

			if ("associatedItemId" in data[0]!.data) {
				expect(data[0]!.data.associatedItemId).toBe(heatedBasementFloor.id);
			}
		});
	});
});