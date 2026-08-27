import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen, within } from "@testing-library/vue";
import { v4 as uuidv4 } from "uuid";
import WallToUnheatedSpace from "./[wall].vue";

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

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Wall to unheated space 1");
		await user.type(screen.getByTestId("surfaceAreaOfElement"), "500");
		await user.type(screen.getByTestId("uValue"), "10");
		await user.click(screen.getByTestId("arealHeatCapacity_Very_light"));
		await user.click(screen.getByTestId("massDistributionClass_E"));
		await user.click(screen.getByTestId("pitchOption_90"));
		await user.type(screen.getByTestId("thermalResistanceOfAdjacentUnheatedSpace"), "1");
		await user.tab();
	};

	test("data is saved to store state when form is valid", async () => {
		vi.mocked(uuidv4).mockReturnValue(state.id as unknown as Buffer);

		await renderSuspended(WallToUnheatedSpace, {
			route: {
				params: { wall: "create" },
			},
		});

		await populateValidForm();
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

	it("requires custom areal heat capacity value when custom option is selected", async () => {
		await renderSuspended(WallToUnheatedSpace, {
			route: {
				params: { wall: "create" },
			},
		});

		await user.click(screen.getByTestId("arealHeatCapacity_Custom"));
		await user.click(screen.getByTestId("saveAndComplete"));

		expect(screen.findByTestId("customArealHeatCapacity_error")).toBeDefined();
	});

	it("saves custom areal heat capacity value to store when custom option is selected", async () => {
		await renderSuspended(WallToUnheatedSpace, {
			route: {
				params: { wall: "create" },
			},
		});

		await populateValidForm();
		await user.click(screen.getByTestId("arealHeatCapacity_Custom"));
		await user.type(screen.getByTestId("arealHeatCapacityCustom"), "10");
		await user.click(screen.getByTestId("saveAndComplete"));

		const data = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace.data[0]!.data as Extract<WallsToUnheatedSpaceData, { arealHeatCapacity: "Custom" }>;

		expect(data.arealHeatCapacityCustom).toEqual(10);
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

	it.each(["0", "180"])("if an internal wall is tagged to a front door and its pitch is updated to %s the door is updated to a regular door that is not complete", async (pitch) => {
									
		const unheatedSpaceWall: Partial<WallsToUnheatedSpaceData> = {
			id: "80fd1ffe-a83a-4d95-bd2c-ad8fdc37b421",
			name: "wall",
			pitchOption: "custom",
			pitch: 10,
		};
		
		const internalDoor: Partial<InternalDoorData> = {
			name: "Internal 1",
			associatedItemId: unheatedSpaceWall.id,
			isTheFrontDoor: true,
			orientation: 30,
		};
		
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceWallToUnheatedSpace: {
						data: [{ data: unheatedSpaceWall }],
					},
				},
				dwellingSpaceDoors: {
					dwellingSpaceInternalDoor: {
						data: [{ data: internalDoor, complete: true }],
					},
				}, 
			},
		});
						
		await renderSuspended(WallToUnheatedSpace, {
			route: {
				params: { wall: "0" },
			},
		});
										
		await user.click(screen.getByTestId("pitchOption_custom"));
		await user.clear(screen.getByTestId("pitch"));
		await user.type(screen.getByTestId("pitch"), pitch);
		await user.tab();
		const { dwellingSpaceInternalDoor } = store.dwellingFabric.dwellingSpaceDoors;
			
		expect(dwellingSpaceInternalDoor.data[0]?.complete).toBeFalsy();
		expect(dwellingSpaceInternalDoor.data[0]?.data.isTheFrontDoor).toBeUndefined();
		expect((dwellingSpaceInternalDoor.data[0]?.data as { orientation: number }).orientation).toBeUndefined();
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

	test("wall areal heat capacity table is displayed in help with input dropdown", async () => {
		await renderSuspended(WallToUnheatedSpace, {
			route: {
				params: { wall: "create" },
			},
		});

		const table = screen.getByTestId("wallArealHeatCapacityTable");

		expect(table).toBeDefined();
		expect(within(table).getByText("Areal heat capacity classification")).toBeDefined();
		expect(within(table).getByText("Areal heat capacity")).toBeDefined();
		expect(within(table).getByText("Type of construction layer")).toBeDefined();
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