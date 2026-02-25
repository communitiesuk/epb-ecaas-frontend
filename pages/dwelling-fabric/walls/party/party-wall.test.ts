import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import PartyWall from "./[wall].vue";
import { v4 as uuidv4 } from "uuid";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

vi.mock("uuid");

describe("party wall", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const state: PartyWallData = {
		id: "f91505d0-25ff-4a35-8bb6-e78ccd3ddecd",
		name: "Party wall 1",
		pitchOption: "90",
		pitch: 90,
		surfaceArea: 10,
		arealHeatCapacity: "Very light",
		massDistributionClass: "I",
		partyWallCavityType: "solid",
	};

	afterEach(() => {
		store.$reset();
	});

	test("data is saved to store state when form is valid", async () => {
		vi.mocked(uuidv4).mockReturnValue(state.id as unknown as Buffer);

		await renderSuspended(PartyWall, {
			route: {
				params: { wall: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Party wall 1");
		await user.click(screen.getByTestId("pitchOption_90"));
		await user.type(screen.getByTestId("surfaceArea"), "10");
		await user.click(screen.getByTestId("arealHeatCapacity_Very_light"));
		await user.click(screen.getByTestId("massDistributionClass_I"));
		await user.click(screen.getByTestId("partyWallCavityType_solid"));

		await user.click(screen.getByTestId("saveAndComplete"));

		const { data = [] } = store.dwellingFabric.dwellingSpaceWalls.dwellingSpacePartyWall || {};

		expect(data[0]?.data).toEqual(state);
		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/walls");
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpacePartyWall: {
						data: [{ data: state }],
					},
				},
			},
		});

		await renderSuspended(PartyWall, {
			route: {
				params: { wall: "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Party wall 1");
		expect((await screen.findByTestId<HTMLInputElement>("pitchOption_90")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId<HTMLInputElement>("surfaceArea")).value).toBe("10");
		expect((await screen.findByTestId("arealHeatCapacity_Very_light")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("massDistributionClass_I")).hasAttribute("checked")).toBe(true);
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(PartyWall);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("pitchOption_error"))).toBeDefined();
		expect((await screen.findByTestId("surfaceArea_error"))).toBeDefined();
		expect((await screen.findByTestId("arealHeatCapacity_error"))).toBeDefined();
		expect((await screen.findByTestId("massDistributionClass_error"))).toBeDefined();

	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(PartyWall);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("partyWallErrorSummary"))).toBeDefined();
	});

	test("requires pitch when custom pitch option is selected", async () => {
		await renderSuspended(PartyWall);

		await user.click(screen.getByTestId("pitchOption_custom"));
		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("pitch_error"))).toBeDefined();
	});

	test("updated form data is automatically saved to store", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpacePartyWall: {
						data: [{
							data: { ...state },
						}],
					},
				},
			},
		});

		await renderSuspended(PartyWall, {
			route: {
				params: { wall: "0" },
			},
		});

		await user.clear(screen.getByTestId("name"));
		await user.tab();
		await user.clear(screen.getByTestId("surfaceArea"));

		await user.type(screen.getByTestId("name"), "Party wall 2");
		await user.type(screen.getByTestId("surfaceArea"), "15");
		await user.tab();

		const { data } = store.dwellingFabric.dwellingSpaceWalls.dwellingSpacePartyWall;

		expect(data[0]?.data.name).toBe("Party wall 2");
		expect(data[0]?.data.surfaceArea).toBe(15);
	});

	test("partial form data is saved automatically with default name to store", async () => {
		await renderSuspended(PartyWall, {
			route: {
				params: { wall: "create" },
			},
		});

		await user.type(screen.getByTestId("surfaceArea"), "10");
		await user.tab();

		const { data } = store.dwellingFabric.dwellingSpaceWalls.dwellingSpacePartyWall;

		expect(data[0]?.data.name).toBe("Party wall");
		expect(data[0]?.data.surfaceArea).toBe(10);
	});
});