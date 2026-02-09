import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/vue";
import HeatedBasementFloor from "./[floor].vue";
import { v4 as uuidv4 } from "uuid";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});
vi.mock("uuid");
describe("floor of heated basement", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const heatedBasementFloor: FloorOfHeatedBasementData = {
		id: "test-floor-id-123",
		name: "Heated Basement Floor 1",
		surfaceArea: 45.0,
		uValue: 0.25,
		thermalResistance: 0.5,
		arealHeatCapacity: "Medium",
		massDistributionClass: "M",
		depthOfBasementFloor: 2.5,
		perimeter: 28.0,
		psiOfWallJunction: 0.05,
		thicknessOfWalls: 300,
	};

	afterEach(() => {
		store.$reset();
	});

	type FloorOverrides = Partial<FloorOfHeatedBasementData>;

	const populateValidForm = async (overrides: FloorOverrides = {}) => {
		const defaults: FloorOfHeatedBasementData = {
			id: "test-floor-id-123",
			name: "Test Floor",
			surfaceArea: 45,
			uValue: 0.25,
			thermalResistance: 0.5,
			arealHeatCapacity: "Medium",
			massDistributionClass: "M",
			depthOfBasementFloor: 2.5,
			perimeter: 28,
			psiOfWallJunction: 0.05,
			thicknessOfWalls: 300,
		};

		const values: FloorOfHeatedBasementData = { ...defaults, ...overrides };
		await user.type(screen.getByTestId("name"), values.name);
		await user.type(screen.getByTestId("surfaceArea"), String(values.surfaceArea));
		await user.type(screen.getByTestId("uValue"), String(values.uValue));
		await user.type(screen.getByTestId("thermalResistance"), String(values.thermalResistance));
		await user.click(screen.getByTestId(`arealHeatCapacity_${values.arealHeatCapacity}`));
		await user.click(screen.getByTestId(`massDistributionClass_${values.massDistributionClass}`));
		await user.type(screen.getByTestId("depthOfBasementFloor"), String(values.depthOfBasementFloor));
		await user.type(screen.getByTestId("perimeter"), String(values.perimeter));
		await user.type(screen.getByTestId("psiOfWallJunction"), String(values.psiOfWallJunction));
		await user.type(screen.getByTestId("thicknessOfWalls"), String(values.thicknessOfWalls));
	};

	test("data is saved to store state and marked as complete when form is valid", async () => {

		vi.mocked(uuidv4).mockReturnValue(heatedBasementFloor.id as unknown as Buffer);
		await renderSuspended(HeatedBasementFloor, {
			route: {
				params: { floor: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Heated Basement Floor 1");
		await user.type(screen.getByTestId("surfaceArea"), "45.0");
		await user.type(screen.getByTestId("uValue"), "0.25");
		await user.type(screen.getByTestId("thermalResistance"), "0.5");
		await user.click(screen.getByTestId("arealHeatCapacity_Medium"));
		await user.click(screen.getByTestId("massDistributionClass_M"));
		await user.type(screen.getByTestId("depthOfBasementFloor"), "2.5");
		await user.type(screen.getByTestId("perimeter"), "28.0");
		await user.type(screen.getByTestId("psiOfWallJunction"), "0.05");
		await user.type(screen.getByTestId("thicknessOfWalls"), "300");

		await user.click(screen.getByTestId("saveAndComplete"));

		await waitFor(() => {
			const { dwellingSpaceFloorOfHeatedBasement } = store.dwellingFabric.dwellingSpaceFloors;
			expect(dwellingSpaceFloorOfHeatedBasement?.data[0]?.complete).toEqual(true);
		});

		const { dwellingSpaceFloorOfHeatedBasement } = store.dwellingFabric.dwellingSpaceFloors;

		expect(dwellingSpaceFloorOfHeatedBasement?.data[0]?.data).toEqual(heatedBasementFloor);
		expect(dwellingSpaceFloorOfHeatedBasement?.data[0]?.complete).toEqual(true);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceFloorOfHeatedBasement: {
						data: [{ data: heatedBasementFloor }],
					},
				},
			},
		});

		await renderSuspended(HeatedBasementFloor, {
			route: {
				params: { floor: "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Heated Basement Floor 1");
		expect((await screen.findByTestId<HTMLInputElement>("surfaceArea")).value).toBe("45");
		expect((await screen.findByTestId<HTMLInputElement>("uValue")).value).toBe("0.25");
		expect((await screen.findByTestId<HTMLInputElement>("thermalResistance")).value).toBe("0.5");
		expect((await screen.findByTestId("arealHeatCapacity_Medium")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("massDistributionClass_M")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId<HTMLInputElement>("depthOfBasementFloor")).value).toBe("2.5");
		expect((await screen.findByTestId<HTMLInputElement>("perimeter")).value).toBe("28");
		expect((await screen.findByTestId<HTMLInputElement>("psiOfWallJunction")).value).toBe("0.05");
		expect((await screen.findByTestId<HTMLInputElement>("thicknessOfWalls")).value).toBe("300");
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(HeatedBasementFloor, {
			route: {
				params: { floor: "create" },
			},
		});
		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("surfaceArea_error"))).toBeDefined();
		expect((await screen.findByTestId("uValue_error"))).toBeDefined();
		expect((await screen.findByTestId("thermalResistance_error"))).toBeDefined();
		expect((await screen.findByTestId("arealHeatCapacity_error"))).toBeDefined();
		expect((await screen.findByTestId("massDistributionClass_error"))).toBeDefined();
		expect((await screen.findByTestId("depthOfBasementFloor_error"))).toBeDefined();
		expect((await screen.findByTestId("perimeter_error"))).toBeDefined();
		expect((await screen.findByTestId("psiOfWallJunction_error"))).toBeDefined();
		expect((await screen.findByTestId("thicknessOfWalls_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(HeatedBasementFloor, {
			route: {
				params: { floor: "create" },
			},
		});
		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("floorOfHeatedBasementErrorSummary"))).toBeDefined();
	});

	test("app navigates to floors page when valid form is completed", async () => {

		await renderSuspended(HeatedBasementFloor);

		await user.type(screen.getByTestId("name"), "Heated Basement Floor 1");
		await user.type(screen.getByTestId("surfaceArea"), "45.0");
		await user.type(screen.getByTestId("uValue"), "0.25");
		await user.type(screen.getByTestId("thermalResistance"), "0.5");
		await user.click(screen.getByTestId("arealHeatCapacity_Medium"));
		await user.click(screen.getByTestId("massDistributionClass_M"));
		await user.type(screen.getByTestId("depthOfBasementFloor"), "2.5");
		await user.type(screen.getByTestId("perimeter"), "28.0");
		await user.type(screen.getByTestId("psiOfWallJunction"), "0.05");
		await user.type(screen.getByTestId("thicknessOfWalls"), "300");
		await user.click(screen.getByTestId("saveAndComplete"));

		await waitFor(() => {
			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/floors");
		});
	});

	test("heated basement floor section is marked as 'not complete' after form is saved and marked as complete", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceFloorOfHeatedBasement: {
						data: [{ data: heatedBasementFloor, complete: true }],
						complete: true,
					},
				},
			},
		});

		await renderSuspended(HeatedBasementFloor, {
			route: {
				params: { floor: "0" },
			},
		});


		await user.click(screen.getByTestId("saveAndComplete"));

		expect(store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorOfHeatedBasement.complete).not.toBe(true);
	});

	describe("boundary value tests", () => {
		test("accepts zero for depth of basement floor", async () => {
			await renderSuspended(HeatedBasementFloor, {
				route: {
					params: { floor: "create" },
				},
			});

			await populateValidForm({ depthOfBasementFloor: 0 });
			await user.click(screen.getByTestId("saveAndComplete"));

			const { dwellingSpaceFloorOfHeatedBasement } = store.dwellingFabric.dwellingSpaceFloors;
			expect(dwellingSpaceFloorOfHeatedBasement?.data[0]?.data.depthOfBasementFloor).toBe(0);
		});

		test("accepts large values for depth of basement floor", async () => {
			await renderSuspended(HeatedBasementFloor, {
				route: {
					params: { floor: "create" },
				},
			});

			await populateValidForm({ depthOfBasementFloor: 100 });
			await user.click(screen.getByTestId("saveAndComplete"));

			const { dwellingSpaceFloorOfHeatedBasement } = store.dwellingFabric.dwellingSpaceFloors;
			expect(dwellingSpaceFloorOfHeatedBasement?.data[0]?.data.depthOfBasementFloor).toBe(100);
		});

		test("accepts negative values for depth of basement floor", async () => {
			await renderSuspended(HeatedBasementFloor, {
				route: {
					params: { floor: "create" },
				},
			});

			await populateValidForm({ depthOfBasementFloor: -5 });
			await user.click(screen.getByTestId("saveAndComplete"));

			const { dwellingSpaceFloorOfHeatedBasement } = store.dwellingFabric.dwellingSpaceFloors;
			expect(dwellingSpaceFloorOfHeatedBasement?.data[0]?.data.depthOfBasementFloor).toBe(-5);
		});

		test("accepts zero for thickness of walls", async () => {
			await renderSuspended(HeatedBasementFloor, {
				route: {
					params: { floor: "create" },
				},
			});

			await populateValidForm({ thicknessOfWalls: 0 });
			await user.click(screen.getByTestId("saveAndComplete"));

			const { dwellingSpaceFloorOfHeatedBasement } = store.dwellingFabric.dwellingSpaceFloors;
			expect(dwellingSpaceFloorOfHeatedBasement?.data[0]?.data.thicknessOfWalls).toBe(0);
		});

		test("accepts large values for thickness of walls", async () => {
			await renderSuspended(HeatedBasementFloor, {
				route: {
					params: { floor: "create" },
				},
			});

			await populateValidForm({ thicknessOfWalls: 5000 });
			await user.click(screen.getByTestId("saveAndComplete"));

			const { dwellingSpaceFloorOfHeatedBasement } = store.dwellingFabric.dwellingSpaceFloors;
			expect(dwellingSpaceFloorOfHeatedBasement?.data[0]?.data.thicknessOfWalls).toBe(5000);
		});

		test("accepts negative values for thickness of walls", async () => {
			await renderSuspended(HeatedBasementFloor, {
				route: {
					params: { floor: "create" },
				},
			});

			await populateValidForm({ thicknessOfWalls: -100 });
			await user.click(screen.getByTestId("saveAndComplete"));

			const { dwellingSpaceFloorOfHeatedBasement } = store.dwellingFabric.dwellingSpaceFloors;
			expect(dwellingSpaceFloorOfHeatedBasement?.data[0]?.data.thicknessOfWalls).toBe(-100);
		});
	});

	describe("partially saving data", () => {
		test("new form data is automatically saved to store with given name", async () => {
			await renderSuspended(HeatedBasementFloor, {
				route: {
					params: { floor: "create" },
				},
			});

			await user.type(screen.getByTestId("name"), "Heated basement 1");
			await user.type(screen.getByTestId("surfaceArea"), "50");
			await user.type(screen.getByTestId("uValue"), "0.3");
			await user.tab();

			const { data } = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorOfHeatedBasement;
			expect(data[0]!.data.name).toBe("Heated basement 1");
			expect(data[0]!.data.surfaceArea).toBe(50);
			expect(data[0]!.data.uValue).toBe(0.3);
		});

		test("new form data is automatically saved to store with default name", async () => {
			await renderSuspended(HeatedBasementFloor, {
				route: {
					params: { floor: "create" },
				},
			});

			await user.type(screen.getByTestId("surfaceArea"), "45");
			await user.type(screen.getByTestId("uValue"), "0.25");
			await user.tab();

			const { data } = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorOfHeatedBasement;
			expect(data[0]!.data.name).toBe("Floor of heated basement");
			expect(data[0]!.data.surfaceArea).toBe(45);
			expect(data[0]!.data.uValue).toBe(0.25);
		});

		test("updated form data is automatically saved to store", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceFloorOfHeatedBasement: {
							data: [{ data: heatedBasementFloor }],
						},
					},
				},
			});

			await renderSuspended(HeatedBasementFloor, {
				route: {
					params: { floor: 0 },
				},
			});

			const { data } = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorOfHeatedBasement;
			expect(data[0]!.data.name).toBe("Heated Basement Floor 1");
			expect(data[0]!.data.surfaceArea).toBe(45.0);

			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), "Updated basement floor");
			await user.clear(screen.getByTestId("surfaceArea"));
			await user.type(screen.getByTestId("surfaceArea"), "60");
			await user.tab();

			expect(data[0]!.data.name).toBe("Updated basement floor");
			expect(data[0]!.data.surfaceArea).toBe(60);
		});

		test("heated basement floor and section are set as 'not complete' after user edits floor", async () => {

			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceFloorOfHeatedBasement: {
							data: [{ data: heatedBasementFloor, complete: true }],
							complete: true,
						},
					},
				},
			});

			await renderSuspended(HeatedBasementFloor, {
				route: {
					params: { floor: "0" },
				},
			});


			await user.type(screen.getByTestId("name"), " Updated");
			await user.tab();

			expect(store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorOfHeatedBasement.data[0]?.complete).not.toBe(true);
			expect(store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorOfHeatedBasement.complete).not.toBe(true);
		});

		test("app navigates to floors overview page on clicking Save progress", async () => {
			await renderSuspended(HeatedBasementFloor);
			await user.click(screen.getByTestId("saveProgress"));
			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/floors");
		});
	});
});
