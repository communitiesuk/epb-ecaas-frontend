import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import Summary from './summary.vue';
import { screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import type { PipeworkData } from '~/stores/ecaasStore.types';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

const pipework: PipeworkData = {
	name: 'Pipework 1',
	location: 'internal',
	length: 20,
	internalDiameter: 22
};

describe('Domestic hot water summary', () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it('should contain the correct tabs for pipework details', async () => {
		await renderSuspended(Summary);
  
		expect(screen.getByRole('link', {name: 'Primary pipework'}));
		expect(screen.getByRole('link', {name: 'Secondary pipework'}));
	});

	it('should display the correct data for the primary pipework section', async () => {
		store.$patch({
			domesticHotWater: {
				pipework: {
					primaryPipework: {
						data: [pipework]
					}
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