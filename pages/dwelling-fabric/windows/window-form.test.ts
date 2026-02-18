import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import Window from "./[window].vue";
import { millimetre } from "~/utils/units/length";
import { unitValue } from "~/utils/units";
import { v4 as uuidv4 } from "uuid";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});
vi.mock("uuid");

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

const window1: EcaasForm<WindowData> = {
	data: {
		id: "80fd1ffe-a83a-4d95-bd2c-ad8fdc37b321",
		name: "Window 1",
		taggedItem: externalWall.id,
		height: 1,
		width: 1,
		uValue: 1,
		securityRisk: true,
		solarTransmittance: 0.1,
		elevationalHeight: 1,
		midHeight: 1,
		openingToFrameRatio: 0.8,
		numberOpenableParts: "0",
		overhangDepth: unitValue(60, millimetre),
		overhangDistance: unitValue(60, millimetre),
		sideFinRightDepth: unitValue(60, millimetre),
		sideFinRightDistance: unitValue(60, millimetre),
		sideFinLeftDepth: unitValue(60, millimetre),
		sideFinLeftDistance: unitValue(60, millimetre),
		curtainsOrBlinds: true,
		treatmentType: "blinds",
		thermalResistivityIncrease: 1,
		solarTransmittanceReduction: 0.1,
	},
	complete: true,
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

		afterEach(() => {
			store.$reset();
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

			await user.type(screen.getByTestId("name"), "Window 1");
			await user.click(screen.getByTestId(`taggedItem_${externalWall.id}`));
			await user.type(screen.getByTestId("height"), "1");
			await user.type(screen.getByTestId("width"), "1");
			await user.type(screen.getByTestId("uValue"), "1");
			await user.click(screen.getByTestId("securityRisk_no"));
			await user.type(screen.getByTestId("solarTransmittance"), "0.1");
			await user.type(screen.getByTestId("elevationalHeight"), "1");
			await user.type(screen.getByTestId("midHeight"), "1");
			await user.type(screen.getByTestId("openingToFrameRatio"), "0.8");
			await user.click(screen.getByTestId("securityRisk_yes"));
			await user.click(screen.getByTestId("numberOpenableParts_0"));
			await user.type(screen.getByTestId("overhangDepth"), "60");
			await user.type(screen.getByTestId("overhangDistance"), "60");
			await user.type(screen.getByTestId("sideFinRightDepth"), "60");
			await user.type(screen.getByTestId("sideFinRightDistance"), "60");
			await user.type(screen.getByTestId("sideFinLeftDepth"), "60");
			await user.type(screen.getByTestId("sideFinLeftDistance"), "60");
			await user.click(screen.getByTestId("curtainsOrBlinds_yes"));
			await user.click(screen.getByTestId("treatmentType_blinds"));
			await user.type(screen.getByTestId("thermalResistivityIncrease"), "1");
			await user.type(screen.getByTestId("solarTransmittanceReduction"), "0.1");
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
			expect((await screen.findByTestId<HTMLInputElement>("uValue")).value).toBe("1");
			expect((await screen.findByTestId("securityRisk_yes")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("solarTransmittance")).value).toBe("0.1");
			expect((await screen.findByTestId<HTMLInputElement>("elevationalHeight")).value).toBe("1");
			expect((await screen.findByTestId<HTMLInputElement>("midHeight")).value).toBe("1");
			expect((await screen.findByTestId("numberOpenableParts_0")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("overhangDepth")).value).toBe("60");
			expect((await screen.findByTestId<HTMLInputElement>("overhangDistance")).value).toBe("60");
			expect((await screen.findByTestId<HTMLInputElement>("sideFinRightDepth")).value).toBe("60");
			expect((await screen.findByTestId<HTMLInputElement>("sideFinRightDistance")).value).toBe("60");
			expect((await screen.findByTestId<HTMLInputElement>("sideFinLeftDepth")).value).toBe("60");
			expect((await screen.findByTestId<HTMLInputElement>("sideFinLeftDistance")).value).toBe("60");
			expect((await screen.findByTestId("treatmentType_blinds")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("thermalResistivityIncrease")).value).toBe("1");
			expect((await screen.findByTestId<HTMLInputElement>("solarTransmittanceReduction")).value).toBe("0.1");
		});

		test("only required error messages are displayed when empty form is submitted", async () => {
			await renderSuspended(Window);

			await (user.click(screen.getByTestId("saveAndComplete")));

			expect((await screen.findByTestId("name_error"))).toBeDefined();
			expect((await screen.findByTestId("taggedItem_error"))).toBeDefined();
			expect((await screen.findByTestId("height_error"))).toBeDefined();
			expect((await screen.findByTestId("width_error"))).toBeDefined();
			expect((await screen.findByTestId("uValue_error"))).toBeDefined();
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

			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/windows");
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
});