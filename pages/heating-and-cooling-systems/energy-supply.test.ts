import EnergySupply from "./energy-supply.vue";
import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";
import type { EnergySupplyData } from "~/stores/ecaasStore.schema";
import { FuelType } from "~/schema/api-schema.types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("Energy supply", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	const energySupplyWithElectricity: EnergySupplyData = {
		fuelType: [FuelType.electricity],
		exported: true,
	};

	const _energySupplyWithCustom: EnergySupplyData = {
		fuelType: [FuelType.custom],
		co2PerKwh: 1,
		co2PerKwhIncludingOutOfScope: 1,
		kwhPerKwhDelivered: 1,
	};

	describe("when fuel type is electricity", () => {
		test("data is saved to store state when form is valid", async () => {
			await renderSuspended(EnergySupply);

			await user.click(screen.getByTestId("fuelType_electricity"));
			await user.click(screen.getByTestId("exported_yes"));
			await user.click(screen.getByTestId("saveAndComplete"));

			const { data } = store.heatingAndCoolingSystems.energySupply;

			expect(data).toEqual(energySupplyWithElectricity);
		});

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				heatingAndCoolingSystems: {
					energySupply: {
						data: energySupplyWithElectricity,
					},
				},
			});

			await renderSuspended(EnergySupply);

			expect((await screen.findByTestId("fuelType_electricity")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId("exported_yes")).hasAttribute("checked")).toBe(true);
		});

		test("required error messages are displayed when empty form is submitted", async () => {
			await renderSuspended(EnergySupply);

			await user.click(screen.getByTestId("fuelType_electricity"));
			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("exported_error"))).toBeDefined();
		});
	});

	// describe('when fuel type is custom', () => {
	// 	test('data is saved to store state when form is valid', async () => {
	// 		await renderSuspended(EnergySupply);

	// 		await user.click(screen.getByTestId('fuelType_custom'));
	// 		await user.type(screen.getByTestId('co2PerKwh'), '1');
	// 		await user.type(screen.getByTestId('co2PerKwhIncludingOutOfScope'), '1');
	// 		await user.type(screen.getByTestId('kwhPerKwhDelivered'), '1');
	// 		await user.click(screen.getByRole('button'));

	// 		const { data } = store.heatingAndCoolingSystems.energySupply;

	// 		expect(data).toEqual(energySupplyWithCustom);
	// 	});

	// 	test('form is prepopulated when data exists in state', async () => {
	// 		store.$patch({
	// 			heatingAndCoolingSystems: {
	// 				energySupply: {
	// 					data: energySupplyWithCustom
	// 				}
	// 			}
	// 		});

	// 		await renderSuspended(EnergySupply);

	// 		expect((await screen.findByTestId('fuelType_custom')).hasAttribute('checked')).toBe(true);
	// 		expect((await screen.findByTestId<HTMLInputElement>('co2PerKwh')).value).toBe('1');
	// 		expect((await screen.findByTestId<HTMLInputElement>('co2PerKwhIncludingOutOfScope')).value).toBe('1');
	// 		expect((await screen.findByTestId<HTMLInputElement>('kwhPerKwhDelivered')).value).toBe('1');
	// 	});

	// 	test('required error messages are displayed when empty form is submitted', async () => {
	// 		await renderSuspended(EnergySupply);

	// 		await user.click(screen.getByTestId('fuelType_custom'));
	// 		await user.click(screen.getByRole('button'));

	// 		expect((await screen.findByTestId('co2PerKwh_error'))).toBeDefined();
	// 		expect((await screen.findByTestId('co2PerKwhIncludingOutOfScope_error'))).toBeDefined();
	// 		expect((await screen.findByTestId('kwhPerKwhDelivered_error'))).toBeDefined();
	// 	});
	// });
});

describe("saving form updates", () => {
	test("updated form data is automatically saved to store ", async () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		store.$patch({
			heatingAndCoolingSystems: {
				energySupply: {
					data: { fuelType: [FuelType.electricity], exported: true },
				},
			},
		});

		await renderSuspended(EnergySupply);
		await user.click(screen.getByTestId("exported_no"));
		expect(store.heatingAndCoolingSystems.energySupply.data.exported).toBe(false);
	});
});
