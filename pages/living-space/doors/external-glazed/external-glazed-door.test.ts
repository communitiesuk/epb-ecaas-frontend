import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import ExternalGlazedDoor from './[door].vue';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('external glazed door', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const state: ExternalGlazedDoorData = {
		name: "External glazed door 1",
		orientation: 1,
		surfaceArea: 1,
		height: 1,
		width: 1,
		uValue: 1,
		pitchOption: '90',
		pitch: 90,
		solarTransmittance: 0.1,
		elevationalHeight: 1,
		midHeight: 1,
		numberOpenableParts: '0',
	};

	afterEach(() => {
		store.$reset();
	});

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(ExternalGlazedDoor);

		await user.type(screen.getByTestId('name'), 'External glazed door 1');
		await user.type(screen.getByTestId('orientation'), '1');
		await user.type(screen.getByTestId('surfaceArea'), '1');
		await user.type(screen.getByTestId('height'), '1');
		await user.type(screen.getByTestId('width'), '1'); 
		await user.type(screen.getByTestId('uValue'), '1');
		await user.click(screen.getByTestId('pitchOption_90'));
		await user.type(screen.getByTestId('solarTransmittance'), '0.1');
		await user.type(screen.getByTestId('elevationalHeight'), '1');
		await user.type(screen.getByTestId('midHeight'), '1');
		await user.click(screen.getByTestId('numberOpenableParts_0'));

		await user.click(screen.getByRole('button'));

		const { data = [] } = store.livingSpaceFabric.livingSpaceDoors.livingSpaceExternalGlazedDoor || {};
		
		expect(data[0]).toEqual(state);
		expect(navigateToMock).toHaveBeenCalledWith('/living-space/doors');
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			livingSpaceFabric: {
				livingSpaceDoors: {
					livingSpaceExternalGlazedDoor: {
						data: [state]
					}
				}
			}
		});

		await renderSuspended(ExternalGlazedDoor, {
			route: {
				params: { door: '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('External glazed door 1');
		expect((await screen.findByTestId('orientation') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('surfaceArea') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('height') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('width') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('uValue') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('pitchOption_90')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('solarTransmittance') as HTMLInputElement).value).toBe('0.1');
		expect((await screen.findByTestId('elevationalHeight') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('midHeight') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('numberOpenableParts_0')).hasAttribute('checked')).toBe(true);
	});
		
	it('only required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(ExternalGlazedDoor);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('orientation_error'))).toBeDefined();
		expect((await screen.findByTestId('surfaceArea_error'))).toBeDefined();
		expect((await screen.findByTestId('height_error'))).toBeDefined();
		expect((await screen.findByTestId('width_error'))).toBeDefined();
		expect((await screen.findByTestId('uValue_error'))).toBeDefined();
		expect((await screen.findByTestId('pitchOption_error'))).toBeDefined();
		expect((await screen.findByTestId('solarTransmittance_error'))).toBeDefined();
		expect((await screen.findByTestId('elevationalHeight_error'))).toBeDefined();
		expect((await screen.findByTestId('midHeight_error'))).toBeDefined();
		expect((await screen.findByTestId('numberOpenableParts_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(ExternalGlazedDoor);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('externalGlazedDoorErrorSummary'))).toBeDefined();
	});

	it('requires pitch when custom pitch option is selected', async () => {
		await renderSuspended(ExternalGlazedDoor);
    
		await user.click(screen.getByTestId('pitchOption_custom'));
		await user.click(screen.getByRole('button'));
    
		expect((await screen.findByTestId('pitch_error'))).toBeDefined();
	});

	it('requires further data when four openable parts option is selected', async () => {
		await renderSuspended(ExternalGlazedDoor);
    
		await user.click(screen.getByTestId('numberOpenableParts_4'));
		await user.click(screen.getByRole('button'));
    
		expect((await screen.findByTestId('frameToOpeningRatio_error'))).toBeDefined();
		expect((await screen.findByTestId('maximumOpenableArea_error'))).toBeDefined();
		expect((await screen.findByTestId('heightOpenableArea_error'))).toBeDefined();
		expect((await screen.findByTestId('midHeightOpenablePart1_error'))).toBeDefined();
		expect((await screen.findByTestId('midHeightOpenablePart2_error'))).toBeDefined();
		expect((await screen.findByTestId('midHeightOpenablePart3_error'))).toBeDefined();
		expect((await screen.findByTestId('midHeightOpenablePart4_error'))).toBeDefined();
	});

	it('does not require the mid height of more parts than have been selected', async () => {
		await renderSuspended(ExternalGlazedDoor);
    
		await user.click(screen.getByTestId('numberOpenableParts_1'));
		await user.click(screen.getByRole('button'));
    
		expect((await screen.findByTestId('midHeightOpenablePart1_error'))).toBeDefined();
        
		expect((await screen.queryByTestId('midHeightOpenablePart2_error'))).toBeNull();
		expect((await screen.queryByTestId('midHeightOpenablePart3_error'))).toBeNull();
		expect((await screen.queryByTestId('midHeightOpenablePart4_error'))).toBeNull();
	});
});