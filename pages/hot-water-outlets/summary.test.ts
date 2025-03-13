import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import Summary from './summary.vue';
import { screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

interface HotWaterOutletSummary {
	hotWaterDistribution: HotWaterDistributionData[],
}

const state: HotWaterOutletSummary = {
	hotWaterDistribution: [{
		name: 'Pipework 1',
		location: 'internal',
		length: 20,
		internalDiameter: 22
	}]
};

describe('Hot water outlet summary', () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it('should contain the correct tabs for hot water outlet details', async () => {
		await renderSuspended(Summary);
  
		expect(screen.getByRole('link', {name: 'Hot water distribution'}));
	});

	it('should display the correct data for the general specification section', async () => {
		store.$patch({
			hotWaterOutlets: {
				hotWaterDistribution: {
					data: state.hotWaterDistribution
				}
			}
		});

		userEvent.setup();

		await renderSuspended(Summary);

		const expectedResult = {
			"Name": "Pipework 1",
			"Location": "Internal",
			"Length": 20,
			"Internal diameter": 22
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
			expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
		}
	});
});