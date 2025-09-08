import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen, within } from '@testing-library/vue';
import CombustionAppliances from './index.vue';
import OpenFireplaceForm from './open-fireplace/[combustion].vue';
import ClosedFireplaceWithFanForm from './closed-fireplace-with-fan/[combustion].vue';
import OpenGasFlueBalancerForm from './open-gas-flue-balancer/[combustion].vue';
import OpenGasKitchenStoveForm from './open-gas-kitchen-stove/[combustion].vue';
import OpenGasFireForm from './open-gas-fire/[combustion].vue';
import ClosedFireForm from './closed-fire/[combustion].vue';

import { expect } from "vitest";
import { CombustionAirSupplySituation, CombustionApplianceType, CombustionFuelType, FlueGasExhaustSituation } from "~/schema/api-schema.types";
import type { Entries } from "type-fest";

describe('open fireplace', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const openFireplace1: CombustionApplianceData = {
		name: 'Open fireplace 1',
		airSupplyToAppliance: CombustionAirSupplySituation.room_air,
		exhaustMethodFromAppliance: FlueGasExhaustSituation.into_separate_duct,
		typeOfFuel: CombustionFuelType.coal,
	};

	const openFireplace2: CombustionApplianceData = {
		...openFireplace1,
		name: 'Open fireplace 2'
	};

	const openFireplace3: CombustionApplianceData = {
		...openFireplace1,
		name: 'Open fireplace 3'
	};

	afterEach(() => {
		store.$reset();
	});

	test('open fireplace is removed when remove link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.open_fireplace]: {
						data: [openFireplace1]
					}
				}
			}
		});

		await renderSuspended(CombustionAppliances);

		expect(screen.getAllByTestId('openFireplace_items')).toBeDefined();

		await user.click(screen.getByTestId('openFireplace_remove_0'));

		expect(screen.queryByTestId('openFireplace_items')).toBeNull();
	});

	it('should only remove the open fireplace that is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.open_fireplace]: {
						data: [openFireplace1, openFireplace2, openFireplace3]
					}
				}
			}
		});

		await renderSuspended(CombustionAppliances);
		await user.click(screen.getByTestId('openFireplace_remove_1'));

		const populatedList = screen.getByTestId('openFireplace_items');

		expect(within(populatedList).getByText('Open fireplace 1')).toBeDefined();
		expect(within(populatedList).getByText('Open fireplace 3')).toBeDefined();
		expect(within(populatedList).queryByText('Open fireplace 2')).toBeNull();

	});

	test('open fireplace is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.open_fireplace]: {
						data: [openFireplace1, openFireplace2]
					}
				}
			}
		});

		await renderSuspended(CombustionAppliances);
		await userEvent.click(screen.getByTestId('openFireplace_duplicate_0'));
		await userEvent.click(screen.getByTestId('openFireplace_duplicate_0'));
		await userEvent.click(screen.getByTestId('openFireplace_duplicate_2'));
		await userEvent.click(screen.getByTestId('openFireplace_duplicate_2'));

		expect(screen.queryAllByTestId('openFireplace_item').length).toBe(6);
		expect(screen.getByText('Open fireplace 1')).toBeDefined();
		expect(screen.getByText('Open fireplace 1 (1)')).toBeDefined();
		expect(screen.getByText('Open fireplace 1 (2)')).toBeDefined();
		expect(screen.getByText('Open fireplace 1 (1) (1)')).toBeDefined();
		expect(screen.getByText('Open fireplace 1 (1) (2)')).toBeDefined();
	});
});

