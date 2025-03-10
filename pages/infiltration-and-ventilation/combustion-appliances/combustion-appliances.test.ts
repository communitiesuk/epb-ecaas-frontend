import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import {screen, within } from '@testing-library/vue';
import CombustionAppliances from './index.vue';
import {expect} from "vitest";

describe('open fireplace', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const openFireplace1: OpenFireplaceData = {
		name: 'Open fireplace 1'
	};

	const openFireplace2: OpenFireplaceData = {
		name: 'Open fireplace 2'
	};

	const openFireplace3: OpenFireplaceData = {
		name: 'Open fireplace 3'
	};

	afterEach(() => {
		store.$reset();
	});

	it('open fireplace is removed when remove link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					openFireplace: {
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
					openFireplace: {
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

	it('open fireplace is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					openFireplace: {
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

	const closedFireplaceWithFan1: ClosedFireplaceWithFanData = {
		name: 'Closed fireplace with fan 1'
	};

	const closedFireplaceWithFan2: ClosedFireplaceWithFanData = {
		name: 'Closed fireplace with fan 2'
	};

	const closedFireplaceWithFan3: ClosedFireplaceWithFanData = {
		name: 'Closed fireplace with fan 3'
	};

	afterEach(() => {
		store.$reset();
	});

	it('closed fireplace is removed when remove link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					closedFireplaceWithFan: {
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
					closedFireplaceWithFan: {
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

	it('closed fireplace is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					closedFireplaceWithFan: {
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

	const openGasFlueBalancer1: OpenGasFlueBalancerData = {
		name: 'Open gas flue balancer 1'
	};

	const openGasFlueBalancer2: OpenGasFlueBalancerData = {
		name: 'Open gas flue balancer 2'
	};

	const openGasFlueBalancer3: OpenGasFlueBalancerData = {
		name: 'Open gas flue balancer 3'
	};

	afterEach(() => {
		store.$reset();
	});

	it('open gas flue balancer is removed when remove link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					openGasFlueBalancer: {
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
					openGasFlueBalancer: {
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

	it('open gas flue balancer is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					openGasFlueBalancer: {
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

	const openGasKitchenStove1: OpenGasKitchenStoveData = {
		name: 'Open gas kitchen stove 1'
	};

	const openGasKitchenStove2: OpenGasKitchenStoveData = {
		name: 'Open gas kitchen stove 2'
	};

	const openGasKitchenStove3: OpenGasKitchenStoveData = {
		name: 'Open gas kitchen stove 3'
	};

	afterEach(() => {
		store.$reset();
	});

	it('open gas kitchen stove is removed when remove link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					openGasKitchenStove: {
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
					openGasKitchenStove: {
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

	it('open gas kitchen stove is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					openGasKitchenStove: {
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

	const openGasFire1: OpenGasFireData = {
		name: 'Open gas fire 1'
	};

	const openGasFire2: OpenGasFireData = {
		name: 'Open gas fire 2'
	};

	const openGasFire3: OpenGasFireData = {
		name: 'Open gas fire 3'
	};

	afterEach(() => {
		store.$reset();
	});

	it('open gas fire is removed when remove link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					openGasFire: {
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
					openGasFire: {
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

	it('open gas fire is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					openGasFire: {
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

	const closedFire1: ClosedFireData = {
		name: 'Closed fire 1'
	};

	const closedFire2: ClosedFireData = {
		name: 'Closed fire 2'
	};

	const closedFire3: ClosedFireData = {
		name: 'Closed fire 3'
	};

	afterEach(() => {
		store.$reset();
	});

	it('closed fire is removed when remove link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					closedFire: {
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
					closedFire: {
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

	it('closed fire is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					closedFire: {
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