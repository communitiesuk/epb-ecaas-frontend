import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import ElectricShower from './[shower].vue';
import { v4 as uuidv4 } from 'uuid';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

vi.mock('uuid');

describe('electric shower', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const electricShower: ElectricShowerData = {
		id: '0b77e247-53c5-42b8-9dbd-83cbfc8c8a9e',
		name: 'Electric shower 1',
		ratedPower: 10
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Electric shower 1');
		await user.type(screen.getByTestId('ratedPower'), '10');
		await user.tab();
	};

	it('data is saved to store state when form is valid', async () => {
		vi.mocked(uuidv4).mockReturnValue(electricShower.id as unknown as Buffer);

		await renderSuspended(ElectricShower);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { data } = store.domesticHotWater.hotWaterOutlets.electricShower;
		
		expect(data[0]).toEqual(electricShower);
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			domesticHotWater: {
				hotWaterOutlets: {
					electricShower: {
						data: [electricShower]
					}
				}
			}
		});

		await renderSuspended(ElectricShower, {
			route: {
				params: { 'shower': '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Electric shower 1');
		expect((await screen.findByTestId('ratedPower') as HTMLInputElement).value).toBe('10');
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(ElectricShower);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('ratedPower_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(ElectricShower);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('electricShowerErrorSummary'))).toBeDefined();
	});

	it('navigates to hot water outlets page when valid form is completed', async () => {
		await renderSuspended(ElectricShower);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		expect(navigateToMock).toHaveBeenCalledWith('/domestic-hot-water/hot-water-outlets');
	});
});