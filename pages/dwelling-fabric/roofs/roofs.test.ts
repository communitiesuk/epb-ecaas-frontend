import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import RoofForm from "./[roof].vue";
import Roofs from "./index.vue";

import { within } from "@testing-library/dom";
import { screen } from "@testing-library/vue";
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

	const roof1: EcaasForm<RoofData> = {
		data: {
			id: "10c7f753-9d63-4fc6-97d6-968d7e1ea2ea",
			name: "Roof 1",
			typeOfRoof: "flatAboveHeatedSpace",
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

	describe("roofs", () => {
		test("roof is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceRoofs: {
						data: [roof1],
					},
				},
			});

			await renderSuspended(Roofs);

			expect(screen.getAllByTestId("roofs_items")).toBeDefined();

			await user.click(screen.getByTestId("roofs_remove_0"));

			expect(screen.queryByTestId("roofs_items")).toBeNull();
		});

		it("should only remove the roof object thats is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceRoofs: {
						data: [roof1, roof2, roof3],
					},
				},
			});

			await renderSuspended(Roofs);
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
					numberOpenableParts: "0",
					openingToFrameRatio: 0.2,
					curtainsOrBlinds: false,
					securityRisk: false,
					hasShading: false,
				},
				complete: true,
			};
			const externalUnglazed: EcaasForm<ExternalUnglazedDoorData> = {
				data: {
					isTheFrontDoor: false,
					name: "external unglazed name",
					associatedItemId: roof1.data.id,
					height: 0.5,
					width: 20,
					elevationalHeight: 20,
					colour: "Intermediate",
					arealHeatCapacity: "Very light",
					massDistributionClass: "I",
					uValue: 8,
				},
			};

			const externalGlazed: EcaasForm<ExternalGlazedDoorData> = {
				data: {
					id: "external-glazed-door-id",
					isTheFrontDoor: false,
					name: "external glazed name",
					associatedItemId: roof1.data.id,
					height: 1,
					width: 1,
					solarTransmittance: 0.1,
					elevationalHeight: 1,
					openingToFrameRatio: 0.2,
					midHeightOpenablePart1: 2,
					freeAreaHeightPart1: 1,
					maximumOpenableAreaPart1: 1,
					securityRisk: false,
					uValue: 9,
					numberOpenableParts: "1",
					curtainsOrBlinds: false,
					hasShading: false,
				},
			};
			store.$patch({
				dwellingFabric: {
					dwellingSpaceRoofs: {
						data: [roof1, roof2],
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

			await renderSuspended(Roofs);

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
					dwellingSpaceRoofs: {
						data: [roof1, roof2],
					},
				},
			});

			await renderSuspended(Roofs);
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
					dwellingSpaceRoofs: {
						data: [roof1],
					},
				},
			});

			await renderSuspended(Roofs);

			expect(screen.getByTestId("roofs_status_0").textContent).toBe(
				formStatus.inProgress.text,
			);
		});
		test("a complete indicator is shown when an entry is marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceRoofs: {
						data: [{ ...roof1, complete: true }],
					},
				},
			});

			await renderSuspended(Roofs);

			expect(screen.getByTestId("roofs_status_0").textContent).toBe(
				formStatus.complete.text,
			);
		});
	});

	describe("mark section as complete", () => {
		const addCompleteCeilingsAndDoorsDataToStore = async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceRoofs: { data: [{ ...roof1, complete: true }] },
				},
			});
		};

		beforeEach(async () => {
			await renderSuspended(Roofs);
		});

		afterEach(() => {
			store.$reset();
		});

		it("disables the Mark section as complete button when a roof is incomplete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceRoofs: { data: [{ ...roof1, complete: false }] },
				},
			});

			await renderSuspended(Roofs);

			expect(
				screen.getByTestId("markAsCompleteButton").hasAttribute("disabled"),
			).toBeTruthy();
		});

		it("enables the Mark section as complete button when all roofs are complete", async () => {
			await addCompleteCeilingsAndDoorsDataToStore();

			await renderSuspended(Roofs);
			expect(
				screen.getByTestId("markAsCompleteButton").hasAttribute("disabled"),
			).toBeFalsy();
		});

		describe("after section has been marked as complete", () => {
			beforeEach(async () => {
				await addCompleteCeilingsAndDoorsDataToStore();
				await renderSuspended(Roofs);
				await user.click(screen.getByTestId("markAsCompleteButton"));
			});

			it("displays the 'Completed' section status indicator", async () => {
				const completed = screen.queryByTestId("completeSectionCompleted");
				expect(completed?.style.display).not.toBe("none");
			});

			it("navigates to the dwelling fabric page", async () => {
				expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric");
			});

			it("marks roofs section as complete when button is clicked", async () => {
				const { dwellingSpaceRoofs } = store.dwellingFabric;

				expect(dwellingSpaceRoofs?.complete).toBe(true);
			});

			it("marks roofs section as not complete if an item is removed", async () => {
				await user.click(screen.getByTestId("roofs_remove_0"));

				const { dwellingSpaceRoofs } = store.dwellingFabric;

				expect(dwellingSpaceRoofs?.complete).toBe(false);
			});

			it("marks roofs section as not complete if an item is duplicated", async () => {
				await user.click(screen.getByTestId("roofs_duplicate_0"));

				const { dwellingSpaceRoofs } = store.dwellingFabric;

				expect(dwellingSpaceRoofs?.complete).toBe(false);

			});

			it("marks section as not complete after adding a new roof", async () => {
				await user.click(screen.getByTestId("markAsCompleteButton"));

				await renderSuspended(RoofForm, {
					route: { params: { "roof": "create" } },
				});

				await user.type(screen.getByTestId("name"), "New roof");
				await user.tab();
				await user.click(screen.getByTestId("saveAndComplete"));

				expect(store.dwellingFabric.dwellingSpaceRoofs?.complete).toBe(false);
				expect(screen.queryByTestId("markAsCompleteButton")?.style.display).not.toBe("none");
			});

			it("marks section as not complete after editing a new roof item", async () => {
				await user.click(screen.getByTestId("markAsCompleteButton"));

				await renderSuspended(RoofForm, {
					route: { params: { "roof": "0" } },
				});

				await user.clear(screen.getByTestId("name"));
				await user.type(screen.getByTestId("name"), "Updated ceiling item");
				await user.tab();

				expect(store.dwellingFabric.dwellingSpaceRoofs?.complete).toBe(false);
				expect(screen.queryByTestId("markAsCompleteButton")?.style.display).not.toBe("none");
			});
		});
	});
});