describe('closed fireplace with fan', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const closedFireplaceWithFan1: CombustionApplianceData = {
		name: 'Closed fireplace with fan 1',
		airSupplyToAppliance: CombustionAirSupplySituation.room_air,
		exhaustMethodFromAppliance: FlueGasExhaustSituation.into_separate_duct,
		typeOfFuel: CombustionFuelType.wood
	};

	const closedFireplaceWithFan2: CombustionApplianceData = {
		...closedFireplaceWithFan1,
		name: 'Closed fireplace with fan 2'
	};

	const closedFireplaceWithFan3: CombustionApplianceData = {
		...closedFireplaceWithFan1,
		name: 'Closed fireplace with fan 3'
	};

	afterEach(() => {
		store.$reset();
	});

	test('closed fireplace is removed when remove link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.closed_with_fan]: {
						data: [closedFireplaceWithFan1]
					}
				}
			}
		});

		await renderSuspended(CombustionAppliances);

		expect(screen.getAllByTestId('closedFireplaceWithFan_items')).toBeDefined();

		await user.click(screen.getByTestId('closedFireplaceWithFan_remove_0'));

		expect(screen.queryByTestId('closedFireplaceWithFan_items')).toBeNull();
	});

	it('should only remove the closed fireplace that is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.closed_with_fan]: {
						data: [closedFireplaceWithFan1, closedFireplaceWithFan2, closedFireplaceWithFan3]
					}
				}
			}
		});

		await renderSuspended(CombustionAppliances);
		await user.click(screen.getByTestId('closedFireplaceWithFan_remove_1'));

		const populatedList = screen.getByTestId('closedFireplaceWithFan_items');

		expect(within(populatedList).getByText('Closed fireplace with fan 1')).toBeDefined();
		expect(within(populatedList).getByText('Closed fireplace with fan 3')).toBeDefined();
		expect(within(populatedList).queryByText('Closed fireplace with fan 2')).toBeNull();

	});

	test('closed fireplace is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.closed_with_fan]: {
						data: [closedFireplaceWithFan1, closedFireplaceWithFan2]
					}
				}
			}
		});

		await renderSuspended(CombustionAppliances);
		await userEvent.click(screen.getByTestId('closedFireplaceWithFan_duplicate_0'));
		await userEvent.click(screen.getByTestId('closedFireplaceWithFan_duplicate_0'));
		await userEvent.click(screen.getByTestId('closedFireplaceWithFan_duplicate_2'));
		await userEvent.click(screen.getByTestId('closedFireplaceWithFan_duplicate_2'));

		expect(screen.queryAllByTestId('closedFireplaceWithFan_item').length).toBe(6);
		expect(screen.getByText('Closed fireplace with fan 1')).toBeDefined();
		expect(screen.getByText('Closed fireplace with fan 1 (1)')).toBeDefined();
		expect(screen.getByText('Closed fireplace with fan 1 (2)')).toBeDefined();
		expect(screen.getByText('Closed fireplace with fan 1 (1) (1)')).toBeDefined();
		expect(screen.getByText('Closed fireplace with fan 1 (1) (2)')).toBeDefined();
	});
});

describe('open gas flue balancer', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const openGasFlueBalancer1: CombustionApplianceData = {
		name: 'Open gas flue balancer 1',
		airSupplyToAppliance: CombustionAirSupplySituation.outside,
		exhaustMethodFromAppliance: FlueGasExhaustSituation.into_room,
		typeOfFuel: CombustionFuelType.gas,
	};

	const openGasFlueBalancer2: CombustionApplianceData = {
		...openGasFlueBalancer1,
		name: 'Open gas flue balancer 2'
	};

	const openGasFlueBalancer3: CombustionApplianceData = {
		...openGasFlueBalancer1,
		name: 'Open gas flue balancer 3'
	};

	afterEach(() => {
		store.$reset();
	});

	test('open gas flue balancer is removed when remove link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.open_gas_flue_balancer]: {
						data: [openGasFlueBalancer1]
					}
				}
			}
		});

		await renderSuspended(CombustionAppliances);

		expect(screen.getAllByTestId('openGasFlueBalancer_items')).toBeDefined();

		await user.click(screen.getByTestId('openGasFlueBalancer_remove_0'));

		expect(screen.queryByTestId('openGasFlueBalancer_items')).toBeNull();
	});

	it('should only remove the open gas flue balancer that is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.open_gas_flue_balancer]: {
						data: [openGasFlueBalancer1, openGasFlueBalancer2, openGasFlueBalancer3]
					}
				}
			}
		});

		await renderSuspended(CombustionAppliances);
		await user.click(screen.getByTestId('openGasFlueBalancer_remove_1'));

		const populatedList = screen.getByTestId('openGasFlueBalancer_items');

		expect(within(populatedList).getByText('Open gas flue balancer 1')).toBeDefined();
		expect(within(populatedList).getByText('Open gas flue balancer 3')).toBeDefined();
		expect(within(populatedList).queryByText('Open gas flue balancer 2')).toBeNull();

	});

	test('open gas flue balancer is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.open_gas_flue_balancer]: {
						data: [openGasFlueBalancer1, openGasFlueBalancer2]
					}
				}
			}
		});

		await renderSuspended(CombustionAppliances);
		await userEvent.click(screen.getByTestId('openGasFlueBalancer_duplicate_0'));
		await userEvent.click(screen.getByTestId('openGasFlueBalancer_duplicate_0'));
		await userEvent.click(screen.getByTestId('openGasFlueBalancer_duplicate_2'));
		await userEvent.click(screen.getByTestId('openGasFlueBalancer_duplicate_2'));

		expect(screen.queryAllByTestId('openGasFlueBalancer_item').length).toBe(6);
		expect(screen.getByText('Open gas flue balancer 1')).toBeDefined();
		expect(screen.getByText('Open gas flue balancer 1 (1)')).toBeDefined();
		expect(screen.getByText('Open gas flue balancer 1 (2)')).toBeDefined();
		expect(screen.getByText('Open gas flue balancer 1 (1) (1)')).toBeDefined();
		expect(screen.getByText('Open gas flue balancer 1 (1) (2)')).toBeDefined();
	});
});

