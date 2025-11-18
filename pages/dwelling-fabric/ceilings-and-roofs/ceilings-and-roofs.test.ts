import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import CeilingsAndRoofs from "./index.vue";
import CeilingForm from "./ceilings/[ceiling].vue";
import RoofForm from "./roofs/[roof].vue";

import { screen } from "@testing-library/vue";
import { within } from "@testing-library/dom";
import formStatus from "~/constants/formStatus";

describe("ceilings and roofs", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	const ceiling1: EcaasForm<CeilingData> = {
		data: {
			id: "bf19cff9-225b-4e38-80d7-a3e1adf5da3f",
			name: "Ceiling 1",
			type: AdjacentSpaceType.heatedSpace,
			surfaceArea: 5,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
			pitchOption: "custom",
			pitch: 180,
		},
	};

	const ceiling2: EcaasForm<CeilingData> = {
		data: {
			...ceiling1.data,
			name: "Ceiling 2",
			id: "bf19cff9-225b-4e38-80d7-a111111111",
		},
	};

	const ceiling3: EcaasForm<CeilingData> = {
		data: {
			...ceiling1.data,
			name: "Ceiling 3",
			id: "bf19cff9-225b-4e38-80d7-a222222222",
		},
	};

	const roof1: EcaasForm<RoofData> = {
		data: {
			id: "10c7f753-9d63-4fc6-97d6-968d7e1ea2ea",
			name: "Roof 1",
			typeOfRoof: "flat",
			pitchOption: "0",
			pitch: 0,
			length: 1,
			width: 1,
			elevationalHeightOfElement: 2,
			surfaceArea: 1,
			uValue: 1,
			colour: "Dark",
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
		},
	};

	const roof2: EcaasForm<RoofData> = {
		data: {
			...roof1.data,
			name: "Roof 2",
			id: "41a6e9c4-1b6d-4e5c-8bdc-950b0292cf52",
		},
	};

	const roof3: EcaasForm<RoofData> = {
		data: {
			...roof1.data,
			name: "Roof 3",
			id: "9f0112b6-6fe0-49fe-9223-ea749db34307",
		},
	};

	describe("ceilings", () => {
		test("ceiling is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: {
							data: [ceiling1],
						},
					},
				},
			});

			await renderSuspended(CeilingsAndRoofs);

			expect(screen.getAllByTestId("ceilings_items")).toBeDefined();

			await user.click(screen.getByTestId("ceilings_remove_0"));

			expect(screen.queryByTestId("ceilings_items")).toBeNull();
		});

		it("should only remove the ceiling object thats is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: {
							data: [ceiling1, ceiling2, ceiling3],
						},
					},
				},
			});

			await renderSuspended(CeilingsAndRoofs);
			await user.click(screen.getByTestId("ceilings_remove_1"));

			const populatedList = screen.getByTestId("ceilings_items");

			expect(within(populatedList).getByText("Ceiling 1")).toBeDefined();
			expect(within(populatedList).getByText("Ceiling 3")).toBeDefined();
			expect(within(populatedList).queryByText("Ceiling 2")).toBeNull();
		});

		it("when a ceiling is removed it's also removed from any store item that references it", async () => {
			const doorToHeatedSpace: EcaasForm<InternalDoorData> = {
				data: {
					typeOfInternalDoor: AdjacentSpaceType.heatedSpace,
					name: "Internal 1",
					associatedItemId: ceiling1.data.id,
					surfaceArea: 5,
					arealHeatCapacity: "Very light",
					massDistributionClass: "I",
				},
			};

			const doorToUnheatedSpace: EcaasForm<InternalDoorData> = {
				data: {
					...doorToHeatedSpace.data,
					associatedItemId: ceiling2.data.id,
					typeOfInternalDoor: AdjacentSpaceType.unheatedSpace,
					uValue: 0.1,
					thermalResistanceOfAdjacentUnheatedSpace: 0,
				},
			};
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: {
							data: [ceiling1, ceiling2],
						},
					},
					dwellingSpaceDoors: {
						dwellingSpaceInternalDoor: {
							data: [doorToHeatedSpace, doorToUnheatedSpace],
						},
					},
				},
			});

			await renderSuspended(CeilingsAndRoofs);
			await user.click(await screen.findByTestId("ceilings_remove_0"));

			const doors =
        store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor.data;
			expect(doors[0]?.data.associatedItemId).toBeUndefined();
			expect(doors[1]?.data.associatedItemId).toBe(ceiling2.data.id);
		});

		test("ceiling is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: {
							data: [ceiling1, ceiling2],
						},
					},
				},
			});

			await renderSuspended(CeilingsAndRoofs);
			await userEvent.click(screen.getByTestId("ceilings_duplicate_0"));
			await userEvent.click(screen.getByTestId("ceilings_duplicate_0"));
			await userEvent.click(screen.getByTestId("ceilings_duplicate_2"));
			await userEvent.click(screen.getByTestId("ceilings_duplicate_2"));

			expect(screen.queryAllByTestId("ceilings_item").length).toBe(6);
			expect(screen.getByText("Ceiling 1")).toBeDefined();
			expect(screen.getByText("Ceiling 1 (1)")).toBeDefined();
			expect(screen.getByText("Ceiling 1 (2)")).toBeDefined();
			expect(screen.getByText("Ceiling 1 (1) (1)")).toBeDefined();
			expect(screen.getByText("Ceiling 1 (1) (2)")).toBeDefined();
		});
    
		test("an in-progress indicator is shown when an entry is not marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: {
							data: [ceiling1],
						},
					},
				},
			});

			await renderSuspended(CeilingsAndRoofs);

			expect(screen.getByTestId("ceilings_status_0").textContent).toBe(
				formStatus.inProgress.text,
			);
		});
		test("a complete indicator is shown when an entry is marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: {
							data: [{ ...ceiling1, complete: true }],
						},
					},
				},
			});

			await renderSuspended(CeilingsAndRoofs);

			expect(screen.getByTestId("ceilings_status_0").textContent).toBe(
				formStatus.complete.text,
			);
		});
	});

	describe("roofs", () => {
		test("roof is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceRoofs: {
							data: [roof1],
						},
					},
				},
			});

			await renderSuspended(CeilingsAndRoofs);

			expect(screen.getAllByTestId("roofs_items")).toBeDefined();

			await user.click(screen.getByTestId("roofs_remove_0"));

			expect(screen.queryByTestId("roofs_items")).toBeNull();
		});

		it("should only remove the roof object thats is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceRoofs: {
							data: [roof1, roof2, roof3],
						},
					},
				},
			});

			await renderSuspended(CeilingsAndRoofs);
			await user.click(screen.getByTestId("roofs_remove_1"));

			const populatedList = screen.getByTestId("roofs_items");

			expect(within(populatedList).getByText("Roof 1")).toBeDefined();
			expect(within(populatedList).getByText("Roof 3")).toBeDefined();
			expect(within(populatedList).queryByText("Roof 2")).toBeNull();
		});

		it("when a roof is removed its also removed from any store item that references it", async () => {

			const window1: EcaasForm<WindowData> = {
				data: {
					id: "test-id-1",
					name: "Window 1",
					taggedItem: roof1.data.id,
					height: 1,
					width: 1,
					uValue: 1,
					solarTransmittance: 0.1,
					elevationalHeight: 1,
					midHeight: 1,
					numberOpenableParts: "0",
					openingToFrameRatio: 0.2,
					curtainsOrBlinds: false,
					securityRisk: false,
				},
				complete: true,
			};
			const externalUnglazed: EcaasForm<ExternalUnglazedDoorData> = {
				data: {
					name: "external unglazed name",
					associatedItemId: roof1.data.id,
					height: 0.5,
					width: 20,
					elevationalHeight: 20,
					surfaceArea: 10,
					uValue: 1,
					colour: "Intermediate",
					arealHeatCapacity: "Very light",
					massDistributionClass: "I",
				},
			};

			const externalGlazed: EcaasForm<ExternalGlazedDoorData> = {
				data: {
					name: "external glazed name",
					associatedItemId: roof1.data.id,
					height: 1,
					width: 1,
					uValue: 1,
					solarTransmittance: 0.1,
					elevationalHeight: 1,
					midHeight: 1,
					openingToFrameRatio: 0.2,
					midHeightOpenablePart1: 2,
					heightOpenableArea: 1,
					maximumOpenableArea: 1,
					securityRisk: false,
				},
			};
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceRoofs: {
							data: [roof1, roof2],
						},
					},
					dwellingSpaceWindows: {
						data: [window1],
					},
					dwellingSpaceDoors: {
						dwellingSpaceExternalGlazedDoor: {
							data: [externalGlazed],
						},
						dwellingSpaceExternalUnglazedDoor: {
							data: [externalUnglazed],
						},
					},
				},
			});

			await renderSuspended(CeilingsAndRoofs);

			await user.click(await screen.findByTestId("roofs_remove_1"));
			await user.click(await screen.findByTestId("roofs_remove_0"));


			const window = store.dwellingFabric.dwellingSpaceWindows.data[0]?.data;
			expect(window?.taggedItem).toBeUndefined();
			const glazedDoor =
        store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor
        	.data[0]?.data;
			expect(glazedDoor?.associatedItemId).toBeUndefined();
			const unglazedDoor =
        store.dwellingFabric.dwellingSpaceDoors
        	.dwellingSpaceExternalUnglazedDoor.data[0]?.data;
			expect(unglazedDoor?.associatedItemId).toBeUndefined();
		});
    
		test("roof is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceRoofs: {
							data: [roof1, roof2],
						},
					},
				},
			});

			await renderSuspended(CeilingsAndRoofs);
			await userEvent.click(screen.getByTestId("roofs_duplicate_0"));
			await userEvent.click(screen.getByTestId("roofs_duplicate_0"));
			await userEvent.click(screen.getByTestId("roofs_duplicate_2"));
			await userEvent.click(screen.getByTestId("roofs_duplicate_2"));

			expect(screen.queryAllByTestId("roofs_item").length).toBe(6);
			expect(screen.getByText("Roof 1")).toBeDefined();
			expect(screen.getByText("Roof 1 (1)")).toBeDefined();
			expect(screen.getByText("Roof 1 (2)")).toBeDefined();
			expect(screen.getByText("Roof 1 (1) (1)")).toBeDefined();
			expect(screen.getByText("Roof 1 (1) (2)")).toBeDefined();
		});
		test("an in-progress indicator is shown when an entry is not marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceRoofs: {
							data: [roof1],
						},
					},
				},
			});

			await renderSuspended(CeilingsAndRoofs);

			expect(screen.getByTestId("roofs_status_0").textContent).toBe(
				formStatus.inProgress.text,
			);
		});
		test("a complete indicator is shown when an entry is marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceRoofs: {
							data: [{ ...roof1, complete: true }],
						},
					},
				},
			});

			await renderSuspended(CeilingsAndRoofs);

			expect(screen.getByTestId("roofs_status_0").textContent).toBe(
				formStatus.complete.text,
			);
		});
	});

	describe("mark section as complete", () => {
		const addCompleteCeilingsAndDoorsDataToStore = async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: { data: [{ ...ceiling1, complete: true }] },
						dwellingSpaceRoofs: { data: [{ ...roof1, complete: true }] },
					},
				},
			});
		};
		beforeEach(async () => {
			await renderSuspended(CeilingsAndRoofs);
		});

		afterEach(() => {
			store.$reset();
		});


		it("disables the Mark section as complete button when a door is incomplete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: { data: [{ ...ceiling1, complete: false }] },
						dwellingSpaceRoofs: { data: [{ ...roof1, complete: false }] },
					},
				},
			});
			await renderSuspended(CeilingsAndRoofs);

			expect(
				screen.getByTestId("markAsCompleteButton").hasAttribute("disabled"),
			).toBeTruthy();
		});

		it("enables the Mark section as complete button when all doors are complete", async () => {
			await addCompleteCeilingsAndDoorsDataToStore();

			await renderSuspended(CeilingsAndRoofs);
			expect(
				screen.getByTestId("markAsCompleteButton").hasAttribute("disabled"),
			).toBeFalsy();
		});

	
		describe("after section has been marked as complete", () => {
			beforeEach(async () => {
				await addCompleteCeilingsAndDoorsDataToStore();
				await renderSuspended(CeilingsAndRoofs);
				await user.click(screen.getByTestId("markAsCompleteButton"));
			});
	
			it("displays the 'Completed' section status indicator", async () => {
				const completed = screen.queryByTestId("completeSectionCompleted");
				expect(completed?.style.display).not.toBe("none");
			});
	
			it("navigates to the dwelling fabric page", async () => {
				expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric");
			});

			it("marks each ceiling and roofs section as complete when button is clicked", async () => {
				const {
					dwellingSpaceCeilings,      
					dwellingSpaceRoofs,
				} = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

				expect(dwellingSpaceCeilings?.complete).toBe(true);
				expect(dwellingSpaceRoofs?.complete).toBe(true);
			});

			it("marks corresponding ceiling and roofs section as not complete if an item is removed", async () => {

				await user.click(screen.getByTestId("ceilings_remove_0"));
				await user.click(screen.getByTestId("roofs_remove_0"));

				const {
					dwellingSpaceCeilings,      
					dwellingSpaceRoofs,
				} = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

				expect(dwellingSpaceCeilings?.complete).toBe(false);
				expect(dwellingSpaceRoofs?.complete).toBe(false);
			});

			it("marks corresponding ceiling and roofs section as not complete if an item is duplicated", async () => {
		
				await user.click(screen.getByTestId("ceilings_duplicate_0"));
				await user.click(screen.getByTestId("roofs_duplicate_0"));

				const {
					dwellingSpaceCeilings,      
					dwellingSpaceRoofs,
				} = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

				expect(dwellingSpaceCeilings?.complete).toBe(false);
				expect(dwellingSpaceRoofs?.complete).toBe(false);
      
			});

			it("marks section as not complete after adding a new ceiling", async () => {
    		
				await user.click(screen.getByTestId("markAsCompleteButton"));
  
				await renderSuspended(CeilingForm, {
					route: { params: { "ceiling": "create" } },
				});
				await user.click(screen.getByTestId("type_heatedSpace"));
				await user.type(screen.getByTestId("name"), "New ceiling");
				await user.tab();
				await user.click(screen.getByTestId("saveAndComplete"));

				expect(store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings?.complete).toBe(false);

				expect(
					screen.queryByTestId("markAsCompleteButton")?.style.display,
				).not.toBe("none");
			});

			it("marks section as not complete after adding a new roof", async () => {

				await user.click(screen.getByTestId("markAsCompleteButton"));
  
				await renderSuspended(RoofForm, {
					route: { params: { "roof": "create" } },
				});

				await user.type(screen.getByTestId("name"), "New roof");
				await user.tab();
				await user.click(screen.getByTestId("saveAndComplete"));

				expect(store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs?.complete).toBe(false);
				expect(
					screen.queryByTestId("markAsCompleteButton")?.style.display,
				).not.toBe("none");
			});

			it("marks section as not complete after editing a new ceiling item", async () => {

				await user.click(screen.getByTestId("markAsCompleteButton"));

				await renderSuspended(CeilingForm, {
					route: { params: { "ceiling": "0" } },
				});
				
				await user.clear(screen.getByTestId("name"));
				await user.type(screen.getByTestId("name"), "Updated ceiling item");
				await user.tab();

				expect(store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings?.complete).toBe(false);
				expect(
					screen.queryByTestId("markAsCompleteButton")?.style.display,
				).not.toBe("none");
			});

			it("marks section as not complete after editing a new roof item", async () => {

				await user.click(screen.getByTestId("markAsCompleteButton"));

				await renderSuspended(RoofForm, {
					route: { params: { "roof": "0" } },
				});
				await user.clear(screen.getByTestId("name"));
				await user.type(screen.getByTestId("name"), "Updated ceiling item");
				await user.tab();

				expect(store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs?.complete).toBe(false);
				expect(
					screen.queryByTestId("markAsCompleteButton")?.style.display,
				).not.toBe("none");
			});
		});
	});
});
