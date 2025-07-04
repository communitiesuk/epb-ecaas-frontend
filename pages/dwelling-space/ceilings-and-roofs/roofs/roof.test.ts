import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import Roof from './[roof].vue';
import { MassDistributionClass } from "~/schema/api-schema.types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('roof', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const roof: RoofData = {
		name: "Roof 1",
		typeOfRoof: 'flat',
		pitchOption: '0',
		pitch: 0,
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
		await user.click(screen.getByTestId('typeOfRoof_flat'));
		await user.click(screen.getByTestId('pitchOption_0'));
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

		const  { dwellingSpaceRoofs } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
		
		expect(dwellingSpaceRoofs?.data[0]).toEqual(roof);
	});

	test('form is prepopulated when data exists in state', async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceCeilingsAndRoofs: {
					dwellingSpaceRoofs: {
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
		expect((await screen.findByTestId('typeOfRoof_flat')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('pitchOption_0')).hasAttribute('checked')).toBe(true);
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
		expect((await screen.findByTestId('typeOfRoof_error'))).toBeDefined();
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

	it('requires pitch option when type of roof is flat', async () => {
		await renderSuspended(Roof);
		await user.click(screen.getByTestId('typeOfRoof_flat'));
		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('pitchOption_error'))).toBeDefined();
	});

	it('requires pitch when custom pitch option is selected', async () => {
		await renderSuspended(Roof);

		await user.click(screen.getByTestId('typeOfRoof_flat'));
		await user.click(screen.getByTestId('pitchOption_custom'));
		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('pitch_error'))).toBeDefined();
	});

	it('saves custom pitch when custom pitch option is selected', async () => {
		await renderSuspended(Roof);

		await populateValidForm();
		await user.click(screen.getByTestId('pitchOption_custom'));
		await user.type(screen.getByTestId('pitch'), '90');
		await user.tab();
		await user.click(screen.getByRole('button'));

		const { dwellingSpaceRoofs } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
		
		expect(dwellingSpaceRoofs?.data[0]?.pitch).toEqual(90);
	});

	it('requires additional fields when type of roof is pitched', async () => {
		await renderSuspended(Roof);
		await user.click(screen.getByTestId('typeOfRoof_pitchedInsulatedAtRoof'));
		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('pitch_error'))).toBeDefined();
		expect((await screen.findByTestId('orientation_error'))).toBeDefined();
	});

	it('saves additional fields when type of roof is pitched', async () => {
		await renderSuspended(Roof);

		await populateValidForm();
		await user.click(screen.getByTestId('typeOfRoof_pitchedInsulatedAtRoof'));
		await user.type(screen.getByTestId('pitch'), '90');
		await user.type(screen.getByTestId('orientation'), '90');
		await user.tab();
		await user.click(screen.getByRole('button'));

		const { dwellingSpaceRoofs } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
		
		expect(dwellingSpaceRoofs?.data[0]?.pitch).toEqual(90);
		expect(dwellingSpaceRoofs?.data[0]?.orientation).toEqual(90);
	});

	it('navigates to ceilings and roofs page when valid form is completed', async () => {
		await renderSuspended(Roof);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		expect(navigateToMock).toHaveBeenCalledWith('/dwelling-space/ceilings-and-roofs');
	});
});