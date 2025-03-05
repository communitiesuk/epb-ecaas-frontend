import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import Summary from './summary.vue';
import { screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

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
});