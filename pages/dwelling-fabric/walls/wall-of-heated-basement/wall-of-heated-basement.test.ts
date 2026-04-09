import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/vue";
import WallOfHeatedBasement from "./[wall].vue";
import type { WallOfHeatedBasementData } from "~/stores/ecaasStore.schema";
import { v4 as uuidv4 } from "uuid";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

vi.mock("uuid");

describe("wall of heated basement", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	beforeEach(() => {
		store.$reset();
	});

	const basementFloorId = "test-floor-id-123";

	const wallOfHeatedBasement: WallOfHeatedBasementData = {
		id: "test-wall-id-123",
		name: "Wall of Heated Basement 1",
		netSurfaceArea: 50.0,
		uValue: 0.3,
		thermalResistance: 0.6,
		arealHeatCapacity: "Medium",
		massDistributionClass: "M",
		perimeter: 30,
		associatedBasementFloorId: basementFloorId,
	};

	afterEach(() => {
		store.$reset();
	});

	type WallOverrides = Partial<WallOfHeatedBasementData>;

	const populateValidForm = async (overrides: WallOverrides = {}) => {
		const defaults: WallOfHeatedBasementData = {
			id: "test-wall-id-123",
			name: "Test Wall",
			netSurfaceArea: 50,
			uValue: 0.3,
			thermalResistance: 0.6,
			arealHeatCapacity: "Medium",
			massDistributionClass: "M",
			perimeter: 30,
			associatedBasementFloorId: basementFloorId,
		};

		const values: WallOfHeatedBasementData = { ...defaults, ...overrides };
		await user.type(screen.getByTestId("name"), values.name);
		await user.click(screen.getByTestId(`associatedBasementFloorId_${values.associatedBasementFloorId}`));
		await user.type(screen.getByTestId("netSurfaceArea"), String(values.netSurfaceArea));
		await user.type(screen.getByTestId("uValue"), String(values.uValue));
		await user.type(screen.getByTestId("thermalResistance"), String(values.thermalResistance));
		await user.click(screen.getByTestId(`arealHeatCapacity_${values.arealHeatCapacity}`));
		await user.click(screen.getByTestId(`massDistributionClass_${values.massDistributionClass}`));
		await user.type(screen.getByTestId("perimeter"), String(values.perimeter));
	};

	test("data is saved to store state and marked as complete when form is valid", async () => {
		vi.mocked(uuidv4).mockReturnValue(wallOfHeatedBasement.id as unknown as Buffer);

		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceFloorOfHeatedBasement: {
						data: [{ data: { id: basementFloorId, name: "Basement Floor 1" } }],
					},
				},
			},
		});

		await renderSuspended(WallOfHeatedBasement, {
			route: {
				params: { wall: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Wall of Heated Basement 1");
		await user.click(screen.getByTestId(`associatedBasementFloorId_${basementFloorId}`));
		await user.type(screen.getByTestId("netSurfaceArea"), "50.0");
		await user.type(screen.getByTestId("uValue"), "0.3");
		await user.type(screen.getByTestId("thermalResistance"), "0.6");
		await user.click(screen.getByTestId("arealHeatCapacity_Medium"));
		await user.click(screen.getByTestId("massDistributionClass_M"));
		await user.type(screen.getByTestId("perimeter"), "30");

		await user.click(screen.getByTestId("saveAndComplete"));

		await waitFor(() => {
			const { dwellingSpaceWallOfHeatedBasement } = store.dwellingFabric.dwellingSpaceWalls;
			expect(dwellingSpaceWallOfHeatedBasement?.data[0]?.complete).toEqual(true);
		});

		const { dwellingSpaceWallOfHeatedBasement } = store.dwellingFabric.dwellingSpaceWalls;

		expect(dwellingSpaceWallOfHeatedBasement?.data[0]?.data).toEqual(wallOfHeatedBasement);
		expect(dwellingSpaceWallOfHeatedBasement?.data[0]?.complete).toEqual(true);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceFloorOfHeatedBasement: {
						data: [{ data: { id: basementFloorId, name: "Basement Floor 1" } }],
					},
				},
				dwellingSpaceWalls: {
					dwellingSpaceWallOfHeatedBasement: {
						data: [{ data: wallOfHeatedBasement }],
					},
				},
			},
		});

		await renderSuspended(WallOfHeatedBasement, {
			route: {
				params: { wall: "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Wall of Heated Basement 1");
		expect((await screen.findByTestId(`associatedBasementFloorId_${basementFloorId}`)).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId<HTMLInputElement>("netSurfaceArea")).value).toBe("50");
		expect((await screen.findByTestId<HTMLInputElement>("uValue")).value).toBe("0.3");
		expect((await screen.findByTestId<HTMLInputElement>("thermalResistance")).value).toBe("0.6");
		expect((await screen.findByTestId("arealHeatCapacity_Medium")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("massDistributionClass_M")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId<HTMLInputElement>("perimeter")).value).toBe("30");
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(WallOfHeatedBasement, {
			route: {
				params: { wall: "create" },
			},
		});
		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("associatedBasementFloorId_error"))).toBeDefined();
		expect((await screen.findByTestId("netSurfaceArea_error"))).toBeDefined();
		expect((await screen.findByTestId("uValue_error"))).toBeDefined();
		expect((await screen.findByTestId("thermalResistance_error"))).toBeDefined();
		expect((await screen.findByTestId("arealHeatCapacity_error"))).toBeDefined();
		expect((await screen.findByTestId("massDistributionClass_error"))).toBeDefined();
		expect((await screen.findByTestId("perimeter_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form is submitted", async () => {
		await renderSuspended(WallOfHeatedBasement, {
			route: {
				params: { wall: "create" },
			},
		});
		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("wallOfHeatedBasementErrorSummary"))).toBeDefined();
	});

	test("first basement floor is autoselected when only one floor exists", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceFloorOfHeatedBasement: {
						data: [{ data: { id: basementFloorId, name: "Basement Floor 1" } }],
					},
				},
			},
		});

		await renderSuspended(WallOfHeatedBasement, {
			route: {
				params: { wall: "create" },
			},
		});

		await user.tab();

		const basementFloorSelect = screen.getByTestId<HTMLInputElement>(`associatedBasementFloorId_${basementFloorId}`);
		expect(basementFloorSelect.hasAttribute("checked")).toBe(true);
	});

	test("displays message to add basement floor when none exist", async () => {
		await renderSuspended(WallOfHeatedBasement, {
			route: {
				params: { wall: "create" },
			},
		});

		expect(screen.getByTestId("noBasementFloor")).toBeDefined();
		expect(screen.getByText("No basement floors added.")).toBeDefined();
		expect(screen.getByText("Click here to add a basement floor")).toBeDefined();
	});

	test("options appear when basement floors are added", async () => {
		// add a basement floor before mount
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceFloorOfHeatedBasement: {
						data: [{ data: { id: basementFloorId, name: "Basement Floor 1" } }],
					},
				},
			},
		});

		await renderSuspended(WallOfHeatedBasement, {
			route: { params: { wall: "create" } },
		});

		// option should be present immediately
		expect(await screen.findByTestId(`associatedBasementFloorId_${basementFloorId}`)).toBeDefined();
	});



	test("save and complete navigates to walls index page", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceFloorOfHeatedBasement: {
						data: [{ data: { id: basementFloorId, name: "Basement Floor 1" } }],
					},
				},
			},
		});

		await renderSuspended(WallOfHeatedBasement, {
			route: {
				params: { wall: "create" },
			},
		});

		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		await waitFor(() => {
			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/walls");
		});
	});

	test("updated form data is automatically saved to store", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceFloorOfHeatedBasement: {
						data: [{ data: { id: basementFloorId, name: "Basement Floor 1" } }],
					},
				},
				dwellingSpaceWalls: {
					dwellingSpaceWallOfHeatedBasement: {
						data: [{
							data: { ...wallOfHeatedBasement },
						}],
					},
				},
			},
		});

		await renderSuspended(WallOfHeatedBasement, {
			route: {
				params: { wall: "0" },
			},
		});

		await user.clear(screen.getByTestId("name"));
		await user.tab();
		await user.clear(screen.getByTestId("netSurfaceArea"));

		await user.type(screen.getByTestId("name"), "Wall of Heated Basement 2");
		await user.type(screen.getByTestId("netSurfaceArea"), "75");
		await user.tab();

		const { data } = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallOfHeatedBasement;

		expect(data[0]?.data.name).toBe("Wall of Heated Basement 2");
		expect(data[0]?.data.netSurfaceArea).toBe(75);
	});


	test("partial form data is saved automatically with default name to store", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceFloorOfHeatedBasement: {
						data: [{ data: { id: basementFloorId, name: "Basement Floor 1" } }],
					},
				},
			},
		});

		await renderSuspended(WallOfHeatedBasement, {
			route: {
				params: { wall: "create" },
			},
		});

		await user.type(screen.getByTestId("netSurfaceArea"), "100");
		await user.tab();

		const { data } = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallOfHeatedBasement;

		expect(data[0]?.data.name).toBe("Wall of heated basement");
		expect(data[0]?.data.netSurfaceArea).toBe(100);
	});
});
