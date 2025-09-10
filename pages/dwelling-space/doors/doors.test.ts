import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Doors from "./index.vue";
import { screen } from "@testing-library/vue";
import { within } from "@testing-library/dom";
import UnglazedDoorForm from "./external-unglazed/[door].vue";
import glazedDoorForm from "./external-glazed/[door].vue";
import internalDoorForm from "./internal/[door].vue";
import type { Component } from "vue";

describe("doors", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	const externalUnglazed1: EcaasForm<ExternalUnglazedDoorData> = {
		data: {
			name: "external unglazed 1 name",
			pitchOption: "90",
			pitch: 90,
			orientation: 0,
			height: 0.5,
			width: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorption: 0.1,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: "I"
		}
	};

	const externalUnglazed2: EcaasForm<ExternalUnglazedDoorData> = {
		data: {
			name: "external unglazed 2 name",
			pitchOption: "90",
			pitch: 90,
			orientation: 0,
			height: 0.5,
			width: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorption: 0.1,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: "I" }
	};

	const externalUnglazed3: EcaasForm<ExternalUnglazedDoorData> = {
		data:
				{
					name: "external unglazed 3 name",
					pitchOption: "90",
					pitch: 90,
					orientation: 0,
					height: 0.5,
					width: 20,
					elevationalHeight: 20,
					surfaceArea: 10,
					solarAbsorption: 0.1,
					uValue: 1,
					kappaValue: 100,
					massDistributionClass: "I"
				}
	};

	const externalGlazed1: EcaasForm<ExternalGlazedDoorData> = {
		data: {
			name: "externalGlazed1 name",
			orientation: 1,
			surfaceArea: 1,
			height: 1,
			width: 1,
			uValue: 1,
			pitchOption: "90",
			pitch: 90,
			solarTransmittance: 0.1,
			elevationalHeight: 1,
			midHeight: 1,
			numberOpenableParts: "0",
			openingToFrameRatio: 0.2,
		}
	};

	const externalGlazed2: EcaasForm<ExternalGlazedDoorData> = {
		data:
				{
					name: "externalGlazed2 name",
					orientation: 1,
					surfaceArea: 1,
					height: 1,
					width: 1,
					uValue: 1,
					pitchOption: "90",
					pitch: 90,
					solarTransmittance: 0.1,
					elevationalHeight: 1,
					midHeight: 1,
					numberOpenableParts: "0",
					openingToFrameRatio: 0.2
				}
	};

	const externalGlazed3: EcaasForm<ExternalGlazedDoorData> = {
		data:
				{
					name: "externalGlazed3 name",
					orientation: 1,
					surfaceArea: 1,
					height: 1,
					width: 1,
					uValue: 1,
					pitchOption: "90",
					pitch: 90,
					solarTransmittance: 0.1,
					elevationalHeight: 1,
					midHeight: 1,
					numberOpenableParts: "0",
					openingToFrameRatio: 0.2
				}
	};
	
	const internal1: EcaasForm<InternalDoorData> = {
		data: {
			typeOfInternalDoor: AdjacentSpaceType.heatedSpace,
			name: "Internal 1",
			surfaceArea: 5,
			kappaValue: 100,
			massDistributionClass: "I",
			pitchOption: "90",
			pitch: 90
		}
	};

	const internal2: EcaasForm<InternalDoorData> = {
		data: {
			typeOfInternalDoor: AdjacentSpaceType.heatedSpace,
			name: "Internal 2",
			surfaceArea: 5,
			kappaValue: 100,
			massDistributionClass: "I",
			pitchOption: "90",
			pitch: 90
		}
	};

	const internal3: EcaasForm<InternalDoorData> = {
		data: {
			typeOfInternalDoor: AdjacentSpaceType.heatedSpace,
			name: "Internal 3",
			surfaceArea: 5,
			kappaValue: 100,
			massDistributionClass: "I",
			pitchOption: "90",
			pitch: 90
		}
	};
	
	describe("external unglazed doors", () => {
	
		test("external unglazed door is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalUnglazedDoor: {
							data:[externalUnglazed1]
						}
					}
				}
			});
	
			await renderSuspended(Doors);
	
			expect(screen.getAllByTestId("externalUnglazed_items")).toBeDefined();
	
			await user.click(screen.getByTestId("externalUnglazed_remove_0"));
	
			expect(screen.queryByTestId("externalUnglazed_items")).toBeNull();
		});
	
		it("should only remove the door object thats is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalUnglazedDoor: {
							data:[externalUnglazed1, externalUnglazed2, externalUnglazed3]
						}
					}
				}
			});
	
			await renderSuspended(Doors);
			await user.click(screen.getByTestId("externalUnglazed_remove_1"));
	
			const populatedList = screen.getByTestId("externalUnglazed_items");
	
			expect(within(populatedList).getByText("external unglazed 1 name")).toBeDefined();
			expect(within(populatedList).getByText("external unglazed 3 name")).toBeDefined();
			expect(within(populatedList).queryByText("external unglazed 2 name")).toBeNull();
	
		});
		test("door is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalUnglazedDoor: {
							data:[externalUnglazed1, externalUnglazed2]
						}
					}
				}
			});
	
			await renderSuspended(Doors);
			await userEvent.click(screen.getByTestId("externalUnglazed_duplicate_0"));
			await userEvent.click(screen.getByTestId("externalUnglazed_duplicate_0"));
			await userEvent.click(screen.getByTestId("externalUnglazed_duplicate_2"));
			await userEvent.click(screen.getByTestId("externalUnglazed_duplicate_2"));
	
			expect(screen.queryAllByTestId("externalUnglazed_item").length).toBe(6);
			expect(screen.getByText("external unglazed 1 name")).toBeDefined();
			expect(screen.getByText("external unglazed 1 name (1)")).toBeDefined();
			expect(screen.getByText("external unglazed 1 name (2)")).toBeDefined();
			expect(screen.getByText("external unglazed 1 name (1) (1)")).toBeDefined();
			expect(screen.getByText("external unglazed 1 name (1) (2)")).toBeDefined();
		});
	});

	describe("external glazed doors", () => {
	
		test("external glazed door is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalGlazedDoor: {
							data:[externalGlazed1]
						}
					}
				}
			});
			
			await renderSuspended(Doors);
			
			expect(screen.getAllByTestId("externalGlazed_items")).toBeDefined();
			
			await user.click(screen.getByTestId("externalGlazed_remove_0"));
	
			expect(screen.queryByTestId("externalGlazed_items")).toBeNull();
		});
	
		it("should only remove the internal door object thats is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalGlazedDoor: {
							data:[externalGlazed1, externalGlazed2, externalGlazed3]
						}
					}
				}
			});
	
			await renderSuspended(Doors);
			await user.click(screen.getByTestId("externalGlazed_remove_1"));
	
			const populatedList = screen.getByTestId("externalGlazed_items");
	
			expect(within(populatedList).getByText("externalGlazed1 name")).toBeDefined();
			expect(within(populatedList).getByText("externalGlazed3 name")).toBeDefined();
			expect(within(populatedList).queryByText("externalGlazed2 name")).toBeNull();
	
		});
	
		test("door is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalGlazedDoor: {
							data:[externalGlazed1, externalGlazed2]
						}
					}
				}
			});
	
			await renderSuspended(Doors);
			await userEvent.click(screen.getByTestId("externalGlazed_duplicate_0"));
			await userEvent.click(screen.getByTestId("externalGlazed_duplicate_0"));
			await userEvent.click(screen.getByTestId("externalGlazed_duplicate_2"));
			await userEvent.click(screen.getByTestId("externalGlazed_duplicate_2"));
	
			expect(screen.queryAllByTestId("externalGlazed_item").length).toBe(6);
			expect(screen.getByText("externalGlazed1 name")).toBeDefined();
			expect(screen.getByText("externalGlazed1 name (1)")).toBeDefined();
			expect(screen.getByText("externalGlazed1 name (2)")).toBeDefined();
			expect(screen.getByText("externalGlazed1 name (1) (1)")).toBeDefined();
			expect(screen.getByText("externalGlazed1 name (1) (2)")).toBeDefined();
		});
	});

	describe("internal door", () => {
	
		test("internal door is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceInternalDoor: {
							data:[internal1]
						}
					}
				}
			});
	
			await renderSuspended(Doors);
	
			expect(screen.getAllByTestId("internal_items")).toBeDefined();
	
			await user.click(screen.getByTestId("internal_remove_0"));
	
			expect(screen.queryByTestId("internal_items")).toBeNull();
		});
	
		it("should only remove the exposed door object thats is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceInternalDoor: {
							data:[internal1, internal2, internal3]
						}
					}
				}
			});
	
			await renderSuspended(Doors);
			await user.click(screen.getByTestId("internal_remove_1"));
			const populatedList = screen.getByTestId("internal_items");
	
			expect(within(populatedList).getByText("Internal 1")).toBeDefined();
			expect(within(populatedList).getByText("Internal 3")).toBeDefined();
			expect(within(populatedList).queryByText("Internal 2")).toBeNull();
	
		});
		test("door is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceInternalDoor: {
							data:[internal1, internal2]
						}
					}
				}
			});
	
			await renderSuspended(Doors);
			await userEvent.click(screen.getByTestId("internal_duplicate_0"));
			await userEvent.click(screen.getByTestId("internal_duplicate_0"));
			await userEvent.click(screen.getByTestId("internal_duplicate_2"));
			await userEvent.click(screen.getByTestId("internal_duplicate_2"));
	
			expect(screen.queryAllByTestId("internal_item").length).toBe(6);
			expect(screen.getByText("Internal 1")).toBeDefined();
			expect(screen.getByText("Internal 1 (1)")).toBeDefined();
			expect(screen.getByText("Internal 1 (2)")).toBeDefined();
			expect(screen.getByText("Internal 1 (1) (1)")).toBeDefined();
			expect(screen.getByText("Internal 1 (1) (2)")).toBeDefined();
		});
	});
	
	describe("mark section as complete", () => {
		
		const addDoorsDataToStore = async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalUnglazedDoor: { data: [{ ...externalUnglazed1, complete: true }] },
						dwellingSpaceExternalGlazedDoor: { data: [{ ...externalGlazed1, complete: true }] },
						dwellingSpaceInternalDoor: { data: [{ ...internal1, complete: true }] },
					},
				}
			});
		};
		beforeEach(async () =>{
			await addDoorsDataToStore();
			await renderSuspended(Doors);
		});

		const getDoorData = async (action: string) => {
			const doors: {
				key: keyof DoorsData,
				testId: string,
				form: Component
			}[] = [
				{
					key: "dwellingSpaceExternalUnglazedDoor",
					testId: `externalUnglazed_${action}_0`,
					form: UnglazedDoorForm
				},
				{
					key: "dwellingSpaceExternalGlazedDoor",
					testId: `externalGlazed_${action}_0`,
					form: glazedDoorForm
				},
				{
					key: "dwellingSpaceInternalDoor",
					testId: `internal_${action}_0`,
					form: internalDoorForm
				}
			];
			return doors;
		};

		type DoorType = keyof typeof store.dwellingFabric.dwellingSpaceDoors;

	
		it("marks doors as complete when mark section as complete button is clicked", async () => {
	
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			const completedStatusElement = screen.queryByTestId("completeSectionCompleted");
			expect(completedStatusElement?.style.display).toBe("none");
	
			await user.click(screen.getByTestId("completeSectionButton"));
	
			const {
				dwellingSpaceExternalGlazedDoor,
				dwellingSpaceExternalUnglazedDoor,
				dwellingSpaceInternalDoor,
			} = store.dwellingFabric.dwellingSpaceDoors;
	
	
			expect(dwellingSpaceExternalGlazedDoor.complete).toBe(true);
			expect(dwellingSpaceExternalUnglazedDoor.complete).toBe(true);
			expect(dwellingSpaceInternalDoor.complete).toBe(true);
			expect(screen.queryByRole("button", { name: "Mark section as complete" })).toBeNull();
			expect(completedStatusElement?.style.display).not.toBe("none");
	
			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-space");
		});
	
		it("marks doors as not complete when mark as complete button is clicked then user removes a door item", async () => {

			const doorsData = await getDoorData("remove");
			const doors = Object.entries(store.dwellingFabric.dwellingSpaceDoors);
			
			for (const [key] of doors) {
				const typedKey = key as DoorType;
		
				await user.click(screen.getByTestId("completeSectionButton"));
				expect(store.dwellingFabric.dwellingSpaceDoors[typedKey]?.complete).toBe(true);
					
				const doorData = doorsData.find(x => x.key === typedKey);
	
				await user.click(screen.getByTestId(doorData!.testId));
				expect(store.dwellingFabric.dwellingSpaceDoors[typedKey]?.complete).toBe(false);
				expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
	
			}
		});

		it("marks doors as not complete when complete button is clicked then user duplicates a door item", async () => {

			const doorsData = await getDoorData("duplicate");
			const doors = Object.entries(store.dwellingFabric.dwellingSpaceDoors);
		
			for (const [key] of doors) {
				const typedKey = key as DoorType;
	
				await user.click(screen.getByTestId("completeSectionButton"));
				expect(store.dwellingFabric.dwellingSpaceDoors[typedKey]?.complete).toBe(true);
				
				const doorData = doorsData.find(x => x.key === typedKey);

				await user.click(screen.getByTestId(doorData!.testId));
				expect(store.dwellingFabric.dwellingSpaceDoors[typedKey]?.complete).toBe(false);
				expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			}

		});

		it("marks doors as not complete when user saves a new or edited door form after marking section as complete", async () => {

			const doorsData = await getDoorData("");

			const doors = Object.entries(store.dwellingFabric.dwellingSpaceDoors);
	
			for(const [key] of doors){
				const typedKey = key as DoorType;
				await user.click(screen.getByTestId("completeSectionButton"));
				expect(store.dwellingFabric.dwellingSpaceDoors[typedKey].complete).toBe(true);

				const doorData = doorsData.find(x => x.key === typedKey);

				await renderSuspended(doorData?.form, {
					route: {
						params: { door: "0" }
					}
				});

				await user.click(screen.getByTestId("saveAndComplete"));

				expect(store.dwellingFabric.dwellingSpaceDoors[typedKey]?.complete).toBe(false);
				await renderSuspended(Doors);
				expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			}
		});

		it("disables the mark section as complete button when item is incomplete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalGlazedDoor: {
							data: [{ data: { surfaceArea: 2 }, complete: false }]
						},
					}
				}
			});

			await renderSuspended(Doors);
			const markAsCompleteButton = screen.getByRole("button", { name: "Mark section as complete" });
			expect(markAsCompleteButton.hasAttribute("disabled")).toBeTruthy();
		});
	});
});
