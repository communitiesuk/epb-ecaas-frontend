import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import Ceiling from './[ceiling].vue';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('ceiling', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const internalFloor: CeilingData = {
		type: 'heatedSpace',
		name: "Ceiling 1",
		surfaceArea: 5,
		uValue: 1,
		kappaValue: 100,
		massDistributionClass: 'internal',
		pitchOption: '0',
		pitch: 0
	};

	const internalFloorWithUnheated: CeilingData = {
		...internalFloor,
		type: 'unheatedSpace',
		thermalResistanceOfAdjacentUnheatedSpace: 0
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Ceiling 1');
		await user.type(screen.getByTestId('surfaceArea'), '5');
		await user.type(screen.getByTestId('uValue'), '1');
		await user.type(screen.getByTestId('kappaValue'), '100');
		await user.click(screen.getByTestId('massDistributionClass_internal'));
		await user.click(screen.getByTestId('pitchOption_0'));
	};
	
	describe('when type of ceiling is heated space', () => {
		it('data is saved to store state when form is valid', async () => {
			await renderSuspended(Ceiling);
	
			await user.click(screen.getByTestId('type_heatedSpace'));
			await populateValidForm();
			await user.click(screen.getByRole('button'));
	
			const  { livingSpaceCeilings } = store.livingSpaceFabric.livingSpaceCeilingsAndRoofs;
			
			expect(livingSpaceCeilings?.data[0]).toEqual(internalFloor);
		});
	
		it('form is prepopulated when data exists in state', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceCeilingsAndRoofs: {
						livingSpaceCeilings: {
							data: [internalFloor]
						}
					}
				}
			});
	
			await renderSuspended(Ceiling, {
				route: {
					params: { ceiling: '0' }
				}
			});
	
			expect((await screen.findByTestId('type_heatedSpace')).hasAttribute('checked')).toBe(true);
			expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Ceiling 1');
			expect((await screen.findByTestId('surfaceArea') as HTMLInputElement).value).toBe('5');
			expect((await screen.findByTestId('uValue') as HTMLInputElement).value).toBe('1');
			expect((await screen.findByTestId('kappaValue') as HTMLInputElement).value).toBe('100');
			expect((await screen.findByTestId('massDistributionClass_internal')).hasAttribute('checked')).toBe(true);
			expect((await screen.findByTestId('pitchOption_0')).hasAttribute('checked')).toBe(true);
		});

		it('requires additional fields when heated space is selected', async () => {
			await renderSuspended(Ceiling);
	
			await user.click(screen.getByTestId('type_heatedSpace'));
			await user.click(screen.getByRole('button'));
	
			expect((await screen.findByTestId('name_error'))).toBeDefined();
			expect((await screen.findByTestId('surfaceArea_error'))).toBeDefined();
			expect((await screen.findByTestId('uValue_error'))).toBeDefined();
			expect((await screen.findByTestId('kappaValue_error'))).toBeDefined();
			expect((await screen.findByTestId('massDistributionClass_error'))).toBeDefined();
			expect((await screen.findByTestId('pitchOption_error'))).toBeDefined();
		});
	});
	
	describe('when type of ceiling is unheated space', () => {
		it('data is saved to store state when form is valid', async () => {
			await renderSuspended(Ceiling);
	
			await user.click(screen.getByTestId('type_unheatedSpace'));
			await populateValidForm();
			await user.type(screen.getByTestId('thermalResistanceOfAdjacentUnheatedSpace'), '0');
			await user.tab();
			await user.click(screen.getByRole('button'));
	
			const { livingSpaceCeilings } = store.livingSpaceFabric.livingSpaceCeilingsAndRoofs;
			
			expect(livingSpaceCeilings?.data[0]).toEqual(internalFloorWithUnheated);
		});
	
		it('form is prepopulated when data exists in state', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceCeilingsAndRoofs: {
						livingSpaceCeilings: {
							data: [internalFloorWithUnheated]
						}
					}
				}
			});
	
			await renderSuspended(Ceiling, {
				route: {
					params: { ceiling: '0' }
				}
			});

			expect((await screen.findByTestId('type_unheatedSpace')).hasAttribute('checked')).toBe(true);
			expect((await screen.findByTestId('thermalResistanceOfAdjacentUnheatedSpace') as HTMLInputElement).value).toBe('0');
		});

		it('requires additional fields when heated space is selected', async () => {
			await renderSuspended(Ceiling);
	
			await user.click(screen.getByTestId('type_unheatedSpace'));
			await user.click(screen.getByRole('button'));
	
			expect((await screen.findByTestId('thermalResistanceOfAdjacentUnheatedSpace_error'))).toBeDefined();
		});
	});

	it('shows type of ceiling required error message when empty form is submitted', async () => {
		await renderSuspended(Ceiling);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('type_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(Ceiling);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('ceilingErrorSummary'))).toBeDefined();
	});

	it('requires pitch when custom pitch option is selected', async () => {
		await renderSuspended(Ceiling);

		await user.click(screen.getByTestId('type_heatedSpace'));
		await user.click(screen.getByTestId('pitchOption_custom'));
		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('pitch_error'))).toBeDefined();
	});

	it('saves custom pitch when custom pitch option is selected', async () => {
		await renderSuspended(Ceiling);

		await user.click(screen.getByTestId('type_heatedSpace'));
		await populateValidForm();
		await user.click(screen.getByTestId('pitchOption_custom'));
		await user.type(screen.getByTestId('pitch'), '90');
		await user.tab();
		await user.click(screen.getByRole('button'));

		const { livingSpaceCeilings } = store.livingSpaceFabric.livingSpaceCeilingsAndRoofs;
		
		expect(livingSpaceCeilings?.data[0].pitch).toEqual(90);
	});

	it('navigates to ceilings and roofs page when valid form is completed', async () => {
		await renderSuspended(Ceiling);
	
		await user.click(screen.getByTestId('type_heatedSpace'));
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { livingSpaceCeilings } = store.livingSpaceFabric.livingSpaceCeilingsAndRoofs;
		
		expect(livingSpaceCeilings?.complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/living-space/ceilings-and-roofs');
	});
});