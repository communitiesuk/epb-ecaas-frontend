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

	const heatNetwork: EcaasForm<HeatNetworkData> = {
		data: {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8f",
			name: "Heat Network",
			productReference: "42",
			typeOfHeatNetwork: "sleevedDistrictHeatNetwork",
		},
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Heat Network");		
		await user.click(screen.getByTestId("typeOfHeatNetwork_sleevedDistrictHeatNetwork"));
		await user.click(screen.getByTestId("chooseAProductButton"));
		await user.tab();
	};

	test("heat network data is saved to store state when form is valid", async () => {

		vi.mocked(uuidv4).mockReturnValue(heatNetwork.data.id as unknown as Buffer);

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
        
		const { data } = store.spaceHeating.heatNetworks;
		expect(data[0]?.data).toEqual(heatNetwork.data);
		expect(data[0]?.complete).toEqual(true);
	});

	test("heat network form is prepopulated when data exists in state", async () => {
		store.$patch({
			spaceHeating: {
				heatNetworks: {
					data: [heatNetwork],
				},
			},
		});
    
		await renderSuspended(HeatNetworks, {
			route: {
				params: { "heatNetwork": "0" },
			},
		});
		
		expect((await screen.getByTestId<HTMLInputElement>("name")).value).toBe(heatNetwork.data.name);
		expect(
			(await screen.getByTestId<HTMLInputElement>(`typeOfHeatNetwork_sleevedDistrictHeatNetwork`)).checked,
		).toBe(true);
	});

	test("navigates to spaceHeating when a valid form is completed", async () => {
		const heatNetworkProduct: Partial<DisplayProduct> = {
			id: "1000",
			technologyType: "HeatNetworks",
		};
		mockFetch.mockReturnValue({
			data: ref(heatNetworkProduct),
		});
	
		store.$patch({
			spaceHeating: {
				heatSource: {
					data: [heatNetwork],
				},
			},
		});
	
		await renderSuspended(HeatNetworks, {
			route: {
				params: { "heatNetwork": "create" },
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
	
		expect((await screen.findByTestId("chooseAProductButton")).getAttribute("href")).toBe("/0/heat-network");
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
						data: [heatNetwork],
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
			expect(actualHeatNetwork.data.name).toBe("Heat Network");
		});
		
		it("saves updated form data to correct store object automatically", async () => {
			const otherHeatNetwork: EcaasForm<HeatNetworkData> = {
				data: {
					id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8f",
					name: "Other Heat Network",
					productReference: "40",
					typeOfHeatNetwork: "communalHeatNetwork",
				},
			};
			store.$patch({
				spaceHeating: {
					heatNetworks: {
						data: [heatNetwork, otherHeatNetwork],
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
			expect(actualHeatNetwork.data.name).toBe("Other Heat Network");
			expect(actualHeatNetwork.data.typeOfHeatNetwork).toBe("unsleevedDistrictHeatNetwork");
		});

		test("marks section as not complete after editing an existing item", async () => {
			store.$patch({
				spaceHeating: {
					heatNetworks: {
						data: [heatNetwork],
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
						data: [heatNetwork],
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
