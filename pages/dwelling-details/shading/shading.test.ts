import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import {within} from '@testing-library/dom'

import Shading from './index.vue';
import { renderSuspended } from "@nuxt/test-utils/runtime";

describe('shading', () => {
	const store = useEcaasStore();

	const shading1: ShadingObject = {
		name: "Cherry Tree",
		direction: 30,
		objectType: "obstacle",
		height: 3,
		distance: 2
	};

	const shading2: ShadingObject = {
		...shading1,
		name: 'Apple Tree'
	};

	afterEach(() => {
		store.$reset();
	});

	it('shading is removed when remove link is clicked', async () => {
		const user = userEvent.setup();

		store.$patch({
			dwellingDetails: {
				shading: {
					data: {
						shadingObjects: [shading1]
					}
				}
			}
		});

		await renderSuspended(Shading);

		expect(screen.getAllByTestId('customListItems')).toBeDefined();

		await user.click(screen.getByTestId('customListItemRemove_0'));

		expect(screen.queryByTestId('customListItems')).toBeNull();
	});

	it('only second shading object is removed when corresponding remove link is clicked', async () => {
		const user = userEvent.setup();

		store.$patch({
			dwellingDetails: {
				shading: {
					data: {
						shadingObjects: [shading1, shading2]
					}
				}
			}
		});

		await renderSuspended(Shading);
		await user.click(screen.getByTestId('customListItemRemove_1'));

		const populatedList = screen.getByTestId('customListItems');
		expect(within(populatedList).getByText('Cherry Tree')).toBeDefined();
		expect(within(populatedList).queryByText('Apple Tree')).toBeNull();
	});

	it('shading is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			dwellingDetails: {
				shading: {
					data: {
						shadingObjects: [shading1]
					}
				}
			}
		});

		await renderSuspended(Shading);

		await userEvent.click(screen.getByTestId('customListItemDuplicate_0'));

		expect(screen.queryAllByTestId('customListItem').length).toBe(2);
		expect(screen.getByText('Cherry Tree (1)')).toBeDefined();
	})
});
