import { renderSuspended } from '@nuxt/test-utils/runtime';
import DefaultPage from './default.vue';
import { screen } from '@testing-library/vue';


describe('nav bar with ductwork', () => {
	const store = useEcaasStore();

	const mechanicalVentilation1: MechanicalVentilationData = {
		id: '5124f2fe-f15b-4a56-ba5a-1a7751ac506f',
		name: "Mechanical name 1",
		typeOfMechanicalVentilationOptions: "mvhr",
		controlForSupplyAirflow: "load",
		supplyAirTemperatureControl: "odaComp",
		airFlowRate: 12,
		mvhrLocation: "inside",
		mvhrEfficiency: 0.2,
	};

	it('should not show the mvhr ductwork link when no mechanical ventilations of type mvhr have been added', async () => {
		await renderSuspended(DefaultPage);
		expect(screen.queryByText('MVHR ductwork')).toBeNull();

	});

	it('should show the mvhr ductwork link when mechanical ventilations of type mvhr have been added', async () => {
		store.$patch({
			infiltrationAndVentilation:{
				mechanicalVentilation: {
					data: [mechanicalVentilation1]
				}
			}
		});
		await renderSuspended(DefaultPage);
		expect(screen.getByText('MVHR ductwork'));
	});
});