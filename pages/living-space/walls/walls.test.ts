import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Walls from './index.vue';
import {screen } from '@testing-library/vue';
import {within} from '@testing-library/dom';

describe('walls', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport('navigateTo', () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	describe('External walls', () => {
		const external1: ExternalWallData = {
			name: "External wall 1",
			pitchOption: '90',
			pitch: 90,
			orientation: 0,
			height: 0.5,
			length: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorption: 0.1,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal'
			
		};
	
		const external2: ExternalWallData = {
			name: "External wall 2",
			pitchOption: '90',
			pitch: 90,
			orientation: 0,
			height: 0.8,
			length: 30,
			elevationalHeight: 30,
			surfaceArea: 15,
			solarAbsorption: 0.6,
			uValue: 0,
			kappaValue: 199,
			massDistributionClass: 'external'
		};
	
		const external3: ExternalWallData = {
			name: "External wall 3",
			pitchOption: 'custom',
			pitch: 99,
			orientation: 33,
			height: 0.5,
			length: 200,
			elevationalHeight: 29,
			surfaceArea: 10,
			solarAbsorption: 0.1,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'divided'
		};
	
		it('ground wall is removed when remove link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceWalls: {
						livingSpaceExternalWall: {
							data:[external1]
						}
					}
				}
			});
	
			await renderSuspended(Walls);
	
			expect(screen.getAllByTestId('external_items')).toBeDefined();
	
			await user.click(screen.getByTestId('external_remove_0'));
	
			expect(screen.queryByTestId('external_items')).toBeNull();
		});
	
		it('should only remove the external wall object thats is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceWalls: {
						livingSpaceExternalWall: {
							data:[external1, external2, external3]
						}
					}
				}
			});
	
			await renderSuspended(Walls);
			await user.click(screen.getByTestId('external_remove_1'));
	
			const populatedList = screen.getByTestId('external_items');
	
			expect(within(populatedList).getByText('External wall 1')).toBeDefined();
			expect(within(populatedList).getByText('External wall 3')).toBeDefined();
			expect(within(populatedList).queryByText('External wall 2')).toBeNull();
	
		});
	
		it('wall is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceWalls: {
						livingSpaceExternalWall: {
							data:[external1, external2]
						}
					}
				}
			});
	
			await renderSuspended(Walls);
			await userEvent.click(screen.getByTestId('external_duplicate_0'));
			await userEvent.click(screen.getByTestId('external_duplicate_0'));
			await userEvent.click(screen.getByTestId('external_duplicate_2'));
			await userEvent.click(screen.getByTestId('external_duplicate_2'));
	
			expect(screen.queryAllByTestId('external_item').length).toBe(6);
			expect(screen.getByText('External wall 1')).toBeDefined();
			expect(screen.getByText('External wall 1 (1)')).toBeDefined();
			expect(screen.getByText('External wall 1 (2)')).toBeDefined();
			expect(screen.getByText('External wall 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('External wall 1 (1) (2)')).toBeDefined();
		});
	});

	describe('Internal walls', () => {
		const internal1: InternalWallData = {
			name: "Internal wall 1",
			surfaceAreaOfElement: 5,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal',
			pitchOption: 'custom',
			pitch: 3
		};
	  
		const internal2: InternalWallData = {
			name: "Internal wall 2",
			surfaceAreaOfElement: 10,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'inside',
			pitchOption: '90',
			pitch: 90
		};
	  
		const internal3: InternalWallData = {
			name: "Internal wall 3",
			surfaceAreaOfElement: 7,
			uValue: 0,
			kappaValue: 10,
			massDistributionClass: 'divided',
			pitchOption: '0',
			pitch: 0
		};
	  
		it('internal wall is removed when remove link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceWalls: {
						livingSpaceInternalWall: {
							data:[internal1]
						}
					}
				}
			});
	  
			await renderSuspended(Walls);
	  
			expect(screen.getAllByTestId('internal_items')).toBeDefined();
	  
			await user.click(screen.getByTestId('internal_remove_0'));
	  
			expect(screen.queryByTestId('internal_items')).toBeNull();
		});
	  
		it('should only remove the internal wall object thats is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceWalls: {
						livingSpaceInternalWall: {
							data:[internal1, internal2, internal3]
						}
					}
				}
			});
	  
			await renderSuspended(Walls);
			await user.click(screen.getByTestId('internal_remove_1'));
	  
			const populatedList = screen.getByTestId('internal_items');
	  
			expect(within(populatedList).getByText('Internal wall 1')).toBeDefined();
			expect(within(populatedList).getByText('Internal wall 3')).toBeDefined();
			expect(within(populatedList).queryByText('Internal wall 2')).toBeNull();
	  
		});
	  
		it('wall is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceWalls: {
						livingSpaceInternalWall: {
							data:[internal1, internal2]
						}
					}
				}
			});
	  
			await renderSuspended(Walls);
			await userEvent.click(screen.getByTestId('internal_duplicate_0'));
			await userEvent.click(screen.getByTestId('internal_duplicate_0'));
			await userEvent.click(screen.getByTestId('internal_duplicate_2'));
			await userEvent.click(screen.getByTestId('internal_duplicate_2'));
	  
			expect(screen.queryAllByTestId('internal_item').length).toBe(6);
			expect(screen.getByText('Internal wall 1')).toBeDefined();
			expect(screen.getByText('Internal wall 1 (1)')).toBeDefined();
			expect(screen.getByText('Internal wall 1 (2)')).toBeDefined();
			expect(screen.getByText('Internal wall 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Internal wall 1 (1) (2)')).toBeDefined();
		});
	});

	describe('Wall to unheated space', () => {
		const toUnheatedSpace1: WallsToUnheatedSpaceData = {
			name: "Wall to heated space 1",
			surfaceAreaOfElement: 500,
			uValue: 10,
			arealHeatCapacity:40000,
			massDistributionClass: 'external',
			pitchOption: '90',
			pitch: 90,
			thermalResistanceOfAdjacentUnheatedSpace: 1
			
		};
	  
		const toUnheatedSpace2: WallsToUnheatedSpaceData = {
			name: "Wall to heated space 2",
			surfaceAreaOfElement: 200,
			uValue: 60,
			arealHeatCapacity:10000,
			massDistributionClass: 'divided',
			pitchOption: '90',
			pitch: 90,
			thermalResistanceOfAdjacentUnheatedSpace: 1
		};
	  
		const toUnheatedSpace3: WallsToUnheatedSpaceData = {
			name: "Wall to heated space 3",
			surfaceAreaOfElement: 800,
			uValue: 8,
			arealHeatCapacity:8000,
			massDistributionClass: 'equally',
			pitchOption: 'custom',
			pitch: 10,
			thermalResistanceOfAdjacentUnheatedSpace: 2
		};
	  
		it('wall-to-heated-space is removed when remove link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceWalls: {
						livingSpaceWallToUnheatedSpace: {
							data:[toUnheatedSpace1]
						}
					}
				}
			});
	  
			await renderSuspended(Walls);
	  
			expect(screen.getAllByTestId('toHeatedSpace_items')).toBeDefined();
	  
			await user.click(screen.getByTestId('toHeatedSpace_remove_0'));
	  
			expect(screen.queryByTestId('toHeatedSpace_items')).toBeNull();
		});
	  
		it('should only remove the wall-to-heated-space object thats is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceWalls: {
						livingSpaceWallToUnheatedSpace: {
							data:[toUnheatedSpace1, toUnheatedSpace2, toUnheatedSpace3]
						}
					}
				}
			});
	  
			await renderSuspended(Walls);
			await user.click(screen.getByTestId('toHeatedSpace_remove_1'));
	  
			const populatedList = screen.getByTestId('toHeatedSpace_items');
	  
			expect(within(populatedList).getByText('Wall to heated space 1')).toBeDefined();
			expect(within(populatedList).getByText('Wall to heated space 3')).toBeDefined();
			expect(within(populatedList).queryByText('Wall to heated space 2')).toBeNull();
		});
	  
		it('wall is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceWalls: {
						livingSpaceWallToUnheatedSpace: {
							data:[toUnheatedSpace1, toUnheatedSpace2]
						}
					}
				}
			});
	  
			await renderSuspended(Walls);
			await userEvent.click(screen.getByTestId('toHeatedSpace_duplicate_0'));
			await userEvent.click(screen.getByTestId('toHeatedSpace_duplicate_0'));
			await userEvent.click(screen.getByTestId('toHeatedSpace_duplicate_2'));
			await userEvent.click(screen.getByTestId('toHeatedSpace_duplicate_2'));
	  
			expect(screen.queryAllByTestId('toHeatedSpace_item').length).toBe(6);
			expect(screen.getByText('Wall to heated space 1')).toBeDefined();
			expect(screen.getByText('Wall to heated space 1 (1)')).toBeDefined();
			expect(screen.getByText('Wall to heated space 1 (2)')).toBeDefined();
			expect(screen.getByText('Wall to heated space 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Wall to heated space 1 (1) (2)')).toBeDefined();
		});
	});

	describe('Party walls', () => {
		const party1: PartyWallData = {
			name: "Party wall 1",
			pitchOption: '90',
			pitch: 90,
			orientation: 200,
			height: 5,
			length: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorption: 0.1,
			uValue: 0.01,
			kappaValue: 100,
			massDistributionClass: 'internal'
			
		};
	
		const party2: PartyWallData = {
			name: "Party wall 2",
			pitchOption: 'custom',
			pitch: 99,
			orientation: 0,
			height: 0.8,
			length: 300,
			elevationalHeight: 30,
			surfaceArea: 15,
			solarAbsorption: 0.6,
			uValue: 8,
			kappaValue: 199,
			massDistributionClass: 'external'
		};
	
		const party3: PartyWallData = {
			name: "Party wall 3",
			pitchOption: 'custom',
			pitch: 99,
			orientation: 33,
			height: 50,
			length: 220,
			elevationalHeight: 29,
			surfaceArea: 10,
			solarAbsorption: 1,
			uValue: 10,
			kappaValue: 100,
			massDistributionClass: 'divided'
		};
	
		it('party wall is removed when remove link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceWalls: {
						livingSpacePartyWall: {
							data:[party1]
						}
					}
				}
			});
	
			await renderSuspended(Walls);
	
			expect(screen.getAllByTestId('party_items')).toBeDefined();
	
			await user.click(screen.getByTestId('party_remove_0'));
	
			expect(screen.queryByTestId('party_items')).toBeNull();
		});
	
		it('should only remove the party wall object thats is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceWalls: {
						livingSpacePartyWall: {
							data:[party1, party2, party3]
						}
					}
				}
			});
	
			await renderSuspended(Walls);
			await user.click(screen.getByTestId('party_remove_1'));
	
			const populatedList = screen.getByTestId('party_items');
	
			expect(within(populatedList).getByText('Party wall 1')).toBeDefined();
			expect(within(populatedList).getByText('Party wall 3')).toBeDefined();
			expect(within(populatedList).queryByText('Party wall 2')).toBeNull();
	
		});
	
		it('wall is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceWalls: {
						livingSpacePartyWall: {
							data:[party1, party2]
						}
					}
				}
			});
	
			await renderSuspended(Walls);
			await userEvent.click(screen.getByTestId('party_duplicate_0'));
			await userEvent.click(screen.getByTestId('party_duplicate_0'));
			await userEvent.click(screen.getByTestId('party_duplicate_2'));
			await userEvent.click(screen.getByTestId('party_duplicate_2'));
	
			expect(screen.queryAllByTestId('party_item').length).toBe(6);
			expect(screen.getByText('Party wall 1')).toBeDefined();
			expect(screen.getByText('Party wall 1 (1)')).toBeDefined();
			expect(screen.getByText('Party wall 1 (2)')).toBeDefined();
			expect(screen.getByText('Party wall 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Party wall 1 (1) (2)')).toBeDefined();
		});
	});

	it('marks shading as complete when complete button is clicked', async () => {
		await renderSuspended(Walls);

		await user.click(screen.getByTestId('completeSection'));

		const {
			livingSpaceExternalWall,
			livingSpaceInternalWall,
			livingSpacePartyWall,
			livingSpaceWallToUnheatedSpace
		} = store.livingSpaceFabric.livingSpaceWalls;

		expect(navigateToMock).toHaveBeenCalledWith('/living-space');
		expect(livingSpaceExternalWall.complete).toBe(true);
		expect(livingSpaceInternalWall.complete).toBe(true);
		expect(livingSpacePartyWall?.complete).toBe(true);
		expect(livingSpaceWallToUnheatedSpace?.complete).toBe(true);
	});
});
