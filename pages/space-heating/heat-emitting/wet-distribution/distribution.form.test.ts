import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import WetDistribution from "./[distribution].vue";

const user = userEvent.setup();

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

const heatPump: HeatPumpData = {
	id: "7184f2fe-a78f-4a56-ba5a-1a7751ac507r",
	name: "Heat pump 1",
	productReference: "HEATPUMP-MEDIUM",
	typeOfHeatPump: "airSource",
};

const wetDistribution1: WetDistributionData = {
	name: "Wet distribution 1",
	heatSource: heatPump.id,
	thermalMass: 2,
	designTempDiffAcrossEmitters: 0.4,
	designFlowTemp: 32,
	designFlowRate: 5,
	typeOfSpaceHeater: "radiator",
	exponent: 1.3,
	constant: 0.08,
	convectionFractionWet: 0.2,
	ecoDesignControllerClass: "1",
	minimumFlowTemp: 20,
	minOutdoorTemp: 0,
	maxOutdoorTemp: 15,
	numberOfRadiators: 1,
};

const wetDistribution2: WetDistributionData = {
	...wetDistribution1,
	name: "Wet distribution 2",
};

const store = useEcaasStore();

beforeEach(() => {	
	store.$patch({
		spaceHeatingNew: {
			heatSource: {
				data: [{ data: heatPump }],
			},
		},
	});
});

afterEach(() => {
	store.$reset();
});

const populateValidForm = async () => {
	await user.type(screen.getByTestId("name"), "Wet distribution 1");
	await user.click(
		screen.getByTestId(`heatSource_${heatPump.id}`),
	);
	await user.type(screen.getByTestId("thermalMass"), "2");
	await user.type(screen.getByTestId("designTempDiffAcrossEmitters"), "0.4");
	await user.type(screen.getByTestId("designFlowTemp"), "32");
	await user.type(screen.getByTestId("designFlowRate"), "5");
	await user.click(screen.getByTestId("typeOfSpaceHeater_radiator"));
	await user.type(screen.getByTestId("numberOfRadiators"), "1");
	await user.type(screen.getByTestId("convectionFractionWet"), "0.2");
	await user.selectOptions(screen.getByTestId("ecoDesignControllerClass"), "1");
	await user.type(screen.getByTestId("minimumFlowTemp"), "20");
	await user.tab();
};

