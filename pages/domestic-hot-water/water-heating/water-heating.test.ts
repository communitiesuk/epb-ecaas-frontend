import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import {screen } from '@testing-library/vue';
import WaterHeating from './index.vue';
import type { HotWaterCylinderData } from "~/stores/ecaasStore.types";
import { liter, Volume } from "~/utils/units/unitsVolume";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});


describe('water heating (hot water cylinder)', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const cylinder: HotWaterCylinderData = {
		id: "Any Id",
		heatSource: "test-heat-pump",
		tankVolume: new Volume(150, liter),
		dailyEnergyLoss: 73,
		name: "Hot water cylinder 1"
	};

	const populateValidForm = async () => {
		await user.click(screen.getByTestId('waterHeaterType_hotWaterCylinder'));
		await user.type(screen.getByTestId('name'), cylinder.name);
		await user.click(screen.getByTestId('heatSource_' + cylinder.heatSource));
		await user.type(screen.getByTestId('tankVolume'), "150");
		await user.type(screen.getByTestId('dailyEnergyLoss'), cylinder.dailyEnergyLoss.toString());
		await user.tab();
	};

	beforeEach(() => {
		store.$patch({
			heatingSystems: {
				heatGeneration: {
					heatPump: {
						data: [{
							id: "test-heat-pump",
							name: "Test Heat Pump"
						}],
						complete: true
					},
				}
			}
		});
	});

	afterEach(() => {
		store.$reset();
	});

	test('data is saved to store state when form is valid', async () => {
		await renderSuspended(WaterHeating);
		
		await populateValidForm();
		await user.click(screen.getByRole('button'));
		
		const actual = store.domesticHotWater.waterHeating.hotWaterCylinder.data![0]!;
		
		expect(actual.id).toBeDefined();
		expect(actual.heatSource).toEqual(cylinder.heatSource);
		expect(actual.tankVolume).toEqual(cylinder.tankVolume);
		expect(actual.dailyEnergyLoss).toEqual(cylinder.dailyEnergyLoss);
		expect(actual.name).toEqual(cylinder.name);
	});

	test('form is prepopulated when data exists in state', async () => {
		store.$patch({
			domesticHotWater: {
				waterHeating: {
					hotWaterCylinder: {
						data: [cylinder],
						complete: true
					}
				}
			}
		});

		await renderSuspended(WaterHeating);

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe(cylinder.name);
		expect((await screen.findByTestId('tankVolume') as HTMLInputElement).value).toBe("150");
		expect((await screen.findByTestId('dailyEnergyLoss') as HTMLInputElement).value).toBe(cylinder.dailyEnergyLoss.toString());
		expect((await screen.findByTestId('heatSource_test-heat-pump')).hasAttribute('checked')).toBe(true);
	});

	test('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(WaterHeating);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('waterHeaterType_error'))).toBeDefined();
		expect((await screen.findByTestId('name_error'))).toBeDefined();
	});

	test('required error messages are displayed when empty hot water cylinder fields are submitted', async () => {
		await renderSuspended(WaterHeating);

		await user.click(screen.getByTestId('waterHeaterType_hotWaterCylinder'));
		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('tankVolume_error'))).toBeDefined();
		expect((await screen.findByTestId('dailyEnergyLoss_error'))).toBeDefined();
		expect((await screen.findByTestId('heatSource_error'))).toBeDefined();
	});

	test('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(WaterHeating);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('waterHeatingErrorSummary'))).toBeDefined();
	});

	it('completes water heating when valid form is completed', async () => {
		await renderSuspended(WaterHeating);
		
		await populateValidForm();
		await user.click(screen.getByRole('button'));
	
		expect(store.domesticHotWater.waterHeating.combiBoiler.complete).toBeTruthy();
		expect(store.domesticHotWater.waterHeating.heatBattery.complete).toBeTruthy();
		expect(store.domesticHotWater.waterHeating.heatInterfaceUnit.complete).toBeTruthy();
		expect(store.domesticHotWater.waterHeating.heatPump.complete).toBeTruthy();
		expect(store.domesticHotWater.waterHeating.hotWaterCylinder.complete).toBeTruthy();
		expect(store.domesticHotWater.waterHeating.immersionHeater.complete).toBeTruthy();
		expect(store.domesticHotWater.waterHeating.pointOfUse.complete).toBeTruthy();
		expect(store.domesticHotWater.waterHeating.smartHotWaterTank.complete).toBeTruthy();
		expect(store.domesticHotWater.waterHeating.solarThermal.complete).toBeTruthy();
	});

	it('navigates to domestic hot water page when valid form is completed', async () => {
		await renderSuspended(WaterHeating);
		
		await populateValidForm();
		await user.click(screen.getByRole('button'));
	
		expect(navigateToMock).toHaveBeenCalledWith('/domestic-hot-water');
	});
});