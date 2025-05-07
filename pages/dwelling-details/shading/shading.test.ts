import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import {within} from '@testing-library/dom';
import Shading from './index.vue';
import ShadingForm from './[shading].vue';


import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";

describe('shading', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const navigateToMock = vi.hoisted(() => vi.fn());
	mockNuxtImport('navigateTo', () => {
		return navigateToMock;
	});
	const shading1: ShadingData = {
		name: "Cherry Tree",
		startAngle: 10,
		endAngle: 20,
		objectType: "obstacle",
		height: 3,
		distance: 2
	};

	const shading2: ShadingData = {
		...shading1,
		name: 'Apple Tree'
	};

	const shading3: ShadingData = {
		...shading1,
		name: 'Cherry Tree out front'
	};

	afterEach(() => {
		store.$reset();
	});

	it('shading is removed when remove link is clicked', async () => {
		store.$patch({
			dwellingDetails: {
				shading: {
					data: [shading1]
				}
			}
		});

		await renderSuspended(Shading);

		expect(screen.getAllByTestId('shading_items')).toBeDefined();

		await user.click(screen.getByTestId('shading_remove_0'));

		expect(screen.queryByTestId('shading_items')).toBeNull();
		expect(store.dwellingDetails.shading.complete).toBe(false);
	});

	it('only second shading object is removed when corresponding remove link is clicked', async () => {
		store.$patch({
			dwellingDetails: {
				shading: {
					data: [shading1, shading2]
				}
			}
		});

		await renderSuspended(Shading);
		await user.click(screen.getByTestId('shading_remove_1'));

		const populatedList = screen.getByTestId('shading_items');
		expect(within(populatedList).getByText('Cherry Tree')).toBeDefined();
		expect(within(populatedList).queryByText('Apple Tree')).toBeNull();
	});

	it('shading is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			dwellingDetails: {
				shading: {
					data: [shading1, shading3]
				}
			}
		});

		await renderSuspended(Shading);

		await user.click(screen.getByTestId('shading_duplicate_0'));
		await user.click(screen.getByTestId('shading_duplicate_0'));
		await user.click(screen.getByTestId('shading_duplicate_2'));
		await user.click(screen.getByTestId('shading_duplicate_2'));

		expect(screen.queryAllByTestId('shading_item').length).toBe(6);
		expect(screen.getByText('Cherry Tree')).toBeDefined();
		expect(screen.getByText('Cherry Tree (1)')).toBeDefined();
		expect(screen.getByText('Cherry Tree (2)')).toBeDefined();
		expect(screen.getByText('Cherry Tree (1) (1)')).toBeDefined();
		expect(screen.getByText('Cherry Tree (1) (2)')).toBeDefined();
	});

	it('marks shading as complete when complete button is clicked', async () => {
		store.$patch({
			dwellingDetails: {
				shading: {
					data: [shading1]
				}
			}
		});
		await renderSuspended(Shading);

		await user.click(screen.getByTestId('completeSection'));

		const { complete } = store.dwellingDetails.shading;

		expect(navigateToMock).toHaveBeenCalledWith('/dwelling-details');
		expect(complete).toBe(true);
	});

	it('displays "completed" when user clicks the mark section as complete button', async () => {
		store.$patch({
			dwellingDetails: {
				shading: {
					data: [shading1]
				}
			}
		});
		await renderSuspended(Shading);
		
		expect(screen.getByRole("button", {name: "Mark section as complete"})).toBeDefined();

		await user.click(screen.getByTestId('completeSection'));

		expect(screen.queryByRole("button", {name: "Mark section as complete"})).toBeNull();
		expect(screen.getByText("Completed")).toBeDefined();

	});


	it('marks shading as not complete when complete button is clicked then user removes a shading item', async () => {
		
		store.$patch({
			dwellingDetails: {
				shading: {
					data: [shading1, shading2]
				}
			}
		});
		await renderSuspended(Shading);

		await user.click(screen.getByTestId('completeSection'));
		expect(store.dwellingDetails.shading.complete).toBe(true);

		await user.click(screen.getByTestId('shading_remove_0'));
		expect(store.dwellingDetails.shading.complete).toBe(false);
		expect(screen.getByRole("button", {name: "Mark section as complete"})).toBeDefined();

	});

	it('marks shading as not complete when complete button is clicked then user adds a shading item', async () => {
		
		store.$patch({
			dwellingDetails: {
				shading: {
					data: [shading1]
				}
			}
		});
		await renderSuspended(Shading);
		await user.click(screen.getByTestId('completeSection'));
		expect(store.dwellingDetails.shading.complete).toBe(true);

		await user.click(screen.getByTestId('shading_duplicate_0'));
		expect(store.dwellingDetails.shading.complete).toBe(false);
		expect(screen.getByRole("button", {name: "Mark section as complete"})).toBeDefined();

	});

	it('marks shading as not complete when a user marks section as complete but then makes an edit to a shading item', async () => {
		store.$patch({
			dwellingDetails: {
				shading: {
					data: [shading1]
				}
			}
		});

		await renderSuspended(Shading);
		await user.click(screen.getByTestId('completeSection'));

		await renderSuspended(ShadingForm, {
			route: {
				params: {shading: '0'}
			}
		});
		await user.tab();
		await user.clear(screen.getByTestId("name"));
		await user.type(screen.getByTestId("name"), "Cherry tree edited");
		await user.tab();
		await user.click(screen.getByRole('button'));

		const { complete } = store.dwellingDetails.shading;
		expect(complete).toBe(false);

		await renderSuspended(Shading);
		expect(screen.getByRole("button", {name: "Mark section as complete"})).toBeDefined();
		
	});

});

