import { mapAirPermeabilityData, mapInfiltrationVentilationData, mapMechanicalVentilationData, mapVentilationData, mapVentsData } from "./infiltrationVentilationMapper";
import { litrePerSecond } from "~/utils/units/flowRate";
import { unitValue } from "~/utils/units";
import type { SchemaMechanicalVentilation } from "~/schema/aliases";

const baseForm = {
	data: [],
	complete: true,
};

describe("infiltration ventilation mapper", () => {
	const mechVentMvhr: EcaasForm<MechanicalVentilationData>[] = [{
		...baseForm,
		data: {
			id: "bathroom exhaust fan",
			name: "bathroom exhaust fan",
			typeOfMechanicalVentilationOptions: "MVHR",
			airFlowRate: unitValue(30, litrePerSecond),
			mvhrLocation: "inside",
			productReference: "1000",
			midHeightOfAirFlowPathForExhaust: 1.5,
			orientationOfExhaust: 90,
			pitchOfExhaust: 10,
			midHeightOfAirFlowPathForIntake: 1.5,
			orientationOfIntake: 80,
			pitchOfIntake: 10,
			installedUnderApprovedScheme: true,
			measuredFanPowerAndAirFlowRateKnown: true,
			measuredAirFlowRate: 37,
			measuredFanPower: 12.26,
			associatedItemId: "none",
			hasAssociatedItem: false,
			pitch: 90,
			orientation: 180,
		},
	}];

	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it("maps mechanical ventilation of type MVHR input state to FHS input request", () => {
		// Arrange
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					...baseForm,
					data: mechVentMvhr,
				},
				naturalVentilation: {
					...baseForm,
					data: {
						ventilationZoneHeight: 20,
						dwellingEnvelopeArea: 20,
						baseHeightOfVentilationZone: 0,
						maxRequiredAirChangeRate: 5,
					},
				},
				airPermeability: {
					...baseForm,
					data: {
						testPressure: "Pulse test only",
						airTightnessTestResult: 2.2,
					},
				},
				vents: {
					...baseForm,
				},
			},
		});

		// Act
		const fhsInputData = mapInfiltrationVentilationData(resolveState(store.$state));

		// Assert
		expect(fhsInputData.InfiltrationVentilation).toBeDefined();
		expect(fhsInputData.InfiltrationVentilation?.MechanicalVentilation).toBeDefined();

		const firstMechVent = fhsInputData.InfiltrationVentilation!.MechanicalVentilation!["bathroom exhaust fan"] as Extract<SchemaMechanicalVentilation, { vent_type: "MVHR" }>;
		expect(firstMechVent).toBeDefined();
		expect(firstMechVent?.EnergySupply).toBe("mains elec");
		expect(firstMechVent?.vent_type).toBe("MVHR");
		expect(firstMechVent?.design_outdoor_air_flow_rate).toBe(108);
		expect(firstMechVent?.mvhr_location).toBe("inside");
		expect("measured_air_flow_rate" in firstMechVent && firstMechVent?.measured_air_flow_rate).toBe(37); // NOTE - hardcoded to sensible default for now
		expect("measured_fan_power" in firstMechVent && firstMechVent?.measured_fan_power).toBe(12.26); // NOTE - hardcoded to sensible default for now
		expect(firstMechVent?.ductwork).toBeDefined();
		expect(firstMechVent.position_exhaust).toEqual({
			mid_height_air_flow_path: 1.5,
			orientation360: 90,
			pitch: 10,
		});
		expect(firstMechVent.position_intake).toEqual({
			mid_height_air_flow_path: 1.5,
			orientation360: 80,
			pitch: 10,
		});
	});


	it("maps ductwork input state to FHS input request", () => {
		// Arrange

		const ductwork: EcaasForm<DuctworkData>[] = [{
			...baseForm,
			data: {
				name: "ductwork 1",
				mvhrUnit: "bathroom exhaust fan",
				ductworkCrossSectionalShape: "circular",
				internalDiameterOfDuctwork: 200,
				externalDiameterOfDuctwork: 300,
				lengthOfDuctwork: 10.0,
				thermalInsulationConductivityOfDuctwork: 0.023,
				insulationThickness: 100,
				surfaceReflectivity: false,
				ductType: "extract",
			},
		}];

		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					...baseForm,
					data: mechVentMvhr,
				},
				ductwork: {
					...baseForm,
					data: ductwork,
				},
				naturalVentilation: {
					...baseForm,
					data: {},
				},
				airPermeability: {
					...baseForm,
					data: {
						testPressure: "Pulse test only",
						airTightnessTestResult: 2.2,
					},
				},
				vents: {
					...baseForm,
				},
			},
		});

		// Act
		const fhsInputData = mapInfiltrationVentilationData(resolveState(store.$state));

		// Assert
		const firstMechVent = fhsInputData.InfiltrationVentilation!.MechanicalVentilation!["bathroom exhaust fan"] as Extract<SchemaMechanicalVentilation, { vent_type: "MVHR" }>;;
		const firstDuctwork = firstMechVent.ductwork[0];

		expect(firstDuctwork?.cross_section_shape).toBe("circular");
		expect(firstDuctwork?.internal_diameter_mm).toBe(200);
		expect(firstDuctwork?.external_diameter_mm).toBe(300);
		expect(firstDuctwork?.length).toBe(10);
		expect(firstDuctwork?.insulation_thermal_conductivity).toBe(0.023);
		expect(firstDuctwork?.insulation_thickness_mm).toBe(100);
		expect(firstDuctwork?.reflective).toBe(false);
		expect(firstDuctwork?.duct_type).toBe("extract");
	});

	it("maps input state for MVHR without ductwork to FHS input request", () => {
		// Arrange

		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					...baseForm,
					data: mechVentMvhr,
				},
				airPermeability: {
					...baseForm,
					data: {
						testPressure: "Pulse test only",
						airTightnessTestResult: 2.2,
					},
				},
				naturalVentilation: {
					...baseForm,
					data: {},
				},
				vents: {
					...baseForm,
				},
			},
		});

		// Act
		const fhsInputData = mapInfiltrationVentilationData(resolveState(store.$state));

		// Assert
		const firstMechVent = fhsInputData.InfiltrationVentilation!.MechanicalVentilation!["bathroom exhaust fan"] as Extract<SchemaMechanicalVentilation, { vent_type: "MVHR" }>;;

		expect(firstMechVent.ductwork).toStrictEqual([]);
	});



	it("maps mechanical ventilation of type intermittent MEV input state to FHS input request", () => {
		// Arrange
		const mechVent: EcaasForm<MechanicalVentilationData>[] = [{
			...baseForm,
			data: {
				id: "bathroom exhaust fan",
				name: "bathroom exhaust fan",
				typeOfMechanicalVentilationOptions: "Intermittent MEV",
				airFlowRate: unitValue(40, litrePerSecond),
				specificFanPower: 50,
				midHeightOfAirFlowPath: 10,
				associatedItemId: "none",
				hasAssociatedItem: false,
				pitch: 90,
				orientation: 180,
			},
		}];

		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					...baseForm,
					data: mechVent,
				},
			},
		});

		// Act
		const fhsInputData = mapMechanicalVentilationData(resolveState(store.$state));

		// Assert
		const firstMechVent = fhsInputData["bathroom exhaust fan"] as Extract<SchemaMechanicalVentilation, { vent_type: "MVHR" }>;;
		expect(firstMechVent).toBeDefined();
		expect(firstMechVent).toStrictEqual({
			vent_type: "Intermittent MEV",
			EnergySupply: "mains elec",
			design_outdoor_air_flow_rate: 144,
			SFP: 50,
			mid_height_air_flow_path: 10,
			pitch: 90,
			orientation360: 180,
		});
	});

	it("maps vents to FHS input request", async () => {
		const ventName = "Acme";

		// Arrange
		const externalWallId = "80fd1ffe-a83a-4d95-bd2c-ad8fdc37b421";
		const externalWall: EcaasForm<ExternalWallData>[] = [
			{
				...baseForm,
				data: {
					id: externalWallId,
					name: "External wall 1",
					pitchOption: "custom",
					pitch: 45,
					orientation: 180,
					length: 20,
					height: 0.5,
					elevationalHeight: 20,
					surfaceArea: 10,
					uValue: 1,
					colour: "Intermediate",
					arealHeatCapacity: "Very light",
					massDistributionClass: "I",
				},
			},
		];

		const window: WindowData = {
			id: "test-id-1",
			name: "Window 1",
			taggedItem: externalWallId,
			height: 1,
			width: 1,
			uValue: 1,
			solarTransmittance: 0.1,
			elevationalHeight: 1,
			numberOpenableParts: "1",
			curtainsOrBlinds: true,
			treatmentType: "blinds",
			thermalResistivityIncrease: 1,
			solarTransmittanceReduction: 0.1,
			midHeightOpenablePart1: 1,
			openingToFrameRatio: 0.3,
			maximumOpenableArea: 1,
			securityRisk: false,
			hasShading: false,
		};

		const ventData: EcaasForm<VentData>[] = [
			{
				...baseForm,
				data: {
					name: ventName,
					associatedItemId: window.id,
					effectiveVentilationArea: 100,
					openingRatio: 0.6,
					midHeightOfZone: 1.5,
					hasAssociatedItem: true,
				},
			},
		];
		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					...baseForm,
					data: ventData,
				},
			},
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: {
						...baseForm,
						data: externalWall,
					},
				},
				dwellingSpaceWindows: {
					data: [
						{
							data: window,
							complete: true,
						},
					],
					complete: true,
				},
			},
		});

		// Act
		const fhsInputData = mapVentsData(resolveState(store.$state));

		// Assert
		const vent = fhsInputData[ventName];
		expect(vent?.area_cm2).toBe(100);
		expect(vent?.mid_height_air_flow_path).toBe(1.5);
		expect(vent?.orientation360).toBe(180);
		expect(vent?.pitch).toBe(45);
	});

	it("maps vents to FHS input request when associated item is not selected", () => {
		const ventName = "Acme";

		// Arrange
		const ventData: EcaasForm<VentData>[] = [
			{
				...baseForm,
				data: {
					name: ventName,
					effectiveVentilationArea: 100,
					openingRatio: 0.6,
					midHeightOfZone: 1.5,
					pitch: 45,
					orientation: 180,
					hasAssociatedItem: false,
					associatedItemId: "none",
				},
			},
		];

		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					...baseForm,
					data: ventData,
				},
			},
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: [
						{
							data: window,
							complete: true,
						},
					],
					complete: true,
				},
			},
		});

		// Act
		const fhsInputData = mapVentsData(resolveState(store.$state));

		// Assert
		const vent = fhsInputData[ventName];
		expect(vent?.area_cm2).toBe(100);
		expect(vent?.mid_height_air_flow_path).toBe(1.5);
		expect(vent?.orientation360).toBe(180);
		expect(vent?.pitch).toBe(45);
	});

	it("maps vents to FHS input request when associated item is 'None of the above'", async () => {
		const ventName = "Acme";

		// Arrange
		const ventData: EcaasForm<VentData>[] = [
			{
				...baseForm,
				data: {
					name: ventName,
					associatedItemId: "none",
					effectiveVentilationArea: 100,
					openingRatio: 0.6,
					midHeightOfZone: 1.5,
					pitch: 45,
					orientation: 180,
					hasAssociatedItem: false,
				},
			},
		];

		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					...baseForm,
					data: ventData,
				},
			},
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: [
						{
							data: window,
							complete: true,
						},
					],
					complete: true,
				},
			},
		});

		// Act
		const fhsInputData = mapVentsData(resolveState(store.$state));

		// Assert
		const vent = fhsInputData[ventName];
		expect(vent?.area_cm2).toBe(100);
		expect(vent?.mid_height_air_flow_path).toBe(1.5);
		expect(vent?.orientation360).toBe(180);
		expect(vent?.pitch).toBe(45);
	});


	it("maps ventilation data to extract needed fields", async () => {
		// Arrange
		const ventilationData: VentilationData = {
			ventilationZoneHeight: 10,
			dwellingEnvelopeArea: 200,
			baseHeightOfVentilationZone: 4,
			maxRequiredAirChangeRate: 1.5,
		};

		store.$patch({
			infiltrationAndVentilation: {
				naturalVentilation: {
					...baseForm,
					data: ventilationData,
				},
			},
		});

		// Act
		const fhsInputData = mapVentilationData(resolveState(store.$state));
		const expectedVentilationData = {
			dwellingHeight: 10,
			dwellingEnvelopeArea: 200,
			baseHeightOfVentilationZone: 4,
		};
		expect(fhsInputData).toEqual(expectedVentilationData);
	});

	it("maps air permeability data to extract needed fields", async () => {
		// Arrange
		const airPermeabilityData: AirPermeabilityData = {
			testPressure: "Standard",
			airTightnessTestResult: 5,
		};

		store.$patch({
			infiltrationAndVentilation: {
				airPermeability: {
					...baseForm,
					data: airPermeabilityData,
				},
			},
		});

		// Act
		const fhsInputData = mapAirPermeabilityData(resolveState(store.$state));

		// Assert
		expect(fhsInputData.test_pressure).toBe("Standard");
		expect(fhsInputData.test_result).toBe(5);
	});
});
