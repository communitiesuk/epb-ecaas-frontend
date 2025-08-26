import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Cooling from './index.vue';
import AirConditioningForm from './air-conditioning/[airConditioning].vue';
import {screen } from '@testing-library/vue';
import {within} from '@testing-library/dom';
import type { AirConditioningData } from "~/stores/ecaasStore.types";

describe('cooling', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport('navigateTo', () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	const airConditioning1: Partial<AirConditioningData> = {
		name: "Air conditioner 1",
		coolingCapacity: 1,
		seasonalEnergyEfficiencyRatio:1,
		convectionFraction:1
	};

	const airConditioning2: Partial<AirConditioningData> = {
		name: "Air conditioner 2"
	};

	const airConditioning3: Partial<AirConditioningData> = {
		name: "Air conditioner 3"
	};

	describe('cooling', () => {
	
		it('air conditioning is removed when remove link is clicked', async () => {
			store.$patch({
				cooling: {
					airConditioning: {
						data: [airConditioning1]
					}
				}
			});
	
			await renderSuspended(Cooling);
	
			expect(screen.getAllByTestId('airConditioning_items')).toBeDefined();
	
			await user.click(screen.getByTestId('airConditioning_remove_0'));
	
			expect(screen.queryByTestId('airConditioning_items')).toBeNull();
		});
	
		it('should only remove the air conditioning object that is clicked', async () => {
			store.$patch({
				cooling: {
					airConditioning: {
						data:[airConditioning1, airConditioning2, airConditioning3]
					}
				}
			});
	
			await renderSuspended(Cooling);
			await user.click(screen.getByTestId('airConditioning_remove_1'));
	
			const populatedList = screen.getByTestId('airConditioning_items');
	
			expect(within(populatedList).getByText('Air conditioner 1')).toBeDefined();
			expect(within(populatedList).getByText('Air conditioner 3')).toBeDefined();
			expect(within(populatedList).queryByText('Air conditioner 2')).toBeNull();
		});

		it('air conditioning is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				cooling: {
					airConditioning: {
						data:[airConditioning1, airConditioning2]
					}
				}
			});
	
			await renderSuspended(Cooling);
			await userEvent.click(screen.getByTestId('airConditioning_duplicate_0'));
			await userEvent.click(screen.getByTestId('airConditioning_duplicate_0'));
			await userEvent.click(screen.getByTestId('airConditioning_duplicate_2'));
			await userEvent.click(screen.getByTestId('airConditioning_duplicate_2'));
	
			expect(screen.queryAllByTestId('airConditioning_item').length).toBe(6);
			expect(screen.getByText('Air conditioner 1')).toBeDefined();
			expect(screen.getByText('Air conditioner 1 (1)')).toBeDefined();
			expect(screen.getByText('Air conditioner 1 (2)')).toBeDefined();
			expect(screen.getByText('Air conditioner 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Air conditioner 1 (1) (2)')).toBeDefined();
		});
	});
	describe('mark section as complete', () => {

		it('marks cooling as complete when mark section as complete button is clicked', async () => {
			await renderSuspended(Cooling);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		
			const completedStatusElement = screen.queryByTestId('completeSectionCompleted');
			expect(completedStatusElement?.style.display).toBe("none");
		
			await user.click(screen.getByTestId('completeSectionButton'));
		
			const { complete } = store.cooling.airConditioning;
		
			expect(complete).toBe(true);
			expect(screen.queryByRole("button", { name: "Mark section as complete" })).toBeNull();
			expect(completedStatusElement?.style.display).not.toBe("none");
		
			expect(navigateToMock).toHaveBeenCalledWith('/');
		});
		
		it('marks cooling as not complete when complete button is clicked then user removes an item', async () => {
			store.$patch({
				cooling: {
					airConditioning: {
						data: [airConditioning1, airConditioning2],
					},
				},
			});
		
			await renderSuspended(Cooling);
			await user.click(screen.getByTestId('completeSectionButton'));
		
			expect(store.cooling.airConditioning.complete).toBe(true);
		
			await user.click(screen.getByTestId('airConditioning_remove_0'));
		
			expect(store.cooling.airConditioning.complete).toBe(false);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		});
		
		it('marks cooling as not complete when complete button is clicked then user duplicates an item', async () => {
			store.$patch({
				cooling: {
					airConditioning: {
						data: [airConditioning1],
					},
				},
			});
		
			await renderSuspended(Cooling);
			await user.click(screen.getByTestId('completeSectionButton'));
		
			expect(store.cooling.airConditioning.complete).toBe(true);
		
			await user.click(screen.getByTestId('airConditioning_duplicate_0'));
		
			expect(store.cooling.airConditioning.complete).toBe(false);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		});
		
		it('marks cooling as not complete when user saves a new or edited form after marking section as complete', async () => {
			store.$patch({
				cooling: {
					airConditioning: {
						data: [airConditioning1],
					},
				},
			});
		
			await renderSuspended(Cooling);
			await user.click(screen.getByTestId('completeSectionButton'));
		
			await renderSuspended(AirConditioningForm, {
				route: {
					params: { airConditioning: '0' },
				},
			});
		
			await user.click(screen.getByRole('button')); 
		
			expect(store.cooling.airConditioning.complete).toBe(false);
		
			await renderSuspended(Cooling);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		});
		
		it('should navigate to the main overview page when return to overview is clicked', async () => {
			await renderSuspended(Cooling);
		
			const returnToOverviewButton = screen.getByRole("button", { name: "Return to overview" });
			expect(returnToOverviewButton.getAttribute("href")).toBe("/");
		});
	});
});