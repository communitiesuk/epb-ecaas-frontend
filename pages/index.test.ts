import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import type { FhsInputSchema } from "~/mapping/fhsInputMapper";
import { mapFhsInputData } from "~/mapping/fhsInputMapper";
import type { FhsComplianceResponseIncludingErrors } from "~/server/server.types";
import Index from "./index.vue";

const mocks = vi.hoisted(() => {
	return {
		hasCompleteState: vi.fn(),
		mapFhsInputData: vi.fn(),
		$fetch: vi.fn(),
	};
});

vi.mock("~/mapping/fhsInputMapper", () => {
	return {
		mapFhsInputData: mocks.mapFhsInputData,
	};
});

vi.mock(import("~/stores/ecaasStore"), async (importOriginal) => {
	const actual = await importOriginal();

	return {
		...actual,
		hasCompleteState: mocks.hasCompleteState,
	};
});

vi.stubGlobal("$fetch", mocks.$fetch);

describe("Homepage", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	beforeEach(() => {
		vi.clearAllMocks();

		mocks.$fetch.mockResolvedValue({
			data: {},
		});
	});

	afterEach(() => {
		store.$reset();
	});

	const wetDistributionSystemWithUnderfloorEmitter: Partial<HeatEmittingData> = {
		name: "Wet Distribution System",
		typeOfHeatEmitter: "wetDistributionSystem",
		emitters: [{
			id: "ufh_emitter",
			name: "Underfloor Heating Emitter",
			typeOfHeatEmitter: "underFloorHeating",
			productReference: "1000",
			areaOfUnderFloorHeating: 200,
		}],
	};

	const groundFloor1: Partial<GroundFloorData> = {
		name: "Ground Floor 1",
		surfaceArea: 50,
	};

	const groundFloor2: Partial<GroundFloorData> = {
		name: "Ground Floor 2",
		surfaceArea: 20,
	};

	const floorAboveUnheatedBasement: Partial<FloorAboveUnheatedBasementData> = {
		name: "Floor Above Unheated Basement",
		surfaceArea: 30,
	};

	const exposedFloor: Partial<ExposedFloorData> = {
		name: "Exposed Floor",
		surfaceArea: 10,
	};

	const floorOfHeatedBasement: Partial<FloorOfHeatedBasementData> = {
		name: "Floor of Heated Basement",
		netSurfaceArea: 40,
	};

	const internalFloor: Partial<InternalFloorData> = {
		name: "Internal floor",
		surfaceAreaOfElement: 25,
	};

	const floors = {
		dwellingSpaceGroundFloor: {
			data: [
				{ data: groundFloor1 },
				{ data: groundFloor2 },
			],
		},
		dwellingSpaceFloorAboveUnheatedBasement: {
			data: [
				{ data: floorAboveUnheatedBasement },
			],
		},
		dwellingSpaceExposedFloor: {
			data: [
				{ data: exposedFloor },
			],
		},
		dwellingSpaceFloorOfHeatedBasement: {
			data: [
				{ data: floorOfHeatedBasement },
			],
		},
		dwellingSpaceInternalFloor: {
			data: [
				{ data: internalFloor },
			],
		},
	} as FloorsData;

	it("shows error summary when client error has occurred", async () => {
		vi.mocked(hasCompleteState).mockReturnValue(true);

		vi.mocked(mapFhsInputData).mockImplementation(() => {
			throw Error("Mapping error");
		});

		await renderSuspended(Index);

		await user.click(screen.getByRole("button", { name: "Calculate" }));

		expect((await screen.findByTestId("resultErrorSummary"))).toBeDefined();
	});

	it("shows error summary when API error has occurred", async () => {
		vi.mocked(hasCompleteState).mockReturnValue(true);

		vi.mocked(mapFhsInputData).mockImplementation(() => {
			return {} as FhsInputSchema;
		});

		vi.mocked(global.$fetch<FhsComplianceResponseIncludingErrors>).mockReturnValue(new Promise((resolve) => {
			resolve({
				errors: [{
					id: "testId",
					detail: "API error",
				}],
				meta: {
					hem_version: "",
					hem_version_date: "",
					fhs_version: "",
					fhs_version_date: "",
				},
			});
		}));

		await renderSuspended(Index);

		await user.click(screen.getByRole("button", { name: "Calculate" }));

		const errorSummary = await screen.findByTestId("resultErrorSummary");
		const errorText = errorSummary.textContent;

		expect(errorSummary).toBeDefined();
		expect(errorText).toContain("Error ID: testId");
	});

	it("shows an error when underfloor heating area is larger than the floor area", async () => {
		store.$patch({
			spaceHeating: {
				heatEmitters: {
					data: [{ data: wetDistributionSystemWithUnderfloorEmitter, complete: true }],
				},
			},
			dwellingFabric: {
				dwellingSpaceFloors: floors,
			},
		});

		vi.mocked(hasCompleteState).mockReturnValue(true);
		vi.mocked(mapFhsInputData).mockImplementation(() => {
			return {} as FhsInputSchema;
		});

		await renderSuspended(Index);
		await user.click(screen.getByRole("button", { name: "Calculate" }));

		const errorSummary = await screen.findByTestId("resultErrorSummary");
		const errorText = errorSummary.textContent;

		expect(errorSummary).toBeDefined();
		expect(errorText).toContain("The area of underfloor heating is larger than the floor area");

		expect(mocks.$fetch).not.toHaveBeenCalled();
	});

	it("does not show an error when underfloor heating area is equal to the floor area", async () => {
		const equalUnderfloorEmitter = {
			...wetDistributionSystemWithUnderfloorEmitter,
			emitters: [{
				...wetDistributionSystemWithUnderfloorEmitter.emitters![0],
				areaOfUnderFloorHeating: 175,
			}],
		};
		store.$patch({
			spaceHeating: {
				heatEmitters: {
					data: [{ data: equalUnderfloorEmitter, complete: true }],
				},
			},
			dwellingFabric: {
				dwellingSpaceFloors: floors,
			},
		});

		vi.mocked(hasCompleteState).mockReturnValue(true);
		vi.mocked(mapFhsInputData).mockReturnValue({} as FhsInputSchema);

		await renderSuspended(Index);

		await user.click(screen.getByRole("button", { name: "Calculate" }));

		expect(screen.queryByTestId("resultErrorSummary")).toBeNull();
		expect(mocks.$fetch).toHaveBeenCalled();
	});

	it("does not show an error when underfloor heating area is smaller than the floor area", async () => {
		const smallerUnderfloorEmitter = {
			...wetDistributionSystemWithUnderfloorEmitter,
			emitters: [{
				...wetDistributionSystemWithUnderfloorEmitter.emitters![0],
				areaOfUnderFloorHeating: 150,
			}],
		};
		store.$patch({
			spaceHeating: {
				heatEmitters: {
					data: [{ data: smallerUnderfloorEmitter, complete: true }],
				},
			},
			dwellingFabric: {
				dwellingSpaceFloors: floors,
			},
		});
		vi.mocked(hasCompleteState).mockReturnValue(true);
		vi.mocked(mapFhsInputData).mockReturnValue({} as FhsInputSchema);

		await renderSuspended(Index);

		await user.click(screen.getByRole("button", { name: "Calculate" }));

		expect(screen.queryByTestId("resultErrorSummary")).toBeNull();
		expect(mocks.$fetch).toHaveBeenCalled();
	});

	it("displays 'Change orientation' button which navigates to the change orientation page", async () => {
		await renderSuspended(Index);
		const changeOrientationButton = screen.getByRole("button", { name: "Change orientation" });
		expect(changeOrientationButton.getAttribute("href")).toBe("/change-orientation");
	});
});