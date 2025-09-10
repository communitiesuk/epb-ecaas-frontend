import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/vue";
import WallToUnheatedSpace from "./[wall].vue";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("wall to unheated space", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const state: WallsToUnheatedSpaceData ={
		name: "Wall to unheated space 1",
		surfaceAreaOfElement: 500,
		uValue: 10,
		arealHeatCapacity: 50000,
		massDistributionClass: "E",
		pitchOption: "90",
		pitch: 90,
		thermalResistanceOfAdjacentUnheatedSpace: 1
	};

	afterEach(() => {
		store.$reset();
	});	

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(WallToUnheatedSpace);

		await user.type(screen.getByTestId("name"), "Wall to unheated space 1");
		await user.type(screen.getByTestId("surfaceAreaOfElement"), "500");
		await user.type(screen.getByTestId("uValue"), "10");
		await user.click(screen.getByTestId("arealHeatCapacity_50000"));
		await user.click(screen.getByTestId("massDistributionClass_E"));
		await user.click(screen.getByTestId("pitchOption_90"));
		await user.type(screen.getByTestId("thermalResistanceOfAdjacentUnheatedSpace"), "1");

		await user.click(screen.getByRole("button"));
		await waitFor(() => {
			const { data = [] } = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace || {};
			expect(data[0]).toEqual(state);
			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-space/walls");
		
		});
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceWallToUnheatedSpace: {
						data: [state]
					}
				}
			}
		});

		await renderSuspended(WallToUnheatedSpace, {
			route: {
				params: { wall: "0" }
			}
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Wall to unheated space 1");
		expect((await screen.findByTestId<HTMLInputElement>("surfaceAreaOfElement")).value).toBe("500");
		expect((await screen.findByTestId<HTMLInputElement>("uValue")).value).toBe("10");
		expect((await screen.findByTestId("arealHeatCapacity_50000")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("massDistributionClass_E")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("pitchOption_90")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId<HTMLInputElement>("thermalResistanceOfAdjacentUnheatedSpace")).value).toBe("1");
	
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(WallToUnheatedSpace);
	
		await user.click(screen.getByRole("button"));
	
		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("surfaceAreaOfElement_error"))).toBeDefined();
		expect((await screen.findByTestId("uValue_error"))).toBeDefined();			
		expect((await screen.findByTestId("arealHeatCapacity_error"))).toBeDefined();
		expect((await screen.findByTestId("massDistributionClass_error"))).toBeDefined();
		expect((await screen.findByTestId("pitchOption_error"))).toBeDefined();
		expect((await screen.findByTestId("thermalResistanceOfAdjacentUnheatedSpace_error"))).toBeDefined();
	
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(WallToUnheatedSpace);
		
		await user.click(screen.getByRole("button"));
		
		expect((await screen.findByTestId("wallToUnheatedSpaceErrorSummary"))).toBeDefined();
	});


	test("requires pitch when custom pitch option is selected", async () => {
		await renderSuspended(WallToUnheatedSpace);
				
		await user.click(screen.getByTestId("pitchOption_custom"));
		await user.click(screen.getByRole("button"));
				
		expect((await screen.findByTestId("pitch_error"))).toBeDefined();
	});
});