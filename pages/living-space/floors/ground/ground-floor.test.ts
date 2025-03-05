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

	const groundFloor: GroundFloorData = {
		name: "Ground 1",
		surfaceAreaInZone: 5,
		surfaceAreaAllZones: 0,
		pitchOption: '0',
		pitch: 0,
		uValue: 1,
		kappaValue: 100,
		massDistributionClass: 'internal',
		perimeter: 0,
		psiOfWallJunction: 0,
		typeOfGroundFloor: 'slabNoEdgeInsulation'
	};

	const groundFloorWithEdgeInsulation: GroundFloorData = {
		...groundFloor,
		typeOfGroundFloor: 'slabWithEdgeInsulation',
		edgeInsulationType: 'horizontal',
		edgeInsulationWidth: 0,
		edgeInsulationThermalResistance: 0
	};

	const groundFloorWithSuspendedFloor: GroundFloorData = {
		...groundFloor,
		typeOfGroundFloor: 'suspendedFloor',
		heightOfFloorUpperSurface: 0,
		thicknessOfWalls: 0,
		underfloorSpaceThermalResistance: 0,
		thermalTransmittanceOfWallsAboveGround: 0,
		ventilationOpeningsArea: 0
	};

	const groundFloorWithHeatedBasement: GroundFloorData = {
		...groundFloor,
		typeOfGroundFloor: 'heatedBasement',
		thicknessOfWalls: 0,
		depthOfBasementFloorBelowGround: 0,
		thermalResistanceOfBasementWalls: 0
	};

	const groundFloorWithUnheatedBasement: GroundFloorData = {
		...groundFloor,
		typeOfGroundFloor: 'unheatedBasement',
		thermalTransmittanceOfFloorAboveBasement: 0,
		thermalTransmittanceOfWallsAboveGround: 0,
		thermalTransmittanceOfBasementWalls: 0,
		thicknessOfWalls: 0,
		depthOfBasementFloorBelowGround: 0,
		heightOfBasementWallsAboveGround: 0
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Ground 1');
		await user.type(screen.getByTestId('surfaceAreaInZone'), '5');
		await user.type(screen.getByTestId('surfaceAreaAllZones'), '0');
		await user.click(screen.getByTestId('pitchOption_0'));
		await user.type(screen.getByTestId('uValue'), '1');
		await user.type(screen.getByTestId('kappaValue'), '100');
		await user.click(screen.getByTestId('massDistributionClass_internal'));
		await user.type(screen.getByTestId('perimeter'), '0');
		await user.type(screen.getByTestId('psiOfWallJunction'), '0');
		await user.click(screen.getByTestId('typeOfGroundFloor_slabNoEdgeInsulation'));
	};
	
	describe('when type of ground floor is slab no edge insulation', () => {
		it('data is saved to store state when form is valid', async () => {
			await renderSuspended(GroundFloor);
	
			await populateValidForm();
			await user.click(screen.getByRole('button'));
	
			const { data } = store.livingSpaceFabric.livingSpaceFloors.livingSpaceGroundFloor;
			
			expect(data[0]).toEqual(groundFloor);
		});
	
		it('form is prepopulated when data exists in state', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceFloors: {
						livingSpaceGroundFloor: {
							data: [groundFloor]
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
			expect((await screen.findByTestId('pitchOption_0')).hasAttribute('checked')).toBe(true);
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
			expect((await screen.findByTestId('pitchOption_error'))).toBeDefined();
			expect((await screen.findByTestId('uValue_error'))).toBeDefined();
			expect((await screen.findByTestId('kappaValue_error'))).toBeDefined();
			expect((await screen.findByTestId('massDistributionClass_error'))).toBeDefined();
			expect((await screen.findByTestId('perimeter_error'))).toBeDefined();
			expect((await screen.findByTestId('psiOfWallJunction_error'))).toBeDefined();
			expect((await screen.findByTestId('typeOfGroundFloor_error'))).toBeDefined();
		});
	});
	
	describe('when type of ground floor is slab edge insulation', () => {
		it('data is saved to store state when form is valid', async () => {
			await renderSuspended(GroundFloor);
	
			await populateValidForm();
			await user.click(screen.getByTestId('typeOfGroundFloor_slabWithEdgeInsulation'));
			await user.click(screen.getByTestId('edgeInsulationType_horizontal'));
			await user.type(screen.getByTestId('edgeInsulationWidth'), '0');
			await user.type(screen.getByTestId('edgeInsulationThermalResistance'), '0');
			await user.tab();
			await user.click(screen.getByRole('button'));
	
			const { data } = store.livingSpaceFabric.livingSpaceFloors.livingSpaceGroundFloor;
			
			expect(data[0]).toEqual(groundFloorWithEdgeInsulation);
		});
	
		it('form is prepopulated when data exists in state', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceFloors: {
						livingSpaceGroundFloor: {
							data: [groundFloorWithEdgeInsulation]
						}
					}
				}
			});
	
			await renderSuspended(GroundFloor, {
				route: {
					params: { floor: '0' }
				}
			});
	
			expect((await screen.findByTestId('typeOfGroundFloor_slabWithEdgeInsulation')).hasAttribute('checked')).toBe(true);
			expect((await screen.findByTestId('edgeInsulationType_horizontal')).hasAttribute('checked')).toBe(true);
			expect((await screen.findByTestId('edgeInsulationWidth') as HTMLInputElement).value).toBe('0');
			expect((await screen.findByTestId('edgeInsulationThermalResistance') as HTMLInputElement).value).toBe('0');
		});
			
		it('required error messages are displayed when empty form is submitted', async () => {
			await renderSuspended(GroundFloor);
	
			await user.click(screen.getByTestId('typeOfGroundFloor_slabWithEdgeInsulation'));
			await user.click(screen.getByRole('button'));

			expect((await screen.findByTestId('edgeInsulationType_error'))).toBeDefined();
			expect((await screen.findByTestId('edgeInsulationWidth_error'))).toBeDefined();
			expect((await screen.findByTestId('edgeInsulationThermalResistance_error'))).toBeDefined();
		});
	});
	
	describe('when type of ground floor is suspended floor', () => {
		it('data is saved to store state when form is valid', async () => {
			await renderSuspended(GroundFloor);
	
			await populateValidForm();
			await user.click(screen.getByTestId('typeOfGroundFloor_suspendedFloor'));
			await user.type(screen.getByTestId('heightOfFloorUpperSurface'), '0');
			await user.type(screen.getByTestId('thicknessOfWalls'), '0');
			await user.type(screen.getByTestId('underfloorSpaceThermalResistance'), '0');
			await user.type(screen.getByTestId('thermalTransmittanceOfWallsAboveGround'), '0');
			await user.type(screen.getByTestId('ventilationOpeningsArea'), '0');
			await user.tab();
			await user.click(screen.getByRole('button'));
	
			const { data } = store.livingSpaceFabric.livingSpaceFloors.livingSpaceGroundFloor;
			const entryData = Object.entries(data[0]).filter(e => e[1] !== undefined);
			
			expect(Object.fromEntries(entryData)).toEqual(groundFloorWithSuspendedFloor);
		});
		
		it('form is prepopulated when data exists in state', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceFloors: {
						livingSpaceGroundFloor: {
							data: [groundFloorWithSuspendedFloor]
						}
					}
				}
			});
	
			await renderSuspended(GroundFloor, {
				route: {
					params: { floor: '0' }
				}
			});
	
			expect((await screen.findByTestId('typeOfGroundFloor_suspendedFloor')).hasAttribute('checked')).toBe(true);
			expect((await screen.findByTestId('heightOfFloorUpperSurface') as HTMLInputElement).value).toBe('0');
			expect((await screen.findByTestId('thicknessOfWalls') as HTMLInputElement).value).toBe('0');
			expect((await screen.findByTestId('underfloorSpaceThermalResistance') as HTMLInputElement).value).toBe('0');
			expect((await screen.findByTestId('thermalTransmittanceOfWallsAboveGround') as HTMLInputElement).value).toBe('0');
			expect((await screen.findByTestId('ventilationOpeningsArea') as HTMLInputElement).value).toBe('0');
		});
			
		it('required error messages are displayed when empty form is submitted', async () => {
			await renderSuspended(GroundFloor);
	
			await user.click(screen.getByTestId('typeOfGroundFloor_suspendedFloor'));
			await user.click(screen.getByRole('button'));

			expect((await screen.findByTestId('heightOfFloorUpperSurface_error'))).toBeDefined();
			expect((await screen.findByTestId('thicknessOfWalls_error'))).toBeDefined();
			expect((await screen.findByTestId('underfloorSpaceThermalResistance_error'))).toBeDefined();
			expect((await screen.findByTestId('thermalTransmittanceOfWallsAboveGround_error'))).toBeDefined();
			expect((await screen.findByTestId('ventilationOpeningsArea_error'))).toBeDefined();
		});
	});
	
	describe('when type of ground floor is heated basement', () => {
		it('data is saved to store state when form is valid', async () => {
			await renderSuspended(GroundFloor);
	
			await populateValidForm();
			await user.click(screen.getByTestId('typeOfGroundFloor_heatedBasement'));
			await user.type(screen.getByTestId('thicknessOfWalls'), '0');
			await user.type(screen.getByTestId('depthOfBasementFloorBelowGround'), '0');
			await user.type(screen.getByTestId('thermalResistanceOfBasementWalls'), '0');
			await user.tab();
			await user.click(screen.getByRole('button'));
	
			const { data } = store.livingSpaceFabric.livingSpaceFloors.livingSpaceGroundFloor;
			const entryData = Object.entries(data[0]).filter(e => e[1] !== undefined);
			
			expect(Object.fromEntries(entryData)).toEqual(groundFloorWithHeatedBasement);
		});
	
		it('form is prepopulated when data exists in state', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceFloors: {
						livingSpaceGroundFloor: {
							data: [groundFloorWithHeatedBasement]
						}
					}
				}
			});
	
			await renderSuspended(GroundFloor, {
				route: {
					params: { floor: '0' }
				}
			});
	
			expect((await screen.findByTestId('typeOfGroundFloor_heatedBasement')).hasAttribute('checked')).toBe(true);
			expect((await screen.findByTestId('thicknessOfWalls') as HTMLInputElement).value).toBe('0');
			expect((await screen.findByTestId('depthOfBasementFloorBelowGround') as HTMLInputElement).value).toBe('0');
			expect((await screen.findByTestId('thermalResistanceOfBasementWalls') as HTMLInputElement).value).toBe('0');
		});
			
		it('required error messages are displayed when empty form is submitted', async () => {
			await renderSuspended(GroundFloor);
	
			await user.click(screen.getByTestId('typeOfGroundFloor_heatedBasement'));
			await user.click(screen.getByRole('button'));

			expect((await screen.findByTestId('thicknessOfWalls_error'))).toBeDefined();
			expect((await screen.findByTestId('depthOfBasementFloorBelowGround_error'))).toBeDefined();
			expect((await screen.findByTestId('thermalResistanceOfBasementWalls_error'))).toBeDefined();
		});
	});
	
	describe('when type of ground floor is unheated basement', () => {
		it('data is saved to store state when form is valid', async () => {
			await renderSuspended(GroundFloor);
	
			await populateValidForm();
			await user.click(screen.getByTestId('typeOfGroundFloor_unheatedBasement'));
			await user.type(screen.getByTestId('thermalTransmittanceOfFloorAboveBasement'), '0');
			await user.type(screen.getByTestId('thermalTransmittanceOfWallsAboveGround'), '0');
			await user.type(screen.getByTestId('thermalTransmittanceOfBasementWalls'), '0');
			await user.type(screen.getByTestId('thicknessOfWalls'), '0');
			await user.type(screen.getByTestId('depthOfBasementFloorBelowGround'), '0');
			await user.type(screen.getByTestId('heightOfBasementWallsAboveGround'), '0');
			await user.tab();
			await user.click(screen.getByRole('button'));
	
			const { data } = store.livingSpaceFabric.livingSpaceFloors.livingSpaceGroundFloor;
			const entryData = Object.entries(data[0]).filter(e => e[1] !== undefined);
			
			expect(Object.fromEntries(entryData)).toEqual(groundFloorWithUnheatedBasement);
		});
	
		it('form is prepopulated when data exists in state', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceFloors: {
						livingSpaceGroundFloor: {
							data: [groundFloorWithUnheatedBasement]
						}
					}
				}
			});
	
			await renderSuspended(GroundFloor, {
				route: {
					params: { floor: '0' }
				}
			});
	
			expect((await screen.findByTestId('typeOfGroundFloor_unheatedBasement')).hasAttribute('checked')).toBe(true);
			expect((await screen.findByTestId('thermalTransmittanceOfFloorAboveBasement') as HTMLInputElement).value).toBe('0');
			expect((await screen.findByTestId('thermalTransmittanceOfWallsAboveGround') as HTMLInputElement).value).toBe('0');
			expect((await screen.findByTestId('thermalTransmittanceOfBasementWalls') as HTMLInputElement).value).toBe('0');
			expect((await screen.findByTestId('thicknessOfWalls') as HTMLInputElement).value).toBe('0');
			expect((await screen.findByTestId('depthOfBasementFloorBelowGround') as HTMLInputElement).value).toBe('0');
			expect((await screen.findByTestId('heightOfBasementWallsAboveGround') as HTMLInputElement).value).toBe('0');
		});
			
		it('required error messages are displayed when empty form is submitted', async () => {
			await renderSuspended(GroundFloor);
	
			await user.click(screen.getByTestId('typeOfGroundFloor_unheatedBasement'));
			await user.click(screen.getByRole('button'));

			expect((await screen.findByTestId('thermalTransmittanceOfFloorAboveBasement_error'))).toBeDefined();
			expect((await screen.findByTestId('thermalTransmittanceOfWallsAboveGround_error'))).toBeDefined();
			expect((await screen.findByTestId('thermalTransmittanceOfBasementWalls_error'))).toBeDefined();
			expect((await screen.findByTestId('thicknessOfWalls_error'))).toBeDefined();
			expect((await screen.findByTestId('depthOfBasementFloorBelowGround_error'))).toBeDefined();
			expect((await screen.findByTestId('heightOfBasementWallsAboveGround_error'))).toBeDefined();
		});
	});

	it('requires pitch when custom pitch option is selected', async () => {
		await renderSuspended(GroundFloor);

		await user.click(screen.getByTestId('pitchOption_custom'));
		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('pitch_error'))).toBeDefined();
	});

	it('saves custom pitch when custom pitch option is selected', async () => {
		await renderSuspended(GroundFloor);

		await populateValidForm();
		await user.click(screen.getByTestId('pitchOption_custom'));
		await user.type(screen.getByTestId('pitch'), '90');
		await user.tab();
		await user.click(screen.getByRole('button'));

		const groundFloor = store.livingSpaceFabric.livingSpaceFloors.livingSpaceGroundFloor;
		
		expect(groundFloor.data[0].pitch).toEqual(90);
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(GroundFloor);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('groundFloorErrorSummary'))).toBeDefined();
	});

	it('navigates to floors page when valid form is completed', async () => {
		await renderSuspended(GroundFloor);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { complete } = store.livingSpaceFabric.livingSpaceFloors.livingSpaceGroundFloor;
		
		expect(complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/living-space/floors');
	});
});