import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import CeilingsAndRoofs from './index.vue';
import CeilingForm from './ceilings/[ceiling].vue';
import RoofForm from './roofs/[roof].vue';
import UnheatedRoofForm from './unheated-pitched-roofs/[roof].vue';
import { MassDistributionClass } from "~/schema/api-schema.types";

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

	const ceiling1: CeilingData = {
		name: "Ceiling 1",
		type: AdjacentSpaceType.heatedSpace,
		surfaceArea: 5,
		kappaValue: 100,
		massDistributionClass: MassDistributionClass.I,
		pitchOption: 'custom',
		pitch: 180
	};

	const ceiling2: CeilingData = {
		...ceiling1,
		name: "Ceiling 2",
	};

	const ceiling3: CeilingData = {
		...ceiling1,
		name: "Ceiling 3",
	};
	const roof1: RoofData = {
		name: "Roof 1",
		typeOfRoof: 'flat',
		pitchOption: '0',
		pitch: 0,
		length: 1,
		width: 1,
		elevationalHeightOfElement: 2,
		surfaceArea: 1,
		solarAbsorptionCoefficient: 0.5,
		uValue: 1,
		kappaValue: 50000,
		massDistributionClass: MassDistributionClass.I
	};

	const roof2: RoofData = {
		...roof1,
		name: "Roof 2",
	};

	const roof3: RoofData = {
		...roof1,
		name: "Roof 3",
	};
	const pitchedRoof1: RoofData = {
		name: "Unheated pitched roof 1",
		typeOfRoof: 'flat',
		pitchOption: 'custom',
		pitch: 180,
		orientation: 0,
		length: 1,
		width: 1,
		elevationalHeightOfElement: 2,
		surfaceArea: 1,
		solarAbsorptionCoefficient: 0.5,
		uValue: 1,
		kappaValue: 100,
		massDistributionClass: MassDistributionClass.I
	};

	const pitchedRoof2: RoofData = {
		...pitchedRoof1,
		name: "Unheated pitched roof 2"
	};

	const pitchedRoof3: RoofData = {
		...pitchedRoof1,
		name: "Unheated pitched roof 3"
	};
	describe('ceilings', () => {
	
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

	describe('unheated pitched roofs', () => {
	
	
		it('unheated pitched roof is removed when remove link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceCeilingsAndRoofs: {
						livingSpaceUnheatedPitchedRoofs: {
							data: [pitchedRoof1]
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
							data: [pitchedRoof1, pitchedRoof2, pitchedRoof3]
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
							data: [pitchedRoof1, pitchedRoof2]
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
	describe('mark section as complete', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();
	
		mockNuxtImport("navigateTo", () => navigateToMock);
	
		const addCeilingsAndRoofsDataToStore = async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceCeilingsAndRoofs: {
						livingSpaceCeilings: { data: [ceiling1] },
						livingSpaceRoofs: { data: [roof1] },
						livingSpaceUnheatedPitchedRoofs: { data: [pitchedRoof1] }
					}
				}
			});
		};
	
		beforeEach(async () => {
			await addCeilingsAndRoofsDataToStore();
			await renderSuspended(CeilingsAndRoofs);
		});
	
		const getCeilingsAndRoofsData = async (action: string) => ([
			{ key: 'livingSpaceCeilings', testId: `ceilings_${action}_0`, form: CeilingForm, params: "ceiling"},
			{ key: 'livingSpaceRoofs', testId: `roofs_${action}_0`, form: RoofForm, params: "roof"},
			{ key: 'livingSpaceUnheatedPitchedRoofs', testId: `unheatedPitchedRoofs_${action}_0`, form: UnheatedRoofForm, params: "roof"}
		]);
	
		type CeilingsAndRoofsType = keyof typeof store.livingSpaceFabric.livingSpaceCeilingsAndRoofs;
	
		it('marks ceilings and roofs as complete when mark section as complete button is clicked', async () => {
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			const completedStatusElement = screen.queryByTestId("completeSectionCompleted");
			expect(completedStatusElement?.style.display).toBe("none");
	
			await user.click(screen.getByTestId("completeSectionButton"));
	
			const { livingSpaceCeilings, livingSpaceRoofs, livingSpaceUnheatedPitchedRoofs } = store.livingSpaceFabric.livingSpaceCeilingsAndRoofs;
	
			expect(livingSpaceCeilings?.complete).toBe(true);
			expect(livingSpaceRoofs?.complete).toBe(true);
			expect(livingSpaceUnheatedPitchedRoofs?.complete).toBe(true);
	
			expect(screen.queryByRole("button", { name: "Mark section as complete" })).toBeNull();
			expect(completedStatusElement?.style.display).not.toBe("none");
	
			expect(navigateToMock).toHaveBeenCalledWith("/living-space");
		});
	
		it("marks section as not complete when item is removed after marking complete", async () => {
			const data = await getCeilingsAndRoofsData("remove");
	
			for (const [key] of Object.entries(store.livingSpaceFabric.livingSpaceCeilingsAndRoofs)) {
				const typedKey = key as CeilingsAndRoofsType;
	
				await user.click(screen.getByTestId("completeSectionButton"));
				expect(store.livingSpaceFabric.livingSpaceCeilingsAndRoofs[typedKey]?.complete).toBe(true);
	
				const formData = data.find(d => d.key === typedKey);
				await user.click(screen.getByTestId(formData!.testId));
	
				expect(store.livingSpaceFabric.livingSpaceCeilingsAndRoofs[typedKey]?.complete).toBe(false);
				expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			}
		});
	
		it("marks section as not complete when item is duplicated after marking complete", async () => {
			const data = await getCeilingsAndRoofsData("duplicate");
	
			for (const [key] of Object.entries(store.livingSpaceFabric.livingSpaceCeilingsAndRoofs)) {
				const typedKey = key as CeilingsAndRoofsType;
	
				await user.click(screen.getByTestId("completeSectionButton"));
				expect(store.livingSpaceFabric.livingSpaceCeilingsAndRoofs[typedKey]?.complete).toBe(true);
	
				const formData = data.find(d => d.key === typedKey);
				await user.click(screen.getByTestId(formData!.testId));
	
				expect(store.livingSpaceFabric.livingSpaceCeilingsAndRoofs[typedKey]?.complete).toBe(false);
				expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			}
		});
	
		it("marks section as not complete after saving a new or edited item", async () => {
			const data = await getCeilingsAndRoofsData("");
	
			for (const [key] of Object.entries(store.livingSpaceFabric.livingSpaceCeilingsAndRoofs)) {
				const typedKey = key as CeilingsAndRoofsType;
	
				await user.click(screen.getByTestId("completeSectionButton"));
				expect(store.livingSpaceFabric.livingSpaceCeilingsAndRoofs[typedKey]?.complete).toBe(true);
	
				const ceilingAndRoofItem = data.find(d => d.key === typedKey);
				await renderSuspended(ceilingAndRoofItem?.form, {
					route: { params: { [ceilingAndRoofItem!.params]: "0" } }
				});
				await user.click(screen.getByRole("button", { name: "Save and continue" }));
	
				expect(store.livingSpaceFabric.livingSpaceCeilingsAndRoofs[typedKey]?.complete).toBe(false);
				await renderSuspended(CeilingsAndRoofs);
				expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			}
		});
	});
	
});