describe('open gas kitchen stove', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const openGasKitchenStove1: CombustionApplianceData = {
		name: 'Open gas kitchen stove 1',
		airSupplyToAppliance: CombustionAirSupplySituation.outside,
		exhaustMethodFromAppliance: FlueGasExhaustSituation.into_room,
		typeOfFuel: CombustionFuelType.oil,
	};

	const openGasKitchenStove2: CombustionApplianceData = {
		...openGasKitchenStove1,
		name: 'Open gas kitchen stove 2'
	};

	const openGasKitchenStove3: CombustionApplianceData = {
		...openGasKitchenStove1,
		name: 'Open gas kitchen stove 3'
	};

	afterEach(() => {
		store.$reset();
	});

	test('open gas kitchen stove is removed when remove link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.open_gas_kitchen_stove]: {
						data: [openGasKitchenStove1]
					}
				}
			}
		});

		await renderSuspended(CombustionAppliances);

		expect(screen.getAllByTestId('openGasKitchenStove_items')).toBeDefined();

		await user.click(screen.getByTestId('openGasKitchenStove_remove_0'));

		expect(screen.queryByTestId('openGasKitchenStove_items')).toBeNull();
	});

	it('should only remove the open gas kitchen stove that is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.open_gas_kitchen_stove]: {
						data: [openGasKitchenStove1, openGasKitchenStove2, openGasKitchenStove3]
					}
				}
			}
		});

		await renderSuspended(CombustionAppliances);
		await user.click(screen.getByTestId('openGasKitchenStove_remove_1'));

		const populatedList = screen.getByTestId('openGasKitchenStove_items');

		expect(within(populatedList).getByText('Open gas kitchen stove 1')).toBeDefined();
		expect(within(populatedList).getByText('Open gas kitchen stove 3')).toBeDefined();
		expect(within(populatedList).queryByText('Open gas kitchen stove 2')).toBeNull();

	});

	test('open gas kitchen stove is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.open_gas_kitchen_stove]: {
						data: [openGasKitchenStove1, openGasKitchenStove2]
					}
				}
			}
		});

		await renderSuspended(CombustionAppliances);
		await userEvent.click(screen.getByTestId('openGasKitchenStove_duplicate_0'));
		await userEvent.click(screen.getByTestId('openGasKitchenStove_duplicate_0'));
		await userEvent.click(screen.getByTestId('openGasKitchenStove_duplicate_2'));
		await userEvent.click(screen.getByTestId('openGasKitchenStove_duplicate_2'));

		expect(screen.queryAllByTestId('openGasKitchenStove_item').length).toBe(6);
		expect(screen.getByText('Open gas kitchen stove 1')).toBeDefined();
		expect(screen.getByText('Open gas kitchen stove 1 (1)')).toBeDefined();
		expect(screen.getByText('Open gas kitchen stove 1 (2)')).toBeDefined();
		expect(screen.getByText('Open gas kitchen stove 1 (1) (1)')).toBeDefined();
		expect(screen.getByText('Open gas kitchen stove 1 (1) (2)')).toBeDefined();
	});
});

