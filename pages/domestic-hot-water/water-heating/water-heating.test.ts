import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import WaterHeating from "./index.vue";
import type { HotWaterCylinderData } from "~/stores/ecaasStore.schema";
import { litre } from "~/utils/units/volume";
import { unitValue } from "~/utils/units/types";
import { v4 as uuidv4 } from "uuid";

vi.mock("uuid");

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});


describe("water heating (hot water cylinder)", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const cylinder: HotWaterCylinderData = {
		id: "Any Id",
		heatSource: "test-heat-pump",
		storageCylinderVolume: unitValue(150, litre),
		dailyEnergyLoss: 73,
		name: "Hot water cylinder 1"
	};

	const populateValidForm = async () => {
		await user.click(screen.getByTestId("waterHeaterType_hotWaterCylinder"));
		await user.type(screen.getByTestId("name"), cylinder.name);
		await user.click(screen.getByTestId("heatSource_" + cylinder.heatSource));
		await user.type(screen.getByTestId("storageCylinderVolume"), "150");
		await user.type(screen.getByTestId("dailyEnergyLoss"), cylinder.dailyEnergyLoss.toString());
		await user.tab();
	};

	beforeEach(() => {
		store.$patch({
			heatingSystems: {
				heatGeneration: {
					heatPump: {
						data: [{
							data: {
								id: "test-heat-pump",
								name: "Test Heat Pump"
							}
						}],
						complete: true
					},
				}
			}
		});
	});

	afterEach(() => {
		store.$reset();
	});

	test("data is saved to store state when form is valid", async () => {
		vi.mocked(uuidv4).mockReturnValue("test-id" as unknown as Buffer);
		await renderSuspended(WaterHeating);
		await populateValidForm();	

		await(user.click(screen.getByRole("button", { name: "Save and mark as complete" })));

		const actual = store.domesticHotWater.waterHeating.hotWaterCylinder.data[0]!;

		expect(actual.id).toBe("test-id");
		expect(actual.heatSource).toEqual(cylinder.heatSource);
		expect(actual.storageCylinderVolume).toEqual(cylinder.storageCylinderVolume);
		expect(actual.dailyEnergyLoss).toEqual(cylinder.dailyEnergyLoss);
		expect(actual.name).toEqual(cylinder.name);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			domesticHotWater: {
				waterHeating: {
					hotWaterCylinder: {
						data: [cylinder],
						complete: true
					}
				}
			}
		});

		await renderSuspended(WaterHeating);

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe(cylinder.name);
		expect((await screen.findByTestId<HTMLInputElement>("storageCylinderVolume")).value).toBe("150");
		expect((await screen.findByTestId<HTMLInputElement>("dailyEnergyLoss")).value).toBe(cylinder.dailyEnergyLoss.toString());
		expect((await screen.findByTestId("heatSource_test-heat-pump")).hasAttribute("checked")).toBe(true);
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(WaterHeating);

		await(user.click(screen.getByRole("button", { name: "Save and mark as complete" })));


		expect((await screen.findByTestId("waterHeaterType_error"))).toBeDefined();
		expect((await screen.findByTestId("name_error"))).toBeDefined();
	});

	test("required error messages are displayed when empty hot water cylinder fields are submitted", async () => {
		await renderSuspended(WaterHeating);

		await user.click(screen.getByTestId("waterHeaterType_hotWaterCylinder"));
		await(user.click(screen.getByRole("button", { name: "Save and mark as complete" })));


		expect((await screen.findByTestId("storageCylinderVolume_error"))).toBeDefined();
		expect((await screen.findByTestId("dailyEnergyLoss_error"))).toBeDefined();
		expect((await screen.findByTestId("heatSource_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(WaterHeating);

		await(user.click(screen.getByRole("button", { name: "Save and mark as complete" })));

		expect((await screen.findByTestId("waterHeatingErrorSummary"))).toBeDefined();
	});

	test("completes water heating when valid form is completed", async () => {
		await renderSuspended(WaterHeating);
		
		await populateValidForm();
		await(user.click(screen.getByRole("button", { name: "Save and mark as complete" })));

		expect(store.domesticHotWater.waterHeating.combiBoiler.complete).toBeTruthy();
		expect(store.domesticHotWater.waterHeating.heatBattery.complete).toBeTruthy();
		expect(store.domesticHotWater.waterHeating.heatInterfaceUnit.complete).toBeTruthy();
		expect(store.domesticHotWater.waterHeating.heatPump.complete).toBeTruthy();
		expect(store.domesticHotWater.waterHeating.hotWaterCylinder.complete).toBeTruthy();
		expect(store.domesticHotWater.waterHeating.immersionHeater.complete).toBeTruthy();
		expect(store.domesticHotWater.waterHeating.pointOfUse.complete).toBeTruthy();
		expect(store.domesticHotWater.waterHeating.smartHotWaterTank.complete).toBeTruthy();
		expect(store.domesticHotWater.waterHeating.solarThermal.complete).toBeTruthy();
	});

	test("form data is automatically saved to store", async () => {
		vi.mocked(uuidv4).mockReturnValue("test-id" as unknown as Buffer);

		await renderSuspended(WaterHeating);
		await user.click(screen.getByTestId("waterHeaterType_hotWaterCylinder"));
		await user.type(screen.getByTestId("name"), cylinder.name);
		await user.click(
			screen.getByTestId("heatSource_test-heat-pump")
		);
		await user.tab();
	
		expect(
			store.domesticHotWater.waterHeating.hotWaterCylinder.data[0]!.name
		).toBe("Hot water cylinder 1");
		expect(
			store.domesticHotWater.waterHeating.hotWaterCylinder.data[0]!.heatSource
		).toBe("test-heat-pump");
		expect(
			store.domesticHotWater.waterHeating.hotWaterCylinder.data[0]!.id
		).toBe("test-id");
	});
	test("partial form data automatically saved to store with default name if no name has been added", async () => {

		await renderSuspended(WaterHeating);
		
		await user.click(screen.getByTestId("waterHeaterType_hotWaterCylinder"));
		await user.tab();
		const { data } = store.domesticHotWater.waterHeating.hotWaterCylinder;
	
		expect(data[0]!.name).toBe("Hot water cylinder");

	});

	test("default name is used if name is added then deleted", async () => {

		store.$patch({
			domesticHotWater: {
				waterHeating: {
					hotWaterCylinder: {
						data: [cylinder],
						complete: true
					}
				}
			}
		});
		await renderSuspended(WaterHeating);
		
		await user.type(screen.getByTestId("name"), cylinder.name);
		await user.clear(screen.getByTestId("name"));
		await user.tab();
		await user.click(screen.getByRole("button", { name: "Save progress" }));

		const { data } = store.domesticHotWater.waterHeating.hotWaterCylinder;
	
		expect(data[0]!.name).toBe("Hot water cylinder");
	});

	test("default name is used if name added is whitespace", async () => {
	
		await renderSuspended(WaterHeating);
	
		await user.type(screen.getByTestId("name"), " ");
		await user.click(screen.getByRole("button", { name: "Save progress" }));
	
			
		expect(store.domesticHotWater.waterHeating.hotWaterCylinder.data[0]?.name).toBe("Hot water cylinder");
	
		await renderSuspended(WaterHeating);
	
		await user.clear(screen.getByTestId("name"));
		await user.type(screen.getByTestId("name"), " ");
		await user.tab();
			
		expect(store.domesticHotWater.waterHeating.hotWaterCylinder.data[0]?.name).toBe("Hot water cylinder");

	});
	
	test("save progress button navigates user to the pipework overview page", async () => {
		await renderSuspended(WaterHeating);
		await populateValidForm();

		const saveProcess = screen.getByRole("button", { name: "Save progress" });

		expect(saveProcess.getAttribute("href")).toBe("/domestic-hot-water");
	});
});