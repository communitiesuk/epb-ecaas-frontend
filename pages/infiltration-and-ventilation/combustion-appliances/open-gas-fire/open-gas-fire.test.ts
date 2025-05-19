import userEvent from "@testing-library/user-event";
import OpenGasFire from './[combustion].vue';
import {mockNuxtImport, renderSuspended} from "@nuxt/test-utils/runtime";
import {screen} from "@testing-library/vue";
import { CombustionFuelType } from "~/schema/api-schema.types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('open gas fire', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const openGasFire: CombustionApplianceData = {
		name: 'Open gas fire 1',
		airSupplyToAppliance: 'outside',
		exhaustMethodFromAppliance: 'intoMechanicalVent',
		typeOfFuel: CombustionFuelType.oil,
	};

	afterEach(() => {
		store.$reset();
	});

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(OpenGasFire);

		await user.type(screen.getByTestId('name'), 'Open gas fire 1');
		await user.click(screen.getByTestId('airSupplyToAppliance_outside'));
		await user.click(screen.getByTestId('exhaustMethodFromAppliance_intoMechanicalVent'));
		await user.click(screen.getByTestId('typeOfFuel_oil'));

		await user.tab();
		await user.click(screen.getByRole('button'));

		const {data} = store.infiltrationAndVentilation.combustionAppliances.openGasFire;

		expect(data[0]).toEqual(openGasFire);
		expect(navigateToMock).toHaveBeenCalledWith('/infiltration-and-ventilation/combustion-appliances');
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					openGasFire: {
						data: [openGasFire]
					}
				}
			}
		});

		await renderSuspended(OpenGasFire, {
			route: {
				params: {combustion: '0'}
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Open gas fire 1');
		expect((await screen.findByTestId('airSupplyToAppliance_outside')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('exhaustMethodFromAppliance_intoMechanicalVent')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('typeOfFuel_oil')).hasAttribute('checked')).toBe(true);
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(OpenGasFire);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('airSupplyToAppliance_error'))).toBeDefined();
		expect((await screen.findByTestId('exhaustMethodFromAppliance_error'))).toBeDefined();
		expect((await screen.findByTestId('typeOfFuel_error'))).toBeDefined();
	});
});
