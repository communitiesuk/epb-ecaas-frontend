import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import ExternalUnglazedDoor from './[door].vue';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('external unglazed door', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const state: ExternalUnglazedDoorData = {
		name: "External unglazed door 1",
		pitchOption: '90',
		pitch: 90,
		orientation: 0,
		height: 0.5,
		width: 20,
		elevationalHeight: 20,
		surfaceArea: 10,
		solarAbsorbtion: 0.1,
		uValue: 1,
		kappaValue: 50000,
		massDistributionClass: 'internal'
	};

	afterEach(() => {
		store.$reset();
	});

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(ExternalUnglazedDoor);

		await user.type(screen.getByTestId('name'), 'External unglazed door 1');
		await user.click(screen.getByTestId('pitchOption_90'));
		await user.type(screen.getByTestId('orientation'), '0');
		await user.type(screen.getByTestId('height'), '0.5');
		await user.type(screen.getByTestId('width'), '20'); 
		await user.type(screen.getByTestId('elevationalHeight'), '20');
		await user.type(screen.getByTestId('surfaceArea'), '10');
		await user.type(screen.getByTestId('solarAbsorbtion'), '0.1');
		await user.type(screen.getByTestId('uValue'), '1');
		await user.click(screen.getByTestId('kappaValue_50000'));
		await user.click(screen.getByTestId('massDistributionClass_internal'));

		await user.click(screen.getByRole('button'));

		const { data = [], complete = false} = store.livingSpaceFabric.livingSpaceDoors.livingSpaceExternalUnglazedDoor || {};
		
		expect(data[0]).toEqual(state);
		expect(complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/living-space/doors');
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			livingSpaceFabric: {
				livingSpaceDoors: {
					livingSpaceExternalUnglazedDoor: {
						data: [state]
					}
				}
			}
		});

		await renderSuspended(ExternalUnglazedDoor, {
			route: {
				params: { door: '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('External unglazed door 1');
		expect((await screen.findByTestId('pitchOption_90')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('orientation') as HTMLInputElement).value).toBe('0');
		expect((await screen.findByTestId('height') as HTMLInputElement).value).toBe('0.5');
		expect((await screen.findByTestId('width') as HTMLInputElement).value).toBe('20');
		expect((await screen.findByTestId('elevationalHeight') as HTMLInputElement).value).toBe('20');
		expect((await screen.findByTestId('surfaceArea') as HTMLInputElement).value).toBe('10');
		expect((await screen.findByTestId('solarAbsorbtion') as HTMLInputElement).value).toBe('0.1');
		expect((await screen.findByTestId('uValue') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('kappaValue_50000')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('massDistributionClass_internal')).hasAttribute('checked')).toBe(true);
	});
		
	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(ExternalUnglazedDoor);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('pitchOption_error'))).toBeDefined();
		expect((await screen.findByTestId('orientation_error'))).toBeDefined();
		expect((await screen.findByTestId('height_error'))).toBeDefined();
		expect((await screen.findByTestId('width_error'))).toBeDefined();
		expect((await screen.findByTestId('elevationalHeight_error'))).toBeDefined();
		expect((await screen.findByTestId('surfaceArea_error'))).toBeDefined();
		expect((await screen.findByTestId('solarAbsorbtion_error'))).toBeDefined();
		expect((await screen.findByTestId('uValue_error'))).toBeDefined();
		expect((await screen.findByTestId('kappaValue_error'))).toBeDefined();
		expect((await screen.findByTestId('massDistributionClass_error'))).toBeDefined();

	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(ExternalUnglazedDoor);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('externalUnglazedDoorErrorSummary'))).toBeDefined();
	});

	it('requires pitch when custom pitch option is selected', async () => {
		await renderSuspended(ExternalUnglazedDoor);
    
		await user.click(screen.getByTestId('pitchOption_custom'));
		await user.click(screen.getByRole('button'));
    
		expect((await screen.findByTestId('pitch_error'))).toBeDefined();
	});
});