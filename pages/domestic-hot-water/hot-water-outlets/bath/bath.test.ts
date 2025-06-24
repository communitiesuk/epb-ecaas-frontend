import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import Bath from './[bath].vue';
import { v4 as uuidv4 } from 'uuid';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

vi.mock('uuid');

describe('bath', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const bath: BathData = {
		id: '0b77e247-53c5-42b8-9dbd-83cbfc8c8a9e',
		name: 'Bath 1',
		size: 170,
		flowRate: 10
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Bath 1');
		await user.type(screen.getByTestId('size'), '170');
		await user.type(screen.getByTestId('flowRate'), '10');
		await user.tab();
	};

	test('data is saved to store state when form is valid', async () => {
		vi.mocked(uuidv4).mockReturnValue(bath.id as unknown as Buffer);

		await renderSuspended(Bath);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { data } = store.domesticHotWater.hotWaterOutlets.bath;
		
		expect(data[0]).toEqual(bath);
	});

	test('form is prepopulated when data exists in state', async () => {
		store.$patch({
			domesticHotWater: {
				hotWaterOutlets: {
					bath: {
						data: [bath]
					}
				}
			}
		});

		await renderSuspended(Bath, {
			route: {
				params: { 'bath': '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Bath 1');
		expect((await screen.findByTestId('size') as HTMLInputElement).value).toBe('170');
		expect((await screen.findByTestId('flowRate') as HTMLInputElement).value).toBe('10');
	});

	test('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(Bath);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('size_error'))).toBeDefined();
		expect((await screen.findByTestId('flowRate_error'))).toBeDefined();
	});

	test('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(Bath);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('bathErrorSummary'))).toBeDefined();
	});

	it('navigates to hot water outlets page when valid form is completed', async () => {
		await renderSuspended(Bath);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		expect(navigateToMock).toHaveBeenCalledWith('/domestic-hot-water/hot-water-outlets');
	});
});