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
	shading: ShadingData[],
	externalFactors: ExternalFactorsData
}

const state: DwellingDetailSummary = {
	generalSpecifications: {
		typeOfDwelling: 'house',
		storeysInDwelling: 2,
		numOfBedrooms: 3,
		partGCompliance: "yes",
		coolingRequired: "no",
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
	shading: [{
		name: 'Shading 1',
		startAngle: 0,
		endAngle: 90,
		objectType: 'obstacle',
		height: 1,
		distance: 4
	}],
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
			"Part G compliance": "Yes",
			"Cooling required": "No"
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-generalSpecifications-${hyphenate(key)}`));
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
			const lineResult = (await screen.findByTestId(`summary-appliances-${hyphenate(key)}`));
			const lineValues = Array.from(lineResult.querySelectorAll("li").values().map(v => v.textContent));

			const result = value.every(v => lineValues.includes(v));

			expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
			expect(result).toBe(true);
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
			const lineResult = (await screen.findByTestId(`summary-externalFactors-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
			expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
		}
	});
});