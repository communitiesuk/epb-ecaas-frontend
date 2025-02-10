import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import Summary from './summary.vue';
import { screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import hyphenate from '../../utils/hyphenate';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

interface DwellingDetailSummary {
	generalSpecifications: GeneralSpecificationsData,
	appliances: AppliancesData,
	shading: Shading,
	externalFactors: ExternalFactorsData
}

const state: DwellingDetailSummary = {
	generalSpecifications: {
		typeOfDwelling: 'house',
		storeysInDwelling: 2,
		numOfBedrooms: 3,
		latitude: 0,
		longitude: 0,
		partGCompliance: "yes",
		coolingRequired: "no",
		heatingControlType: 'seperateTempControl'
	},
	appliances: {
		appliances: [
			'fridge',
			'freezer',
			'fridgeFreezer',
			'dishwasher',
			'oven',
			'washingMachine',
			'tumbleDryer',
			'hobs',
			'kettle',
			'microwave'
		]
	},
	shading: {
		shadingObjects: [{
			name: 'Shading 1',
			direction: 90,
			objectType: 'obstacle',
			height: 1,
			distance: 4
		}]
	},
	externalFactors: {
		altitude: 3,
		typeOfExposure: 'Shielded',
		terrainType: 'Suburban',
		noiseNuisance: 'No'
	}
};

describe('Dwelling details summary', () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it('should contain the correct tabs for dwelling details', async () => {
		await renderSuspended(Summary);
  
		expect(screen.getByRole('link', {name: 'General specifications'}));
		expect(screen.getByRole('link', {name: 'Appliances'}));
		expect(screen.getByRole('link', {name: 'Shading'}));

	});

	it('should select the clicked tab', async () => {
		const user = userEvent.setup();

		const summaryPage = await renderSuspended(Summary);

		await user.click(screen.getByRole('link', {name: 'General specifications'}));

		expect(summaryPage.html()).toContain(`<li class="govuk-tabs__list-item govuk-tabs__list-item--selected"><a class="govuk-tabs__tab" href="#generalSpecifications">General specifications</a></li>`);
		expect(summaryPage.html()).toContain(`<li class="govuk-tabs__list-item"><a class="govuk-tabs__tab" href="#appliances">Appliances</a></li>`);

		await user.click(screen.getByRole('link', {name: 'Appliances'}));

		expect(summaryPage.html()).toContain(`<li class="govuk-tabs__list-item govuk-tabs__list-item--selected"><a class="govuk-tabs__tab" href="#appliances">Appliances</a></li>`);
		expect(summaryPage.html()).toContain(`<li class="govuk-tabs__list-item"><a class="govuk-tabs__tab" href="#generalSpecifications">General specifications</a></li>`);
	});

	it('should display the correct data for the general specification section', async () => {
		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					data: state.generalSpecifications
				}
			}
		});

		userEvent.setup();

		await renderSuspended(Summary);

		const expectedResult = {
			"Type of dwelling": "House",
			"Number of storeys in building": 2,
			"Number of bedrooms": 3,
			"Latitude": 0,
			"Longitude": 0,
			"Part G compliance": "Yes",
			"Cooling required": "No",
			"Heating control type": "Separate temperature control"
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
			expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
		}
	});

	it('should display the correct data for the appliances section', async () => {
		store.$patch({
			dwellingDetails: {
				appliances: {
					data: state.appliances
				}
			}
		});

		userEvent.setup();

		await renderSuspended(Summary);

		const expectedResult = {
			"Appliances": [
				'Fridge',
				'Freezer',
				'Fridge freezer',
				'Dishwasher',
				'Oven',
				'Washing machine',
				'Tumble dryer',
				'Hobs',
				'Kettle',
				'Microwave'
			]
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
			const lineValues = Array.from(lineResult.querySelectorAll("li").values().map(v => v.textContent));

			const result = value.every(v => lineValues.includes(v));

			expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
			expect(result).toBe(true);
		}
	});

	it('should display shading objects in a collapsed accordion', async () => {
		store.$patch({
			dwellingDetails: {
				shading: {
					data: state.shading
				}
			}
		});

		userEvent.setup();

		await renderSuspended(Summary);

		const shadingHeading = await screen.findByTestId('shading_0_heading');
		const shadingToggle = await screen.findByTestId('shading_0_toggle');
		const shadingContent = await screen.findByTestId('shading_0_content');

		expect(shadingHeading.textContent).toBe('Shading 1');
		expect(shadingToggle.textContent).toBe('Show');
		expect(shadingContent.style.display).toBe('');
	});

	it('should display shading data when accordion item is expanded', async () => {
		store.$patch({
			dwellingDetails: {
				shading: {
					data: state.shading
				}
			}
		});

		userEvent.setup();

		await renderSuspended(Summary);

		const shadingButton = await screen.findByTestId('shading_0');

		await userEvent.click(shadingButton);

		const shadingHeading = await screen.findByTestId('shading_0_heading');
		const shadingToggle = await screen.findByTestId('shading_0_toggle');
		const shadingContent = await screen.findByTestId('shading_0_content');

		const expectedResult = {
			"Name": 'Shading 1',
			"Shading direction": '90',
			"Shading type": 'Obstacle',
			"Height": '1',
			"Distance": '4'
		};

		expect(shadingHeading.textContent).toBe('Shading 1');
		expect(shadingToggle.textContent).toBe('Hide');
		expect(shadingContent.style.display).toBe('block');

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
			expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
		}
	});

	it('should display the correct data for the external factors section', async () => {
		store.$patch({
			dwellingDetails: {
				externalFactors: {
					data: state.externalFactors
				}
			}
		});

		userEvent.setup();

		await renderSuspended(Summary);

		const expectedResult = {
			"Altitude": 3,
			"Type of exposure": "Shielded",
			"Terrain type": "Suburban",
			"Noise nuisance": "No"
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
			expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
		}
	});
});