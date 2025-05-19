import userEvent from "@testing-library/user-event";
import ClosedFireplaceWithFan from './[combustion].vue';
import {mockNuxtImport, renderSuspended} from "@nuxt/test-utils/runtime";
import {screen} from "@testing-library/vue";
import { CombustionFuelType } from "~/schema/api-schema.types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('closed fireplace with fan', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const closedFireplace: CombustionApplianceData = {
		name: 'Closed fireplace',
		airSupplyToAppliance: 'roomAir',
		exhaustMethodFromAppliance: 'intoSeparateDuct',
		typeOfFuel: CombustionFuelType.wood,
	};

	afterEach(() => {
		store.$reset();
	});

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(ClosedFireplaceWithFan);

		await user.type(screen.getByTestId('name'), 'Closed fireplace');
		await user.click(screen.getByTestId('airSupplyToAppliance_roomAir'));
		await user.click(screen.getByTestId('exhaustMethodFromAppliance_intoSeparateDuct'));
		await user.click(screen.getByTestId('typeOfFuel_wood'));

		await user.tab();
		await user.click(screen.getByRole('button'));

		const {data} = store.infiltrationAndVentilation.combustionAppliances.closedFireplaceWithFan;

		expect(data[0]).toEqual(closedFireplace);
		expect(navigateToMock).toHaveBeenCalledWith('/infiltration-and-ventilation/combustion-appliances');
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					closedFireplaceWithFan: {
						data: [closedFireplace]
					}
				}
			}
		});

		await renderSuspended(ClosedFireplaceWithFan, {
			route: {
				params: {combustion: '0'}
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Closed fireplace');
		expect((await screen.findByTestId('airSupplyToAppliance_roomAir')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('exhaustMethodFromAppliance_intoSeparateDuct')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('typeOfFuel_wood')).hasAttribute('checked')).toBe(true);
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(ClosedFireplaceWithFan);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('airSupplyToAppliance_error'))).toBeDefined();
		expect((await screen.findByTestId('exhaustMethodFromAppliance_error'))).toBeDefined();
		expect((await screen.findByTestId('typeOfFuel_error'))).toBeDefined();
	});
});
