import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import WaterStorage from "./index.vue";
import { v4 as uuidv4 } from "uuid";
import { litre } from "~/utils/units/volume";
import { unitValue } from "~/utils/units";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

vi.mock("uuid");

describe("water storage", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const heatPumpId = "463c94f6-566c-49b2-af27-57e5c68b5c30";

	const hotWaterCylinder: EcaasForm<HotWaterCylinderDataNew> = {
		data: {
			name: "Hot water cylinder 1",
			id: "c84528bb-f805-4f1e-95d3-2bd1717deca1",
			typeOfWaterStorage: "hotWaterCylinder",
			storageCylinderVolume: unitValue(5, litre),
			initialTemperature: 60,
			dailyEnergyLoss: 1,
			heatSource: heatPumpId,
			areaOfHeatExchanger: 1000,
			heaterPosition: 0.8,
			thermostatPosition: 0.5,
		},
	};

	// const smartHotWaterTank: EcaasForm<SmartHotWaterTankDataNew> = {
	// 	data: {
	// 		typeOfWaterStorage: "smartHotWaterTank",
	// 		id: "c84528bb-f805-4f1e-95d3-2bd17384fdbe",
	// 		name: "Smart hot water tank 1",
	// 		heatSource: heatPumpId,
	// 		productReference: "1234",
	// 		heaterPosition: 0.8,
	// 		thermostatPosition: 0.5,
	// 	},
	// };
	
	afterEach(() => {
		store.$reset();
	});
	
	const addHeatPumpStoreData = () => {
		store.$patch({
			spaceHeating: {
				heatGeneration: {
					heatPump: {
						data: [{
							data: {
								id: heatPumpId,
								name: "Heat pump",
							},
						}],
					},
				},
			},
		});
	};
	
	const populateValidFormHWC = async () => {
		await user.click(screen.getByTestId("typeOfWaterStorage_hotWaterCylinder"));
		await user.type(screen.getByTestId("name"), "Hot water cylinder 1");
		await user.type(screen.getByTestId("storageCylinderVolume"), "5");
		await user.type(screen.getByTestId("initialTemperature"), "60");
		await user.type(screen.getByTestId("dailyEnergyLoss"), "1");
		await user.click(screen.getByTestId(`heatSource_${heatPumpId}`));
		await user.type(screen.getByTestId("areaOfHeatExchanger"), "1000");
		await user.type(screen.getByTestId("heaterPosition"), "0.8");
		await user.type(screen.getByTestId("thermostatPosition"), "0.5");
		await user.tab();
	};
	
	// const populateValidFormSHWT = async () => {
	// 	await user.click(screen.getByTestId("typeOfWaterStorage_smartHotWaterTank"));
	// 	await user.type(screen.getByTestId("name"), "Smart hot water tank 1");
	// 	await user.click(screen.getByTestId("chooseAProductButton"));
	// 	// await user.click(screen.getByTestId("selectProductButton_0"));
	// 	// Can't do this :( idk why)
	// 	await user.click(screen.getByTestId(`heatSource_${heatPumpId}`));
	// 	await user.type(screen.getByTestId("heaterPosition"), "0.8");
	// 	await user.type(screen.getByTestId("thermostatPosition"), "0.5");
	// 	await user.tab();
	// };
	
	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(WaterStorage, {
			route: {
				params: { "waterStorage": "create" },
			},
		});

		await user.click(screen.getByTestId("saveAndComplete"));

		//shared properties
		expect((await screen.findByTestId("typeOfWaterStorage_error"))).toBeDefined();
		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("heatSource_error"))).toBeDefined();
		expect((await screen.findByTestId("heaterPosition_error"))).toBeDefined();
		expect((await screen.findByTestId("thermostatPosition_error"))).toBeDefined();

		await user.click(screen.getByTestId("typeOfWaterStorage_hotWaterCylinder"));
		await user.click(screen.getByTestId("saveAndComplete"));

		//hot water cylinder specific
		expect((await screen.findByTestId("storageCylinderVolume_error"))).toBeDefined();
		expect((await screen.findByTestId("initialTemperature_error"))).toBeDefined();
		expect((await screen.findByTestId("dailyEnergyLoss_error"))).toBeDefined();
		expect((await screen.findByTestId("areaOfHeatExchanger_error"))).toBeDefined();

		await user.click(screen.getByTestId("typeOfWaterStorage_smartHotWaterTank"));
		await user.click(screen.getByTestId("saveAndComplete"));

		//smart hot water tank specific
		expect((await screen.findByTestId("selectSmartHotWaterTank_error"))).toBeDefined();
	});

	test("navigate to pcdb product select page for smart hot water tank when choose a product button is clicked", async () => {
		await renderSuspended(WaterStorage, {
			route: {
				path: "/domestic-hot-water-new/water-storage/create",
			},
		});

		await user.click(screen.getByTestId("typeOfWaterStorage_smartHotWaterTank"));
		
		const chooseProductButton = await screen.findByTestId<HTMLAnchorElement>("chooseAProductButton");
		expect(chooseProductButton).toBeDefined();
		expect(chooseProductButton.pathname).toContain("/domestic-hot-water-new/water-storage/0/air-source");
	});

	[
		{ 
			type: "hotWaterCylinder",
			populateValidForm: populateValidFormHWC,
			waterStorage: hotWaterCylinder,
		},
		// TODO: we're skipping shwts for now pending James's pcdb stuff
		// { 
		// 	type: "smartHotWaterTank",
		// 	populateValidForm: populateValidFormSHWT,
		// 	waterStorage: smartHotWaterTank,
		// },
	].forEach(({ type, populateValidForm, waterStorage }) => {
		describe(type, () => {
			test("data is saved to store state when form is valid", async () => {
				addHeatPumpStoreData();

				vi.mocked(uuidv4).mockReturnValue(waterStorage.data.id as unknown as Buffer);
				await renderSuspended(WaterStorage, {
					route: {
						params: { "waterStorage": "create" },
					},
				});

				await populateValidForm();
		
				await user.click(screen.getByTestId("saveAndComplete"));

				const { data } = store.domesticHotWaterNew.waterStorage;
		
				expect(data[0]?.data).toEqual(waterStorage.data);
				expect(data[0]?.complete).toEqual(true);
			});

			test("form is prepopulated when data exists in state", async () => {
				store.$patch({
					domesticHotWaterNew: {
						waterStorage: {
							data: [{ ...waterStorage }],
						},
					},
				});

				addHeatPumpStoreData();
				await renderSuspended(WaterStorage, {
					route: {
						params: { "waterStorage": "0" },
					},
				});

				expect(
					(await screen.findByTestId<HTMLInputElement>(`typeOfWaterStorage_${type}`)).value,
				).toBe(type);

				function doExpects() {
					(Object.keys(waterStorage.data))
						.filter(e => e !== "id" && e !== "storageCylinderVolume")
						.forEach(async (key) => {
							expect((await screen.findByTestId<HTMLInputElement>(key)).value)
								.toBe(String((waterStorage.data)[key as (keyof typeof waterStorage.data)]));
						});
				}

				if (type === "smartHotWaterTank") {
					doExpects();
				} else if (type === "hotWaterCylinder") {
					const sCV = hotWaterCylinder.data.storageCylinderVolume;
					expect((await screen.findByTestId<HTMLInputElement>("storageCylinderVolume")).value)
						.toBe(String(typeof sCV === "object" ? sCV.amount : sCV));
					doExpects();
				}
			});


			test("error summary is displayed when an invalid form in submitted", async () => {
				await renderSuspended(WaterStorage);

				await user.click(screen.getByTestId("saveAndComplete"));

				expect((await screen.findByTestId("waterStorageErrorSummary"))).toBeDefined();
			});

			test("navigates to domestic hot water page when valid form is completed", async () => {
				addHeatPumpStoreData();
				await renderSuspended(WaterStorage);

				await populateValidForm();
				await user.click(screen.getByTestId("saveAndComplete"));

				expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water-new");
			});
		});
	});
});