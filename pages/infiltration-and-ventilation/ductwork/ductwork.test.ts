import { screen } from '@testing-library/vue';
import { renderSuspended } from "@nuxt/test-utils/runtime";
import DuctworkOverview from "./index.vue";
import userEvent from '@testing-library/user-event';
import type {DuctworkData} from '../../../stores/ecaasStore.types';

describe('ductwork', async () => {
	const user = userEvent.setup();
	const store = useEcaasStore();

	const ductwork1: DuctworkData = {
		name: 'Ductwork 1',
		mvhrUnit: '',
		ductworkCrossSectionalShape: "circular",
		ductType: "intake",
		internalDiameterOfDuctwork: 300,
		externalDiameterOfDuctwork: 1000,
		insulationThickness: 100,
		lengthOfDuctwork: 100,
		thermalInsulationConductivityOfDuctwork: 10,
		surfaceReflectivity: "reflective",
	};
	const ductwork2: DuctworkData = {
		name: 'Ductwork 2',
		mvhrUnit: '',
		ductworkCrossSectionalShape: "circular",
		ductType: "supply",
		internalDiameterOfDuctwork: 30,
		externalDiameterOfDuctwork: 100,
		insulationThickness: 10,
		lengthOfDuctwork: 10,
		thermalInsulationConductivityOfDuctwork: 9,
		surfaceReflectivity: "reflective",
	};
	const ductwork3: DuctworkData = {
		name: 'Ductwork 3',
		mvhrUnit: '',
		ductworkCrossSectionalShape: "rectangular",
		ductType: "exhaust",
		internalDiameterOfDuctwork: 200,
		externalDiameterOfDuctwork: 1000,
		insulationThickness: 100,
		lengthOfDuctwork: 200,
		thermalInsulationConductivityOfDuctwork: 1,
		surfaceReflectivity: "reflective",
	};
	afterEach(() => {
		store.$reset();
	});

	it('should have the correct heading', async () => {
		await renderSuspended(DuctworkOverview);
		expect(screen.getByRole('heading', {name: 'MVHR ductwork'}));
	}); 

	it('should allow users to remove a ductwork when remove button is clicked', async() => {
		store.$patch({
			infiltrationAndVentilation: {
				ductwork: {
					data: [ductwork1]
				}
			} 
		});
		
		await renderSuspended(DuctworkOverview);

		expect(screen.getAllByTestId("ductwork_items")).toBeDefined();
		await user.click(screen.getByTestId('ductwork_remove_0'));
		expect(screen.queryByTestId('ductwork_items')).toBeNull();
	});
  
	it("removes the correct ductwork if there are multiple ductworks", async () =>{
		store.$patch({
			infiltrationAndVentilation:{
				ductwork: {
					data: [ductwork1, ductwork2, ductwork3]
				}
			}
		});
		await renderSuspended(DuctworkOverview);
		await user.click(screen.getByTestId('ductwork_remove_1'));
		expect(screen.getByText('Ductwork 1')).toBeDefined();
		expect(screen.queryByText('Ductwork 2')).toBeNull();
		expect(screen.getByText('Ductwork 3')).toBeDefined();
	});

	it("should allow users to duplicate a ductwork when duplicate button is clicked", async () =>{
		store.$patch({
			infiltrationAndVentilation:{
				ductwork: {
					data: [ductwork1, ductwork2]
				}
			}
		});
		await renderSuspended(DuctworkOverview);
		await user.click(screen.getByTestId('ductwork_duplicate_0'));
		await user.click(screen.getByTestId('ductwork_duplicate_0'));
		await user.click(screen.getByTestId('ductwork_duplicate_2'));
		await user.click(screen.getByTestId('ductwork_duplicate_2'));
		expect(screen.getByText('Ductwork 1')).toBeDefined();
		expect(screen.getByText('Ductwork 1 (1)')).toBeDefined();
		expect(screen.getByText('Ductwork 1 (2)')).toBeDefined();
		expect(screen.getByText('Ductwork 1 (1) (1)')).toBeDefined();
		expect(screen.getByText('Ductwork 1 (1) (2)')).toBeDefined();


	});
});