describe("Wet distribution", () => {


	afterEach(() => {
		store.$reset();
	});

	it("should have the correct headings", async () => {
		await renderSuspended(WetDistribution);
		expect(
			screen.getByRole("heading", { name: "Wet distribution" }),
		).toBeDefined();
		expect(
			screen.getByRole("heading", { name: "Eco design controller" }),
		).toBeDefined();
	});

	it("should have the following inputs", async () => {
		await renderSuspended(WetDistribution);
		expect(screen.getByText("Name")).toBeDefined();
		expect(screen.getByText("Heat source")).toBeDefined();
		expect(screen.getByText("Thermal mass")).toBeDefined();
		expect(
			screen.getByText("Design temperature difference across the emitters"),
		).toBeDefined();
		expect(screen.getByText("Design flow temperature")).toBeDefined();
		expect(screen.getByText("Design flow rate")).toBeDefined();
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

		await renderSuspended(WetDistribution);
		expect(screen.getByText("Heat pump 1")).toBeDefined();
	});

	it("should show an error message for each empty input field when user tries to submit the form", async () => {
		await renderSuspended(WetDistribution);
		await user.click(screen.getByTestId("saveAndComplete"));

		const initialErrorIds: string[] = [
			"name_error",
			"heatSource_error",
			"thermalMass_error",
			"designTempDiffAcrossEmitters_error",
			"designFlowTemp_error",
			"designFlowRate_error",
			"typeOfSpaceHeater_error",
			"ecoDesignControllerClass_error",
			"minimumFlowTemp_error",
		];

		for (const error of initialErrorIds) {
			expect(screen.getByTestId(error)).toBeDefined();
		}
		await user.click(screen.getByRole("radio", { name: "Radiators" }));
		await user.click(screen.getByTestId("saveAndComplete"));
		expect(screen.getByTestId("convectionFractionWet_error")).toBeDefined();

		// await user.click(
		// 	screen.getByRole("radio", { name: "Under floor heating (UFH)" })
		// );
		// await user.click(screen.getByRole("button"));
		// expect(screen.getByTestId("emitterFloorArea_error")).toBeDefined();
	});

	it("should show error summary when an invalid form in submitted", async () => {
		await renderSuspended(WetDistribution);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect(
			await screen.findByTestId("wetDistributionErrorSummary"),
		).toBeDefined();
	});

	it("should save data to store when form is valid and type of space heater is radiators", async () => {

		await renderSuspended(WetDistribution, {
			route: {
				params: { distribution: "create" },
			},
		});
		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.spaceHeating.heatEmitting.wetDistribution;
		expect(data[0]!.data).toEqual(wetDistribution1);
	});

	// it("should save data to store when form is valid and type of space heater is under floor heating (UFH)", async () => {

	// 	await renderSuspended(WetDistribution);

	// 	await user.type(screen.getByTestId("name"), "Wet distribution 2");
	// 	await user.click(screen.getByTestId("zoneReference_livingSpace"));
	// 	await user.click(
	// 		screen.getByTestId("heatSource_7184f2fe-a78f-4a56-ba5a-1a7751ac507r")
	// 	);
	// 	await user.type(screen.getByTestId("thermalMass"), "5");
	// 	await user.type(screen.getByTestId("designTempDiffAcrossEmitters"), "0.2");
	// 	await user.type(screen.getByTestId("designFlowTemp"), "32");
	// 	await user.type(screen.getByTestId("designFlowRate"), "5");
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
	//     store.spaceHeating.heatEmitting.wetDistribution;
	// 		expect(data[0]).toEqual(wetDistribution2);
	// 	});
	// });

	it("should populate form when exists in store", async () => {
		store.$patch({
			spaceHeating: {
				heatEmitting: {
					wetDistribution: {
						data: [{ data: wetDistribution1 }],
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
			((await screen.findByTestId<HTMLInputElement>("name"))).value,
		).toBe("Wet distribution 1");
		expect(
			(
				(await screen.findByTestId<HTMLInputElement>(
					"heatSource_7184f2fe-a78f-4a56-ba5a-1a7751ac507r",
				))
			).checked,
		).toBe(true);
		expect(
			((await screen.findByTestId<HTMLInputElement>("thermalMass"))).value,
		).toBe("2");
		expect(
			(
				(await screen.findByTestId<HTMLInputElement>(
					"designTempDiffAcrossEmitters",
				))
			).value,
		).toBe("0.4");
		expect(
			((await screen.findByTestId<HTMLInputElement>("designFlowTemp"))).value,
		).toBe("32");
		expect(
			(
				(await screen.findByTestId<HTMLInputElement>(
					"typeOfSpaceHeater_radiator",
				))
			).checked,
		).toBe(true);
		expect(
			((await screen.findByTestId<HTMLInputElement>("convectionFractionWet")))
				.value,
		).toBe("0.2");
		expect(
			(
				(await screen.findByTestId<HTMLSelectElement>(
					"ecoDesignControllerClass",
				))
			).value,
		).toBe("1");
		expect(
			((await screen.findByTestId<HTMLInputElement>("minimumFlowTemp"))).value,
		).toBe("20");
	});

	it("should contain link to separate page for eco design control guidance", async () => {
		await renderSuspended(WetDistribution);
		const guidance = screen.getByRole("link", {
			name: "Eco design control guidance (opens in another window)",
		});
		expect(guidance).toBeDefined();
		expect(guidance.getAttribute("href")).toBe(
			"/guidance/eco-design-control-guidance",
		);
	});

	it("should navigate to the heat emitting page when form is saved", async () => {

		await renderSuspended(WetDistribution);
		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));
		expect(navigateToMock).toHaveBeenCalledWith(
			"/space-heating/heat-emitting",
		);
	});
});

describe("partially saving data", () => {

	it("creates a new wet distribution automatically with given name", async () => {
		await renderSuspended(WetDistribution, {
			route: {
				params: { distribution: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "New wet distribution");
		await user.tab();

		const actual = store.spaceHeating.heatEmitting.wetDistribution.data[0]!;
		expect(actual.data.name).toBe("New wet distribution");
		expect(actual.data.designFlowRate).toBeUndefined();
	});

	it("creates a new wet distribution automatically with default name after other data is entered", async () => {
		await renderSuspended(WetDistribution, {
			route: {
				params: { distribution: "create" },
			},
		});

		await user.type(screen.getByTestId("thermalMass"), "0.5");
		await user.tab();

		const actual = store.spaceHeating.heatEmitting.wetDistribution.data[0]!;
		expect(actual.data.name).toBe("Wet distribution");
		expect(actual.data.thermalMass).toBe(0.5);
	});

	it("saves updated form data to store automatically", async () => {
		store.$patch({
			spaceHeating: {
				heatEmitting: {
					wetDistribution: {
						data: [
							{ data: wetDistribution1 },
						],
					},
				},
			},
		});

		await renderSuspended(WetDistribution, {
			route: {
				params: { distribution: "0" },
			},
		});

		await user.clear(screen.getByTestId("name"));
		await user.type(screen.getByTestId("name"), "Updated wet distribution");
		await user.clear(screen.getByTestId("thermalMass"));
		await user.type(screen.getByTestId("thermalMass"), "1");
		await user.clear(screen.getByTestId("designFlowTemp"));
		await user.type(screen.getByTestId("designFlowTemp"), "30");

		await user.tab();

		const actual = store.spaceHeating.heatEmitting.wetDistribution.data[0]!.data;
		expect(actual.name).toBe("Updated wet distribution");
		expect(actual.thermalMass).toBe(1);
		expect(actual.designFlowTemp).toBe(30);

	});

	it("saves updated form data to correct store object automatically", async () => {
		store.$patch({
			spaceHeating: {
				heatEmitting: {
					wetDistribution: {
						data: [
							{ data: wetDistribution1 },
							{ data: wetDistribution2 },
						],
					},
				},
			},
		});

		await renderSuspended(WetDistribution, {
			route: {
				params: { distribution: "1" },
			},
		});

		await user.clear(screen.getByTestId("name"));
		await user.type(screen.getByTestId("name"), "Updated wet distribution");
		await user.selectOptions(screen.getByTestId("ecoDesignControllerClass"), "1");
		await user.tab();

		const actual = store.spaceHeating.heatEmitting.wetDistribution.data[1]!.data;
		expect(actual.name).toBe("Updated wet distribution");
		expect(actual.ecoDesignControllerClass).toBe("1");
	});
});
