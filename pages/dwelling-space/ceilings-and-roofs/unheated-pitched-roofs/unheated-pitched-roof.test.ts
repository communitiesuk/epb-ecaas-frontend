import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import Roof from './[roof].vue';
import { MassDistributionClass } from "~/schema/api-schema.types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('unheated pitched roof', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const roof: RoofData = {
		name: "Roof 1",
		typeOfRoof: 'unheatedPitched',
		pitch: 0,
		orientation: 90,
		length: 1,
		width: 1,
		elevationalHeightOfElement: 2,
		surfaceArea: 1,
		solarAbsorptionCoefficient: 0.5,
		uValue: 1,
		kappaValue: 50000,
		massDistributionClass: MassDistributionClass.I
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Roof 1');
		await user.type(screen.getByTestId('pitch'), '0');
		await user.type(screen.getByTestId('orientation'), '90');
		await user.type(screen.getByTestId('length'), '1');
		await user.type(screen.getByTestId('width'), '1');
		await user.type(screen.getByTestId('elevationalHeightOfElement'), '2');
		await user.type(screen.getByTestId('surfaceArea'), '1');
		await user.type(screen.getByTestId('solarAbsorptionCoefficient'), '0.5');
		await user.type(screen.getByTestId('uValue'), '1');
		await user.click(screen.getByTestId('kappaValue_50000'));
		await user.click(screen.getByTestId('massDistributionClass_I'));
	};

	test('data is saved to store state when form is valid', async () => {
		await renderSuspended(Roof);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const  { dwellingSpaceUnheatedPitchedRoofs } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
		
		expect(dwellingSpaceUnheatedPitchedRoofs?.data[0]).toEqual(roof);
	});

	test('form is prepopulated when data exists in state', async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceCeilingsAndRoofs: {
					dwellingSpaceUnheatedPitchedRoofs: {
						data: [roof]
					}
				}
			}
		});

		await renderSuspended(Roof, {
			route: {
				params: { roof: '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Roof 1');
		expect((await screen.findByTestId('pitch') as HTMLInputElement).value).toBe('0');
		expect((await screen.findByTestId('orientation') as HTMLInputElement).value).toBe('90');
		expect((await screen.findByTestId('length') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('width') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('elevationalHeightOfElement') as HTMLInputElement).value).toBe('2');
		expect((await screen.findByTestId('surfaceArea') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('solarAbsorptionCoefficient') as HTMLInputElement).value).toBe('0.5');
		expect((await screen.findByTestId('uValue') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('kappaValue_50000')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('massDistributionClass_I')).hasAttribute('checked')).toBe(true);
	});

	test('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(Roof);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('pitch_error'))).toBeDefined();
		expect((await screen.findByTestId('orientation_error'))).toBeDefined();
		expect((await screen.findByTestId('length_error'))).toBeDefined();
		expect((await screen.findByTestId('width_error'))).toBeDefined();
		expect((await screen.findByTestId('elevationalHeightOfElement_error'))).toBeDefined();
		expect((await screen.findByTestId('surfaceArea_error'))).toBeDefined();
		expect((await screen.findByTestId('solarAbsorptionCoefficient_error'))).toBeDefined();
		expect((await screen.findByTestId('uValue_error'))).toBeDefined();
		expect((await screen.findByTestId('kappaValue_error'))).toBeDefined();
		expect((await screen.findByTestId('massDistributionClass_error'))).toBeDefined();
	});

	test('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(Roof);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('roofErrorSummary'))).toBeDefined();
	});

	it('navigates to ceilings and roofs page when valid form is completed', async () => {
		await renderSuspended(Roof);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		expect(navigateToMock).toHaveBeenCalledWith('/dwelling-space/ceilings-and-roofs');
	});
});