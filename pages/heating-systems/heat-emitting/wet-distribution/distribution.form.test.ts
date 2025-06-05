import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/vue";
import WetDistribution from "./[distribution].vue";
import { WetEmitterWet_emitter_type } from "~/schema/api-schema.types";

const user = userEvent.setup();

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

const heatPump: HeatPumpData = {
	id: "7184f2fe-a78f-4a56-ba5a-1a7751ac507r",
	name: "Heat pump 1",
};

const wetDistribution1: WetDistributionData = {
	name: "Wet distribution 1",
	zoneReference: "livingSpace",
	heatSource: "7184f2fe-a78f-4a56-ba5a-1a7751ac507r",
	thermalMass: 2,
	designTempDiffAcrossEmitters: 0.4,
	designFlowTemp: 32,
	typeOfSpaceHeater: WetEmitterWet_emitter_type.radiator,
	exponent: 1.3,
	constant: 0.08,
	convectionFractionWet: 0.2,
	ecoDesignControllerClass: "1",
	minimumFlowTemp: 20,
	minOutdoorTemp: 0,
	maxOutdoorTemp: 15,
	numberOfRadiators: 1,
};

// const wetDistribution2: WetDistributionData = {
// 	name: "Wet distribution 2",
// 	zoneReference: "livingSpace",
// 	heatSource: "7184f2fe-a78f-4a56-ba5a-1a7751ac507r",
// 	thermalMass: 5,
// 	designTempDiffAcrossEmitters: 0.2,
// 	designFlowTemp: 32,
// 	typeOfSpaceHeater: WetEmitterWet_emitter_type.ufh,
// 	emitterFloorArea: 5,
// 	ecoDesignControllerClass: "2",
// 	minimumFlowTemp: 25,
// 	minOutdoorTemp: 0,
// 	maxOutdoorTemp: 15,
// };

const populateValidForm = async () => {
	await user.type(screen.getByTestId("name"), "Wet distribution 1");
	await user.click(screen.getByTestId("zoneReference_livingSpace"));
	await user.click(
		screen.getByTestId("heatSource_7184f2fe-a78f-4a56-ba5a-1a7751ac507r")
	);
	await user.type(screen.getByTestId("thermalMass"), "2");
	await user.type(screen.getByTestId("designTempDiffAcrossEmitters"), "0.4");
	await user.type(screen.getByTestId("designFlowTemp"), "32");
	// await user.click(screen.getByTestId("typeOfSpaceHeater_radiator"));
	await user.type(screen.getByTestId("numberOfRadiators"), "1");
	await user.type(screen.getByTestId("convectionFractionWet"), "0.2");
	await user.selectOptions(screen.getByTestId("ecoDesignControllerClass"), "1");
	await user.type(screen.getByTestId("minimumFlowTemp"), "20");
};

