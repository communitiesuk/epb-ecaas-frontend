import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import Window from './[window].vue';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('window', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const state: WindowData = {
		name: "Window 1",
		orientation: 1,
		surfaceArea: 1,
		length: 1,
		width: 1,
		uValue: 1,
		pitchOption: '90',
		pitch: 90,
		solarTransmittence: 0.1,
		elevationalHeight: 1,
		midHeight: 1,
		numberOpenableParts: "none",
		overhangDepth: 1,
		overhangDistance: 1,
		sideFinRightDepth: 1,
		sideFinRightDistance: 1,
		sideFinLeftDepth: 1,
		sideFinLeftDistance: 1,
		type: "blinds",
		thermalResistivityIncrease: 1,
		solarTransmittenceReduction: 0.1,
	};

	afterEach(() => {
		store.$reset();
	});

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(Window);

		await user.type(screen.getByTestId('name'), 'Window 1');
		await user.type(screen.getByTestId('orientation'), '1');
		await user.type(screen.getByTestId('surfaceArea'), '1');
		await user.type(screen.getByTestId('length'), '1');
		await user.type(screen.getByTestId('width'), '1'); 
		await user.type(screen.getByTestId('uValue'), '1');
		await user.click(screen.getByTestId('pitchOption_90'));
		await user.type(screen.getByTestId('solarTransmittence'), '0.1');
		await user.type(screen.getByTestId('elevationalHeight'), '1');
		await user.type(screen.getByTestId('midHeight'), '1');
		await user.click(screen.getByTestId('numberOpenableParts_none'));
		await user.type(screen.getByTestId('overhangDepth'), '1');
		await user.type(screen.getByTestId('overhangDistance'), '1');
		await user.type(screen.getByTestId('sideFinRightDepth'), '1');
		await user.type(screen.getByTestId('sideFinRightDistance'), '1');
		await user.type(screen.getByTestId('sideFinLeftDepth'), '1');
		await user.type(screen.getByTestId('sideFinLeftDistance'), '1');
		await user.click(screen.getByTestId('type_blinds'));
		await user.type(screen.getByTestId('thermalResistivityIncrease'), '1');
		await user.type(screen.getByTestId('solarTransmittenceReduction'), '0.1');

		await user.click(screen.getByRole('button', { name: 'Save and continue' }));

		const { data } = store.livingSpaceFabric.livingSpaceWindows;
		
		expect(data[0]).toEqual(state);
		expect(navigateToMock).toHaveBeenCalledWith('/living-space/windows');
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			livingSpaceFabric: {
				livingSpaceWindows: {
					data: [state]
				}
			}
		});

		await renderSuspended(Window, {
			route: {
				params: { window: '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Window 1');
		expect((await screen.findByTestId('orientation') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('surfaceArea') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('length') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('width') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('uValue') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('pitchOption_90')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('solarTransmittence') as HTMLInputElement).value).toBe('0.1');
		expect((await screen.findByTestId('elevationalHeight') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('midHeight') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('numberOpenableParts_none')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('overhangDepth') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('overhangDistance') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('sideFinRightDepth') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('sideFinRightDistance') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('sideFinLeftDepth') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('sideFinLeftDistance') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('type_blinds')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('thermalResistivityIncrease') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('solarTransmittenceReduction') as HTMLInputElement).value).toBe('0.1');
	});
		
	it('only required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(Window);

		await user.click(screen.getByRole('button', { name: 'Save and continue' }));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('orientation_error'))).toBeDefined();
		expect((await screen.findByTestId('surfaceArea_error'))).toBeDefined();
		expect((await screen.findByTestId('length_error'))).toBeDefined();
		expect((await screen.findByTestId('width_error'))).toBeDefined();
		expect((await screen.findByTestId('uValue_error'))).toBeDefined();
		expect((await screen.findByTestId('pitchOption_error'))).toBeDefined();
		expect((await screen.findByTestId('solarTransmittence_error'))).toBeDefined();
		expect((await screen.findByTestId('elevationalHeight_error'))).toBeDefined();
		expect((await screen.findByTestId('midHeight_error'))).toBeDefined();
		expect((await screen.findByTestId('numberOpenableParts_error'))).toBeDefined();

		expect((await screen.queryByTestId('type_error'))).toBeNull();
		expect((await screen.queryByTestId('thermalResistivityIncrease_error'))).toBeNull();
		expect((await screen.queryByTestId('solarTransmittenceReduction_error'))).toBeNull();
		expect((await screen.queryByTestId('overhangDepth_error'))).toBeNull();
		expect((await screen.queryByTestId('overhangDistance_error'))).toBeNull();
		expect((await screen.queryByTestId('sideFinRightDepth_error'))).toBeNull();
		expect((await screen.queryByTestId('sideFinRightDistance_error'))).toBeNull();
		expect((await screen.queryByTestId('sideFinLeftDepth_error'))).toBeNull();
		expect((await screen.queryByTestId('sideFinLeftDistance_error'))).toBeNull();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(Window);

		await user.click(screen.getByRole('button', { name: 'Save and continue' }));

		expect((await screen.findByTestId('windowErrorSummary'))).toBeDefined();
	});

	it('requires pitch when custom pitch option is selected', async () => {
		await renderSuspended(Window);
    
		await user.click(screen.getByTestId('pitchOption_custom'));
		await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    
		expect((await screen.findByTestId('pitch_error'))).toBeDefined();
	});

	it('requires further data when four openable parts option is selected', async () => {
		await renderSuspended(Window);
    
		await user.click(screen.getByTestId('numberOpenableParts_four'));
		await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    
		expect((await screen.findByTestId('frameToOpeningRatio_error'))).toBeDefined();
		expect((await screen.findByTestId('maximumOpenableArea_error'))).toBeDefined();
		expect((await screen.findByTestId('heightOpenableArea_error'))).toBeDefined();
		expect((await screen.findByTestId('midHeightOpenablePart1_error'))).toBeDefined();
		expect((await screen.findByTestId('midHeightOpenablePart2_error'))).toBeDefined();
		expect((await screen.findByTestId('midHeightOpenablePart3_error'))).toBeDefined();
		expect((await screen.findByTestId('midHeightOpenablePart4_error'))).toBeDefined();
	});

	it('does not require the mid height of more parts than have been selected', async () => {
		await renderSuspended(Window);
    
		await user.click(screen.getByTestId('numberOpenableParts_one'));
		await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    
		expect((await screen.findByTestId('midHeightOpenablePart1_error'))).toBeDefined();
        
		expect((await screen.queryByTestId('midHeightOpenablePart2_error'))).toBeNull();
		expect((await screen.queryByTestId('midHeightOpenablePart3_error'))).toBeNull();
		expect((await screen.queryByTestId('midHeightOpenablePart4_error'))).toBeNull();
	});

	it('displays curtainsControlObject when the curtains option is selected', async () => {
		await renderSuspended(Window);
    
		await user.click(screen.getByTestId('type_curtains'));
		await user.tab();
    
		expect((await screen.getByTestId('curtainsControlObject_motorised'))).toBeDefined();
	});

	it('displays guidance link to window shading guidance page', async () => {
		await renderSuspended(Window);
		const guidance = screen.getByRole('link', {name : 'Shading guidance (opens in another window)'});
		expect(guidance).toBeDefined();
		expect(guidance.getAttribute('href')).toBe('/guidance/window-shading-guidance');
	});
});