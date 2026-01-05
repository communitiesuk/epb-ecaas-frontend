import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Walls from "./index.vue";
import ExternalWallForm from "./external/[wall].vue";
import InternalWallForm from "./internal/[wall].vue";
import PartyWallForm from "./party/[wall].vue";
import WallToUnheatedForm from "./wall-to-unheated-space/[wall].vue";

import { screen } from "@testing-library/vue";
import { within } from "@testing-library/dom";
import formStatus from "~/constants/formStatus";

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
		id: "8bb5eda9-3c31-44d0-801b-f130a63b9f6a",
		name: "External wall 1",
		pitchOption: "90",
		pitch: 90,
		orientation: 0,
		height: 0.5,
		length: 20,
		elevationalHeight: 20,
		surfaceArea: 10,
		uValue: 1,
		colour: "Intermediate",
		arealHeatCapacity: "Very light",
		massDistributionClass: "I",
	};

	const external2: ExternalWallData = {
		...external1,
		id: "eaa950f1-d534-4e06-aeec-22796e79215e",
		name: "External wall 2",
	};

	const external3: ExternalWallData = {
		...external1,
		id: "116eb859-e576-4ec1-8802-dfc66916e88b",
		name: "External wall 3",
	};

	const internal1: InternalWallData = {
		id: "cb995019-718c-4074-b56c-37826abf1fc5",
		name: "Internal wall 1",
		surfaceAreaOfElement: 5,
		arealHeatCapacity: "Very light",
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
		id: "7da5aa7a-f24a-40f7-a5a3-97ea4d6f31d7",
		name: "Wall to heated space 1",
		surfaceAreaOfElement: 500,
		uValue: 10,
		arealHeatCapacity: "Medium",
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
		id: "974e8749-f465-4f43-a38a-3d0b97060a64",
		name: "Party wall 1",
		pitchOption: "90",
		pitch: 90,
		surfaceArea: 10,
		uValue: 0.01,
		arealHeatCapacity: "Very light",
		massDistributionClass: "I",
		partyWallCavityType: "defined_resistance",
		thermalResistanceCavity: 4.2,
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
		test("external wall is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceExternalWall: {
							data: [{ data: external1 }],
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
							data: [
								{ data: external1 },
								{ data: external2 },
								{ data: external3 },
							],
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

		test("when an external wall is removed its also removed from any store item that references it", async () => {
			const vent1: Partial<VentData> = {
				name: "Vent 1",
				associatedItemId: external1.id,
			};

			const window1: Partial<WindowData> = {
				id: "80fd1ffe-a83a-4d95-bd2c-ad8fdc37b321",
				name: "Window 1",
				taggedItem: external1.id,
			};

			const externalUnglazed: Partial<ExternalUnglazedDoorData> = {
				name: "external unglazed name",
				associatedItemId: external1.id,
			};

			const externalGlazed: Partial<ExternalGlazedDoorData> = {
				name: "external glazed name",
				associatedItemId: external1.id,
			};

			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceExternalWall: {
							data: [{ data: external1 }],
						},
					},
					dwellingSpaceWindows: {
						data: [{ data: window1, complete: true }],
					},
					dwellingSpaceDoors: {
						dwellingSpaceExternalGlazedDoor: {
							data: [{ data: externalGlazed, complete: true }],
						},
						dwellingSpaceExternalUnglazedDoor: {
							data: [{ data: externalUnglazed, complete: true }],
						},
					},
				},
				infiltrationAndVentilation: {
					vents: {
						data: [{ data: vent1, complete: true }],
					},
				},
			});

			await renderSuspended(Walls);

			await user.click(await screen.findByTestId("external_remove_0"));

			const vent = store.infiltrationAndVentilation.vents.data[0];
			expect(vent?.data.associatedItemId).toBeUndefined();
			expect(vent?.complete).toBe(false);

			const window = store.dwellingFabric.dwellingSpaceWindows.data[0];
			expect(window?.data.taggedItem).toBeUndefined();
			expect(window?.complete).toBe(false);

			const glazedDoor =
        store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor
        	.data[0]?.data;
			expect(glazedDoor?.associatedItemId).toBeUndefined();
			const unglazedDoor =
        store.dwellingFabric.dwellingSpaceDoors
        	.dwellingSpaceExternalUnglazedDoor.data[0]?.data;
			expect(unglazedDoor?.associatedItemId).toBeUndefined();
		});

		test("wall is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceExternalWall: {
							data: [
								{ data: external1 },
								{ data: external2 },
							],
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

		it("should display an in-progress indicator when an external wall is not marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceExternalWall: {
							data: [{
								data: { name: "External wall 1" },
							}],
						},
					},
				},
			});

			await renderSuspended(Walls);

			expect(screen.getByTestId("external_status_0").textContent).toBe(formStatus.inProgress.text);
		});

		it("should display a complete indicator when an external wall is marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceExternalWall: {
							data: [{
								data: external1,
								complete: true,
							}],
						},
					},
				},
			});

			await renderSuspended(Walls);

			expect(screen.getByTestId("external_status_0").textContent).toBe(formStatus.complete.text);
		});
	});

	describe("Internal walls", () => {
		test("internal wall is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceInternalWall: {
							data: [{ data: internal1 }],
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
							data: [
								{ data: internal1 },
								{ data: internal2 },
								{ data: internal3 },
							],
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

		test("when an internal wall is removed its also removed from any store item that references it", async () => {
			const doorToHeatedSpace: Partial<InternalDoorData> = {
				typeOfInternalDoor: AdjacentSpaceType.heatedSpace,
				name: "Internal door to heated",
				associatedItemId: internal1.id,
			};

			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceInternalWall: {
							data: [{ data: internal1 }],
						},
					},
					dwellingSpaceDoors: {
						dwellingSpaceInternalDoor: {
							data: [{ data: doorToHeatedSpace, complete: true }],
						},
					},
				},
			});

			await renderSuspended(Walls);

			await user.click(await screen.findByTestId("internal_remove_0"));

			const unheatedDoor =
        store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor
        	.data[0]?.data;
			expect(unheatedDoor?.associatedItemId).toBeUndefined();
		});

		test("wall is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceInternalWall: {
							data: [
								{ data: internal1 },
								{ data: internal2 },
							],
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

		it("should display an in-progress indicator when an internal wall is not marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceInternalWall: {
							data: [{
								data: { name: "Internal wall 1" },
							}],
						},
					},
				},
			});

			await renderSuspended(Walls);

			expect(screen.getByTestId("internal_status_0").textContent).toBe(formStatus.inProgress.text);
		});

		it("should display a complete indicator when an internal wall is marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceInternalWall: {
							data: [{
								data: internal1,
								complete: true,
							}],
						},
					},
				},
			});

			await renderSuspended(Walls);

			expect(screen.getByTestId("internal_status_0").textContent).toBe(formStatus.complete.text);
		});
	});

	describe("Wall to unheated space", () => {
		test("wall-to-heated-space is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceWallToUnheatedSpace: {
							data: [{ data: toUnheatedSpace1 }],
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
							data: [
								{ data: toUnheatedSpace1 },
								{ data: toUnheatedSpace2 },
								{ data: toUnheatedSpace3 },
							],
						},
					},
				},
			});

			await renderSuspended(Walls);
			await user.click(screen.getByTestId("toHeatedSpace_remove_1"));

			const populatedList = screen.getByTestId("toHeatedSpace_items");

			expect(
				within(populatedList).getByText("Wall to heated space 1"),
			).toBeDefined();
			expect(
				within(populatedList).getByText("Wall to heated space 3"),
			).toBeDefined();
			expect(
				within(populatedList).queryByText("Wall to heated space 2"),
			).toBeNull();
		});

		test("when a wall to unheated space is removed its also removed from any store item that references it", async () => {
			const doorToUnheatedSpace: Partial<InternalDoorData> = {
				typeOfInternalDoor: AdjacentSpaceType.unheatedSpace,
				name: "Internal to unheated",
				associatedItemId: toUnheatedSpace1.id,
			};

			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceWallToUnheatedSpace: {
							data: [{ data: toUnheatedSpace1 }],
						},
					},
					dwellingSpaceDoors: {
						dwellingSpaceInternalDoor: {
							data: [{ data: doorToUnheatedSpace, complete: true }],
						},
					},
				},
			});

			await renderSuspended(Walls);

			await user.click(await screen.findByTestId("toHeatedSpace_remove_0"));

			const door =
        store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor
        	.data[0]?.data;
			expect(door?.associatedItemId).toBeUndefined();
		});

		test("wall is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceWallToUnheatedSpace: {
							data: [
								{ data: toUnheatedSpace1 },
								{ data: toUnheatedSpace2 },
							],
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

		it("should display an in-progress indicator when a wall to unheated space is not marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceWallToUnheatedSpace: {
							data: [{
								data: { name: "Wall to unheated space 1" },
							}],
						},
					},
				},
			});

			await renderSuspended(Walls);

			expect(screen.getByTestId("toHeatedSpace_status_0").textContent).toBe(formStatus.inProgress.text);
		});

		it("should display a complete indicator when a wall to unheated space is marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceWallToUnheatedSpace: {
							data: [{
								data: toUnheatedSpace1,
								complete: true,
							}],
						},
					},
				},
			});

			await renderSuspended(Walls);

			expect(screen.getByTestId("toHeatedSpace_status_0").textContent).toBe(formStatus.complete.text);
		});
	});

	describe("Party walls", () => {
		test("party wall is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpacePartyWall: {
							data: [{ data: party1 }],
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
							data: [
								{ data: party1 },
								{ data: party2 },
								{ data: party3 },
							],
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

		test("when a party wall is removed its also removed from any store item that references it", async () => {
			const doorToUnheatedSpace: Partial<InternalDoorData> = {
				typeOfInternalDoor: AdjacentSpaceType.unheatedSpace,
				name: "Internal to unheated",
				associatedItemId: party1.id,
			};

			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpacePartyWall: {
							data: [{ data: party1 }],
						},
					},
					dwellingSpaceDoors: {
						dwellingSpaceInternalDoor: {
							data: [{ data: doorToUnheatedSpace, complete: true }],
						},
					},
				},
			});

			await renderSuspended(Walls);

			await user.click(await screen.findByTestId("party_remove_0"));

			const door =
        store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor
        	.data[0]?.data;
			expect(door?.associatedItemId).toBeUndefined();

		});

		test("wall is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpacePartyWall: {
							data: [
								{ data: party1 },
								{ data: party2 },
							],
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

		it("should display an in-progress indicator when a party wall is not marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpacePartyWall: {
							data: [{
								data: { name: "Party wall 1" },
							}],
						},
					},
				},
			});

			await renderSuspended(Walls);

			expect(screen.getByTestId("party_status_0").textContent).toBe(formStatus.inProgress.text);
		});

		it("should display a complete indicator when a party wall is marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpacePartyWall: {
							data: [{
								data: party1,
								complete: true,
							}],
						},
					},
				},
			});

			await renderSuspended(Walls);

			expect(screen.getByTestId("party_status_0").textContent).toBe(formStatus.complete.text);
		});
	});
	
	describe("mark section as complete", () => {

		const addWallsDataToStore = async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceExternalWall: { data: [{ data: external1, complete: true }] },
						dwellingSpaceInternalWall: { data: [{ data: internal1, complete: true }] },
						dwellingSpacePartyWall: { data: [{ data: party1, complete: true }] },
						dwellingSpaceWallToUnheatedSpace: { data: [{ data: toUnheatedSpace1, complete: true }] },
					},
				},
			});
		};


		const wallsSections = {
			dwellingSpaceExternalWall: {
				id: "external",
				form: ExternalWallForm,
			},
			dwellingSpaceInternalWall: {
				id: "internal",
				form: InternalWallForm,
			},
			dwellingSpacePartyWall: {
				id: "party",
				form: PartyWallForm,
			},
			dwellingSpaceWallToUnheatedSpace: {
				id: "toHeatedSpace",
				form: WallToUnheatedForm,
			},
		};

