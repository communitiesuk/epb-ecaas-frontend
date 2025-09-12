import ElectricBattery from "./index.vue";
import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";
import type { ElectricBatteryData } from "~/stores/ecaasStore.schema";
import { BatteryLocation } from "~/schema/api-schema.types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("Electric battery", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	const fullElectricBattery: EcaasForm<ElectricBatteryData> = {
		data: {
			name: "Acme battery mk II",
			capacity: 40,
			batteryAge: 12,
			chargeEfficiency: 0.9,
			location: BatteryLocation.inside,
			gridChargingPossible: false,
			maximumChargeRate: 30,
			minimumChargeRate: 20,
			maximumDischargeRate: 35,
		},
	};

	const fillForm = async () => {
		await user.type(screen.getByTestId("name"), "Acme battery mk II");
		await user.type(screen.getByTestId("capacity"), "40");
		await user.type(screen.getByTestId("batteryAge"), "12");
		await user.type(screen.getByTestId("chargeEfficiency"), "0.9");
		await user.click(screen.getByTestId("location_inside"));
		await user.click(screen.getByTestId("gridChargingPossible_no"));
		await user.type(screen.getByTestId("maximumChargeRate"), "30");
		await user.type(screen.getByTestId("minimumChargeRate"), "20");
		await user.type(screen.getByTestId("maximumDischargeRate"), "35");

		await user.tab();
	};

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(ElectricBattery);

		await fillForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.pvAndBatteries.electricBattery;

		expect(data[0]).toEqual({ ...fullElectricBattery, complete: true });
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(ElectricBattery);
    
		await user.click(screen.getByTestId("saveAndComplete"));
    
		expect((await screen.findByTestId("electricBatteryErrorSummary"))).toBeDefined();
	});

	it("navigates to pv and batteries page when valid form is completed", async () => {
		await renderSuspended(ElectricBattery);
        
		await fillForm();
		await user.click(screen.getByTestId("saveAndComplete"));
    
		expect(navigateToMock).toHaveBeenCalledWith("/pv-and-batteries");
	});

	it("navigates to pv and batteries page when save progress button is clicked", async () => {
		await renderSuspended(ElectricBattery);

		await user.type(screen.getByTestId("name"), "Test battery");
		await user.click(screen.getByTestId("saveProgress"));
		expect(navigateToMock).toHaveBeenCalledWith("/pv-and-batteries");
	});

	it("shows an error when maximum charge level is less than minimum charge level", async () => {
		await renderSuspended(ElectricBattery);
        
		await user.type(screen.getByTestId("name"), "Acme battery mk II");
		await user.type(screen.getByTestId("capacity"), "40");
		await user.type(screen.getByTestId("batteryAge"), "12");
		await user.type(screen.getByTestId("chargeEfficiency"), "0.9");
		await user.click(screen.getByTestId("location_inside"));
		await user.click(screen.getByTestId("gridChargingPossible_no"));
		await user.type(screen.getByTestId("maximumChargeRate"), "15");
		await user.type(screen.getByTestId("minimumChargeRate"), "25");
		await user.type(screen.getByTestId("maximumDischargeRate"), "35");

		await user.tab();

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("electricBatteryErrorSummary"))).toBeDefined();
	});

	it("shows an error if charge efficiency is outside the range", async () => {
		await renderSuspended(ElectricBattery);
        
		await user.type(screen.getByTestId("name"), "Acme battery mk II");
		await user.type(screen.getByTestId("capacity"), "40");
		await user.type(screen.getByTestId("batteryAge"), "12");
		await user.type(screen.getByTestId("chargeEfficiency"), "2.9");
		await user.click(screen.getByTestId("location_inside"));
		await user.click(screen.getByTestId("gridChargingPossible_no"));
		await user.type(screen.getByTestId("maximumChargeRate"), "25");
		await user.type(screen.getByTestId("minimumChargeRate"), "15");
		await user.type(screen.getByTestId("maximumDischargeRate"), "35");

		await user.tab();

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("electricBatteryErrorSummary"))).toBeDefined();
	});

	describe("partially saving data", () => {
		it("creates a new battery automatically with given name", async () => {
			await renderSuspended(ElectricBattery);

			await user.type(screen.getByTestId("name"), "New battery");
			await user.tab();

			const actualBattery = store.pvAndBatteries.electricBattery.data[0]!;

			expect(actualBattery.data.name).toBe("New battery");
			expect(actualBattery.data.capacity).toBeUndefined();
			expect(actualBattery.data.location).toBeUndefined();
		});

		it("creates a new battery automatically with default name after other data is entered", async () => {
			await renderSuspended(ElectricBattery);

			await user.type(screen.getByTestId("chargeEfficiency"), "1");
			await user.tab();

			const actualBattery = store.pvAndBatteries.electricBattery.data[0]!;

			expect(actualBattery.data.name).toBe("Electric battery");
			expect(actualBattery.data.chargeEfficiency).toBe(1);
			expect(actualBattery.data.capacity).toBeUndefined();
			expect(actualBattery.data.location).toBeUndefined();
		});

		it("automatically saves updated from data to store", async () => {
			store.$patch({
				pvAndBatteries: {
					electricBattery: {
						data: [fullElectricBattery],
					},
				},
			});

			await renderSuspended(ElectricBattery);

			await user.clear(screen.getByTestId("name"));
			await user.clear(screen.getByTestId("capacity"));

			await user.type(screen.getByTestId("name"), "Updated battery");
			await user.type(screen.getByTestId("capacity"), "12");
			await user.tab();

			const actualBattery = store.pvAndBatteries.electricBattery.data[0]!;

			expect(actualBattery.data.name).toBe("Updated battery");
			expect(actualBattery.data.capacity).toBe(12);
		});

		test("battery and section are set as 'not complete' after user edits an item", async () => {
			store.$patch({
				pvAndBatteries: {
					electricBattery: {
						data: [{ ...fullElectricBattery, complete: true }],
						complete: true,
					},
				},
			});

			await renderSuspended(ElectricBattery, {
				route: {
					params: { electricBattery: "0" },
				},
			});

			await user.type(screen.getByTestId("name"), "Battery");
			await user.tab();

			const batteries = store.pvAndBatteries.electricBattery;

			expect(batteries.data[0]!.complete).not.toBe(true);
			expect(batteries.complete).not.toBe(true);
		});
	});
});