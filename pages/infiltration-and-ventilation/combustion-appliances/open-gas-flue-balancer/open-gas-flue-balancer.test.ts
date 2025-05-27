import userEvent from "@testing-library/user-event";
import OpenGasFlueBalancer from './[combustion].vue';
import { CombustionAirSupplySituation, CombustionApplianceType, CombustionFuelType, FlueGasExhaustSituation } from "~/schema/api-schema.types";
import {mockNuxtImport, renderSuspended} from "@nuxt/test-utils/runtime";
import {screen} from "@testing-library/vue";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('open gas flue balancer', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const openGasFlueBalancer: CombustionApplianceData = {
		name: 'Open gas flue balancer 1',
		airSupplyToAppliance: CombustionAirSupplySituation.outside,
		exhaustMethodFromAppliance: FlueGasExhaustSituation.into_room,
		typeOfFuel: CombustionFuelType.gas,
	};

	afterEach(() => {
		store.$reset();
	});

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(OpenGasFlueBalancer);

		await user.type(screen.getByTestId('name'), 'Open gas flue balancer 1');
		await user.click(screen.getByTestId('airSupplyToAppliance_outside'));
		await user.click(screen.getByTestId('exhaustMethodFromAppliance_into_room'));
		await user.click(screen.getByTestId('typeOfFuel_gas'));

		await user.tab();
		await user.click(screen.getByRole('button'));

		const {data} = store.infiltrationAndVentilation.combustionAppliances[CombustionApplianceType.open_gas_flue_balancer];

		expect(data[0]).toEqual(openGasFlueBalancer);
		expect(navigateToMock).toHaveBeenCalledWith('/infiltration-and-ventilation/combustion-appliances');
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.open_gas_flue_balancer]: {
						data: [openGasFlueBalancer]
					}
				}
			}
		});

		await renderSuspended(OpenGasFlueBalancer, {
			route: {
				params: {combustion: '0'}
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Open gas flue balancer 1');
		expect((await screen.findByTestId('airSupplyToAppliance_outside')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('exhaustMethodFromAppliance_into_room')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('typeOfFuel_gas')).hasAttribute('checked')).toBe(true);
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(OpenGasFlueBalancer);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('airSupplyToAppliance_error'))).toBeDefined();
		expect((await screen.findByTestId('exhaustMethodFromAppliance_error'))).toBeDefined();
		expect((await screen.findByTestId('typeOfFuel_error'))).toBeDefined();
	});
});
