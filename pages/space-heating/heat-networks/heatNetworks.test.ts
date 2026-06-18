import HeatNetworks from "./[heatNetworks].vue";
import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("Heat Networks", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
    
	afterEach(() => {
		store.$reset();
	});

	const heatNetwork: HeatNetworkData = {
		id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8f",
		name: "Heat Network",
		productReference: "SLEEVED_DISTRICT_HEAT_NETWORK",
		typeOfHeatNetwork: "sleevedDistrictHeatNetwork",
		subHeatNetworkName: "Sub Heat Network Name",
	};

	const populateValidForm = async () => {
		await user.click(screen.getByTestId("typeOfHeatNetwork_sleevedDistrictHeatNetwork"));
		await user.tab();
	};

	test("heat network data is saved to store state when form is valid", async () => {
		await renderSuspended(HeatNetworks, {
			route: {
				params: { "heatNetwork": "create" },
			},
		});

		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));
        
		const { data } = store.spaceHeating.heatNetworks;
        
		expect(data[0]?.data).toEqual(heatNetwork);
	});

	// test("heat network form is prepopulated when data exists in state", async () => {
	// 	store.$patch({
	// 		spaceHeating: {
	// 			heatNetworks: {
	// 				data: [{ data: heatNetwork }],
	// 			},
	// 		},
	// 	});
    
	// 	await renderSuspended(HeatNetworks, {
	// 		route: {
	// 			params: { "heatNetwork": "0" },
	// 		},
	// 	});
        
	// 	expect(screen.getByDisplayValue("Heat Network 1")).toBeDefined();
	// 	expect((await screen.findByTestId("typeOfHeatNetwork_sleevedDistrictHeatNetwork")).hasAttribute("checked")).toBe(true);
	// });
    
	// test("required error messages are displayed when empty heat network form is submitted", async () => {
	// 	await renderSuspended(HeatNetworks, {
	// 		route: {
	// 			params: { "heatNetwork": "create" },
	// 		},
	// 	});
    
	// 	await user.click(screen.getByTestId("saveAndComplete"));
    
	// 	expect((await screen.findByTestId("typeOfHeatNetwork_error"))).toBeDefined();
	// });
    
	// test("error summary is displayed when an invalid heat network form is submitted", async () => {
	// 	await renderSuspended(HeatNetworks, {
	// 		route: {
	// 			params: { "heatNetwork": "create" },
	// 		},
	// 	});
    
	// 	await user.click(screen.getByTestId("saveAndComplete"));
    
	// 	expect((await screen.findByTestId("heatNetworksErrorSummary"))).toBeDefined();
	// });
    
	// describe("partially saving data", () => {
	// 	test("updated heat network form data is automatically saved to store ", async () => {
	// 		store.$patch({
	// 			spaceHeating: {
	// 				heatNetworks: { data: [{ data: heatNetwork }] },
	// 			},
	// 		});
    
	// 		await renderSuspended(HeatNetworks, {
	// 			route: {
	// 				params: { "heatNetwork": "0" },
	// 			},
	// 		});
	// 		await user.click(screen.getByTestId("typeOfHeatNetwork_sleevedDistrictHeatNetwork"));
	// 		await user.tab();
    
	// 		expect(store.spaceHeating.heatNetworks.data[0]?.data.name).toBe("Heat Network");
	// 		expect(store.spaceHeating.heatNetworks.data[0]?.data.typeOfHeatNetwork).toBe("sleevedDistrictHeatNetwork");
	// 	});
	// });
});