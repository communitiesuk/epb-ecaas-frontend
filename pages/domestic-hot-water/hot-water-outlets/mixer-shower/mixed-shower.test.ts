import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import MixerShower from "./[shower].vue";
import { v4 as uuidv4 } from "uuid";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

vi.mock("uuid");

const store = useEcaasStore();
const user = userEvent.setup();

const mixerShower: EcaasForm<MixedShowerData> = {
	data: {
		id: "4a93532e-a370-4015-9778-854661bf1627",
		name: "Mixer shower 1",
		flowRate: 10
	},
	complete: true
};
const mixerShower2: EcaasForm<MixedShowerData> = {
	data: {
		id: "4a93532e-a370-4015-9778-854661bf1123",
		name: "Mixer shower 2",
		flowRate: 11
	},
	complete: true
};
afterEach(() => {
	store.$reset();
});

const populateValidForm = async () => {
	await user.type(screen.getByTestId("name"), "Mixer shower 1");
	await user.type(screen.getByTestId("flowRate"), "10");
	await user.tab();
};
describe("mixer shower", () => {

	test("data is saved to store state when form is valid", async () => {
		vi.mocked(uuidv4).mockReturnValue(mixerShower.data.id as unknown as Buffer);

		await renderSuspended(MixerShower, {
			route: {
				params: { "shower": "create" }
			}
		});

		await populateValidForm();
		await(user.click(screen.getByTestId("saveAndComplete")));

		const { data } = store.domesticHotWater.hotWaterOutlets.mixedShower;
		
		expect(data[0]).toEqual(mixerShower);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			domesticHotWater: {
				hotWaterOutlets: {
					mixedShower: {
						data: [mixerShower]
					}
				}
			}
		});

		await renderSuspended(MixerShower, {
			route: {
				params: { "shower": "0" }
			}
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Mixer shower 1");
		expect((await screen.findByTestId<HTMLInputElement>("flowRate")).value).toBe("10");
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(MixerShower);

		await(user.click(screen.getByTestId("saveAndComplete")));


		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("flowRate_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(MixerShower);

		await(user.click(screen.getByTestId("saveAndComplete")));


		expect((await screen.findByTestId("mixedShowerErrorSummary"))).toBeDefined();
	});

	test("save progress button href is correct", async () => {
		await renderSuspended(MixerShower, {
			route: {
				params: { shower: "create" }
			}
		});

		await populateValidForm();

		await user.click(screen.getByTestId("saveProgress"));
		expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water/hot-water-outlets");
	});

	it("navigates to hot water outlets page when valid form is completed", async () => {
		await renderSuspended(MixerShower);
	
		await populateValidForm();
		await(user.click(screen.getByTestId("saveAndComplete")));


		expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water/hot-water-outlets");
	});
});

describe("Partially saving data", () => {
	test("form data is automatically saved to store", async () => {
		await renderSuspended(MixerShower, {
			route: {
				params: { shower: "create" }
			}
		});

		await user.type(screen.getByTestId("name"), "Mixer shower 1");
		await user.type(screen.getByTestId("flowRate"), "10");
		await user.tab();

		const { data } = store.domesticHotWater.hotWaterOutlets.mixedShower;
		expect(data[0]?.data.name).toBe("Mixer shower 1");
		expect(data[0]?.data.flowRate).toBe(10);
	});

	test("partial form data is saved with default name when name is missing", async () => {
		await renderSuspended(MixerShower, {
			route: {
				params: { shower: "create" }
			}
		});

		await user.type(screen.getByTestId("flowRate"), "9");
		await user.tab();

		const { data } = store.domesticHotWater.hotWaterOutlets.mixedShower;
		expect(data[0]?.data.name).toBe("Mixer shower");
		expect(data[0]?.data.flowRate).toBe(9);
	});
	test("creates a new mixed shower entry when only name is entered", async () => {
		await renderSuspended(MixerShower, {
			route: {
				params: { shower: "create" }
			}
		});

		await user.type(screen.getByTestId("name"), "Mixer shower 1");
		await user.tab();

		const { data } = store.domesticHotWater.hotWaterOutlets.mixedShower;
		expect(data[0]?.data.name).toBe("Mixer shower 1");
		expect(data[0]?.data.flowRate).toBeUndefined();
	});


	test("default name is used if name is added then deleted", async () => {
		store.$patch({
			domesticHotWater: {
				hotWaterOutlets: {
					mixedShower: {
						data: [mixerShower]
					}
				}
			}
		});

		await renderSuspended(MixerShower, {
			route: {
				params: { "shower": "0" }
			}
		});

		await user.type(screen.getByTestId("name"), "Mixer shower 1");
		await user.clear(screen.getByTestId("name"));
		await user.click(screen.getByTestId("saveProgress"));

		const { data } = store.domesticHotWater.hotWaterOutlets.mixedShower;
	
		expect(data[0]!.data.name).toBe("Mixer shower");
	});

	test("default name is used if name added is whitespace", async () => {
	
		await renderSuspended(MixerShower, {
			route: {
				params: { shower: "create" },
			},
		});
	
		await user.type(screen.getByTestId("name"), " ");
		await user.click(screen.getByTestId("saveProgress"));
	
			
		expect(store.domesticHotWater.hotWaterOutlets.mixedShower.data[0]!.data.name).toBe("Mixer shower");
	
		await renderSuspended(MixerShower, {
			route: {
				params: { shower: "0" },
			},
		});
	
		await user.clear(screen.getByTestId("name"));
		await user.type(screen.getByTestId("name"), " ");
		await user.tab();
			
		expect(store.domesticHotWater.hotWaterOutlets.mixedShower.data[0]!.data.name).toBe("Mixer shower");
	});
	test("updated form data is saved to correct object when multiple mixed showers exist", async () => {
		store.$patch({
			domesticHotWater: {
				hotWaterOutlets: {
					mixedShower: {
						data: [mixerShower, mixerShower2]
					}
				}
			}
		});

		await renderSuspended(MixerShower, {
			route: {
				params: { shower: "1" }
			}
		});

		await user.clear(screen.getByTestId("name"));
		await user.clear(screen.getByTestId("flowRate"));

		await user.type(screen.getByTestId("name"), "Updated Shower 2");
		await user.type(screen.getByTestId("flowRate"), "15");
		await user.tab();

		const { data } = store.domesticHotWater.hotWaterOutlets.mixedShower;
		expect(data[1]?.data.name).toBe("Updated Shower 2");
		expect(data[1]?.data.flowRate).toBe(15);
		expect(data[1]?.data.id).toBe(mixerShower2.data.id);
	});

});
