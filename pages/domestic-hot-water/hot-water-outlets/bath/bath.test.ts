import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import Bath from "./[bath].vue";
import { v4 as uuidv4 } from "uuid";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

vi.mock("uuid");

const store = useEcaasStore();
const user = userEvent.setup();

const bath: EcaasForm<BathData> = {
	data: {
		id: "0b77e247-53c5-42b8-9dbd-83cbfc8c8a9e",
		name: "Bath 1",
		size: 170,
		flowRate: 10,
	},
};
const bath2: EcaasForm<BathData> = {
	data: {
		id: "0b77e247-53c5-42b8-9dbd-83cbfc8c8123",
		name: "Bath 2",
		size: 180,
		flowRate: 11,
	},
};

afterEach(() => {
	store.$reset();
});

const populateValidForm = async () => {
	await user.type(screen.getByTestId("name"), "Bath 1");
	await user.type(screen.getByTestId("size"), "170");
	await user.type(screen.getByTestId("flowRate"), "10");
	await user.tab();
};
describe("bath", () => {

	test("data is saved to store state when form is valid", async () => {
		vi.mocked(uuidv4).mockReturnValue(bath.data.id as unknown as Buffer);

		await renderSuspended(Bath, {
			route: {
				params: { bath: "create" },
			},
		});

		await populateValidForm();
		await(user.click(screen.getByTestId("saveAndComplete")));

		const { data } = store.domesticHotWater.hotWaterOutlets.bath;

		expect(data[0]?.data).toEqual(bath.data);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			domesticHotWater: {
				hotWaterOutlets: {
					bath: {
						data: [bath],
					},
				},
			},
		});

		await renderSuspended(Bath, {
			route: {
				params: { "bath": "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Bath 1");
		expect((await screen.findByTestId<HTMLInputElement>("size")).value).toBe("170");
		expect((await screen.findByTestId<HTMLInputElement>("flowRate")).value).toBe("10");
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(Bath);

		await(user.click(screen.getByTestId("saveAndComplete")));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("size_error"))).toBeDefined();
		expect((await screen.findByTestId("flowRate_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(Bath);
		await(user.click(screen.getByTestId("saveAndComplete")));

		expect((await screen.findByTestId("bathErrorSummary"))).toBeDefined();
	});

	test("form data is automatically saved to store", async () => {

		await renderSuspended(Bath, {
			route: {
				params: { bath: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Bath 1");
		await user.type(screen.getByTestId("size"), "170");
		await user.tab();

		const { data } = store.domesticHotWater.hotWaterOutlets.bath;
		expect(data[0]!.data.name).toBe("Bath 1");
		expect(data[0]!.data.size).toBe(170);
	});

	test("partial form data automatically saved to store with default name if no name has been added", async () => {
		await renderSuspended(Bath, {
			route: {
				params: { bath: "create" },
			},
		});

		await user.type(screen.getByTestId("size"), "170");
		await user.tab();
		const { data } = store.domesticHotWater.hotWaterOutlets.bath;

		expect(data[0]!.data.name).toBe("Bath");
		expect(data[0]!.data.size).toBe(170);
	});

	test("default name is used if name is added then deleted", async () => {

		await renderSuspended(Bath, {
			route: {
				params: { bath: "create" },
			},
		});
	
		await user.type(screen.getByTestId("flowRate"), "10"); // set another value on form in order to count as a partial we want to keep
		await user.type(screen.getByTestId("name"), "Bath 1");
		await user.clear(screen.getByTestId("name"));
		await user.tab();
		await user.click(screen.getByTestId("saveProgress"));
		
		const { data } = store.domesticHotWater.hotWaterOutlets.bath;
	
		expect(data[0]!.data.name).toBe("Bath");
	});

	test("default name is used if name added is whitespace", async () => {

		await renderSuspended(Bath, {
			route: {
				params: { bath: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), " ");
		await user.click(screen.getByTestId("saveProgress"));

		
		expect(store.domesticHotWater.hotWaterOutlets.bath.data[0]!.data.name).toBe("Bath");

		await renderSuspended(Bath, {
			route: {
				params: { bath: "0" },
			},
		});

		await user.clear(screen.getByTestId("name"));
		await user.type(screen.getByTestId("name"), " ");
		await user.tab();
		
		expect(store.domesticHotWater.hotWaterOutlets.bath.data[0]!.data.name).toBe("Bath");
	});

	test("save progress button navigates user to the hot water outlets overview page", async () => {

		await renderSuspended(Bath, {
			route: {
				params: { bath: "create" },
			},
		});

		await populateValidForm();
		await user.click(screen.getByTestId("saveProgress"));
		expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water/hot-water-outlets");
	});

	test("creates a new bath automatically when a user adds only the name value", async () => {
		await renderSuspended(Bath, {
			route: {
				params: { bath: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Bath 1");

		await user.tab();
		const { data } = store.domesticHotWater.hotWaterOutlets.bath;

		expect(data[0]!.data.name).toBe("Bath 1");
		expect(data[0]!.data.size).toBeUndefined();
	});

	test("updated form data is automatically saved to the correct store object when there are multiple bath items added", async () => {
	
		const store = useEcaasStore();
		const user = userEvent.setup();


		store.$patch({
			domesticHotWater: {
				hotWaterOutlets: {
					bath: {
						data: [bath, bath2],
					},
				},
			},
		});    
		await renderSuspended(Bath, {
			route: {
				params: { bath: "1" },
			},
		});

					
		await user.clear(screen.getByTestId("name"));
		await user.clear(screen.getByTestId("size"));
		
		await user.type(screen.getByTestId("name"), "Updated bath 2");
		await user.type(screen.getByTestId("size"), "1");
		await user.tab();
		const { data } = store.domesticHotWater.hotWaterOutlets.bath;

		expect(data[1]?.data.name).toBe("Updated bath 2");
		expect(data[1]?.data.size).toBe(1);
		expect(data[1]?.data.id).toBe(bath2.data.id);
	});

	test("navigates to hot water outlets page when valid form is completed", async () => {
		await renderSuspended(Bath);
	
		await populateValidForm();
		await(user.click(screen.getByTestId("saveAndComplete")));

		expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water/hot-water-outlets");
	});
});


describe("Partially saving data", () => {

	test("form data is automatically saved to store", async () => {

		await renderSuspended(Bath, {
			route: {
				params: { bath: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Bath 1");
		await user.type(screen.getByTestId("size"), "170");
		await user.tab();

		const { data } = store.domesticHotWater.hotWaterOutlets.bath;
		expect(data[0]!.data.name).toBe("Bath 1");
		expect(data[0]!.data.size).toBe(170);
	});

	test("partial form data automatically saved to store with default name if no name has been added", async () => {
		await renderSuspended(Bath, {
			route: {
				params: { bath: "create" },
			},
		});

		await user.type(screen.getByTestId("size"), "170");
		await user.tab();
		const { data } = store.domesticHotWater.hotWaterOutlets.bath;

		expect(data[0]!.data.name).toBe("Bath");
		expect(data[0]!.data.size).toBe(170);
	});

	test("default name is used if name added is whitespace", async () => {

		await renderSuspended(Bath, {
			route: {
				params: { bath: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), " ");
		await user.click(screen.getByTestId("saveProgress"));

		
		expect(store.domesticHotWater.hotWaterOutlets.bath.data[0]!.data.name).toBe("Bath");

		await renderSuspended(Bath, {
			route: {
				params: { bath: "0" },
			},
		});

		await user.clear(screen.getByTestId("name"));
		await user.type(screen.getByTestId("name"), " ");
		await user.tab();
		
		expect(store.domesticHotWater.hotWaterOutlets.bath.data[0]!.data.name).toBe("Bath");
	});
	test("creates a new bath automatically when a user adds only the name value", async () => {
		await renderSuspended(Bath, {
			route: {
				params: { bath: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Bath 1");

		await user.tab();
		const { data } = store.domesticHotWater.hotWaterOutlets.bath;

		expect(data[0]!.data.name).toBe("Bath 1");
		expect(data[0]!.data.size).toBeUndefined();
	});

	test("updated form data is automatically saved to the correct store object when there are multiple bath items added", async () => {
	
		const store = useEcaasStore();
		const user = userEvent.setup();


		store.$patch({
			domesticHotWater: {
				hotWaterOutlets: {
					bath: {
						data: [bath, bath2],
					},
				},
			},
		});    
		await renderSuspended(Bath, {
			route: {
				params: { bath: "1" },
			},
		});

					
		await user.clear(screen.getByTestId("name"));
		await user.clear(screen.getByTestId("size"));
		
		await user.type(screen.getByTestId("name"), "Updated bath 2");
		await user.type(screen.getByTestId("size"), "1");
		await user.tab();
		const { data } = store.domesticHotWater.hotWaterOutlets.bath;

		expect(data[1]?.data.name).toBe("Updated bath 2");
		expect(data[1]?.data.size).toBe(1);
		expect(data[1]?.data.id).toBe(bath2.data.id);
	});

	test("navigates to hot water outlets page when valid form is completed", async () => {
		await renderSuspended(Bath);
	
		await populateValidForm();
		await(user.click(screen.getByTestId("saveAndComplete")));

		expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water/hot-water-outlets");
	});  
});

