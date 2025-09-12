import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import InternalFloor from "./[floor].vue";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("internal floor", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const internalFloor: InternalFloorData = {
		typeOfInternalFloor: AdjacentSpaceType.heatedSpace,
		name: "Internal 1",
		surfaceAreaOfElement: 5,
		kappaValue: 50000,
		massDistributionClass: "I",
	};

	const internalFloorWithUnheatedSpace: InternalFloorData = {
		...internalFloor,
		typeOfInternalFloor: AdjacentSpaceType.unheatedSpace,
		thermalResistanceOfAdjacentUnheatedSpace: 0,
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Internal 1");
		await user.type(screen.getByTestId("surfaceAreaOfElement"), "5");
		await user.click(screen.getByTestId("kappaValue_50000"));
		await user.click(screen.getByTestId("massDistributionClass_I"));
	};
	
	describe("when type of internal floor is heated space", () => {
		test("data is saved to store state and marked as complete when form is valid", async () => {
			await renderSuspended(InternalFloor, {
				route: {
					params: { floor: "create" },
				},
			});	
	
			await user.click(screen.getByTestId("typeOfInternalFloor_heatedSpace"));
			await populateValidForm();
			await user.click(screen.getByTestId("saveAndComplete"));
	
			const  { dwellingSpaceInternalFloor } = store.dwellingFabric.dwellingSpaceFloors;
			
			expect(dwellingSpaceInternalFloor?.data[0]?.data).toEqual(internalFloor);
			expect(dwellingSpaceInternalFloor?.data[0]?.complete).toEqual(true);
		});
	
		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceInternalFloor: {
							data: [{ data: internalFloor }],
						},
					},
				},
			});
	
			await renderSuspended(InternalFloor, {
				route: {
					params: { floor: "0" },
				},
			});
	
			expect((await screen.findByTestId("typeOfInternalFloor_heatedSpace")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Internal 1");
			expect((await screen.findByTestId<HTMLInputElement>("surfaceAreaOfElement")).value).toBe("5");
			expect((await screen.findByTestId("kappaValue_50000")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId("massDistributionClass_I")).hasAttribute("checked")).toBe(true);
		});

		it("requires additional fields when heated space is selected", async () => {
			await renderSuspended(InternalFloor);
	
			await user.click(screen.getByTestId("typeOfInternalFloor_heatedSpace"));
			await user.click(screen.getByTestId("saveAndComplete"));
	
			expect((await screen.findByTestId("name_error"))).toBeDefined();
			expect((await screen.findByTestId("surfaceAreaOfElement_error"))).toBeDefined();
			expect((await screen.findByTestId("kappaValue_error"))).toBeDefined();
			expect((await screen.findByTestId("massDistributionClass_error"))).toBeDefined();
		});
	});
	
	describe("when type of internal floor is unheated space", () => {
		test("data is saved to store state and marked as complete when form is valid", async () => {
			await renderSuspended(InternalFloor, {
				route: {
					params: { floor: "create" },
				},
			});	
			await user.click(screen.getByTestId("typeOfInternalFloor_unheatedSpace"));
			await populateValidForm();
			await user.type(screen.getByTestId("thermalResistanceOfAdjacentUnheatedSpace"), "0");
			await user.tab();
			await user.click(screen.getByTestId("saveAndComplete"));
	
			const { dwellingSpaceInternalFloor } = store.dwellingFabric.dwellingSpaceFloors;
			
			expect(dwellingSpaceInternalFloor?.data[0]?.data).toEqual(internalFloorWithUnheatedSpace);
			expect(dwellingSpaceInternalFloor?.data[0]?.complete).toBe(true);
		});
	
		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceInternalFloor: {
							data: [{ data: internalFloorWithUnheatedSpace }],
						},
					},
				},
			});
	
			await renderSuspended(InternalFloor, {
				route: {
					params: { floor: "0" },
				},
			});
	
			expect((await screen.findByTestId("typeOfInternalFloor_unheatedSpace")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("thermalResistanceOfAdjacentUnheatedSpace")).value).toBe("0");
		});

		it("requires additional fields when heated space is selected", async () => {
			await renderSuspended(InternalFloor);
	
			await user.click(screen.getByTestId("typeOfInternalFloor_unheatedSpace"));
			await user.click(screen.getByTestId("saveAndComplete"));
	
			expect((await screen.findByTestId("thermalResistanceOfAdjacentUnheatedSpace_error"))).toBeDefined();
		});
	});

	test("shows type of internal floor required error message when empty form is submitted", async () => {
		await renderSuspended(InternalFloor);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("typeOfInternalFloor_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(InternalFloor);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("internalFloorErrorSummary"))).toBeDefined();
	});

	test("app navigates to floors page when valid form is completed", async () => {
		await renderSuspended(InternalFloor);
	
		await user.click(screen.getByTestId("typeOfInternalFloor_heatedSpace"));
		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/floors");
	});

	describe("internal floor section status", () => {
		test("section is marked as 'not complete' after form is saved and marked as complete", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceInternalFloor: {
							data: [{ data: internalFloor, complete: true }],
							complete: true,
						},
					},
				},
			});
	
			await renderSuspended(InternalFloor, {
				route: {
					params: { floor: "0" },
				},
			});
			
			// Act
			await user.click(screen.getByTestId("saveAndComplete"));
	
			// Assert
			expect(store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor.complete).not.toBe(true);
		});
	});

	describe("partially saving data", () => {
		test("new form data is automatically saved to store with given name", async () => {
			await renderSuspended(InternalFloor, {
				route: {
					params: { floor: "create" },
				},
			});
				
			await user.click(screen.getByTestId("typeOfInternalFloor_heatedSpace"));
			await user.type(screen.getByTestId("name"), "Internal floor kitchen");
			await user.type(screen.getByTestId("surfaceAreaOfElement"), "5");
			await user.click(screen.getByTestId("kappaValue_50000"));
			await user.click(screen.getByTestId("massDistributionClass_I"));
			await user.tab();
				
			const { data } = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor;
			expect(data[0]!.data.name).toBe("Internal floor kitchen");
			expect(data[0]!.data.surfaceAreaOfElement).toBe(5);
			expect(data[0]!.data.kappaValue).toBe(50000);
			expect(data[0]!.data.massDistributionClass).toBe("I");	
		});

		test("new form data is automatically saved to store with default name", async () => {
			await renderSuspended(InternalFloor, {
				route: {
					params: { floor: "create" },
				},
			});
			
			await user.click(screen.getByTestId("typeOfInternalFloor_heatedSpace"));
			await user.type(screen.getByTestId("surfaceAreaOfElement"), "5");
			await user.tab();
				
			const { data } = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor;
			expect(data[0]!.data.name).toBe("Internal floor");
			expect(data[0]!.data.surfaceAreaOfElement).toBe(5);
		});
	
		test("updated form data is automatically saved to store", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceInternalFloor: {
							data: [{ data: internalFloorWithUnheatedSpace }],
						},
					},
				},
			});
				
			await renderSuspended(InternalFloor, {
				route: {
					params: { floor: 0 },
				},
			});
	
			const { data } = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor;
			expect(data[0]!.data.name).toBe("Internal 1");
			expect(data[0]!.data.typeOfInternalFloor).toBe(AdjacentSpaceType.unheatedSpace);
	
			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), "Main internal floor");
			await user.click(screen.getByTestId("typeOfInternalFloor_heatedSpace"));
			await user.tab();
	
			expect(data[0]!.data.name).toBe("Main internal floor");
			expect(data[0]!.data.typeOfInternalFloor).toBe(AdjacentSpaceType.heatedSpace);
		});

		test("internal floor and internal floor section are set as 'not complete' after user edits an internal floor", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceInternalFloor: {
							data: [{ data: internalFloor, complete: true }],
							complete: true,
						},
					},
				},
			});
		
			await renderSuspended(InternalFloor, {
				route: {
					params: { floor: "0" },
				},
			});
				
			// Act
			await user.type(screen.getByTestId("name"), "Internal floor 1");
			await user.tab();
				
			// Assert
			expect(store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor.data[0]?.complete).not.toBe(true);
			expect(store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor.complete).not.toBe(true);
		});
	
		test("app navigates to floors overview page on clicking Save progress", async () => {
			await renderSuspended(InternalFloor);
			await user.click(screen.getByTestId("saveProgress"));
			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/floors");
		});
	});
});