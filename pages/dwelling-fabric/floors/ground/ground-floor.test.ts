import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import GroundFloor from "./[floor].vue";
import { centimetre } from "~/utils/units/length";
import { unitValue } from "~/utils/units/types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("ground floor", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const groundFloor: GroundFloorData = {
		name: "Ground 1",
		surfaceArea: 5,
		pitch: 180,
		uValue: 1,
		thermalResistance: 1,
		kappaValue: 50000,
		massDistributionClass: "I",
		perimeter: 0,
		psiOfWallJunction: 0,
		thicknessOfWalls: 0.8,
		typeOfGroundFloor: "Slab_no_edge_insulation"
	};

	const groundFloorWithEdgeInsulation: GroundFloorData = {
		...groundFloor,
		typeOfGroundFloor: "Slab_edge_insulation",
		edgeInsulationType: "horizontal",
		edgeInsulationWidth: unitValue(0, centimetre),
		edgeInsulationThermalResistance: 0
	};

	const groundFloorWithSuspendedFloor: GroundFloorData = {
		...groundFloor,
		typeOfGroundFloor: "Suspended_floor",
		heightOfFloorUpperSurface: 0,
		underfloorSpaceThermalResistance: 0,
		thermalTransmittanceOfWallsAboveGround: 0,
		ventilationOpeningsArea: 0,
		windShieldingFactor: "Exposed"
	};

	// const groundFloorWithHeatedBasement: GroundFloorData = {
	// 	...groundFloor,
	// 	typeOfGroundFloor: "Heated_basement",
	// 	depthOfBasementFloorBelowGround: 0,
	// 	thermalResistanceOfBasementWalls: 0
	// };
	//
	// const groundFloorWithUnheatedBasement: GroundFloorData = {
	// 	...groundFloor,
	// 	typeOfGroundFloor: "Unheated_basement",
	// 	thermalTransmittanceOfFloorAboveBasement: 0,
	// 	thermalTransmittanceOfWallsAboveGround: 0,
	//  thermalResistanceOfBasementWalls: 0,
	// 	depthOfBasementFloorBelowGround: 0,
	// 	heightOfBasementWallsAboveGround: 0
	// };

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Ground 1");
		await user.type(screen.getByTestId("surfaceArea"), "5");
		await user.type(screen.getByTestId("uValue"), "1");
		await user.type(screen.getByTestId("thermalResistance"), "1");
		await user.click(screen.getByTestId("kappaValue_50000"));
		await user.click(screen.getByTestId("massDistributionClass_I"));
		await user.type(screen.getByTestId("perimeter"), "0");
		await user.type(screen.getByTestId("psiOfWallJunction"), "0");
		await user.type(screen.getByTestId("thicknessOfWalls"), "0.8");
		await user.click(screen.getByTestId("typeOfGroundFloor_Slab_no_edge_insulation"));
	};
	
	describe("when type of ground floor is slab no edge insulation", () => {
		test("data is saved to store state and marked as complete when form is valid", async () => {
			await renderSuspended(GroundFloor, {
				route: {
					params: { floor: "create" }
				}
			});

			await populateValidForm();
			await user.click(screen.getByTestId("saveAndComplete"));
	
			const actual = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.data[0];
			expect(actual?.data).toEqual(groundFloor);
			expect(actual?.complete).toBe(true);
		});
	
		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceGroundFloor: {
							data: [{ data: groundFloor }]
						}
					}
				}
			});
	
			await renderSuspended(GroundFloor, {
				route: {
					params: { floor: "0" }
				}
			});
	
			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Ground 1");
			expect((await screen.findByTestId<HTMLInputElement>("surfaceArea")).value).toBe("5");
			expect((await screen.findByTestId<HTMLInputElement>("uValue")).value).toBe("1");
			expect((await screen.findByTestId<HTMLInputElement>("thermalResistance")).value).toBe("1");
			expect((await screen.findByTestId("kappaValue_50000")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId("massDistributionClass_I")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("perimeter")).value).toBe("0");
			expect((await screen.findByTestId<HTMLInputElement>("psiOfWallJunction")).value).toBe("0");
			expect((await screen.findByTestId<HTMLInputElement>("thicknessOfWalls")).value).toBe("0.8");
			expect((await screen.findByTestId("typeOfGroundFloor_Slab_no_edge_insulation")).hasAttribute("checked")).toBe(true);
		});
			
		test("required error messages are displayed when empty form is submitted", async () => {
			await renderSuspended(GroundFloor);
	
			await user.click(screen.getByTestId("saveAndComplete"));
	
			expect((await screen.findByTestId("name_error"))).toBeDefined();
			expect((await screen.findByTestId("surfaceArea_error"))).toBeDefined();
			expect((await screen.findByTestId("uValue_error"))).toBeDefined();
			expect((await screen.findByTestId("thermalResistance_error"))).toBeDefined();
			expect((await screen.findByTestId("kappaValue_error"))).toBeDefined();
			expect((await screen.findByTestId("massDistributionClass_error"))).toBeDefined();
			expect((await screen.findByTestId("perimeter_error"))).toBeDefined();
			expect((await screen.findByTestId("psiOfWallJunction_error"))).toBeDefined();
			expect((await screen.findByTestId("thicknessOfWalls_error"))).toBeDefined();
			expect((await screen.findByTestId("typeOfGroundFloor_error"))).toBeDefined();
		});
	});
	
	describe("when type of ground floor is slab edge insulation", () => {
		test("data is saved to store state and marked as complete when form is valid", async () => {
			await renderSuspended(GroundFloor, {
				route: {
					params: { floor: "create" }
				}
			});
			await populateValidForm();
			await user.click(screen.getByTestId("typeOfGroundFloor_Slab_edge_insulation"));
			await user.click(screen.getByTestId("edgeInsulationType_horizontal"));
			await user.type(screen.getByTestId("edgeInsulationWidth"), "0");
			await user.type(screen.getByTestId("edgeInsulationThermalResistance"), "0");
			await user.tab();
			await user.click(screen.getByTestId("saveAndComplete"));
	
			const actual = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.data[0];
			expect(actual?.data).toEqual(groundFloorWithEdgeInsulation);
			expect(actual?.complete).toBe(true);
		});
	
		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceGroundFloor: {
							data: [{ data: groundFloorWithEdgeInsulation }]
						}
					}
				}
			});
	
			await renderSuspended(GroundFloor, {
				route: {
					params: { floor: "0" }
				}
			});
	
			expect((await screen.findByTestId("typeOfGroundFloor_Slab_edge_insulation")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId("edgeInsulationType_horizontal")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("edgeInsulationWidth")).value).toBe("0");
			expect((await screen.findByTestId<HTMLInputElement>("edgeInsulationThermalResistance")).value).toBe("0");
		});
			
		test("required error messages are displayed when empty form is submitted", async () => {
			await renderSuspended(GroundFloor);
	
			await user.click(screen.getByTestId("typeOfGroundFloor_Slab_edge_insulation"));
			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("edgeInsulationType_error"))).toBeDefined();
			expect((await screen.findByTestId("edgeInsulationWidth_error"))).toBeDefined();
			expect((await screen.findByTestId("edgeInsulationThermalResistance_error"))).toBeDefined();
		});
	});
	
	describe("when type of ground floor is suspended floor", () => {
		test("data is saved to store state and marked as complete when form is valid", async () => {
			await renderSuspended(GroundFloor, {
				route: {
					params: { floor: "create" }
				}
			});	

			await populateValidForm();
			await user.click(screen.getByTestId("typeOfGroundFloor_Suspended_floor"));
			await user.type(screen.getByTestId("heightOfFloorUpperSurface"), "0");
			await user.type(screen.getByTestId("thicknessOfWalls"), "0");
			await user.type(screen.getByTestId("underfloorSpaceThermalResistance"), "0");
			await user.type(screen.getByTestId("thermalTransmittanceOfWallsAboveGround"), "0");
			await user.type(screen.getByTestId("ventilationOpeningsArea"), "0");
			await user.click(screen.getByTestId("windShieldingFactor_Exposed"));
			await user.tab();
			await user.click(screen.getByTestId("saveAndComplete"));
			
			const actual = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.data[0];
			expect(actual?.data).toEqual(groundFloorWithSuspendedFloor);
			expect(actual?.complete).toBe(true);
		});
		
		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceGroundFloor: {
							data: [{ data: groundFloorWithSuspendedFloor }]
						}
					}
				}
			});
	
			await renderSuspended(GroundFloor, {
				route: {
					params: { floor: "0" }
				}
			});
	
			expect((await screen.findByTestId("typeOfGroundFloor_Suspended_floor")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("heightOfFloorUpperSurface")).value).toBe("0");
			expect((await screen.findByTestId<HTMLInputElement>("thicknessOfWalls")).value).toBe("0.8");
			expect((await screen.findByTestId<HTMLInputElement>("underfloorSpaceThermalResistance")).value).toBe("0");
			expect((await screen.findByTestId<HTMLInputElement>("thermalTransmittanceOfWallsAboveGround")).value).toBe("0");
			expect((await screen.findByTestId<HTMLInputElement>("ventilationOpeningsArea")).value).toBe("0");
			expect((await screen.findByTestId("windShieldingFactor_Exposed")).hasAttribute("checked")).toBe(true);
		});
			
		test("required error messages are displayed when empty form is submitted", async () => {
			await renderSuspended(GroundFloor);
	
			await user.click(screen.getByTestId("typeOfGroundFloor_Suspended_floor"));
			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("heightOfFloorUpperSurface_error"))).toBeDefined();
			expect((await screen.findByTestId("thicknessOfWalls_error"))).toBeDefined();
			expect((await screen.findByTestId("underfloorSpaceThermalResistance_error"))).toBeDefined();
			expect((await screen.findByTestId("thermalTransmittanceOfWallsAboveGround_error"))).toBeDefined();
			expect((await screen.findByTestId("ventilationOpeningsArea_error"))).toBeDefined();
			expect((await screen.findByTestId("windShieldingFactor_error"))).toBeDefined();
		});
	});

	test("ground floor section is marked as 'not complete' after form is saved and marked as complete", async () => {
		// Arrange
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceGroundFloor: {
						data: [{ data: groundFloorWithSuspendedFloor, complete: true }],
						complete: true
					}
				}
			}
		});

		await renderSuspended(GroundFloor, {
			route: {
				params: { floor: "0" }
			}
		});
		
		// Act
		await user.click(screen.getByTestId("saveAndComplete"));

		// Assert
		expect(store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.complete).not.toBe(true);
	});

	describe("partially saving data", () => {
		test("new form data is automatically saved to store with given name", async () => {
			await renderSuspended(GroundFloor, {
				route: {
					params: { floor: "create" }
				}
			});
			
			await user.type(screen.getByTestId("name"), "Ground floor");
			await user.type(screen.getByTestId("uValue"), "1");
			await user.click(screen.getByTestId("kappaValue_50000"));
			await user.click(screen.getByTestId("massDistributionClass_I"));
			await user.click(screen.getByTestId("typeOfGroundFloor_Slab_no_edge_insulation"));
			await user.tab();
			
			const { data } = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor;
			expect(data[0]!.data.name).toBe("Ground floor");
			expect(data[0]!.data.uValue).toBe(1);
			expect(data[0]!.data.kappaValue).toBe(50000);
			expect(data[0]!.data.massDistributionClass).toBe("I");
			expect(data[0]!.data.typeOfGroundFloor).toBe("Slab_no_edge_insulation");
		});

		test("new form data is automatically saved to store with default name", async () => {
			await renderSuspended(GroundFloor, {
				route: {
					params: { floor: "create" }
				}
			});
			
			await user.type(screen.getByTestId("surfaceArea"), "170");
			await user.tab();
			
			const { data } = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor;
			expect(data[0]!.data.name).toBe("Ground floor");
			expect(data[0]!.data.surfaceArea).toBe(170);
		});

		test("updated form data is automatically saved to store", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceGroundFloor: {
							data: [{ data: groundFloorWithSuspendedFloor }]
						}
					}
				}
			});
			
			await renderSuspended(GroundFloor, {
				route: {
					params: { floor: 0 }
				}
			});

			const { data } = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor;

			expect(data[0]!.data.name).toBe("Ground 1");
			expect(data[0]!.data.surfaceArea).toBe(5);

			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), "Ground floor");
			await user.clear(screen.getByTestId("surfaceArea"));
			await user.type(screen.getByTestId("surfaceArea"), "170");
			await user.tab();

			expect(data[0]!.data.name).toBe("Ground floor");
			expect(data[0]!.data.surfaceArea).toBe(170);
		});
		
		test("ground floor and ground floor section are set as 'not complete' after user edits a ground floor", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceGroundFloor: {
							data: [{ data: groundFloorWithSuspendedFloor, complete: true }],
							complete: true
						}
					}
				}
			});

			await renderSuspended(GroundFloor, {
				route: {
					params: { floor: "0" }
				}
			});
		
			// Act
			await user.type(screen.getByTestId("name"), "Ground floor 1");
			await user.tab();
		
			// Assert
			expect(store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.data[0]?.complete).not.toBe(true);
			expect(store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.complete).not.toBe(true);
		});

		test("app navigates to floors overview page on clicking Save progress", async () => {
			await renderSuspended(GroundFloor);
			await user.click(screen.getByTestId("saveProgress"));
			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/floors");
		});
	});
});