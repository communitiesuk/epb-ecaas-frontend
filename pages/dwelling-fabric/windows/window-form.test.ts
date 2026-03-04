import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import Window from "./[window].vue";
import { v4 as uuidv4 } from "uuid";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});
vi.mock("uuid");

const store = useEcaasStore();
const user = userEvent.setup();

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

const window1: EcaasForm<WindowData> = {
	data: {
		id: "80fd1ffe-a83a-4d95-bd2c-ad8fdc37b321",
		name: "Window 1",
		taggedItem: externalWall.id,
		height: 1,
		width: 1,
		thermalResistance: 1,
		securityRisk: true,
		solarTransmittance: 0.1,
		elevationalHeight: 1,
		midHeight: 1,
		openingToFrameRatio: 0.8,
		numberOpenableParts: "0",
		curtainsOrBlinds: true,
		treatmentType: "blinds",
		thermalResistivityIncrease: 1,
		solarTransmittanceReduction: 0.1,
		hasShading: false,
	},
	complete: true,
};

const populateValidForm = async ({ hasShading = false } = {}) => {
	await user.type(screen.getByTestId("name"), "Window 1");
	await user.click(screen.getByTestId(`taggedItem_${externalWall.id}`));
	await user.type(screen.getByTestId("height"), "1");
	await user.type(screen.getByTestId("width"), "1");
	await user.type(screen.getByTestId("thermalResistance"), "1");
	await user.click(screen.getByTestId("securityRisk_no"));
	await user.type(screen.getByTestId("solarTransmittance"), "0.1");
	await user.type(screen.getByTestId("elevationalHeight"), "1");
	await user.type(screen.getByTestId("midHeight"), "1");
	await user.type(screen.getByTestId("openingToFrameRatio"), "0.8");
	await user.click(screen.getByTestId("securityRisk_yes"));
	await user.click(screen.getByTestId("numberOpenableParts_0"));
	await user.click(screen.getByTestId("curtainsOrBlinds_yes"));
	await user.click(screen.getByTestId("treatmentType_blinds"));
	await user.type(screen.getByTestId("thermalResistivityIncrease"), "1");
	await user.type(screen.getByTestId("solarTransmittanceReduction"), "0.1");
	await user.click(screen.getByTestId(`hasShading_${hasShading ? "yes" : "no"}`));
};

const window2: EcaasForm<WindowData> = {
	data: {
		...window1.data, name: "Window 2", id: "test-id-2",
	},
};

