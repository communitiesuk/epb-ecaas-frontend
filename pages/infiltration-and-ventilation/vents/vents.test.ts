import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import {screen, within } from '@testing-library/vue';
import type { VentData } from "~/stores/ecaasStore.types";
import Vents from './index.vue';

describe('vents', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const vent1: VentData = {
		name: 'Vent 1',
		typeOfVent: 'trickle',
		effectiveVentilationArea: 10,
		openingRatio: 1,
		airFlowAtMidHeightLevel: 1,
		pressureDifference: 1,
		orientation: 0,
		pitch: 0
	};

	const vent2: VentData = {
		...vent1,
		name: 'Vent 2'
	};

	const vent3: VentData = {
		...vent1,
		name: 'Vent 3'
	};

	afterEach(() => {
		store.$reset();
	});

	it('vent is removed when remove link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					data: [vent1]
				}
			}
		});

		await renderSuspended(Vents);

		expect(screen.getAllByTestId('vents_items')).toBeDefined();

		await user.click(screen.getByTestId('vents_remove_0'));

		expect(screen.queryByTestId('vents_items')).toBeNull();
	});

	it('should only remove the vent that is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					data: [vent1, vent2, vent3]
				}
			}
		});

		await renderSuspended(Vents);
		await user.click(screen.getByTestId('vents_remove_1'));

		const populatedList = screen.getByTestId('vents_items');

		expect(within(populatedList).getByText('Vent 1')).toBeDefined();
		expect(within(populatedList).getByText('Vent 3')).toBeDefined();
		expect(within(populatedList).queryByText('Vent 2')).toBeNull();

	});
	
	it('vent is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					data: [vent1, vent2]
				}
			}
		});

		await renderSuspended(Vents);
		await userEvent.click(screen.getByTestId('vents_duplicate_0'));
		await userEvent.click(screen.getByTestId('vents_duplicate_0'));
		await userEvent.click(screen.getByTestId('vents_duplicate_2'));
		await userEvent.click(screen.getByTestId('vents_duplicate_2'));

		expect(screen.queryAllByTestId('vents_item').length).toBe(6);
		expect(screen.getByText('Vent 1')).toBeDefined();
		expect(screen.getByText('Vent 1 (1)')).toBeDefined();
		expect(screen.getByText('Vent 1 (2)')).toBeDefined();
		expect(screen.getByText('Vent 1 (1) (1)')).toBeDefined();
		expect(screen.getByText('Vent 1 (1) (2)')).toBeDefined();
	});
});