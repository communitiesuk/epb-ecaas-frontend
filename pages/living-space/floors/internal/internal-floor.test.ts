import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import InternalFloor from './[floor].vue';
import { MassDistributionClass } from "~/schema/api-schema.types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('internal floor', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const internalFloor: InternalFloorData = {
		typeOfInternalFloor: AdjacentSpaceType.heatedSpace,
		name: "Internal 1",
		surfaceAreaOfElement: 5,
		kappaValue: 50000,
		massDistributionClass: MassDistributionClass.I,
	};

	const internalFloorWithUnheatedSpace: InternalFloorData = {
		...internalFloor,
		typeOfInternalFloor: AdjacentSpaceType.unheatedSpace,
		thermalResistanceOfAdjacentUnheatedSpace: 0
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Internal 1');
		await user.type(screen.getByTestId('surfaceAreaOfElement'), '5');
		await user.click(screen.getByTestId('kappaValue_50000'));
		await user.click(screen.getByTestId('massDistributionClass_I'));
	};
	
	describe('when type of internal floor is heated space', () => {
		test('data is saved to store state when form is valid', async () => {
			await renderSuspended(InternalFloor);
	
			await user.click(screen.getByTestId('typeOfInternalFloor_heatedSpace'));
			await populateValidForm();
			await user.click(screen.getByRole('button'));
	
			const  { livingSpaceInternalFloor } = store.livingSpaceFabric.livingSpaceFloors;
			
			expect(livingSpaceInternalFloor?.data[0]).toEqual(internalFloor);
		});
	
		test('form is prepopulated when data exists in state', async () => {
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
			expect((await screen.findByTestId('kappaValue_50000')).hasAttribute('checked')).toBe(true);
			expect((await screen.findByTestId('massDistributionClass_I')).hasAttribute('checked')).toBe(true);
		});

		it('requires additional fields when heated space is selected', async () => {
			await renderSuspended(InternalFloor);
	
			await user.click(screen.getByTestId('typeOfInternalFloor_heatedSpace'));
			await user.click(screen.getByRole('button'));
	
			expect((await screen.findByTestId('name_error'))).toBeDefined();
			expect((await screen.findByTestId('surfaceAreaOfElement_error'))).toBeDefined();
			expect((await screen.findByTestId('kappaValue_error'))).toBeDefined();
			expect((await screen.findByTestId('massDistributionClass_error'))).toBeDefined();
		});
	});
	
	describe('when type of internal floor is unheated space', () => {
		test('data is saved to store state when form is valid', async () => {
			await renderSuspended(InternalFloor);
	
			await user.click(screen.getByTestId('typeOfInternalFloor_unheatedSpace'));
			await populateValidForm();
			await user.type(screen.getByTestId('thermalResistanceOfAdjacentUnheatedSpace'), '0');
			await user.tab();
			await user.click(screen.getByRole('button'));
	
			const { livingSpaceInternalFloor } = store.livingSpaceFabric.livingSpaceFloors;
			
			expect(livingSpaceInternalFloor?.data[0]).toEqual(internalFloorWithUnheatedSpace);
		});
	
		test('form is prepopulated when data exists in state', async () => {
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

	test('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(InternalFloor);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('internalFloorErrorSummary'))).toBeDefined();
	});

	it('navigates to floors page when valid form is completed', async () => {
		await renderSuspended(InternalFloor);
	
		await user.click(screen.getByTestId('typeOfInternalFloor_heatedSpace'));
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		expect(navigateToMock).toHaveBeenCalledWith('/living-space/floors');
	});
});