import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import MechanicalVentilationOverview from "./index.vue";
import { renderSuspended } from "@nuxt/test-utils/runtime";

describe("mechanical ventilation overview", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const mechanicalVentilation1: MechanicalVentilationObject = {
		name: "Mechanical name 1",
		typeOfMechanicalVentilationOptions: "mvhr",
		controlForSupplyAirflow: "load",
		supplyAirTemperatureControl: "odaComp",
		airFlowRate: 12,
		mvhrLocation: "inside",
		mvhrEfficiency: 0.1,
		ductworkCrossSectionalShape: "circular",
		ductTape: "intake",
		internalDiameterOfDuctwork: 300,
		externalDiameterOfDuctwork: 1000,
		insulationThickness: 100,
		lengthOfDucwork: 100,
		thermalInsulationConductivityOfDuctwork: 10,
		surfaceReflectivity: "reflective",
	};

	const mechanicalVentilation2: MechanicalVentilationObject = {
		name: "Mechanical name 2",
		typeOfMechanicalVentilationOptions: "decentralisedContinuous",
		controlForSupplyAirflow: "oda",
		supplyAirTemperatureControl: "odaComp",
		airFlowRate: 14,
		mvhrLocation: undefined,
		mvhrEfficiency: undefined,
		ductworkCrossSectionalShape: undefined,
		ductTape: undefined,
		internalDiameterOfDuctwork: undefined,
		externalDiameterOfDuctwork: undefined,
		insulationThickness: undefined,
		lengthOfDucwork: undefined,
		thermalInsulationConductivityOfDuctwork: undefined,
		surfaceReflectivity: undefined,
	};

	const mechanicalVentilation3: MechanicalVentilationObject = {
		name: "Mechanical name 3",
		typeOfMechanicalVentilationOptions: "intermittent",
		controlForSupplyAirflow: "oda",
		supplyAirTemperatureControl: "odaComp",
		airFlowRate: 14,
		mvhrLocation: undefined,
		mvhrEfficiency: undefined,
		ductworkCrossSectionalShape: undefined,
		ductTape: undefined,
		internalDiameterOfDuctwork: undefined,
		externalDiameterOfDuctwork: undefined,
		insulationThickness: undefined,
		lengthOfDucwork: undefined,
		thermalInsulationConductivityOfDuctwork: undefined,
		surfaceReflectivity: undefined,
	};

	afterEach(() => {
		store.$reset();
	});

	it("mechanical ventilation is removed when remove button is clicked", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: {
						mechanicalVentilationObjects: [mechanicalVentilation1],
					},
				},
			},
		});
		await renderSuspended(MechanicalVentilationOverview);
		expect(screen.getAllByTestId("mechanicalVentilation_items")).toBeDefined();
		await user.click(screen.getByTestId("mechanicalVentilation_remove_0"));

		expect(screen.queryByTestId("mechanicalVentilation_items")).toBeNull();
	});
	it("should only remove the mechanical ventilation object that is clicked", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: {
						mechanicalVentilationObjects: [
							mechanicalVentilation1,
							mechanicalVentilation2,
							mechanicalVentilation3,
						],
					},
				},
			},
		});
		await renderSuspended(MechanicalVentilationOverview);
		expect(
			screen.getAllByTestId("mechanicalVentilation_items")
		).toBeDefined();
		await user.click(screen.getByTestId("mechanicalVentilation_remove_1"));
		expect(screen.queryByTestId("mechanicalVentilation_1")).toBeNull();
		expect(screen.queryByTestId("mechanicalVentilation_0")).toBeDefined();
		expect(screen.queryByTestId("mechanicalVentilation_2")).toBeDefined();
	});

	it("should duplicate mechanical ventilation object when duplicate button is clicked", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: {
						mechanicalVentilationObjects: [
							mechanicalVentilation1,
							mechanicalVentilation2,
						],
					},
				},
			},
		});
		await renderSuspended(MechanicalVentilationOverview);

		await renderSuspended(MechanicalVentilationOverview);
		await userEvent.click(
			screen.getByTestId("mechanicalVentilation_duplicate_0")
		);
		await userEvent.click(
			screen.getByTestId("mechanicalVentilation_duplicate_0")
		);
		await userEvent.click(
			screen.getByTestId("mechanicalVentilation_duplicate_2")
		);
		await userEvent.click(
			screen.getByTestId("mechanicalVentilation_duplicate_2")
		);

		expect(screen.queryAllByTestId("mechanicalVentilation_item").length).toBe(
			6
		);
		expect(screen.getByText("Mechanical name 1")).toBeDefined();
		expect(screen.getByText("Mechanical name 1 (1)")).toBeDefined();
		expect(screen.getByText("Mechanical name 1 (2)")).toBeDefined();
		expect(screen.getByText("Mechanical name 1 (1) (1)")).toBeDefined();
		expect(screen.getByText("Mechanical name 1 (1) (2)")).toBeDefined();
	});
});
