import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import HotWaterOutlets from "./index.vue";
import { v4 as uuidv4 } from "uuid";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

vi.mock("uuid");

describe("hot water outlets", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const heatPumpId = "463c94f6-566c-49b2-af27-57e5c68b5c30";

	const mixerShower: EcaasForm<MixedShowerDataNew> = {
		data: {
			name: "Mixer shower 1",
			id: "c84528bb-f805-4f1e-95d3-2bd1717deca1",
			typeOfHotWaterOutlet: "mixedShower",
			flowRate: 10,
			hotWaterSource: heatPumpId,
			wwhrs: false,
		},
	};

	const electricShower: EcaasForm<ElectricShowerDataNew> = {
		data: {
			name: "Electric shower 1",
			id: "c84528bb-f805-4f1e-95d3-2bd1717deca2",
			typeOfHotWaterOutlet: "electricShower",
			ratedPower: 5,
			wwhrs: false,
		},
	};

	const bath: EcaasForm<BathDataNew> = {
		data: {
			name: "Bath 1",
			id: "c84528bb-f805-4f1e-95d3-2bd1717deca3",
			typeOfHotWaterOutlet: "bath",
			size: 150,
		},
	};

	const otherHotWaterOutlet: EcaasForm<OtherHotWaterOutletDataNew> = {
		data: {
			name: "Other hot water outlet 1",
			id: "c84528bb-f805-4f1e-95d3-2bd1717deca4",
			typeOfHotWaterOutlet: "otherHotWaterOutlet",
			flowRate: 8,
		},
	};

	afterEach(() => {
		store.$reset();
	});

	const addHeatPumpStoreData = () => {
		store.$patch({
			domesticHotWaterNew: {
				heatSources: {
					data: [
						{
							data: {
								id: heatPumpId,
								name: "Heat pump 1",
							},
							complete: true,
						},
					],
				},
			},
		});
	};

	const populateValidFormMS = async () => {
		await user.click(screen.getByTestId("typeOfHotWaterOutlet_mixedShower"));
		const nameInput = screen.getByTestId<HTMLInputElement>("name");
		await user.clear(nameInput);
		await user.type(nameInput, "Mixer shower 1");
		await user.click(screen.getByTestId("hotWaterSource_" + heatPumpId));
		await user.type(screen.getByTestId("flowRate"), "10");
		await user.tab();
	};

	const populateValidFormES = async () => {
		await user.click(screen.getByTestId("typeOfHotWaterOutlet_electricShower"));
		const nameInput = screen.getByTestId<HTMLInputElement>("name");
		await user.clear(nameInput);
		await user.type(nameInput, "Electric shower 1");
		await user.type(screen.getByTestId("ratedPower"), "5");
		await user.tab();
	};

	const populateValidFormBath = async () => {
		await user.click(screen.getByTestId("typeOfHotWaterOutlet_bath"));
		const nameInput = screen.getByTestId<HTMLInputElement>("name");
		await user.clear(nameInput);
		await user.type(nameInput, "Bath 1");
		await user.type(screen.getByTestId("size"), "150");
		await user.tab();
	};

	const populateValidFormOHWO = async () => {
		await user.click(screen.getByTestId("typeOfHotWaterOutlet_otherHotWaterOutlet"));
		await user.type(screen.getByTestId("name"), "Other hot water outlet 1");
		await user.type(screen.getByTestId("flowRate"), "8");
		await user.tab();
	};

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(HotWaterOutlets, {
			route: {
				params: { "hotWaterOutlet": "create" },
			},
		});


		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("typeOfHotWaterOutlet_error"))).toBeDefined();



		await user.click(screen.getByTestId("typeOfHotWaterOutlet_mixedShower"));
		await clearName(user);
		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("hotWaterSource_error"))).toBeDefined();
		expect((await screen.findByTestId("flowRate_error"))).toBeDefined();



		await user.click(screen.getByTestId("typeOfHotWaterOutlet_electricShower"));
		await user.click(screen.getByTestId("saveAndComplete"));
		await clearName(user);
		await user.click(screen.getByTestId("saveAndComplete"));
		expect((await screen.findByTestId("ratedPower_error"))).toBeDefined();
		expect((await screen.findByTestId("name_error"))).toBeDefined();

		await user.click(screen.getByTestId("typeOfHotWaterOutlet_bath"));
		await user.click(screen.getByTestId("saveAndComplete"));
		await clearName(user);
		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("size_error"))).toBeDefined();


		await user.click(screen.getByTestId("typeOfHotWaterOutlet_otherHotWaterOutlet"));
		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("flowRate_error"))).toBeDefined();
	});


	//awaiting pcdb merge
	// test("navigate to pcdb product select page for wwhrs when choose a product button is clicked", async () => {
	// 	await renderSuspended(HotWaterOutlets, {
	// 		route: {
	// 			path: "/domestic-hot-water-new/hot-water-outlets/create",
	// 		},
	// 	});

	// 	await user.click(screen.getByTestId("typeOfHotWaterOutlet_electricShower"));

	// 	const chooseProductButton = await screen.findByTestId<HTMLAnchorElement>("chooseAProductButton");
	// 	expect(chooseProductButton).toBeDefined();
	// 	expect(chooseProductButton.pathname).toContain("/domestic-hot-water-new/water-storage/0/air-source");
	// });

	it("navigates to domestic hot water on clicking Save progress", async () => {
		await renderSuspended(HotWaterOutlets, {
			route: {
				params: { "hotWaterOutlet": "create" },
			},
		});

		await user.click(screen.getByTestId("typeOfHotWaterOutlet_mixedShower"));
		const saveProgressButton = screen.getByTestId<HTMLAnchorElement>("saveProgress");

		expect(saveProgressButton.getAttribute("href")).toBe("/domestic-hot-water-new");
	});

	test("hot water outlet is updated when data with id exists in store", async () => {
		store.$patch({
			domesticHotWaterNew: {
				hotWaterOutlets: {
					data: [{ data: { ...mixerShower.data }, complete: true }],
				},
			},
		});

		await renderSuspended(HotWaterOutlets, {
			route: {
				params: { "hotWaterOutlet": "0" },
			},
		});

		await user.clear(screen.getByTestId("name"));
		await user.type(screen.getByTestId("name"), "Updated mixer");
		await user.tab();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.domesticHotWaterNew.hotWaterOutlets;

		expect(data[0]!.data.id).toBe(mixerShower.data.id);
		expect(data[0]!.data.name).toBe("Updated mixer");
	});

	test("error summary is removed from display when type of hot water outlet is updated", async () => {
		await renderSuspended(HotWaterOutlets, {
			route: {
				params: { "hotWaterOutlet": "create" },
			},
		});

		await user.click(screen.getByTestId("saveAndComplete"));
		expect(await screen.findByTestId("hotWaterOutletErrorSummary")).toBeDefined();

		await user.click(screen.getByTestId("typeOfHotWaterOutlet_electricShower"));
		expect(screen.queryByTestId("hotWaterOutletErrorSummary")).toBeNull();
	});

	test("displays list of heat sources when mixer shower is selected from domestic hot water sources", async () => {
		addHeatPumpStoreData();
		await renderSuspended(HotWaterOutlets, {
			route: {
				params: { "hotWaterOutlet": "create" },
			},
		});

		await user.click(screen.getByTestId("typeOfHotWaterOutlet_mixedShower"));

		expect(screen.getByTestId("hotWaterSource_" + heatPumpId)).toBeDefined();
	});

	test("first heat source is autoselected when only one heat source exists", async () => {
		addHeatPumpStoreData();
		await renderSuspended(HotWaterOutlets, {
			route: {
				params: { "hotWaterOutlet": "create" },
			},
		});
		await user.click(screen.getByTestId("typeOfHotWaterOutlet_mixedShower"));
		await user.tab();

		const heatSourceSelect = screen.getByTestId<HTMLInputElement>("hotWaterSource_" + heatPumpId);
		expect(heatSourceSelect.hasAttribute("checked")).toBe(true);
	});


	test("navigate to water storage product selection for wwhrs when choose a product button is clicked", async () => {
		await renderSuspended(HotWaterOutlets, {
			route: {
				params: { "hotWaterOutlet": "create" },
			},
		});

		await user.click(screen.getByTestId("typeOfHotWaterOutlet_electricShower"));

		// toggle WWHRS option if present
		const wwhrsYes = screen.queryByTestId("wwhrs_yes");
		if (wwhrsYes) {
			await user.click(wwhrsYes);
		}

		// select WWHRS type
		await user.click(screen.getByTestId("wwhrsType_instantaneousSystemA"));

		const chooseProductButton = await screen.findByTestId<HTMLAnchorElement>("chooseAProductButton");
		expect(chooseProductButton).toBeDefined();
		expect(chooseProductButton.pathname).toBe("/0/electric-shower");
	});

	[
		{
			type: "mixedShower",
			populateValidForm: populateValidFormMS,
			hotWaterOutlet: mixerShower,
		},
		{
			type: "electricShower",
			populateValidForm: populateValidFormES,
			hotWaterOutlet: electricShower,
		},
		{
			type: "bath",
			populateValidForm: populateValidFormBath,
			hotWaterOutlet: bath,
		},
		{
			type: "otherHotWaterOutlet",
			populateValidForm: populateValidFormOHWO,
			hotWaterOutlet: otherHotWaterOutlet,
		},
	].forEach(({ type, populateValidForm, hotWaterOutlet }) => {
		describe(type, () => {
			beforeEach(() => {
				store.$reset();
			});

			test("data is saved to store state when form is valid", async () => {
				addHeatPumpStoreData();

				vi.mocked(uuidv4).mockReturnValue(hotWaterOutlet.data.id as unknown as Buffer);
				await renderSuspended(HotWaterOutlets, {
					route: {
						params: { "hotWaterOutlet": "create" },
					},
				});

				await populateValidForm();

				await user.click(screen.getByTestId("saveAndComplete"));

				const { data } = store.domesticHotWaterNew.hotWaterOutlets;

				expect(data[0]?.data).toEqual(hotWaterOutlet.data);
				expect(data[0]?.complete).toEqual(true);
			});

			test("form is prepopulated when data exists in state", async () => {
				store.$patch({
					domesticHotWaterNew: {
						hotWaterOutlets: {
							data: [{ data: { ...hotWaterOutlet.data } }],
						},
					},
				});


				addHeatPumpStoreData();
				await renderSuspended(HotWaterOutlets, {
					route: {
						params: { "hotWaterOutlet": "0" },
					},
				});

				expect(
					(await screen.findByTestId<HTMLInputElement>(`typeOfHotWaterOutlet_${type}`)).checked,
				).toBe(true);

				if (type === "mixedShower") {
					expect((await screen.findByTestId<HTMLInputElement>(`hotWaterSource_${heatPumpId}`)).hasAttribute("checked")).toBe(true);
				}

				(Object.keys(hotWaterOutlet.data))
					.filter(e => e !== "id" && e !== "typeOfHotWaterOutlet" && e !== "hotWaterSource" && e !== "wwhrs")
					.forEach(async (key) => {
						expect((await screen.findByTestId<HTMLInputElement>(key)).value)
							.toBe(String((hotWaterOutlet.data)[key as (keyof typeof hotWaterOutlet.data)]));
					});
			});


			test("error summary is displayed when an invalid form in submitted", async () => {
				await renderSuspended(HotWaterOutlets);

				await user.click(screen.getByTestId("saveAndComplete"));

				expect((await screen.findByTestId("hotWaterOutletErrorSummary"))).toBeDefined();
			});

			test("navigates to domestic hot water page when valid form is completed", async () => {
				addHeatPumpStoreData();
				await renderSuspended(HotWaterOutlets);

				await populateValidForm();
				await user.click(screen.getByTestId("saveAndComplete"));

				expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water-new");
			});
		});
	});

	describe("complete status", () => {
		test("marks the hotWaterOutlets section complete status as false when saving a form", async () => {
			store.$patch({
				domesticHotWaterNew: {
					hotWaterOutlets: {
						data: [{ data: { ...mixerShower.data }, complete: true }],
						complete: true,
					},
				},
			});

			addHeatPumpStoreData();
			await renderSuspended(HotWaterOutlets, {
				route: {
					params: { "hotWaterOutlet": "0" },
				},
			});

			expect(store.domesticHotWaterNew.hotWaterOutlets.complete).toBe(true);

			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), "Modified name");
			await user.tab();
			await user.click(screen.getByTestId("saveAndComplete"));

			expect(store.domesticHotWaterNew.hotWaterOutlets.complete).toBe(false);
		});

		test("marks hotWaterOutlets section as not complete after editing an existing item", async () => {
			store.$patch({
				domesticHotWaterNew: {
					hotWaterOutlets: {
						data: [{ data: { ...mixerShower.data }, complete: true }],
						complete: true,
					},
				},
			});

			addHeatPumpStoreData();
			await renderSuspended(HotWaterOutlets, {
				route: { params: { "hotWaterOutlet": "0" } },
			});

			await user.type(screen.getByTestId("name"), " Changed");
			await user.tab();

			expect(store.domesticHotWaterNew.hotWaterOutlets.complete).toBe(false);
		});
	});
});

async function clearName(user: ReturnType<typeof userEvent.setup>) {
	const nameInput = screen.queryByTestId<HTMLInputElement>("name");
	if (nameInput) {
		await user.clear(nameInput);
	}
	return nameInput;
}
