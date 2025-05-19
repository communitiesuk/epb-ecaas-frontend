import {mockNuxtImport, renderSuspended} from "@nuxt/test-utils/runtime";
import {screen} from '@testing-library/vue';
import OpenFireplace from './[combustion].vue';
import userEvent from "@testing-library/user-event";
import { CombustionFuelType } from "~/schema/api-schema.types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('open fireplace', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const openFireplace: CombustionApplianceData = {
		name: 'Open fireplace 1',
		airSupplyToAppliance: 'roomAir',
		exhaustMethodFromAppliance: 'intoSeparateDuct',
		typeOfFuel: CombustionFuelType.coal,
	};

	afterEach(() => {
		store.$reset();
	});

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(OpenFireplace);

		await user.type(screen.getByTestId('name'), 'Open fireplace 1');
		await user.click(screen.getByTestId('airSupplyToAppliance_roomAir'));
		await user.click(screen.getByTestId('exhaustMethodFromAppliance_intoSeparateDuct'));
		await user.click(screen.getByTestId('typeOfFuel_coal'));

		await user.tab();
		await user.click(screen.getByRole('button'));

		const {data} = store.infiltrationAndVentilation.combustionAppliances.openFireplace;

		expect(data[0]).toEqual(openFireplace);
		expect(navigateToMock).toHaveBeenCalledWith('/infiltration-and-ventilation/combustion-appliances');
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					openFireplace: {
						data: [openFireplace]
					}
				}
			}
		});

		await renderSuspended(OpenFireplace, {
			route: {
				params: {combustion: '0'}
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Open fireplace 1');
		expect((await screen.findByTestId('airSupplyToAppliance_roomAir')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('exhaustMethodFromAppliance_intoSeparateDuct')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('typeOfFuel_coal')).hasAttribute('checked')).toBe(true);
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(OpenFireplace);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('airSupplyToAppliance_error'))).toBeDefined();
		expect((await screen.findByTestId('exhaustMethodFromAppliance_error'))).toBeDefined();
		expect((await screen.findByTestId('typeOfFuel_error'))).toBeDefined();
	});
});
