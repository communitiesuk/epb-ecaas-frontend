import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import HotWaterDistribution from './index.vue';

const state: HotWaterDistributionData = {
	name: 'Pipework Kitchen Sink',
	length: 3,
	location: 'internal',
	internalDiameter: 30,
	externalDiameter: 33,
	insulationThickness: 10,
	insulationThermalConductivity: 35,
	pipeContents: 'air',
	surfaceReflectivity: 'yes',
}

describe('Hot water distribution', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	it('distribution is removed when remove link is clicked', async () => {
		store.$patch({
			dwellingDetails: {
				hotWaterDistribution: {
					data: {
						distributions: [state]
					}
				}
			}
		});

		await renderSuspended(HotWaterDistribution);

		const populatedList = screen.queryByTestId('customListItems');

		await user.click(screen.getByTestId('customListItemRemove_0'));

		expect(populatedList).toBeDefined();
		expect(screen.queryByTestId('customListItems')).toBeNull();
	});

	it('duplicates distribution in list when duplicate link is clicked', async () => {
		store.$patch({
			dwellingDetails: {
				hotWaterDistribution: {
					data: {
						distributions: [state]
					}
				}
			}
		});

		await renderSuspended(HotWaterDistribution);

		await user.click(screen.getByTestId('customListItemDuplicate_0'));

		expect(screen.queryAllByTestId('customListItem').length).toBe(2);
		expect(screen.getByText('Pipework Kitchen Sink (1)')).toBeDefined();
	});
});
