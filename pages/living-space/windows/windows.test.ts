import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Windows from './index.vue';
import {screen } from '@testing-library/vue';
import {within} from '@testing-library/dom';

describe('windows', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const window1: WindowData = {
		name: "Window 1",
	};

	const window2: WindowData = {
		name: "Window 2",
	};

	const window3: WindowData = {
		name: "Window 3",
	};

	afterEach(() => {
		store.$reset();
	});

	it('window is removed when remove link is clicked', async () => {
		store.$patch({
			livingSpaceFabric: {
				livingSpaceWindows: {
					data:[window1]
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
			livingSpaceFabric: {
				livingSpaceWindows: {
					data:[window1, window2, window3]
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
	it('window is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			livingSpaceFabric: {
				livingSpaceWindows: {
					data:[window1, window2]
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
});
