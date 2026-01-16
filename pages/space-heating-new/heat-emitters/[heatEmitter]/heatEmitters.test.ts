import { renderSuspended } from "@nuxt/test-utils/runtime";
import HeatEmitterForm from "./index.vue";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
describe("Heat emitters", () => { 
	const user = userEvent.setup();
	describe("Radiator", () => {
		const store = useEcaasStore();
		afterEach(() => {
			store.$reset();
		});
		test("Radiator section displays when radiator is selected",async() => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_radiator"));

			expect(screen.getByTestId("typeOfRadiator"));
		});
		test("Expected fields render when type of radiator is selected",async() => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_radiator"));

			expect(screen.queryByTestId("name")).toBeNull();
			expect(screen.queryByTestId("selectRadiator")).toBeNull();
			expect(screen.queryByTestId("heatSource")).toBeNull();
			expect(screen.queryByTestId("ecoDesignControllerClass")).toBeNull();
			expect(screen.queryByTestId("designFlowTemp")).toBeNull();
			expect(screen.queryByTestId("minFlowTemp")).toBeNull();
			expect(screen.queryByTestId("designTempDiffAcrossEmitters")).toBeNull();
			expect(screen.queryByTestId("hasVariableFlowRate")).toBeNull();
			expect(screen.queryByTestId("numOfRadiators")).toBeNull();

			await user.click(screen.getByTestId("typeOfRadiator_standard"));

			expect(screen.getByTestId("name")).toBeDefined();
			expect(screen.getByTestId("selectRadiator")).toBeDefined();
			expect(screen.getByTestId("heatSource")).toBeDefined();
			expect(screen.getByTestId("ecoDesignControllerClass")).toBeDefined();
			expect(screen.getByTestId("designFlowTemp")).toBeDefined();
			expect(screen.getByTestId("minFlowTemp")).toBeDefined();
			expect(screen.getByTestId("designTempDiffAcrossEmitters")).toBeDefined();
			expect(screen.getByTestId("hasVariableFlowRate")).toBeDefined();
			expect(screen.getByTestId("numOfRadiators")).toBeDefined();
		});
		test("Min/Max flow rate options shows when variable flow rate is yes", async () => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_radiator"));
			await user.click(screen.getByTestId("typeOfRadiator_standard"));

			expect(screen.queryByTestId("minFlowRate")).toBeNull();
			expect(screen.queryByTestId("maxFlowRate")).toBeNull();

			await user.click(screen.getByTestId("hasVariableFlowRate_yes"));

			expect(screen.getByTestId("minFlowRate")).toBeDefined();
			expect(screen.getByTestId("maxFlowRate")).toBeDefined();
		});
		test("Design flow rate option shows when variable flow rate is no", async () => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_radiator"));
			await user.click(screen.getByTestId("typeOfRadiator_standard"));

			expect(screen.queryByTestId("designFlowRate")).toBeNull();
			
			await user.click(screen.getByTestId("hasVariableFlowRate_no"));
			
			expect(screen.getByTestId("designFlowRate")).toBeDefined();
		});
		test.only("saves valid radiator to store",async() => {
			const validRadiator: HeatEmittingData = {
				id: "1234",
				typeOfHeatEmitter: "radiator",
				typeOfRadiator: "standard",
				name: "Standard radiator",
				productReference: "5678",
				heatSource: "1",
				ecoDesignControllerClass: "1",
				designFlowTemp: 1,
				minFlowTemp: 1,
				designTempDiffAcrossEmitters: 1,
				numOfRadiators: 1,
				hasVariableFlowRate: false,
				designFlowRate: 1,
			};
			// const validInstantElecHeater = {
			// 	id: "1234",
			// 	name: "IEH",
			// 	ratedPower: 1,
			// 	convectionFractionForHeating:1,
			// 	numOfHeatersWithThisSpec: 1
			// }
			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [ { data: { id: "1" } } ],
					},
					heatEmitters: {
						data: [ { data: validRadiator, complete: false } ],
					},
				},
			});
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "0" },
				},
			});

			await user.click(screen.getByTestId("saveAndComplete"));
			
			const radiator = store.spaceHeatingNew.heatEmitters.data[0];
			expect(radiator?.complete).toBe(true);
		});
	});

	describe("Underfloor heating", () => {
		test("Expected fields render when type of underfloor heating is selected",async() => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_underfloorHeating"));

			expect(screen.getByTestId("name")).toBeDefined();
			expect(screen.getByTestId("selectUnderFloorHeating")).toBeDefined();
			expect(screen.getByTestId("heatSource")).toBeDefined();
			expect(screen.getByTestId("ecoDesignControllerClass")).toBeDefined();
			expect(screen.getByTestId("designFlowTemp")).toBeDefined();
			expect(screen.getByTestId("minFlowTemp")).toBeDefined();
			expect(screen.getByTestId("designTempDiffAcrossEmitters")).toBeDefined();
			expect(screen.getByTestId("hasVariableFlowRate")).toBeDefined();
			expect(screen.getByTestId("areaOfUnderfloorHeating")).toBeDefined();
		});
		test("Min/Max flow rate options shows when variable flow rate is yes", async () => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_underfloorHeating"));

			expect(screen.queryByTestId("minFlowRate")).toBeNull();
			expect(screen.queryByTestId("maxFlowRate")).toBeNull();

			await user.click(screen.getByTestId("hasVariableFlowRate_yes"));

			expect(screen.getByTestId("minFlowRate")).toBeDefined();
			expect(screen.getByTestId("maxFlowRate")).toBeDefined();
		});
		test("Design flow rate option shows when variable flow rate is no", async () => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_underfloorHeating"));

			expect(screen.queryByTestId("designFlowRate")).toBeNull();

			await user.click(screen.getByTestId("hasVariableFlowRate_no"));

			expect(screen.getByTestId("designFlowRate")).toBeDefined();
		});
	});

	describe("Fan coil", () => {
		test("Expected fields render when type of fan coil is selected",async() => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_fanCoil"));

			expect(screen.getByTestId("name")).toBeDefined();
			expect(screen.getByTestId("selectFanCoil")).toBeDefined();
			expect(screen.getByTestId("heatSource")).toBeDefined();
			expect(screen.getByTestId("ecoDesignControllerClass")).toBeDefined();
			expect(screen.getByTestId("designFlowTemp")).toBeDefined();
			expect(screen.getByTestId("minFlowTemp")).toBeDefined();
			expect(screen.getByTestId("designTempDiffAcrossEmitters")).toBeDefined();
			expect(screen.getByTestId("hasVariableFlowRate")).toBeDefined();
			expect(screen.getByTestId("numOfFanCoils")).toBeDefined();
		});
		test("Min/Max flow rate options shows when variable flow rate is yes", async () => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_fanCoil"));

			expect(screen.queryByTestId("minFlowRate")).toBeNull();
			expect(screen.queryByTestId("maxFlowRate")).toBeNull();

			await user.click(screen.getByTestId("hasVariableFlowRate_yes"));

			expect(screen.getByTestId("minFlowRate")).toBeDefined();
			expect(screen.getByTestId("maxFlowRate")).toBeDefined();
		});
		test("Design flow rate option shows when variable flow rate is no", async () => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_fanCoil"));

			expect(screen.queryByTestId("designFlowRate")).toBeNull();

			await user.click(screen.getByTestId("hasVariableFlowRate_no"));

			expect(screen.getByTestId("designFlowRate")).toBeDefined();
		});
	});

	describe("Warm air heater", () => {
		test("Expected fields render when type of warm air heater is selected",async() => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_warmAirHeater"));

			expect(screen.getByTestId("name")).toBeDefined();
			expect(screen.getByTestId("heatSource")).toBeDefined();
			expect(screen.getByTestId("designTempDiffAcrossEmitters")).toBeDefined();
			expect(screen.getByTestId("convectionFraction")).toBeDefined();
			expect(screen.getByTestId("numOfWarmAirHeaters")).toBeDefined();
		});
	});
	describe("Instant Electric Heater", () => {
		test("Expected fields render when type of warm air heater is selected",async() => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_instantElectricHeater"));

			expect(screen.getByTestId("name")).toBeDefined();
			expect(screen.getByTestId("convectionFractionForHeating")).toBeDefined();
			expect(screen.getByTestId("ratedPower")).toBeDefined();
			expect(screen.getByTestId("numOfHeatersWithThisSpec")).toBeDefined();
		});
	});
	describe("Electric Storage Heater", () => {
		test("Expected fields render when type of warm air heater is selected",async() => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_electricStorageHeater"));
			expect(screen.getByTestId("name")).toBeDefined();
			expect(screen.getByTestId("selectElectricStorageHeater")).toBeDefined();
			expect(screen.getByTestId("numOfStorageHeaters")).toBeDefined();
		});
	});
});