describe("window", () => {
	describe("without existing external wall or roof", () => {
		test("links to add walls and roofs are not displayed", async () => {
			await renderSuspended(Window, {
				route: {
					params: { window: "create" },
				},
			});

			expect(screen.queryByText("No walls or roofs added.")).toBeNull();
			// expect(screen.getByRole<HTMLAnchorElement>("link", { name: "Click here to add walls" }).href)
			// 	.toContain("/dwelling-fabric/walls");
			// expect(screen.getByRole<HTMLAnchorElement>("link", { name: "Click here to add roofs" }).href)
			// 	.toContain("/dwelling-fabric/ceilings-and-roofs");
		});

		test("should not render associated ID element", async () => {
			await renderSuspended(Window, {
				route: {
					params: { window: "create" },
				},
			});

			expect(screen.queryByTestId("taggedItem")).toBeNull();
		});

		test("shows pitch element", async () => {
			await renderSuspended(Window, {
				route: {
					params: { window: "create" },
				},
			});

			expect(screen.getByTestId("pitch")).toBeDefined();
		});

		it("shows orientation when pitch is not 0 or 180", async () => {
			await renderSuspended(Window, {
				route: {
					params: { window: "create" },
				},
			});
			expect(screen.queryByTestId("orientation")).toBeNull();
			await user.type(screen.getByTestId("pitch"), "90");
			await user.tab();
			expect(screen.getByTestId("orientation")).toBeDefined();
		});

		test("requires pitch and orientation", async () => {
			await renderSuspended(Window, {
				route: {
					params: { window: "create" },
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

		test("does not require pitch and orientation when existing wall is selected", async () => {
			await renderSuspended(Window, {
				route: {
					params: { window: "create" },
				},
			});


			expect(screen.queryByTestId("pitch")).toBeNull();
			expect(screen.queryByTestId("orientation")).toBeNull();

			await user.click(screen.getByTestId("saveAndComplete"));

			expect(screen.queryByTestId("pitch_error")).toBeNull();
			expect(screen.queryByTestId("orientation_error")).toBeNull();


			expect(await screen.findByTestId("taggedItem_error")).toBeDefined();
		});

		test("Associated wall/roof question has none of the above option", async () => {
			await renderSuspended(Window, {
				route: {
					params: { window: "create" },
				},
			});

			expect(screen.getByTestId("taggedItem_none")).toBeDefined();
		});

		describe("when none of the above is selected for associated item ID", () => {
			test("shows pitch element", async () => {
				await renderSuspended(Window, {
					route: {
						params: { window: "create" },
					},
				});

				await user.click(screen.getByTestId("taggedItem_none"));

				expect(screen.getByTestId("pitch")).toBeDefined();
			});

			it("shows orientation when pitch is not 0 or 180", async () => {
				await renderSuspended(Window, {
					route: {
						params: { window: "create" },
					},
				});

				await user.click(screen.getByTestId("taggedItem_none"));

				expect(screen.queryByTestId("orientation")).toBeNull();
				await user.type(screen.getByTestId("pitch"), "90");
				await user.tab();
				expect(screen.getByTestId("orientation")).toBeDefined();
			});

			test("requires pitch and orientation", async () => {
				await renderSuspended(Window, {
					route: {
						params: { window: "create" },
					},
				});

				await user.click(screen.getByTestId("taggedItem_none"));

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
			vi.mocked(uuidv4).mockReturnValue(window1.data.id as unknown as Buffer);

			await renderSuspended(Window, {
				route: {
					params: { window: "create" },
				},
			});

			await populateValidForm();
			await user.tab();

			await (user.click(screen.getByTestId("saveAndComplete")));

			const { data } = store.dwellingFabric.dwellingSpaceWindows;

			expect(data[0]).toEqual(window1);
			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/windows");
		});

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWindows: {
						data: [window1],
					},
				},
			});

			await renderSuspended(Window, {
				route: {
					params: { window: "0" },
				},
			});

			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Window 1");
			expect((await screen.findByTestId(`taggedItem_${externalWall.id}`)).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("height")).value).toBe("1");
			expect((await screen.findByTestId<HTMLInputElement>("width")).value).toBe("1");
			expect((await screen.findByTestId<HTMLInputElement>("thermalResistance")).value).toBe("1");
			expect((await screen.findByTestId("securityRisk_yes")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("solarTransmittance")).value).toBe("0.1");
			expect((await screen.findByTestId<HTMLInputElement>("elevationalHeight")).value).toBe("1");
			expect((await screen.findByTestId<HTMLInputElement>("midHeight")).value).toBe("1");
			expect((await screen.findByTestId("numberOpenableParts_0")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId("treatmentType_blinds")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("thermalResistivityIncrease")).value).toBe("1");
			expect((await screen.findByTestId<HTMLInputElement>("solarTransmittanceReduction")).value).toBe("0.1");
		});

		test("form is prepopulated with none of the above associated wall, as well as pitch and orientation when there is no tagged item", async () => {
			const windowNoTag: EcaasForm<WindowData> = {
				data: {
					id: "80fd1ffe-a83a-4d95-bd2c-ad8fdc37b321",
					name: "Window 1",
					pitch: 72,
					orientation: 24,
					height: 1,
					width: 1,
					thermalResistance: 1,
					securityRisk: true,
					solarTransmittance: 0.1,
					elevationalHeight: 1,
					midHeight: 1,
					openingToFrameRatio: 0.8,
					numberOpenableParts: "0",
					curtainsOrBlinds: true,
					treatmentType: "blinds",
					thermalResistivityIncrease: 1,
					solarTransmittanceReduction: 0.1,
					hasShading: false,
				},
				complete: true,
			};

			store.$patch({
				dwellingFabric: {
					dwellingSpaceWindows: {
						data: [windowNoTag],
					},
				},
			});

			await renderSuspended(Window, {
				route: {
					params: { window: "0" },
				},
			});

			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Window 1");
			expect((await screen.findByTestId(`taggedItem_none`)).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("pitch")).value).toBe("72");
			expect((await screen.findByTestId<HTMLInputElement>("orientation")).value).toBe("24");
		});

		test("only required error messages are displayed when empty form is submitted", async () => {
			await renderSuspended(Window);

			await (user.click(screen.getByTestId("saveAndComplete")));

			expect((await screen.findByTestId("name_error"))).toBeDefined();
			expect((await screen.findByTestId("taggedItem_error"))).toBeDefined();
			expect((await screen.findByTestId("height_error"))).toBeDefined();
			expect((await screen.findByTestId("width_error"))).toBeDefined();
			expect((await screen.findByTestId("thermalResistance_error"))).toBeDefined();
			expect((await screen.findByTestId("securityRisk_error"))).toBeDefined();
			expect((await screen.findByTestId("solarTransmittance_error"))).toBeDefined();
			expect((await screen.findByTestId("elevationalHeight_error"))).toBeDefined();
			expect((await screen.findByTestId("midHeight_error"))).toBeDefined();
			expect((await screen.findByTestId("numberOpenableParts_error"))).toBeDefined();
			expect((screen.queryByTestId("treatmentType_error"))).toBeNull();
			expect((screen.queryByTestId("thermalResistivityIncrease_error"))).toBeNull();
			expect((screen.queryByTestId("solarTransmittanceReduction_error"))).toBeNull();
			expect((screen.queryByTestId("overhangDepth_error"))).toBeNull();
			expect((screen.queryByTestId("overhangDistance_error"))).toBeNull();
			expect((screen.queryByTestId("sideFinRightDepth_error"))).toBeNull();
			expect((screen.queryByTestId("sideFinRightDistance_error"))).toBeNull();
			expect((screen.queryByTestId("sideFinLeftDepth_error"))).toBeNull();
			expect((screen.queryByTestId("sideFinLeftDistance_error"))).toBeNull();
		});

		test("error summary is displayed when an invalid form in submitted", async () => {
			await renderSuspended(Window);

			await (user.click(screen.getByTestId("saveAndComplete")));

			expect((await screen.findByTestId("windowErrorSummary"))).toBeDefined();
		});

		test("requires further data when four openable parts option is selected", async () => {
			await renderSuspended(Window);

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
			await renderSuspended(Window);

			await user.click(screen.getByTestId("numberOpenableParts_1"));
			await (user.click(screen.getByTestId("saveAndComplete")));

			expect((await screen.findByTestId("midHeightOpenablePart1_error"))).toBeDefined();
			expect((screen.queryByTestId("midHeightOpenablePart2_error"))).toBeNull();
			expect((screen.queryByTestId("midHeightOpenablePart3_error"))).toBeNull();
			expect((screen.queryByTestId("midHeightOpenablePart4_error"))).toBeNull();
		});

		test("displays guidance link to window shading guidance page", async () => {
			await renderSuspended(Window);

			const guidance = screen.getByRole("link", { name: "Guidance on window shading (opens in another window)" });
			expect(guidance).toBeDefined();
			expect(guidance.getAttribute("href")).toBe("/guidance/window-shading-guidance");
		});

		test("save progress button navigates user to the windows overview page", async () => {
			await renderSuspended(Window);

			await user.click(screen.getByTestId("curtainsOrBlinds_yes"));
			await user.click(screen.getByTestId("saveProgress"));

			expect(screen.getByTestId<HTMLAnchorElement>("saveProgress").href).toContain("/dwelling-fabric/windows");
		});
	});

	describe("Partially saving data", () => {
		afterEach(() => {
			store.$reset();
		});

		test("form data is automatically saved to store", async () => {
			await renderSuspended(Window, {
				route: {
					params: { window: "create" },
				},
			});

			await user.type(screen.getByTestId("name"), "Window 1");
			await user.tab();

			const { data } = store.dwellingFabric.dwellingSpaceWindows;

			expect(data[0]!.data.name).toBe("Window 1");
		});

		test("partial form data automatically saved to store with default name if no name has been added", async () => {
			await renderSuspended(Window, {
				route: {
					params: { window: "create" },
				},
			});
			await user.type(screen.getByTestId("height"), "3");
			await user.tab();

			const { data } = store.dwellingFabric.dwellingSpaceWindows;

			expect(data[0]!.data.name).toBe("Window");
		});

		test("default name is used if name is added then deleted", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWindows: {
						data: [window1],
					},
				},
			});

			await renderSuspended(Window, {
				route: {
					params: { window: "0" },
				},
			});

			await user.type(screen.getByTestId("name"), "Window 1");
			await user.clear(screen.getByTestId("name"));
			await user.tab();

			const { data } = store.dwellingFabric.dwellingSpaceWindows;

			expect(data[0]!.data.name).toBe("Window");
		});

		test("default name is used if name added is whitespace", async () => {
			await renderSuspended(Window, {
				route: {
					params: { window: "create" },
				},
			});

			await user.type(screen.getByTestId("name"), " ");
			await user.tab();

			expect(store.dwellingFabric.dwellingSpaceWindows.data[0]!.data.name).toBe("Window");

			await renderSuspended(Window, {
				route: {
					params: { window: "0" },
				},
			});

			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), " ");
			await user.tab();

			expect(store.dwellingFabric.dwellingSpaceWindows.data[0]!.data.name).toBe("Window");
		});

		test("creates a new window automatically when a user adds only the name value", async () => {
			await renderSuspended(Window, {
				route: {
					params: { window: "create" },
				},
			});

			await user.type(screen.getByTestId("name"), "window 1");
			await user.tab();

			const { data } = store.dwellingFabric.dwellingSpaceWindows;

			expect(data[0]!.data.name).toBe("window 1");
			expect(data[0]!.data.height).toBeUndefined();
		});

		test("updated form data is automatically saved to the correct store object when there are multiple windows added", async () => {
			const store = useEcaasStore();
			const user = userEvent.setup();

			store.$patch({
				dwellingFabric: {
					dwellingSpaceWindows: {
						data: [window1, window2],
					},
				},
			});

			await renderSuspended(Window, {
				route: {
					params: { window: "1" },
				},
			});

			await user.clear(screen.getByTestId("name"));
			await user.clear(screen.getByTestId("height"));

			await user.type(screen.getByTestId("name"), "Updated Window 2");
			await user.type(screen.getByTestId("height"), "2");
			await user.tab();
			const { data } = store.dwellingFabric.dwellingSpaceWindows;

			expect(data[1]?.data.name).toBe("Updated Window 2");
			expect(data[1]?.data.height).toBe(2);
		});
	});

	describe.skip("shading section", () => {
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
			await renderSuspended(Window);
			await user.click(screen.getByTestId("hasShading_yes"));
			expect(screen.getByTestId("shading-add-form")).toBeDefined();
			expect(screen.queryByTestId("cancelShadingObject")).toBeNull();
		});
		
		const egdWithShading: EcaasForm<WindowData> = {
			complete: true,
			data: {
				...window1.data,
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
		
		const egdWithTwoShadingItems: EcaasForm<WindowData> = {
			complete: true,
			data: {
				...window1.data,
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
			await renderSuspended(Window);
			expect(screen.queryByTestId("shading-section")).toBeNull();
		});
		
		it("should render when user selects that the array has shading", async () => {
			await renderSuspended(Window);
			await user.click(screen.getByTestId("hasShading_yes"));
			expect(screen.getByTestId("shading-section")).toBeDefined();
		});
		
		it("errors on outer submit if shading is yes but no object added", async () => {
			await renderSuspended(Window, {
				route: { params: { array: "create" } },
			});
			await user.click(screen.getByTestId("hasShading_yes"));
			await user.click(screen.getByTestId("saveAndComplete"));
			expect(screen.getByTestId("shadingName_error")).toBeDefined();
		
			expect(screen.queryByTestId("cancelShadingObject")).toBeNull();
		});
		
		it("hides the shading section when hasShading is changed back to no", async () => {
			await renderSuspended(Window);
			await user.click(screen.getByTestId("hasShading_yes"));
			await user.click(screen.getByTestId("hasShading_no"));
			expect(screen.queryByTestId("shading-section")).toBeNull();
		});
		
		describe("type-conditional fields", () => {
			beforeEach(async () => {
				await renderSuspended(Window);
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
				await renderSuspended(Window);
				await saveFirstShadingObject("Chimney");
				expect(screen.queryByTestId("shading-add-form")).toBeNull();
				expect(screen.getByTestId("shading_summary_0")).toBeDefined();
				expect(screen.getByText("Chimney")).toBeDefined();
			});
		
			it("collapses the add form into a summary card after saving a fin/overhang/frame type", async () => {
				await renderSuspended(Window);
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
				await renderSuspended(Window);
				await saveFirstShadingObject();
				expect(screen.getByTestId("addAnotherShadingObject")).toBeDefined();
			});
		
			it("saves the shading object to the store", async () => {
				store.$patch({
					dwellingFabric: {
						dwellingSpaceWindows: {
							data: [
								{
									data: {
										name: "Window 1",
										hasShading: true,
										shading: [],
									}, 
								},
							],
						},
						dwellingSpaceWalls: {
							dwellingSpaceExternalWall: {
								data: [{ data: externalWall, complete: true }],
							},
						},
					},
				});
				await renderSuspended(Window, {
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
				const { shading } = door.data as Extract<WindowData, { hasShading: true }>;
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
				await renderSuspended(Window, {
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
				await renderSuspended(Window, {
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
				await renderSuspended(Window);
				await saveFirstShadingObject();
				await user.click(screen.getByTestId("addAnotherShadingObject"));
				expect(screen.getByTestId("shading-add-form")).toBeDefined();
				expect(screen.getByTestId("cancelShadingObject")).toBeDefined();
			});
		
			it("closes the new add form without removing saved items when cancel is clicked", async () => {
				await renderSuspended(Window);
				await saveFirstShadingObject("Chimney");
				await user.click(screen.getByTestId("addAnotherShadingObject"));
				await user.click(screen.getByTestId("cancelShadingObject"));
				expect(screen.queryByTestId("shading-add-form")).toBeNull();
				expect(screen.getByTestId("shading_summary_0")).toBeDefined();
			});
		
			it("saves a second shading object after clicking add another", async () => {
				await renderSuspended(Window);
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
				await renderSuspended(Window, {
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
				await renderSuspended(Window, {
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
				await renderSuspended(Window, {
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
				await renderSuspended(Window, {
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
				await renderSuspended(Window, {
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