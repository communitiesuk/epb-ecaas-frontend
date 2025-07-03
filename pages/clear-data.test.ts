import {renderSuspended} from "@nuxt/test-utils/runtime";
import ClearData from './clear-data.vue';
import {screen} from '@testing-library/vue';
import userEvent from "@testing-library/user-event";

describe('clear data page', () => {
	it('renders page correctly', async () => {
		await renderSuspended(ClearData);

		expect(screen.getByTestId('clearDataPanel')).toBeDefined();
		expect(screen.getByTestId('clearDataButton')).toBeDefined();
		expect(screen.getByTestId('taskListLink')).toBeDefined();
	});

	it('clears state when clear data button is clicked', async () => {
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

		expect(await store.dwellingFabric.dwellingSpaceZoneParameters).toStrictEqual({ data: {} });
	});
});