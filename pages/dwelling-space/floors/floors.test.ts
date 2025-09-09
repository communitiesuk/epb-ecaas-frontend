import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Floors from "./index.vue";
import GroundFloorForm from "./ground/[floor].vue";
import InternalFloorForm from "./internal/[floor].vue";
import ExposedFloorForm from "./exposed/[floor].vue";

import { screen } from "@testing-library/vue";
import { within } from "@testing-library/dom";
import { FloorType, MassDistributionClass } from "~/schema/api-schema.types";
import type { Component } from "vue";
import formStatus from "~/constants/formStatus";

describe("floors", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});

	const ground1: GroundFloorData = {
		name: "ground1 name",
		surfaceArea: 5,
		pitch: 0,
		uValue: 1,
		thermalResistance: 1,
		kappaValue: 100,
		massDistributionClass: MassDistributionClass.I,
		perimeter: 0,
		psiOfWallJunction: 0,
		thicknessOfWalls: 0.3,
		typeOfGroundFloor: FloorType.Slab_no_edge_insulation
	};

	const ground2: GroundFloorData = {
		name: "ground2 name",
		surfaceArea: 5,
		pitch: 0,
		uValue: 1,
		thermalResistance: 1,
		kappaValue: 100,
		massDistributionClass: MassDistributionClass.I,
		perimeter: 0,
		psiOfWallJunction: 0,
		thicknessOfWalls: 0.4,
		typeOfGroundFloor: FloorType.Slab_no_edge_insulation
	};

	const ground3: GroundFloorData = {
		name: "ground3 name",
		surfaceArea: 5,
		pitch: 0,
		uValue: 1,
		thermalResistance: 1,
		kappaValue: 100,
		massDistributionClass: MassDistributionClass.I,
		perimeter: 0,
		psiOfWallJunction: 0,
		thicknessOfWalls: 0.5,
		typeOfGroundFloor: FloorType.Slab_no_edge_insulation
	};
	
	const internal1: InternalFloorData = {
		typeOfInternalFloor: AdjacentSpaceType.heatedSpace,
		name: "internal1 name",
		surfaceAreaOfElement: 5,
		kappaValue: 100,
		massDistributionClass: MassDistributionClass.I,
	};

	const internal2: InternalFloorData = {
		typeOfInternalFloor: AdjacentSpaceType.heatedSpace,
		name: "internal2 name",
		surfaceAreaOfElement: 5,
		kappaValue: 100,
		massDistributionClass: MassDistributionClass.I,
	};

	const internal3: InternalFloorData = {
		typeOfInternalFloor: AdjacentSpaceType.heatedSpace,
		name: "internal3 name",
		surfaceAreaOfElement: 5,
		kappaValue: 100,
		massDistributionClass: MassDistributionClass.I,
	};

	const exposed1: ExposedFloorData = {
		name: "exposed1 name",
		pitch: 0,
		orientation: 0,
		length: 0.5,
		width: 20,
		elevationalHeight: 20,
		surfaceArea: 10,
		solarAbsorption: 0.1,
		uValue: 1,
		kappaValue: 100,
		massDistributionClass: MassDistributionClass.I
	};

	const exposed2: ExposedFloorData = {
		name: "exposed2 name",
		pitch: 0,
		orientation: 0,
		length: 0.5,
		width: 20,
		elevationalHeight: 20,
		surfaceArea: 10,
		solarAbsorption: 0.1,
		uValue: 1,
		kappaValue: 100,
		massDistributionClass: MassDistributionClass.I
	};

	const exposed3: ExposedFloorData = {
		name: "exposed3 name",
		pitch: 0,
		orientation: 0,
		length: 0.5,
		width: 20,
		elevationalHeight: 20,
		surfaceArea: 10,
		solarAbsorption: 0.1,
		uValue: 1,
		kappaValue: 100,
		massDistributionClass: MassDistributionClass.I
	};
	
	afterEach(() => {
		store.$reset();
	});
	
	describe("ground floors", () => {
		test("ground floor is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceGroundFloor: {
							data:[{ data: ground1 }]
						}
					}
				}
			});
	
			await renderSuspended(Floors);
	
			expect(screen.getAllByTestId("ground_items")).toBeDefined();
	
			await user.click(screen.getByTestId("ground_remove_0"));
	
			expect(screen.queryByTestId("ground_items")).toBeNull();
		});
	
		it("should only remove the ground floor object thats is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceGroundFloor: {
							data:[{ data: ground1 }, { data: ground2 }, { data: ground3 }]
						}
					}
				}
			});
	
			await renderSuspended(Floors);
			await user.click(screen.getByTestId("ground_remove_1"));
	
			const groundFloors = screen.getByTestId("ground_items");
	
			expect(within(groundFloors).getByText("ground1 name")).toBeDefined();
			expect(within(groundFloors).getByText("ground3 name")).toBeDefined();
			expect(within(groundFloors).queryByText("ground2 name")).toBeNull();
		});
		
		test("ground floor is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceGroundFloor: {
							data:[{ data: ground1 }, { data: ground2 }]
						}
					}
				}
			});
	
			await renderSuspended(Floors);
			await userEvent.click(screen.getByTestId("ground_duplicate_0"));
			await userEvent.click(screen.getByTestId("ground_duplicate_0"));
			await userEvent.click(screen.getByTestId("ground_duplicate_2"));
			await userEvent.click(screen.getByTestId("ground_duplicate_2"));
	
			expect(screen.queryAllByTestId("ground_item").length).toBe(6);
			expect(screen.getByText("ground1 name")).toBeDefined();
			expect(screen.getByText("ground1 name (1)")).toBeDefined();
			expect(screen.getByText("ground1 name (2)")).toBeDefined();
			expect(screen.getByText("ground1 name (1) (1)")).toBeDefined();
			expect(screen.getByText("ground1 name (1) (2)")).toBeDefined();
		});

		it("should display an in-progress indicator when an entry is not marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceGroundFloor: {
							data: [{
								data: ground1
							}],
						},
					},
				},
			});

			await renderSuspended(Floors);

			expect(screen.getByTestId("ground_status_0").textContent).toBe(formStatus.inProgress.text);
		});

		it ("should display a complete indicator when an entry is marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceGroundFloor: {
							data: [{
								data: ground1,
								complete: true
							}],
						},
					},
				},
			});

			await renderSuspended(Floors);

			expect(screen.getByTestId("ground_status_0").textContent).toBe(formStatus.complete.text);
		});
	});

	describe("internal floors", () => {
		test("internal floor is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceInternalFloor: {
							data:[{ data: internal1 }]
						}
					}
				}
			});
	
			await renderSuspended(Floors);
	
			expect(screen.getAllByTestId("internal_items")).toBeDefined();
	
			await user.click(screen.getByTestId("internal_remove_0"));
	
			expect(screen.queryByTestId("internal_items")).toBeNull();
		});
	
		it("should only remove the internal floor object thats is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceInternalFloor: {
							data:[{ data: internal1 }, { data: internal2 }, { data: internal3 }]
						}
					}
				}
			});
	
			await renderSuspended(Floors);
			await user.click(screen.getByTestId("internal_remove_1"));
	
			const internalFloors = screen.getByTestId("internal_items");
	
			expect(within(internalFloors).getByText("internal1 name")).toBeDefined();
			expect(within(internalFloors).getByText("internal3 name")).toBeDefined();
			expect(within(internalFloors).queryByText("internal2 name")).toBeNull();
	
		});
	
		test("floor is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceInternalFloor: {
							data:[{ data: internal1 }, { data: internal2 }]
						}
					}
				}
			});
	
			await renderSuspended(Floors);
			await userEvent.click(screen.getByTestId("internal_duplicate_0"));
			await userEvent.click(screen.getByTestId("internal_duplicate_0"));
			await userEvent.click(screen.getByTestId("internal_duplicate_2"));
			await userEvent.click(screen.getByTestId("internal_duplicate_2"));
	
			expect(screen.queryAllByTestId("internal_item").length).toBe(6);
			expect(screen.getByText("internal1 name")).toBeDefined();
			expect(screen.getByText("internal1 name (1)")).toBeDefined();
			expect(screen.getByText("internal1 name (2)")).toBeDefined();
			expect(screen.getByText("internal1 name (1) (1)")).toBeDefined();
			expect(screen.getByText("internal1 name (1) (2)")).toBeDefined();
		});

		it("should display an in-progress indicator when an entry is not marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceInternalFloor: {
							data: [{
								data: internal1
							}],
						},
					},
				},
			});

			await renderSuspended(Floors);

			expect(screen.getByTestId("internal_status_0").textContent).toBe(formStatus.inProgress.text);
		});

		it ("should display a complete indicator when an entry is marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceInternalFloor: {
							data: [{
								data: internal1,
								complete: true
							}],
						},
					},
				},
			});

			await renderSuspended(Floors);

			expect(screen.getByTestId("internal_status_0").textContent).toBe(formStatus.complete.text);
		});
	});

	describe("exposed floors", () => {
		test("exposed floor is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceExposedFloor: {
							data:[{ data: exposed1 }]
						}
					}
				}
			});
	
			await renderSuspended(Floors);
	
			expect(screen.getAllByTestId("exposed_items")).toBeDefined();
	
			await user.click(screen.getByTestId("exposed_remove_0"));
	
			expect(screen.queryByTestId("exposed_items")).toBeNull();
		});
	
		it("should only remove the exposed floor object thats is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceExposedFloor: {
							data:[{ data: exposed1 }, { data: exposed2 }, { data: exposed3 }]
						}
					}
				}
			});
	
			await renderSuspended(Floors);
			await user.click(screen.getByTestId("exposed_remove_1"));
			const populatedList = screen.getByTestId("exposed_items");
	
			expect(within(populatedList).getByText("exposed1 name")).toBeDefined();
			expect(within(populatedList).getByText("exposed3 name")).toBeDefined();
			expect(within(populatedList).queryByText("exposed2 name")).toBeNull();
	
		});
		
		test("exposed floor is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceExposedFloor: {
							data:[{ data: exposed1 }, { data: exposed2 }]
						}
					}
				}
			});
	
			await renderSuspended(Floors);
			await userEvent.click(screen.getByTestId("exposed_duplicate_0"));
			await userEvent.click(screen.getByTestId("exposed_duplicate_0"));
			await userEvent.click(screen.getByTestId("exposed_duplicate_2"));
			await userEvent.click(screen.getByTestId("exposed_duplicate_2"));
	
			expect(screen.queryAllByTestId("exposed_item").length).toBe(6);
			expect(screen.getByText("exposed1 name")).toBeDefined();
			expect(screen.getByText("exposed1 name (1)")).toBeDefined();
			expect(screen.getByText("exposed1 name (2)")).toBeDefined();
			expect(screen.getByText("exposed1 name (1) (1)")).toBeDefined();
			expect(screen.getByText("exposed1 name (1) (2)")).toBeDefined();
		});

		it("should display an in-progress indicator when an entry is not marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceExposedFloor: {
							data: [{
								data: exposed1
							}],
						},
					},
				},
			});

			await renderSuspended(Floors);

			expect(screen.getByTestId("exposed_status_0").textContent).toBe(formStatus.inProgress.text);
		});

		it ("should display a complete indicator when an entry is marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceExposedFloor: {
							data: [{
								data: exposed1,
								complete: true
							}],
						},
					},
				},
			});

			await renderSuspended(Floors);

			expect(screen.getByTestId("exposed_status_0").textContent).toBe(formStatus.complete.text);
		});
	});

	describe("mark section as complete", () =>  {
		
		const addFloorsDataToStore = async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceGroundFloor: { data: [{ data: ground1 }] },
						dwellingSpaceInternalFloor: { data: [{ data: internal1 }] },
						dwellingSpaceExposedFloor: { data: [{ data: exposed1 }] },
					},
				}
			});
		};

		beforeEach(async () =>{
			await addFloorsDataToStore();
			await renderSuspended(Floors);
		});

		const getFloorData = async (action: string) => {
			const floors: {
				key: keyof FloorsData,
				testId: string,
				form: Component
			}[] = [
				{
					key: "dwellingSpaceGroundFloor",
					testId: `ground_${action}_0`,
					form: GroundFloorForm
				},
				{
					key: "dwellingSpaceInternalFloor",
					testId: `internal_${action}_0`,
					form: InternalFloorForm
				},
				{
					key: "dwellingSpaceExposedFloor",
					testId: `exposed_${action}_0`,
					form: ExposedFloorForm
				}
			];
			return floors;
		};

		type FloorType = keyof typeof store.dwellingFabric.dwellingSpaceFloors;

		it("marks floors as complete when mark section as complete button is clicked", async () => {
	
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			const completedStatusElement = screen.queryByTestId("completeSectionCompleted");
			expect(completedStatusElement?.style.display).toBe("none");
	
			await user.click(screen.getByTestId("completeSectionButton"));
	
			const { dwellingSpaceGroundFloor, dwellingSpaceInternalFloor, dwellingSpaceExposedFloor } = store.dwellingFabric.dwellingSpaceFloors;
	
			expect(dwellingSpaceGroundFloor?.complete).toBe(true);
			expect(dwellingSpaceInternalFloor?.complete).toBe(true);
			expect(dwellingSpaceExposedFloor?.complete).toBe(true);
			expect(screen.queryByRole("button", { name: "Mark section as complete" })).toBeNull();
			expect(completedStatusElement?.style.display).not.toBe("none");
	
			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-space");
		});
	
		it("marks floors as not complete when mark as complete button is clicked then user removes a floor item", async () => {

			const floorsData = await getFloorData("remove");
			const floors = Object.entries(store.dwellingFabric.dwellingSpaceFloors);
			
			for (const [key] of floors) {
				const typedKey = key as FloorType;
		
				await user.click(screen.getByTestId("completeSectionButton"));
				expect(store.dwellingFabric.dwellingSpaceFloors[typedKey]?.complete).toBe(true);
					
				const floorData = floorsData.find(x => x.key === typedKey);
	
				await user.click(screen.getByTestId(floorData!.testId));
				expect(store.dwellingFabric.dwellingSpaceFloors[typedKey]?.complete).toBe(false);
				expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			}
		});

		it("marks floors as not complete when complete button is clicked after user duplicates a floor item", async () => {

			const floorsData = await getFloorData("duplicate");
			const floors = Object.entries(store.dwellingFabric.dwellingSpaceFloors);
		
			for (const [key] of floors) {
				const typedKey = key as FloorType;
	
				await user.click(screen.getByTestId("completeSectionButton"));
				expect(store.dwellingFabric.dwellingSpaceFloors[typedKey]?.complete).toBe(true);
				
				const floorData = floorsData.find(x => x.key === typedKey);

				await user.click(screen.getByTestId(floorData!.testId));
				expect(store.dwellingFabric.dwellingSpaceFloors[typedKey]?.complete).toBe(false);
				expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			}
		});

		it("marks complete floors as not complete when user saves a ground floor form", async () => {
			await user.click(screen.getByTestId("completeSectionButton"));
			await renderSuspended(GroundFloorForm, {
				route: {
					params: { floor: "0" }
				}
			});
			await user.click(screen.getByTestId("saveAndComplete"));
			expect(store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.complete).toBe(false);

			await renderSuspended(Floors);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		});

		it("marks complete floors as not complete when user saves an internal floor form", async () => {
			await user.click(screen.getByTestId("completeSectionButton"));
			await renderSuspended(InternalFloorForm, {
				route: {
					params: { floor: "0" }
				}
			});
			
			await user.click(screen.getByTestId("saveAndComplete"));
			expect(store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor.complete).toBe(false);
		});

		it("marks complete floors as not complete when user saves an exposed floor form", async () => {
			await user.click(screen.getByTestId("completeSectionButton"));
			await renderSuspended(ExposedFloorForm, {
				route: {
					params: { floor: "0" }
				}
			});
			
			await user.click(screen.getByTestId("saveAndComplete"));
			expect(store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceExposedFloor.complete).toBe(false);
		});

		it("marks complete floors as not complete when user edits a ground floor", async () => {
			await user.click(screen.getByTestId("completeSectionButton"));
			await renderSuspended(GroundFloorForm, {
				route: {
					params: { floor: "0" }
				}
			});
			await user.type(screen.getByTestId("name"), "Ground floor 1");
			await user.tab();

			expect(store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.complete).toBe(false);

			await renderSuspended(Floors);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		});
	});

	// 	describe("status indicators", () =>  {
		
});
