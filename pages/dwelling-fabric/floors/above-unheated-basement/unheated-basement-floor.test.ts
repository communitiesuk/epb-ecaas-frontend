import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import FloorAboveUnheatedBasement from "./[floor].vue";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("floor above unheated basement", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const floorAboveUnheatedBasement: FloorAboveUnheatedBasementData = {
		name: "Floor above unheated basement 1",
		surfaceArea: 2,
		uValue: 0.5,
		thermalResistance: 1,
		arealHeatCapacity: "Very light",
		massDistributionClass: "E",
		perimeter: 0.5,
		psiOfWallJunction: 0.4,
		thicknessOfWalls: 0.6,
		depthOfBasementFloor: 0.5,
		heightOfBasementWalls: 1,
		thermalResistanceOfBasementWalls: 1.2,
		thermalTransmittanceOfBasementWalls: 1.3,
		thermalTransmittanceOfFoundations: 1.4,
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Floor above unheated basement 1");
		await user.type(screen.getByTestId("surfaceArea"), "2");
		await user.type(screen.getByTestId("uValue"), "0.5");
		await user.type(screen.getByTestId("thermalResistance"), "1");
		await user.click(screen.getByTestId("arealHeatCapacity_Very_light"));
		await user.click(screen.getByTestId("massDistributionClass_E"));
		await user.type(screen.getByTestId("perimeter"), "0.5");
		await user.type(screen.getByTestId("psiOfWallJunction"), "0.4");
		await user.type(screen.getByTestId("thicknessOfWalls"), "0.6");
		await user.type(screen.getByTestId("depthOfBasementFloor"), "0.5");
		await user.type(screen.getByTestId("heightOfBasementWalls"), "1");
		await user.type(screen.getByTestId("thermalResistanceOfBasementWalls"), "1.2");
		await user.type(screen.getByTestId("thermalTransmittanceOfBasementWalls"), "1.3");
		await user.type(screen.getByTestId("thermalTransmittanceOfFoundations"), "1.4");
		await user.tab();
	};
	
	test("data is saved to store state and marked as complete when form is valid", async () => {
		await renderSuspended(FloorAboveUnheatedBasement, {
			route: {
				params: { floor: "create" },
			},
		});

		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));
	
		const actual = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorAboveUnheatedBasement.data[0];
		expect(actual?.data).toEqual(floorAboveUnheatedBasement);
		expect(actual?.complete).toBe(true);
	});
	
	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceFloorAboveUnheatedBasement: {
						data: [{ data: floorAboveUnheatedBasement }],
					},
				},
			},
		});
	
		await renderSuspended(FloorAboveUnheatedBasement, {
			route: {
				params: { "floor": "0" },
			},
		});

	
		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Floor above unheated basement 1");
		expect((await screen.findByTestId<HTMLInputElement>("surfaceArea")).value).toBe("2");
		expect((await screen.findByTestId<HTMLInputElement>("uValue")).value).toBe("0.5");
		expect((await screen.findByTestId<HTMLInputElement>("thermalResistance")).value).toBe("1");
		expect((await screen.findByTestId("arealHeatCapacity_Very_light")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("massDistributionClass_E")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId<HTMLInputElement>("perimeter")).value).toBe("0.5");
		expect((await screen.findByTestId<HTMLInputElement>("psiOfWallJunction")).value).toBe("0.4");
		expect((await screen.findByTestId<HTMLInputElement>("thicknessOfWalls")).value).toBe("0.6");
		expect((await screen.findByTestId<HTMLInputElement>("depthOfBasementFloor")).value).toBe("0.5");
		expect((await screen.findByTestId<HTMLInputElement>("heightOfBasementWalls")).value).toBe("1");
		expect((await screen.findByTestId<HTMLInputElement>("thermalResistanceOfBasementWalls")).value).toBe("1.2");
		expect((await screen.findByTestId<HTMLInputElement>("thermalTransmittanceOfBasementWalls")).value).toBe("1.3");
		expect((await screen.findByTestId<HTMLInputElement>("thermalTransmittanceOfFoundations")).value).toBe("1.4");
	});
			
	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(FloorAboveUnheatedBasement, {
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
		expect((await screen.findByTestId("perimeter_error"))).toBeDefined();
		expect((await screen.findByTestId("psiOfWallJunction_error"))).toBeDefined();
		expect((await screen.findByTestId("thicknessOfWalls_error"))).toBeDefined();
		expect((await screen.findByTestId("depthOfBasementFloor_error"))).toBeDefined();
		expect((await screen.findByTestId("heightOfBasementWalls_error"))).toBeDefined();
		expect((await screen.findByTestId("thermalResistanceOfBasementWalls_error"))).toBeDefined();
		expect((await screen.findByTestId("thermalTransmittanceOfBasementWalls_error"))).toBeDefined();
		expect((await screen.findByTestId("thermalTransmittanceOfFoundations_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(FloorAboveUnheatedBasement, {
			route: {
				params: { floor: "create" },
			},
		});
		await user.click(screen.getByTestId("saveAndComplete"));
		
		expect((await screen.findByTestId("floorAboveUnheatedBasementErrorSummary"))).toBeDefined();
	});
		
	test("app navigates to floors page when valid form is completed", async () => {
		// Arrange
		await renderSuspended(FloorAboveUnheatedBasement, {
			route: {
				params: { floor: "create" },
			},
		});
				
		// Act
		await user.type(screen.getByTestId("name"), "Floor above unheated basement 1");
		await user.type(screen.getByTestId("surfaceArea"), "1");
		await user.type(screen.getByTestId("uValue"), "1");
		await user.type(screen.getByTestId("thermalResistance"), "1"); 
		await user.click(screen.getByTestId("arealHeatCapacity_Very_light"));
		await user.click(screen.getByTestId("massDistributionClass_I"));
		await user.type(screen.getByTestId("perimeter"), "1");
		await user.type(screen.getByTestId("psiOfWallJunction"), "1");
		await user.type(screen.getByTestId("thicknessOfWalls"), "1");
		await user.type(screen.getByTestId("depthOfBasementFloor"), "1");
		await user.type(screen.getByTestId("heightOfBasementWalls"), "1");
		await user.type(screen.getByTestId("thermalResistanceOfBasementWalls"), "1");
		await user.type(screen.getByTestId("thermalTransmittanceOfBasementWalls"), "1");
		await user.type(screen.getByTestId("thermalTransmittanceOfFoundations"), "1");
		await user.tab();
		await user.click(screen.getByTestId("saveAndComplete"));
			
		// Assert
		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/floors");
	});
	
	test("floor above unheated basement section is marked as 'not complete' after form is saved and marked as complete", async () => {
		// Arrange
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceFloorAboveUnheatedBasement: {
						data: [{ data: floorAboveUnheatedBasement, complete: true }],
						complete: true,
					},
				},
			},
		});

		await renderSuspended(FloorAboveUnheatedBasement, {
			route: {
				params: { floor: "0" },
			},
		});
		
		// Act
		await user.click(screen.getByTestId("saveAndComplete"));

		// Assert
		expect(store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorAboveUnheatedBasement.complete).not.toBe(true);
	});

	describe("partially saving data", () => {
		test("new form data is automatically saved to store with given name", async () => {
			await renderSuspended(FloorAboveUnheatedBasement, {
				route: {
					params: { floor: "create" },
				},
			});
			
			await user.type(screen.getByTestId("name"), "Floor above unheated basement");
			await user.type(screen.getByTestId("surfaceArea"), "1");
			await user.type(screen.getByTestId("uValue"), "0.5");
			await user.type(screen.getByTestId("thermalResistance"), "2");
			await user.click(screen.getByTestId("arealHeatCapacity_Very_light"));
			await user.click(screen.getByTestId("massDistributionClass_E"));
			await user.type(screen.getByTestId("perimeter"), "1");
			await user.type(screen.getByTestId("psiOfWallJunction"), "0.5");
			await user.type(screen.getByTestId("thicknessOfWalls"), "0.7");
			await user.type(screen.getByTestId("depthOfBasementFloor"), "0.3");
			await user.type(screen.getByTestId("heightOfBasementWalls"), "0.8");
			await user.type(screen.getByTestId("thermalResistanceOfBasementWalls"), "1.2");
			await user.type(screen.getByTestId("thermalTransmittanceOfBasementWalls"), "1");
			await user.type(screen.getByTestId("thermalTransmittanceOfFoundations"), "0.9");
			await user.tab();
			
			const { data } = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorAboveUnheatedBasement;
			expect(data[0]!.data.name).toBe("Floor above unheated basement");
			expect(data[0]!.data.surfaceArea).toBe(1);
			expect(data[0]!.data.uValue).toBe(0.5);
			expect(data[0]!.data.thermalResistance).toBe(2);
			expect(data[0]!.data.arealHeatCapacity).toBe("Very light");
			expect(data[0]!.data.massDistributionClass).toBe("E");
			expect(data[0]!.data.perimeter).toBe(1);
			expect(data[0]!.data.psiOfWallJunction).toBe(0.5);
			expect(data[0]!.data.thicknessOfWalls).toBe(0.7);
			expect(data[0]!.data.depthOfBasementFloor).toBe(0.3);
			expect(data[0]!.data.heightOfBasementWalls).toBe(0.8);
			expect(data[0]!.data.thermalResistanceOfBasementWalls).toBe(1.2);
			expect(data[0]!.data.thermalTransmittanceOfBasementWalls).toBe(1);
			expect(data[0]!.data.thermalTransmittanceOfFoundations).toBe(0.9);
		});

		test("new form data is automatically saved to store with default name", async () => {
			await renderSuspended(FloorAboveUnheatedBasement, {
				route: {
					params: { floor: "create" },
				},
			});
			
			await user.type(screen.getByTestId("surfaceArea"), "10");
			await user.tab();
			
			const { data } = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorAboveUnheatedBasement;
			expect(data[0]!.data.name).toBe("Floor of an unheated basement");
			expect(data[0]!.data.surfaceArea).toBe(10);
		});

		test("updated form data is automatically saved to store", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceFloorAboveUnheatedBasement: {
							data: [{ data: floorAboveUnheatedBasement }],
						},
					},
				},
			});
			
			await renderSuspended(FloorAboveUnheatedBasement, {
				route: {
					params: { floor: 0 },
				},
			});

			const { data } = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorAboveUnheatedBasement;

			expect(data[0]!.data.name).toBe("Floor above unheated basement 1");
			expect(data[0]!.data.surfaceArea).toBe(2);

			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), "Updated floor");
			await user.clear(screen.getByTestId("surfaceArea"));
			await user.type(screen.getByTestId("surfaceArea"), "10");
			await user.tab();

			expect(data[0]!.data.name).toBe("Updated floor");
			expect(data[0]!.data.surfaceArea).toBe(10);
		});
		
		test("ground floor and ground floor section are set as 'not complete' after user edits a ground floor", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceFloorAboveUnheatedBasement: {
							data: [{ data: floorAboveUnheatedBasement, complete: true }],
							complete: true,
						},
					},
				},
			});

			await renderSuspended(FloorAboveUnheatedBasement, {
				route: {
					params: { floor: "0" },
				},
			});
		
			// Act
			await user.type(screen.getByTestId("name"), "Floor above unheated basement 2");
			await user.tab();
		
			// Assert
			expect(store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorAboveUnheatedBasement.data[0]?.complete).not.toBe(true);
			expect(store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorAboveUnheatedBasement.complete).not.toBe(true);
		});

		test("app navigates to floors overview page on clicking Save progress", async () => {
			await renderSuspended(FloorAboveUnheatedBasement, {
				route: {
					params: { floor: "create" },
				},
			});
			await user.click(screen.getByTestId("saveProgress"));
			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/floors");
		});
	});
});