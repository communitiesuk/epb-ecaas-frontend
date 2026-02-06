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
			dhwHeatSourceId: heatPumpId,
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
		},
	} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;
	

	const addHeatPumpStoreData = () => {
		store.$patch({
			domesticHotWaterNew: {
				heatSources: { data: [heatPump] },
			},
		});
	};
	
	const populateValidFormHWC = async () => {
		await user.click(screen.getByTestId("typeOfWaterStorage_hotWaterCylinder"));
		await user.type(screen.getByTestId("name"), "Hot water cylinder 1");
		await user.type(screen.getByTestId("storageCylinderVolume"), "5");
		await user.type(screen.getByTestId("initialTemperature"), "60");
		await user.type(screen.getByTestId("dailyEnergyLoss"), "1");
		await user.click(screen.getByTestId(`dhwHeatSourceId_${heatPumpId}`));
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
		
		await user.click(screen.getByTestId("typeOfWaterStorage_hotWaterCylinder"));
		await user.click(screen.getByTestId("saveAndComplete"));
		
		//hot water cylinder specific
		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("storageCylinderVolume_error"))).toBeDefined();
		expect((await screen.findByTestId("initialTemperature_error"))).toBeDefined();
		expect((await screen.findByTestId("dailyEnergyLoss_error"))).toBeDefined();
		expect((await screen.findByTestId("dhwHeatSourceId_error"))).toBeDefined();
		expect((await screen.findByTestId("areaOfHeatExchanger_error"))).toBeDefined();
		expect((await screen.findByTestId("heaterPosition_error"))).toBeDefined();
		expect((await screen.findByTestId("thermostatPosition_error"))).toBeDefined();

		await user.click(screen.getByTestId("typeOfWaterStorage_smartHotWaterTank"));
		await user.click(screen.getByTestId("saveAndComplete"));

		//smart hot water tank specific
		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("selectSmartHotWaterTank_error"))).toBeDefined();
		expect((await screen.findByTestId("dhwHeatSourceId_error"))).toBeDefined();
		expect((await screen.findByTestId("heaterPosition_error"))).toBeDefined();
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
		expect(chooseProductButton.pathname).toContain("/domestic-hot-water-new/water-storage/0/smart-hot-water-tank");
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

			const { data } = store.domesticHotWaterNew.waterStorage;
		
			expect(data[0]?.data).toEqual(hotWaterCylinder.data);
			expect(data[0]?.complete).toEqual(true);
		});

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				domesticHotWaterNew: {
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
				(await screen.findByTestId<HTMLInputElement>(`typeOfWaterStorage_hotWaterCylinder`)).value,
			).toBe("hotWaterCylinder");

			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe(hotWaterCylinder.data.name);
			if (typeof hotWaterCylinder.data.storageCylinderVolume === "object") {
				expect((await screen.findByTestId<HTMLInputElement>("storageCylinderVolume")).value).toBe(
					hotWaterCylinder.data.storageCylinderVolume.amount.toString());
			} else {
				throw new Error("storageCylinderVolume is not a unit value");
			}
			expect((await screen.findByTestId<HTMLInputElement>("initialTemperature")).value).toBe(hotWaterCylinder.data.initialTemperature.toString());
			expect((await screen.findByTestId<HTMLInputElement>("dailyEnergyLoss")).value).toBe(hotWaterCylinder.data.dailyEnergyLoss.toString());
			expect((await screen.findByTestId<HTMLInputElement>(`dhwHeatSourceId_${heatPumpId}`)).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("areaOfHeatExchanger")).value).toBe(hotWaterCylinder.data.areaOfHeatExchanger.toString());
			expect((await screen.findByTestId<HTMLInputElement>("heaterPosition")).value).toBe(hotWaterCylinder.data.heaterPosition.toString());
			expect((await screen.findByTestId<HTMLInputElement>("thermostatPosition")).value).toBe(hotWaterCylinder.data.thermostatPosition.toString());
		});


		test("error summary is displayed when an invalid form in submitted", async () => {
			await renderSuspended(WaterStorage);

			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("waterStorageErrorSummary"))).toBeDefined();
		});

		test("navigates to domestic hot water page when valid form is completed", async () => {
			addHeatPumpStoreData();
			await renderSuspended(WaterStorage);

			await populateValidFormHWC();
			await user.click(screen.getByTestId("saveAndComplete"));

			expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water-new");
		});
	});
});