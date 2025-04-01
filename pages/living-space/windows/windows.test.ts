import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Windows from './index.vue';
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
		length: 1,
		width: 1,
		uValue: 1,
		pitchOption: '90',
		pitch: 90,
		solarTransmittence: 0.1,
		elevationalHeight: 1,
		midHeight: 1,
		numberOpenableParts: "none",
		overhangDepth: 1,
		overhangDistance: 1,
		sideFinRightDepth: 1,
		sideFinRightDistance: 1,
		sideFinLeftDepth: 1,
		sideFinLeftDistance: 1,
		type: "blinds",
		thermalResistivityIncrease: 1,
		solarTransmittenceReduction: 0.1,
	};

	const window2: WindowData = {
		name: "Window 2",
		orientation: 1,
		surfaceArea: 1,
		length: 1,
		width: 1,
		uValue: 1,
		pitchOption: '90',
		pitch: 90,
		solarTransmittence: 0.1,
		elevationalHeight: 1,
		midHeight: 1,
		numberOpenableParts: "none",
		overhangDepth: 1,
		overhangDistance: 1,
		sideFinRightDepth: 1,
		sideFinRightDistance: 1,
		sideFinLeftDepth: 1,
		sideFinLeftDistance: 1,
		type: "blinds",
		thermalResistivityIncrease: 1,
		solarTransmittenceReduction: 0.1,
	};

	const window3: WindowData = {
		name: "Window 3",
		orientation: 1,
		surfaceArea: 1,
		length: 1,
		width: 1,
		uValue: 1,
		pitchOption: '90',
		pitch: 90,
		solarTransmittence: 0.1,
		elevationalHeight: 1,
		midHeight: 1,
		numberOpenableParts: "none",
		overhangDepth: 1,
		overhangDistance: 1,
		sideFinRightDepth: 1,
		sideFinRightDistance: 1,
		sideFinLeftDepth: 1,
		sideFinLeftDistance: 1,
		type: "blinds",
		thermalResistivityIncrease: 1,
		solarTransmittenceReduction: 0.1,
	};

	it('window is removed when remove link is clicked', async () => {
		store.$patch({
			livingSpaceFabric: {
				livingSpaceWindows: {
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
			livingSpaceFabric: {
				livingSpaceWindows: {
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
	
	it('window is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			livingSpaceFabric: {
				livingSpaceWindows: {
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

	it('marks shading as complete when complete button is clicked', async () => {
		await renderSuspended(Windows);

		await user.click(screen.getByTestId('completeSection'));

		const { complete } = store.livingSpaceFabric.livingSpaceWindows;

		expect(navigateToMock).toHaveBeenCalledWith('/living-space');
		expect(complete).toBe(true);
	});
});
