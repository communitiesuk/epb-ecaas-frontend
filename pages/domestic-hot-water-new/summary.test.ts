import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import Summary from "./summary.vue";
import { screen, within } from "@testing-library/vue";
import { litre } from "~/utils/units/volume";
import { metre, millimetre } from "~/utils/units/length";
import { wattsPerMeterKelvin } from "~/utils/units/thermalConductivity";
import { litrePerHour, litrePerMinute } from "~/utils/units/flowRate";
import { kilowatt, kilowattHour } from "~/utils/units/power";
import { metresSquare } from "~/utils/units/area";
import { degrees } from "~/utils/units/angle";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("Domestic hot water summary", () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it("displays the correct title", async () => {
		await renderSuspended(Summary);
		expect(screen.getByRole("heading", { name: "Domestic hot water summary" }));
	});

	describe("water storage", () => {
		const heatPumpId = "463c94f6-566c-49b2-af27-57e5c68b5c30";

		const hotWaterCylinder: HotWaterCylinderDataNew = {
			id: "c84528bb-f805-4f1e-95d3-2bd17384fdbe",
			typeOfWaterStorage: "hotWaterCylinder",
			name: "Hot water cylinder",
			storageCylinderVolume: 5,
			initialTemperature: 60,
			dailyEnergyLoss: 1,
			heatSource: heatPumpId,
			areaOfHeatExchanger: 2.5,
			heaterPosition: 0.8,
			thermostatPosition: 0.5,
		};

		const smartHotWaterCylinder: SmartHotWaterTankDataNew = {
			id: "c84528bb-f805-4f1e-95d3-2bd17384abcd",
			typeOfWaterStorage: "smartHotWaterTank",
			name: "Smart hot water cylinder",	
			productReference: "SMART-HOT-WATER-CYLINDER",
			heatSource: heatPumpId,
			heaterPosition: 0.3,
		};

		const addHotWaterCylinderData = () => {
			store.$patch({
				domesticHotWaterNew: {
					waterStorage: {
						data: [{ data: hotWaterCylinder }],
					},
				},
				spaceHeating: {
					heatSource: {
						data: [{
							data: {
								id: heatPumpId,
								name: "Heat pump",
								typeOfHeatSource: "heatPump",
							},
						}],
					},
				},
			});
		};

		const addSmartHotWaterCylinderData = () => {
			store.$patch({
				domesticHotWaterNew: {
					waterStorage: {
						data: [{ data: smartHotWaterCylinder }],
					},
				},
				spaceHeating: {
					heatSource: {
						data: [{
							data: {
								id: heatPumpId,
								name: "Heat pump",
								typeOfHeatSource: "heatPump",
							},
						}],
					},
				},
			});
		};

		it("displays an empty tab state with link to create when no data exists", async () => {
			await renderSuspended(Summary);

			expect(screen.getByText("No water storage added")).not.toBeNull();

			const addWaterStorageLink: HTMLAnchorElement = screen.getByRole("link", {
				name: "Add water storage",
			});

			expect(new URL(addWaterStorageLink.href).pathname).toBe(
				getUrl("waterStorage"),
			);
		});

		it("should contain the correct tabs when data exists", async () => {
			store.$patch({
				domesticHotWaterNew: {
					waterStorage: {
						data: [{ data: hotWaterCylinder }, { data: smartHotWaterCylinder }],
					},
				},
				spaceHeating: {
					heatSource: {
						data: [{
							data: {
								id: heatPumpId,
								name: "Heat pump",
								typeOfHeatSource: "heatPump",
							},
						}],
					},
				},
			});
			await renderSuspended(Summary);

			expect(screen.queryByRole("link", { name: "Hot water cylinders" })).not.toBeNull();
			expect(screen.queryByRole("link", { name: "Smart hot water cylinders" })).not.toBeNull();
		});

		it("should display the correct data for the hot water cylinder section when data exists", async () => {
			addHotWaterCylinderData();
			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Hot water cylinder",
				"Storage cylinder volume": `5 ${litre.suffix}`,
				"Initial temperature": `60 ${degrees.suffix}C`,
				"Daily energy loss": `1 ${kilowattHour.suffix}`,
				"Heat source": "Heat pump",
				"Area of heat exchanger installed": `2.5 ${metresSquare.suffix}`,
				"Heater position in the cylinder": "0.8",
				"Thermostat position in the cylinder": "0.5",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-hotWaterCylinder-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("should display an edit link within hot water cylinder when data exists", async () => {
			addHotWaterCylinderData();
			await renderSuspended(Summary);
			const hotWaterCylinderSection = screen.getByTestId("hotWaterCylinder");
			const editLink: HTMLAnchorElement = within(hotWaterCylinderSection).getByText("Edit");

			expect(editLink).not.toBeNull();
			expect(new URL(editLink.href).pathname).toBe("/domestic-hot-water-new");
		});

		it("should display the correct data for the smart hot water cylinder section when data exists", async () => {
			addSmartHotWaterCylinderData();
			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Smart hot water cylinder",
				"Product reference": "SMART-HOT-WATER-CYLINDER",
				"Heat source": "Heat pump",
				"Heater position in the cylinder": "0.3",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-smartHotWaterCylinder-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("should display an edit link within smart hot water cylinder when data exists", async () => {
			addSmartHotWaterCylinderData();
			await renderSuspended(Summary);
			const smartHotWaterCylinderSection = screen.getByTestId("smartHotWaterCylinder");
			const editLink: HTMLAnchorElement = within(smartHotWaterCylinderSection).getByText("Edit");

			expect(editLink).not.toBeNull();
			expect(new URL(editLink.href).pathname).toBe("/domestic-hot-water-new");
		});
	});

	describe("hot water outlets", () => {
		const mixedShower: EcaasForm<MixedShowerDataNew> = {
			data: {
				id: "4a93532e-a370-4015-9778-854661bf1627",
				name: "Mixer shower 1",
				flowRate: 10,
				typeOfHotWaterOutlet: "mixedShower",
				hotWaterSource: "4eaf-48c1-4d3b-9f56-6d02b8f5c2bb",
				wwhrs: false,
			},
		};

		const electricShower: EcaasForm<ElectricShowerDataNew> = {
			data: {
				id: "0b77e247-53c5-42b8-9dbd-83cbfc8c8a9e",
				name: "Electric shower 1",
				ratedPower: 10,
				typeOfHotWaterOutlet: "electricShower",
				wwhrs: false,
			},
		};

		const bathData: EcaasForm<BathDataNew> = {
			data: {
				id: "d3883380-885b-48fd-9425-9f9fac7587fb",
				name: "Bath 1",
				size: 170,
				typeOfHotWaterOutlet: "bath",
			},
		};

		const otherOutletsData: EcaasForm<OtherHotWaterOutletDataNew> = {
			data: {
				id: "0b77e247-53c5-42b8-9dbd-83cbfc8c8a9e",
				name: "Basin tap 1",
				flowRate: 10,
				typeOfHotWaterOutlet: "otherHotWaterOutlet",
			},
		};

		it("should contain the correct tabs for hot water outlets", async () => {
			await renderSuspended(Summary);

			expect(screen.getByRole("link", { name: "Mixer showers" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Electric showers" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Baths" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Other" })).not.toBeNull();
		});

		it("should display the correct data for the mixer shower section", async () => {
			store.$patch({
				domesticHotWaterNew: {
					hotWaterOutlets: {
						data: [mixedShower],
					},
					heatSources: {
						data: [{ data: { id: mixedShower.data.hotWaterSource, name: "Heat pump" } }],
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Mixer shower 1",
				"Type of hot water outlet": "Mixed shower",
				"Hot water source": "Heat pump",
				"Flow rate": `10 ${litrePerHour.suffix}`,
				"WWHRS installed": "No",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-mixedShower-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("displays '-' for missing values in a partial mixer shower", async () => {
			const partialMixed = {
				data: {
					id: "partial-id-0001",
					name: "Partial mixer",
					typeOfHotWaterOutlet: "mixedShower",
					// intentionally leave out flowRate, hotWaterSource, wwhrs
				} as Partial<MixedShowerDataNew>,
			};

			store.$patch({
				domesticHotWaterNew: {
					hotWaterOutlets: {
						data: [partialMixed],
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Partial mixer",
				"Type of hot water outlet": "Mixed shower",
				"Hot water source": "-",
				"Flow rate": "-",
				"WWHRS installed": "-",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-mixedShower-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("should display the correct data for the electric shower section", async () => {
			store.$patch({
				domesticHotWaterNew: {
					hotWaterOutlets: {
						data: [electricShower],
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Electric shower 1",
				"Type of hot water outlet": "Electric shower",
				"Rated power": `10 ${kilowatt.suffix}`,
				"WWHRS installed": "No",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-electricShower-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("should display the correct data for the bath section", async () => {
			store.$patch({
				domesticHotWaterNew: {
					hotWaterOutlets: {
						data: [bathData],
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Bath 1",
				"Type of hot water outlet": "Bath",
				"Size": `170 ${litre.suffix}`,
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-bath-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("should display the correct data for the other outlets section", async () => {
			store.$patch({
				domesticHotWaterNew: {
					hotWaterOutlets: {
						data: [otherOutletsData],
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Basin tap 1",
				"Type of hot water outlet": "Other hot water outlet",
				"Flow rate": `10 ${litrePerMinute.suffix}`,
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-otherOutlets-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});

	describe("pipework", () => {

		const pipework: EcaasForm<Partial<PipeworkData>> = {
			data: {
				name: "Pipework Kitchen Sink Primary",
				internalDiameter: 10,
				externalDiameter: 10,
				length: 3,
				insulationThickness: 5,
				thermalConductivity: 1,
				surfaceReflectivity: true,
				pipeContents: "water",
				location: "heatedSpace",
			},
		};

		it("should contain the correct tabs for pipework details", async () => {
			await renderSuspended(Summary);

			expect(screen.getByRole("link", { name: "Pipework" })).not.toBeNull();

		});

		it("should display the correct data for the pipework section", async () => {
			store.$patch({
				domesticHotWaterNew: {
					pipework: {
						data: [pipework],
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Pipework Kitchen Sink Primary",
				"Location": "Heated space",
				"Pipe contents": "Water",
				"Internal diameter": `10 ${millimetre.suffix}`,
				"External diameter": `10 ${millimetre.suffix}`,
				"Length": `3 ${metre.suffix}`,
				"Insulation thickness": `5 ${millimetre.suffix}`,
				"Thermal conductivity": `1 ${wattsPerMeterKelvin.suffix}`,
				"Surface reflectivity": "Reflective",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-pipework-${hyphenate(key)}`));

				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});
});