describe('open gas fire', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const openGasFire1: CombustionApplianceData = {
		name: 'Open gas fire 1',
		airSupplyToAppliance: CombustionAirSupplySituation.outside,
		exhaustMethodFromAppliance: FlueGasExhaustSituation.into_mech_vent,
		typeOfFuel: CombustionFuelType.oil,
	};

	const openGasFire2: CombustionApplianceData = {
		...openGasFire1,
		name: 'Open gas fire 2'
	};

	const openGasFire3: CombustionApplianceData = {
		...openGasFire1,
		name: 'Open gas fire 3'
	};

	afterEach(() => {
		store.$reset();
	});

	test('open gas fire is removed when remove link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.open_gas_fire]: {
						data: [openGasFire1]
					}
				}
			}
		});

		await renderSuspended(CombustionAppliances);

		expect(screen.getAllByTestId('openGasFire_items')).toBeDefined();

		await user.click(screen.getByTestId('openGasFire_remove_0'));

		expect(screen.queryByTestId('openGasFire_items')).toBeNull();
	});

	it('should only remove the open gas fire that is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.open_gas_fire]: {
						data: [openGasFire1, openGasFire2, openGasFire3]
					}
				}
			}
		});

		await renderSuspended(CombustionAppliances);
		await user.click(screen.getByTestId('openGasFire_remove_1'));

		const populatedList = screen.getByTestId('openGasFire_items');

		expect(within(populatedList).getByText('Open gas fire 1')).toBeDefined();
		expect(within(populatedList).getByText('Open gas fire 3')).toBeDefined();
		expect(within(populatedList).queryByText('Open gas fire 2')).toBeNull();

	});

	test('open gas fire is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.open_gas_fire]: {
						data: [openGasFire1, openGasFire2]
					}
				}
			}
		});

		await renderSuspended(CombustionAppliances);
		await userEvent.click(screen.getByTestId('openGasFire_duplicate_0'));
		await userEvent.click(screen.getByTestId('openGasFire_duplicate_0'));
		await userEvent.click(screen.getByTestId('openGasFire_duplicate_2'));
		await userEvent.click(screen.getByTestId('openGasFire_duplicate_2'));

		expect(screen.queryAllByTestId('openGasFire_item').length).toBe(6);
		expect(screen.getByText('Open gas fire 1')).toBeDefined();
		expect(screen.getByText('Open gas fire 1 (1)')).toBeDefined();
		expect(screen.getByText('Open gas fire 1 (2)')).toBeDefined();
		expect(screen.getByText('Open gas fire 1 (1) (1)')).toBeDefined();
		expect(screen.getByText('Open gas fire 1 (1) (2)')).toBeDefined();
	});
});

