import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import PointOfUse from './[pointOfUse].vue';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('point of use', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const pointOfUse: PointOfUseData = {
		name: 'Point of use',
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Point of use');
		await user.tab();
	};

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(PointOfUse);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { data, complete } = store.domesticHotWater.waterHeating.pointOfUse;

		expect(data[0]).toEqual(pointOfUse);
		expect(complete).toBe(true);
	});
});