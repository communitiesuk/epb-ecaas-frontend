import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import ExternalUnglazedDoor from "./[door].vue";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("external unglazed door", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

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

	const state: EcaasForm<ExternalUnglazedDoorData> = {
		data: {
			name: "External unglazed door 1",
			associatedItemId: externalWall.id,
			height: 0.5,
			width: 20,
			elevationalHeight: 20,
			colour: "Intermediate",
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
			thermalResistance: 24,
		},
	};

	afterEach(() => {
		store.$reset();
	});

	describe("without existing external wall or roof", () => {
		test("links to add walls and roofs are not displayed", async () => {
			await renderSuspended(ExternalUnglazedDoor, {
				route: {
					params: { externalUnglazed: "create" },
				},
			});

			expect(screen.queryByText("No walls or roofs added.")).toBeNull();
			// expect(screen.getByRole<HTMLAnchorElement>("link", { name: "Click here to add walls" }).href)
			// 	.toContain("/dwelling-fabric/walls");
			// expect(screen.getByRole<HTMLAnchorElement>("link", { name: "Click here to add roofs" }).href)
			// 	.toContain("/dwelling-fabric/ceilings-and-roofs");
		});

		test("Should not render associated ID element", async () => {
			await renderSuspended(ExternalUnglazedDoor, {
				route: {
					params: { externalUnglazed: "create" },
				},
			});

			expect(screen.queryByTestId("associatedItemId")).toBeNull();
		});

		test("shows pitch element", async () => {
			await renderSuspended(ExternalUnglazedDoor, {
				route: {
					params: { externalUnglazed: "create" },
				},
			});
		
			expect(screen.getByTestId("pitch")).toBeDefined();
		});
		
		it("shows orientation when pitch is not 0 or 180", async () => {
			await renderSuspended(ExternalUnglazedDoor, {
				route: {
					params: { externalUnglazed: "create" },
				},
			});
			expect(screen.queryByTestId("orientation")).toBeNull();
			await user.type(screen.getByTestId("pitch"), "90");
			await user.tab();
			expect(screen.getByTestId("orientation")).toBeDefined();
		});
		
		test("requires pitch and orientation", async () => {
			await renderSuspended(ExternalUnglazedDoor, {
				route: {
					params: { externalUnglazed: "create" },
				},
			});
		
		
			await user.click(screen.getByTestId("saveAndComplete"));
		
			expect(await screen.findByTestId("pitch_error")).toBeDefined();
		
			expect(screen.queryByTestId("orientation_error")).toBeNull();
		
		
			await user.type(screen.getByTestId("name"), "Window 1");
			await user.type(screen.getByTestId("pitch"), "90");
			await user.tab();
		
			await user.click(screen.getByTestId("saveAndComplete"));
		
			expect(await screen.findByTestId("orientation_error")).toBeDefined();
		
			await user.clear(screen.getByTestId("pitch"));
			await user.type(screen.getByTestId("pitch"), "0");
			await user.tab();
		
			expect(screen.queryByTestId("orientation")).toBeNull();
			await user.click(screen.getByTestId("saveAndComplete"));
			expect(screen.queryByTestId("orientation_error")).toBeNull();
		
			await user.clear(screen.getByTestId("pitch"));
			await user.type(screen.getByTestId("pitch"), "180");
			await user.tab();
		
		
			expect(screen.queryByTestId("orientation")).toBeNull();
		
			await user.click(screen.getByTestId("saveAndComplete"));
			expect(screen.queryByTestId("orientation_error")).toBeNull();
		});
	});

	describe("with existing external wall", () => {
		beforeEach(() => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceExternalWall: {
							data: [{ data: externalWall, complete: true }],
						},
					},
				},
			});
		});

		test("Associated wall/roof question has none of the above option", async () => {
			await renderSuspended(ExternalUnglazedDoor, {
				route: {
					params: { externalUnglazed: "create" },
				},
			});

			expect(screen.getByTestId("associatedItemId_none")).toBeDefined();
		});

		test("does not require pitch and orientation when existing wall is selected", async () => {
			await renderSuspended(ExternalUnglazedDoor, {
				route: {
					params: { externalUnglazed: "create" },
				},
			});
		
		
			expect(screen.queryByTestId("pitch")).toBeNull();
			expect(screen.queryByTestId("orientation")).toBeNull();
		
			await user.click(screen.getByTestId("saveAndComplete"));
		
			expect(screen.queryByTestId("pitch_error")).toBeNull();
			expect(screen.queryByTestId("orientation_error")).toBeNull();
		
		
			expect(await screen.findByTestId("associatedItemId_error")).toBeDefined();
		});
		
		describe("when none of the above is selected for associated item ID", () => {
			test("shows pitch element", async () => {
				await renderSuspended(ExternalUnglazedDoor, {
					route: {
						params: { externalUnglazed: "create" },
					},
				});
		
				await user.click(screen.getByTestId("associatedItemId_none"));
		
				expect(screen.getByTestId("pitch")).toBeDefined();
			});
		
			it("shows orientation when pitch is not 0 or 180", async () => {
				await renderSuspended(ExternalUnglazedDoor, {
					route: {
						params: { externalUnglazed: "create" },
					},
				});
		
				await user.click(screen.getByTestId("associatedItemId_none"));
		
				expect(screen.queryByTestId("orientation")).toBeNull();
				await user.type(screen.getByTestId("pitch"), "90");
				await user.tab();
				expect(screen.getByTestId("orientation")).toBeDefined();
			});
		
			test("requires pitch and orientation", async () => {
				await renderSuspended(ExternalUnglazedDoor, {
					route: {
						params: { externalUnglazed: "create" },
					},
				});
		
				await user.click(screen.getByTestId("associatedItemId_none"));
		
				await user.click(screen.getByTestId("saveAndComplete"));
		
				expect(await screen.findByTestId("pitch_error")).toBeDefined();
		
				expect(screen.queryByTestId("orientation_error")).toBeNull();
		
		
				await user.type(screen.getByTestId("name"), "Window 1");
				await user.type(screen.getByTestId("pitch"), "90");
				await user.tab();
		
				await user.click(screen.getByTestId("saveAndComplete"));
		
				expect(await screen.findByTestId("orientation_error")).toBeDefined();
		
				await user.clear(screen.getByTestId("pitch"));
				await user.type(screen.getByTestId("pitch"), "0");
				await user.tab();
		
				expect(screen.queryByTestId("orientation")).toBeNull();
				await user.click(screen.getByTestId("saveAndComplete"));
				expect(screen.queryByTestId("orientation_error")).toBeNull();
		
				await user.clear(screen.getByTestId("pitch"));
				await user.type(screen.getByTestId("pitch"), "180");
				await user.tab();
		
		
				expect(screen.queryByTestId("orientation")).toBeNull();
		
				await user.click(screen.getByTestId("saveAndComplete"));
				expect(screen.queryByTestId("orientation_error")).toBeNull();
			});
		});

		test("data is saved to store state when form is valid", async () => {
			await renderSuspended(ExternalUnglazedDoor, {
				route: {
					params: { externalUnglazed: "create" },
				},
			});

			await user.type(screen.getByTestId("name"), "External unglazed door 1");
			await user.click(screen.getByTestId(`associatedItemId_${externalWall.id}`));
			await user.type(screen.getByTestId("height"), "0.5");
			await user.type(screen.getByTestId("width"), "20"); 
			await user.type(screen.getByTestId("elevationalHeight"), "20");
			await user.type(screen.getByTestId("thermalResistance"), "24");
			await user.click(screen.getByTestId("colour_Intermediate"));
			await user.click(screen.getByTestId("arealHeatCapacity_Very_light"));
			await user.click(screen.getByTestId("massDistributionClass_I"));

			await user.click(screen.getByTestId("saveAndComplete"));

			const { data = [] } = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor || {};
		
			expect(data[0]).toEqual({ ...state, complete: true });
			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/doors");
		});

		test("navigates to doors page when save progress button is clicked", async () => {
			await renderSuspended(ExternalUnglazedDoor);

			await user.type(screen.getByTestId("name"), "Test door");
			await user.tab();
			await user.click(screen.getByTestId("saveProgress"));

			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/doors");
		});

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalUnglazedDoor: {
							data: [state],
						},
					},
				},
			});

			await renderSuspended(ExternalUnglazedDoor, {
				route: {
					params: { door: "0" },
				},
			});

			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("External unglazed door 1");
			expect((await screen.findByTestId(`associatedItemId_${externalWall.id}`)).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("height")).value).toBe("0.5");
			expect((await screen.findByTestId<HTMLInputElement>("width")).value).toBe("20");
			expect((await screen.findByTestId<HTMLInputElement>("elevationalHeight")).value).toBe("20");
			expect((await screen.findByTestId<HTMLInputElement>("thermalResistance")).value).toBe("24");
			expect((await screen.findByTestId("colour_Intermediate")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId("arealHeatCapacity_Very_light")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId("massDistributionClass_I")).hasAttribute("checked")).toBe(true);
		});
		
		test("required error messages are displayed when empty form is submitted", async () => {
			await renderSuspended(ExternalUnglazedDoor);

			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("name_error"))).toBeDefined();
			expect((await screen.findByTestId("associatedItemId_error"))).toBeDefined();
			expect((await screen.findByTestId("height_error"))).toBeDefined();
			expect((await screen.findByTestId("width_error"))).toBeDefined();
			expect((await screen.findByTestId("elevationalHeight_error"))).toBeDefined();
			expect((await screen.findByTestId("thermalResistance_error"))).toBeDefined();
			expect((await screen.findByTestId("colour_error"))).toBeDefined();
			expect((await screen.findByTestId("arealHeatCapacity_error"))).toBeDefined();
			expect((await screen.findByTestId("massDistributionClass_error"))).toBeDefined();

		});

		test("error summary is displayed when an invalid form in submitted", async () => {
			await renderSuspended(ExternalUnglazedDoor);

			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("externalUnglazedDoorErrorSummary"))).toBeDefined();
		});

		describe("partially saving data", () => {
			it("creates a new door automatically with given name", async () => {
				await renderSuspended(ExternalUnglazedDoor, {
					route: {
						params: { externalUnglazed: "create" },
					},
				});

				await user.type(screen.getByTestId("name"), "New door");
				await user.tab();

				const actualDoor = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor.data[0]!;
				expect(actualDoor.data.name).toBe("New door");
				expect(actualDoor.data.height).toBeUndefined();
				expect(actualDoor.data.arealHeatCapacity).toBeUndefined();
			});

			it("creates a new door automatically with default name after other data is entered", async () => {
				await renderSuspended(ExternalUnglazedDoor, {
					route: {
						params: { externalUnglazed: "create" },
					},
				});

				await user.type(screen.getByTestId("elevationalHeight"), "7");
				await user.tab();

				const actualDoor = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor.data[0]!;
				expect(actualDoor.data.name).toBe("External unglazed door");
				expect(actualDoor.data.height).toBeUndefined();
				expect(actualDoor.data.width).toBeUndefined();
				expect(actualDoor.data.elevationalHeight).toBe(7);
			});

			it("saves updated form data to correct store object automatically", async () => {
				store.$patch({
					dwellingFabric: {
						dwellingSpaceDoors: {
							dwellingSpaceExternalUnglazedDoor: {
								data: [state, state],
							},
						},
					},
				});

				await renderSuspended(ExternalUnglazedDoor, {
					route: {
						params: { externalUnglazed: "1" },
					},
				});

				await user.clear(screen.getByTestId("name"));
				await user.clear(screen.getByTestId("elevationalHeight"));

				await user.type(screen.getByTestId("name"), "Updated door");
				await user.type(screen.getByTestId("elevationalHeight"), "12");
				await user.tab();

				const actualDoor = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor.data[1]!;
				expect(actualDoor.data.name).toBe("Updated door");
				expect(actualDoor.data.elevationalHeight).toBe(12);
			});

			test("external unglazed door and section are set as 'not complete' after user edits an item", async () => {
				store.$patch({
					dwellingFabric: {
						dwellingSpaceDoors: {
							dwellingSpaceExternalUnglazedDoor: {
								data: [{ ...state, complete: true }],
								complete: true,
							},
						},
					},
				});

				await renderSuspended(ExternalUnglazedDoor, {
					route: {
						params: { externalUnglazed: "0" },
					},
				});

				await user.type(screen.getByTestId("name"), "Door");
				await user.tab();

				const externalUnglazedDoors = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor;

				expect(externalUnglazedDoors.data[0]!.complete).not.toBe(true);
				expect(externalUnglazedDoors.complete).not.toBe(true);
			});
		});
	});
});