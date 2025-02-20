import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import InternalFloor from './[floor].vue';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('internal floor', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const internalFloor: InternalFloorData = {
		typeOfInternalFloor: 'heatedSpace',
		name: "Internal 1",
		surfaceAreaOfElement: 5,
		uValue: 1,
		kappaValue: 100,
		massDistributionClass: 'internal',
		pitchOption: '0',
		pitch: 0
	};

	const internalFloorWithUnheatedSpace: InternalFloorData = {
		...internalFloor,
		typeOfInternalFloor: 'unheatedSpace',
		thermalResistanceOfAdjacentUnheatedSpace: 0
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Internal 1');
		await user.type(screen.getByTestId('surfaceAreaOfElement'), '5');
		await user.type(screen.getByTestId('uValue'), '1');
		await user.type(screen.getByTestId('kappaValue'), '100');
		await user.click(screen.getByTestId('massDistributionClass_internal'));
		await user.click(screen.getByTestId('pitchOption_0'));
	};
	
	describe('when type of internal floor is heated space', () => {
		it('data is saved to store state when form is valid', async () => {
			await renderSuspended(InternalFloor);
	
			await user.click(screen.getByTestId('typeOfInternalFloor_heatedSpace'));
			await populateValidForm();
			await user.click(screen.getByRole('button'));
	
			const  { livingSpaceInternalFloor } = store.livingSpaceFabric.livingSpaceFloors;
			
			expect(livingSpaceInternalFloor?.data[0]).toEqual(internalFloor);
			expect(livingSpaceInternalFloor?.complete).toBe(true);
			expect(navigateToMock).toHaveBeenCalledWith('/living-space/floors');
		});
	
		it('form is prepopulated when data exists in state', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceFloors: {
						livingSpaceInternalFloor: {
							data: [internalFloor]
						}
					}
				}
			});
	
			await renderSuspended(InternalFloor, {
				route: {
					params: { floor: '0' }
				}
			});
	
			expect((await screen.findByTestId('typeOfInternalFloor_heatedSpace')).hasAttribute('checked')).toBe(true);
			expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Internal 1');
			expect((await screen.findByTestId('surfaceAreaOfElement') as HTMLInputElement).value).toBe('5');
			expect((await screen.findByTestId('uValue') as HTMLInputElement).value).toBe('1');
			expect((await screen.findByTestId('kappaValue') as HTMLInputElement).value).toBe('100');
			expect((await screen.findByTestId('massDistributionClass_internal')).hasAttribute('checked')).toBe(true);
			expect((await screen.findByTestId('pitchOption_0')).hasAttribute('checked')).toBe(true);
		});

		it('requires additional fields when heated space is selected', async () => {
			await renderSuspended(InternalFloor);
	
			await user.click(screen.getByTestId('typeOfInternalFloor_heatedSpace'));
			await user.click(screen.getByRole('button'));
	
			expect((await screen.findByTestId('name_error'))).toBeDefined();
			expect((await screen.findByTestId('surfaceAreaOfElement_error'))).toBeDefined();
			expect((await screen.findByTestId('uValue_error'))).toBeDefined();
			expect((await screen.findByTestId('kappaValue_error'))).toBeDefined();
			expect((await screen.findByTestId('massDistributionClass_error'))).toBeDefined();
			expect((await screen.findByTestId('pitchOption_error'))).toBeDefined();
		});
	});
	
	describe('when type of internal floor is unheated space', () => {
		it('data is saved to store state when form is valid', async () => {
			await renderSuspended(InternalFloor);
	
			await user.click(screen.getByTestId('typeOfInternalFloor_unheatedSpace'));
			await populateValidForm();
			await user.type(screen.getByTestId('thermalResistanceOfAdjacentUnheatedSpace'), '0');
			await user.tab();
			await user.click(screen.getByRole('button'));
	
			const { livingSpaceInternalFloor } = store.livingSpaceFabric.livingSpaceFloors;
			
			expect(livingSpaceInternalFloor?.data[0]).toEqual(internalFloorWithUnheatedSpace);
		});
	
		it('form is prepopulated when data exists in state', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceFloors: {
						livingSpaceInternalFloor: {
							data: [internalFloorWithUnheatedSpace]
						}
					}
				}
			});
	
			await renderSuspended(InternalFloor, {
				route: {
					params: { floor: '0' }
				}
			});
	
			expect((await screen.findByTestId('typeOfInternalFloor_unheatedSpace')).hasAttribute('checked')).toBe(true);
			expect((await screen.findByTestId('thermalResistanceOfAdjacentUnheatedSpace') as HTMLInputElement).value).toBe('0');
		});

		it('requires additional fields when heated space is selected', async () => {
			await renderSuspended(InternalFloor);
	
			await user.click(screen.getByTestId('typeOfInternalFloor_unheatedSpace'));
			await user.click(screen.getByRole('button'));
	
			expect((await screen.findByTestId('thermalResistanceOfAdjacentUnheatedSpace_error'))).toBeDefined();
		});
	});

	it('shows type of internal floor required error message when empty form is submitted', async () => {
		await renderSuspended(InternalFloor);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('typeOfInternalFloor_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(InternalFloor);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('internalFloorErrorSummary'))).toBeDefined();
	});

	it('requires pitch when custom pitch option is selected', async () => {
		await renderSuspended(InternalFloor);

		await user.click(screen.getByTestId('typeOfInternalFloor_heatedSpace'));
		await user.click(screen.getByTestId('pitchOption_custom'));
		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('pitch_error'))).toBeDefined();
	});

	it('saves custom pitch when custom pitch option is selected', async () => {
		await renderSuspended(InternalFloor);

		await user.click(screen.getByTestId('typeOfInternalFloor_heatedSpace'));
		await populateValidForm();
		await user.click(screen.getByTestId('pitchOption_custom'));
		await user.type(screen.getByTestId('pitch'), '90');
		await user.tab();
		await user.click(screen.getByRole('button'));

		const { livingSpaceInternalFloor } = store.livingSpaceFabric.livingSpaceFloors;
		
		expect(livingSpaceInternalFloor?.data[0].pitch).toEqual(90);
	});

	it('navigates to floors page when valid form is completed', async () => {
		await renderSuspended(InternalFloor);
	
		await user.click(screen.getByTestId('typeOfInternalFloor_heatedSpace'));
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { livingSpaceInternalFloor } = store.livingSpaceFabric.livingSpaceFloors;
		
		expect(livingSpaceInternalFloor?.complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/living-space/floors');
	});
});