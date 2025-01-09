
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import Summary from './summary.vue';
import { screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { mount } from '@vue/test-utils';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

interface DwellingDetailSummary {
  generalSpecifications: GeneralSpecificationsData,
  appliancesAndElectricity: AppliancesAndElectricityData

}

const state: DwellingDetailSummary = {
  generalSpecifications: {
  typeOfResidence: 'house',
  weatherDataLocation: 'manchester',
  sizeGroundFloorArea: 50,
  numOfBedrooms: 3,
  storiesInDwelling: 2,
  levelOfShelter: 'normal',
  numOfShelteredSides: 0,
  heatingControlType: 'seperateTempControl',
  cookingFuelType: 'electricity',
  coldWaterSource: 'mainsWater',
  numOfADFWetRooms: 2
}, 
appliancesAndElectricity:{
  fridgeFreezerEnergyRating: 'a',
	dishwasherEnergyRating: 'b',
	ovenCookerEnergyRating: 'c',
	washingMachineEnergyRating: 'd',
	tumbleDryerEnergyRating: 'e',
	electricVehicleCharger: 'no',
	electricityGridConnection: 'none',
	electricityTariff: 'standardTariff'
}, 

}


describe('Dwelling details summary', () => {
  const store = useEcaasStore();

  afterEach(() => {
    store.$reset();
  });


it('should contain the correct tabs for dwelling details', async () => {
  await renderSuspended(Summary);
  
  expect(await screen.getByRole('link', {name: 'General specifications'}));
  expect(await screen.getByRole('link', {name: 'Appliances and electricity'}));
  expect(await screen.getByRole('link', {name: 'Hot water distribution'}));
  expect(await screen.getByRole('link', {name: 'Shading'}));

})

it('should display the tab contents of the clicked tab', async () => {
		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					data: state.generalSpecifications
				}, appliancesAndElectricity: {
					data: state.appliancesAndElectricity
				}
			}
		});

  const user = userEvent.setup();

  await renderSuspended(Summary);

  await user.click(screen.getByRole('link', {name: 'General specifications'}))
//TODO
})
})