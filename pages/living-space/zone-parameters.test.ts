import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { screen } from '@testing-library/vue';
import ZoneParameters from "./zone-parameters.vue";
import userEvent from "@testing-library/user-event";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

const state: LivingSpaceZoneParametersData = {
	area: 10,
	volume: 10,
	spaceHeatingSystemForThisZone: 'instant electric heater'
};

describe('zone parameters', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	beforeEach(() => {
		store.$reset();

		store.$patch({
			heatingSystems: {
				heatEmitting: {
					wetDistribution: {
						data: [{
							name: 'radiators'
						}]
					},
					instantElectricHeater: {
						data: [{
							name: 'instant electric heater'
						}]
					}
				}
			}
		});
	});

	it('populates heat emitting system options from state', async () => {
		await renderSuspended(ZoneParameters);

		expect(screen.getByTestId('spaceHeatingSystemForThisZone_radiators')).toBeDefined();
		expect(screen.getByTestId('spaceHeatingSystemForThisZone_instant_electric_heater')).toBeDefined();
	});

	test('data is saved to store state when form is valid', async () => {
		await renderSuspended(ZoneParameters);

		await user.type(screen.getByTestId('area'), '10');
		await user.type(screen.getByTestId('volume'), '10');
		await user.click(screen.getByTestId('spaceHeatingSystemForThisZone_instant_electric_heater'));
		await user.tab();
		await user.click(screen.getByRole('button'));

		const { data, complete } = store.livingSpaceFabric.livingSpaceZoneParameters;

		expect(data).toEqual(state);
		expect(complete).toBe(true);
		expect(navigateToMock).toBeCalledWith('/living-space');
	});

	test('form is prepopulated when data exists in state', async () => {
		store.$patch({
			livingSpaceFabric: {
				livingSpaceZoneParameters: { data: state }
			}
		});

		await renderSuspended(ZoneParameters);

		expect((await screen.findByTestId('area') as HTMLInputElement).value).toBe('10');
		expect((await screen.findByTestId('volume') as HTMLInputElement).value).toBe('10');
		expect((await screen.findByTestId('spaceHeatingSystemForThisZone_instant_electric_heater')).hasAttribute('checked')).toBe(true);
	});
			
	test('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(ZoneParameters);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('area_error'))).toBeDefined();
		expect((await screen.findByTestId('volume_error'))).toBeDefined();
		expect((await screen.findByTestId('spaceHeatingSystemForThisZone_error'))).toBeDefined();
	});

	test('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(ZoneParameters);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('zoneParametersErrorSummary'))).toBeDefined();
	});
});