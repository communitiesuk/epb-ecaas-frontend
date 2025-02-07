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
	appliancesAndElectricity: AppliancesAndElectricityData,
	shading: Shading
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
		heatingControlType: 'seperateTempControl',
	},
	appliancesAndElectricity: {
		fridgeFreezerEnergyRating: 'a',
		dishwasherEnergyRating: 'b',
		ovenCookerEnergyRating: 'c',
		washingMachineEnergyRating: 'd',
		tumbleDryerEnergyRating: 'e',
		electricVehicleCharger: 'no',
		electricityGridConnection: 'none',
		electricityTariff: 'standardTariff'
	},
	shading: {
		shadingObjects: [{
			name: 'Shading 1',
			direction: 90,
			objectType: 'obstacle',
			height: 1,
			distance: 4
		}]
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
		expect(screen.getByRole('link', {name: 'Appliances and electricity'}));
		expect(screen.getByRole('link', {name: 'Shading'}));

	});

	it('should select the clicked tab', async () => {
		const user = userEvent.setup();

		const summaryPage = await renderSuspended(Summary);

		await user.click(screen.getByRole('link', {name: 'General specifications'}));

		expect(summaryPage.html()).toContain(`<li class="govuk-tabs__list-item govuk-tabs__list-item--selected"><a class="govuk-tabs__tab" href="#generalSpecifications">General specifications</a></li>`);
		expect(summaryPage.html()).toContain(`<li class="govuk-tabs__list-item"><a class="govuk-tabs__tab" href="#appliancesAndElectricity">Appliances and electricity</a></li>`);

		await user.click(screen.getByRole('link', {name: 'Appliances and electricity'}));

		expect(summaryPage.html()).toContain(`<li class="govuk-tabs__list-item govuk-tabs__list-item--selected"><a class="govuk-tabs__tab" href="#appliancesAndElectricity">Appliances and electricity</a></li>`);
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
			"Part G compliance": "yes",
			"Cooling required": "no",
			"Heating control type": "seperateTempControl"
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
			expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
		}
	});

	it('should display the correct data for the appliances and electricity section', async () => {
		store.$patch({
			dwellingDetails: {
				appliancesAndElectricity: {
					data: state.appliancesAndElectricity
				}
			}
		});

		userEvent.setup();

		await renderSuspended(Summary);

		const expectedResult = {
			"Fridge/freezer energy rating": 'A',
			"Dishwasher energy rating": 'B',
			"Oven/cooker energy rating": 'C',
			"Washing machine energy rating": 'D',
			"Tumble dryer energy rating": 'E',
			"Electric vehicle charger": 'No',
			"Electricity grid connection": 'None',
			"Electricity tariff": 'Standard tariff'
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
			expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
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
});