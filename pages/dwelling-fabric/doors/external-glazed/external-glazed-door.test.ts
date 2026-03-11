import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import ExternalGlazedDoor from "./[door].vue";

const navigateToMock = vi.hoisted(() => vi.fn());
const store = useEcaasStore();
const user = userEvent.setup();

mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

afterEach(() => {
	store.$reset();
	navigateToMock.mockReset();
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
	thermalResistance: 1,
	colour: "Intermediate",
	arealHeatCapacity: "Very light",
	massDistributionClass: "I",
};

const doorForState = {
	name: "External glazed door 1",
	isTheFrontDoor: false,
	associatedItemId: externalWall.id,
	height: 14,
	width: 48,
	securityRisk: false,
	solarTransmittance: 0.1,
	elevationalHeight: 14,
	openingToFrameRatio: 0.2,
	heightOpenableArea: 14,
	maximumOpenableArea: 13,
	midHeightOpenablePart1: 11,
	thermalResistance: 16,
	numberOpenableParts: "1",
	curtainsOrBlinds: true,
	treatmentType: "blinds",
	thermalResistivityIncrease: 1,
	solarTransmittanceReduction: 0.1,
	hasShading: false,
} as const satisfies ExternalGlazedDoorData;

const populateValidForm = async ({ hasShading = false } = {}) => {
	await user.type(screen.getByTestId("name"), "External glazed door 1");
	await user.click(screen.getByTestId(`associatedItemId_${externalWall.id}`));
	await user.click(screen.getByTestId(`isTheFrontDoor_no`));
	await user.type(screen.getByTestId("height"), "14");
	await user.type(screen.getByTestId("width"), "48");
	await user.type(screen.getByTestId("maximumOpenableArea"), "13");
	await user.type(screen.getByTestId("thermalResistance"), "16");
	await user.click(screen.getByTestId("securityRisk_no"));
	await user.type(screen.getByTestId("solarTransmittance"), "0.1");
	await user.type(screen.getByTestId("elevationalHeight"), "14");
	await user.click(screen.getByTestId("numberOpenableParts_1"));
	await user.type(screen.getByTestId("midHeightOpenablePart1"), "11");
	await user.type(screen.getByTestId("openingToFrameRatio"), "0.2");
	await user.click(screen.getByTestId("curtainsOrBlinds_yes"));
	await user.click(screen.getByTestId("treatmentType_blinds"));
	await user.type(screen.getByTestId("thermalResistivityIncrease"), "1");
	await user.type(screen.getByTestId("solarTransmittanceReduction"), "0.1");
	await user.click(screen.getByTestId(`hasShading_${hasShading ? "yes" : "no"}`));
};

describe("external glazed door", () => {
	const state: EcaasForm<ExternalGlazedDoorData> = {
		data: doorForState,
	};

	describe("without existing external wall or roof", () => {

		beforeEach(async () => {
			await renderSuspended(ExternalGlazedDoor, {
				route: {
					params: { externalGlazed: "create" },
				},
			});
		});

		test("links to add walls and roofs are not displayed", async () => {

			expect(screen.queryByText("No walls or roofs added.")).toBeNull();
			// expect(screen.getByRole<HTMLAnchorElement>("link", { name: "Click here to add walls" }).href)
			// 	.toContain("/dwelling-fabric/walls");
			// expect(screen.getByRole<HTMLAnchorElement>("link", { name: "Click here to add roofs" }).href)
			// 	.toContain("/dwelling-fabric/ceilings-and-roofs");
		});

		test("Should not render assiciated ID element", async () => {

			expect(screen.queryByTestId("associatedItemId")).toBeNull();
		});

		test("shows pitch element", async () => {

			expect(screen.getByTestId("pitchOption")).toBeDefined();
		});

		it("shows orientation when pitch is not 0 or 180", async () => {

			expect(screen.queryByTestId("orientation")).toBeNull();
			await user.click(screen.getByTestId("pitchOption_90"));
			await user.tab();
			expect(screen.getByTestId("orientation")).toBeDefined();
		});

		test("requires pitch and orientation", async () => {

			await user.click(screen.getByTestId("saveAndComplete"));

			expect(await screen.findByTestId("pitchOption_error")).toBeDefined();

			expect(screen.queryByTestId("orientation_error")).toBeNull();


			await user.type(screen.getByTestId("name"), "Window 1");
			await user.click(screen.getByTestId("pitchOption_90"));
			await user.tab();

			await user.click(screen.getByTestId("saveAndComplete"));

			expect(await screen.findByTestId("orientation_error")).toBeDefined();

			await user.click(screen.getByTestId("pitchOption_custom"));
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
		beforeEach(async () => {
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
			await renderSuspended(ExternalGlazedDoor, {
				route: {
					params: { externalGlazed: "create" },
				},
			});

			expect(screen.getByTestId("associatedItemId_none")).toBeDefined();
		});

		test("does not require pitch and orientation when existing wall is selected", async () => {
			await renderSuspended(ExternalGlazedDoor, {
				route: {
					params: { externalGlazed: "create" },
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
				await renderSuspended(ExternalGlazedDoor, {
					route: {
						params: { externalGlazed: "create" },
					},
				});

				await user.click(screen.getByTestId("associatedItemId_none"));

				expect(screen.getByTestId("pitchOption")).toBeDefined();
			});

			it("shows orientation when pitch is not 0 or 180", async () => {
				await renderSuspended(ExternalGlazedDoor, {
					route: {
						params: { externalGlazed: "create" },
					},
				});

				await user.click(screen.getByTestId("associatedItemId_none"));

				expect(screen.queryByTestId("orientation")).toBeNull();
				await user.click(screen.getByTestId("pitchOption_90"));
				await user.tab();
				expect(screen.getByTestId("orientation")).toBeDefined();
			});

			test("requires pitch and orientation", async () => {
				await renderSuspended(ExternalGlazedDoor, {
					route: {
						params: { externalGlazed: "create" },
					},
				});

				await user.click(screen.getByTestId("associatedItemId_none"));

				await user.click(screen.getByTestId("saveAndComplete"));

				expect(await screen.findByTestId("pitchOption_error")).toBeDefined();

				expect(screen.queryByTestId("orientation_error")).toBeNull();


				await user.type(screen.getByTestId("name"), "Window 1");

				await user.click(screen.getByTestId("pitchOption_90"));
				await user.tab();

				await user.click(screen.getByTestId("saveAndComplete"));

				expect(await screen.findByTestId("orientation_error")).toBeDefined();

				await user.click(screen.getByTestId("pitchOption_custom"));
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
			await renderSuspended(ExternalGlazedDoor, {
				route: {
					params: { externalGlazed: "create" },
				},
			});

			await populateValidForm();
			await user.tab();

			await user.click(screen.getByTestId("saveAndComplete"));

			const { data = [] } = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor || {};

			expect(data[0]).toEqual({ ...state, complete: true });
			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/doors");
		});

		test("navigates to doors page when save progress button is clicked", async () => {
			await renderSuspended(ExternalGlazedDoor);

			await user.type(screen.getByTestId("name"), "Test door");
			await user.click(screen.getByTestId("saveProgress"));

			expect(screen.getByTestId<HTMLAnchorElement>("saveProgress").href).toContain("/dwelling-fabric/doors");
		});

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalGlazedDoor: {
							data: [state],
						},
					},
				},
			});

			await renderSuspended(ExternalGlazedDoor, {
				route: {
					params: { door: "0" },
				},
			});

			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("External glazed door 1");
			expect((await screen.findByTestId(`associatedItemId_${externalWall.id}`)).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("height")).value).toBe("14");
			expect((await screen.findByTestId<HTMLInputElement>("width")).value).toBe("48");
			expect((await screen.findByTestId<HTMLInputElement>("elevationalHeight")).value).toBe("14");
			expect((await screen.findByTestId<HTMLInputElement>("thermalResistance")).value).toBe("16");
			expect((await screen.findByTestId<HTMLInputElement>("openingToFrameRatio")).value).toBe("0.2");
			expect((await screen.findByTestId<HTMLInputElement>("solarTransmittance")).value).toBe("0.1");
			expect((await screen.findByTestId("numberOpenableParts_1")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId("securityRisk_no")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("maximumOpenableArea")).value).toBe("13");
			expect((await screen.findByTestId<HTMLInputElement>("midHeightOpenablePart1")).value).toBe("11");
			expect((await screen.findByTestId("hasShading")).hasAttribute("checked")).toBe(false);
			expect((await screen.findByTestId("treatmentType_blinds")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("thermalResistivityIncrease")).value).toBe("1");
			expect((await screen.findByTestId<HTMLInputElement>("solarTransmittanceReduction")).value).toBe("0.1");
		});

		test("form is prepopulated with none of the above associated wall, as well as pitch and orientation when there is no tagged item", async () => {
			const doorNoTag = {
				name: "External glazed door 1",
				isTheFrontDoor: false,
				pitchOption: "custom",
				pitch: 72,
				orientation: 24,
				height: 14,
				width: 48,
				securityRisk: false,
				solarTransmittance: 0.1,
				elevationalHeight: 14,
				openingToFrameRatio: 0.2,
				heightOpenableArea: 14,
				maximumOpenableArea: 13,
				midHeightOpenablePart1: 11,
				thermalResistance: 16,
				numberOpenableParts: "1",
				curtainsOrBlinds: true,
				treatmentType: "blinds",
				thermalResistivityIncrease: 1,
				solarTransmittanceReduction: 0.1,
				hasShading: false,
			} as const satisfies ExternalGlazedDoorData;

			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalGlazedDoor: {
							data: [{ data: doorNoTag }],
						},
					},
				},
			});

			await renderSuspended(ExternalGlazedDoor, {
				route: {
					params: { door: "0" },
				},
			});

			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("External glazed door 1");
			expect((await screen.findByTestId(`associatedItemId_none`)).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("pitch")).value).toBe("72");
			expect((await screen.findByTestId<HTMLInputElement>("orientation")).value).toBe("24");
		});

		test("requires further data when four openable parts option is selected", async () => {
			await renderSuspended(ExternalGlazedDoor, {
				route: {
					params: { door: "create" },
				},
			});

			await user.click(screen.getByTestId("numberOpenableParts_4"));
			await (user.click(screen.getByTestId("saveAndComplete")));

			expect((await screen.findByTestId("openingToFrameRatio_error"))).toBeDefined();
			expect((await screen.findByTestId("maximumOpenableArea_error"))).toBeDefined();
			expect((await screen.findByTestId("midHeightOpenablePart1_error"))).toBeDefined();
			expect((await screen.findByTestId("midHeightOpenablePart2_error"))).toBeDefined();
			expect((await screen.findByTestId("midHeightOpenablePart3_error"))).toBeDefined();
			expect((await screen.findByTestId("midHeightOpenablePart4_error"))).toBeDefined();
		});

		test("does not require the mid height of more parts than have been selected", async () => {
			await renderSuspended(ExternalGlazedDoor, {
				route: {
					params: { door: "create" },
				},
			});

			await user.click(screen.getByTestId("numberOpenableParts_1"));
			await (user.click(screen.getByTestId("saveAndComplete")));

			expect((await screen.findByTestId("midHeightOpenablePart1_error"))).toBeDefined();
			expect((screen.queryByTestId("midHeightOpenablePart2_error"))).toBeNull();
			expect((screen.queryByTestId("midHeightOpenablePart3_error"))).toBeNull();
			expect((screen.queryByTestId("midHeightOpenablePart4_error"))).toBeNull();
		});

		test("only required error messages are displayed when empty form is submitted", async () => {
			await renderSuspended(ExternalGlazedDoor);

			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("name_error"))).toBeDefined();
			expect((await screen.findByTestId("isTheFrontDoor_error"))).toBeDefined();
			expect((await screen.findByTestId("associatedItemId_error"))).toBeDefined();
			expect((await screen.findByTestId("height_error"))).toBeDefined();
			expect((await screen.findByTestId("width_error"))).toBeDefined();
			expect((await screen.findByTestId("thermalResistance_error"))).toBeDefined();
			expect((await screen.findByTestId("solarTransmittance_error"))).toBeDefined();
			expect((await screen.findByTestId("elevationalHeight_error"))).toBeDefined();
			expect((await screen.findByTestId("securityRisk_error"))).toBeDefined();
			expect((await screen.findByTestId("openingToFrameRatio_error"))).toBeDefined();
			expect((await screen.findByTestId("maximumOpenableArea_error"))).toBeDefined();
			expect((await screen.findByTestId("numberOpenableParts_error"))).toBeDefined();
			expect((await screen.findByTestId("curtainsOrBlinds_error"))).toBeDefined();
			expect((await screen.findByTestId("hasShading_error"))).toBeDefined();
		});

		test("error summary is displayed when an invalid form in submitted", async () => {
			await renderSuspended(ExternalGlazedDoor);

			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("externalGlazedDoorErrorSummary"))).toBeDefined();
		});

		describe("partially saving data", () => {
			it("creates a new door automatically with given name", async () => {
				await renderSuspended(ExternalGlazedDoor, {
					route: {
						params: { externalGlazed: "create" },
					},
				});

				await user.type(screen.getByTestId("name"), "New door");
				await user.tab();

				const actualDoor = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.data[0]!;
				expect(actualDoor.data.name).toBe("New door");
				expect(actualDoor.data.height).toBeUndefined();
			});

			it("creates a new door automatically with default name after other data is entered", async () => {
				await renderSuspended(ExternalGlazedDoor, {
					route: {
						params: { externalGlazed: "create" },
					},
				});

				await user.type(screen.getByTestId("elevationalHeight"), "7");
				await user.tab();

				const actualDoor = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.data[0]!;
				expect(actualDoor.data.name).toBe("External glazed door");
				expect(actualDoor.data.height).toBeUndefined();
				expect(actualDoor.data.width).toBeUndefined();
				expect(actualDoor.data.elevationalHeight).toBe(7);
			});

			it("saves updated form data to correct store object automatically", async () => {
				store.$patch({
					dwellingFabric: {
						dwellingSpaceDoors: {
							dwellingSpaceExternalGlazedDoor: {
								data: [state, state],
							},
						},
					},
				});

				await renderSuspended(ExternalGlazedDoor, {
					route: {
						params: { externalGlazed: "1" },
					},
				});

				await user.clear(screen.getByTestId("name"));
				await user.clear(screen.getByTestId("elevationalHeight"));

				await user.type(screen.getByTestId("name"), "Updated door");
				await user.type(screen.getByTestId("elevationalHeight"), "12");
				await user.tab();

				const actualDoor = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.data[1]!;
				expect(actualDoor.data.name).toBe("Updated door");
				expect(actualDoor.data.elevationalHeight).toBe(12);
			});

			test("external glazed door and section are set as 'not complete' after user edits an item", async () => {
				store.$patch({
					dwellingFabric: {
						dwellingSpaceDoors: {
							dwellingSpaceExternalGlazedDoor: {
								data: [{ ...state, complete: true }],
								complete: true,
							},
						},
					},
				});

				await renderSuspended(ExternalGlazedDoor, {
					route: {
						params: { externalGlazed: "0" },
					},
				});

				await user.type(screen.getByTestId("name"), "Door");
				await user.tab();

				const externalGlazedDoors = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor;

				expect(externalGlazedDoors.data[0]!.complete).not.toBe(true);
				expect(externalGlazedDoors.complete).not.toBe(true);
			});
		});
	});

	describe("Handing external glazed door as a front door", () => {
		
		test("displays error when user tries to mark the door as the front door but they have already marked another as the front door", async () => {
			const frontDoor: Partial<ExternalGlazedDoorData> = {
				name: "Front door",
				isTheFrontDoor: true,
			};
			
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalGlazedDoor: {
							data: [{ data: frontDoor }],
						},
					},
				},
			});

			await renderSuspended(ExternalGlazedDoor, {
				route: {
					params: { externalGlazed: "create" },
				},
			});

			await user.click(screen.getByTestId(`isTheFrontDoor_yes`));
			await user.tab();
			await (user.click(screen.getByTestId("saveAndComplete")));

			const error = screen.findByTestId("isTheFrontDoor_error");
			expect(error).toBeDefined();
			expect(
				(await error).innerText.includes("Another door has already been marked as the front door. Please change that entry if you wish to mark this door as the front door instead."),
			).toBe(true);
		});

		test("does not display the 'Is this the front door?' element if an associated item is a flat roof (has no orientation)", async () => {

			const roof: EcaasForm<RoofData> = {
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
					thermalResistance: 1,
					colour: "Dark",
					arealHeatCapacity: "Very light",
					massDistributionClass: "I",
				},
			};
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceRoofs: {
							data: [roof],
						},
					},
				},
			});

			await renderSuspended(ExternalGlazedDoor, {
				route: {
					params: { externalGlazed: "create" },
				},
			});
			await user.click(screen.getByTestId(`associatedItemId_${roof.data.id}`));
			expect(screen.queryByTestId("isTheFrontDoor")).toBeNull();
		});

		
		const externalWallPitch0: Partial<ExternalWallData> = {
			id: "80fd1ffe-a83a-4d95-bd2c-ad8fdc37b421",
			name: "External wall",
			pitchOption: "custom",
			pitch: 0,
		};
							
		const externalWallPitch180: Partial<ExternalWallData> = {
			id: "80fd1ffe-a83a-4d95-bd2c-ad8fdc37b421",
			name: "External wall",
			pitchOption: "custom",
			pitch: 180,
		};

		it.each([[0, externalWallPitch0], [180, externalWallPitch180]])("does not display the 'Is this the front door?' element if pitch of tagged item is %s", async (pitch, externalWall) => {
			
			const door: Partial<ExternalGlazedDoorData> = {
				name: "External glazed door 1",
				associatedItemId: externalWall.id,
			};

			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceExternalWall: {
							data: [{ data: externalWall }],
						},
					},
					dwellingSpaceDoors: {
						dwellingSpaceExternalGlazedDoor: {
							data: [{ data: door }],
						},
					}, 
				},
			});

			await renderSuspended(ExternalGlazedDoor, {
				route: {
					params: { door: "0" },
				},
			});
				
			expect(screen.queryByTestId("isTheFrontDoor")).toBeNull();
		});

		test("does not display the 'Is this the front door?' element if pitch is 0 or 180 because orientation is not asked for", async () => {
		
			await renderSuspended(ExternalGlazedDoor, {
				route: {
					params: { door: "create" },
				},
			});
		
			await user.click(screen.getByTestId("pitchOption_custom"));
			await user.type(screen.getByTestId("pitch"), "0");
			await user.tab();
			expect(screen.queryByTestId("isTheFrontDoor")).toBeNull();
		
			await user.clear(screen.getByTestId("pitch"));
			await user.type(screen.getByTestId("pitch"), "180");
			await user.tab();
			expect(screen.queryByTestId("isTheFrontDoor")).toBeNull();
		});

		test("displays banner when banner type is set to 'update-front-door", async () => {
			
			vi.mock("~/composables/banner", () => ({
				useBanner: () => ref({ type: "update-front-door" }),
			}));
			
			await renderSuspended(ExternalGlazedDoor, {
				route: {
					params: { door: "create" },
				},
			});
		
			expect(screen.getByTestId("doorBanner")).not.toBeNull();
		});
	});

	describe("shading section", () => {
		// helper that adds a shading object so we can work with it below
		const saveFirstShadingObject = async (name = "Chimney") => {
			await user.click(screen.getByTestId("hasShading_yes"));
			await user.type(screen.getByTestId(`shadingName`), name);
			await user.click(screen.getByTestId("typeOfShading_obstacle"));
			await user.type(screen.getByTestId("shadingHeight"), "3");
			await user.type(screen.getByTestId("shadingDistance"), "2");
			await user.type(screen.getByTestId("shadingTransparency"), "0.5");
			await user.tab();
			await user.click(screen.getByTestId("saveShadingObject"));
		};
	
		it("initial add form has no cancel button", async () => {
			await renderSuspended(ExternalGlazedDoor);
			await user.click(screen.getByTestId("hasShading_yes"));
			expect(screen.getByTestId("shading-add-form")).toBeDefined();
			expect(screen.queryByTestId("cancelShadingObject")).toBeNull();
		});
	
		const egdWithShading: EcaasForm<ExternalGlazedDoorData> = {
			complete: true,
			data: {
				...doorForState,
				hasShading: true,
				shading: [
					{
						name: "Chimney",
						typeOfShading: "obstacle",
						height: 3,
						distance: 2,
						transparency: 0.5,
					},
				],
			},
		};
	
		const egdWithTwoShadingItems: EcaasForm<ExternalGlazedDoorData> = {
			complete: true,
			data: {
				...doorForState,
				hasShading: true,
				shading: [
					{
						name: "Chimney",
						typeOfShading: "obstacle",
						height: 3,
						distance: 2,
						transparency: 0.5,
					},
					{
						name: "Left fin",
						typeOfShading: "left_side_fin",
						depth: 1,
						distance: 0.5,
					},
				],
			},
		};
	
		it("should not render by default", async () => {
			await renderSuspended(ExternalGlazedDoor);
			expect(screen.queryByTestId("shading-section")).toBeNull();
		});
	
		it("should render when user selects that the array has shading", async () => {
			await renderSuspended(ExternalGlazedDoor);
			await user.click(screen.getByTestId("hasShading_yes"));
			expect(screen.getByTestId("shading-section")).toBeDefined();
		});
	
		it("errors on outer submit if shading is yes but no object added", async () => {
			await renderSuspended(ExternalGlazedDoor, {
				route: { params: { array: "create" } },
			});
			await user.click(screen.getByTestId("hasShading_yes"));
			await user.click(screen.getByTestId("saveAndComplete"));
			expect(screen.getByTestId("shadingName_error")).toBeDefined();
	
			expect(screen.queryByTestId("cancelShadingObject")).toBeNull();
		});
	
		it("hides the shading section when hasShading is changed back to no", async () => {
			await renderSuspended(ExternalGlazedDoor);
			await user.click(screen.getByTestId("hasShading_yes"));
			await user.click(screen.getByTestId("hasShading_no"));
			expect(screen.queryByTestId("shading-section")).toBeNull();
		});
	
		describe("type-conditional fields", () => {
			beforeEach(async () => {
				await renderSuspended(ExternalGlazedDoor);
				await user.click(screen.getByTestId("hasShading_yes"));
			});
	
			it("shows height, distance and transparency when obstacle type is selected", async () => {
				await user.click(screen.getByTestId("typeOfShading_obstacle"));
				expect(screen.getByTestId("shadingHeight")).toBeDefined();
				expect(screen.getByTestId("shadingDistance")).toBeDefined();
				expect(screen.getByTestId("shadingTransparency")).toBeDefined();
				expect(screen.queryByTestId("shadingDepth")).toBeNull();
			});
	
			it.each(["left_side_fin", "right_side_fin", "overhang", "frame_or_reveal"])(
				"shows depth and distance fields for %s type",
				async (type) => {
					await user.click(screen.getByTestId(`typeOfShading_${type}`));
					expect(screen.getByTestId("shadingDepth")).toBeDefined();
					expect(screen.getByTestId("shadingDistance")).toBeDefined();
					expect(screen.queryByTestId("shadingHeight")).toBeNull();
					expect(screen.queryByTestId("shadingTransparency")).toBeNull();
				},
			);
	
			it("hides conditional fields when no type is selected", async () => {
				expect(screen.queryByTestId("shadingHeight")).toBeNull();
				expect(screen.queryByTestId("shadingDepth")).toBeNull();
			});
		});
	
		describe("saving a shading object", () => {
			it("collapses the add form into a summary card with the name as title after saving an obstacle", async () => {
				await renderSuspended(ExternalGlazedDoor);
				await saveFirstShadingObject("Chimney");
				expect(screen.queryByTestId("shading-add-form")).toBeNull();
				expect(screen.getByTestId("shading_summary_0")).toBeDefined();
				expect(screen.getByText("Chimney")).toBeDefined();
			});
	
			it("collapses the add form into a summary card after saving a fin/overhang/frame type", async () => {
				await renderSuspended(ExternalGlazedDoor);
				await user.click(screen.getByTestId("hasShading_yes"));
				await user.type(screen.getByTestId("shadingName"), "Left fin");
				await user.click(screen.getByTestId("typeOfShading_left_side_fin"));
				await user.type(screen.getByTestId("shadingDepth"), "1");
				await user.type(screen.getByTestId("shadingDistance"), "0.5");
				await user.tab();
				await user.click(screen.getByTestId("saveShadingObject"));
				expect(screen.queryByTestId("shading-add-form")).toBeNull();
				expect(screen.getByTestId("shading_summary_0")).toBeDefined();
				expect(screen.getByText("Left fin")).toBeDefined();
			});
	
			it("shows an 'Add another shading object' button after the first item is saved", async () => {
				await renderSuspended(ExternalGlazedDoor);
				await saveFirstShadingObject();
				expect(screen.getByTestId("addAnotherShadingObject")).toBeDefined();
			});
	
			it("saves the shading object to the store", async () => {
				store.$patch({
					dwellingFabric: {
						dwellingSpaceDoors: {
							dwellingSpaceExternalGlazedDoor: {
								data: [
									{
										data: {
											...doorForState,
											hasShading: true,
											shading: [],
										}, 
									},
								],
							},
						},
						dwellingSpaceWalls: {
							dwellingSpaceExternalWall: {
								data: [{ data: externalWall, complete: true }],
							},
						},
					},
				});
				await renderSuspended(ExternalGlazedDoor, {
					route: { params: { door: "0" } },
				});
				await populateValidForm({ hasShading: true });
				await user.type(screen.getByTestId("shadingName"), "Chimney");
				await user.click(screen.getByTestId("typeOfShading_obstacle"));
				await user.type(screen.getByTestId("shadingHeight"), "3");
				await user.type(screen.getByTestId("shadingDistance"), "2");
				await user.type(screen.getByTestId("shadingTransparency"), "0.5");
				await user.tab();
				await user.click(screen.getByTestId("saveShadingObject"));
	
				const door = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.data[0]!;
				expect(door.data.hasShading).toBe(true);
				const { shading } = door.data as Extract<ExternalGlazedDoorData, { hasShading: true }>;
				expect(shading).toHaveLength(1);
				expect(shading[0]).toMatchObject({
					name: "Chimney",
					typeOfShading: "obstacle",
					height: 3,
					distance: 2,
					transparency: 0.5,
				});
			});
	
			it("displays existing shading items when opening a pre-populated array", async () => {
				store.$patch({
					dwellingFabric: {
						dwellingSpaceDoors: { 
							dwellingSpaceExternalGlazedDoor: {
								data: [egdWithShading],
							},
						},
					},
				});
				await renderSuspended(ExternalGlazedDoor, {
					route: { params: { door: "0" } },
				});
				expect(screen.getByTestId("shading_summary_0")).toBeDefined();
				expect(screen.getByText("Chimney")).toBeDefined();
			});
			it("shows errors when fields are invalid in edit form", async () => {
				store.$patch({
					dwellingFabric: {
						dwellingSpaceDoors: { 
							dwellingSpaceExternalGlazedDoor: {
								data: [egdWithShading],
							},
						},
						dwellingSpaceWalls: {
							dwellingSpaceExternalWall: {
								data: [{ data: externalWall, complete: true }],
							},
						},
					},
				});
				await renderSuspended(ExternalGlazedDoor, {
					route: { params: { door: "create" } },
				});
				await populateValidForm({ hasShading: true });
	
				await user.click(screen.getByTestId("typeOfShading_obstacle"));
	
				await user.click(screen.getByTestId("saveShadingObject"));
				expect(screen.getByTestId("shadingName_error")).toBeDefined();
				expect(screen.getByTestId("shadingHeight_error")).toBeDefined();
				expect(screen.getByTestId("shadingDistance_error")).toBeDefined();
				expect(screen.getByTestId("shadingTransparency_error")).toBeDefined();
			});
		});
	
		describe("add another shading object", () => {
			it("opens a new add form with a cancel button when 'Add another' is clicked", async () => {
				await renderSuspended(ExternalGlazedDoor);
				await saveFirstShadingObject();
				await user.click(screen.getByTestId("addAnotherShadingObject"));
				expect(screen.getByTestId("shading-add-form")).toBeDefined();
				expect(screen.getByTestId("cancelShadingObject")).toBeDefined();
			});
	
			it("closes the new add form without removing saved items when cancel is clicked", async () => {
				await renderSuspended(ExternalGlazedDoor);
				await saveFirstShadingObject("Chimney");
				await user.click(screen.getByTestId("addAnotherShadingObject"));
				await user.click(screen.getByTestId("cancelShadingObject"));
				expect(screen.queryByTestId("shading-add-form")).toBeNull();
				expect(screen.getByTestId("shading_summary_0")).toBeDefined();
			});
	
			it("saves a second shading object after clicking add another", async () => {
				await renderSuspended(ExternalGlazedDoor);
				await saveFirstShadingObject("Chimney");
				await user.click(screen.getByTestId("addAnotherShadingObject"));
				await user.type(screen.getByTestId("shadingName"), "Left fin");
				await user.click(screen.getByTestId("typeOfShading_left_side_fin"));
				await user.type(screen.getByTestId("shadingDepth"), "1");
				await user.type(screen.getByTestId("shadingDistance"), "0.5");
				await user.tab();
				await user.click(screen.getByTestId("saveShadingObject"));
				expect(screen.getByTestId("shading_summary_0")).toBeDefined();
				expect(screen.getByTestId("shading_summary_1")).toBeDefined();
				expect(screen.queryByTestId("shading-add-form")).toBeNull();
			});
		});
	
		describe("editing a shading object", () => {
			it("opens an edit form with 'Edit shading' title when edit is clicked", async () => {
				store.$patch({
					dwellingFabric: {
						dwellingSpaceDoors: { 
							dwellingSpaceExternalGlazedDoor: {
								data: [egdWithShading],
							},
						},
					},
				});
				await renderSuspended(ExternalGlazedDoor, {
					route: { params: { door: "0" } },
				});
				await user.click(screen.getByTestId("shading_edit_0"));
				expect(screen.getByText("Edit shading")).toBeDefined();
				expect(screen.getByTestId("shading-add-form")).toBeDefined();
			});
	
			it("prepopulates the edit form with the existing shading data", async () => {
				store.$patch({
					dwellingFabric: {
						dwellingSpaceDoors: { 
							dwellingSpaceExternalGlazedDoor: {
								data: [egdWithShading],
							},
						},
					},
				});
				await renderSuspended(ExternalGlazedDoor, {
					route: { params: { door: "0" } },
				});
				await user.click(screen.getByTestId("shading_edit_0"));
				expect((screen.getByTestId<HTMLInputElement>("shadingName")).value).toBe("Chimney");
				expect((screen.getByTestId<HTMLInputElement>("typeOfShading_obstacle")).checked).toBe(true);
				expect((screen.getByTestId<HTMLInputElement>("shadingHeight")).value).toBe("3");
				expect((screen.getByTestId<HTMLInputElement>("shadingDistance")).value).toBe("2");
				expect((screen.getByTestId<HTMLInputElement>("shadingTransparency")).value).toBe("0.5");
			});
	
			it("updates the summary card when the edited item is saved", async () => {
				store.$patch({
					dwellingFabric: {
						dwellingSpaceDoors: { 
							dwellingSpaceExternalGlazedDoor: {
								data: [egdWithShading],
							},
						},
					},
				});
				await renderSuspended(ExternalGlazedDoor, {
					route: { params: { door: "0" } },
				});
				await user.click(screen.getByTestId("shading_edit_0"));
				await user.clear(screen.getByTestId("shadingName"));
				await user.type(screen.getByTestId("shadingName"), "Big Chimney");
				await user.click(screen.getByTestId("saveShadingObject"));
				expect(screen.queryByTestId("shading-add-form")).toBeNull();
				expect(screen.getByTestId("shading_summary_0")).toBeDefined();
				expect(screen.getByText("Chimney")).toBeDefined();
			});
		});
	
		describe("removing a shading object", () => {
			it("removes the item and opens a new empty add form when it is the only item", async () => {
				store.$patch({
					dwellingFabric: {
						dwellingSpaceDoors: { 
							dwellingSpaceExternalGlazedDoor: {
								data: [egdWithShading],
							},
						},
					},
				});
				await renderSuspended(ExternalGlazedDoor, {
					route: { params: { door: "0" } },
				});
				await user.click(screen.getByTestId("shading_remove_0"));
				expect(screen.queryByTestId("shading_summary_0")).toBeNull();
				expect(screen.getByTestId("shading-add-form")).toBeDefined();
				expect(screen.queryByTestId("cancelShadingObject")).toBeNull();
			});
	
			it("removes only the targeted item when other items exist", async () => {
				store.$patch({
					dwellingFabric: {
						dwellingSpaceDoors: { 
							dwellingSpaceExternalGlazedDoor: {
								data: [egdWithTwoShadingItems],
							},
						},
					},
				});
				await renderSuspended(ExternalGlazedDoor, {
					route: { params: { door: "0" } },
				});
				await user.click(screen.getByTestId("shading_remove_0"));
				expect(screen.queryByTestId("shading-add-form")).toBeNull();
				expect(screen.getByTestId("shading_summary_0")).toBeDefined();
				expect(screen.getByText("Left fin")).toBeDefined();
				expect(screen.queryByText("Chimney")).toBeNull();
			});
		});
	
	});
});