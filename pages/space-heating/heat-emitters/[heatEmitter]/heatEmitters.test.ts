import { renderSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import HeatEmitterForm from "./index.vue";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";

const { navigateToMock, mockFetch } = vi.hoisted(() => ({
	navigateToMock: vi.fn(),
	mockFetch: vi.fn(),
}));
mockNuxtImport("navigateTo", () => navigateToMock);
mockNuxtImport("useFetch", () => mockFetch);

vi.mock("uuid");
const wetDistributionSystem: HeatEmittingData = {
	id: "1234",
	name: "Wet Distribution System 1",
	typeOfHeatEmitter: "wetDistributionSystem",
	heatSource: "heat-pump-id",
	ecoDesignControllerClass: "1",
	designFlowTemp: 55,
	designTempDiffAcrossEmitters: 10,
	hasVariableFlowRate: false,
	designFlowRate: 100,
	percentageRecirculated: 20,
	emitters: [],
};
describe("Heat emitters", () => {
	const user = userEvent.setup();
	const store = useEcaasStore();
	beforeEach(() => {
		mockFetch.mockReturnValue({
			data: ref({ id: "1000", brandName: "Test", modelName: "Fan coil", technologyType: "FanCoils" }),
		});
	});
	afterEach(() => {
		store.$reset();
		mockFetch.mockReset();
	});
	describe("Wet distribution system", () => {
		test("Wet distribution system section displays when wet distribution system is selected", async () => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_wetDistributionSystem"));

			expect(screen.getByTestId("name")).toBeDefined();
		});
		test("Expected fields render when type of wet distribution system is selected", async () => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});

			expect(screen.queryByTestId("name")).toBeNull();
			expect(screen.queryByTestId("heatSource")).toBeNull();
			expect(screen.queryByTestId("ecoDesignControllerClass")).toBeNull();
			expect(screen.queryByTestId("designFlowTemp")).toBeNull();
			expect(screen.queryByTestId("minFlowTemp")).toBeNull();
			expect(screen.queryByTestId("designTempDiffAcrossEmitters")).toBeNull();
			expect(screen.queryByTestId("hasVariableFlowRate")).toBeNull();

			await user.click(screen.getByTestId("typeOfHeatEmitter_wetDistributionSystem"));

			expect(screen.getByTestId("name")).toBeDefined();
			expect(screen.getByTestId("heatSource")).toBeDefined();
			expect(screen.getByTestId("ecoDesignControllerClass")).toBeDefined();
			expect(screen.getByTestId("designFlowTemp")).toBeDefined();
			expect(screen.getByTestId("designTempDiffAcrossEmitters")).toBeDefined();
			expect(screen.getByTestId("hasVariableFlowRate")).toBeDefined();
		});

		test.each([
			["1", false],
			["2", true],
			["3", true],
			["4", false],
			["5", false],
			["6", true],
			["7", true],
			["8", false],
		])("When Eco design controller class is %s, min flow temp & min/max outdoor temp displayed is %b", async (num, expectToBeDisplayed) => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_wetDistributionSystem"));

			expect(screen.queryByTestId("minFlowTemp")).toBeNull();
			expect(screen.queryByTestId("minOutdoorTemp")).toBeNull();
			expect(screen.queryByTestId("maxOutdoorTemp")).toBeNull();

			const selectBox = screen.getByRole("combobox");
			await user.selectOptions(selectBox, num);
			if (expectToBeDisplayed) {
				expect(screen.getByTestId("minFlowTemp")).toBeDefined();
				expect(screen.getByTestId("minOutdoorTemp")).toBeDefined();
				expect(screen.getByTestId("maxOutdoorTemp")).toBeDefined();
			} else {
				expect(screen.queryByTestId("minFlowTemp")).toBeNull();
				expect(screen.queryByTestId("minOutdoorTemp")).toBeNull();
				expect(screen.queryByTestId("maxOutdoorTemp")).toBeNull();
			}
		});

		test("Min/Max flow rate options shows when variable flow rate is yes", async () => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_wetDistributionSystem"));

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
			await user.click(screen.getByTestId("typeOfHeatEmitter_wetDistributionSystem"));

			expect(screen.queryByTestId("designFlowRate")).toBeNull();

			await user.click(screen.getByTestId("hasVariableFlowRate_no"));

			expect(screen.getByTestId("designFlowRate")).toBeDefined();
		});





		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [{ data: wetDistributionSystem, complete: true }],
					},
				},
			});

			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "0" },
				},
			});

			expect((await screen.findByTestId("typeOfHeatEmitter_wetDistributionSystem")).hasAttribute("checked"));
			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Wet Distribution System 1");
		});

		test("wet distribution system is updated when data with id exists in store", async () => {
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [{ data: wetDistributionSystem, complete: true }],
					},
				},
			});

			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "0" },
				},
			});

			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), "Updated Wet Distribution System");
			await user.tab();
			await user.click(screen.getByTestId("saveAndComplete"));

			const { data } = store.spaceHeating.heatEmitters;

			expect(data[0]!.data.id).toBe(wetDistributionSystem.id);
			expect(data[0]!.data.name).toBe("Updated Wet Distribution System");
		});

		describe("With Emitters", () => {
			test("emitters section renders", async () => {
				store.$patch({
					spaceHeating: {
						heatEmitters: {
							data: [{
								data: {
									...wetDistributionSystem,
									emitters: [],
								},
							}],
						},
					},

				});
				await renderSuspended(HeatEmitterForm, {
					route: {
						params: { "heatEmitter": "0" },
					},
				});
				expect(screen.getByTestId("emittersSection")).toBeDefined();
			});
			test("can add a radiator as an emitter", async () => {
				store.$patch({
					spaceHeating: {
						heatEmitters: {
							data: [{
								data: {
									...wetDistributionSystem,
									emitters: [],
								},
							}],
						},
					},
				});
				await renderSuspended(HeatEmitterForm, {
					route: {
						params: { "heatEmitter": "0" },
					},
				});
				await user.click(screen.getByTestId("typeOfHeatEmitter_radiator"));
				const system = store.spaceHeating.heatEmitters.data[0]!.data as WetDistributionSystemData;
				if ("emitters" in system) {
					expect(system.emitters.length).toBe(1);
					expect(system.emitters[0]?.typeOfHeatEmitter).toBe("radiator");
				} else {
					throw new Error("Emitters field is missing in heat emitter data");
				}
			});
			test("can add a fan coil as an emitter", async () => {
				store.$patch({
					spaceHeating: {
						heatEmitters: {
							data: [{
								data: {
									...wetDistributionSystem,
									emitters: [],
								},
							}],
						},
					},
				});
				await renderSuspended(HeatEmitterForm, {
					route: {
						params: { "heatEmitter": "0" },
					},
				});
				await user.click(screen.getByTestId("typeOfHeatEmitter_fanCoil"));
				const system = store.spaceHeating.heatEmitters.data[0]!.data as WetDistributionSystemData;
				if ("emitters" in system) {
					expect(system.emitters.length).toBe(1);
					expect(system.emitters[0]?.typeOfHeatEmitter).toBe("fanCoil");
				} else {
					throw new Error("Emitters field is missing in heat emitter data");
				}
			});
			test.skip("can add an underfloor heating as an emitter", async () => {
				// skipped because underfloor heating is currently unavailable, but test will be re-enabled when the feature is added
				store.$patch({
					spaceHeating: {
						heatEmitters: {
							data: [{
								data: {
									...wetDistributionSystem,
									emitters: [],
								},
							}],
						},
					},
				});
				await renderSuspended(HeatEmitterForm, {
					route: {
						params: { "heatEmitter": "0" },
					},
				});
				await user.click(screen.getByTestId("typeOfHeatEmitter_underfloorHeating"));
				const system = store.spaceHeating.heatEmitters.data[0]!.data as WetDistributionSystemData;
				if ("emitters" in system) {
					expect(system.emitters.length).toBe(1);
					expect(system.emitters[0]?.typeOfHeatEmitter).toBe("underfloorHeating");
				} else {
					throw new Error("Emitters field is missing in heat emitter data");
				}
			});
			test("cancel removes a newly added emitter", async () => {
				store.$patch({
					spaceHeating: {
						heatEmitters: {
							data: [{
								data: {
									...wetDistributionSystem,
									emitters: [],
								},
							}],
						},
					},
				});
				await renderSuspended(HeatEmitterForm, {
					route: {
						params: { "heatEmitter": "0" },
					},
				});
				await user.click(screen.getByTestId("typeOfHeatEmitter_radiator"));
				expect(await screen.findByText("Add emitter")).toBeDefined();
				await user.click(screen.getByTestId("emitter_cancel_0"));

				const system = store.spaceHeating.heatEmitters.data[0]!.data as WetDistributionSystemData;
				if ("emitters" in system) {
					expect(system.emitters.length).toBe(0);
				} else {
					throw new Error("Emitters field is missing in heat emitter data");
				}
			});
			test("renders existing emitters with correct data", async () => {
				const wetDistributionSystemWithEmitters: HeatEmittingData = {
					...wetDistributionSystem,
					emitters: [
						{
							id: "emitter1",
							name: "Emitter 1",
							typeOfHeatEmitter: "radiator",
							numOfRadiators: 2,
						},
						{
							id: "emitter2",
							name: "Emitter 2",
							typeOfHeatEmitter: "fanCoil",
							numOfFanCoils: 3,
						},
					],
				};

				store.$patch({
					spaceHeating: {
						heatEmitters: {
							data: [{ data: wetDistributionSystemWithEmitters, complete: true }],
						},
					},
				});

				await renderSuspended(HeatEmitterForm, {
					route: {
						params: { "heatEmitter": "0" },
					},
				});

				expect(screen.getByTestId("emitter-emitter1")).toBeDefined();
				expect(screen.getByTestId("emitter-emitter2")).toBeDefined();
			});
			test("emitters are rendered on the page", async () => {
				const wetDistributionSystemWithEmitters: HeatEmittingData = {
					...wetDistributionSystem,
					emitters: [
						{
							id: "emitter1",
							name: "Emitter 1",
							typeOfHeatEmitter: "radiator",
							numOfRadiators: 2,
						},
						{
							id: "emitter2",
							name: "Emitter 2",
							typeOfHeatEmitter: "fanCoil",
							numOfFanCoils: 3,
						},
					],
				};

				store.$patch({
					spaceHeating: {
						heatEmitters: {
							data: [{ data: wetDistributionSystemWithEmitters, complete: true }],
						},
					},

				});
				await renderSuspended(HeatEmitterForm, {
					route: {
						params: { "heatEmitter": "0" },
					},
				});
				expect(screen.getByTestId("emitter-emitter1")).toBeDefined();
				expect(screen.getByTestId("emitter-emitter2")).toBeDefined();
			});
			test("radiators have expected fields", async () => {
				const wetDistributionSystemWithRadiatorEmitter: HeatEmittingData = {
					...wetDistributionSystem,
					emitters: [
						{
							id: "emitter1",
							name: "Emitter 1",
							typeOfHeatEmitter: "radiator",
							productReference: "1000",
						},
					],
				};

				store.$patch({
					spaceHeating: {
						heatEmitters: {
							data: [{ data: wetDistributionSystemWithRadiatorEmitter, complete: true }],
						},
					},
				});
				await renderSuspended(HeatEmitterForm, {
					route: {
						params: { "heatEmitter": "0" },
					},
				});
				await user.click(screen.getByTestId("emitter_edit_0"));
				expect(screen.getByTestId("numOfRadiators_0")).toBeDefined();
				expect(screen.getByTestId("length_0")).toBeDefined();
				await user.type(screen.getByTestId("numOfRadiators_0"), "2");
				await user.type(screen.getByTestId("length_0"), "1.5");
				await user.tab();
				await user.click(screen.getByTestId("saveEmitter_0"));
				const system = store.spaceHeating.heatEmitters.data[0]!.data as WetDistributionSystemData;
				if ("emitters" in system) {
					const emitter = system.emitters[0]!;
					expect(emitter.typeOfHeatEmitter).toBe("radiator");
					expect((emitter as { numOfRadiators: number }).numOfRadiators).toBe(2);
					expect((emitter as { length: number }).length).toBe(1.5);
				} else {
					throw new Error("Emitters field is missing in heat emitter data");
				}
			});
			test("summary card displays radiator info after saving", async () => {
				const wetDistributionSystemWithRadiatorEmitter: HeatEmittingData = {
					...wetDistributionSystem,
					emitters: [
						{
							id: "emitter1",
							name: "My radiator",
							typeOfHeatEmitter: "radiator",
							productReference: "1000",
						},
					],
				};

				store.$patch({
					spaceHeating: {
						heatEmitters: {
							data: [{ data: wetDistributionSystemWithRadiatorEmitter, complete: true }],
						},
					},
				});
				await renderSuspended(HeatEmitterForm, {
					route: {
						params: { "heatEmitter": "0" },
					},
				});
				await user.click(screen.getByTestId("emitter_edit_0"));
				await user.type(screen.getByTestId("numOfRadiators_0"), "2");
				await user.type(screen.getByTestId("length_0"), "1.5");
				await user.tab();
				await user.click(screen.getByTestId("saveEmitter_0"));

				const summaryCard = screen.getByTestId("emitter-emitter1");
				expect(summaryCard.querySelector(".govuk-summary-card__title")?.textContent).toContain("My radiator");
				expect(screen.getByTestId("summary-emitter-0-type-of-emitter").textContent).toContain("Radiator");
				expect(screen.getByTestId("summary-emitter-0-radiator-product").textContent).toContain("Test");
				expect(screen.getByTestId("summary-emitter-0-radiator-product").textContent).toContain("Fan coil");
				expect(screen.getByTestId("summary-emitter-0-length").textContent).toContain("1.5 m");
				expect(screen.getByTestId("summary-emitter-0-number-of-radiators").textContent).toContain("2");
			});
			test("fan coils have expected fields", async () => {
				const wetDistributionSystemWithFanCoilEmitter: HeatEmittingData = {
					...wetDistributionSystem,
					emitters: [
						{
							id: "emitter1",
							name: "Emitter 1",
							typeOfHeatEmitter: "fanCoil",
							productReference: "1000",
						},
					],
				};

				store.$patch({
					spaceHeating: {
						heatEmitters: {
							data: [{ data: wetDistributionSystemWithFanCoilEmitter, complete: true }],
						},
					},
				});
				await renderSuspended(HeatEmitterForm, {
					route: {
						params: { "heatEmitter": "0" },
					},
				});
				await user.click(screen.getByTestId("emitter_edit_0"));
				expect(screen.getByTestId("numOfFanCoils_0")).toBeDefined();
				await user.type(screen.getByTestId("numOfFanCoils_0"), "3");
				await user.tab();
				await user.click(screen.getByTestId("saveEmitter_0"));
				const system = store.spaceHeating.heatEmitters.data[0]!.data as WetDistributionSystemData;
				if ("emitters" in system) {
					const emitter = system.emitters[0]!;
					expect(emitter.typeOfHeatEmitter).toBe("fanCoil");
					expect((emitter as { numOfFanCoils: number }).numOfFanCoils).toBe(3);
				} else {
					throw new Error("Emitters field is missing in heat emitter data");
				}
			});
			test("summary card displays fan coil info after saving", async () => {
				const wetDistributionSystemWithFanCoilEmitter: HeatEmittingData = {
					...wetDistributionSystem,
					emitters: [
						{
							id: "emitter1",
							name: "My fan coil",
							typeOfHeatEmitter: "fanCoil",
							productReference: "1000",
						},
					],
				};

				store.$patch({
					spaceHeating: {
						heatEmitters: {
							data: [{ data: wetDistributionSystemWithFanCoilEmitter, complete: true }],
						},
					},
				});
				await renderSuspended(HeatEmitterForm, {
					route: {
						params: { "heatEmitter": "0" },
					},
				});
				await user.click(screen.getByTestId("emitter_edit_0"));
				await user.type(screen.getByTestId("numOfFanCoils_0"), "3");
				await user.tab();
				await user.click(screen.getByTestId("saveEmitter_0"));

				const summaryCard = screen.getByTestId("emitter-emitter1");
				expect(summaryCard.querySelector(".govuk-summary-card__title")?.textContent).toContain("My fan coil");
				expect(screen.getByTestId("summary-emitter-0-type-of-emitter").textContent).toContain("Fan coil");
				expect(screen.getByTestId("summary-emitter-0-fan-coil-product").textContent).toContain("Test");
				expect(screen.getByTestId("summary-emitter-0-fan-coil-product").textContent).toContain("Fan coil");
				expect(screen.getByTestId("summary-emitter-0-number-of-fan-coils").textContent).toContain("3");
			});
			test("underfloor heating have expected fields", async () => {
				const wetDistributionSystemWithUnderfloorEmitter: HeatEmittingData = {
					...wetDistributionSystem,
					emitters: [
						{
							id: "emitter1",
							name: "Emitter 1",
							typeOfHeatEmitter: "underfloorHeating",
							productReference: "1000",
						},
					],
				};

				store.$patch({
					spaceHeating: {
						heatEmitters: {
							data: [{ data: wetDistributionSystemWithUnderfloorEmitter, complete: true }],
						},
					},
				});
				await renderSuspended(HeatEmitterForm, {
					route: {
						params: { "heatEmitter": "0" },
					},
				});
				await user.click(screen.getByTestId("emitter_edit_0"));
				expect(screen.getByTestId("areaOfUnderfloorHeating_0")).toBeDefined();
				await user.type(screen.getByTestId("areaOfUnderfloorHeating_0"), "50");
				await user.tab();
				await user.click(screen.getByTestId("saveEmitter_0"));
				const system = store.spaceHeating.heatEmitters.data[0]!.data as WetDistributionSystemData;
				if ("emitters" in system) {
					const emitter = system.emitters[0]!;
					expect(emitter.typeOfHeatEmitter).toBe("underfloorHeating");
					expect((emitter as { areaOfUnderfloorHeating: number }).areaOfUnderfloorHeating).toBe(50);
				} else {
					throw new Error("Emitters field is missing in heat emitter data");
				}
			});
			test("edit form is prepopulated with existing radiator emitter data", async () => {
				const wetDistributionSystemWithRadiator: HeatEmittingData = {
					...wetDistributionSystem,
					emitters: [
						{
							id: "emitter1",
							name: "My radiator",
							typeOfHeatEmitter: "radiator",
							numOfRadiators: 4,
							length: 2.5,
						},
					],
				};

				store.$patch({
					spaceHeating: {
						heatEmitters: {
							data: [{ data: wetDistributionSystemWithRadiator, complete: true }],
						},
					},
				});

				await renderSuspended(HeatEmitterForm, {
					route: {
						params: { "heatEmitter": "0" },
					},
				});

				await user.click(screen.getByTestId("emitter_edit_0"));

				expect(screen.getByTestId<HTMLInputElement>("emitterName_0").value).toBe("My radiator");
				expect(screen.getByTestId<HTMLInputElement>("typeOfHeatEmitter_0_radiator").hasAttribute("checked")).toBe(true);
				expect(screen.getByTestId<HTMLInputElement>("numOfRadiators_0").value).toBe("4");
				expect(screen.getByTestId<HTMLInputElement>("length_0").value).toBe("2.5");
			});
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
			expect(screen.getByTestId("convectiveType")).toBeDefined();
			expect(screen.getByTestId("ratedPower")).toBeDefined();
			expect(screen.getByTestId("numOfHeaters")).toBeDefined();
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

		test("the 'Select a product' element navigates user to the products page", async () => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_electricStorageHeater"));

			expect(screen.getByTestId("chooseAProductButton").getAttribute("href")).toBe("/0/electric-storage-heater");
		});
	});

	describe("Default names", () => {
		const store = useEcaasStore();

		beforeEach(() => {
			store.$reset();
		});

		it.each([
			["wetDistributionSystem", "Wet distribution"],
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
			const actualHeatEmitter = store.spaceHeating.heatEmitters.data[0]!;
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
				convectiveType: "Air heating (convectors, fan coils etc.)",
				numOfHeaters: 1,
			};
			store.$patch({
				spaceHeating: {
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

			const radiator = store.spaceHeating.heatEmitters.data[0];
			expect(radiator?.complete).toBe(true);
		});
		test("doesn't save an valid radiator to store", async () => {
			const incompleteRadiator = {
				id: "1234",
				name: "Standard radiator",
				typeOfHeatEmitter: "radiator" as const,
			};
			const wetDistributionSystemWithRadiatorEmitter: HeatEmittingData = {
				...wetDistributionSystem,
				emitters: [
					incompleteRadiator,
				],
			};
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [{ data: wetDistributionSystemWithRadiatorEmitter, complete: false }],
					},
				},
			});
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "0" },
				},
			});

			await user.click(screen.getByTestId("emitter_edit_0"));
			await user.click(screen.getByTestId("saveEmitter_0"));

			const system = store.spaceHeating.heatEmitters.data[0];
			expect(system?.complete).toBe(false);
			expect(screen.getByTestId("numOfRadiators_0_error")).toBeDefined();
			expect(screen.getByTestId("length_0_error")).toBeDefined();
		});
		test("doesn't save an invalid fan coil to store", async () => {
			const incompleteFanCoil = {
				id: "1234",
				name: "Fan coil",
				typeOfHeatEmitter: "fanCoil" as const,
			};
			const wetDistributionSystemWithFanCoilEmitter: HeatEmittingData = {
				...wetDistributionSystem,
				emitters: [
					incompleteFanCoil,
				],
			};
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [{ data: wetDistributionSystemWithFanCoilEmitter, complete: false }],
					},
				},
			});
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "0" },
				},
			});

			await user.click(screen.getByTestId("emitter_edit_0"));
			await user.click(screen.getByTestId("saveEmitter_0"));

			const system = store.spaceHeating.heatEmitters.data[0];
			expect(system?.complete).toBe(false);
			expect(screen.getByTestId("numOfFanCoils_0_error")).toBeDefined();
		});
		test("doesn't save an invalid underfloor heating to store", async () => {
			const incompleteUfh = {
				id: "1234",
				name: "Underfloor heating",
				typeOfHeatEmitter: "underfloorHeating" as const,
			};
			const wetDistributionSystemWithUfhEmitter: HeatEmittingData = {
				...wetDistributionSystem,
				emitters: [
					incompleteUfh,
				],
			};
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [{ data: wetDistributionSystemWithUfhEmitter, complete: false }],
					},
				},
			});
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "0" },
				},
			});

			await user.click(screen.getByTestId("emitter_edit_0"));
			await user.click(screen.getByTestId("saveEmitter_0"));

			const system = store.spaceHeating.heatEmitters.data[0];
			expect(system?.complete).toBe(false);
			expect(screen.getByTestId("areaOfUnderfloorHeating_0_error")).toBeDefined();
		});
		test("saves a valid radiator emitter to store", async () => {
			const radiatorEmitter: HeatEmittingData = {
				...wetDistributionSystem,
				emitters: [
					{
						id: "emitter1",
						name: "Radiator",
						typeOfHeatEmitter: "radiator" as const,
						productReference: "1000",
					},
				],
			};
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [{ data: radiatorEmitter, complete: false }],
					},
				},
			});
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "0" },
				},
			});

			await user.click(screen.getByTestId("emitter_edit_0"));
			expect(screen.getByTestId("emitterName_0")).toBeDefined();
			await user.type(screen.getByTestId("numOfRadiators_0"), "3");
			await user.type(screen.getByTestId("length_0"), "1.2");
			await user.tab();
			await user.click(screen.getByTestId("saveEmitter_0"));

			const system = store.spaceHeating.heatEmitters.data[0];
			const emitter = (system?.data as WetDistributionSystemData).emitters[0];
			expect(emitter?.name).toBe("Radiator");
			expect((emitter as { numOfRadiators: number }).numOfRadiators).toBe(3);
			expect((emitter as { length: number }).length).toBe(1.2);
		});
		test("saves a valid fan coil emitter to store", async () => {
			const fanCoilEmitter: HeatEmittingData = {
				...wetDistributionSystem,
				emitters: [
					{
						id: "emitter1",
						name: "Fan coil",
						typeOfHeatEmitter: "fanCoil" as const,
						productReference: "1000",
					},
				],
			};
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [{ data: fanCoilEmitter, complete: false }],
					},
				},
			});
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "0" },
				},
			});

			await user.click(screen.getByTestId("emitter_edit_0"));
			expect(screen.getByTestId("emitterName_0")).toBeDefined();
			await user.type(screen.getByTestId("numOfFanCoils_0"), "5");
			await user.tab();
			await user.click(screen.getByTestId("saveEmitter_0"));

			const system = store.spaceHeating.heatEmitters.data[0];
			const emitter = (system?.data as WetDistributionSystemData).emitters[0];
			expect(emitter?.name).toBe("Fan coil");
			expect((emitter as { numOfFanCoils: number }).numOfFanCoils).toBe(5);
		});
		test("saves a valid underfloor heating emitter to store", async () => {
			const ufhEmitter: HeatEmittingData = {
				...wetDistributionSystem,
				emitters: [
					{
						id: "emitter1",
						name: "Underfloor heating",
						typeOfHeatEmitter: "underfloorHeating" as const,
						productReference: "1000",
					},
				],
			};
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [{ data: ufhEmitter, complete: false }],
					},
				},
			});
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "0" },
				},
			});

			await user.click(screen.getByTestId("emitter_edit_0"));
			expect(screen.getByTestId("emitterName_0")).toBeDefined();
			await user.type(screen.getByTestId("areaOfUnderfloorHeating_0"), "25");
			await user.tab();
			await user.click(screen.getByTestId("saveEmitter_0"));

			const system = store.spaceHeating.heatEmitters.data[0];
			const emitter = (system?.data as WetDistributionSystemData).emitters[0];
			expect(emitter?.name).toBe("Underfloor heating");
			expect((emitter as { areaOfUnderfloorHeating: number }).areaOfUnderfloorHeating).toBe(25);
		});
		test("editing emitter sets system complete to false", async () => {
			const radiatorEmitter: HeatEmittingData = {
				...wetDistributionSystem,
				emitters: [
					{
						id: "emitter1",
						name: "Radiator",
						typeOfHeatEmitter: "radiator" as const,
					},
				],
			};
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [{ data: radiatorEmitter, complete: true }],
					},
				},
			});
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "0" },
				},
			});

			await user.click(screen.getByTestId("emitter_edit_0"));

			const system = store.spaceHeating.heatEmitters.data[0];
			expect(system?.complete).toBe(false);
		});
		test("shows an error when minFlowRate is greater than maxFlowRate", async () => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_wetDistributionSystem"));
			await user.click(screen.getByTestId("hasVariableFlowRate_yes"));
			await user.type(screen.getByTestId("minFlowRate"), "10");
			await user.type(screen.getByTestId("maxFlowRate"), "5");
			await user.tab();
			await user.click(screen.getByTestId("saveAndComplete"));

			expect(await screen.findByTestId("heatEmitterErrorSummary")).toBeDefined();
		});
		it("navigates to space heating on clicking Save progress", async () => {
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatEmitter_wetDistributionSystem"));
			await user.click(screen.getByTestId("saveProgress"));

			expect(navigateToMock).toHaveBeenCalledWith("/space-heating");
		});

		it("navigates to space heating when valid form is completed", async () => {
			const validInstantElecHeater: HeatEmittingData = {
				id: "1234",
				name: "IEH",
				typeOfHeatEmitter: "instantElectricHeater",
				ratedPower: 1,
				convectiveType: "Air heating (convectors, fan coils etc.)",
				numOfHeaters: 1,
			};
			store.$patch({
				spaceHeating: {
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

			expect(navigateToMock).toHaveBeenCalledWith("/space-heating");
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
			await user.click(screen.getByTestId("typeOfHeatEmitter_wetDistributionSystem"));
			await user.click(screen.getByTestId("saveAndComplete"));

			expect(screen.queryByTestId("heatEmitterErrorSummary")).not.toBeNull();

			await user.click(screen.getByTestId("typeOfHeatEmitter_warmAirHeater"));
			expect(screen.queryByTestId("heatEmitterErrorSummary")).toBeNull();
		});

		describe("partially saving data", () => {
			it("saves updated form data to store automatically", async () => {
				const validWetDistribtion: HeatEmittingData = {
					id: "1234",
					name: "Wet Distribution 1",
					heatSource: "heat-pump-id",
					ecoDesignControllerClass: "2",
					designFlowTemp: 55,
					minFlowTemp: 45,
					maxOutdoorTemp: 33,
					minOutdoorTemp: 2,
					designTempDiffAcrossEmitters: 10,
					hasVariableFlowRate: false,
					designFlowRate: 100,
					percentageRecirculated: 20,
					typeOfHeatEmitter: "wetDistributionSystem",
					emitters: [{
						id: "emitter1",
						name: "Radiator 1",
						typeOfHeatEmitter: "radiator",
						length: 1.5,
						numOfRadiators: 2,
						productReference: "product-ref-123",
					}],
				};

				store.$patch({
					spaceHeating: {
						heatEmitters: {
							data: [{ data: validWetDistribtion, complete: false }],
						},
					},
				});

				await renderSuspended(HeatEmitterForm, {
					route: {
						params: { "heatEmitter": "0" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatEmitter_warmAirHeater"));

				const actualHeatEmitter = store.spaceHeating.heatEmitters.data[0]!;
				expect(actualHeatEmitter.data.typeOfHeatEmitter).toBe("warmAirHeater");
			});
			const wetDistribution: HeatEmittingData = {
				id: "1234",
				name: "Radiator 1",
				heatSource: "heat-pump-id",
				ecoDesignControllerClass: "1",
				designFlowTemp: 55,
				designTempDiffAcrossEmitters: 10,
				hasVariableFlowRate: false,
				designFlowRate: 100,
				percentageRecirculated: 20,
				emitters: [],
				typeOfHeatEmitter: "wetDistributionSystem",
			};

			test("marks section as not complete after editing an existing item", async () => {
				store.$patch({
					spaceHeating: {
						heatEmitters: {
							data: [{ data: wetDistribution, complete: true }],
							complete: true,
						},
					},
				});

				await renderSuspended(HeatEmitterForm, {
					route: { params: { "heatEmitter": "0" } },
				});

				await user.type(screen.getByTestId("name"), " Changed");
				await user.tab();

				expect(store.spaceHeating.heatEmitters.complete).toBe(false);
			});
		});
	});
	describe("Autoselect first heat source", () => {
		test("first heat source is autoselected when only one heat source exists", async () => {
			const store = useEcaasStore();
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [
							{ data: { id: "hs1", name: "Heat source 1" } },
						],
					},
				},
			});
			await renderSuspended(HeatEmitterForm, {
				route: {
					params: { "heatEmitter": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatEmitter_wetDistributionSystem"));
			await user.tab();
			const heatSourceSelect = screen.getByTestId<HTMLSelectElement>("heatSource_hs1");
			expect(heatSourceSelect.hasAttribute("checked")).toBe(true);
		});
	});
});