type WallType = keyof typeof store.dwellingFabric.dwellingSpaceWalls;


beforeEach(async () => {
	await renderSuspended(Walls);
});

afterEach(() => {
	store.$reset();
});

it("disables the Mark section as complete button when a wall is incomplete", async () => {
	store.$patch({
		dwellingFabric: {
			dwellingSpaceWalls: {
				dwellingSpaceExternalWall: { data: [{ data: external1, complete: false }] },
				dwellingSpaceInternalWall: { data: [{ data: internal1, complete: false }] },
				dwellingSpacePartyWall: { data: [{ data: party1, complete: false }] },
				dwellingSpaceWallToUnheatedSpace: { data: [{ data: toUnheatedSpace1, complete: false }] },
			},
		},
	});

	await renderSuspended(Walls);

	expect(screen.getByTestId("markAsCompleteButton").hasAttribute("disabled")).toBeTruthy();
});

it("enables the Mark section as complete button when all walls are complete", async () => {
	await addWallsDataToStore();

	await renderSuspended(Walls);
	expect(screen.getByTestId("markAsCompleteButton").hasAttribute("disabled")).toBeFalsy();
});

it("displays a 'Completed' status indicator when section is marked as complete", async () => {
	await renderSuspended(Walls);
	await user.click(screen.getByTestId("markAsCompleteButton"));
	const completedStatusElement = screen.queryByTestId(
		"completeSectionCompleted",
	);
	expect(completedStatusElement?.style.display).not.toBe("none");
});
	
