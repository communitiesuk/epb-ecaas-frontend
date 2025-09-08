import userEvent from "@testing-library/user-event";
import OpenGasKitchenStove from './[combustion].vue';
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { screen } from "@testing-library/vue";
import { CombustionAirSupplySituation, CombustionApplianceType, CombustionFuelType, FlueGasExhaustSituation } from "~/schema/api-schema.types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('open gas kitchen stove', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const openGasKitchenStove: CombustionApplianceData = {
		name: 'Open gas kitchen stove 1',
		airSupplyToAppliance: CombustionAirSupplySituation.outside,
		exhaustMethodFromAppliance: FlueGasExhaustSituation.into_room,
		typeOfFuel: CombustionFuelType.oil,
	};

	afterEach(() => {
		store.$reset();
	});

	test('data is saved to store state when form is valid', async () => {
		await renderSuspended(OpenGasKitchenStove);

		await user.type(screen.getByTestId('name'), 'Open gas kitchen stove 1');
		await user.click(screen.getByTestId('airSupplyToAppliance_outside'));
		await user.click(screen.getByTestId('exhaustMethodFromAppliance_into_room'));
		await user.click(screen.getByTestId('typeOfFuel_oil'));

		await user.tab();
		await user.click(screen.getByRole('button'));

		const { data } = store.infiltrationAndVentilation.combustionAppliances[CombustionApplianceType.open_gas_kitchen_stove];

		expect(data[0]).toEqual(openGasKitchenStove);
		expect(navigateToMock).toHaveBeenCalledWith('/infiltration-and-ventilation/combustion-appliances');
	});

	test('form is prepopulated when data exists in state', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.open_gas_kitchen_stove]: {
						data: [openGasKitchenStove]
					}
				}
			}
		});

		await renderSuspended(OpenGasKitchenStove, {
			route: {
				params: { combustion: '0' }
			}
		});

		expect((await screen.findByTestId<HTMLInputElement>('name')).value).toBe('Open gas kitchen stove 1');
		expect((await screen.findByTestId('airSupplyToAppliance_outside')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('exhaustMethodFromAppliance_into_room')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('typeOfFuel_oil')).hasAttribute('checked')).toBe(true);
	});

	test('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(OpenGasKitchenStove);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('airSupplyToAppliance_error'))).toBeDefined();
		expect((await screen.findByTestId('exhaustMethodFromAppliance_error'))).toBeDefined();
		expect((await screen.findByTestId('typeOfFuel_error'))).toBeDefined();
	});
});
