import { expect } from "vitest";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import ElectricShower from "./[shower].vue";
import { v4 as uuidv4 } from "uuid";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

vi.mock("uuid");

describe("electric shower", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const electricShower: EcaasForm<ElectricShowerData> = {
		data: {
			id: "0b77e247-53c5-42b8-9dbd-83cbfc8c8a9e",
			name: "Electric shower 1",
			ratedPower: 10
		},
		complete: true
	};
	const electricShower2: EcaasForm<ElectricShowerData> = {
		data: {
			id: "0b77e247-53c5-42b8-9dbd-83cbfc8c8123",
			name: "Electric shower 2",
			ratedPower: 11
		},
		complete: true
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Electric shower 1");
		await user.type(screen.getByTestId("ratedPower"), "10");
		await user.tab();
	};

	test("data is saved to store state when form is valid", async () => {
		vi.mocked(uuidv4).mockReturnValue(electricShower.data.id as unknown as Buffer);

		await renderSuspended(ElectricShower, {
			route: {
				params: { shower: "create" }
			}
		});

		await populateValidForm();
		await(user.click(screen.getByRole("button", { name: "Save and mark as complete" })));

		const { data } = store.domesticHotWater.hotWaterOutlets.electricShower;
		
		expect(data[0]).toEqual(electricShower);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			domesticHotWater: {
				hotWaterOutlets: {
					electricShower: {
						data: [electricShower]
					}
				}
			}
		});

		await renderSuspended(ElectricShower, {
			route: {
				params: { "shower": "0" }
			}
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Electric shower 1");
		expect((await screen.findByTestId<HTMLInputElement>("ratedPower")).value).toBe("10");
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(ElectricShower);

		await(user.click(screen.getByRole("button", { name: "Save and mark as complete" })));


		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("ratedPower_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(ElectricShower);

		await(user.click(screen.getByRole("button", { name: "Save and mark as complete" })));


		expect((await screen.findByTestId("electricShowerErrorSummary"))).toBeDefined();
	});

	test("form data is automatically saved to store", async () => {

		await renderSuspended(ElectricShower, {
			route: {
				params: { shower: "create" }
			}
		});
		await user.type(screen.getByTestId("name"), "Electric shower 1");
		await user.type(screen.getByTestId("ratedPower"), "17");
		await user.tab();

		const { data } = store.domesticHotWater.hotWaterOutlets.electricShower;
		expect(data[0]!.data.name).toBe("Electric shower 1");
		expect(data[0]!.data.ratedPower).toBe(17);
	});

	test("partial form data automatically saved to store with default name if no name has been added", async () => {
		await renderSuspended(ElectricShower, {
			route: {
				params: { shower: "create" }
			}
		});

		await user.type(screen.getByTestId("ratedPower"), "17");
		await user.tab();
		const { data } = store.domesticHotWater.hotWaterOutlets.electricShower;

		expect(data[0]!.data.name).toBe("Electric shower");
		expect(data[0]!.data.ratedPower).toBe(17);
	});

	test("default name is used if name is added then deleted", async () => {
		await renderSuspended(ElectricShower, {
			route: {
				params: { shower: "create" },
			},
		});
		await user.type(screen.getByTestId("name"), "Elec shower 1");
		await user.clear(screen.getByTestId("name"));
		await user.tab();
		await user.click(screen.getByRole("button", { name: "Save progress" }));

		const { data } = store.domesticHotWater.hotWaterOutlets.electricShower;
	
		expect(data[0]!.data.name).toBe("Electric shower");
	});
	
	test("default name is used if name added is whitespace", async () => {

		await renderSuspended(ElectricShower, {
			route: {
				params: { shower: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), " ");
		await user.click(screen.getByRole("button", { name: "Save progress" }));

		
		expect(store.domesticHotWater.hotWaterOutlets.electricShower.data[0]!.data.name).toBe("Electric shower");

		await renderSuspended(ElectricShower, {
			route: {
				params: { shower: "0" },
			},
		});

		await user.clear(screen.getByTestId("name"));
		await user.type(screen.getByTestId("name"), " ");
		await user.tab();
		
		expect(store.domesticHotWater.hotWaterOutlets.electricShower.data[0]!.data.name).toBe("Electric shower");
	});
	
	test("save progress button navigates user to the hot water outlets overview page", async () => {

		await renderSuspended(ElectricShower, {
			route: {
				params: { shower: "create" }
			}
		});
		await populateValidForm();
		const saveProcess = screen.getByRole("button", { name: "Save progress" });

		expect(saveProcess.getAttribute("href")).toBe("/domestic-hot-water/hot-water-outlets");
	});

	test("creates a new electric shower automatically when a user adds only the name value", async () => {
		await renderSuspended(ElectricShower, {
			route: {
				params: { shower: "create" }
			}
		});

		await user.type(screen.getByTestId("name"), "Electric shower 1");

		await user.tab();
		const { data } = store.domesticHotWater.hotWaterOutlets.electricShower;

		expect(data[0]!.data.name).toBe("Electric shower 1");
		expect(data[0]!.data.ratedPower).toBeUndefined();
	});

	test("updated form data is automatically saved to the correct store object when there are multiple electric shower items added", async () => {
	
		const store = useEcaasStore();
		const user = userEvent.setup();


		store.$patch({
			domesticHotWater: {
				hotWaterOutlets: {
					electricShower: {
						data: [electricShower, electricShower2]
					}
				}
			}
		});    
		await renderSuspended(ElectricShower, {
			route: {
				params: { shower: "1" }
			}
		});
					
		await user.clear(screen.getByTestId("name"));
		await user.clear(screen.getByTestId("ratedPower"));
		
		await user.type(screen.getByTestId("name"), "Updated Electric shower 2");
		await user.type(screen.getByTestId("ratedPower"), "1");
		await user.tab();
		const { data } = store.domesticHotWater.hotWaterOutlets.electricShower;

		expect(data[1]?.data.name).toBe("Updated Electric shower 2");
		expect(data[1]?.data.ratedPower).toBe(1);
		expect(data[1]?.data.id).toBe(electricShower2.data.id);
	});

	it("navigates to hot water outlets page when valid form is completed", async () => {
		await renderSuspended(ElectricShower);
	
		await populateValidForm();
		await(user.click(screen.getByRole("button", { name: "Save and mark as complete" })));

		expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water/hot-water-outlets");
	});
});