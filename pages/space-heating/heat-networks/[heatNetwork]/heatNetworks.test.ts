import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/vue";
import HeatNetworks from "./index.vue";
import type { DisplayProduct } from "~/pcdb/pcdb.types";
import { v4 as uuidv4 } from "uuid";


const { mockFetch, navigateToMock } = vi.hoisted(() => ({
	mockFetch: vi.fn(),
	navigateToMock: vi.fn(),
}));

mockNuxtImport("useFetch", () => mockFetch);
mockNuxtImport("navigateTo", () => navigateToMock);

vi.mock("uuid");

describe("Heat Networks", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const sleevedDistrictHeatNetwork: EcaasForm<HeatNetworkData> = {
		data: {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8f",
			name: "Sleeved District Heat Network",
			productReference: "42",
			typeOfHeatNetwork: "sleevedDistrictHeatNetwork",
		},
	};

	const unsleevedDistrictHeatNetwork: EcaasForm<HeatNetworkData> = {
		data: {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r7s",
			name: "Unsleeved District Heat Network",
			productReference: "43",
			typeOfHeatNetwork: "unsleevedDistrictHeatNetwork",
		},
	};

	const communalHeatNetworkWithoutBooster: EcaasForm<HeatNetworkData> = {
		data: {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r9k",
			name: "Communal Heat Network without Booster",
			productReference: "44",
			typeOfHeatNetwork: "communalHeatNetwork",
		},
	};

	const communalHeatNetworkWithBooster: EcaasForm<HeatNetworkData> = {
		data: {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3rl6",
			name: "Communal Heat Network with Booster",
			productReference: "45",
			typeOfHeatNetwork: "communalHeatNetwork",
			boosterHeatPump: true,
		},
	};

	const heatNetworkNoType: Partial<HeatNetworkData> = {
		id: "heat_network_no_type",
		name: "Heat Network No Type",
		productReference: "1000",
		boosterHeatPump: true,
	};

	const boosterHeatPump: Partial<HeatSourceData> = {
		id: "booster_id",
		name: "Booster Heat Pump",
		typeOfHeatSource: "heatPump",
		typeOfHeatPump: "booster",
	};

	const heatPump: Partial<HeatSourceData> = {
		id: "heat_pump_id",
		name: "Heat Pump",
		typeOfHeatSource: "heatPump",
		typeOfHeatPump: "airSource",
	};

	afterEach(() => {
		store.$reset();
		//navigateToMock.mockReset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Heat Network");		
		await user.click(screen.getByTestId("typeOfHeatNetwork_sleevedDistrictHeatNetwork"));
		await user.click(screen.getByTestId("chooseAProductButton"));
		await user.tab();
	};

	test("heat networks displays form correctly", async () => {
		await renderSuspended(HeatNetworks, {
			route: {
				params: { "heatNetwork": "create" },
			},
		});
		await populateValidForm();

		expect(screen.getByTestId("name")).toBeDefined();
		expect(screen.getByTestId("selectHeatNetwork")).toBeDefined();
		expect(screen.getByTestId("typeOfHeatNetwork")).toBeDefined();
	});

	test("heat network data is saved to store state when form is valid", async () => {

		vi.mocked(uuidv4).mockReturnValue(sleevedDistrictHeatNetwork.data.id as unknown as Buffer);

		await renderSuspended(HeatNetworks, {
			route: {
				params: { "heatNetwork": "create" },
			},
		});

		await populateValidForm();
		store.$patch(state => {
			(state.spaceHeating.heatNetworks.data[0]!.data as HeatNetworkData)
				.productReference = "42";
		});

		await renderSuspended(HeatNetworks, {
			route: {
				params: { "heatNetwork": "0" },
			},
		});

		await user.click(screen.getByTestId("saveAndComplete"));

		const expectedData: HeatNetworkData = {
			id: sleevedDistrictHeatNetwork.data.id,
			name: "Heat Network",
			productReference: "42",
			typeOfHeatNetwork: "sleevedDistrictHeatNetwork",
			subHeatNetworkName: undefined,
			boosterHeatPump: undefined,
		};
        
		const { data } = store.spaceHeating.heatNetworks;
		expect(data[0]?.data).toEqual(expectedData);
		expect(data[0]?.complete).toEqual(true);
	});

	test("heat network form is prepopulated when data exists in state", async () => {
		store.$patch({
			spaceHeating: {
				heatNetworks: {
					data: [sleevedDistrictHeatNetwork],
				},
			},
		});
    
		await renderSuspended(HeatNetworks, {
			route: {
				params: { "heatNetwork": "0" },
			},
		});
		
		expect((await screen.getByTestId<HTMLInputElement>("name")).value).toBe(sleevedDistrictHeatNetwork.data.name);
		expect(
			(await screen.getByTestId<HTMLInputElement>(`typeOfHeatNetwork_sleevedDistrictHeatNetwork`)).checked,
		).toBe(true);
	});

	it("navigates to space heating when valid form is completed", async () => {
		const heatNetworkProduct: Partial<DisplayProduct> = {
			id: "1000",
			technologyType: "HeatNetworks",
		};
		mockFetch.mockReturnValue({
			data: ref(heatNetworkProduct),
		});
	
		await renderSuspended(HeatNetworks, {
			route: {
				params: { "heatNetwork": "0" },
			},
		});
	
		await user.click(screen.getByTestId("saveAndComplete"));
	
		expect(navigateToMock).toHaveBeenCalledWith("/space-heating");
	});
    
	test("required error messages are displayed when empty heat network form is submitted", async () => {
		await renderSuspended(HeatNetworks, {
			route: {
				params: { "heatNetwork": "create" },
			},
		});
    
		await user.click(screen.getByTestId("saveAndComplete"));
    
		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("typeOfHeatNetwork_error"))).toBeDefined();
		expect((await screen.findByTestId("selectHeatNetwork_error"))).toBeDefined();
	});
    
	test("error summary is displayed when an invalid heat network form is submitted", async () => {
		await renderSuspended(HeatNetworks, {
			route: {
				params: { "heatNetwork": "create" },
			},
		});
    
		await user.click(screen.getByTestId("saveAndComplete"));
    
		expect((await screen.findByTestId("heatNetworksErrorSummary"))).toBeDefined();
	});

	test("the 'Select a product' element navigates user to the products page", async () => {
		await renderSuspended(HeatNetworks, {
			route: {
				params: { "heatNetwork": "create" },
			},
		});
	
		expect(navigateToMock).toHaveBeenCalledWith("/0/heat-network");	
	});

	test("displays subnetwork name for selected heat network product", async () => {
		const heatNetworkWithSubName: HeatNetworkData = {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8b",
			name: "Test heat network",
			productReference: "1000",
			subHeatNetworkName: "Sub 2",
			typeOfHeatNetwork: "communalHeatNetwork",
		};
	
		mockFetch.mockReturnValue({
			data: ref({
				id: "1000",
				technologyType: "HeatNetworks",
				communityHeatNetworkName: "Network Alpha",
				testData: {
					ID: "td-2",
					subheatNetworkName: "Sub 2",
				},
			}),
		});
	
		store.$patch({
			spaceHeating: {
				heatNetworks: {
					data: [{ data: heatNetworkWithSubName }],
				},
			},
		});
	
		await renderSuspended(HeatNetworks, {
			route: {
				params: { "heatNetwork": "0" },
			},
		});
		await waitFor(() => {
			expect(screen.getByTestId("pcdbHeatNetworkProductData")).toBeDefined();
			expect(screen.getByTestId("productData_subHeatNetworkName").textContent).toBe("Sub 2");
		});
	});

	test("does not clear selected product when type of heat network changes", async () => {
		const traditionalCommunalHeatNetwork: EcaasForm<HeatNetworkData> = {
			data: {
				id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8t",
				name: "Traditional Communal Heat Network",
				productReference: "44",
				typeOfHeatNetwork: "communalHeatNetwork",
			},
		};
		store.$patch({
			spaceHeating: {
				heatNetworks: {
					data: [traditionalCommunalHeatNetwork],
				},
			},
		});

		await renderSuspended(HeatNetworks, {
			route: {
				params: { "heatNetwork": "0" },
			},
		});

		await user.click(screen.getByTestId("typeOfHeatNetwork_sleevedDistrictHeatNetwork"));

		expect((store.spaceHeating.heatNetworks.data[0]!.data as HeatNetworkData).productReference).toBe("44");
	});

	test("creates a heat network with default name when 'choose a product' is selected", async () => {
		await renderSuspended(HeatNetworks, {
			route: {
				params: { "heatNetwork": "create" },
			},
		});
		await user.click(screen.getByTestId("chooseAProductButton"));

		expect((store.spaceHeating.heatNetworks.data.length)).toBe(1);
		expect((store.spaceHeating.heatNetworks.data[0]?.data.name)).toBe("Heat network");
	});

	test("shows error message when heat network is added with booster heat pump flag and type of heat network selected is a sleeved district", async () => {
		store.$patch({
			spaceHeating: {
				heatNetworks: {
					data: [{ data: heatNetworkNoType, complete: false }],
				},
			},
		});

		await renderSuspended(HeatNetworks, {
			route: {
				params: { "heatNetwork": "0" },
			},
		});

		await user.click(screen.getByTestId("typeOfHeatNetwork_sleevedDistrictHeatNetwork"));
		await user.click(screen.getByTestId("saveAndComplete"));

		const errorSummary = await screen.findByTestId("heatNetworksErrorSummary");
		expect(errorSummary.textContent).toContain(
			"The heat network selected only allows for booster heat pumps as a heat source, and so communal heat network must be selected as the type.",
		);

		const link = errorSummary.querySelector("a");
		expect(link?.getAttribute("href")).toContain("typeOfHeatNetwork");
	});

	test("shows error message when heat network is added with booster heat pump flag and type of heat network selected is a unsleeved district", async () => {
		store.$patch({
			spaceHeating: {
				heatNetworks: {
					data: [{ data: heatNetworkNoType, complete: false }],
				},
			},
		});

		await renderSuspended(HeatNetworks, {
			route: {
				params: { "heatNetwork": "0" },
			},
		});

		await user.click(screen.getByTestId("typeOfHeatNetwork_unsleevedDistrictHeatNetwork"));
		await user.click(screen.getByTestId("saveAndComplete"));

		const errorSummary = await screen.findByTestId("heatNetworksErrorSummary");

		expect(errorSummary.textContent).toContain(
			"The heat network selected only allows for booster heat pumps as a heat source, and so communal heat network must be selected as the type.",
		);

		const link = errorSummary.querySelector("a");

		expect(link?.getAttribute("href")).toContain("typeOfHeatNetwork");
	});

	test("does not show error message when heat network is added with booster heat pump flag and type of heat network selected is a communal", async () => {
		store.$patch({
			spaceHeating: {
				heatNetworks: {
					data: [{ data: heatNetworkNoType, complete: false }],
				},
			},
		});

		await renderSuspended(HeatNetworks, {
			route: {
				params: { "heatNetwork": "0" },
			},
		});

		await user.click(screen.getByTestId("typeOfHeatNetwork_communalHeatNetwork"));
		await user.click(screen.getByTestId("saveAndComplete"));

		expect(screen.queryByTestId("heatNetworksErrorSummary")).toBeNull();
		expect(store.spaceHeating.heatNetworks.data[0]?.complete).toBe(true);
	});

	describe("Compatible heat source added before heat network", () => {
		const incompatibleHeatNetworks = [
			[
				"sleeved district heat network",
				sleevedDistrictHeatNetwork,
			],
			[
				"unsleeved district heat network",
				unsleevedDistrictHeatNetwork,
			],
			[
				"communal heat network without booster heat pump flag",
				communalHeatNetworkWithoutBooster,
			],
		] as const;

		it.each(incompatibleHeatNetworks)(
			"shows error when a booster heat pump exists and a %s is selected",
			async (_heatNetworkName, heatNetwork) => {
				store.$patch({
					spaceHeating: {
						heatSource: {
							data: [{ data: boosterHeatPump, complete: false }],
						},
						heatNetworks: {
							data: [heatNetwork],
							complete: false,
						},
					},
				});

				await renderSuspended(HeatNetworks, {
					route: {
						params: { heatNetwork: "0" },
					},
				});

				await user.click(screen.getByTestId("saveAndComplete"));

				const errorSummary = await screen.findByTestId(
					"heatNetworksErrorSummary",
				);

				expect(errorSummary.textContent).toContain(
					"Booster heat pumps are not compatible with district heat networks, like the one selected. Please replace the booster heat pump with a HIU.",
				);

				const link = errorSummary.querySelector("a");

				expect(link).not.toBeNull();
				expect(link?.getAttribute("href")).toBe("/space-heating");
			},
		);

		it("does not show error when a booster heat pump exists and a communal heat network has a booster heat pump flag", async () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: boosterHeatPump, complete: false }],
					},
					heatNetworks: {
						data: [communalHeatNetworkWithBooster],
						complete: false,
					},
				},
			});

			await renderSuspended(HeatNetworks, {
				route: {
					params: { heatNetwork: "0" },
				},
			});

			await user.click(screen.getByTestId("saveAndComplete"));

			expect(
				screen.queryByTestId("heatNetworksErrorSummary"),
			).toBeNull();

			expect(
				store.spaceHeating.heatNetworks.data[0]?.complete,
			).toBe(true);

			expect(navigateToMock).toHaveBeenCalledWith("/space-heating");
		});
	});

	describe("DHW heat source compatibility", () => {
		const dhwAirSourceHeatPump: Partial<DomesticHotWaterHeatSourceData> = {
			isExistingHeatSource: false,
			id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
			name: "DHW Air Source Heat Pump",
			typeOfHeatSource: "heatPump",
			typeOfHeatPump: "airSource",
		};

		const dhwBoosterHeatPump: Partial<DomesticHotWaterHeatSourceData> = {
			isExistingHeatSource: false,
			id: "463c94f6-566c-49b2-af27-57e5c68b5c66",
			name: "DHW Booster Heat Pump",
			typeOfHeatSource: "heatPump",
			typeOfHeatPump: "booster",
		};

		const dhwHeatInterfaceUnit: Partial<DomesticHotWaterHeatSourceData> = {
			isExistingHeatSource: false,
			id: "463c94f6-566c-49b2-af27-57e5c68b5c88",
			name: "DHW Heat Interface Unit",
			typeOfHeatSource: "heatInterfaceUnit",
		};

		const dhwBoiler: Partial<DomesticHotWaterHeatSourceData> = {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8b",
			name: "DHW Boiler",
			isExistingHeatSource: false,
			typeOfHeatSource: "boiler",
			typeOfBoiler: "combiBoiler",
		};

		const dhwHeatBattery: Partial<DomesticHotWaterHeatSourceData> = {
			isExistingHeatSource: false,
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c1111",
			name: "DHW Heat Battery",
			typeOfHeatSource: "heatBattery",
		};
	
		const dhwImmersionHeater: Partial<DomesticHotWaterHeatSourceData> = {
			isExistingHeatSource: false,
			id: "463c94f6-566c-49b2-af27-57e5c888888",
			name: "Heat source 1",
			typeOfHeatSource: "immersionHeater",
		};

		const dhwPointOfUse: Partial<DomesticHotWaterHeatSourceData> = {
			isExistingHeatSource: false,
			id: "463c94f6-566c-49b2-af27-57e5c9999999",
			name: "Heat source 1",
			typeOfHeatSource: "pointOfUse",
		};

		const dhwSolarThermalSystem: Partial<DomesticHotWaterHeatSourceData> = {
			isExistingHeatSource: false,
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3333",
			name: "Heat source 1",
			typeOfHeatSource: "solarThermalSystem",
		};

		const incompatibleHeatSourceError = "A heat network is not compatible with the heat sources that have been added to domestic hot water. The only heat sources possible with a heat network are HIUs or booster heat pumps.";

		const submitHeatNetworkWithDHWHeatSource = async (
			heatSource: Partial<DomesticHotWaterHeatSourceData>,
		) => {
			store.$patch({
				domesticHotWater: {
					heatSources: {
						data: [{ data: heatSource, complete: true }],
					},
				},
			});

			vi.mocked(uuidv4).mockReturnValue(sleevedDistrictHeatNetwork.data.id as unknown as Buffer);

			await renderSuspended(HeatNetworks, {
				route: {
					params: { heatNetwork: "create" },
				},
			});

			await populateValidForm();

			store.$patch((state) => {
				(state.spaceHeating.heatNetworks.data[0]!.data as HeatNetworkData)
					.productReference = "42";
			});

			await renderSuspended(HeatNetworks, {
				route: {
					params: { heatNetwork: "0" },
				},
			});

			await user.click(screen.getByTestId("saveAndComplete"));
		};
		it.each([
			["non-booster heat pump", dhwAirSourceHeatPump],
			["boiler", dhwBoiler],
			["heat battery", dhwHeatBattery],
			["immersion heater", dhwImmersionHeater],
			["point of use", dhwPointOfUse],
			["solar thermal system", dhwSolarThermalSystem],
		])(
			"shows an error message when a %s has been added in domestic hot water",
			async (_, heatSource) => {
				await submitHeatNetworkWithDHWHeatSource(heatSource);

				const errorSummary = await screen.findByTestId(
					"heatNetworksErrorSummary",
				);

				expect(errorSummary.textContent).toContain(
					incompatibleHeatSourceError,
				);
			},
		);

		it.each([
			["booster heat pump", dhwBoosterHeatPump],
			["heat interface unit", dhwHeatInterfaceUnit],
		])(
			"allows a heat network when a compatible DHW heat source (%s) exists",
			async (_, heatSource) => {
				await submitHeatNetworkWithDHWHeatSource(heatSource);

				expect(
					screen.queryByTestId("heatNetworksErrorSummary"),
				).toBeNull();

				expect(
					store.spaceHeating.heatNetworks.data[0]?.complete,
				).toBe(true);
			},
		);

		test("the incompatible heat source error links to the domestic hot water page", async () => {
			await submitHeatNetworkWithDHWHeatSource(dhwBoiler);

			const errorSummary = await screen.findByTestId(
				"heatNetworksErrorSummary",
			);

			const link = errorSummary.querySelector("a");

			expect(link).not.toBeNull();
			expect(link?.getAttribute("href")).toBe("/domestic-hot-water");
		});
	});

	describe("partially saving data", () => {
		test("updated heat network form data is automatically saved to store ", async () => {
    
			await renderSuspended(HeatNetworks, {
				route: {
					params: { "heatNetwork": "0" },
				},
			});

			await user.type(screen.getByTestId("name"), "Test Heat Network");
			await user.click(screen.getByTestId("typeOfHeatNetwork_sleevedDistrictHeatNetwork"));
			await user.tab();
    
			expect(store.spaceHeating.heatNetworks.data[0]?.data.name).toBe("Test Heat Network");
			expect(store.spaceHeating.heatNetworks.data[0]?.data.typeOfHeatNetwork).toBe("sleevedDistrictHeatNetwork");
		});

		test("partial form data automatically saved to store with default name if no name has been added", async () => {
			await renderSuspended(HeatNetworks, {
				route: {
					params: { heatNetwork: "create" },
				},
			});
		
			await user.click(screen.getByTestId("typeOfHeatNetwork_sleevedDistrictHeatNetwork"));
			await user.tab();
		
			expect(store.spaceHeating.heatNetworks.data[0]?.data.name).toBe("Heat network");
			expect(store.spaceHeating.heatNetworks.data[0]?.data.typeOfHeatNetwork).toBe("sleevedDistrictHeatNetwork");
		});

		it("saves updated form data to store automatically", async () => {
			store.$patch({
				spaceHeating: {
					heatNetworks: {
						data: [sleevedDistrictHeatNetwork],
					},
				},
			});
		
			await renderSuspended(HeatNetworks, {
				route: {
					params: { "heatSource": "0" },
				},
			});
		
			await user.click(screen.getByTestId("typeOfHeatNetwork_communalHeatNetwork"));
		
			const actualHeatNetwork = store.spaceHeating.heatNetworks.data[0]!;
			expect(actualHeatNetwork.data.typeOfHeatNetwork).toBe("communalHeatNetwork");
			expect(actualHeatNetwork.data.name).toBe("Sleeved District Heat Network");
		});
		
		it("saves updated form data to correct store object automatically", async () => {
			store.$patch({
				spaceHeating: {
					heatNetworks: {
						data: [sleevedDistrictHeatNetwork, communalHeatNetworkWithoutBooster],
					},
				},
			});
		
			await renderSuspended(HeatNetworks, {
				route: {
					params: { "heatNetwork": "1" },
				},
			});
		
			await user.click(screen.getByTestId("typeOfHeatNetwork_unsleevedDistrictHeatNetwork"));
			await user.tab();
		
			const actualHeatNetwork = store.spaceHeating.heatNetworks.data[1]!;
			expect(actualHeatNetwork.data.name).toBe("Communal Heat Network without Booster");
			expect(actualHeatNetwork.data.typeOfHeatNetwork).toBe("unsleevedDistrictHeatNetwork");
		});

		test("marks section as not complete after editing an existing item", async () => {
			store.$patch({
				spaceHeating: {
					heatNetworks: {
						data: [sleevedDistrictHeatNetwork],
						complete: true,
					},
				},
			});
		
			await renderSuspended(HeatNetworks, {
				route: { params: { "heatNetwork": "0" } },
			});
		
			await user.type(screen.getByTestId("name"), " Changed Heat Network Name");
			await user.tab();
		
			expect(store.spaceHeating.heatNetworks.complete).toBe(false);
		});

		test("does not clear selected product when type of heat network changes", async () => {
			store.$patch({
				spaceHeating: {
					heatNetworks: {
						data: [sleevedDistrictHeatNetwork],
					},
				},
			});
	
			await renderSuspended(HeatNetworks, {
				route: {
					params: { "heatNetwork": "create" },
				},
			});
	
			await user.click(screen.getByTestId("typeOfHeatNetwork_communalHeatNetwork"));
	
			expect(store.spaceHeating.heatNetworks.data[0]?.data.productReference).toBe("42");
		});
	});
});
