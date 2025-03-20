import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import ExposedFloor from './[floor].vue';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('exposed floor', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const state: ExposedFloorData = {
		name: "Exposed Floor 1",
		pitch: 180,
		orientation: 0,
		height: 0.5,
		width: 20,
		elevationalHeight: 20,
		surfaceArea: 10,
		solarAbsorbtion: 0.1,
		uValue: 1,
		kappaValue: 100,
		massDistributionClass: 'internal'
	};

	afterEach(() => {
		store.$reset();
	});

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(ExposedFloor);

		await user.type(screen.getByTestId('name'), 'Exposed Floor 1');
		await user.type(screen.getByTestId('orientation'), '0');
		await user.type(screen.getByTestId('height'), '0.5');
		await user.type(screen.getByTestId('width'), '20'); 
		await user.type(screen.getByTestId('elevationalHeight'), '20');
		await user.type(screen.getByTestId('surfaceArea'), '10');
		await user.type(screen.getByTestId('solarAbsorbtion'), '0.1');
		await user.type(screen.getByTestId('uValue'), '1');
		await user.type(screen.getByTestId('kappaValue'), '100');
		await user.click(screen.getByTestId('massDistributionClass_internal'));

		await user.click(screen.getByRole('button'));

		const { data = [], complete = false} = store.livingSpaceFabric.livingSpaceFloors.livingSpaceExposedFloor || {};
		
		expect(data[0]).toEqual(state);
		expect(complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/living-space/floors');
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			livingSpaceFabric: {
				livingSpaceFloors: {
					livingSpaceExposedFloor: {
						data: [state]
					}
				}
			}
		});

		await renderSuspended(ExposedFloor, {
			route: {
				params: { floor: '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Exposed Floor 1');
		expect((await screen.findByTestId('orientation') as HTMLInputElement).value).toBe('0');
		expect((await screen.findByTestId('height') as HTMLInputElement).value).toBe('0.5');
		expect((await screen.findByTestId('width') as HTMLInputElement).value).toBe('20');
		expect((await screen.findByTestId('elevationalHeight') as HTMLInputElement).value).toBe('20');
		expect((await screen.findByTestId('surfaceArea') as HTMLInputElement).value).toBe('10');
		expect((await screen.findByTestId('solarAbsorbtion') as HTMLInputElement).value).toBe('0.1');
		expect((await screen.findByTestId('uValue') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('kappaValue') as HTMLInputElement).value).toBe('100');
		expect((await screen.findByTestId('massDistributionClass_internal')).hasAttribute('checked')).toBe(true);
	});
		
	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(ExposedFloor);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
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
		await renderSuspended(ExposedFloor);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('exposedFloorErrorSummary'))).toBeDefined();
	});
});