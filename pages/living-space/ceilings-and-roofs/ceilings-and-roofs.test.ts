import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import CeilingsAndRoofs from './index.vue';
import {screen } from '@testing-library/vue';
import {within} from '@testing-library/dom';

describe('ceilings', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const ceiling1: CeilingData = {
		name: "Ceiling 1"
	};

	const ceiling2: CeilingData = {
		name: "Ceiling 2"
	};

	const ceiling3: CeilingData = {
		name: "Ceiling 3"
	};

	afterEach(() => {
		store.$reset();
	});

	it('ceiling is removed when remove link is clicked', async () => {
		store.$patch({
			livingSpaceFabric: {
				livingSpaceCeilingsAndRoofs: {
					livingSpaceCeilings: {
						data:[ceiling1]
					}
				}
			}
		});

		await renderSuspended(CeilingsAndRoofs);

		expect(screen.getAllByTestId('ceilings_items')).toBeDefined();

		await user.click(screen.getByTestId('ceilings_remove_0'));

		expect(screen.queryByTestId('ceilings_items')).toBeNull();
	});

	it('should only remove the ceiling object thats is clicked', async () => {
		store.$patch({
			livingSpaceFabric: {
				livingSpaceCeilingsAndRoofs: {
					livingSpaceCeilings: {
						data:[ceiling1, ceiling2, ceiling3]
					}
				}
			}
		});

		await renderSuspended(CeilingsAndRoofs);
		await user.click(screen.getByTestId('ceilings_remove_1'));

		const populatedList = screen.getByTestId('ceilings_items');

		expect(within(populatedList).getByText('Ceiling 1')).toBeDefined();
		expect(within(populatedList).getByText('Ceiling 3')).toBeDefined();
		expect(within(populatedList).queryByText('Ceiling 2')).toBeNull();

	});
	it('ceiling is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			livingSpaceFabric: {
				livingSpaceCeilingsAndRoofs: {
					livingSpaceCeilings: {
						data:[ceiling1, ceiling2]
					}
				}
			}
		});

		await renderSuspended(CeilingsAndRoofs);
		await userEvent.click(screen.getByTestId('ceilings_duplicate_0'));
		await userEvent.click(screen.getByTestId('ceilings_duplicate_0'));
		await userEvent.click(screen.getByTestId('ceilings_duplicate_2'));
		await userEvent.click(screen.getByTestId('ceilings_duplicate_2'));

		expect(screen.queryAllByTestId('ceilings_item').length).toBe(6);
		expect(screen.getByText('Ceiling 1')).toBeDefined();
		expect(screen.getByText('Ceiling 1 (1)')).toBeDefined();
		expect(screen.getByText('Ceiling 1 (2)')).toBeDefined();
		expect(screen.getByText('Ceiling 1 (1) (1)')).toBeDefined();
		expect(screen.getByText('Ceiling 1 (1) (2)')).toBeDefined();
	});
});

describe('roofs', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const roof1: RoofData = {
		name: "Roof 1"
	};

	const roof2: RoofData = {
		name: "Roof 2"
	};

	const roof3: RoofData = {
		name: "Roof 3"
	};

	afterEach(() => {
		store.$reset();
	});

	it('roof is removed when remove link is clicked', async () => {
		store.$patch({
			livingSpaceFabric: {
				livingSpaceCeilingsAndRoofs: {
					livingSpaceRoofs: {
						data:[roof1]
					}
				}
			}
		});

		await renderSuspended(CeilingsAndRoofs);

		expect(screen.getAllByTestId('roofs_items')).toBeDefined();

		await user.click(screen.getByTestId('roofs_remove_0'));

		expect(screen.queryByTestId('roofs_items')).toBeNull();
	});

	it('should only remove the roof object thats is clicked', async () => {
		store.$patch({
			livingSpaceFabric: {
				livingSpaceCeilingsAndRoofs: {
					livingSpaceRoofs: {
						data:[roof1, roof2, roof3]
					}
				}
			}
		});

		await renderSuspended(CeilingsAndRoofs);
		await user.click(screen.getByTestId('roofs_remove_1'));

		const populatedList = screen.getByTestId('roofs_items');

		expect(within(populatedList).getByText('Roof 1')).toBeDefined();
		expect(within(populatedList).getByText('Roof 3')).toBeDefined();
		expect(within(populatedList).queryByText('Roof 2')).toBeNull();

	});

	it('roof is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			livingSpaceFabric: {
				livingSpaceCeilingsAndRoofs: {
					livingSpaceRoofs: {
						data:[roof1, roof2]
					}
				}
			}
		});

		await renderSuspended(CeilingsAndRoofs);
		await userEvent.click(screen.getByTestId('roofs_duplicate_0'));
		await userEvent.click(screen.getByTestId('roofs_duplicate_0'));
		await userEvent.click(screen.getByTestId('roofs_duplicate_2'));
		await userEvent.click(screen.getByTestId('roofs_duplicate_2'));

		expect(screen.queryAllByTestId('roofs_item').length).toBe(6);
		expect(screen.getByText('Roof 1')).toBeDefined();
		expect(screen.getByText('Roof 1 (1)')).toBeDefined();
		expect(screen.getByText('Roof 1 (2)')).toBeDefined();
		expect(screen.getByText('Roof 1 (1) (1)')).toBeDefined();
		expect(screen.getByText('Roof 1 (1) (2)')).toBeDefined();
	});
});