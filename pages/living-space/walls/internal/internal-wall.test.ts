import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import InternalWall from './[wall].vue';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('internal wall', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const internalWall: InternalWallData = {
		name: "Internal 1",
		surfaceAreaOfElement: 5,
		uValue: 1,
		kappaValue: 100,
		massDistributionClass: 'internal',
		pitchOption: '0',
		pitch: 0
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
	
	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(InternalWall);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const  { livingSpaceInternalWall } = store.livingSpaceFabric.livingSpaceWalls;
		
		expect(livingSpaceInternalWall?.data[0]).toEqual(internalWall);
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			livingSpaceFabric: {
				livingSpaceWalls: {
					livingSpaceInternalWall: {
						data: [internalWall]
					}
				}
			}
		});

		await renderSuspended(InternalWall, {
			route: {
				params: { wall: '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Internal 1');
		expect((await screen.findByTestId('surfaceAreaOfElement') as HTMLInputElement).value).toBe('5');
		expect((await screen.findByTestId('uValue') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('kappaValue') as HTMLInputElement).value).toBe('100');
		expect((await screen.findByTestId('massDistributionClass_internal')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('pitchOption_0')).hasAttribute('checked')).toBe(true);
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(InternalWall);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('surfaceAreaOfElement_error'))).toBeDefined();
		expect((await screen.findByTestId('uValue_error'))).toBeDefined();
		expect((await screen.findByTestId('kappaValue_error'))).toBeDefined();
		expect((await screen.findByTestId('massDistributionClass_error'))).toBeDefined();
		expect((await screen.findByTestId('pitchOption_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(InternalWall);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('internalWallErrorSummary'))).toBeDefined();
	});

	it('requires pitch when custom pitch option is selected', async () => {
		await renderSuspended(InternalWall);

		await user.click(screen.getByTestId('pitchOption_custom'));
		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('pitch_error'))).toBeDefined();
	});

	it('saves custom pitch when custom pitch option is selected', async () => {
		await renderSuspended(InternalWall);

		await populateValidForm();
		await user.click(screen.getByTestId('pitchOption_custom'));
		await user.type(screen.getByTestId('pitch'), '90');
		await user.tab();
		await user.click(screen.getByRole('button'));

		const { livingSpaceInternalWall } = store.livingSpaceFabric.livingSpaceWalls;
		
		expect(livingSpaceInternalWall?.data[0].pitch).toEqual(90);
	});

	it('navigates to walls page when valid form is completed', async () => {
		await renderSuspended(InternalWall);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { livingSpaceInternalWall } = store.livingSpaceFabric.livingSpaceWalls;
		
		expect(livingSpaceInternalWall?.complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/living-space/walls');
	});
});