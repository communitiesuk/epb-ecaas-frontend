import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import {screen, within } from '@testing-library/vue';
import type { VentData } from "~/stores/ecaasStore.types";
import Vents from './index.vue';
import VentsForm from './[vent].vue';

describe('vents', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const navigateToMock = vi.hoisted(() => vi.fn());
	mockNuxtImport('navigateTo', () => {
		return navigateToMock;
	});
	const vent1: VentData = {
		name: 'Vent 1',
		typeOfVent: 'trickle',
		effectiveVentilationArea: 10,
		openingRatio: 1,
		midHeightOfZone: 1,
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

	test('vent is removed when remove link is clicked', async () => {
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
	
	test('vent is duplicated when duplicate link is clicked', async () => {
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

	it('marks vents as complete when mark section as complete button is clicked', async () => {
		await renderSuspended(Vents);
		expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
	
		const completedStatusElement = screen.queryByTestId('completeSectionCompleted');
		expect(completedStatusElement?.style.display).toBe("none");
	
		await user.click(screen.getByTestId('completeSectionButton'));
	
		const { complete } = store.infiltrationAndVentilation.vents;
	
		expect(complete).toBe(true);
		expect(screen.queryByRole("button", { name: "Mark section as complete" })).toBeNull();
		expect(completedStatusElement?.style.display).not.toBe("none");
	
		expect(navigateToMock).toHaveBeenCalledWith('/infiltration-and-ventilation');
	});
	
	it('marks vents as not complete when complete button is clicked then user removes a vent item', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					data: [vent1, vent2],
				},
			},
		});
	
		await renderSuspended(Vents);
	
		await user.click(screen.getByTestId('completeSectionButton'));
		expect(store.infiltrationAndVentilation.vents.complete).toBe(true);
	
		await user.click(screen.getByTestId('vents_remove_0'));
		expect(store.infiltrationAndVentilation.vents.complete).toBe(false);
		expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
	});
	
	it('marks vents as not complete when complete button is clicked then user duplicates a vent item', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					data: [vent1],
				},
			},
		});
	
		await renderSuspended(Vents);
	
		await user.click(screen.getByTestId('completeSectionButton'));
		expect(store.infiltrationAndVentilation.vents.complete).toBe(true);
	
		await user.click(screen.getByTestId('vents_duplicate_0'));
		expect(store.infiltrationAndVentilation.vents.complete).toBe(false);
		expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
	});
	
	it('marks vents as not complete when user saves a new or edited form after marking section as complete', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					data: [vent1],
				},
			},
		});
	
		await renderSuspended(Vents);
		await user.click(screen.getByTestId('completeSectionButton'));
	
		await renderSuspended(VentsForm, {
			route: {
				params: { vent: '0' },
			},
		});
	
		await user.click(screen.getByRole('button')); 
	
		const { complete } = store.infiltrationAndVentilation.vents;
		expect(complete).toBe(false);
	
		await renderSuspended(Vents);
		expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
	});
	
	it('should navigate to the infiltration and ventilation overview page when return to overview is clicked', async () => {
		await renderSuspended(Vents);
	
		const returnToOverviewButton = screen.getByRole("button", { name: "Return to infiltration and ventilation" });
		expect(returnToOverviewButton.getAttribute("href")).toBe("/infiltration-and-ventilation");
	});
	
});