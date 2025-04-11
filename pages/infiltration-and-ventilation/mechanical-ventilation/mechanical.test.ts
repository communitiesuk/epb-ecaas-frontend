import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import MechanicalVentilationOverview from "./index.vue";
import { renderSuspended } from "@nuxt/test-utils/runtime";
import InfiltrationAndVentilationTaskPage from "../index.vue";

describe("mechanical ventilation overview", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const mechanicalVentilation1: MechanicalVentilationData = {
		id: "5124f2fe-f15b-4a56-ba5a-1a7751ac506f",
		name: "Mechanical name 1",
		typeOfMechanicalVentilationOptions: "mvhr",
		controlForSupplyAirflow: "load",
		supplyAirTemperatureControl: "odaComp",
		airFlowRate: 12,
		mvhrLocation: "inside",
		mvhrEfficiency: 0.1,

	};

	const mechanicalVentilation2: MechanicalVentilationData = {
		id: "7184f2fe-a78f-4a56-ba5a-1a7751ac506d",
		name: "Mechanical name 2",
		typeOfMechanicalVentilationOptions: "decentralisedContinuous",
		controlForSupplyAirflow: "oda",
		supplyAirTemperatureControl: "odaComp",
		airFlowRate: 14,
		mvhrLocation: undefined,
		mvhrEfficiency: undefined,
	};

	const mechanicalVentilation3: MechanicalVentilationData = {
		id: "6380f2fe-a78f-4a56-ba5a-1a7751ac502a",
		name: "Mechanical name 3",
		typeOfMechanicalVentilationOptions: "intermittent",
		controlForSupplyAirflow: "oda",
		supplyAirTemperatureControl: "odaComp",
		airFlowRate: 14,
		mvhrLocation: undefined,
		mvhrEfficiency: undefined,
	};

	const mechanicalVentilation4: MechanicalVentilationData = {
		id: "6746f2fe-f15b-4a56-ba5a-1a7751ac89hh",
		name: "Mechanical name 4",
		typeOfMechanicalVentilationOptions: "mvhr",
		controlForSupplyAirflow: "load",
		supplyAirTemperatureControl: "odaComp",
		airFlowRate: 12,
		mvhrLocation: "inside",
		mvhrEfficiency: 0.1,

	};

	// linked to mechanicalVentilation1
	const ductwork1: DuctworkData = {
		name: 'Ductwork 1',
		mvhrUnit: '5124f2fe-f15b-4a56-ba5a-1a7751ac506f',
		ductworkCrossSectionalShape: "circular",
		ductType: "intake",
		internalDiameterOfDuctwork: 300,
		externalDiameterOfDuctwork: 1000,
		insulationThickness: 100,
		lengthOfDuctwork: 100,
		thermalInsulationConductivityOfDuctwork: 10,
		surfaceReflectivity: "reflective",
	};

	// linked to mechanicalVentilation1
	const ductwork2: DuctworkData = {
		name: 'Ductwork 2',
		mvhrUnit: '5124f2fe-f15b-4a56-ba5a-1a7751ac506f',
		ductworkCrossSectionalShape: "circular",
		ductType: "intake",
		internalDiameterOfDuctwork: 300,
		externalDiameterOfDuctwork: 1000,
		insulationThickness: 100,
		lengthOfDuctwork: 100,
		thermalInsulationConductivityOfDuctwork: 10,
		surfaceReflectivity: "reflective",
	};

	// linked to mechanicalVentilation4
	const ductwork3: DuctworkData = {
		name: 'Ductwork 3',
		mvhrUnit: '6746f2fe-f15b-4a56-ba5a-1a7751ac89hh',
		ductworkCrossSectionalShape: "circular",
		ductType: "intake",
		internalDiameterOfDuctwork: 300,
		externalDiameterOfDuctwork: 1000,
		insulationThickness: 100,
		lengthOfDuctwork: 100,
		thermalInsulationConductivityOfDuctwork: 10,
		surfaceReflectivity: "reflective",
	};

	afterEach(() => {
		store.$reset();
	});

	it("mechanical ventilation is removed when remove button is clicked", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [mechanicalVentilation1],
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
					data: [
						mechanicalVentilation1,
						mechanicalVentilation2,
						mechanicalVentilation3
					],
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

	it("should remove the associated ductwork when a MVHR mechanical ventilation object is removed", async() => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [
						mechanicalVentilation1,
						mechanicalVentilation4,
					],
				},
				ductwork :{
					data: [
						ductwork1,
						ductwork2,
						ductwork3
					]
				}
			},
		});
		await renderSuspended(MechanicalVentilationOverview);
		await user.click(screen.getByTestId("mechanicalVentilation_remove_0"));
		expect(store.infiltrationAndVentilation.ductwork.data).toEqual([ductwork3]);

		await user.click(screen.getByTestId("mechanicalVentilation_remove_0"));
		expect(store.infiltrationAndVentilation.ductwork.data).toEqual([]);

		await renderSuspended(InfiltrationAndVentilationTaskPage,{
			route: {
				path: '/infiltration-and-ventilation'
			}
		});
		expect(screen.queryByText('MVHR ductwork')).toBeNull();
	});

	it("should duplicate mechanical ventilation object when duplicate button is clicked", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [
						mechanicalVentilation1,
						mechanicalVentilation2
					],
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

	it("should not duplicate the id when duplicating the mechanical ventilation object", async() => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [
						mechanicalVentilation1
					],
				},
			},
		});
		await renderSuspended(MechanicalVentilationOverview);
		await userEvent.click(
			screen.getByTestId("mechanicalVentilation_duplicate_0")
		);
		expect(store.infiltrationAndVentilation.mechanicalVentilation.data[0]["id"]).not.toBe(store.infiltrationAndVentilation.mechanicalVentilation.data[1]["id"]);
	});
});
