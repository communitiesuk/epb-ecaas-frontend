import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Walls from "./index.vue";
import ExternalWallForm from "./external/[wall].vue";
import InternalWallForm from "./internal/[wall].vue";
import PartyWallForm from "./party/[wall].vue";
import WallToUnheatedForm from "./wall-to-unheated-space/[wall].vue";

import { screen } from "@testing-library/vue";
import { within } from "@testing-library/dom";
import type { Component } from "vue";

describe("walls", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});
	const external1: ExternalWallData = {
		name: "External wall 1",
		pitchOption: "90",
		pitch: 90,
		orientation: 0,
		height: 0.5,
		length: 20,
		elevationalHeight: 20,
		surfaceArea: 10,
		solarAbsorption: 0.1,
		uValue: 1,
		kappaValue: 100,
		massDistributionClass: "I",
		
	};

	const external2: ExternalWallData = {
		...external1,
		name: "External wall 2",
	};

	const external3: ExternalWallData = {
		...external1,
		name: "External wall 3",
	};

	const internal1: InternalWallData = {
		name: "Internal wall 1",
		surfaceAreaOfElement: 5,
		kappaValue: 100,
		massDistributionClass: "I",
		pitchOption: "custom",
		pitch: 3,
	};
	
	const internal2: InternalWallData = {
		...internal1,
		name: "Internal wall 2",
	};
	
	const internal3: InternalWallData = {
		...internal1,
		name: "Internal wall 3",
	};

	const toUnheatedSpace1: WallsToUnheatedSpaceData = {
		name: "Wall to heated space 1",
		surfaceAreaOfElement: 500,
		uValue: 10,
		arealHeatCapacity: 110000,
		massDistributionClass: "E",
		pitchOption: "90",
		pitch: 90,
		thermalResistanceOfAdjacentUnheatedSpace: 1,
		
	};
	
	const toUnheatedSpace2: WallsToUnheatedSpaceData = {
		...toUnheatedSpace1,
		name: "Wall to heated space 2",
	};
	
	const toUnheatedSpace3: WallsToUnheatedSpaceData = {
		...toUnheatedSpace1,
		name: "Wall to heated space 3",
	};

	const party1: PartyWallData = {
		name: "Party wall 1",
		pitchOption: "90",
		pitch: 90,
		surfaceArea: 10,
		uValue: 0.01,
		kappaValue: 100,
		massDistributionClass: "I",
	};

	const party2: PartyWallData = {
		...party1,
		name: "Party wall 2",
	};

	const party3: PartyWallData = {
		...party1,
		name: "Party wall 3",
	};

	describe("External walls", () => {
	
		test("ground wall is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceExternalWall: {
							data:[external1],
						},
					},
				},
			});
	
			await renderSuspended(Walls);
	
			expect(screen.getAllByTestId("external_items")).toBeDefined();
	
			await user.click(screen.getByTestId("external_remove_0"));
	
			expect(screen.queryByTestId("external_items")).toBeNull();
		});
	
		it("should only remove the external wall object thats is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceExternalWall: {
							data:[external1, external2, external3],
						},
					},
				},
			});
	
			await renderSuspended(Walls);
			await user.click(screen.getByTestId("external_remove_1"));
	
			const populatedList = screen.getByTestId("external_items");
	
			expect(within(populatedList).getByText("External wall 1")).toBeDefined();
			expect(within(populatedList).getByText("External wall 3")).toBeDefined();
			expect(within(populatedList).queryByText("External wall 2")).toBeNull();
	
		});
	
		test("wall is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceExternalWall: {
							data:[external1, external2],
						},
					},
				},
			});
	
			await renderSuspended(Walls);
			await userEvent.click(screen.getByTestId("external_duplicate_0"));
			await userEvent.click(screen.getByTestId("external_duplicate_0"));
			await userEvent.click(screen.getByTestId("external_duplicate_2"));
			await userEvent.click(screen.getByTestId("external_duplicate_2"));
	
			expect(screen.queryAllByTestId("external_item").length).toBe(6);
			expect(screen.getByText("External wall 1")).toBeDefined();
			expect(screen.getByText("External wall 1 (1)")).toBeDefined();
			expect(screen.getByText("External wall 1 (2)")).toBeDefined();
			expect(screen.getByText("External wall 1 (1) (1)")).toBeDefined();
			expect(screen.getByText("External wall 1 (1) (2)")).toBeDefined();
		});
	});

	describe("Internal walls", () => {

	  
		test("internal wall is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceInternalWall: {
							data:[internal1],
						},
					},
				},
			});
	  
			await renderSuspended(Walls);
	  
			expect(screen.getAllByTestId("internal_items")).toBeDefined();
	  
			await user.click(screen.getByTestId("internal_remove_0"));
	  
			expect(screen.queryByTestId("internal_items")).toBeNull();
		});
	  
		it("should only remove the internal wall object thats is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceInternalWall: {
							data:[internal1, internal2, internal3],
						},
					},
				},
			});
	  
			await renderSuspended(Walls);
			await user.click(screen.getByTestId("internal_remove_1"));
	  
			const populatedList = screen.getByTestId("internal_items");
	  
			expect(within(populatedList).getByText("Internal wall 1")).toBeDefined();
			expect(within(populatedList).getByText("Internal wall 3")).toBeDefined();
			expect(within(populatedList).queryByText("Internal wall 2")).toBeNull();
	  
		});
	  
		test("wall is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceInternalWall: {
							data:[internal1, internal2],
						},
					},
				},
			});
	  
			await renderSuspended(Walls);
			await userEvent.click(screen.getByTestId("internal_duplicate_0"));
			await userEvent.click(screen.getByTestId("internal_duplicate_0"));
			await userEvent.click(screen.getByTestId("internal_duplicate_2"));
			await userEvent.click(screen.getByTestId("internal_duplicate_2"));
	  
			expect(screen.queryAllByTestId("internal_item").length).toBe(6);
			expect(screen.getByText("Internal wall 1")).toBeDefined();
			expect(screen.getByText("Internal wall 1 (1)")).toBeDefined();
			expect(screen.getByText("Internal wall 1 (2)")).toBeDefined();
			expect(screen.getByText("Internal wall 1 (1) (1)")).toBeDefined();
			expect(screen.getByText("Internal wall 1 (1) (2)")).toBeDefined();
		});
	});

	describe("Wall to unheated space", () => {

	  
		test("wall-to-heated-space is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceWallToUnheatedSpace: {
							data:[toUnheatedSpace1],
						},
					},
				},
			});
	  
			await renderSuspended(Walls);
	  
			expect(screen.getAllByTestId("toHeatedSpace_items")).toBeDefined();
	  
			await user.click(screen.getByTestId("toHeatedSpace_remove_0"));
	  
			expect(screen.queryByTestId("toHeatedSpace_items")).toBeNull();
		});
	  
		it("should only remove the wall-to-heated-space object thats is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceWallToUnheatedSpace: {
							data:[toUnheatedSpace1, toUnheatedSpace2, toUnheatedSpace3],
						},
					},
				},
			});
	  
			await renderSuspended(Walls);
			await user.click(screen.getByTestId("toHeatedSpace_remove_1"));
	  
			const populatedList = screen.getByTestId("toHeatedSpace_items");
	  
			expect(within(populatedList).getByText("Wall to heated space 1")).toBeDefined();
			expect(within(populatedList).getByText("Wall to heated space 3")).toBeDefined();
			expect(within(populatedList).queryByText("Wall to heated space 2")).toBeNull();
		});
	  
		test("wall is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceWallToUnheatedSpace: {
							data:[toUnheatedSpace1, toUnheatedSpace2],
						},
					},
				},
			});
	  
			await renderSuspended(Walls);
			await userEvent.click(screen.getByTestId("toHeatedSpace_duplicate_0"));
			await userEvent.click(screen.getByTestId("toHeatedSpace_duplicate_0"));
			await userEvent.click(screen.getByTestId("toHeatedSpace_duplicate_2"));
			await userEvent.click(screen.getByTestId("toHeatedSpace_duplicate_2"));
	  
			expect(screen.queryAllByTestId("toHeatedSpace_item").length).toBe(6);
			expect(screen.getByText("Wall to heated space 1")).toBeDefined();
			expect(screen.getByText("Wall to heated space 1 (1)")).toBeDefined();
			expect(screen.getByText("Wall to heated space 1 (2)")).toBeDefined();
			expect(screen.getByText("Wall to heated space 1 (1) (1)")).toBeDefined();
			expect(screen.getByText("Wall to heated space 1 (1) (2)")).toBeDefined();
		});
	});

	describe("Party walls", () => {

		test("party wall is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpacePartyWall: {
							data:[party1],
						},
					},
				},
			});
	
			await renderSuspended(Walls);
	
			expect(screen.getAllByTestId("party_items")).toBeDefined();
	
			await user.click(screen.getByTestId("party_remove_0"));
	
			expect(screen.queryByTestId("party_items")).toBeNull();
		});
	
		it("should only remove the party wall object thats is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpacePartyWall: {
							data:[party1, party2, party3],
						},
					},
				},
			});
	
			await renderSuspended(Walls);
			await user.click(screen.getByTestId("party_remove_1"));
	
			const populatedList = screen.getByTestId("party_items");
	
			expect(within(populatedList).getByText("Party wall 1")).toBeDefined();
			expect(within(populatedList).getByText("Party wall 3")).toBeDefined();
			expect(within(populatedList).queryByText("Party wall 2")).toBeNull();
	
		});
	
		test("wall is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpacePartyWall: {
							data:[party1, party2],
						},
					},
				},
			});
	
			await renderSuspended(Walls);
			await userEvent.click(screen.getByTestId("party_duplicate_0"));
			await userEvent.click(screen.getByTestId("party_duplicate_0"));
			await userEvent.click(screen.getByTestId("party_duplicate_2"));
			await userEvent.click(screen.getByTestId("party_duplicate_2"));
	
			expect(screen.queryAllByTestId("party_item").length).toBe(6);
			expect(screen.getByText("Party wall 1")).toBeDefined();
			expect(screen.getByText("Party wall 1 (1)")).toBeDefined();
			expect(screen.getByText("Party wall 1 (2)")).toBeDefined();
			expect(screen.getByText("Party wall 1 (1) (1)")).toBeDefined();
			expect(screen.getByText("Party wall 1 (1) (2)")).toBeDefined();
		});
	});
	describe("mark section as complete", () => {
		const addWallsDataToStore = async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceExternalWall: { data: [external1] },
						dwellingSpaceInternalWall: { data: [internal1] },
						dwellingSpacePartyWall: { data: [party1] },
						dwellingSpaceWallToUnheatedSpace: { data: [toUnheatedSpace1] },
					},
				},
			});
		};
	
		beforeEach(async () => {
			await addWallsDataToStore();
			await renderSuspended(Walls);
		});
	
		const getWallData = async (action: string): Promise<{
			key: keyof WallsData,
			testId: string,
			form: Component
		}[]> => {
			return [
				{
					key: "dwellingSpaceExternalWall",
					testId: `external_${action}_0`,
					form: ExternalWallForm,
				},
				{
					key: "dwellingSpaceInternalWall",
					testId: `internal_${action}_0`,
					form: InternalWallForm,
				},
				{
					key: "dwellingSpacePartyWall",
					testId: `party_${action}_0`,
					form: PartyWallForm,
				},
				{
					key: "dwellingSpaceWallToUnheatedSpace",
					testId: `toHeatedSpace_${action}_0`,
					form: WallToUnheatedForm,
				},
			];
		};
	
		type WallType = keyof typeof store.dwellingFabric.dwellingSpaceWalls;
	
		it("marks walls as complete when mark section as complete button is clicked", async () => {
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			const completedStatusElement = screen.queryByTestId("completeSectionCompleted");
			expect(completedStatusElement?.style.display).toBe("none");
	
			await user.click(screen.getByTestId("completeSectionButton"));
	
			const {
				dwellingSpaceExternalWall,
				dwellingSpaceInternalWall,
				dwellingSpacePartyWall,
				dwellingSpaceWallToUnheatedSpace,
			} = store.dwellingFabric.dwellingSpaceWalls;
	
			expect(dwellingSpaceExternalWall?.complete).toBe(true);
			expect(dwellingSpaceInternalWall?.complete).toBe(true);
			expect(dwellingSpacePartyWall?.complete).toBe(true);
			expect(dwellingSpaceWallToUnheatedSpace?.complete).toBe(true);
			expect(screen.queryByRole("button", { name: "Mark section as complete" })).toBeNull();
			expect(completedStatusElement?.style.display).not.toBe("none");
	
			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric");
		});
	
		it("marks walls as not complete when complete button is clicked then user removes a wall item", async () => {
			const wallData = await getWallData("remove");
			const walls = Object.entries(store.dwellingFabric.dwellingSpaceWalls);
	
			for (const [key] of walls) {
				const typedKey = key as WallType;
	
				await user.click(screen.getByTestId("completeSectionButton"));
				expect(store.dwellingFabric.dwellingSpaceWalls[typedKey]?.complete).toBe(true);
	
				const item = wallData.find(x => x.key === typedKey)!;
				await user.click(screen.getByTestId(item.testId));
	
				expect(store.dwellingFabric.dwellingSpaceWalls[typedKey]?.complete).toBe(false);
				expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			}
		});
	
		it("marks walls as not complete when complete button is clicked then user duplicates a wall item", async () => {
			const wallData = await getWallData("duplicate");
			const walls = Object.entries(store.dwellingFabric.dwellingSpaceWalls);
	
			for (const [key] of walls) {
				const typedKey = key as WallType;
	
				await user.click(screen.getByTestId("completeSectionButton"));
				expect(store.dwellingFabric.dwellingSpaceWalls[typedKey]?.complete).toBe(true);
	
				const item = wallData.find(x => x.key === typedKey)!;
				await user.click(screen.getByTestId(item.testId));
	
				expect(store.dwellingFabric.dwellingSpaceWalls[typedKey]?.complete).toBe(false);
				expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			}
		});
	
		it("marks walls as not complete when user saves a new or edited wall form after marking section as complete", async () => {
			const wallData = await getWallData("");
			const walls = Object.entries(store.dwellingFabric.dwellingSpaceWalls);
	
			for (const [key] of walls) {
				const typedKey = key as WallType;
	
				await user.click(screen.getByTestId("completeSectionButton"));
				expect(store.dwellingFabric.dwellingSpaceWalls[typedKey]?.complete).toBe(true);
	
				const item = wallData.find(x => x.key === typedKey)!;
	
				await renderSuspended(item.form, {
					route: { params: { wall: "0" } },
				});
	
				await user.click(screen.getByRole("button", { name: "Save and continue" }));
	
				expect(store.dwellingFabric.dwellingSpaceWalls[typedKey]?.complete).toBe(false);
				await renderSuspended(Walls);
				expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			}
		});
	});
});
