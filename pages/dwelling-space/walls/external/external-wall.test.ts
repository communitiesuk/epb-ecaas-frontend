import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import ExternalWall from './[wall].vue';
import { MassDistributionClass } from "~/schema/api-schema.types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('external wall', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const state: ExternalWallData = {
		name: "External wall 1",
		pitchOption: '90',
		pitch: 90,
		orientation: 0,
		length: 20,
		height: 0.5,
		elevationalHeight: 20,
		surfaceArea: 10,
		solarAbsorption: 0.1,
		uValue: 1,
		kappaValue: 50000,
		massDistributionClass: MassDistributionClass.I
	};

	afterEach(() => {
		store.$reset();
	});

	test('data is saved to store state when form is valid', async () => {
		await renderSuspended(ExternalWall);

		await user.type(screen.getByTestId('name'), 'External wall 1');
		await user.click(screen.getByTestId('pitchOption_90'));
		await user.type(screen.getByTestId('orientation'), '0');
		await user.type(screen.getByTestId('length'), '20');
		await user.type(screen.getByTestId('height'), '0.5');
		await user.type(screen.getByTestId('elevationalHeight'), '20');
		await user.type(screen.getByTestId('surfaceArea'), '10');
		await user.type(screen.getByTestId('solarAbsorption'), '0.1');
		await user.type(screen.getByTestId('uValue'), '1');
		await user.click(screen.getByTestId('kappaValue_50000'));
		await user.click(screen.getByTestId('massDistributionClass_I'));

		await user.click(screen.getByRole('button'));

		const { data = [] } = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceExternalWall || {};
		
		expect(data[0]).toEqual(state);
		expect(navigateToMock).toHaveBeenCalledWith('/dwelling-space/walls');
	});

	test('form is prepopulated when data exists in state', async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: {
						data: [state]
					}
				}
			}
		});

		await renderSuspended(ExternalWall, {
			route: {
				params: { wall: '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('External wall 1');
		expect((await screen.findByTestId('pitchOption_90')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('orientation') as HTMLInputElement).value).toBe('0');
		expect((await screen.findByTestId('length') as HTMLInputElement).value).toBe('20');
		expect((await screen.findByTestId('height') as HTMLInputElement).value).toBe('0.5');
		expect((await screen.findByTestId('elevationalHeight') as HTMLInputElement).value).toBe('20');
		expect((await screen.findByTestId('surfaceArea') as HTMLInputElement).value).toBe('10');
		expect((await screen.findByTestId('solarAbsorption') as HTMLInputElement).value).toBe('0.1');
		expect((await screen.findByTestId('uValue') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('kappaValue_50000')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('massDistributionClass_I')).hasAttribute('checked')).toBe(true);
	});
		
	test('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(ExternalWall);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('pitchOption_error'))).toBeDefined();
		expect((await screen.findByTestId('orientation_error'))).toBeDefined();
		expect((await screen.findByTestId('length_error'))).toBeDefined();
		expect((await screen.findByTestId('height_error'))).toBeDefined();
		expect((await screen.findByTestId('elevationalHeight_error'))).toBeDefined();
		expect((await screen.findByTestId('surfaceArea_error'))).toBeDefined();
		expect((await screen.findByTestId('solarAbsorption_error'))).toBeDefined();
		expect((await screen.findByTestId('uValue_error'))).toBeDefined();
		expect((await screen.findByTestId('kappaValue_error'))).toBeDefined();
		expect((await screen.findByTestId('massDistributionClass_error'))).toBeDefined();

	});

	test('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(ExternalWall);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('externalWallErrorSummary'))).toBeDefined();
	});

	it('requires pitch when custom pitch option is selected', async () => {
		await renderSuspended(ExternalWall);
    
		await user.click(screen.getByTestId('pitchOption_custom'));
		await user.click(screen.getByRole('button'));
    
		expect((await screen.findByTestId('pitch_error'))).toBeDefined();
	});
});