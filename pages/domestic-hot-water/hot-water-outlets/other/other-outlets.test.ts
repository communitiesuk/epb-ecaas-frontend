import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import OtherOutlet from "./[outlet].vue";
import { v4 as uuidv4 } from "uuid";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

vi.mock("uuid");

const store = useEcaasStore();
const user = userEvent.setup();

const outlet: EcaasForm<OtherHotWaterOutletData> = {
	data: {
		id: "0b77e247-53c5-42b8-9dbd-83cbfc8c8a9e",
		name: "Basin tap 1",
		flowRate: 10,
	},
	complete: true,
};

const outlet2: EcaasForm<OtherHotWaterOutletData> = {
	data: {
		id: "0b77e247-53c5-42b8-9dbd-83cbfc8c8123",
		name: "Basin tap 2",
		flowRate: 11,
	},
	complete: true,
};

afterEach(() => {
	store.$reset();
});

const populateValidForm = async () => {
	await user.type(screen.getByTestId("name"), "Basin tap 1");
	await user.type(screen.getByTestId("flowRate"), "10");
	await user.tab();
};
describe("other outlets", () => {

	test("data is saved to store state when form is valid", async () => {
		vi.mocked(uuidv4).mockReturnValue(outlet.data.id as unknown as Buffer);

		await renderSuspended(OtherOutlet, {
			route: {
				params: { outlet: "create" },
			},
		});

		await populateValidForm();
		await(user.click(screen.getByTestId("saveAndComplete")));


		const { data } = store.domesticHotWater.hotWaterOutlets.otherOutlets;
		
		expect(data[0]).toEqual(outlet);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			domesticHotWater: {
				hotWaterOutlets: {
					otherOutlets: {
						data: [outlet],
					},
				},
			},
		});

		await renderSuspended(OtherOutlet, {
			route: {
				params: { outlet: "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Basin tap 1");
		expect((await screen.findByTestId<HTMLInputElement>("flowRate")).value).toBe("10");
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(OtherOutlet);

		await(user.click(screen.getByTestId("saveAndComplete")));


		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("flowRate_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(OtherOutlet);

		await(user.click(screen.getByTestId("saveAndComplete")));


		expect((await screen.findByTestId("otherOutletsErrorSummary"))).toBeDefined();
	});

	test("save progress button navigates user to the hot water outlets overview page", async () => {
	
		await renderSuspended(OtherOutlet, {
			route: {
				params: { outlet: "create" },
			},
		});
	
		await populateValidForm();
		await user.click(screen.getByTestId("saveProgress"));
	
		expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water/hot-water-outlets");
	});
		
	test("navigates to hot water outlets page when valid form is completed", async () => {
		await renderSuspended(OtherOutlet);
	
		await populateValidForm();
		await(user.click(screen.getByTestId("saveAndComplete")));

		expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water/hot-water-outlets");
	});
});

describe("Partially saving data", () => {
	test("form data is automatically saved to store", async () => {
	
		await renderSuspended(OtherOutlet, {
			route: {
				params: { outlet: "create" },
			},
		});
	
		await user.type(screen.getByTestId("name"), "Other outlet 1");
		await user.type(screen.getByTestId("flowRate"), "17");
		await user.tab();
	
		const { data } = store.domesticHotWater.hotWaterOutlets.otherOutlets;
		expect(data[0]!.data.name).toBe("Other outlet 1");
		expect(data[0]!.data.flowRate).toBe(17);
	});
	
	test("partial form data automatically saved to store with default name if no name has been added", async () => {
		await renderSuspended(OtherOutlet, {
			route: {
				params: { outlet: "create" },
			},
		});
	
		await user.type(screen.getByTestId("flowRate"), "17");
		await user.tab();
		const { data } = store.domesticHotWater.hotWaterOutlets.otherOutlets;
	
		expect(data[0]!.data.name).toBe("Other outlet");
		expect(data[0]!.data.flowRate).toBe(17);
	});

	test("default name is used if name is added then deleted", async () => {
		await renderSuspended(OtherOutlet, {
			route: {
				params: { outlet: "create" },
			},
		});
		await user.type(screen.getByTestId("name"), "Other outlet 1");
		await user.clear(screen.getByTestId("name"));
		await user.tab();
		await user.click(screen.getByTestId("saveProgress"));

		const { data } = store.domesticHotWater.hotWaterOutlets.otherOutlets;
	
		expect(data[0]!.data.name).toBe("Other outlet");
	});
	
	test("default name is used if name added is whitespace", async () => {

		await renderSuspended(OtherOutlet, {
			route: {
				params: { outlet: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), " ");
		await user.click(screen.getByTestId("saveProgress"));

		
		expect(store.domesticHotWater.hotWaterOutlets.otherOutlets.data[0]!.data.name).toBe("Other outlet");

		await renderSuspended(OtherOutlet, {
			route: {
				params: { outlet: "0" },
			},
		});

		await user.clear(screen.getByTestId("name"));
		await user.type(screen.getByTestId("name"), " ");
		await user.tab();
		
		expect(store.domesticHotWater.hotWaterOutlets.otherOutlets.data[0]!.data.name).toBe("Other outlet");
	});

	test("creates a new 'other' item automatically when a user adds only the name value", async () => {
		await renderSuspended(OtherOutlet, {
			route: {
				params: { outlet: "create" },
			},
		});
	
		await user.type(screen.getByTestId("name"), "Other outlet 1");
	
		await user.tab();
		const { data } = store.domesticHotWater.hotWaterOutlets.otherOutlets;
	
		expect(data[0]!.data.name).toBe("Other outlet 1");
		expect(data[0]!.data.flowRate).toBeUndefined();
	});
	
	test("updated form data is automatically saved to the correct store object when there are multiple 'other' items added", async () => {
		
		const store = useEcaasStore();
		const user = userEvent.setup();
	
	
		store.$patch({
			domesticHotWater: {
				hotWaterOutlets: {
					otherOutlets: {
						data: [outlet, outlet2],
					},
				},
			},
		});    
		await renderSuspended(OtherOutlet, {
			route: {
				params: { outlet: "1" },
			},
		});
	
						
		await user.clear(screen.getByTestId("name"));
		await user.clear(screen.getByTestId("flowRate"));
			
		await user.type(screen.getByTestId("name"), "Updated Other outlet 2");
		await user.type(screen.getByTestId("flowRate"), "1");
		await user.tab();
		const { data } = store.domesticHotWater.hotWaterOutlets.otherOutlets;
	
		expect(data[1]?.data.name).toBe("Updated Other outlet 2");
		expect(data[1]?.data.flowRate).toBe(1);
		expect(data[1]?.data.id).toBe(outlet2.data.id);
	});
});
