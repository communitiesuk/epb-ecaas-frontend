import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Cooling from './index.vue';
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

	describe('air conditioning', () => {
		const airConditioning1: Partial<AirConditioningData> = {
			name: "Air conditioner 1"
		};
	
		const airConditioning2: Partial<AirConditioningData> = {
			name: "Air conditioner 2"
		};

		const airConditioning3: Partial<AirConditioningData> = {
			name: "Air conditioner 3"
		};
	
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
});