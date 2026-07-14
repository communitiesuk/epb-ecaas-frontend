import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import WaterStorage from "./index.vue";
import { v4 as uuidv4 } from "uuid";
import { litre } from "~/utils/units/volume";
import { unitValue } from "~/utils/units";
import { celsius } from "~/utils/units/temperature";

const { mockFetch, navigateToMock } = vi.hoisted(() => ({
	mockFetch: vi.fn(),
	navigateToMock: vi.fn(),
}));

mockNuxtImport("useFetch", () => mockFetch);
mockNuxtImport("navigateTo", () => navigateToMock);

vi.mock("uuid");

describe("water storage", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const heatPumpId = "463c94f6-566c-49b2-af27-57e5c68b5c30";

	const hotWaterCylinder: EcaasForm<HotWaterCylinderData> = {
		data: {
			name: "Standard water cylinder 1",
			id: "c84528bb-f805-4f1e-95d3-2bd1717deca1",
			typeOfWaterStorage: "hotWaterCylinder",
			storageCylinderVolume: unitValue(5, litre),
			dailyEnergyLoss: 1,
			areaOfHeatExchanger: 1000,
			heaterPosition: 0.8,
			thermostatPosition: 0.5,
			coldWaterSource: "mainsWater",
		},
	};

	const smartHotWaterTank: EcaasForm<SmartHotWaterTankData> = {
		data: {
			typeOfWaterStorage: "smartHotWaterTank",
			id: "c84528bb-f805-4f1e-95d3-2bd17384fdbe",
			name: "Smart water cylinder 1",
			productReference: "42",
			heaterPosition: 0.8,
			coldWaterSource: "mainsWater",
		},
	};

	afterEach(() => {
		store.$reset();
		navigateToMock.mockReset();
	});

	const heatPump = {
		data: {
			id: heatPumpId,
			name: "Heat pump",
			isExistingHeatSource: false,
			coldWaterSource: "headerTank",
			heatSourceId: "NEW_HEAT_SOURCE",
			productReference: "1234",
			typeOfHeatPump: "airSource",
			typeOfHeatSource: "heatPump",
			isConnectedToHeatNetwork: false,
			energySupply: "electricity",
			maxFlowTemp: unitValue(30, celsius),
		},
	} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

	const addHeatPumpStoreData = () => {
		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					data: {
						fuelType: ["electricity"],
					},
				},
			},
			domesticHotWater: {
				heatSources: { data: [heatPump] },
			},
		});
	};

	const populateValidFormHWC = async () => {
		await user.click(screen.getByTestId("typeOfWaterStorage_hotWaterCylinder"));
		await user.type(screen.getByTestId("name"), " 1");
		await user.type(screen.getByTestId("storageCylinderVolume"), "5");
		await user.type(screen.getByTestId("dailyEnergyLoss"), "1");
		await user.type(screen.getByTestId("areaOfHeatExchanger"), "1000");
		await user.type(screen.getByTestId("heaterPosition"), "0.8");
		await user.type(screen.getByTestId("thermostatPosition"), "0.5");
		await user.click(screen.getByTestId("coldWaterSource_mainsWater"));
		await user.tab();
	};

	const populateValidFormSHWT = async () => {
		await user.click(screen.getByTestId("typeOfWaterStorage_smartHotWaterTank"));
		await user.type(screen.getByTestId("name"), " 1");
		await user.click(screen.getByTestId("chooseAProductButton"));
		// Have to simulate product selection by directly setting the product reference in the store - the other page won't load in a unit test
		await user.type(screen.getByTestId("heaterPosition"), "0.8");
		await user.click(screen.getByTestId("coldWaterSource_mainsWater"));
		await user.tab();
	};

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(WaterStorage, {
			route: {
				params: { "waterStorage": "create" },
			},
		});

		await user.click(screen.getByTestId("saveAndComplete"));

		//shared properties
		expect((await screen.findByTestId("typeOfWaterStorage_error"))).toBeDefined();

		await user.click(screen.getByTestId("typeOfWaterStorage_hotWaterCylinder"));
		await user.click(screen.getByTestId("saveAndComplete"));

		//hot water cylinder specific
		// not name, this is filled in by default
		// expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("storageCylinderVolume_error"))).toBeDefined();
		expect((await screen.findByTestId("dailyEnergyLoss_error"))).toBeDefined();
		expect((await screen.findByTestId("heaterPosition_error"))).toBeDefined();
		expect((await screen.findByTestId("thermostatPosition_error"))).toBeDefined();

		await user.click(screen.getByTestId("typeOfWaterStorage_smartHotWaterTank"));
		await user.click(screen.getByTestId("saveAndComplete"));

		//smart hot water tank specific
		// not name, this is filled in by default
		// expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("selectSmartHotWaterTank_error"))).toBeDefined();
		expect((await screen.findByTestId("heaterPosition_error"))).toBeDefined();

		expect((await screen.findByTestId("coldWaterSource_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(WaterStorage);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("waterStorageErrorSummary"))).toBeDefined();
	});

	test("includes WWHRS (System A or C) and pre-heated water cylinder in cold water source options", async () => {
		const wwhrsDataA: EcaasForm<WwhrsData> = {
			data: {
				id: "563d2dcd-b407-4a8a-a5d7-a565ef154bb6",
				name: "WWHRS A",
				coldWaterSource: "mainsWater",
				productReference: "1000",
				wwhrsType: "System A",
			},
		};

		const wwhrsDataB: EcaasForm<WwhrsData> = {
			data: {
				id: "6b956eea-a405-497a-a079-e587d426298e",
				name: "WWHRS B",
				coldWaterSource: "mainsWater",
				productReference: "1001",
				wwhrsType: "System B",
			},
		};

		const wwhrsDataC: EcaasForm<WwhrsData> = {
			data: {
				id: "b4210549-ed01-49ac-bcb3-9de4a1c67db8",
				name: "WWHRS C",
				coldWaterSource: "mainsWater",
				productReference: "1002",
				wwhrsType: "System C",
			},
		};

		const preheatedWaterCylinder: EcaasForm<PreheatedWaterCylinderData> = {
			data: {
				name: "Standard water cylinder 1",
				id: "c84528bb-f805-4f1e-95d3-2bd1717deca1",
				typeOfWaterStorage: "hotWaterCylinder",
				storageCylinderVolume: unitValue(5, litre),
				dailyEnergyLoss: 1,
				heaterPosition: 0.8,
				coldWaterSource: "mainsWater",
			},
		};

		store.$patch({
			domesticHotWater: {
				wwhrs: {
					data: [wwhrsDataA, wwhrsDataB, wwhrsDataC],
				},
				preheatedWaterStorage: {
					data: [preheatedWaterCylinder],
				},
			},
		});

		await renderSuspended(WaterStorage);
		await user.click(screen.getByTestId("typeOfWaterStorage_hotWaterCylinder"));

		expect(screen.getByTestId(`coldWaterSource_${wwhrsDataA.data.id}`)).toBeDefined();
		expect(screen.getByTestId(`coldWaterSource_${wwhrsDataC.data.id}`)).toBeDefined();
		expect(screen.queryByTestId(`coldWaterSource_${wwhrsDataB.data.id}`)).toBeNull();
		expect(screen.getByTestId(`coldWaterSource_${preheatedWaterCylinder.data.id}`)).toBeDefined();
	});

	describe("Hot Water Cylinder", () => {
		test("data is saved to store state when form is valid", async () => {
			addHeatPumpStoreData();

			vi.mocked(uuidv4).mockReturnValue(hotWaterCylinder.data.id as unknown as Buffer);
			await renderSuspended(WaterStorage, {
				route: {
					params: { "waterStorage": "create" },
				},
			});

			await populateValidFormHWC();

			await user.click(screen.getByTestId("saveAndComplete"));

			const { data } = store.domesticHotWater.waterStorage;

			expect(data[0]?.data).toEqual(hotWaterCylinder.data);
			expect(data[0]?.complete).toEqual(true);
		});

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				domesticHotWater: {
					waterStorage: {
						data: [{ ...hotWaterCylinder }],
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
				(await screen.findByTestId<HTMLInputElement>(`typeOfWaterStorage_hotWaterCylinder`)).checked,
			).toBe(true);

			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe(hotWaterCylinder.data.name);
			expect((await screen.findByTestId<HTMLInputElement>("storageCylinderVolume")).value).toBe(
				hotWaterCylinder.data.storageCylinderVolume.amount.toString(),
			);
			expect((await screen.findByTestId<HTMLInputElement>("dailyEnergyLoss")).value).toBe(hotWaterCylinder.data.dailyEnergyLoss.toString());
			expect((await screen.findByTestId<HTMLInputElement>("areaOfHeatExchanger")).value).toBe(hotWaterCylinder.data.areaOfHeatExchanger!.toString());
			expect((await screen.findByTestId<HTMLInputElement>("heaterPosition")).value).toBe(hotWaterCylinder.data.heaterPosition.toString());
			expect((await screen.findByTestId<HTMLInputElement>("thermostatPosition")).value).toBe(hotWaterCylinder.data.thermostatPosition.toString());
			expect((await screen.findByTestId<HTMLInputElement>("coldWaterSource_mainsWater")).checked).toBe(true);
		});

		test("navigates to domestic hot water page when valid form is completed", async () => {
			addHeatPumpStoreData();
			await renderSuspended(WaterStorage);

			await populateValidFormHWC();
			await user.click(screen.getByTestId("saveAndComplete"));

			expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water");
		});

		test("name defaults to 'Hot water cylinder' when Hot Water Cylinder is selected'", async () => {
			await renderSuspended(WaterStorage, {
				route: {
					params: { "waterStorage": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfWaterStorage_hotWaterCylinder"));

			expect((await screen.findByTestId<HTMLInputElement>("name")).value)
				.toBe("Standard water cylinder");
		});
	});

	describe("Smart Hot Water Tank", () => {
		test("navigate to pcdb product select page when choose a product button is clicked", async () => {
			await renderSuspended(WaterStorage, {
				route: {
					params: { "waterStorage": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfWaterStorage_smartHotWaterTank"));
			await user.click(screen.getByTestId("chooseAProductButton"));

			expect(navigateToMock).toHaveBeenCalledWith("/0/smart-hot-water-tank");
		});

		test("data is saved to store state when form is valid", async () => {
			addHeatPumpStoreData();

			vi.mocked(uuidv4).mockReturnValue(smartHotWaterTank.data.id as unknown as Buffer);
			await renderSuspended(WaterStorage, {
				route: {
					params: { "waterStorage": "create" },
				},
			});

			await populateValidFormSHWT();
			store.$patch(state => {
				(state.domesticHotWater.waterStorage.data[0]!.data as SmartHotWaterTankData)
					.productReference = "42";
			});

			await renderSuspended(WaterStorage, {
				route: {
					params: { "waterStorage": "0" },
				},
			});

			await user.click(screen.getByTestId("saveAndComplete"));

			const { data } = store.domesticHotWater.waterStorage;

			expect(data[0]?.data).toEqual(smartHotWaterTank.data);
			expect(data[0]?.complete).toEqual(true);
		});

		test("form is prepopulated when data exists in state", async () => {
			mockFetch.mockReturnValue({
				data: ref({
					brandName: "Test",
					modelName: "Large Smart Hot Water Tank",
					modelQualifier: "SHWTLARGE",
				}),
			});

			store.$patch({
				domesticHotWater: {
					waterStorage: {
						data: [{ ...smartHotWaterTank }],
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
				(await screen.findByTestId<HTMLInputElement>(`typeOfWaterStorage_smartHotWaterTank`))
					.checked,
			).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("name")).value)
				.toBe(smartHotWaterTank.data.name);

			expect((await screen.findByTestId("productData_productReference")).textContent)
				.toBe(smartHotWaterTank.data.productReference);

			expect((await screen.findByTestId<HTMLInputElement>("heaterPosition")).value)
				.toBe(smartHotWaterTank.data.heaterPosition.toString());

			expect((await screen.findByTestId<HTMLInputElement>("coldWaterSource_mainsWater")).checked).toBe(true);
		});

		test("navigates to domestic hot water page when valid form is completed", async () => {
			addHeatPumpStoreData();

			await renderSuspended(WaterStorage, {
				route: {
					params: { waterStorage: "create" },
				},
			});

			await populateValidFormSHWT();

			store.$patch(state => {
				(state.domesticHotWater.waterStorage.data[0]!.data as SmartHotWaterTankData)
					.productReference = "42";
			});

			await renderSuspended(WaterStorage, {
				route: {
					params: { waterStorage: "0" },
				},
			});

			navigateToMock.mockClear();

			await user.click(screen.getByTestId("saveAndComplete"));

			expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water");
		});

		test("name defaults to 'Smart water cylinder' when Smart water cylinder is selected'", async () => {
			await renderSuspended(WaterStorage, {
				route: {
					params: { "waterStorage": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfWaterStorage_smartHotWaterTank"));

			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Smart water cylinder");
		});

		test("Renders HEM default product warning when default product is selected", async () => {
			mockFetch.mockReturnValue({
				data: ref({
					brandName: "HEM Default",
					modelName: "Large Smart Hot Water Tank",
					modelQualifier: "SHWTLARGE",
				}),
			});

			store.$patch({
				domesticHotWater: {
					waterStorage: {
						data: [{ ...smartHotWaterTank }],
					},
				},
			});

			addHeatPumpStoreData();
	
			await renderSuspended(WaterStorage, {
				route: {
					params: { "waterstorage": "0" },
				},
			});
	
			expect((await screen.findByTestId("hemDefaultProductWarning"))).toBeDefined();
		});
	});
});