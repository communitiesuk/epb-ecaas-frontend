import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import WallToUnheatedSpace from "./[wall].vue";
import { v4 as uuidv4 } from "uuid";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

vi.mock("uuid");

describe("wall to unheated space", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const state: WallsToUnheatedSpaceData = {
		id: "55a95c36-bf0a-40d3-a31d-9e4f86798428",
		name: "Wall to unheated space 1",
		surfaceAreaOfElement: 500,
		uValue: 10,
		arealHeatCapacity: "Very light",
		massDistributionClass: "E",
		pitchOption: "90",
		pitch: 90,
		thermalResistanceOfAdjacentUnheatedSpace: 1,
	};

	afterEach(() => {
		store.$reset();
	});	

	test("data is saved to store state when form is valid", async () => {
		vi.mocked(uuidv4).mockReturnValue(state.id as unknown as Buffer);
		
		await renderSuspended(WallToUnheatedSpace, {
			route: {
				params: { wall: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Wall to unheated space 1");
		await user.type(screen.getByTestId("surfaceAreaOfElement"), "500");
		await user.type(screen.getByTestId("uValue"), "10");
		await user.click(screen.getByTestId("arealHeatCapacity_Very_light"));
		await user.click(screen.getByTestId("massDistributionClass_E"));
		await user.click(screen.getByTestId("pitchOption_90"));
		await user.type(screen.getByTestId("thermalResistanceOfAdjacentUnheatedSpace"), "1");
		await user.tab();

		await user.click(screen.getByTestId("saveAndComplete"));

		const { data = [] } = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace || {};
		expect(data[0]?.data).toEqual(state);
		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/walls");
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceWallToUnheatedSpace: {
						data: [{ data: state }],
					},
				},
			},
		});

		await renderSuspended(WallToUnheatedSpace, {
			route: {
				params: { wall: "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Wall to unheated space 1");
		expect((await screen.findByTestId<HTMLInputElement>("surfaceAreaOfElement")).value).toBe("500");
		expect((await screen.findByTestId<HTMLInputElement>("uValue")).value).toBe("10");
		expect((await screen.findByTestId("arealHeatCapacity_Very_light")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("massDistributionClass_E")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("pitchOption_90")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId<HTMLInputElement>("thermalResistanceOfAdjacentUnheatedSpace")).value).toBe("1");
	
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(WallToUnheatedSpace, {
			route: {
				params: { wall: "create" },
			},
		});
	
		await user.click(screen.getByTestId("saveAndComplete"));
	
		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("surfaceAreaOfElement_error"))).toBeDefined();
		expect((await screen.findByTestId("uValue_error"))).toBeDefined();			
		expect((await screen.findByTestId("arealHeatCapacity_error"))).toBeDefined();
		expect((await screen.findByTestId("massDistributionClass_error"))).toBeDefined();
		expect((await screen.findByTestId("pitchOption_error"))).toBeDefined();
		expect((await screen.findByTestId("thermalResistanceOfAdjacentUnheatedSpace_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(WallToUnheatedSpace, {
			route: {
				params: { wall: "create" },
			},
		});
		
		await user.click(screen.getByTestId("saveAndComplete"));
		
		expect((await screen.findByTestId("wallToUnheatedSpaceErrorSummary"))).toBeDefined();
	});


	it("requires pitch when custom pitch option is selected", async () => {
		await renderSuspended(WallToUnheatedSpace, {
			route: {
				params: { wall: "create" },
			},
		});
				
		await user.click(screen.getByTestId("pitchOption_custom"));
		await user.click(screen.getByTestId("saveAndComplete"));
				
		expect((await screen.findByTestId("pitch_error"))).toBeDefined();
	});

	test("updated form data is automatically saved to store", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceWallToUnheatedSpace: {
						data: [{
							data: { ...state },
						}],
					},
				},
			},
		});

		await renderSuspended(WallToUnheatedSpace, {
			route: {
				params: { wall: "0" },
			},
		});
	
		await user.clear(screen.getByTestId("name"));
		await user.clear(screen.getByTestId("surfaceAreaOfElement"));

		await user.type(screen.getByTestId("name"), "Wall to unheated space 2");
		await user.type(screen.getByTestId("surfaceAreaOfElement"), "10");
		await user.tab();

		const { data } = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace;

		expect(data[0]?.data.name).toBe("Wall to unheated space 2");
		expect(data[0]?.data.surfaceAreaOfElement).toBe(10);
	});
	
	test("partial form data is saved automatically with default name to store", async () => {
		await renderSuspended(WallToUnheatedSpace, {
			route: {
				params: { wall: "create" },
			},
		});
		
		await user.type(screen.getByTestId("surfaceAreaOfElement"), "10");
		await user.tab();

		const { data } = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace;

		expect(data[0]?.data.name).toBe("Wall to unheated space");
		expect(data[0]?.data.surfaceAreaOfElement).toBe(10);
	});
});