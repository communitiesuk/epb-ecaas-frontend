import ElectricBattery from "./[battery].vue";
import { screen } from '@testing-library/vue';
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import { userEvent } from '@testing-library/user-event';
import type { ElectricBatteryData } from '~/stores/ecaasStore.types';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('Electric battery', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	const fullElectricBattery: ElectricBatteryData = {
		name: 'Acme battery mk II',
		capacity: 40,
		batteryAge: 12,
		chargeEfficiency: 0.9,
		location: 'inside',
		gridChargingPossible: 'no',
		maximumChargeRate: 30,
		minimumChargeRate: 20,
		maximumDischargeRate: 35
	};

	const fillForm = async () => {
		await user.type(screen.getByTestId('name'), 'Acme battery mk II');
		await user.type(screen.getByTestId('capacity'), '40');
		await user.type(screen.getByTestId('batteryAge'), '12');
		await user.type(screen.getByTestId('chargeEfficiency'), '0.9');
		await user.click(screen.getByTestId('location_inside'));
		await user.click(screen.getByTestId('gridChargingPossible_no'));
		await user.type(screen.getByTestId('maximumChargeRate'), '30');
		await user.type(screen.getByTestId('minimumChargeRate'), '20');
		await user.type(screen.getByTestId('maximumDischargeRate'), '35');

		await user.tab();
	};

	test('data is saved to store state when form is valid', async () => {
		await renderSuspended(ElectricBattery);

		await fillForm();
		await user.click(screen.getByRole('button'));

		const { data } = store.pvAndBatteries.electricBattery;

		expect(data[0]).toEqual(fullElectricBattery);
	});

	test('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(ElectricBattery);
    
		await user.click(screen.getByRole('button'));
    
		expect((await screen.findByTestId('electricBatteryErrorSummary'))).toBeDefined();
	});

	it('navigates to heating systems page when valid form is completed', async () => {
		await renderSuspended(ElectricBattery);
        
		await fillForm();
		await user.click(screen.getByRole('button'));
    
		expect(navigateToMock).toHaveBeenCalledWith('/pv-and-batteries');
	});

	it('shows an error when maximum charge level is less than minimum charge level', async () => {
		await renderSuspended(ElectricBattery);
        
		await user.type(screen.getByTestId('name'), 'Acme battery mk II');
		await user.type(screen.getByTestId('capacity'), '40');
		await user.type(screen.getByTestId('batteryAge'), '12');
		await user.type(screen.getByTestId('chargeEfficiency'), '0.9');
		await user.click(screen.getByTestId('location_inside'));
		await user.click(screen.getByTestId('gridChargingPossible_no'));
		await user.type(screen.getByTestId('maximumChargeRate'), '15');
		await user.type(screen.getByTestId('minimumChargeRate'), '25');
		await user.type(screen.getByTestId('maximumDischargeRate'), '35');

		await user.tab();

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('electricBatteryErrorSummary'))).toBeDefined();
	});

	it('shows an error if charge efficiency is outside the range', async () => {
		await renderSuspended(ElectricBattery);
        
		await user.type(screen.getByTestId('name'), 'Acme battery mk II');
		await user.type(screen.getByTestId('capacity'), '40');
		await user.type(screen.getByTestId('batteryAge'), '12');
		await user.type(screen.getByTestId('chargeEfficiency'), '2.9');
		await user.click(screen.getByTestId('location_inside'));
		await user.click(screen.getByTestId('gridChargingPossible_no'));
		await user.type(screen.getByTestId('maximumChargeRate'), '25');
		await user.type(screen.getByTestId('minimumChargeRate'), '15');
		await user.type(screen.getByTestId('maximumDischargeRate'), '35');

		await user.tab();

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('electricBatteryErrorSummary'))).toBeDefined();
	});
});