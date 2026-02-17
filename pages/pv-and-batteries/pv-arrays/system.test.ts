import { screen } from "@testing-library/vue";
import PVScreen from "./[system].vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("PV array", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "PV 1");
		await user.type(screen.getByTestId("peakPower"), "4");
		await user.click(screen.getByTestId("ventilationStrategy_unventilated"));
		await user.type(screen.getByTestId("pitch"), "45");
		await user.type(screen.getByTestId("orientation"), "20");
		await user.type(screen.getByTestId("elevationalHeight"), "100");
		await user.type(screen.getByTestId("lengthOfPV"), "20");
		await user.type(screen.getByTestId("widthOfPV"), "20");
		await user.type(screen.getByTestId("inverterPeakPowerAC"), "4");
		await user.type(screen.getByTestId("inverterPeakPowerDC"), "5");
		await user.click(screen.getByTestId("inverterIsInside_yes"));
		await user.click(screen.getByTestId("inverterType_optimised_inverter"));
		// await user.type(screen.getByTestId('aboveDepth'), '20');
		// await user.type(screen.getByTestId('aboveDistance'), '4');
		// await user.type(screen.getByTestId('leftDepth'), '10');
		// await user.type(screen.getByTestId('leftDistance'), '7');
		// await user.type(screen.getByTestId('rightDepth'), '2');
		// await user.type(screen.getByTestId('rightDistance'), '10');
	};

	const pvArray: EcaasForm<PvArrayData> = {
		data: {
			name: "PV 1",
			peakPower: 4,
			ventilationStrategy: "unventilated",
			pitch: 45,
			orientation: 20,
			elevationalHeight: 100,
			lengthOfPV: 20,
			widthOfPV: 20,
			inverterPeakPowerAC: 4,
			inverterPeakPowerDC: 5,
			inverterIsInside: true,
			inverterType: "optimised_inverter",
			// aboveDepth: 20,
			// aboveDistance: 4,
			// leftDepth: 10,
			// leftDistance: 7,
			// rightDepth: 2,
			// rightDistance: 10,
		},
	};

	const pvArray2: EcaasForm<PvArrayData> = {
		data: { ...pvArray.data, name: "PV 2" },
	};

	it("should have a heading", async () => {
		await renderSuspended(PVScreen);
		expect(
			screen.getByRole("heading", { name: "PV (photovoltaic) array" }),
		).toBeDefined();
	});

	it("should have the following inputs", async () => {
		await renderSuspended(PVScreen);
		expect(screen.getByText("Name")).toBeDefined();
		expect(screen.getByText("Peak power")).toBeDefined();
		expect(screen.getAllByText("Ventilation strategy")).toBeDefined();
		expect(screen.getByText("Pitch")).toBeDefined();
		expect(screen.getByText("Orientation")).toBeDefined();
		expect(screen.getByText("Elevational height of PV array at its base")).toBeDefined();
		expect(screen.getByText("Length of PV array")).toBeDefined();
		expect(screen.getByText("Width of PV array")).toBeDefined();
		expect(screen.getByText("Inverter peak power AC")).toBeDefined();
		expect(screen.getByText("Inverter peak power DC")).toBeDefined();
		expect(screen.getByText("Location of inverter")).toBeDefined();
		expect(screen.getByText("Inverter type", { selector: "legend" })).toBeDefined();
		expect(screen.queryByText("PV shading")).toBeNull();
	});

	it("should error when user submits an empty form", async () => {
		await renderSuspended(PVScreen, {
			route: {
				params: { system: "create" },
			},
		});
		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("peakPower_error"))).toBeDefined();
		expect((await screen.findByTestId("ventilationStrategy_error"))).toBeDefined();
		expect((await screen.findByTestId("pitch_error"))).toBeDefined();
		expect((await screen.findByTestId("orientation_error"))).toBeDefined();
		expect((await screen.findByTestId("elevationalHeight_error"))).toBeDefined();
		expect((await screen.findByTestId("lengthOfPV_error"))).toBeDefined();
		expect((await screen.findByTestId("widthOfPV_error"))).toBeDefined();
		expect((await screen.findByTestId("inverterPeakPowerAC_error"))).toBeDefined();
		expect((await screen.findByTestId("inverterPeakPowerDC_error"))).toBeDefined();
		expect((await screen.findByTestId("inverterIsInside_error"))).toBeDefined();
		expect((await screen.findByTestId("inverterType_error"))).toBeDefined();

		expect((await screen.findByTestId("photovoltaicErrorSummary"))).toBeDefined();
	});

	it("data is saved to store when form is valid", async () => {
		await renderSuspended(PVScreen, {
			route: {
				params: { system: "create" },
			},
		});
		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.pvAndBatteries.pvArrays;

		expect(data[0]).toEqual({ ...pvArray, complete: true });
	});

	it("navigates to pv and batteries page when valid form is completed", async () => {
		await renderSuspended(PVScreen);
		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));
		expect(navigateToMock).toHaveBeenCalledWith("/pv-and-batteries");
	});

	it("navigates to pv and batteries page when save progress button is clicked", async () => {
		await renderSuspended(PVScreen);

		await user.type(screen.getByTestId("name"), "Test PV");
		await user.click(screen.getByTestId("saveProgress"));
		expect(navigateToMock).toHaveBeenCalledWith("/pv-and-batteries");
	});

	describe("partially saving data", () => {
		it("creates a new pv system automatically with given name", async () => {
			await renderSuspended(PVScreen, {
				route: {
					params: { system: "create" },
				},
			});

			await user.type(screen.getByTestId("name"), "New pv system");
			await user.tab();

			const actualPvSystem = store.pvAndBatteries.pvArrays.data[0]!;
			expect(actualPvSystem.data.name).toBe("New pv system");
			expect(actualPvSystem.data.peakPower).toBeUndefined();
			expect(actualPvSystem.data.inverterType).toBeUndefined();
		});

		it("creates a new pv system automatically with default name after other data is entered", async () => {
			await renderSuspended(PVScreen, {
				route: {
					params: { system: "create" },
				},
			});

			await user.type(screen.getByTestId("elevationalHeight"), "7");
			await user.tab();

			const actualPvSystem = store.pvAndBatteries.pvArrays.data[0]!;
			expect(actualPvSystem.data.name).toBe("PV system");
			expect(actualPvSystem.data.peakPower).toBeUndefined();
			expect(actualPvSystem.data.inverterType).toBeUndefined();
			expect(actualPvSystem.data.elevationalHeight).toBe(7);
		});

		it("saves updated form data to correct store object automatically", async () => {
			store.$patch({
				pvAndBatteries: {
					pvArrays: {
						data: [pvArray, pvArray2],
					},
				},
			});

			await renderSuspended(PVScreen, {
				route: {
					params: { system: "1" },
				},
			});

			await user.clear(screen.getByTestId("name"));
			await user.tab();
			await user.clear(screen.getByTestId("peakPower"));
			await user.tab();

			await user.type(screen.getByTestId("name"), "Updated PV 2");
			await user.type(screen.getByTestId("peakPower"), "22");
			await user.tab();

			const actualPvSystem = store.pvAndBatteries.pvArrays.data[1]!;
			expect(actualPvSystem.data.name).toBe("Updated PV 2");
			expect(actualPvSystem.data.peakPower).toBe(22);
		});

		test("pv system and pv systems section are set as 'not complete' after user edits an item", async () => {
			store.$patch({
				pvAndBatteries: {
					pvArrays: {
						data: [{ ...pvArray, complete: true }],
						complete: true,
					},
				},
			});

			await renderSuspended(PVScreen, {
				route: {
					params: { system: "0" },
				},
			});

			await user.type(screen.getByTestId("name"), "PV system");
			await user.tab();

			const pvArrays = store.pvAndBatteries.pvArrays;

			expect(pvArrays.data[0]!.complete).not.toBe(true);
			expect(pvArrays.complete).not.toBe(true);
		});
	});
});
