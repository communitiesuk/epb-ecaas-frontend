import { renderSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import HeatEmitterForm from "./index.vue";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

vi.mock("uuid");

describe("Heat emitters", () => {
	const user = userEvent.setup();
	const store = useEcaasStore();
	afterEach(() => {
		store.$reset();
	});
	describe("Radiator", () => {
		test("Radiator section displays when radiator is selected", async () => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_radiator"));

			expect(screen.getByTestId("typeOfRadiator"));
		});
		test("Expected fields render when type of radiator is selected", async () => {
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

		test("the 'Select a product' element navigates user to the products page", async () => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_radiator"));
			await user.click(screen.getByTestId("typeOfRadiator_standard"));

			expect(screen.getByTestId("chooseAProductButton").getAttribute("href")).toBe("/0/radiator");
		});

		const radiator1: HeatEmittingData = {
			id: "1234",
			name: "Radiator 1",
			typeOfHeatEmitter: "radiator",
			typeOfRadiator: "standard",
			productReference: "RAD-SMALL",
			heatSource: "heat-pump-id",
			ecoDesignControllerClass: "1",
			designFlowTemp: 55,
			minFlowTemp: 45,
			designTempDiffAcrossEmitters: 10,
			numOfRadiators: 5,
			hasVariableFlowRate: false,
			designFlowRate: 100,
		};

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				spaceHeatingNew: {
					heatEmitters: {
						data: [{ data: radiator1, complete: true }],
					},
				},
			});

			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "0" },
				},
			});

			expect((await screen.findByTestId("typeOfHeatEmitter_radiator")).hasAttribute("checked"));
			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Radiator 1");
			expect((await screen.findByTestId("typeOfRadiator_standard")).hasAttribute("checked"));
		});

		test("radiator is updated when data with id exists in store", async () => {
			store.$patch({
				spaceHeatingNew: {
					heatEmitters: {
						data: [{ data: radiator1, complete: true }],
					},
				},
			});

			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "0" },
				},
			});

			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), "Updated radiator");
			await user.tab();
			await user.click(screen.getByTestId("saveAndComplete"));

			const { data } = store.spaceHeatingNew.heatEmitters;

			expect(data[0]!.data.id).toBe(radiator1.id);
			expect(data[0]!.data.name).toBe("Updated radiator");
		});

		test("product reference is cleared when heat emitter type changes", async () => {
			store.$patch({
				spaceHeatingNew: {
					heatEmitters: {
						data: [{ data: radiator1, complete: true }],
					},
				},
			});
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "0" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatEmitter_underfloorHeating"));
			// Wait for change to propagate
			const { data } = store.spaceHeatingNew.heatEmitters;
			const emitterItem = data[0]!.data;
			if ("productReference" in emitterItem) {
				expect(emitterItem.productReference).toBeUndefined();
			}
		});
	});

	describe("Underfloor heating", () => {
		test("Expected fields render when type of underfloor heating is selected", async () => {
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
		test("Expected fields render when type of fan coil is selected", async () => {
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
		test("Expected fields render when type of warm air heater is selected", async () => {
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
		test("Expected fields render when type of warm air heater is selected", async () => {
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
		test("Expected fields render when type of warm air heater is selected", async () => {
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

	describe("Default names", () => {
		const store = useEcaasStore();

		beforeEach(() => {
			store.$reset();
		});

		it.each([
			["radiator", "Radiator"],
			["underfloorHeating", "Underfloor heating"],
			["fanCoil", "Fan coil"],
			["warmAirHeater", "Warm air heater"],
			["instantElectricHeater", "Instant electric heater"],
			["electricStorageHeater", "Electric storage heater"],
		])("sets default name when %s type is selected", async (type, expectedName) => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});

			await user.click(screen.getByTestId(`typeOfHeatEmitter_${type}`));
			const actualHeatEmitter = store.spaceHeatingNew.heatEmitters.data[0]!;
			expect(actualHeatEmitter.data.name).toBe(expectedName);
		});

		it.each([
			["standard", "Standard radiator"],
			["towel", "Towel radiator"],
		])("sets default name when radiator type %s is selected", async (type, expectedName) => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatEmitter_radiator"));
			await user.click(screen.getByTestId(`typeOfRadiator_${type}`));

			const actualHeatEmitter = store.spaceHeatingNew.heatEmitters.data[0]!;
			expect(actualHeatEmitter.data.name).toBe(expectedName);
		});
	});

	describe("Validation", () => {
		test("saves valid instant electric heater to store", async () => {
			const validInstantElecHeater: HeatEmittingData = {
				id: "1234",
				name: "IEH",
				typeOfHeatEmitter: "instantElectricHeater",
				ratedPower: 1,
				convectionFractionForHeating: 1,
				numOfHeatersWithThisSpec: 1,
			};
			store.$patch({
				spaceHeatingNew: {
					heatEmitters: {
						data: [{ data: validInstantElecHeater, complete: false }],
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
		test("doesn't save an valid radiator to store", async () => {
			const incompleteRadiator: Partial<HeatEmittingData> = {
				id: "1234",
				typeOfHeatEmitter: "radiator",
				typeOfRadiator: "standard",
				name: "Standard radiator",
			};
			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: { id: "1" } }],
					},
					heatEmitters: {
						data: [{ data: incompleteRadiator, complete: false }],
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
			expect(radiator?.complete).toBe(false);
			expect(screen.getByTestId("selectRadiator_error")).toBeDefined();
			expect(screen.getByTestId("heatSource_error")).toBeDefined();
			expect(screen.getByTestId("ecoDesignControllerClass_error")).toBeDefined();
			expect(screen.getByTestId("designFlowTemp_error")).toBeDefined();
			expect(screen.getByTestId("minFlowTemp_error")).toBeDefined();
			expect(screen.getByTestId("designTempDiffAcrossEmitters_error")).toBeDefined();
			expect(screen.getByTestId("numOfRadiators_error")).toBeDefined();
			expect(screen.getByTestId("hasVariableFlowRate_error")).toBeDefined();
		});
	});

	it("navigates to space heating on clicking Save progress", async () => {
		await renderSuspended(HeatEmitterForm, {
			route: {
				params: { "heatEmitter": "create" },
			},
		});

		await user.click(screen.getByTestId("typeOfHeatEmitter_radiator"));
		await user.click(screen.getByTestId("saveProgress"));

		expect(navigateToMock).toHaveBeenCalledWith("/space-heating-new");
	});

	it("navigates to space heating when valid form is completed", async () => {
		const validInstantElecHeater: HeatEmittingData = {
			id: "1234",
			name: "IEH",
			typeOfHeatEmitter: "instantElectricHeater",
			ratedPower: 1,
			convectionFractionForHeating: 1,
			numOfHeatersWithThisSpec: 1,
		};
		store.$patch({
			spaceHeatingNew: {
				heatEmitters: {
					data: [{ data: validInstantElecHeater, complete: false }],
				},
			},
		});
		await renderSuspended(HeatEmitterForm, {
			route: {
				params: { "heatEmitter": "0" },
			},
		});

		await user.click(screen.getByTestId("saveAndComplete"));

		expect(navigateToMock).toHaveBeenCalledWith("/space-heating-new");
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(HeatEmitterForm, {
			route: {
				params: { "heatEmitter": "create" },
			},
		});
		await user.click(screen.getByTestId("saveAndComplete"));

		expect(await screen.findByTestId("heatEmitterErrorSummary")).toBeDefined();
	});

	test("error summary is removed from display when type of heat emitter is updated", async () => {
		await renderSuspended(HeatEmitterForm, {
			route: {
				params: { "heatEmitter": "create" },
			},
		});
		await user.click(screen.getByTestId("typeOfHeatEmitter_radiator"));
		await user.click(screen.getByTestId("saveAndComplete"));

		expect(screen.queryByTestId("heatEmitterErrorSummary")).not.toBeNull();

		await user.click(screen.getByTestId("typeOfHeatEmitter_underfloorHeating"));
		expect(screen.queryByTestId("heatEmitterErrorSummary")).toBeNull();
	});

	describe("partially saving data", () => {
		it("saves updated form data to store automatically", async () => {
			const validRadiator: HeatEmittingData = {
				id: "1234",
				name: "Radiator 1",
				typeOfHeatEmitter: "radiator",
				typeOfRadiator: "standard",
				productReference: "RAD-SMALL",
				heatSource: "heat-pump-id",
				ecoDesignControllerClass: "1",
				designFlowTemp: 55,
				minFlowTemp: 45,
				designTempDiffAcrossEmitters: 10,
				numOfRadiators: 5,
				hasVariableFlowRate: false,
				designFlowRate: 100,
			};

			store.$patch({
				spaceHeatingNew: {
					heatEmitters: {
						data: [{ data: validRadiator }],
					},
				},
			});

			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "0" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatEmitter_underfloorHeating"));

			const actualHeatEmitter = store.spaceHeatingNew.heatEmitters.data[0]!;
			expect(actualHeatEmitter.data.typeOfHeatEmitter).toBe("underfloorHeating");
			expect(actualHeatEmitter.data.name).toBe("Underfloor heating");
		});
	});

	describe("Section Status", () => {
		const radiator1: HeatEmittingData = {
			id: "1234",
			name: "Radiator 1",
			typeOfHeatEmitter: "radiator",
			typeOfRadiator: "standard",
			productReference: "RAD-SMALL",
			heatSource: "heat-pump-id",
			ecoDesignControllerClass: "1",
			designFlowTemp: 55,
			minFlowTemp: 45,
			designTempDiffAcrossEmitters: 10,
			numOfRadiators: 5,
			hasVariableFlowRate: false,
			designFlowRate: 100,
		};

		test("marks section as not complete after editing an existing item", async () => {
			store.$patch({
				spaceHeatingNew: {
					heatEmitters: {
						data: [{ data: radiator1, complete: true }],
						complete: true,
					},
				},
			});

			await renderSuspended(HeatEmitterForm, {
				route: { params: { "heatEmitter": "0" } },
			});

			await user.type(screen.getByTestId("name"), " Changed");
			await user.tab();

			expect(store.spaceHeatingNew.heatEmitters.complete).toBe(false);
		});
	});
});
