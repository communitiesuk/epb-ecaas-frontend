import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Doors from "./index.vue";
import { screen } from "@testing-library/vue";
import { within } from "@testing-library/dom";
import UnglazedDoorForm from "./external-unglazed/[door].vue";
import glazedDoorForm from "./external-glazed/[door].vue";
import internalDoorForm from "./internal/[door].vue";
import formStatus from "~/constants/formStatus";

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

	const externalWall: ExternalWallData = {
		id: "80fd1ffe-a83a-4d95-bd2c-ad8fdc37b421",
		name: "External wall 1",
		pitchOption: "90",
		pitch: 90,
		orientation: 0,
		length: 20,
		height: 0.5,
		elevationalHeight: 20,
		surfaceArea: 10,
		uValue: 1,
		colour: "Intermediate",
		arealHeatCapacity: "Very light",
		massDistributionClass: "I",
	};

	const internalWall: InternalWallData = {
		id: "06cce939-0899-42cc-aa46-0d47c11a6ede",
		name: "Internal 1",
		surfaceAreaOfElement: 5,
		arealHeatCapacity: "Very light",
		massDistributionClass: "I",
		pitchOption: "90",
		pitch: 90,
	};

	const externalUnglazed1: EcaasForm<ExternalUnglazedDoorData> = {
		data: {
			name: "external unglazed 1 name",
			associatedItemId: externalWall.id,
			height: 0.5,
			width: 20,
			elevationalHeight: 20,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
			colour: "Dark",
			thermalResistance: 16,
		},
	};

	const externalUnglazed2: EcaasForm<ExternalUnglazedDoorData> = {
		data: {
			name: "external unglazed 2 name",
			associatedItemId: externalWall.id,
			height: 0.5,
			width: 20,
			elevationalHeight: 20,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
			colour: "Light",
			thermalResistance: 28,
		},
	};

	const externalUnglazed3: EcaasForm<ExternalUnglazedDoorData> = {
		data: {
			name: "external unglazed 3 name",
			associatedItemId: externalWall.id,
			height: 0.5,
			width: 20,
			elevationalHeight: 20,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
			colour: "Intermediate",
			thermalResistance: 23,
		},
	};

	const externalGlazed1: EcaasForm<ExternalGlazedDoorData> = {
		data: {
			name: "externalGlazed1 name",
			associatedItemId: externalWall.id,
			height: 1,
			width: 1,
			securityRisk: false,
			solarTransmittance: 0.1,
			elevationalHeight: 1,
			midHeight: 1,
			openingToFrameRatio: 0.2,
			heightOpenableArea: 1,
			maximumOpenableArea: 1,
			thermalResistance: 37,
			numberOpenableParts: "0",
			curtainsOrBlinds: false,

		},
	};

	const externalGlazed2: EcaasForm<ExternalGlazedDoorData> = {
		data: {
			name: "externalGlazed2 name",
			associatedItemId: externalWall.id,
			height: 1,
			width: 1,
			securityRisk: false,
			solarTransmittance: 0.1,
			elevationalHeight: 1,
			midHeight: 1,
			openingToFrameRatio: 0.2,
			midHeightOpenablePart1: 2,
			heightOpenableArea: 1,
			maximumOpenableArea: 1,
			thermalResistance: 25,
			numberOpenableParts: "1",
			curtainsOrBlinds: false,
		},
	};

	const externalGlazed3: EcaasForm<ExternalGlazedDoorData> = {
		data: {
			name: "externalGlazed3 name",
			associatedItemId: externalWall.id,
			height: 1,
			width: 1,
			securityRisk: false,
			solarTransmittance: 0.1,
			elevationalHeight: 1,
			midHeight: 1,
			openingToFrameRatio: 0.2,
			midHeightOpenablePart1: 2,
			midHeightOpenablePart2: 1.2,
			heightOpenableArea: 1,
			maximumOpenableArea: 1,
			thermalResistance: 41,
			numberOpenableParts: "2",
			curtainsOrBlinds: false,
		},
	};

	const internal1: EcaasForm<InternalDoorData> = {
		data: {
			typeOfInternalDoor: "heatedSpace",
			name: "Internal 1",
			associatedItemId: internalWall.id,
			surfaceArea: 5,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
		},
	};

	const internal2: EcaasForm<InternalDoorData> = {
		data: {
			typeOfInternalDoor: "heatedSpace",
			name: "Internal 2",
			associatedItemId: internalWall.id,
			surfaceArea: 5,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
		},
	};

	const internal3: EcaasForm<InternalDoorData> = {
		data: {
			typeOfInternalDoor: "heatedSpace",
			name: "Internal 3",
			associatedItemId: internalWall.id,
			surfaceArea: 5,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
		},
	};

	describe("external unglazed doors", () => {
		test("external unglazed door is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalUnglazedDoor: {
							data: [externalUnglazed1],
						},
					},
				},
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
							data: [externalUnglazed1, externalUnglazed2, externalUnglazed3],
						},
					},
				},
			});

			await renderSuspended(Doors);
			await user.click(screen.getByTestId("externalUnglazed_remove_1"));

			const populatedList = screen.getByTestId("externalUnglazed_items");

			expect(
				within(populatedList).getByText("external unglazed 1 name"),
			).toBeDefined();
			expect(
				within(populatedList).getByText("external unglazed 3 name"),
			).toBeDefined();
			expect(
				within(populatedList).queryByText("external unglazed 2 name"),
			).toBeNull();
		});
		test("door is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalUnglazedDoor: {
							data: [externalUnglazed1, externalUnglazed2],
						},
					},
				},
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
			expect(
				screen.getByText("external unglazed 1 name (1) (1)"),
			).toBeDefined();
			expect(
				screen.getByText("external unglazed 1 name (1) (2)"),
			).toBeDefined();
		});
	});

	describe("external glazed doors", () => {
		test("external glazed door is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalGlazedDoor: {
							data: [externalGlazed1],
						},
					},
				},
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
							data: [externalGlazed1, externalGlazed2, externalGlazed3],
						},
					},
				},
			});

			await renderSuspended(Doors);
			await user.click(screen.getByTestId("externalGlazed_remove_1"));

			const populatedList = screen.getByTestId("externalGlazed_items");

			expect(
				within(populatedList).getByText("externalGlazed1 name"),
			).toBeDefined();
			expect(
				within(populatedList).getByText("externalGlazed3 name"),
			).toBeDefined();
			expect(
				within(populatedList).queryByText("externalGlazed2 name"),
			).toBeNull();
		});

		test("door is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalGlazedDoor: {
							data: [externalGlazed1, externalGlazed2],
						},
					},
				},
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
							data: [internal1],
						},
					},
				},
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
							data: [internal1, internal2, internal3],
						},
					},
				},
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
							data: [internal1, internal2],
						},
					},
				},
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

		const addCompleteDoorsDataToStore = async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalUnglazedDoor: {
							data: [{ ...externalUnglazed1, complete: true }],
						},
						dwellingSpaceExternalGlazedDoor: {
							data: [{ ...externalGlazed1, complete: true }],
						},
						dwellingSpaceInternalDoor: {
							data: [{ ...internal1, complete: true }],
						},
					},
				},
			});
		};

		beforeEach(async () => {
			await renderSuspended(Doors);
		});

		afterEach(async () => {
			store.$reset();
		});

		const doorForms = {
			dwellingSpaceExternalUnglazedDoor: UnglazedDoorForm,
			dwellingSpaceExternalGlazedDoor: glazedDoorForm,
			dwellingSpaceInternalDoor: internalDoorForm,
		};

  		type DoorType = keyof typeof store.dwellingFabric.dwellingSpaceDoors;

  		it("disables the Mark section as complete button when a door is incomplete", async () => {
  			store.$patch({
  				dwellingFabric: {
  					dwellingSpaceDoors: {
  						dwellingSpaceExternalGlazedDoor: {
  							data: [{ ...externalGlazed1, complete: false }],
  						},
  						dwellingSpaceExternalUnglazedDoor: {
  							data: [{ ...externalGlazed1, complete: false }],
  						},
  						dwellingSpaceInternalDoor: {
  							data: [{ ...internal1, complete: false }],
  						},
  					},
  				},
  			});

  			await renderSuspended(Doors);
  			expect(
  				screen.getByTestId("markAsCompleteButton").hasAttribute("disabled"),
  			).toBeTruthy();
  		});

  		it("enables the Mark section as complete button when all doors are complete", async () => {
  			await addCompleteDoorsDataToStore();

  			await renderSuspended(Doors);
  			expect(
  				screen.getByTestId("markAsCompleteButton").hasAttribute("disabled"),
  			).toBeFalsy();
  		});

  		it("displays a 'Completed' status indicator when section is marked as complete", async () => {
  			await renderSuspended(Doors);
  			await user.click(screen.getByTestId("markAsCompleteButton"));
  			const completedStatusElement = screen.queryByTestId(
  				"completeSectionCompleted",
  			);
  			expect(completedStatusElement?.style.display).not.toBe("none");
  		});

  		describe("after section has been marked as complete", () => {
  			beforeEach(async () => {
  				await addCompleteDoorsDataToStore();
  				await renderSuspended(Doors);
  				await user.click(screen.getByTestId("markAsCompleteButton"));
  			});

  			it("displays the 'Completed' section status indicator", async () => {
  				const completed = screen.queryByTestId("completeSectionCompleted");
  				expect(completed?.style.display).not.toBe("none");
  			});

  			it("navigates to the dwelling fabric page", async () => {
  				expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric");
  			});

  			it("marks each doors section as complete when button is clicked", async () => {
  				const {
  					dwellingSpaceExternalGlazedDoor,
  					dwellingSpaceExternalUnglazedDoor,
  					dwellingSpaceInternalDoor,
  				} = store.dwellingFabric.dwellingSpaceDoors;

  				expect(dwellingSpaceExternalGlazedDoor?.complete).toBe(true);
  				expect(dwellingSpaceExternalUnglazedDoor?.complete).toBe(true);
  				expect(dwellingSpaceInternalDoor?.complete).toBe(true);
  			});

  			it("marks section as not complete if a door is removed after marking complete", async () => {

  				await user.click(screen.getByTestId("externalUnglazed_remove_0"));
  				await user.click(screen.getByTestId("externalGlazed_remove_0"));
  				await user.click(screen.getByTestId("internal_remove_0"));
  				const {
  					dwellingSpaceExternalGlazedDoor,
  					dwellingSpaceExternalUnglazedDoor,
  					dwellingSpaceInternalDoor,
  				} = store.dwellingFabric.dwellingSpaceDoors;

  				expect(dwellingSpaceExternalUnglazedDoor?.complete).toBe(false);
  				expect(dwellingSpaceExternalGlazedDoor?.complete).toBe(false);
  				expect(dwellingSpaceInternalDoor?.complete).toBe(false);
  			});

  			it("marks section as not complete if a door is duplicated after marking complete", async () => {
  				await user.click(screen.getByTestId("externalUnglazed_duplicate_0"));
  				await user.click(screen.getByTestId("externalGlazed_duplicate_0"));
  				await user.click(screen.getByTestId("internal_duplicate_0"));
				
  				const {
  					dwellingSpaceExternalGlazedDoor,
  					dwellingSpaceExternalUnglazedDoor,
  					dwellingSpaceInternalDoor,
  				} = store.dwellingFabric.dwellingSpaceDoors;

  				expect(dwellingSpaceExternalUnglazedDoor?.complete).toBe(false);
  				expect(dwellingSpaceExternalGlazedDoor?.complete).toBe(false);
  				expect(dwellingSpaceInternalDoor?.complete).toBe(false);
			
  			});

  			it("marks section as not complete after adding a new door item", async () => {
  				for (const door of Object.keys(
  					store.dwellingFabric.dwellingSpaceDoors,
  				) as DoorType[]) {
  					await renderSuspended(doorForms[door], {
  						route: {
  							params: { door: "create" },
  						},
  					});

  					if (door === "dwellingSpaceInternalDoor") {
  						await user.click(screen.getByTestId("typeOfInternalDoor_heatedSpace"));
  					}

  					await user.type(screen.getByTestId("name"), "New door");
  					await user.tab();
  					await user.click(screen.getByTestId("saveAndComplete"));

  					expect(store.dwellingFabric.dwellingSpaceDoors[door]?.complete).toBe(
  						false,
  					);
  				}
  			});

  			it("marks section as not complete after editing a door item", async () => {
  				for (const door of Object.keys(
  					store.dwellingFabric.dwellingSpaceDoors,
  				) as DoorType[]) {
  					await renderSuspended(doorForms[door], {
  						route: {
  							params: { door: "0" },
  						},
  					});

  					await user.clear(screen.getByTestId("name"));
  					await user.type(screen.getByTestId("name"), "Updated door");
  					await user.tab();

  					expect(
  						store.dwellingFabric.dwellingSpaceDoors[door]?.complete,
  					).toBe(false);
  					await renderSuspended(Doors);
  					expect(
  						screen.getByRole("button", { name: "Mark section as complete" }),
  					).not.toBeNull();
  				}
  			});

  			// skipped test as appears behaviour of button here is in flux
  			it.skip("disables the mark section as complete button when item is incomplete", async () => {
  				store.$patch({
  					dwellingFabric: {
  						dwellingSpaceDoors: {
  							dwellingSpaceExternalGlazedDoor: {
  								data: [{ data: { height: 2 }, complete: false }],
  							},
  						},
  					},
  				});

  				await renderSuspended(Doors);
  				const markAsCompleteButton = screen.getByRole("button", {
  					name: "Mark section as complete",
  				});
  				expect(markAsCompleteButton.hasAttribute("disabled")).toBeTruthy();
  			});

  			test("an in-progress indicator is shown when an entry is not marked as complete", async () => {
  				store.$patch({
  					dwellingFabric: {
  						dwellingSpaceDoors: {
  							dwellingSpaceExternalGlazedDoor: {
  								data: [externalGlazed1],
  								complete: false,
  							},
  						},
  					},
  				});

  				await renderSuspended(Doors);

  				expect(screen.getByTestId("externalGlazed_status_0").textContent).toBe(
  					formStatus.inProgress.text,
  				);
  			});
  		});
	});
});
