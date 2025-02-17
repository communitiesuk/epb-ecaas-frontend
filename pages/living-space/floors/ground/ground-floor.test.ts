import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import GroundFloor from './[floor].vue';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('ground floor', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const state: GroundFloorData = {
		name: "Ground 1",
		surfaceAreaInZone: 5,
		surfaceAreaAllZones: 0,
		pitch: 0,
		uValue: 1,
		kappaValue: 100,
		massDistributionClass: 'internal',
		perimeter: 0,
		psiOfWallJunction: 0,
		typeOfGroundFloor: 'slabNoEdgeInsulation'
	};

	afterEach(() => {
		store.$reset();
	});

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(GroundFloor);

		await user.type(screen.getByTestId('name'), 'Ground 1');
		await user.type(screen.getByTestId('surfaceAreaInZone'), '5');
		await user.type(screen.getByTestId('surfaceAreaAllZones'), '0');
		await user.type(screen.getByTestId('pitch'), '0');
		await user.type(screen.getByTestId('uValue'), '1');
		await user.type(screen.getByTestId('kappaValue'), '100');
		await user.click(screen.getByTestId('massDistributionClass_internal'));
		await user.type(screen.getByTestId('perimeter'), '0');
		await user.type(screen.getByTestId('psiOfWallJunction'), '0');
		await user.click(screen.getByTestId('typeOfGroundFloor_slabNoEdgeInsulation'));
		await user.click(screen.getByRole('button'));

		const { data, complete } = store.livingSpaceFabric.livingSpaceFloors.livingSpaceGroundFloor;
		
		expect(data[0]).toEqual(state);
		expect(complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/living-space/floors');
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			livingSpaceFabric: {
				livingSpaceFloors: {
					livingSpaceGroundFloor: {
						data: [state]
					}
				}
			}
		});

		await renderSuspended(GroundFloor, {
			route: {
				params: { floor: '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Ground 1');
		expect((await screen.findByTestId('surfaceAreaInZone') as HTMLInputElement).value).toBe('5');
		expect((await screen.findByTestId('surfaceAreaAllZones') as HTMLInputElement).value).toBe('0');
		expect((await screen.findByTestId('pitch') as HTMLInputElement).value).toBe('0');
		expect((await screen.findByTestId('uValue') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('kappaValue') as HTMLInputElement).value).toBe('100');
		expect((await screen.findByTestId('massDistributionClass_internal')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('perimeter') as HTMLInputElement).value).toBe('0');
		expect((await screen.findByTestId('psiOfWallJunction') as HTMLInputElement).value).toBe('0');
		expect((await screen.findByTestId('typeOfGroundFloor_slabNoEdgeInsulation')).hasAttribute('checked')).toBe(true);
	});
		
	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(GroundFloor);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('surfaceAreaInZone_error'))).toBeDefined();
		expect((await screen.findByTestId('surfaceAreaAllZones_error'))).toBeDefined();
		expect((await screen.findByTestId('pitch_error'))).toBeDefined();
		expect((await screen.findByTestId('uValue_error'))).toBeDefined();
		expect((await screen.findByTestId('kappaValue_error'))).toBeDefined();
		expect((await screen.findByTestId('massDistributionClass_error'))).toBeDefined();
		expect((await screen.findByTestId('perimeter_error'))).toBeDefined();
		expect((await screen.findByTestId('psiOfWallJunction_error'))).toBeDefined();
		expect((await screen.findByTestId('typeOfGroundFloor_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(GroundFloor);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('groundFloorErrorSummary'))).toBeDefined();
	});

	it('requires additional fields when type of ground floor is slab with edge insulation', async () => {
		await renderSuspended(GroundFloor);

		await user.click(screen.getByTestId('typeOfGroundFloor_slabWithEdgeInsulation'));
		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('edgeInsulationType_error'))).toBeDefined();
		expect((await screen.findByTestId('edgeInsulationWidth_error'))).toBeDefined();
		expect((await screen.findByTestId('edgeInsulationThermalResistance_error'))).toBeDefined();
	});

	it('requires additional fields when type of ground floor is suspended floor', async () => {
		await renderSuspended(GroundFloor);

		await user.click(screen.getByTestId('typeOfGroundFloor_suspendedFloor'));
		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('heightOfFloorUpperSurface_error'))).toBeDefined();
		expect((await screen.findByTestId('thicknessOfSurroundingWalls_error'))).toBeDefined();
		expect((await screen.findByTestId('underfloorSpaceThermalResistance_error'))).toBeDefined();
		expect((await screen.findByTestId('wallsAboveGroundThermalTransmittance_error'))).toBeDefined();
		expect((await screen.findByTestId('ventilationOpeningsArea_error'))).toBeDefined();
	});

	it('requires additional fields when type of ground floor is heated basement', async () => {
		await renderSuspended(GroundFloor);

		await user.click(screen.getByTestId('typeOfGroundFloor_heatedBasement'));
		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('thicknessOfSurroundingWalls_error'))).toBeDefined();
		expect((await screen.findByTestId('basementFloorDepth_error'))).toBeDefined();
		expect((await screen.findByTestId('thermalResistanceOfBasementWalls_error'))).toBeDefined();
	});

	it('requires additional fields when type of ground floor is unheated basement', async () => {
		await renderSuspended(GroundFloor);

		await user.click(screen.getByTestId('typeOfGroundFloor_unheatedBasement'));
		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('thermalResistanceOfFloorAboveBasement_error'))).toBeDefined();
		expect((await screen.findByTestId('thermalResistanceOfWallsAboveGround_error'))).toBeDefined();
		expect((await screen.findByTestId('thermalResistanceOfBasementWalls_error'))).toBeDefined();
		expect((await screen.findByTestId('thicknessOfWalls_error'))).toBeDefined();
		expect((await screen.findByTestId('depthOfBasementFloorBelowGround_error'))).toBeDefined();
		expect((await screen.findByTestId('heightOfBasementWallsAboveGround_error'))).toBeDefined();
	});
});