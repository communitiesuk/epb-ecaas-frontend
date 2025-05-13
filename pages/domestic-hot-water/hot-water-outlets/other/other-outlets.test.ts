import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import OtherOutlet from './[outlet].vue';
import { v4 as uuidv4 } from 'uuid';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

vi.mock('uuid');

describe('other outlets', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const outlet: OtherHotWaterOutletData = {
		id: '0b77e247-53c5-42b8-9dbd-83cbfc8c8a9e',
		name: "Basin tap 1",
		flowRate: 10
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Basin tap 1');
		await user.type(screen.getByTestId('flowRate'), '10');
		await user.tab();
	};

	it('data is saved to store state when form is valid', async () => {
		vi.mocked(uuidv4).mockReturnValue(outlet.id as unknown as Buffer);

		await renderSuspended(OtherOutlet);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { data } = store.domesticHotWater.hotWaterOutlets.otherOutlets;
		
		expect(data[0]).toEqual(outlet);
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			domesticHotWater: {
				hotWaterOutlets: {
					otherOutlets: {
						data: [outlet]
					}
				}
			}
		});

		await renderSuspended(OtherOutlet, {
			route: {
				params: { 'outlet': '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Basin tap 1');
		expect((await screen.findByTestId('flowRate') as HTMLInputElement).value).toBe('10');
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(OtherOutlet);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('flowRate_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(OtherOutlet);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('otherOutletsErrorSummary'))).toBeDefined();
	});

	it('navigates to hot water outlets page when valid form is completed', async () => {
		await renderSuspended(OtherOutlet);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));
		
		expect(navigateToMock).toHaveBeenCalledWith('/domestic-hot-water/hot-water-outlets');
	});
});