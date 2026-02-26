import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Floors from "./index.vue";
import { screen } from "@testing-library/vue";
import { within } from "@testing-library/dom";
import formStatus from "~/constants/formStatus";
import type { FloorOfHeatedBasementData } from "~/stores/ecaasStore.schema";

describe("floors", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});

	const ground1: GroundFloorData = {
		name: "Ground floor 1",
		surfaceArea: 5,
		uValue: 1,
		thermalResistance: 1,
		arealHeatCapacity: "Very light",
		massDistributionClass: "I",
		perimeter: 0,
		psiOfWallJunction: 0,
		thicknessOfWalls: 0.3,
		typeOfGroundFloor: "Slab_no_edge_insulation",
	};

	const ground2: GroundFloorData = {
		name: "Ground floor 2",
		surfaceArea: 5,
		uValue: 1,
		thermalResistance: 1,
		arealHeatCapacity: "Very light",
		massDistributionClass: "I",
		perimeter: 0,
		psiOfWallJunction: 0,
		thicknessOfWalls: 0.4,
		typeOfGroundFloor: "Slab_no_edge_insulation",
	};

	const ground3: GroundFloorData = {
		name: "Ground floor 3",
		surfaceArea: 5,
		uValue: 1,
		thermalResistance: 1,
		arealHeatCapacity: "Very light",
		massDistributionClass: "I",
		perimeter: 0,
		psiOfWallJunction: 0,
		thicknessOfWalls: 0.5,
		typeOfGroundFloor: "Slab_no_edge_insulation",
	};

	const internal1: InternalFloorData = {
		typeOfInternalFloor: "heatedSpace",
		name: "Internal floor 1",
		surfaceAreaOfElement: 5,
		arealHeatCapacity: "Very light",
		massDistributionClass: "I",
	};

	const internal2: InternalFloorData = {
		typeOfInternalFloor: "heatedSpace",
		name: "Internal floor 2",
		surfaceAreaOfElement: 5,
		arealHeatCapacity: "Very light",
		massDistributionClass: "I",
	};

	const internal3: InternalFloorData = {
		typeOfInternalFloor: "heatedSpace",
		name: "Internal floor 3",
		surfaceAreaOfElement: 5,
		arealHeatCapacity: "Very light",
		massDistributionClass: "I",
	};

	const exposed1: ExposedFloorData = {
		name: "Exposed floor 1",
		pitch: 0,
		length: 0.5,
		width: 20,
		elevationalHeight: 20,
		surfaceArea: 10,
		thermalResistance: 1,
		colour: "Light",
		arealHeatCapacity: "Very light",
		massDistributionClass: "I",
	};

	const exposed2: ExposedFloorData = {
		name: "Exposed floor 2",
		pitch: 0,
		length: 0.5,
		width: 20,
		elevationalHeight: 20,
		surfaceArea: 10,
		thermalResistance: 1,
		colour: "Dark",
		arealHeatCapacity: "Very light",
		massDistributionClass: "I",
	};

	const exposed3: ExposedFloorData = {
		name: "Exposed floor 3",
		pitch: 0,
		length: 0.5,
		width: 20,
		elevationalHeight: 20,
		surfaceArea: 10,
		thermalResistance: 1,
		colour: "Intermediate",
		arealHeatCapacity: "Very light",
		massDistributionClass: "I",
	};

	const floorAboveUnheatedBasement1: FloorAboveUnheatedBasementData = {
		name: "Floor above unheated basement 1",
		surfaceArea: 10,
		uValue: 1,
		thermalResistance: 1,
		arealHeatCapacity: "Light",
		massDistributionClass: "E",
		perimeter: 2,
		psiOfWallJunction: 0.5,
		thicknessOfWalls: 0.5,
		depthOfBasementFloor: 1,
		heightOfBasementWalls: 2,
		thermalResistanceOfBasementWalls: 1,
		thermalTransmittanceOfBasementWalls: 1,
		thermalTransmittanceOfFoundations: 2,
	};

	const floorAboveUnheatedBasement2: FloorAboveUnheatedBasementData = {
		name: "Floor above unheated basement 2",
		surfaceArea: 8,
		uValue: 2,
		thermalResistance: 0.5,
		arealHeatCapacity: "Very light",
		massDistributionClass: "IE",
		perimeter: 2.5,
		psiOfWallJunction: 0.9,
		thicknessOfWalls: 0.7,
		depthOfBasementFloor: 0.5,
		heightOfBasementWalls: 3,
		thermalResistanceOfBasementWalls: 1.5,
		thermalTransmittanceOfBasementWalls: 2,
		thermalTransmittanceOfFoundations: 1,
	};

	const floorAboveUnheatedBasement3: FloorAboveUnheatedBasementData = {
		name: "Floor above unheated basement 3",
		surfaceArea: 5,
		uValue: 1.5,
		thermalResistance: 0.7,
		arealHeatCapacity: "Medium",
		massDistributionClass: "D",
		perimeter: 1.5,
		psiOfWallJunction: 0.3,
		thicknessOfWalls: 1,
		depthOfBasementFloor: 0.8,
		heightOfBasementWalls: 2,
		thermalResistanceOfBasementWalls: 0.7,
		thermalTransmittanceOfBasementWalls: 0.5,
		thermalTransmittanceOfFoundations: 1.5,
	};

	const floorOfHeatedBasement1: FloorOfHeatedBasementData = {
		id: "974e8749-f465-4f43-a38a-3d0b97060a64",
		name: "Floor of heated basement 1",
		surfaceArea: 45,
		uValue: 0.25,
		thermalResistance: 4,
		arealHeatCapacity: "Medium",
		massDistributionClass: "I",
		depthOfBasementFloor: 2.5,
		perimeter: 30,
		psiOfWallJunction: 0.08,
		thicknessOfWalls: 0.3,
	};

	const floorOfHeatedBasement2: FloorOfHeatedBasementData = {
		id: "074e8749-f465-4f43-a38a-3d0b97060a64",
		name: "Floor of heated basement 2",
		surfaceArea: 50,
		uValue: 0.3,
		thermalResistance: 3.5,
		arealHeatCapacity: "Heavy",
		massDistributionClass: "E",
		depthOfBasementFloor: 3,
		perimeter: 32,
		psiOfWallJunction: 0.1,
		thicknessOfWalls: 0.4,
	};

	const floorOfHeatedBasement3: FloorOfHeatedBasementData = {
		id: "174e8749-f465-4f43-a38a-3d0b97060a64",
		name: "Floor of heated basement 3",
		surfaceArea: 40,
		uValue: 0.2,
		thermalResistance: 5,
		arealHeatCapacity: "Very light",
		massDistributionClass: "M",
		depthOfBasementFloor: 2,
		perimeter: 28,
		psiOfWallJunction: 0.05,
		thicknessOfWalls: 0.25,
	};

	afterEach(() => {
		store.$reset();
	});

	describe("ground floors", () => {
		test("correct floor is removed when its remove link is clicked", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceGroundFloor: {
							data: [{ data: ground1 }, { data: ground2 }, { data: ground3 }],
						},
					},
				},
			});
			await renderSuspended(Floors);

			// Act
			await user.click(screen.getByTestId("ground_remove_1"));

			// Assert
			const groundFloors = screen.getByTestId("ground_items");
			expect(within(groundFloors).getByText("Ground floor 1")).toBeDefined();
			expect(within(groundFloors).getByText("Ground floor 3")).toBeDefined();
			expect(within(groundFloors).queryByText("Ground floor 2")).toBeNull();
		});

		test("correct floor is duplicated when its duplicate link is clicked", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceGroundFloor: {
							data: [{ data: ground1 }, { data: ground2 }],
						},
					},
				},
			});
			await renderSuspended(Floors);

			// Act
			await userEvent.click(screen.getByTestId("ground_duplicate_0"));
			await userEvent.click(screen.getByTestId("ground_duplicate_0"));
			await userEvent.click(screen.getByTestId("ground_duplicate_2"));

			// Assert
			expect(screen.queryAllByTestId("ground_item").length).toBe(5);
			expect(screen.getByText("Ground floor 1")).toBeDefined();
			expect(screen.getByText("Ground floor 1 (1)")).toBeDefined();
			expect(screen.getByText("Ground floor 1 (2)")).toBeDefined();
			expect(screen.getByText("Ground floor 1 (1) (1)")).toBeDefined();
		});

		test("an in-progress indicator is shown when an entry is not marked as complete", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceGroundFloor: {
							data: [{ data: ground1 }],
						},
					},
				},
			});

			// Act
			await renderSuspended(Floors);

			// Assert
			expect(screen.getByTestId("ground_status_0").textContent).toBe(
				formStatus.inProgress.text,
			);
		});

		test("a complete indicator is shown when an entry is marked as complete", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceGroundFloor: {
							data: [
								{
									data: ground1,
									complete: true,
								},
							],
						},
					},
				},
			});

			// Act
			await renderSuspended(Floors);

			// Assert
			expect(screen.getByTestId("ground_status_0").textContent).toBe(
				formStatus.complete.text,
			);
		});
	});

	describe("internal floors", () => {
		test("correct floor is removed when its remove link is clicked", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceInternalFloor: {
							data: [
								{ data: internal1 },
								{ data: internal2 },
								{ data: internal3 },
							],
						},
					},
				},
			});
			await renderSuspended(Floors);

			// Act
			await user.click(screen.getByTestId("internal_remove_1"));

			// Assert
			const internalFloors = screen.getByTestId("internal_items");
			expect(
				within(internalFloors).getByText("Internal floor 1"),
			).toBeDefined();
			expect(
				within(internalFloors).getByText("Internal floor 3"),
			).toBeDefined();
			expect(within(internalFloors).queryByText("internal2 name")).toBeNull();
		});

		test("correct floor is duplicated when its duplicate link is clicked", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceInternalFloor: {
							data: [{ data: internal1 }, { data: internal2 }],
						},
					},
				},
			});
			await renderSuspended(Floors);

			// Act
			await userEvent.click(screen.getByTestId("internal_duplicate_0"));
			await userEvent.click(screen.getByTestId("internal_duplicate_0"));
			await userEvent.click(screen.getByTestId("internal_duplicate_2"));

			// Assert
			expect(screen.queryAllByTestId("internal_item").length).toBe(5);
			expect(screen.getByText("Internal floor 1")).toBeDefined();
			expect(screen.getByText("Internal floor 1 (1)")).toBeDefined();
			expect(screen.getByText("Internal floor 1 (2)")).toBeDefined();
			expect(screen.getByText("Internal floor 1 (1) (1)")).toBeDefined();
		});

		test("an in-progress indicator is shown when an entry is not marked as complete", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceInternalFloor: {
							data: [{ data: internal1 }],
						},
					},
				},
			});

			// Act
			await renderSuspended(Floors);

			// Assert
			expect(screen.getByTestId("internal_status_0").textContent).toBe(
				formStatus.inProgress.text,
			);
		});

		test("a complete indicator is shown when an entry is marked as complete", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceInternalFloor: {
							data: [{ data: internal1, complete: true }],
						},
					},
				},
			});

			// Act
			await renderSuspended(Floors);

			// Assert
			expect(screen.getByTestId("internal_status_0").textContent).toBe(
				formStatus.complete.text,
			);
		});
	});

	describe("exposed floors", () => {
		test("correct floor is removed when its remove link is clicked", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceExposedFloor: {
							data: [
								{ data: exposed1 },
								{ data: exposed2 },
								{ data: exposed3 },
							],
						},
					},
				},
			});
			await renderSuspended(Floors);

			// Act
			await user.click(screen.getByTestId("exposed_remove_1"));

			// Assert
			const populatedList = screen.getByTestId("exposed_items");
			expect(within(populatedList).getByText("Exposed floor 1")).toBeDefined();
			expect(within(populatedList).getByText("Exposed floor 3")).toBeDefined();
			expect(within(populatedList).queryByText("Exposed floor 2")).toBeNull();
		});

		test("correct floor is duplicated when duplicate link is clicked", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceExposedFloor: {
							data: [{ data: exposed1 }, { data: exposed2 }],
						},
					},
				},
			});
			await renderSuspended(Floors);

			// Act
			await userEvent.click(screen.getByTestId("exposed_duplicate_0"));
			await userEvent.click(screen.getByTestId("exposed_duplicate_0"));
			await userEvent.click(screen.getByTestId("exposed_duplicate_2"));

			// Assert
			expect(screen.queryAllByTestId("exposed_item").length).toBe(5);
			expect(screen.getByText("Exposed floor 1")).toBeDefined();
			expect(screen.getByText("Exposed floor 1 (1)")).toBeDefined();
			expect(screen.getByText("Exposed floor 1 (2)")).toBeDefined();
			expect(screen.getByText("Exposed floor 1 (1) (1)")).toBeDefined();
		});

		test("an in-progress indicator is shown when an entry is not marked as complete", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceExposedFloor: {
							data: [
								{
									data: exposed1,
								},
							],
						},
					},
				},
			});

			// Act
			await renderSuspended(Floors);

			// Assert
			expect(screen.getByTestId("exposed_status_0").textContent).toBe(
				formStatus.inProgress.text,
			);
		});

		test("a complete indicator is shown when an entry is marked as complete", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceExposedFloor: {
							data: [
								{
									data: exposed1,
									complete: true,
								},
							],
						},
					},
				},
			});

			// Act
			await renderSuspended(Floors);

			// Assert
			expect(screen.getByTestId("exposed_status_0").textContent).toBe(
				formStatus.complete.text,
			);
		});
	});

	describe("floors above an unheated basement", () => {
		test("correct floor is removed when its remove link is clicked", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceFloorAboveUnheatedBasement: {
							data: [
								{ data: floorAboveUnheatedBasement1 },
								{ data: floorAboveUnheatedBasement2 },
								{ data: floorAboveUnheatedBasement3 },
							],
						},
					},
				},
			});
			await renderSuspended(Floors);

			// Act
			await user.click(screen.getByTestId("aboveUnheatedBasement_remove_1"));

			// Assert
			const populatedList = screen.getByTestId("aboveUnheatedBasement_items");
			expect(within(populatedList).getByText("Floor above unheated basement 1")).toBeDefined();
			expect(within(populatedList).getByText("Floor above unheated basement 3")).toBeDefined();
			expect(within(populatedList).queryByText("Floor above unheated basement 2")).toBeNull();
		});

		test("correct floor is duplicated when duplicate link is clicked", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceFloorAboveUnheatedBasement: {
							data: [{ data: floorAboveUnheatedBasement1 }, { data: floorAboveUnheatedBasement2 }],
						},
					},
				},
			});
			await renderSuspended(Floors);

			// Act
			await userEvent.click(screen.getByTestId("aboveUnheatedBasement_duplicate_0"));
			await userEvent.click(screen.getByTestId("aboveUnheatedBasement_duplicate_0"));
			await userEvent.click(screen.getByTestId("aboveUnheatedBasement_duplicate_2"));

			// Assert
			expect(screen.queryAllByTestId("aboveUnheatedBasement_item").length).toBe(5);
			expect(screen.getByText("Floor above unheated basement 1")).toBeDefined();
			expect(screen.getByText("Floor above unheated basement 1 (1)")).toBeDefined();
			expect(screen.getByText("Floor above unheated basement 1 (2)")).toBeDefined();
			expect(screen.getByText("Floor above unheated basement 1 (1) (1)")).toBeDefined();
		});

		test("an in-progress indicator is shown when an entry is not marked as complete", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceFloorAboveUnheatedBasement: {
							data: [{ data: floorAboveUnheatedBasement1 }],
						},
					},
				},
			});

			// Act
			await renderSuspended(Floors);

			// Assert
			expect(screen.getByTestId("aboveUnheatedBasement_status_0").textContent).toBe(
				formStatus.inProgress.text,
			);
		});

		test("a complete indicator is shown when an entry is marked as complete", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceFloorAboveUnheatedBasement: {
							data: [
								{
									data: floorAboveUnheatedBasement1,
									complete: true,
								},
							],
						},
					},
				},
			});

			// Act
			await renderSuspended(Floors);

			// Assert
			expect(screen.getByTestId("aboveUnheatedBasement_status_0").textContent).toBe(
				formStatus.complete.text,
			);
		});
	});

	describe("floor of a heated basement", () => {
		test("correct floor is removed when its remove link is clicked", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceFloorOfHeatedBasement: {
							data: [
								{ data: floorOfHeatedBasement1 },
								{ data: floorOfHeatedBasement2 },
								{ data: floorOfHeatedBasement3 },
							],
						},
					},
				},
			});
			await renderSuspended(Floors);

			// Act
			await user.click(screen.getByTestId("floorOfHeatedBasement_remove_1"));

			// Assert
			const populatedList = screen.getByTestId("floorOfHeatedBasement_items");
			expect(within(populatedList).getByText("Floor of heated basement 1")).toBeDefined();
			expect(within(populatedList).getByText("Floor of heated basement 3")).toBeDefined();
			expect(within(populatedList).queryByText("Floor of heated basement 2")).toBeNull();
		});

		test("correct floor is duplicated when duplicate link is clicked", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceFloorOfHeatedBasement: {
							data: [{ data: floorOfHeatedBasement1 }, { data: floorOfHeatedBasement2 }],
						},
					},
				},
			});
			await renderSuspended(Floors);

			// Act
			await userEvent.click(screen.getByTestId("floorOfHeatedBasement_duplicate_0"));
			await userEvent.click(screen.getByTestId("floorOfHeatedBasement_duplicate_0"));
			await userEvent.click(screen.getByTestId("floorOfHeatedBasement_duplicate_2"));

			// Assert
			expect(screen.queryAllByTestId("floorOfHeatedBasement_item").length).toBe(5);
			expect(screen.getByText("Floor of heated basement 1")).toBeDefined();
			expect(screen.getByText("Floor of heated basement 1 (1)")).toBeDefined();
			expect(screen.getByText("Floor of heated basement 1 (2)")).toBeDefined();
			expect(screen.getByText("Floor of heated basement 1 (1) (1)")).toBeDefined();
		});

		test("an in-progress indicator is shown when an entry is not marked as complete", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceFloorOfHeatedBasement: {
							data: [{ data: floorOfHeatedBasement1 }],
						},
					},
				},
			});

			// Act
			await renderSuspended(Floors);

			// Assert
			expect(screen.getByTestId("floorOfHeatedBasement_status_0").textContent).toBe(
				formStatus.inProgress.text,
			);
		});

		test("a complete indicator is shown when an entry is marked as complete", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceFloorOfHeatedBasement: {
							data: [
								{
									data: floorOfHeatedBasement1,
									complete: true,
								},
							],
						},
					},
				},
			});

			// Act
			await renderSuspended(Floors);

			// Assert
			expect(screen.getByTestId("floorOfHeatedBasement_status_0").textContent).toBe(
				formStatus.complete.text,
			);
		});
	});

	describe("mark section as complete", () => {
		const addCompleteFloorDataToStore = async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceGroundFloor: {
							data: [{ data: ground1, complete: true }],
						},
						dwellingSpaceInternalFloor: {
							data: [{ data: internal1, complete: true }],
						},
						dwellingSpaceExposedFloor: {
							data: [{ data: exposed1, complete: true }],
						},
						dwellingSpaceFloorAboveUnheatedBasement: {
							data: [{ data: floorAboveUnheatedBasement1, complete: true }],
						},
						dwellingSpaceFloorOfHeatedBasement: {
							data: [{ data: floorOfHeatedBasement1, complete: true }],
						},
					},
				},
			});
		};

		test("the 'Mark section as complete' button is disbaled when a floor is incomplete", async () => {
			// Arrange
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceGroundFloor: {
							data: [{ data: ground1, complete: false }],
						},
						dwellingSpaceInternalFloor: {
							data: [{ data: internal1, complete: false }],
						},
						dwellingSpaceExposedFloor: {
							data: [{ data: exposed1, complete: false }],
						},
					},
				},
			});

			// Act
			await renderSuspended(Floors);

			// Assert
			const markAsCompleteButton = screen.getByTestId("markAsCompleteButton");
			expect(markAsCompleteButton.hasAttribute("disabled")).toBeTruthy();
		});

		test("the 'Mark section as complete' button is enabled when all floors are complete", async () => {
			// Arrange
			await addCompleteFloorDataToStore();

			// Act
			await renderSuspended(Floors);

			// Assert
			const markAsCompleteButton = screen.getByTestId("markAsCompleteButton");
			expect(markAsCompleteButton).not.toBeNull();
		});

		test("the 'Completed' section status indicator is not shown when section has not been marked as complete", async () => {
			// Arrange, Act
			await renderSuspended(Floors);

			// Assert
			const completed = screen.queryByTestId("completeSectionCompleted");
			expect(completed?.style.display).toBe("none");
		});

		describe("after section has been marked as complete", () => {
			// Arrange (and act)
			beforeEach(async () => {
				await addCompleteFloorDataToStore();
				await renderSuspended(Floors);
				const markAsCompleteButton = screen.getByTestId("markAsCompleteButton");
				await user.click(markAsCompleteButton);
			});

			test("the 'Completed' section status indicator is shown", async () => {
				// Assert
				const completed = screen.queryByTestId("completeSectionCompleted");
				expect(completed?.style.display).not.toBe("none");
			});

			test("app navigates to the dwelling fabric page", async () => {
				// Assert
				expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric");
			});

			test("each floor category is complete", async () => {
				// Assert
				const {
					dwellingSpaceGroundFloor,
					dwellingSpaceInternalFloor,
					dwellingSpaceExposedFloor,
					dwellingSpaceFloorAboveUnheatedBasement,
					dwellingSpaceFloorOfHeatedBasement,
				} = store.dwellingFabric.dwellingSpaceFloors;
				expect(dwellingSpaceGroundFloor?.complete).toBe(true);
				expect(dwellingSpaceInternalFloor?.complete).toBe(true);
				expect(dwellingSpaceExposedFloor?.complete).toBe(true);
				expect(dwellingSpaceFloorAboveUnheatedBasement?.complete).toBe(true);
				expect(dwellingSpaceFloorOfHeatedBasement?.complete).toBe(true);
			});

			test("each floor category is not complete after user removes a floor from each", async () => {
				// Act
				await user.click(screen.getByTestId("ground_remove_0"));
				await user.click(screen.getByTestId("internal_remove_0"));
				await user.click(screen.getByTestId("exposed_remove_0"));
				await user.click(screen.getByTestId("aboveUnheatedBasement_remove_0"));
				await user.click(screen.getByTestId("floorOfHeatedBasement_remove_0"));

				// Assert
				const {
					dwellingSpaceGroundFloor,
					dwellingSpaceInternalFloor,
					dwellingSpaceExposedFloor,
					dwellingSpaceFloorAboveUnheatedBasement,
					dwellingSpaceFloorOfHeatedBasement,
				} = store.dwellingFabric.dwellingSpaceFloors;
				expect(dwellingSpaceGroundFloor?.complete).toBe(false);
				expect(dwellingSpaceInternalFloor?.complete).toBe(false);
				expect(dwellingSpaceExposedFloor?.complete).toBe(false);
				expect(dwellingSpaceFloorAboveUnheatedBasement?.complete).toBe(false);
				expect(dwellingSpaceFloorOfHeatedBasement?.complete).toBe(false);
			});

			test("each floor category is not complete after user duplicates a floor in each", async () => {
				// Act
				await user.click(screen.getByTestId("ground_duplicate_0"));
				await user.click(screen.getByTestId("internal_duplicate_0"));
				await user.click(screen.getByTestId("exposed_duplicate_0"));
				await user.click(screen.getByTestId("aboveUnheatedBasement_duplicate_0"));
				await user.click(screen.getByTestId("floorOfHeatedBasement_duplicate_0"));

				// Assert
				const {
					dwellingSpaceGroundFloor,
					dwellingSpaceInternalFloor,
					dwellingSpaceExposedFloor,
					dwellingSpaceFloorAboveUnheatedBasement,
					dwellingSpaceFloorOfHeatedBasement,
				} = store.dwellingFabric.dwellingSpaceFloors;
				expect(dwellingSpaceGroundFloor?.complete).toBe(false);
				expect(dwellingSpaceInternalFloor?.complete).toBe(false);
				expect(dwellingSpaceExposedFloor?.complete).toBe(false);
				expect(dwellingSpaceFloorAboveUnheatedBasement?.complete).toBe(false);
				expect(dwellingSpaceFloorOfHeatedBasement?.complete).toBe(false);
			});
		});
	});
});
