import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import Shading from './index.vue';
import { renderSuspended } from "@nuxt/test-utils/runtime";

describe('shading', () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it('distribution is removed when remove is clicked', async () => {
		const user = userEvent.setup();

		store.$patch({
			dwellingDetails: {
				shading: {
					data: {
						distributions: [{
							name: 'Shading 1',
							length: 20,
							diameter: 22,
							thickness: 20,
							thermalConductivity: 0.035,
							surfaceReflectivity: false
						}]
					}
				}
			}
		});

		await renderSuspended(Shading);

		expect(screen.getAllByTestId('customListItems')).toBeDefined();

		await user.click(screen.getByTestId('customListItemRemove_0'));

		expect(screen.queryByTestId('customListItems')).toBeNull();
	});
});