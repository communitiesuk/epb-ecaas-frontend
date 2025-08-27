import { mockNuxtImport, registerEndpoint, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import {screen, within } from '@testing-library/vue';
import HeatGeneration from './index.vue';
import HeatPumpForm from "./heat-pump/[pump].vue";
import BoilerForm from "./boiler/[boiler].vue";
import HeatBatteryForm from "./heat-battery/[battery].vue";
import HeatNetworkForm from "./heat-network/[network].vue";
import HeatInterfaceUnitForm from "./heat-interface-unit/[interface].vue";

import { v4 as uuidv4 } from "uuid";
import { productsInCategory } from "~/server/services/products";

registerEndpoint('/api/products', async () => productsInCategory('heatPump'));

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe('heat generation', () => {

	describe('heat pump', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const heatPump1: HeatPumpData = {
			id: uuidv4(),
			name: "Heat pump 1",
			productReference: "HEATPUMP-LARGE"
		};

		const heatPump2: HeatPumpData = {
			...heatPump1,
			name: "Heat pump 2",
			productReference: "HEATPUMP-MEDIUM"
		};

		const heatPump3: HeatPumpData = {
			...heatPump1,
			name: "Heat pump 3",
			productReference: "HEATPUMP-SMALL"
		};

		afterEach(() => {
			store.$reset();
		});

		test('heat pump is removed when remove link is clicked', async () => {
			store.$patch({
				heatingSystems: {
					heatGeneration: {
						heatPump: {
							data: [{data: heatPump1}]
						}
					}
				}
			});

			await renderSuspended(HeatGeneration);

			expect(screen.getAllByTestId('heatPump_items')).toBeDefined();

			await user.click(screen.getByTestId('heatPump_remove_0'));

			expect(screen.queryByTestId('heatPump_items')).toBeNull();
		});

		it('should only remove the heat pump thats is clicked', async () => {
			store.$patch({
				heatingSystems: {
					heatGeneration: {
						heatPump: {
							data:[{data: heatPump1}, {data: heatPump2}, {data: heatPump3}]
						}
					}
				}
			});

			await renderSuspended(HeatGeneration);
			await user.click(screen.getByTestId('heatPump_remove_1'));

			const populatedList = screen.getByTestId('heatPump_items');

			expect(within(populatedList).getByText('Heat pump 1')).toBeDefined();
			expect(within(populatedList).getByText('Heat pump 3')).toBeDefined();
			expect(within(populatedList).queryByText('Heat pump 2')).toBeNull();

		});
	});

	// describe('boiler', () => {
	// 	const store = useEcaasStore();
	// 	const user = userEvent.setup();
	//
	// 	const boiler1: BoilerData = {
	// 		id: uuidv4(),
	// 		name: "boiler 1"
	// 	};
	//
	// 	const boiler2: BoilerData = {
	// 		...boiler1,
	// 		name: "boiler 2",
	// 	};
	//
	// 	const boiler3: BoilerData = {
	// 		...boiler1,
	// 		name: "boiler 3"
	// 	};
	//
	// 	afterEach(() => {
	// 		store.$reset();
	// 	});
	//
	// 	it('boiler is removed when remove link is clicked', async () => {
	// 		store.$patch({
	// 			heatingSystems: {
	// 				heatGeneration: {
	// 					boiler: {
	// 						data: [boiler1]
	// 					}
	// 				}
	// 			}
	// 		});
	//
	// 		await renderSuspended(HeatGeneration);
	//
	// 		expect(screen.getAllByTestId('boiler_items')).toBeDefined();
	//
	// 		await user.click(screen.getByTestId('boiler_remove_0'));
	//
	// 		expect(screen.queryByTestId('boiler_items')).toBeNull();
	// 	});
	//
	// 	it('should only remove the boiler thats is clicked', async () => {
	// 		store.$patch({
	// 			heatingSystems: {
	// 				heatGeneration: {
	// 					boiler: {
	// 						data:[boiler1, boiler2, boiler3]
	// 					}
	// 				}
	// 			}
	// 		});
	//
	// 		await renderSuspended(HeatGeneration);
	// 		await user.click(screen.getByTestId('boiler_remove_1'));
	//
	// 		const populatedList = screen.getByTestId('boiler_items');
	//
	// 		expect(within(populatedList).getByText('boiler 1')).toBeDefined();
	// 		expect(within(populatedList).getByText('boiler 3')).toBeDefined();
	// 		expect(within(populatedList).queryByText('boiler 2')).toBeNull();
	//
	// 	});
	// });

	// describe('heat battery', () => {
	// 	const store = useEcaasStore();
	// 	const user = userEvent.setup();
	//
	// 	const heatBattery1: HeatBatteryData = {
	// 		id: uuidv4(),
	// 		name: "heatBattery 1"
	// 	};
	//
	// 	const heatBattery2: HeatBatteryData = {
	// 		...heatBattery1,
	// 		name: "heatBattery 2",
	// 	};
	//
	// 	const heatBattery3: HeatBatteryData = {
	// 		...heatBattery1,
	// 		name: "heatBattery 3"
	// 	};
	//
	// 	afterEach(() => {
	// 		store.$reset();
	// 	});
	//
	// 	it('heat battery is removed when remove link is clicked', async () => {
	// 		store.$patch({
	// 			heatingSystems: {
	// 				heatGeneration: {
	// 					heatBattery: {
	// 						data: [heatBattery1]
	// 					}
	// 				}
	// 			}
	// 		});
	//
	// 		await renderSuspended(HeatGeneration);
	//
	// 		expect(screen.getAllByTestId('heatBattery_items')).toBeDefined();
	//
	// 		await user.click(screen.getByTestId('heatBattery_remove_0'));
	//
	// 		expect(screen.queryByTestId('heatBattery_items')).toBeNull();
	// 	});
	//
	// 	it('should only remove the heat battery that is clicked', async () => {
	// 		store.$patch({
	// 			heatingSystems: {
	// 				heatGeneration: {
	// 					heatBattery: {
	// 						data:[heatBattery1, heatBattery2, heatBattery3]
	// 					}
	// 				}
	// 			}
	// 		});
	//
	// 		await renderSuspended(HeatGeneration);
	// 		await user.click(screen.getByTestId('heatBattery_remove_1'));
	//
	// 		const populatedList = screen.getByTestId('heatBattery_items');
	//
	// 		expect(within(populatedList).getByText('heatBattery 1')).toBeDefined();
	// 		expect(within(populatedList).getByText('heatBattery 3')).toBeDefined();
	// 		expect(within(populatedList).queryByText('heatBattery 2')).toBeNull();
	//
	// 	});
	// });

	// describe('heat network', () => {
	// 	const store = useEcaasStore();
	// 	const user = userEvent.setup();
	//
	// 	const heatNetwork1: HeatNetworkData = {
	// 		id: uuidv4(),
	// 		name: "heatNetwork 1"
	// 	};
	//
	// 	const heatNetwork2: HeatNetworkData = {
	// 		...heatNetwork1,
	// 		name: "heatNetwork 2",
	// 	};
	//
	// 	const heatNetwork3: HeatNetworkData = {
	// 		...heatNetwork1,
	// 		name: "heatNetwork 3"
	// 	};
	//
	// 	afterEach(() => {
	// 		store.$reset();
	// 	});
	//
	// 	it('heat network is removed when remove link is clicked', async () => {
	// 		store.$patch({
	// 			heatingSystems: {
	// 				heatGeneration: {
	// 					heatNetwork: {
	// 						data: [heatNetwork1]
	// 					}
	// 				}
	// 			}
	// 		});
	//
	// 		await renderSuspended(HeatGeneration);
	//
	// 		expect(screen.getAllByTestId('heatNetwork_items')).toBeDefined();
	//
	// 		await user.click(screen.getByTestId('heatNetwork_remove_0'));
	//
	// 		expect(screen.queryByTestId('heatNetwork_items')).toBeNull();
	// 	});
	//
	// 	it('should only remove the heat network that is clicked', async () => {
	// 		store.$patch({
	// 			heatingSystems: {
	// 				heatGeneration: {
	// 					heatNetwork: {
	// 						data:[heatNetwork1, heatNetwork2, heatNetwork3]
	// 					}
	// 				}
	// 			}
	// 		});
	//
	// 		await renderSuspended(HeatGeneration);
	// 		await user.click(screen.getByTestId('heatNetwork_remove_1'));
	//
	// 		const populatedList = screen.getByTestId('heatNetwork_items');
	//
	// 		expect(within(populatedList).getByText('heatNetwork 1')).toBeDefined();
	// 		expect(within(populatedList).getByText('heatNetwork 3')).toBeDefined();
	// 		expect(within(populatedList).queryByText('heatNetwork 2')).toBeNull();
	//
	// 	});
	// });

	// describe('heat interface unit', () => {
	// 	const store = useEcaasStore();
	// 	const user = userEvent.setup();
	//
	// 	const heatInterfaceUnit1: HeatInterfaceUnitData = {
	// 		id: uuidv4(),
	// 		name: "heatInterfaceUnit 1"
	// 	};
	//
	// 	const heatInterfaceUnit2: HeatInterfaceUnitData = {
	// 		...heatInterfaceUnit1,
	// 		name: "heatInterfaceUnit 2",
	// 	};
	//
	// 	const heatInterfaceUnit3: HeatInterfaceUnitData = {
	// 		...heatInterfaceUnit1,
	// 		name: "heatInterfaceUnit 3"
	// 	};
	//
	// 	afterEach(() => {
	// 		store.$reset();
	// 	});
	//
	// 	it('heat interface unit is removed when remove link is clicked', async () => {
	// 		store.$patch({
	// 			heatingSystems: {
	// 				heatGeneration: {
	// 					heatInterfaceUnit: {
	// 						data: [heatInterfaceUnit1]
	// 					}
	// 				}
	// 			}
	// 		});
	//
	// 		await renderSuspended(HeatGeneration);
	//
	// 		expect(screen.getAllByTestId('heatInterfaceUnit_items')).toBeDefined();
	//
	// 		await user.click(screen.getByTestId('heatInterfaceUnit_remove_0'));
	//
	// 		expect(screen.queryByTestId('heatInterfaceUnit_items')).toBeNull();
	// 	});
	//
	// 	it('should only remove the heat interface unit that is clicked', async () => {
	// 		store.$patch({
	// 			heatingSystems: {
	// 				heatGeneration: {
	// 					heatInterfaceUnit: {
	// 						data:[heatInterfaceUnit1, heatInterfaceUnit2, heatInterfaceUnit3]
	// 					}
	// 				}
	// 			}
	// 		});
	//
	// 		await renderSuspended(HeatGeneration);
	// 		await user.click(screen.getByTestId('heatInterfaceUnit_remove_1'));
	//
	// 		const populatedList = screen.getByTestId('heatInterfaceUnit_items');
	//
	// 		expect(within(populatedList).getByText('heatInterfaceUnit 1')).toBeDefined();
	// 		expect(within(populatedList).getByText('heatInterfaceUnit 3')).toBeDefined();
	// 		expect(within(populatedList).queryByText('heatInterfaceUnit 2')).toBeNull();
	//
	// 	});
	// });

	function heatingSystemsFunc(): Pick<HeatingSystems, 'heatGeneration'> {
		return {
			heatGeneration: {
				heatPump: { data: [{ data: { id: "1b6a1e50-0e1f-4bc1-b198-f84587a7fdf2", name: "Heat pump 1", productReference: "HEATPUMP-MEDIUM" }}] },
				boiler: { data: [{ id: "2eec2b28-7c7a-47c2-92bb-c13b1eaa9ae3", name: "Boiler 1" }] },
				heatBattery: { data: [{ id: "3c4bc9a3-2e7c-419a-86c9-0cb2f4768a1c", name: "Battery 1" }] },
				heatNetwork: { data: [{ id: "46d0c104-42a5-44f4-b250-f58c933b9f5e", name: "Network 1" }] },
				heatInterfaceUnit: { data: [{ id: "55ab34d1-8238-4a90-bf3e-223a84c1f4dc", name: "Heat interface unit 1" }] },
			},
		};
	}


	describe("mark heat generation section as complete", () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const heatingSystems = heatingSystemsFunc();
	
		const addHeatGenerationDataToStore = async () => {
			store.$patch({
				heatingSystems,
			});
		};
	
		beforeEach(async () => {
			await addHeatGenerationDataToStore();
			await renderSuspended(HeatGeneration);
		});

		afterEach(() => {
			store.$reset();
		});

		const getGeneratorsData = async (action: string) => {
			return [
				{ key: "heatPump", testId: `heatPump_${action}_0`, form: HeatPumpForm, params: "pump" },
				{ key: "boiler", testId: `boiler_${action}_0`, form: BoilerForm, params: "boiler" },
				{ key: "heatBattery", testId: `heatBattery_${action}_0`, form: HeatBatteryForm, params: "battery" },
				{ key: "heatNetwork", testId: `heatNetwork_${action}_0`, form: HeatNetworkForm, params: "network" },
				{ key: "heatInterfaceUnit", testId: `heatInterfaceUnit_${action}_0`, form: HeatInterfaceUnitForm, params: "interface" },
			];
		};

		type HeatGenerationType = keyof typeof store.heatingSystems.heatGeneration;
	
		it("marks heat generation section as complete when button is clicked", async () => {
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			const completedStatusElement = screen.queryByTestId("completeSectionCompleted");
			expect(completedStatusElement?.style.display).toBe("none");
	
			await user.click(screen.getByTestId("completeSectionButton"));

			const heatGenerators = store.heatingSystems.heatGeneration;
			for (const key in heatGenerators) {
				expect(heatGenerators[key as HeatGenerationType]?.complete).toBe(true);
			}
	
			expect(screen.queryByRole("button", { name: "Mark section as complete" })).toBeNull();
			expect(completedStatusElement?.style.display).not.toBe("none");
			expect(navigateToMock).toHaveBeenCalledWith("/heating-systems");
		});
	
		it("marks as not complete if an item is removed after marking complete", async () => {
			const generators = await getGeneratorsData("remove");

			// moved below out of for loop when removing non heat pump generators for summer
			await user.click(screen.getByTestId("completeSectionButton"));
			expect(store.heatingSystems.heatGeneration['heatPump']?.complete).toBe(true);

			const generatorData = generators.find((e) => e.key === 'heatPump');
			await user.click(screen.getByTestId(generatorData!.testId));

			expect(store.heatingSystems.heatGeneration['heatPump']?.complete).toBe(false);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();

			// for (const [key] of Object.entries(store.heatingSystems.heatGeneration)) {
			// 	const typedKey = key as HeatGenerationType;
			//
			// 	await user.click(screen.getByTestId("completeSectionButton"));
			// 	expect(store.heatingSystems.heatGeneration[typedKey]?.complete).toBe(true);
			//
			// 	const generatorData = generators.find((e) => e.key === typedKey);
			// 	await user.click(screen.getByTestId(generatorData!.testId));
			// 	expect(store.heatingSystems.heatGeneration[typedKey]?.complete).toBe(false);
			//
			// 	expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			// }
		});
	});

	describe("mark heat generation as not complete", () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const heatingSystems = heatingSystemsFunc();
	
		const addHeatGenerationDataToStore = async () => {
			store.$patch({
				heatingSystems,
			});
		};
	
		beforeEach(async () => {
			await addHeatGenerationDataToStore();
			await renderSuspended(HeatGeneration);
		});

		afterEach(() => {
			store.$reset();
		});

		const getGeneratorsData = async (action: string) => {
			return [
				{ key: "heatPump", testId: `heatPump_${action}_0`, form: HeatPumpForm, params: "pump" },
				// { key: "boiler", testId: `boiler_${action}_0`, form: BoilerForm, params: "boiler" },
				// { key: "heatBattery", testId: `heatBattery_${action}_0`, form: HeatBatteryForm, params: "battery" },
				// { key: "heatNetwork", testId: `heatNetwork_${action}_0`, form: HeatNetworkForm, params: "network" },
				// { key: "heatInterfaceUnit", testId: `heatInterfaceUnit_${action}_0`, form: HeatInterfaceUnitForm, params: "interface" },
			];
		};

		it("marks heat pump as not complete after saving a new or edited generator item", async () => {
			const generators = await getGeneratorsData("");
			await user.click(screen.getByTestId("completeSectionButton"));
			expect(store.heatingSystems.heatGeneration.heatPump?.complete).toBe(true);

			const heatPumps = generators.find((e) => e.key === "heatPump");
			await renderSuspended(heatPumps!.form, {
				route: {
					params: { [heatPumps!.params]: "0" },
				},
			});
			await user.click(screen.getByTestId("saveAndComplete"));
			expect(store.heatingSystems.heatGeneration.heatPump.complete).toBe(false);
			await renderSuspended(HeatGeneration);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		});
	});
});
