import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Windows from './index.vue';
import WindowsForm from './[window].vue';
import {screen } from '@testing-library/vue';
import {within} from '@testing-library/dom';

describe('windows', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport('navigateTo', () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	const window1: WindowData = {
		name: "Window 1",
		orientation: 1,
		surfaceArea: 1,
		height: 1,
		width: 1,
		uValue: 1,
		pitchOption: '90',
		pitch: 90,
		solarTransmittance: 0.1,
		elevationalHeight: 1,
		midHeight: 1,
		numberOpenableParts: '0',
		frameToOpeningRatio: 0.8,
	};

	const window2: WindowData = {
		...window1,
		name: "Window 2",
		
	};

	const window3: WindowData = {
		...window1,
		name: "Window 3",
	};

	test('window is removed when remove link is clicked', async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: [window1]
				}
			}
		});

		await renderSuspended(Windows);

		expect(screen.getAllByTestId('windows_items')).toBeDefined();

		await user.click(screen.getByTestId('windows_remove_0'));

		expect(screen.queryByTestId('windows_items')).toBeNull();
	});

	it('should only remove the window object thats is clicked', async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: [window1, window2, window3]
				}
			}
		});

		await renderSuspended(Windows);
		await user.click(screen.getByTestId('windows_remove_1'));

		const populatedList = screen.getByTestId('windows_items');

		expect(within(populatedList).getByText('Window 1')).toBeDefined();
		expect(within(populatedList).getByText('Window 3')).toBeDefined();
		expect(within(populatedList).queryByText('Window 2')).toBeNull();

	});
	
	test('window is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: [window1, window2]
				}
			}
		});

		await renderSuspended(Windows);
		await userEvent.click(screen.getByTestId('windows_duplicate_0'));
		await userEvent.click(screen.getByTestId('windows_duplicate_0'));
		await userEvent.click(screen.getByTestId('windows_duplicate_2'));
		await userEvent.click(screen.getByTestId('windows_duplicate_2'));

		expect(screen.queryAllByTestId('windows_item').length).toBe(6);
		expect(screen.getByText('Window 1')).toBeDefined();
		expect(screen.getByText('Window 1 (1)')).toBeDefined();
		expect(screen.getByText('Window 1 (2)')).toBeDefined();
		expect(screen.getByText('Window 1 (1) (1)')).toBeDefined();
		expect(screen.getByText('Window 1 (1) (2)')).toBeDefined();
	});

	it('marks windows as complete when mark section as complete button is clicked', async () => {
		await renderSuspended(Windows);
		expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
	
		const completedStatusElement = screen.queryByTestId('completeSectionCompleted');
		expect(completedStatusElement?.style.display).toBe("none");
	
		await user.click(screen.getByTestId('completeSectionButton'));
	
		const { complete } = store.dwellingFabric.dwellingSpaceWindows;
	
		expect(complete).toBe(true);
		expect(screen.queryByRole("button", { name: "Mark section as complete" })).toBeNull();
		expect(completedStatusElement?.style.display).not.toBe("none");
	
		expect(navigateToMock).toHaveBeenCalledWith('/dwelling-space');
	});
	
	it('marks windows as not complete when complete button is clicked then user removes an item', async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: [window1, window2],
				},
			},
		});
	
		await renderSuspended(Windows);
		await user.click(screen.getByTestId('completeSectionButton'));
	
		expect(store.dwellingFabric.dwellingSpaceWindows.complete).toBe(true);
	
		await user.click(screen.getByTestId('windows_remove_0'));
	
		expect(store.dwellingFabric.dwellingSpaceWindows.complete).toBe(false);
		expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
	});
	
	it('marks windows as not complete when complete button is clicked then user duplicates an item', async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: [window1],
				},
			},
		});
	
		await renderSuspended(Windows);
		await user.click(screen.getByTestId('completeSectionButton'));
	
		expect(store.dwellingFabric.dwellingSpaceWindows.complete).toBe(true);
	
		await user.click(screen.getByTestId('windows_duplicate_0'));
	
		expect(store.dwellingFabric.dwellingSpaceWindows.complete).toBe(false);
		expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
	});
	
	it('marks windows as not complete when user saves a new or edited form after marking section as complete', async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: [window1],
				},
			},
		});
	
		await renderSuspended(Windows);
		await user.click(screen.getByTestId('completeSectionButton'));
	
		await renderSuspended(WindowsForm, {
			route: {
				params: { window: '0' },
			},
		});

		await user.click(screen.getByRole('button', {name: "Save and continue"})); 
		expect(store.dwellingFabric.dwellingSpaceWindows.complete).toBe(false);
	
		await renderSuspended(Windows);
		expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
	});
	
	it('should navigate to the dwelling fabric overview page when return to overview is clicked', async () => {
		await renderSuspended(Windows);
	
		const returnToOverviewButton = screen.getByRole("button", { name: "Return to overview" });
		expect(returnToOverviewButton.getAttribute("href")).toBe("/dwelling-space");
	});
});
