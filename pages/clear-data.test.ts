import {mockNuxtImport, renderSuspended} from "@nuxt/test-utils/runtime";
import ClearData from './clear-data.vue';
import {screen} from '@testing-library/vue';
import userEvent from "@testing-library/user-event";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('clear data page', () => {
	it('renders page correctly', async () => {
		await renderSuspended(ClearData);

		expect(screen.getByTestId('clearDataPanel')).toBeDefined();
		expect(screen.getByTestId('clearDataButton')).toBeDefined();
		expect(screen.getByTestId('taskListLink')).toBeDefined();
		expect(screen.getByTestId('backLink')).toBeDefined();
	});

	it('clears state and navigates to task list when clear data button is clicked', async () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const state: DwellingSpaceZoneParametersData = {
			area: 10,
			volume: 10,
			numberOfLEDBulbs: 5,
			numberOfIncandescentBulbs: 2,
			spaceCoolingSystemForThisZone: [],
			spaceHeatControlSystemForThisZone: []
		};

		store.$patch({
			dwellingFabric: {
				dwellingSpaceZoneParameters: {
					data: state,
					complete: true
				}
			},
		});

		await renderSuspended(ClearData);

		await user.click(screen.getByRole('button', { name: /Clear data/}));

		expect(store.dwellingFabric.dwellingSpaceZoneParameters).toStrictEqual({ data: {} });
		expect(navigateToMock).toBeCalledWith('/');
	});

	it('navigates to task list when back link is clicked', async () => {
		const user = userEvent.setup();
		
		await renderSuspended(ClearData);

		await user.click(screen.getByTestId('backLink'));

		expect(navigateToMock).toBeCalledWith('/');
	});

	it('navigates to task list when go back to task list link is clicked', async () => {
		const user = userEvent.setup();
		
		await renderSuspended(ClearData);

		await user.click(screen.getByTestId('taskListLink'));

		expect(navigateToMock).toBeCalledWith('/');
	});
});