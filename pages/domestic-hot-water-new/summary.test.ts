import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import Summary from "./summary.vue";
import { screen, within } from "@testing-library/vue";
import { litre } from "~/utils/units/volume";
import { metre, millimetre } from "~/utils/units/length";
import { wattsPerMeterKelvin } from "~/utils/units/thermalConductivity";
import { litrePerHour, litrePerMinute } from "~/utils/units/flowRate";
import { kilowatt, kilowattHour } from "~/utils/units/power";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("Domestic hot water summary", () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
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
				domesticHotWater: {
					hotWaterOutlets: {
						mixedShower: {
							data: [mixedShower],
						},
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Mixer shower 1",
				"Flow rate": `10 ${litrePerHour.suffix}`,
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-mixedShower-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("should display the correct data for the electric shower section", async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						electricShower: {
							data: [electricShower],
						},
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Electric shower 1",
				"Rated power": `10 ${kilowatt.suffix}`,
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-electricShower-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("should display the correct data for the bath section", async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						bath: {
							data: [bathData],
						},
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Bath 1",
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
				domesticHotWater: {
					hotWaterOutlets: {
						otherOutlets: {
							data: [otherOutletsData],
						},
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Basin tap 1",
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