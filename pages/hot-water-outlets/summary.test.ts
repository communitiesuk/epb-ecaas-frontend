import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import Summary from './summary.vue';
import { screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import hyphenate from '../../utils/hyphenate';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

interface HotWaterOutletSummary {
	hotWaterDistribution: HotWaterDistribution,
}

const state: HotWaterOutletSummary = {
	hotWaterDistribution: {
		distributions: [{
			name: 'Pipework 1',
			location: 'internal',
			length: 20,
			internalDiameter: 22,
			externalDiameter: 22,
			insulationThickness: 19,
			insulationThermalConductivity: 0.035,
			surfaceReflectivity: 'no',
			pipeContents: 'water'
		}]
	}
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

	it('should select the clicked tab', async () => {
		const user = userEvent.setup();

		const summaryPage = await renderSuspended(Summary);

		await user.click(screen.getByRole('link', {name: 'Hot water distribution'}));

		expect(summaryPage.html()).toContain(`<li class="govuk-tabs__list-item govuk-tabs__list-item--selected"><a class="govuk-tabs__tab" href="#hotWaterDistribution">Hot water distribution</a></li>`);

	});

	it('should display hot water distributions in a collapsed accordion', async () => {
		store.$patch({
			hotWaterOutlets: {
				hotWaterDistribution: {
					data: state.hotWaterDistribution
				}
			}
		});

		userEvent.setup();

		await renderSuspended(Summary);

		const distributionHeading = await screen.findByTestId('hotWaterDistribution_0_heading');
		const distributionToggle = await screen.findByTestId('hotWaterDistribution_0_toggle');
		const distributionContent = await screen.findByTestId('hotWaterDistribution_0_content');

		expect(distributionHeading.textContent).toBe('Pipework 1');
		expect(distributionToggle.textContent).toBe('Show');
		expect(distributionContent.style.display).toBe('');
	});

	it('should display hot water distribution data when accordion item is expanded', async () => {
		store.$patch({
			hotWaterOutlets: {
				hotWaterDistribution: {
					data: state.hotWaterDistribution
				}
			}
		});

		userEvent.setup();

		await renderSuspended(Summary);

		const distributionButton = await screen.findByTestId('hotWaterDistribution_0');

		await userEvent.click(distributionButton);

		const distributionHeading = await screen.findByTestId('hotWaterDistribution_0_heading');
		const distributionToggle = await screen.findByTestId('hotWaterDistribution_0_toggle');
		const distributionContent = await screen.findByTestId('hotWaterDistribution_0_content');

		const expectedResult = {
			"Name": 'Pipework 1',
			"Location": 'Internal',
			"Length": '30',
			"Internal diameter": '22',
			"External diameter": '22',
			"Insulation thickness": '19',
			"Insulation thermal conductivity": '0.035',
			"Reflective insulation": 'No',
			"Pipe contents": 'Water'
		};

		expect(distributionHeading.textContent).toBe('Pipework 1');
		expect(distributionToggle.textContent).toBe('Hide');
		expect(distributionContent.style.display).toBe('block');

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
			expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
		}
	});
});