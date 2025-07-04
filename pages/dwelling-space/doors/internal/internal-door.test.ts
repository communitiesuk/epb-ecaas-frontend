import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import InternalDoor from './[door].vue';
import { MassDistributionClass } from "~/schema/api-schema.types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('internal door', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const internalDoor: InternalDoorData = {
		typeOfInternalDoor: AdjacentSpaceType.heatedSpace,
		name: "Internal 1",
		surfaceArea: 5,
		kappaValue: 50000,
		massDistributionClass: MassDistributionClass.I,
		pitchOption: '90',
		pitch: 90
	};

	const internalDoorWithUnheatedSpace: InternalDoorData = {
		...internalDoor,
		typeOfInternalDoor: AdjacentSpaceType.unheatedSpace,
		thermalResistanceOfAdjacentUnheatedSpace: 0
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Internal 1');
		await user.type(screen.getByTestId('surfaceArea'), '5');
		await user.click(screen.getByTestId('kappaValue_50000'));
		await user.click(screen.getByTestId('massDistributionClass_I'));
		await user.click(screen.getByTestId('pitchOption_90'));
	};
	
	describe('when type of internal door is heated space', () => {
		test('data is saved to store state when form is valid', async () => {
			await renderSuspended(InternalDoor);
	
			await user.click(screen.getByTestId('typeOfInternalDoor_heatedSpace'));
			await populateValidForm();
			await user.click(screen.getByRole('button'));
	
			const { dwellingSpaceInternalDoor } = store.dwellingFabric.dwellingSpaceDoors;
			
			expect(dwellingSpaceInternalDoor?.data[0]).toEqual(internalDoor);
		});
	
		test('form is prepopulated when data exists in state', async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceInternalDoor: {
							data: [internalDoor]
						}
					}
				}
			});
	
			await renderSuspended(InternalDoor, {
				route: {
					params: { door: '0' }
				}
			});
	
			expect((await screen.findByTestId('typeOfInternalDoor_heatedSpace')).hasAttribute('checked')).toBe(true);
			expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Internal 1');
			expect((await screen.findByTestId('surfaceArea') as HTMLInputElement).value).toBe('5');
			expect((await screen.findByTestId('kappaValue_50000')).hasAttribute('checked')).toBe(true);
			expect((await screen.findByTestId('massDistributionClass_I')).hasAttribute('checked')).toBe(true);
			expect((await screen.findByTestId('pitchOption_90')).hasAttribute('checked')).toBe(true);
		});

		it('requires additional fields when heated space is selected', async () => {
			await renderSuspended(InternalDoor);
	
			await user.click(screen.getByTestId('typeOfInternalDoor_heatedSpace'));
			await user.click(screen.getByRole('button'));
	
			expect((await screen.findByTestId('name_error'))).toBeDefined();
			expect((await screen.findByTestId('surfaceArea_error'))).toBeDefined();
			expect((await screen.findByTestId('kappaValue_error'))).toBeDefined();
			expect((await screen.findByTestId('massDistributionClass_error'))).toBeDefined();
			expect((await screen.findByTestId('pitchOption_error'))).toBeDefined();
		});
	});
	
	describe('when type of internal door is unheated space', () => {
		test('data is saved to store state when form is valid', async () => {
			await renderSuspended(InternalDoor);
	
			await user.click(screen.getByTestId('typeOfInternalDoor_unheatedSpace'));
			await populateValidForm();
			await user.type(screen.getByTestId('thermalResistanceOfAdjacentUnheatedSpace'), '0');
			await user.tab();
			await user.click(screen.getByRole('button'));
	
			const { dwellingSpaceInternalDoor } = store.dwellingFabric.dwellingSpaceDoors;
			
			expect(dwellingSpaceInternalDoor?.data[0]).toEqual(internalDoorWithUnheatedSpace);
		});
	
		test('form is prepopulated when data exists in state', async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceInternalDoor: {
							data: [internalDoorWithUnheatedSpace]
						}
					}
				}
			});
	
			await renderSuspended(InternalDoor, {
				route: {
					params: { door: '0' }
				}
			});
	
			expect((await screen.findByTestId('typeOfInternalDoor_unheatedSpace')).hasAttribute('checked')).toBe(true);
			expect((await screen.findByTestId('thermalResistanceOfAdjacentUnheatedSpace') as HTMLInputElement).value).toBe('0');
		});

		it('requires additional fields when heated space is selected', async () => {
			await renderSuspended(InternalDoor);
	
			await user.click(screen.getByTestId('typeOfInternalDoor_unheatedSpace'));
			await user.click(screen.getByRole('button'));
	
			expect((await screen.findByTestId('thermalResistanceOfAdjacentUnheatedSpace_error'))).toBeDefined();
		});
	});

	it('shows type of ceiling required error message when empty form is submitted', async () => {
		await renderSuspended(InternalDoor);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('typeOfInternalDoor_error'))).toBeDefined();
	});

	test('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(InternalDoor);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('internalDoorErrorSummary'))).toBeDefined();
	});

	it('requires pitch when custom pitch option is selected', async () => {
		await renderSuspended(InternalDoor);

		await user.click(screen.getByTestId('typeOfInternalDoor_heatedSpace'));
		await user.click(screen.getByTestId('pitchOption_custom'));
		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('pitch_error'))).toBeDefined();
	});

	it('saves custom pitch when custom pitch option is selected', async () => {
		await renderSuspended(InternalDoor);

		await user.click(screen.getByTestId('typeOfInternalDoor_heatedSpace'));
		await populateValidForm();
		await user.click(screen.getByTestId('pitchOption_custom'));
		await user.type(screen.getByTestId('pitch'), '90');
		await user.tab();
		await user.click(screen.getByRole('button'));

		const { dwellingSpaceInternalDoor } = store.dwellingFabric.dwellingSpaceDoors;
		
		expect(dwellingSpaceInternalDoor?.data[0]?.pitch).toEqual(90);
	});

	it('navigates to doors page when valid form is completed', async () => {
		await renderSuspended(InternalDoor);
	
		await user.click(screen.getByTestId('typeOfInternalDoor_heatedSpace'));
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		expect(navigateToMock).toHaveBeenCalledWith('/dwelling-space/doors');
	});
});