describe('closed fire', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const closedFire1: CombustionApplianceData = {
		name: 'Closed fire 1',
		airSupplyToAppliance: CombustionAirSupplySituation.outside,
		exhaustMethodFromAppliance: FlueGasExhaustSituation.into_mech_vent,
		typeOfFuel: CombustionFuelType.coal,
	};

	const closedFire2: CombustionApplianceData = {
		...closedFire1,
		name: 'Closed fire 2'
	};

	const closedFire3: CombustionApplianceData = {
		...closedFire1,
		name: 'Closed fire 3'
	};

	afterEach(() => {
		store.$reset();
	});

	test('closed fire is removed when remove link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.closed_fire]: {
						data: [closedFire1]
					}
				}
			}
		});

		await renderSuspended(CombustionAppliances);

		expect(screen.getAllByTestId('closedFire_items')).toBeDefined();

		await user.click(screen.getByTestId('closedFire_remove_0'));

		expect(screen.queryByTestId('closedFire_items')).toBeNull();
	});

	it('should only remove the closed fire that is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.closed_fire]: {
						data: [closedFire1, closedFire2, closedFire3]
					}
				}
			}
		});

		await renderSuspended(CombustionAppliances);
		await user.click(screen.getByTestId('closedFire_remove_1'));

		const populatedList = screen.getByTestId('closedFire_items');

		expect(within(populatedList).getByText('Closed fire 1')).toBeDefined();
		expect(within(populatedList).getByText('Closed fire 3')).toBeDefined();
		expect(within(populatedList).queryByText('Closed fire 2')).toBeNull();

	});

	test('closed fire is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.closed_fire]: {
						data: [closedFire1, closedFire2]
					}
				}
			}
		});

		await renderSuspended(CombustionAppliances);
		await userEvent.click(screen.getByTestId('closedFire_duplicate_0'));
		await userEvent.click(screen.getByTestId('closedFire_duplicate_0'));
		await userEvent.click(screen.getByTestId('closedFire_duplicate_2'));
		await userEvent.click(screen.getByTestId('closedFire_duplicate_2'));

		expect(screen.queryAllByTestId('closedFire_item').length).toBe(6);
		expect(screen.getByText('Closed fire 1')).toBeDefined();
		expect(screen.getByText('Closed fire 1 (1)')).toBeDefined();
		expect(screen.getByText('Closed fire 1 (2)')).toBeDefined();
		expect(screen.getByText('Closed fire 1 (1) (1)')).toBeDefined();
		expect(screen.getByText('Closed fire 1 (1) (2)')).toBeDefined();
	});
});
describe('mark section as complete', () => {
	
	const navigateToMock = vi.hoisted(() => vi.fn());
	mockNuxtImport('navigateTo', () => {
		return navigateToMock;
	});
	
	const openFireplace1: CombustionApplianceData = {
		name: 'Open fireplace 1',
		airSupplyToAppliance: CombustionAirSupplySituation.room_air,
		exhaustMethodFromAppliance: FlueGasExhaustSituation.into_separate_duct,
		typeOfFuel: CombustionFuelType.coal,
	};
	const closedFireplaceWithFan1: CombustionApplianceData = {
		name: 'Closed fireplace with fan 1',
		airSupplyToAppliance: CombustionAirSupplySituation.room_air,
		exhaustMethodFromAppliance: FlueGasExhaustSituation.into_separate_duct,
		typeOfFuel: CombustionFuelType.wood
	};
	const openGasFlueBalancer1: CombustionApplianceData = {
		name: 'Open gas flue balancer 1',
		airSupplyToAppliance: CombustionAirSupplySituation.outside,
		exhaustMethodFromAppliance: FlueGasExhaustSituation.into_room,
		typeOfFuel: CombustionFuelType.gas,
	};
	const openGasKitchenStove1: CombustionApplianceData = {
		name: 'Open gas kitchen stove 1',
		airSupplyToAppliance: CombustionAirSupplySituation.outside,
		exhaustMethodFromAppliance: FlueGasExhaustSituation.into_room,
		typeOfFuel: CombustionFuelType.oil,
	};
	const openGasFire1: CombustionApplianceData = {
		name: 'Open gas fire 1',
		airSupplyToAppliance: CombustionAirSupplySituation.outside,
		exhaustMethodFromAppliance: FlueGasExhaustSituation.into_mech_vent,
		typeOfFuel: CombustionFuelType.oil,
	};

	const closedFire1: CombustionApplianceData = {
		name: 'Closed fire 1',
		airSupplyToAppliance: CombustionAirSupplySituation.outside,
		exhaustMethodFromAppliance: FlueGasExhaustSituation.into_mech_vent,
		typeOfFuel: CombustionFuelType.coal,
	};

	const store = useEcaasStore();
	const user = userEvent.setup();

	const addCombustionApplianceDataToStore = async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.open_fireplace]: { data: [openFireplace1] },
					[CombustionApplianceType.closed_with_fan]: { data: [closedFireplaceWithFan1] },
					[CombustionApplianceType.open_gas_flue_balancer]: { data: [openGasFlueBalancer1] },
					[CombustionApplianceType.open_gas_kitchen_stove]: { data: [openGasKitchenStove1] },
					[CombustionApplianceType.open_gas_fire]: { data: [openGasFire1] },
					[CombustionApplianceType.closed_fire]: { data: [closedFire1] },
				}
			}
		});
	};

	beforeEach(async () => {
		await addCombustionApplianceDataToStore();
		await renderSuspended(CombustionAppliances);
	});

	const getCombustionApplianceData = async (action: string) => {
		return [
			{ key: CombustionApplianceType.open_fireplace, testId: `openFireplace_${action}_0`, form: OpenFireplaceForm },
			{ key: CombustionApplianceType.closed_with_fan, testId: `closedFireplaceWithFan_${action}_0`, form: ClosedFireplaceWithFanForm },
			{ key: CombustionApplianceType.open_gas_flue_balancer, testId: `openGasFlueBalancer_${action}_0`, form: OpenGasFlueBalancerForm },
			{ key: CombustionApplianceType.open_gas_kitchen_stove, testId: `openGasKitchenStove_${action}_0`, form: OpenGasKitchenStoveForm },
			{ key: CombustionApplianceType.open_gas_fire, testId: `openGasFire_${action}_0`, form: OpenGasFireForm },
			{ key: CombustionApplianceType.closed_fire, testId: `closedFire_${action}_0`, form: ClosedFireForm }
		];
	};

	type CombustionKey = keyof typeof store.infiltrationAndVentilation.combustionAppliances;

	it('marks combustion appliances as complete when mark section as complete button is clicked', async () => {
		expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		const completedStatusElement = screen.queryByTestId('completeSectionCompleted');
		expect(completedStatusElement?.style.display).toBe("none");

		await user.click(screen.getByTestId('completeSectionButton'));

		const appliances = store.infiltrationAndVentilation.combustionAppliances;

		for (const key in appliances) {
			expect(appliances[key as CombustionKey]?.complete).toBe(true);
		}

		expect(screen.queryByRole("button", { name: "Mark section as complete" })).toBeNull();
		expect(completedStatusElement?.style.display).not.toBe("none");
		expect(navigateToMock).toHaveBeenCalledWith('/infiltration-and-ventilation');
	});

	it('marks combustion appliances as not complete when user removes an item after completion', async () => {
		const applianceData = await getCombustionApplianceData("remove");
		const appliances = Object.entries(store.infiltrationAndVentilation.combustionAppliances) as Entries<typeof store.infiltrationAndVentilation.combustionAppliances>;

		for (const [key] of appliances) {
			const typedKey = key;
			await user.click(screen.getByTestId('completeSectionButton'));
			expect(store.infiltrationAndVentilation.combustionAppliances[typedKey]?.complete).toBe(true);

			const item = applianceData.find(x => x.key === typedKey);
			await user.click(screen.getByTestId(item!.testId));
			expect(store.infiltrationAndVentilation.combustionAppliances[typedKey]?.complete).toBe(false);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		}
	});

	it('marks combustion appliances as not complete when user duplicates an item after completion', async () => {
		const applianceData = await getCombustionApplianceData("duplicate");
		const appliances = Object.entries(store.infiltrationAndVentilation.combustionAppliances) as Entries<typeof store.infiltrationAndVentilation.combustionAppliances>;

		for (const [key] of appliances) {
			const typedKey = key;
			await user.click(screen.getByTestId('completeSectionButton'));
			expect(store.infiltrationAndVentilation.combustionAppliances[typedKey]?.complete).toBe(true);

			const item = applianceData.find(x => x.key === typedKey);
			await user.click(screen.getByTestId(item!.testId));
			expect(store.infiltrationAndVentilation.combustionAppliances[typedKey]?.complete).toBe(false);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		}
	});

	it('marks combustion appliances as not complete when user saves a new or edited appliance form after marking complete', async () => {
		const applianceData = await getCombustionApplianceData("");
		const appliances = Object.entries(store.infiltrationAndVentilation.combustionAppliances) as Entries<typeof store.infiltrationAndVentilation.combustionAppliances>;

		for (const [key] of appliances) {
			const typedKey = key;
			await user.click(screen.getByTestId('completeSectionButton'));
			expect(store.infiltrationAndVentilation.combustionAppliances[typedKey]?.complete).toBe(true);

			const item = applianceData.find(x => x.key === typedKey);

			await renderSuspended(item?.form, {
				route: {
					params: { combustion: '0' }
				}
			});

			await user.click(screen.getByRole('button', { name: "Save and continue" }));
			expect(store.infiltrationAndVentilation.combustionAppliances[typedKey]?.complete).toBe(false);

			await renderSuspended(CombustionAppliances);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		}
	});
});
