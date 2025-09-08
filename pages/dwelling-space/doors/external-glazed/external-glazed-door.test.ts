import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import ExternalGlazedDoor from "./[door].vue";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("external glazed door", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const state: ExternalGlazedDoorData = {
		name: "External glazed door 1",
		orientation: 12,
		surfaceArea: 13,
		height: 14,
		width: 48,
		uValue: 0.45,
		pitchOption: "90",
		pitch: 90,
		solarTransmittance: 0.1,
		elevationalHeight: 14,
		midHeight: 11,
		numberOpenableParts: "1",
		openingToFrameRatio: 0.2,
		heightOpenableArea: 14,
		maximumOpenableArea: 13,
		midHeightOpenablePart1: 11,
	};

	afterEach(() => {
		store.$reset();
	});

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(ExternalGlazedDoor);

		await user.type(screen.getByTestId("name"), "External glazed door 1");
		await user.type(screen.getByTestId("orientation"), "12");
		await user.type(screen.getByTestId("surfaceArea"), "13");
		await user.type(screen.getByTestId("height"), "14");
		await user.type(screen.getByTestId("width"), "48"); 
		await user.type(screen.getByTestId("uValue"), "0.45");
		await user.click(screen.getByTestId("pitchOption_90"));
		await user.type(screen.getByTestId("solarTransmittance"), "0.1");
		await user.type(screen.getByTestId("elevationalHeight"), "14");
		await user.type(screen.getByTestId("midHeight"), "11");
		await user.type(screen.getByTestId("openingToFrameRatio"), "0.2");
		await user.tab();

		await user.click(screen.getByRole("button"));

		const { data = [] } = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor || {};
	
		expect(data[0]).toEqual(state);
		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-space/doors");
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceDoors: {
					dwellingSpaceExternalGlazedDoor: {
						data: [state]
					}
				}
			}
		});

		await renderSuspended(ExternalGlazedDoor, {
			route: {
				params: { door: "0" }
			}
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("External glazed door 1");
		expect((await screen.findByTestId<HTMLInputElement>("orientation")).value).toBe("12");
		expect((await screen.findByTestId<HTMLInputElement>("surfaceArea")).value).toBe("13");
		expect((await screen.findByTestId<HTMLInputElement>("height")).value).toBe("14");
		expect((await screen.findByTestId<HTMLInputElement>("width")).value).toBe("48");
		expect((await screen.findByTestId<HTMLInputElement>("uValue")).value).toBe("0.45");
		expect((await screen.findByTestId("pitchOption_90")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId<HTMLInputElement>("solarTransmittance")).value).toBe("0.1");
		expect((await screen.findByTestId<HTMLInputElement>("elevationalHeight")).value).toBe("14");
		expect((await screen.findByTestId<HTMLInputElement>("midHeight")).value).toBe("11");
	});
		
	test("only required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(ExternalGlazedDoor);

		await user.click(screen.getByRole("button"));

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
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(ExternalGlazedDoor);

		await user.click(screen.getByRole("button"));

		expect((await screen.findByTestId("externalGlazedDoorErrorSummary"))).toBeDefined();
	});

	it("requires pitch when custom pitch option is selected", async () => {
		await renderSuspended(ExternalGlazedDoor);
    
		await user.click(screen.getByTestId("pitchOption_custom"));
		await user.click(screen.getByRole("button"));
    
		expect((await screen.findByTestId("pitch_error"))).toBeDefined();
	});
});