import {mockNuxtImport, renderSuspended} from "@nuxt/test-utils/runtime";
import { screen } from '@testing-library/vue';
import OpenFireplace from './[appliance].vue';
import userEvent from "@testing-library/user-event";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('open fireplace', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const openFireplace: OpenFireplaceData = {
		name: 'Open fireplace 1',
		airSupplyToAppliance: 'roomAir',
		exhaustMethodFromAppliance: 'intoSeparateDuct',
		typeOfFuel: 'coal',
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

		const  { data } = store.infiltrationAndVentilation.combustionAppliances.openFireplace;

		expect(data[0]).toEqual(openFireplace);
	});
});
