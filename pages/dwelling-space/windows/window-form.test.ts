import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import Window from './[window].vue';
import { WindowTreatmentType } from "~/schema/api-schema.types";

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
		height: 1,
		width: 1,
		uValue: 1,
		pitchOption: '90',
		pitch: 90,
		solarTransmittance: 0.1,
		elevationalHeight: 1,
		midHeight: 1,
		frameToOpeningRatio: 0.2,
		numberOpenableParts: '0',
		overhangDepth: 1,
		overhangDistance: 1,
		sideFinRightDepth: 1,
		sideFinRightDistance: 1,
		sideFinLeftDepth: 1,
		sideFinLeftDistance: 1,
		treatmentType: WindowTreatmentType.blinds,
		thermalResistivityIncrease: 1,
		solarTransmittanceReduction: 0.1,
	};

	afterEach(() => {
		store.$reset();
	});

	test('data is saved to store state when form is valid', async () => {
		await renderSuspended(Window);

		await user.type(screen.getByTestId('name'), 'Window 1');
		await user.type(screen.getByTestId('orientation'), '1');
		await user.type(screen.getByTestId('surfaceArea'), '1');
		await user.type(screen.getByTestId('height'), '1');
		await user.type(screen.getByTestId('width'), '1'); 
		await user.type(screen.getByTestId('uValue'), '1');
		await user.click(screen.getByTestId('pitchOption_90'));
		await user.type(screen.getByTestId('solarTransmittance'), '0.1');
		await user.type(screen.getByTestId('elevationalHeight'), '1');
		await user.type(screen.getByTestId('midHeight'), '1');
		await user.type(screen.getByTestId('frameToOpeningRatio'), '0.8');
		await user.click(screen.getByTestId('numberOpenableParts_0'));
		await user.type(screen.getByTestId('overhangDepth'), '1');
		await user.type(screen.getByTestId('overhangDistance'), '1');
		await user.type(screen.getByTestId('sideFinRightDepth'), '1');
		await user.type(screen.getByTestId('sideFinRightDistance'), '1');
		await user.type(screen.getByTestId('sideFinLeftDepth'), '1');
		await user.type(screen.getByTestId('sideFinLeftDistance'), '1');
		await user.click(screen.getByTestId('treatmentType_blinds'));
		await user.type(screen.getByTestId('thermalResistivityIncrease'), '1');
		await user.type(screen.getByTestId('solarTransmittanceReduction'), '0.1');

		await user.click(screen.getByRole('button', { name: 'Save and continue' }));

		const { data } = store.dwellingFabric.dwellingSpaceWindows;
		
		expect(data[0]).toEqual(state);
		expect(navigateToMock).toHaveBeenCalledWith('/dwelling-space/windows');
	});

	test('form is prepopulated when data exists in state', async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWindows: {
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
		expect((await screen.findByTestId('height') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('width') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('uValue') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('pitchOption_90')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('solarTransmittance') as HTMLInputElement).value).toBe('0.1');
		expect((await screen.findByTestId('elevationalHeight') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('midHeight') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('numberOpenableParts_0')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('overhangDepth') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('overhangDistance') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('sideFinRightDepth') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('sideFinRightDistance') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('sideFinLeftDepth') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('sideFinLeftDistance') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('treatmentType_blinds')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('thermalResistivityIncrease') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('solarTransmittanceReduction') as HTMLInputElement).value).toBe('0.1');
	});
		
	test('only required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(Window);

		await user.click(screen.getByRole('button', { name: 'Save and continue' }));

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

		expect((await screen.queryByTestId('treatmentType_error'))).toBeNull();
		expect((await screen.queryByTestId('thermalResistivityIncrease_error'))).toBeNull();
		expect((await screen.queryByTestId('solarTransmittanceReduction_error'))).toBeNull();
		expect((await screen.queryByTestId('overhangDepth_error'))).toBeNull();
		expect((await screen.queryByTestId('overhangDistance_error'))).toBeNull();
		expect((await screen.queryByTestId('sideFinRightDepth_error'))).toBeNull();
		expect((await screen.queryByTestId('sideFinRightDistance_error'))).toBeNull();
		expect((await screen.queryByTestId('sideFinLeftDepth_error'))).toBeNull();
		expect((await screen.queryByTestId('sideFinLeftDistance_error'))).toBeNull();
	});

	test('error summary is displayed when an invalid form in submitted', async () => {
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
    
		await user.click(screen.getByTestId('numberOpenableParts_4'));
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
    
		await user.click(screen.getByTestId('numberOpenableParts_1'));
		await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    
		expect((await screen.findByTestId('midHeightOpenablePart1_error'))).toBeDefined();
        
		expect((await screen.queryByTestId('midHeightOpenablePart2_error'))).toBeNull();
		expect((await screen.queryByTestId('midHeightOpenablePart3_error'))).toBeNull();
		expect((await screen.queryByTestId('midHeightOpenablePart4_error'))).toBeNull();
	});

	it('displays curtainsControlObject when the curtains option is selected', async () => {
		await renderSuspended(Window);
    
		await user.click(screen.getByTestId('treatmentType_curtains'));
		await user.tab();
    
		expect((await screen.getByTestId('curtainsControlObject_auto_motorised'))).toBeDefined();
	});

	it('displays guidance link to window shading guidance page', async () => {
		await renderSuspended(Window);
		const guidance = screen.getByRole('link', {name : 'Guidance on window shading (opens in another window)'});
		expect(guidance).toBeDefined();
		expect(guidance.getAttribute('href')).toBe('/guidance/window-shading-guidance');
	});
});