describe("after section has been marked as complete", () => {
	beforeEach(async () => {
		await addWallsDataToStore();
		await renderSuspended(Walls);
		await user.click(screen.getByTestId("markAsCompleteButton"));
	});

	it("displays the 'Completed' section status indicator", async () => {
		const completed = screen.queryByTestId("completeSectionCompleted");
		expect(completed?.style.display).not.toBe("none");
	});

	it("navigates to the dwelling fabric page", async () => {
		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric");
	});

	it("marks all walls sections as complete when button is clicked", async () => {
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
	});

	it("marks walls as not complete if an item is removed", async () => {
		await user.click(screen.getByTestId("external_remove_0"));
		await user.click(screen.getByTestId("internal_remove_0"));
		await user.click(screen.getByTestId("party_remove_0"));
		await user.click(screen.getByTestId("toHeatedSpace_remove_0"));

		const {
			dwellingSpaceExternalWall,
			dwellingSpaceInternalWall,
			dwellingSpacePartyWall,
			dwellingSpaceWallToUnheatedSpace,
		} = store.dwellingFabric.dwellingSpaceWalls;

		expect(dwellingSpaceExternalWall?.complete).toBe(false);
		expect(dwellingSpaceInternalWall?.complete).toBe(false);
		expect(dwellingSpacePartyWall?.complete).toBe(false);
		expect(dwellingSpaceWallToUnheatedSpace?.complete).toBe(false);
	});

	it("marks walls as not complete if an item is duplicated", async () => {
		await user.click(screen.getByTestId("external_duplicate_0"));
		await user.click(screen.getByTestId("internal_duplicate_0"));
		await user.click(screen.getByTestId("party_duplicate_0"));
		await user.click(screen.getByTestId("toHeatedSpace_duplicate_0"));

		const {
			dwellingSpaceExternalWall,
			dwellingSpaceInternalWall,
			dwellingSpacePartyWall,
			dwellingSpaceWallToUnheatedSpace,
		} = store.dwellingFabric.dwellingSpaceWalls;

		expect(dwellingSpaceExternalWall?.complete).toBe(false);
		expect(dwellingSpaceInternalWall?.complete).toBe(false);
		expect(dwellingSpacePartyWall?.complete).toBe(false);
		expect(dwellingSpaceWallToUnheatedSpace?.complete).toBe(false);
	});

	it("marks walls as not complete after adding a new wall", async () => {
		for (const wallType of Object.keys(store.dwellingFabric.dwellingSpaceWalls) as WallType[]) {

			await renderSuspended(wallsSections[wallType].form, {
				route: { params: { [wallsSections[wallType].id]: "create" } },
			});
			await user.type(screen.getByTestId("name"), "New wall");
			await user.tab();
			await user.click(screen.getByTestId("saveAndComplete"));
	
			expect(store.dwellingFabric.dwellingSpaceWalls[wallType]?.complete).toBe(false);
		}
	});
	it("marks walls as not complete after editing an existing wall", async () => {
		for (const wallType of Object.keys(store.dwellingFabric.dwellingSpaceWalls) as WallType[]) {

			await renderSuspended(wallsSections[wallType].form, {
				route: { params: { [wallsSections[wallType].id]: "0" } },
			});
			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), "New wall");
			await user.tab();

			expect(store.dwellingFabric.dwellingSpaceWalls[wallType]?.complete).toBe(false);
		}
	});
});
	});
});
