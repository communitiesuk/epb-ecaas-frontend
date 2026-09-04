import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import { v4 as uuidv4 } from "uuid";
import type { PartyFloorData } from "~/stores/ecaasStore.schema";
import PartyFloor from "./[floor].vue";

vi.mock("uuid");

describe("party floor", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const partyFloorData: PartyFloorData = {
		id: "1a997f84-d070-4835-a74b-ef0135b44a90",
		name: "Internal 1",
		pitchOption: "0",
		pitch: 0,
		surfaceArea: 5,
		arealHeatCapacity: "Very light" as const,
		massDistributionClass: "I" as const,
		uValue: 1,
	};

	beforeEach(() => {
		vi.mocked(uuidv4).mockReturnValue(partyFloorData.id as unknown as Buffer);
	});

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Internal 1");
		await user.click(screen.getByTestId("pitchOption_0"));
		await user.type(screen.getByTestId("surfaceArea"), "5");
		await user.click(screen.getByTestId("arealHeatCapacity_Very_light"));
		await user.click(screen.getByTestId("massDistributionClass_I"));
		await user.type(screen.getByTestId("uValue"), "1");
		await user.tab();
	};

	test("data is saved to store state and marked as complete when form is valid", async () => {
		await renderSuspended(PartyFloor, {
			route: {
				params: { floor: "create" },
			},
		});

		await populateValidForm();
		await user.tab();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { dwellingSpacePartyFloor } = store.dwellingFabric.dwellingSpaceFloors;

		expect(dwellingSpacePartyFloor?.data[0]?.data).toEqual(partyFloorData);
		expect(dwellingSpacePartyFloor?.data[0]?.complete).toEqual(true);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpacePartyFloor: {
						data: [{ data: partyFloorData }],
					},
				},
			},
		});

		await renderSuspended(PartyFloor, {
			route: {
				params: { floor: "0" },
			},
		});

		expect(screen.getByTestId<HTMLInputElement>("name").value).toBe("Internal 1");
		expect(screen.getByTestId<HTMLInputElement>("pitchOption_0").checked).toBe(true);
		expect(screen.getByTestId<HTMLInputElement>("surfaceArea").value).toBe("5");
		expect(screen.getByTestId<HTMLInputElement>("arealHeatCapacity_Very_light").checked).toBe(true);
		expect(screen.getByTestId<HTMLInputElement>("massDistributionClass_I").checked).toBe(true);
		expect(screen.getByTestId<HTMLInputElement>("uValue").value).toBe("1");
	});

	test("displays errors when required fields are empty", async () => {
		await renderSuspended(PartyFloor, {
			route: {
				params: { floor: "create" },
			},
		});

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("pitchOption_error"))).toBeDefined();
		expect((await screen.findByTestId("surfaceArea_error"))).toBeDefined();
		expect((await screen.findByTestId("arealHeatCapacity_error"))).toBeDefined();
		expect((await screen.findByTestId("massDistributionClass_error"))).toBeDefined();
		expect((await screen.findByTestId("uValue_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(PartyFloor, {
			route: {
				params: { floor: "create" },
			},
		});

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("partyFloorErrorSummary"))).toBeDefined();
	});
});