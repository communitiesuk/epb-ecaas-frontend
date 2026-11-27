import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import { v4 as uuidv4 } from "uuid";
import { unitValue } from "~/utils/units";
import { metresSquare } from "~/utils/units/area.ts";
import { celsius } from "~/utils/units/temperature";
import { litre } from "~/utils/units/volume";
import PreheatedWaterStorage from "./index.vue";

const { mockFetch, navigateToMock } = vi.hoisted(() => ({
	mockFetch: vi.fn(),
	navigateToMock: vi.fn(),
}));

mockNuxtImport("useFetch", () => mockFetch);
mockNuxtImport("navigateTo", () => navigateToMock);

vi.mock("uuid");

describe("preheated water storage", () => {
	let store: ReturnType<typeof useEcaasStore>;

	beforeEach(() => {
		store = useEcaasStore();
	});

	const user = userEvent.setup();

	const heatPumpId = "463c94f6-566c-49b2-af27-57e5c68b5c30";

	const preheatedWaterCylinder: EcaasForm<Extract<PreheatedWaterStorageData, { typeOfWaterStorage: "hotWaterCylinder" }>> = {
		data: {
			name: "Standard water cylinder 1",
			id: "c84528bb-f805-4f1e-95d3-2bd1717deca1",
			typeOfWaterStorage: "hotWaterCylinder",
			storageCylinderVolume: unitValue(5, litre),
			dailyEnergyLoss: 1,
			heaterPosition: 0.8,
			thermostatPosition: 0.5,
			coldWaterSource: "mainsWater",
			heatSourceId: heatPumpId,
			areaOfHeatExchangerInPcdb: false,
			areaOfHeatExchanger: unitValue(1, metresSquare),
		},
	};

	const preheatedSmartWaterTank: EcaasForm<Extract<PreheatedWaterStorageData, { typeOfWaterStorage: "smartHotWaterTank" }>> = {
		data: {
			name: "Smart preheated water tank",
			id: "e832d282-1297-4ab8-bfc9-702fd70167ba",
			typeOfWaterStorage: "smartHotWaterTank",
			productReference: "42",
			heaterPosition: 0.8,
			coldWaterSource: "mainsWater",
			heatSourceId: heatPumpId,
		},
	};

	afterEach(() => {
		store.$reset();
	});

	const heatPump = {
		data: {
			id: heatPumpId,
			name: "Heat pump",
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
			productReference: "1234",
			typeOfHeatPump: "airSource",
			typeOfHeatSource: "heatPump",
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
		await user.click(screen.getByTestId(`heatSourceId_${heatPumpId}`));
		await user.type(screen.getByTestId("areaOfHeatExchanger"), "1");
		await user.type(screen.getByTestId("heaterPosition"), "0.8");
		await user.type(screen.getByTestId("thermostatPosition"), "0.5");
		await user.click(screen.getByTestId("coldWaterSource_mainsWater"));
		await user.tab();
	};

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(PreheatedWaterStorage);
		await user.click(screen.getByTestId("typeOfWaterStorage_hotWaterCylinder"));

		await user.click(screen.getByTestId("saveAndComplete"));

		// standard water cylinder specific
		expect((await screen.findByTestId("storageCylinderVolume_error"))).toBeDefined();
		expect((await screen.findByTestId("dailyEnergyLoss_error"))).toBeDefined();
		expect((await screen.findByTestId("heaterPosition_error"))).toBeDefined();
		expect((await screen.findByTestId("coldWaterSource_error"))).toBeDefined();
		expect((await screen.findByTestId("thermostatPosition_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(PreheatedWaterStorage);

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

		store.$patch({
			domesticHotWater: {
				wwhrs: {
					data: [wwhrsDataA, wwhrsDataB, wwhrsDataC],
				},
				preheatedWaterStorage: {
					data: [{ ...preheatedWaterCylinder }],
				},
			},
		});

		await renderSuspended(PreheatedWaterStorage);
		await user.click(screen.getByTestId("typeOfWaterStorage_hotWaterCylinder"));

		expect(screen.getByTestId(`coldWaterSource_${wwhrsDataA.data.id}`)).toBeDefined();
		expect(screen.getByTestId(`coldWaterSource_${wwhrsDataC.data.id}`)).toBeDefined();
		expect(screen.queryByTestId(`coldWaterSource_${wwhrsDataB.data.id}`)).toBeNull();
		expect(screen.queryByTestId(`coldWaterSource_${preheatedWaterCylinder.data.id}`)).toBeNull();
	});

	test("point of use and combi boilers are excluded from heat source field", async () => {
		const pointOfUse: NewDomesticHotWaterHeatSourceData = {
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
			id: "bb5769e2-cc25-4e88-b922-7deba5793b68",
			typeOfHeatSource: "pointOfUse",
			name: "Point of use",
			coldWaterSource: "mainsWater",
		};

		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [{ data: pointOfUse }],
				},
			},
		});

		await renderSuspended(PreheatedWaterStorage);

		expect(screen.queryByTestId(`heatSourceId_${pointOfUse.id}`)).toBeNull();
	});

	test("data is saved to store state when form is valid", async () => {
		addHeatPumpStoreData();

		vi.mocked(uuidv4).mockReturnValue(preheatedWaterCylinder.data.id as unknown as Buffer);
		await renderSuspended(PreheatedWaterStorage);

		await populateValidFormHWC();

		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.domesticHotWater.preheatedWaterStorage;

		expect(data[0]?.data).toEqual(preheatedWaterCylinder.data);
		expect(data[0]?.complete).toEqual(true);
	});

	test("smart hot water tank data is saved to store state", async () => {
		mockFetch.mockReturnValue({
			data: ref({
				brandName: "Test",
				modelName: "Smart preheated water tank",
				modelQualifier: "SMART-PREHEATED",
			}),
		});
		store.$patch({
			domesticHotWater: {
				preheatedWaterStorage: {
					data: [{ ...preheatedSmartWaterTank }],
				},
			},
		});
		addHeatPumpStoreData();

		await renderSuspended(PreheatedWaterStorage);
		expect(screen.queryByTestId("dailyEnergyLoss")).toBeNull();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.domesticHotWater.preheatedWaterStorage;
		expect(data[0]?.data).toEqual(preheatedSmartWaterTank.data);
		expect(data[0]?.complete).toBe(true);
	});

	test("opens smart tank product selection under the preheated storage route", async () => {
		await renderSuspended(PreheatedWaterStorage, {
			route: "/domestic-hot-water/preheated-water-storage",
		});
		await user.click(screen.getByTestId("typeOfWaterStorage_smartHotWaterTank"));
		await user.click(screen.getByTestId("chooseAProductButton"));

		expect(navigateToMock).toHaveBeenCalledWith(
			"/domestic-hot-water/preheated-water-storage/0/smart-hot-water-tank",
		);
		expect(store.domesticHotWater.preheatedWaterStorage.data[0]?.data.typeOfWaterStorage).toBe("smartHotWaterTank");
	});

	test("selected smart tank details use the preheated storage route", async () => {
		mockFetch.mockReturnValue({
			data: ref({ brandName: "Test", modelName: "Smart tank", modelQualifier: "SMART" }),
		});
		store.$patch({
			domesticHotWater: {
				preheatedWaterStorage: { data: [{ ...preheatedSmartWaterTank }] },
			},
		});
		await renderSuspended(PreheatedWaterStorage, {
			route: "/domestic-hot-water/preheated-water-storage",
		});

		expect((await screen.findByRole("link", { name: "More details" })).getAttribute("href")).toBe(
			"/domestic-hot-water/preheated-water-storage/0/smart-hot-water-tank/42/details",
		);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			domesticHotWater: {
				preheatedWaterStorage: {
					data: [{ ...preheatedWaterCylinder }],
				},
			},
		});

		addHeatPumpStoreData();
		await renderSuspended(PreheatedWaterStorage);
		await user.click(screen.getByTestId("typeOfWaterStorage_hotWaterCylinder"));
		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe(preheatedWaterCylinder.data.name);
		expect((await screen.findByTestId<HTMLInputElement>("storageCylinderVolume")).value).toBe(
			preheatedWaterCylinder.data.storageCylinderVolume.amount.toString(),
		);
		expect((await screen.findByTestId<HTMLInputElement>("dailyEnergyLoss")).value).toBe(preheatedWaterCylinder.data.dailyEnergyLoss.toString());
		expect((await screen.findByTestId<HTMLInputElement>("heaterPosition")).value).toBe(preheatedWaterCylinder.data.heaterPosition.toString());
		expect((await screen.findByTestId<HTMLInputElement>("thermostatPosition")).value).toBe(preheatedWaterCylinder.data.thermostatPosition.toString());
	});

	test("area of heat exchanger field is hidden when the value is available from the PCDB", async () => {
		store.$patch({
			domesticHotWater: {
				preheatedWaterStorage: {
					data: [{
						...preheatedWaterCylinder,
						data: {
							...preheatedWaterCylinder.data,
							areaOfHeatExchangerInPcdb: true,
						},
					}],
				},
			},
		});

		addHeatPumpStoreData();
		await renderSuspended(PreheatedWaterStorage);

		expect(screen.queryByTestId("areaOfHeatExchanger")).toBeNull();
	});

	test("navigates to domestic hot water page when valid form is completed", async () => {
		addHeatPumpStoreData();
		await renderSuspended(PreheatedWaterStorage);

		await populateValidFormHWC();
		await user.click(screen.getByTestId("saveAndComplete"));

		expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water");
	});

	test("name defaults to 'Standard water cylinder' when Standard water cylinder is selected'", async () => {
		store.$reset();
		await renderSuspended(PreheatedWaterStorage);
		await user.click(screen.getByTestId("typeOfWaterStorage_hotWaterCylinder"));
		expect((await screen.findByTestId<HTMLInputElement>("name")).value)
			.toBe("Standard water cylinder");
	});
	describe("Validation", () => {
		describe("Thermostat position validation", () => {
			async function renderWithThermostatPosition(value: string) {
				await renderSuspended(PreheatedWaterStorage);
				await user.click(screen.getByTestId("typeOfWaterStorage_hotWaterCylinder"));
				await user.type(screen.getByTestId("thermostatPosition"), value);
				await user.tab();
			}

			test("Thermostat position is is valid between 0 and 1", async () => {
				await renderWithThermostatPosition("0.5");
				expect((await screen.findByTestId<HTMLInputElement>("thermostatPosition")).value).toBe("0.5");
				const error = screen.queryByTestId("thermostatPosition_error");
				expect(error).toBeNull();
			});
			test("Thermostat position can be 0", async () => {
				await renderWithThermostatPosition("0");
				expect((await screen.findByTestId<HTMLInputElement>("thermostatPosition")).value).toBe("0");
				const error = screen.queryByTestId("thermostatPosition_error");
				expect(error).toBeNull();
			});
			test("Thermostat position can be 1", async () => {
				await renderWithThermostatPosition("1");
				expect((await screen.findByTestId<HTMLInputElement>("thermostatPosition")).value).toBe("1");
				const error = screen.queryByTestId("thermostatPosition_error");
				expect(error).toBeNull();
			});
			test("Thermostat position cannot be less than 0", async () => {
				await renderWithThermostatPosition("-0.1");
				const error = screen.getByTestId("thermostatPosition_error");
				expect(error?.innerText).toContain("Error: Thermostat position in the cylinder must be at least 0.");
			});
			test("Thermostat position cannot be greater than 1", async () => {
				await renderWithThermostatPosition("1.1");
				const error = screen.getByTestId("thermostatPosition_error");
				expect(error?.innerText).toContain("Error: Thermostat position in the cylinder must be no more than 1.");
			});
		});
	});
});