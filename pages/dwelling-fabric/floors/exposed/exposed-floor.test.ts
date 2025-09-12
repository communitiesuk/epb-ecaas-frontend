import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import ExposedFloor from "./[floor].vue";
import { MassDistributionClass } from "~/schema/api-schema.types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("exposed floor", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const exposedFloor: ExposedFloorData = {
		name: "Exposed Floor 1",
		pitch: 180,
		orientation: 0,
		length: 0.5,
		width: 20,
		elevationalHeight: 20,
		surfaceArea: 10,
		solarAbsorption: 0.1,
		uValue: 1,
		kappaValue: 50000,
		massDistributionClass: MassDistributionClass.I,
	};

	afterEach(() => {
		store.$reset();
	});

	test("data is saved to store state and marked as complete when form is valid", async () => {
		await renderSuspended(ExposedFloor, {
			route: {
				params: { floor: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Exposed Floor 1");
		await user.type(screen.getByTestId("length"), "0.5");
		await user.type(screen.getByTestId("width"), "20"); 
		await user.type(screen.getByTestId("elevationalHeight"), "20");
		await user.type(screen.getByTestId("surfaceArea"), "10");
		await user.type(screen.getByTestId("solarAbsorption"), "0.1");
		await user.type(screen.getByTestId("uValue"), "1");
		await user.click(screen.getByTestId("kappaValue_50000"));
		await user.click(screen.getByTestId("massDistributionClass_I"));

		await user.click(screen.getByTestId("saveAndComplete"));

		const { dwellingSpaceExposedFloor } = store.dwellingFabric.dwellingSpaceFloors;
		
		expect(dwellingSpaceExposedFloor?.data[0]?.data).toEqual(exposedFloor);
		expect(dwellingSpaceExposedFloor?.data[0]?.complete).toEqual(true);
	});
	
	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceExposedFloor: {
						data: [{ data: exposedFloor }],
					},
				},
			},
		});

		await renderSuspended(ExposedFloor, {
			route: {
				params: { floor: "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Exposed Floor 1");
		expect((await screen.findByTestId<HTMLInputElement>("length")).value).toBe("0.5");
		expect((await screen.findByTestId<HTMLInputElement>("width")).value).toBe("20");
		expect((await screen.findByTestId<HTMLInputElement>("elevationalHeight")).value).toBe("20");
		expect((await screen.findByTestId<HTMLInputElement>("surfaceArea")).value).toBe("10");
		expect((await screen.findByTestId<HTMLInputElement>("solarAbsorption")).value).toBe("0.1");
		expect((await screen.findByTestId<HTMLInputElement>("uValue")).value).toBe("1");
		expect((await screen.findByTestId("kappaValue_50000")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("massDistributionClass_I")).hasAttribute("checked")).toBe(true);
	});
		
	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(ExposedFloor, {
			route: {
				params: { floor: "create" },
			},
		});
		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("length_error"))).toBeDefined();
		expect((await screen.findByTestId("width_error"))).toBeDefined();
		expect((await screen.findByTestId("elevationalHeight_error"))).toBeDefined();
		expect((await screen.findByTestId("surfaceArea_error"))).toBeDefined();
		expect((await screen.findByTestId("solarAbsorption_error"))).toBeDefined();
		expect((await screen.findByTestId("uValue_error"))).toBeDefined();
		expect((await screen.findByTestId("kappaValue_error"))).toBeDefined();
		expect((await screen.findByTestId("massDistributionClass_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(ExposedFloor, {
			route: {
				params: { floor: "create" },
			},
		});
		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("exposedFloorErrorSummary"))).toBeDefined();
	});

	test("app navigates to floors page when valid form is completed", async () => {
		// Arrange
		await renderSuspended(ExposedFloor);
		
		// Act
		await user.type(screen.getByTestId("name"), "Exposed Floor 1");
		await user.type(screen.getByTestId("length"), "0.5");
		await user.type(screen.getByTestId("width"), "20"); 
		await user.type(screen.getByTestId("elevationalHeight"), "20");
		await user.type(screen.getByTestId("surfaceArea"), "10");
		await user.type(screen.getByTestId("solarAbsorption"), "0.1");
		await user.type(screen.getByTestId("uValue"), "1");
		await user.click(screen.getByTestId("kappaValue_50000"));
		await user.click(screen.getByTestId("massDistributionClass_I"));
		await user.click(screen.getByTestId("saveAndComplete"));
	
		// Assert
		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/floors");
	});

	test("exposed floors section is marked as 'not complete' after form is saved and marked as complete", async () => {
		// Arrange
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceExposedFloor: {
						data: [{ data: exposedFloor, complete: true }],
						complete: true,
					},
				},
			},
		});
		
		await renderSuspended(ExposedFloor, {
			route: {
				params: { floor: "0" },
			},
		});
				
		// Act
		await user.click(screen.getByTestId("saveAndComplete"));
		
		// Assert
		expect(store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceExposedFloor.complete).not.toBe(true);
	});

	describe("partially saving data", () => {
		test("new form data is automatically saved to store with given name", async () => {
			await renderSuspended(ExposedFloor, {
				route: {
					params: { floor: "create" },
				},
			});
					
			await user.type(screen.getByTestId("name"), "Exposed floor 1");
			await user.type(screen.getByTestId("length"), "5");
			await user.type(screen.getByTestId("width"), "20"); 
			await user.tab();
					
			const { data } = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceExposedFloor;
			expect(data[0]!.data.name).toBe("Exposed floor 1");
			expect(data[0]!.data.length).toBe(5);
			expect(data[0]!.data.width).toBe(20);
		});

		test("new form data is automatically saved to store with default name", async () => {
			await renderSuspended(ExposedFloor, {
				route: {
					params: { floor: "create" },
				},
			});
				
			await user.type(screen.getByTestId("length"), "0.5");
			await user.type(screen.getByTestId("width"), "20"); 
			await user.tab();
					
			const { data } = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceExposedFloor;
			expect(data[0]!.data.name).toBe("Exposed floor");
			expect(data[0]!.data.length).toBe(0.5);
			expect(data[0]!.data.width).toBe(20);
		});
		
		test("updated form data is automatically saved to store", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceExposedFloor: {
							data: [{ data: exposedFloor }],
						},
					},
				},
			});
					
			await renderSuspended(ExposedFloor, {
				route: {
					params: { floor: 0 },
				},
			});
		
			const { data } = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceExposedFloor;
			expect(data[0]!.data.name).toBe("Exposed Floor 1");
			expect(data[0]!.data.length).toBe(0.5);
		
			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), "Exposed floor garage");
			await user.clear(screen.getByTestId("length"));
			await user.type(screen.getByTestId("length"), "9");
			await user.tab();
		
			expect(data[0]!.data.name).toBe("Exposed floor garage");
			expect(data[0]!.data.length).toBe(9);
		});
		
		test("exposed floor and exposed floor section are set as 'not complete' after user edits an exposed floor", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceExposedFloor: {
							data: [{ data: exposedFloor, complete: true }],
							complete: true,
						},
					},
				},
			});
				
			await renderSuspended(ExposedFloor, {
				route: {
					params: { floor: "0" },
				},
			});
						
			// Act
			await user.type(screen.getByTestId("name"), "Exposed");
			await user.tab();
						
			// Assert
			expect(store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceExposedFloor.data[0]?.complete).not.toBe(true);
			expect(store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceExposedFloor.complete).not.toBe(true);
		});

		test("app navigates to floors overview page on clicking Save progress", async () => {
			await renderSuspended(ExposedFloor);
			await user.click(screen.getByTestId("saveProgress"));
			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/floors");
		});
	});
});