describe("Wet distribution", () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it("should have the correct headings", async () => {
		await renderSuspended(WetDistribution);
		expect(
			screen.getByRole("heading", { name: "Wet distribution" })
		).toBeDefined();
		expect(
			screen.getByRole("heading", { name: "Eco design controller" })
		).toBeDefined();
	});

	it("should have the following inputs", async () => {
		await renderSuspended(WetDistribution);
		expect(screen.getByText("Name")).toBeDefined();
		expect(screen.getByText("Zone reference")).toBeDefined();
		expect(screen.getByText("Heat source")).toBeDefined();
		expect(screen.getByText("Thermal mass")).toBeDefined();
		expect(
			screen.getByText("Design temperature difference across the emitters")
		).toBeDefined();
		expect(screen.getByText("Design flow temperature")).toBeDefined();
		expect(screen.getByText("Type of space heater")).toBeDefined();
		expect(screen.getByText("Eco design controller class")).toBeDefined();
		expect(screen.getAllByText("Minimum flow temperature")).toBeDefined();
	});

	it("should show convection fraction input when radiators is selected as type of space heater", async () => {
		await renderSuspended(WetDistribution);

		await user.click(screen.getByRole("radio", { name: "Radiators" }));
		expect(screen.getByText("Convection fraction")).toBeDefined();
	});

	// it("should show emitter floor area input when Under floor heating (UFH) is selected as type of space heater", async () => {
	// 	await renderSuspended(WetDistribution);

	// 	await user.click(
	// 		screen.getByRole("radio", { name: "Under floor heating (UFH)" })
	// 	);
	// 	expect(screen.getByText("Emitter floor area")).toBeDefined();
	// });

	it("should list the Heat sources perviously added", async () => {
		store.$patch({
			heatingSystems: {
				heatGeneration: {
					heatPump: {
						data: [heatPump],
					},
				},
			},
		});

		await renderSuspended(WetDistribution);
		expect(screen.getByText("Heat pump 1")).toBeDefined();
	});

	it("should show an error message for each empty input field when user tries to submit the form", async () => {
		await renderSuspended(WetDistribution);
		await user.click(screen.getByRole("button"));

		const initialErrorIds: string[] = [
			"name_error",
			"zoneReference_error",
			"heatSource_error",
			"thermalMass_error",
			"designTempDiffAcrossEmitters_error",
			"designFlowTemp_error",
			// "typeOfSpaceHeater_error",
			"ecoDesignControllerClass_error",
			"minimumFlowTemp_error",
		];

		for (const error of initialErrorIds) {
			expect(screen.getByTestId(error)).toBeDefined();
		}
		await user.click(screen.getByRole("radio", { name: "Radiators" }));
		await user.click(screen.getByRole("button"));
		expect(screen.getByTestId("convectionFractionWet_error")).toBeDefined();

		// await user.click(
		// 	screen.getByRole("radio", { name: "Under floor heating (UFH)" })
		// );
		// await user.click(screen.getByRole("button"));
		// expect(screen.getByTestId("emitterFloorArea_error")).toBeDefined();
	});

	it("should show error summary when an invalid form in submitted", async () => {
		await renderSuspended(WetDistribution);

		await user.click(screen.getByRole("button"));

		expect(
			await screen.findByTestId("wetDistributionErrorSummary")
		).toBeDefined();
	});

	it("should save data to store when form is valid and type of space heater is radiators", async () => {
		store.$patch({
			heatingSystems: {
				heatGeneration: {
					heatPump: {
						data: [heatPump],
					},
				},
			},
		});

		await renderSuspended(WetDistribution);
		await populateValidForm();

		await user.click(screen.getByRole("button"));

		await waitFor(() => {
			const { data } =
        store.heatingSystems.heatEmitting.wetDistribution;
			expect(data[0]).toEqual(wetDistribution1);
		});
	});

	// it("should save data to store when form is valid and type of space heater is under floor heating (UFH)", async () => {
	// 	store.$patch({
	// 		heatingSystems: {
	// 			heatGeneration: {
	// 				heatPump: {
	// 					data: [heatPump],
	// 				},
	// 			},
	// 		},
	// 	});

	// 	await renderSuspended(WetDistribution);

	// 	await user.type(screen.getByTestId("name"), "Wet distribution 2");
	// 	await user.click(screen.getByTestId("zoneReference_livingSpace"));
	// 	await user.click(
	// 		screen.getByTestId("heatSource_7184f2fe-a78f-4a56-ba5a-1a7751ac507r")
	// 	);
	// 	await user.type(screen.getByTestId("thermalMass"), "5");
	// 	await user.type(screen.getByTestId("designTempDiffAcrossEmitters"), "0.2");
	// 	await user.type(screen.getByTestId("designFlowTemp"), "32");
	// 	await user.click(screen.getByTestId("typeOfSpaceHeater_ufh"));
	// 	await user.type(screen.getByTestId("emitterFloorArea"), "5");
	// 	await user.selectOptions(
	// 		screen.getByTestId("ecoDesignControllerClass"),
	// 		"2"
	// 	);
	// 	await user.type(screen.getByTestId("minimumFlowTemp"), "25");

	// 	await user.click(screen.getByRole("button"));

	// 	await waitFor(() => {
	// 		const { data } =
	//     store.heatingSystems.heatEmitting.wetDistribution;
	// 		expect(data[0]).toEqual(wetDistribution2);
	// 	});
	// });

	it("should populate form when exists in store", async () => {
		store.$patch({
			heatingSystems: {
				heatGeneration: {
					heatPump: {
						data: [heatPump],
					},
				},
				heatEmitting: {
					wetDistribution: {
						data: [wetDistribution1],
					},
				},
			},
		});
		await renderSuspended(WetDistribution, {
			route: {
				params: { distribution: "0" },
			},
		});
		expect(
			((await screen.findByTestId("name")) as HTMLInputElement).value
		).toBe("Wet distribution 1");
		expect(
			(
				(await screen.findByTestId(
					"zoneReference_livingSpace"
				)) as HTMLInputElement
			).checked
		).toBe(true);
		expect(
			(
				(await screen.findByTestId(
					"heatSource_7184f2fe-a78f-4a56-ba5a-1a7751ac507r"
				)) as HTMLInputElement
			).checked
		).toBe(true);
		expect(
			((await screen.findByTestId("thermalMass")) as HTMLInputElement).value
		).toBe("2");
		expect(
			(
				(await screen.findByTestId(
					"designTempDiffAcrossEmitters"
				)) as HTMLInputElement
			).value
		).toBe("0.4");
		expect(
			((await screen.findByTestId("designFlowTemp")) as HTMLInputElement).value
		).toBe("32");
		expect(
			(
				(await screen.findByTestId(
					"typeOfSpaceHeater_radiator"
				)) as HTMLInputElement
			).checked
		).toBe(true);
		expect(
			((await screen.findByTestId("convectionFractionWet")) as HTMLInputElement)
				.value
		).toBe("0.2");
		expect(
			(
				(await screen.findByTestId(
					"ecoDesignControllerClass"
				)) as HTMLSelectElement
			).value
		).toBe("1");
		expect(
			((await screen.findByTestId("minimumFlowTemp")) as HTMLInputElement).value
		).toBe("20");
	});

	it("should contain link to separate page for eco design control guidance", async () => {
		await renderSuspended(WetDistribution);
		const guidance = screen.getByRole("link", {
			name: "Eco design control guidance (opens in another window)",
		});
		expect(guidance).toBeDefined();
		expect(guidance.getAttribute("href")).toBe(
			"/guidance/eco-design-control-guidance"
		);
	});

	it("should navigate to the heat emitting page when form is saved", async () => {
		store.$patch({
			heatingSystems: {
				heatGeneration: {
					heatPump: {
						data: [heatPump],
					},
				},
			},
		});
		await renderSuspended(WetDistribution);
		await populateValidForm();
		await user.click(screen.getByRole("button"));
		expect(navigateToMock).toHaveBeenCalledWith(
			"/heating-systems/heat-emitting"
		);
	});
});
