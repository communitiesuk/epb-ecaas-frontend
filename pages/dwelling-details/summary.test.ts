import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import Summary from './summary.vue';
import { screen } from '@testing-library/vue';
import hyphenate from '../../utils/hyphenate';
import { BuildType, ShadingObjectType, TerrainClass, VentilationShieldClass } from '~/schema/api-schema.types';
import { metre } from '~/utils/units/length';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

interface DwellingDetailSummary {
	generalDetails: GeneralDetailsData,
	shading: ShadingData[],
	externalFactors: ExternalFactorsData
}

const state: DwellingDetailSummary = {
	generalDetails: {
		typeOfDwelling: BuildType.house,
		storeysInDwelling: 2,
		numOfBedrooms: 3,
		coolingRequired: false,
	},
	shading: [{
		name: 'Shading 1',
		startAngle: 0,
		endAngle: 90,
		objectType: ShadingObjectType.obstacle,
		height: 1,
		distance: 4
	}],
	externalFactors: {
		altitude: 3,
		typeOfExposure: VentilationShieldClass.Shielded,
		terrainType: TerrainClass.Suburban,
		noiseNuisance: false
	}
};

describe('Dwelling details summary', () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it('should contain the correct tabs for dwelling details', async () => {
		await renderSuspended(Summary);
  
		expect(screen.getByRole('link', {name: 'General details'}));
		expect(screen.getByRole('link', {name: 'Shading'}));

	});

	it('should display the correct data for the general details section', async () => {
		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					data: state.generalDetails
				}
			}
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Type of dwelling": "House",
			"Number of storeys in building": "2",
			"Number of bedrooms": "3",
			"Cooling required": "No"
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-generalDetails-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
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

		await renderSuspended(Summary);

		const expectedResult = {
			"Altitude": `3 ${metre.suffix}`,
			"Type of exposure": "Shielded",
			"Terrain type": "Suburban",
			"Noise nuisance": "No"
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-externalFactors-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});
});