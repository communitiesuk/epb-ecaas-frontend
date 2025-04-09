import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import CeilingsAndRoofs from './index.vue';
import {screen } from '@testing-library/vue';
import {within} from '@testing-library/dom';

describe('ceilings and roofs', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport('navigateTo', () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	describe('ceilings', () => {
		const ceiling1: CeilingData = {
			type: 'heatedSpace',
			name: "Ceiling 1",
			surfaceArea: 5,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal',
			pitchOption: '180',
			pitch: 180
		};
	
		const ceiling2: CeilingData = {
			type: 'heatedSpace',
			name: "Ceiling 2",
			surfaceArea: 5,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal',
			pitchOption: '180',
			pitch: 180
		};
	
		const ceiling3: CeilingData = {
			type: 'heatedSpace',
			name: "Ceiling 3",
			surfaceArea: 5,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal',
			pitchOption: '180',
			pitch: 180
		};
	
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
		const roof1: RoofData = {
			name: "Roof 1",
			typeOfRoof: 'flat',
			pitchOption: '180',
			pitch: 180,
			orientation: 0,
			length: 1,
			width: 1,
			elevationalHeightOfElement: 2,
			surfaceArea: 1,
			solarAbsorbtionCoefficient: 0.5,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal'
		};
	
		const roof2: RoofData = {
			name: "Roof 2",
			typeOfRoof: 'flat',
			pitchOption: '180',
			pitch: 180,
			orientation: 0,
			length: 1,
			width: 1,
			elevationalHeightOfElement: 2,
			surfaceArea: 1,
			solarAbsorbtionCoefficient: 0.5,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal'
		};
	
		const roof3: RoofData = {
			name: "Roof 3",
			typeOfRoof: 'flat',
			pitchOption: '180',
			pitch: 180,
			orientation: 0,
			length: 1,
			width: 1,
			elevationalHeightOfElement: 2,
			surfaceArea: 1,
			solarAbsorbtionCoefficient: 0.5,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal'
		};
	
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

	it('marks shading as complete when complete button is clicked', async () => {
		await renderSuspended(CeilingsAndRoofs);

		await user.click(screen.getByTestId('completeSection'));

		const {
			livingSpaceCeilings,
			livingSpaceRoofs
		} = store.livingSpaceFabric.livingSpaceCeilingsAndRoofs;

		expect(navigateToMock).toHaveBeenCalledWith('/living-space');
		expect(livingSpaceCeilings.complete).toBe(true);
		expect(livingSpaceRoofs.complete).toBe(true);
	});

	describe('unheated pitched roofs', () => {
		const roof1: RoofData = {
			name: "Unheated pitched roof 1",
			typeOfRoof: 'flat',
			pitchOption: '180',
			pitch: 180,
			orientation: 0,
			length: 1,
			width: 1,
			elevationalHeightOfElement: 2,
			surfaceArea: 1,
			solarAbsorbtionCoefficient: 0.5,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal'
		};
	
		const roof2: RoofData = {
			...roof1,
			name: "Unheated pitched roof 2"
		};
	
		const roof3: RoofData = {
			...roof1,
			name: "Unheated pitched roof 3"
		};
	
		it('unheated pitched roof is removed when remove link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceCeilingsAndRoofs: {
						livingSpaceUnheatedPitchedRoofs: {
							data: [roof1]
						}
					}
				}
			});
	
			await renderSuspended(CeilingsAndRoofs);
	
			expect(screen.getAllByTestId('unheatedPitchedRoofs_items')).toBeDefined();
	
			await user.click(screen.getByTestId('unheatedPitchedRoofs_remove_0'));
	
			expect(screen.queryByTestId('unheatedPitchedRoofs_items')).toBeNull();
		});
	
		it('should only remove the unheated pitched roof object thats is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceCeilingsAndRoofs: {
						livingSpaceUnheatedPitchedRoofs: {
							data: [roof1, roof2, roof3]
						}
					}
				}
			});
	
			await renderSuspended(CeilingsAndRoofs);
			await user.click(screen.getByTestId('unheatedPitchedRoofs_remove_1'));
	
			const populatedList = screen.getByTestId('unheatedPitchedRoofs_items');
	
			expect(within(populatedList).getByText('Unheated pitched roof 1')).toBeDefined();
			expect(within(populatedList).getByText('Unheated pitched roof 3')).toBeDefined();
			expect(within(populatedList).queryByText('Unheated pitched roof 2')).toBeNull();
	
		});
	
		it('unheated pitched roof is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceCeilingsAndRoofs: {
						livingSpaceUnheatedPitchedRoofs: {
							data: [roof1, roof2]
						}
					}
				}
			});
	
			await renderSuspended(CeilingsAndRoofs);
			await userEvent.click(screen.getByTestId('unheatedPitchedRoofs_duplicate_0'));
			await userEvent.click(screen.getByTestId('unheatedPitchedRoofs_duplicate_0'));
			await userEvent.click(screen.getByTestId('unheatedPitchedRoofs_duplicate_2'));
			await userEvent.click(screen.getByTestId('unheatedPitchedRoofs_duplicate_2'));
	
			expect(screen.queryAllByTestId('unheatedPitchedRoofs_item').length).toBe(6);
			expect(screen.getByText('Unheated pitched roof 1')).toBeDefined();
			expect(screen.getByText('Unheated pitched roof 1 (1)')).toBeDefined();
			expect(screen.getByText('Unheated pitched roof 1 (2)')).toBeDefined();
			expect(screen.getByText('Unheated pitched roof 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Unheated pitched roof 1 (1) (2)')).toBeDefined();
		});
	});

	it('marks shading as complete when complete button is clicked', async () => {
		await renderSuspended(CeilingsAndRoofs);

		await user.click(screen.getByTestId('completeSection'));

		const {
			livingSpaceCeilings,
			livingSpaceRoofs,
			livingSpaceUnheatedPitchedRoofs
		} = store.livingSpaceFabric.livingSpaceCeilingsAndRoofs;

		expect(navigateToMock).toHaveBeenCalledWith('/living-space');
		expect(livingSpaceCeilings.complete).toBe(true);
		expect(livingSpaceRoofs.complete).toBe(true);
		expect(livingSpaceUnheatedPitchedRoofs.complete).toBe(true);
	});
});