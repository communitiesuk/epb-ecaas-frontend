import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import Window from "./[window].vue";
import { WindowTreatmentType } from "~/schema/api-schema.types";
import { millimetre } from "~/utils/units/length";
import { unitValue } from "~/utils/units/types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

const store = useEcaasStore();
const user = userEvent.setup();

const window1: EcaasForm<WindowData> = {
	data: {
		name: "Window 1",
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
		openingToFrameRatio: 0.8,
		numberOpenableParts: "0",
		overhangDepth: unitValue(60, millimetre),
		overhangDistance: unitValue(60, millimetre),
		sideFinRightDepth: unitValue(60, millimetre),
		sideFinRightDistance: unitValue(60, millimetre),
		sideFinLeftDepth: unitValue(60, millimetre),
		sideFinLeftDistance: unitValue(60, millimetre),
		curtainsOrBlinds: true,
		treatmentType: WindowTreatmentType.blinds,
		thermalResistivityIncrease: 1,
		solarTransmittanceReduction: 0.1,
	} as WindowData,
	complete: true
};

const window2: EcaasForm<WindowData>  = {
	data: {
		...window1.data, 	name: "Window 2" },
};

afterEach(() => {
	store.$reset();
});

describe ("window", () => {
	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(Window, {
			route: {
				params: { window: "create" }
			}
		});

		await user.type(screen.getByTestId("name"), "Window 1");
		await user.type(screen.getByTestId("orientation"), "1");
		await user.type(screen.getByTestId("surfaceArea"), "1");
		await user.type(screen.getByTestId("height"), "1");
		await user.type(screen.getByTestId("width"), "1"); 
		await user.type(screen.getByTestId("uValue"), "1");
		await user.click(screen.getByTestId("pitchOption_90"));
		await user.type(screen.getByTestId("solarTransmittance"), "0.1");
		await user.type(screen.getByTestId("elevationalHeight"), "1");
		await user.type(screen.getByTestId("midHeight"), "1");
		await user.type(screen.getByTestId("openingToFrameRatio"), "0.8");
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

		await(user.click(screen.getByTestId("saveAndComplete")));


		const { data } = store.dwellingFabric.dwellingSpaceWindows;
		
		expect(data[0]).toEqual(window1);
		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/windows");
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: [window1]
				}
			}
		});

		await renderSuspended(Window, {
			route: {
				params: { window: "0" }
			}
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Window 1");
		expect((await screen.findByTestId<HTMLInputElement>("orientation")).value).toBe("1");
		expect((await screen.findByTestId<HTMLInputElement>("surfaceArea")).value).toBe("1");
		expect((await screen.findByTestId<HTMLInputElement>("height")).value).toBe("1");
		expect((await screen.findByTestId<HTMLInputElement>("width")).value).toBe("1");
		expect((await screen.findByTestId<HTMLInputElement>("uValue")).value).toBe("1");
		expect((await screen.findByTestId("pitchOption_90")).hasAttribute("checked")).toBe(true);
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

		await(user.click(screen.getByTestId("saveAndComplete")));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("orientation_error"))).toBeDefined();
		expect((await screen.findByTestId("surfaceArea_error"))).toBeDefined();
		expect((await screen.findByTestId("height_error"))).toBeDefined();
		expect((await screen.findByTestId("width_error"))).toBeDefined();
		expect((await screen.findByTestId("uValue_error"))).toBeDefined();
		expect((await screen.findByTestId("pitchOption_error"))).toBeDefined();
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

		await(user.click(screen.getByTestId("saveAndComplete")));

		expect((await screen.findByTestId("windowErrorSummary"))).toBeDefined();
	});

	test("requires pitch when custom pitch option is selected", async () => {
		await renderSuspended(Window);
    
		await user.click(screen.getByTestId("pitchOption_custom"));
		await(user.click(screen.getByTestId("saveAndComplete")));

		expect((await screen.findByTestId("pitch_error"))).toBeDefined();
	});

	test("requires further data when four openable parts option is selected", async () => {
		await renderSuspended(Window);
    
		await user.click(screen.getByTestId("numberOpenableParts_4"));
		await(user.click(screen.getByTestId("saveAndComplete")));

		expect((await screen.findByTestId("openingToFrameRatio_error"))).toBeDefined();
		expect((await screen.findByTestId("maximumOpenableArea_error"))).toBeDefined();
		expect((await screen.findByTestId("heightOpenableArea_error"))).toBeDefined();
		expect((await screen.findByTestId("midHeightOpenablePart1_error"))).toBeDefined();
		expect((await screen.findByTestId("midHeightOpenablePart2_error"))).toBeDefined();
		expect((await screen.findByTestId("midHeightOpenablePart3_error"))).toBeDefined();
		expect((await screen.findByTestId("midHeightOpenablePart4_error"))).toBeDefined();
	});

	test("does not require the mid height of more parts than have been selected", async () => {
		await renderSuspended(Window);
    
		await user.click(screen.getByTestId("numberOpenableParts_1"));
		await(user.click(screen.getByTestId("saveAndComplete")));
    
		expect((await screen.findByTestId("midHeightOpenablePart1_error"))).toBeDefined();
		expect((screen.queryByTestId("midHeightOpenablePart2_error"))).toBeNull();
		expect((screen.queryByTestId("midHeightOpenablePart3_error"))).toBeNull();
		expect((screen.queryByTestId("midHeightOpenablePart4_error"))).toBeNull();
	});

	test("displays curtainsControlObject when the curtains option is selected", async () => {
		await renderSuspended(Window);
    
		await user.click(screen.getByTestId("curtainsOrBlinds_yes"));
		await user.click(screen.getByTestId("treatmentType_curtains"));
		await user.tab();
    
		expect((screen.getByTestId("curtainsControlObject_auto_motorised"))).toBeDefined();
	});

	test("displays guidance link to window shading guidance page", async () => {
		await renderSuspended(Window);

		const guidance = screen.getByRole("link", { name : "Guidance on window shading (opens in another window)" });
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
	test("form data is automatically saved to store", async () => {
		await renderSuspended(Window, {
			route: {
				params: { window: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Window 1");
		await user.type(screen.getByTestId("orientation"), "1");
		await user.tab();

		const { data } = store.dwellingFabric.dwellingSpaceWindows;

		expect(data[0]!.data.name).toBe("Window 1");
		expect(data[0]!.data.orientation).toBe(1);
	});

	test("partial form data automatically saved to store with default name if no name has been added", async () => {
		await renderSuspended(Window, {
			route: {
				params: { window: "create" },
			},
		});
		await user.type(screen.getByTestId("orientation"), "1");
		await user.tab();

		const { data } = store.dwellingFabric.dwellingSpaceWindows;

		expect(data[0]!.data.name).toBe("Window");
		expect(data[0]!.data.orientation).toBe(1);
	});

	test("default name is used if name is added then deleted", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: [window1]
				}
			}
		});

		await renderSuspended(Window, {
			route: {
				params: { window: "0" }
			}
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
		expect(data[0]!.data.orientation).toBeUndefined();
	});

	test("updated form data is automatically saved to the correct store object when there are multiple windows added", async () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		store.$patch({
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: [window1, window2]
				}
			}
		});
  
		await renderSuspended(Window, {
			route: {
				params: { window: "1" },
			},
		});
		
		await user.clear(screen.getByTestId("name"));
		await user.clear(screen.getByTestId("orientation"));
		
		await user.type(screen.getByTestId("name"), "Updated Window 2");
		await user.type(screen.getByTestId("orientation"), "15");
		await user.tab();
		const { data } = store.dwellingFabric.dwellingSpaceWindows;

		expect(data[1]?.data.name).toBe("Updated Window 2");
		expect(data[1]?.data.orientation).toBe(15);
	});
});