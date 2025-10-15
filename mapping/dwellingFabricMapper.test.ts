import type {
	SchemaBuildingElementAdjacentUnconditionedSpaceSimple, 
} from "~/schema/api-schema.types";
import type { BuildingElementGround, BuildingElementOfType, SchemaThermalBridgingLinearFhs, SchemaThermalBridgingPoint, SchemaEdgeInsulationHorizontal } from "~/schema/aliases";
import { mapCeilingAndRoofData, mapDoorData, mapFloorData, mapLightingData, mapThermalBridgingData, mapWallData, mapWindowData, mapZoneParametersData } from "./dwellingFabricMapper";
import { defaultZoneName } from "./common";
import type { DwellingSpaceLightingData, DwellingSpaceZoneParametersData } from "~/stores/ecaasStore.schema";
import { centimetre, millimetre } from "../utils/units/length";
import { unitValue } from "~/utils/units";

type BuildingElementOpaque = BuildingElementOfType<"BuildingElementOpaque">;
type BuildingElementAdjacentConditionedSpace = BuildingElementOfType<"BuildingElementAdjacentConditionedSpace">;
type BuildingElementAdjacentUnconditionedSpaceSimple = SchemaBuildingElementAdjacentUnconditionedSpaceSimple;
type BuildingElementTransparent = BuildingElementOfType<"BuildingElementTransparent">;

const baseForm = {
	data: [],
	complete: true as const,
};

describe("dwelling fabric mapper", () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it("maps zone parameters input state to FHS input request", () => {
		// Arrange
		const state: DwellingSpaceZoneParametersData = {
			area: 10,
			volume: 10,
			// spaceHeatingSystemForThisZone: 'main 1',
			spaceCoolingSystemForThisZone: [],
			spaceHeatControlSystemForThisZone: [],
		};

		store.$patch({
			heatingAndCoolingSystems: {
				heatEmitting: {
					wetDistribution: {
						...baseForm,
						data: [{
							...baseForm,
							data: { name: "radiator 1" },
						}],
					},
					instantElectricHeater: {
						...baseForm,
						data: [{
							...baseForm,
							data: {
								name: "ieh 1",
							},
						}],
					},
				},
			},
			dwellingFabric: {
				dwellingSpaceZoneParameters: {
					data: state,
					complete: true,
				},
			},
		});

		// Act
		const fhsInputData = mapZoneParametersData(resolveState(store.$state));

		// Assert
		expect(fhsInputData.Zone[defaultZoneName]?.area).toBe(state.area);
		expect(fhsInputData.Zone[defaultZoneName]?.volume).toBe(state.volume);
		expect(fhsInputData.Zone[defaultZoneName]?.SpaceHeatSystem).toEqual(["radiator 1", "ieh 1"]);
	});

	it("maps lighting input state to FHS input request", () => {
		// Arrange
		const state: DwellingSpaceLightingData = {
			numberOfBulbs: 5,
		};

		store.$patch({
			dwellingFabric: {
				dwellingSpaceLighting: {
					data: state,
					complete: true,
				},
			},
		});

		// Act
		const fhsInputData = mapLightingData(resolveState(store.$state));

		// Assert
		expect(fhsInputData.Zone[defaultZoneName]?.Lighting?.bulbs?.count).toBe(state.numberOfBulbs);
	});

	it("maps floor input state to FHS input request", () => {
		// Arrange
		const groundFloor: GroundFloorData = {
			name: "Ground 1",
			surfaceArea: 5,
			pitch: 180,
			uValue: 1,
			thermalResistance: 1,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
			perimeter: 0,
			psiOfWallJunction: 0,
			thicknessOfWalls: 30,
			typeOfGroundFloor: "Slab_no_edge_insulation",
		};

		const groundFloorWithEdgeInsulation: GroundFloorData = {
			...groundFloor,
			name: "Ground 2",
			typeOfGroundFloor: "Slab_edge_insulation",
			edgeInsulationType: "horizontal",
			edgeInsulationWidth: unitValue(36, centimetre),
			edgeInsulationThermalResistance: 0,
		};

		const groundFloorWithSuspendedFloor: GroundFloorData = {
			...groundFloor,
			name: "Ground 3",
			typeOfGroundFloor: "Suspended_floor",
			heightOfFloorUpperSurface: 100,
			underfloorSpaceThermalResistance: 1,
			thermalTransmittanceOfWallsAboveGround: 1,
			ventilationOpeningsArea: 100,
			windShieldingFactor: "Average",
		};

		const groundFloorWithHeatedBasement: GroundFloorData = {
			...groundFloor,
			name: "Ground 4",
			typeOfGroundFloor: "Heated_basement",
			depthOfBasementFloorBelowGround: 1,
			thermalResistanceOfBasementWalls: 1,
		};

		const groundFloorWithUnheatedBasement: GroundFloorData = {
			...groundFloor,
			name: "Ground 5",
			typeOfGroundFloor: "Unheated_basement",
			thermalTransmittanceOfFloorAboveBasement: 1,
			thermalTransmittanceOfWallsAboveGround: 1,
			depthOfBasementFloorBelowGround: 1,
			heightOfBasementWallsAboveGround: 1,
			thermalResistanceOfBasementWalls: 2.5,
		};

		const internalFloor: InternalFloorData = {
			typeOfInternalFloor: AdjacentSpaceType.unheatedSpace,
			name: "Internal 1",
			surfaceAreaOfElement: 5,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
			thermalResistanceOfAdjacentUnheatedSpace: 1,
		};

		const exposedFloor: ExposedFloorData = {
			name: "Exposed Floor 1",
			pitch: 180,
			orientation: 0,
			length: 0.5,
			width: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorption: 0.1,
			uValue: 1,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
		};

		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceGroundFloor: {
						...baseForm,
						data: [
							{ ...baseForm, data: groundFloor },
							{ ...baseForm, data: groundFloorWithEdgeInsulation },
							{ ...baseForm, data: groundFloorWithSuspendedFloor },
							{ ...baseForm, data: groundFloorWithHeatedBasement },
							{ ...baseForm, data: groundFloorWithUnheatedBasement },
						],
					},
					dwellingSpaceInternalFloor: { ...baseForm, data: [{ ...baseForm, data: internalFloor }] },
					dwellingSpaceExposedFloor: { ...baseForm, data: [{ ...baseForm, data: exposedFloor }] },
				},
			},
		});

		const groundFloorsTotalArea = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.data.length * groundFloor.surfaceArea;
		const floorSuffix = " (floor)";

		// Act
		const fhsInputData = mapFloorData(resolveState(store.$state));

		// Assert
		const groundFloorElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[groundFloor.name + floorSuffix]! as BuildingElementGround;
		const groundFloorWithEdgeInsulationElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[groundFloorWithEdgeInsulation.name + floorSuffix]! as BuildingElementGround;
		const groundFloorWithSuspendedFloorElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[groundFloorWithSuspendedFloor.name + floorSuffix]! as BuildingElementGround;
		const groundFloorWithHeatedBasementElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[groundFloorWithHeatedBasement.name + floorSuffix]! as BuildingElementGround;
		const groundFloorWithUnheatedBasementElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[groundFloorWithUnheatedBasement.name + floorSuffix]! as BuildingElementGround;
		const internalFloorElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[internalFloor.name + floorSuffix] as BuildingElementAdjacentUnconditionedSpaceSimple;
		const exposedFloorElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[exposedFloor.name + floorSuffix] as BuildingElementOpaque;

		expect(fhsInputData.GroundFloorArea).toBe(groundFloorsTotalArea);

		const expectedGroundFloor: BuildingElementGround = {
			type: "BuildingElementGround",
			area: groundFloor.surfaceArea,
			total_area: groundFloor.surfaceArea,
			pitch: groundFloor.pitch,
			u_value: groundFloor.uValue,
			thermal_resistance_floor_construction: groundFloor.thermalResistance,
			areal_heat_capacity: groundFloor.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(groundFloor.massDistributionClass),
			perimeter: groundFloor.perimeter,
			psi_wall_floor_junc: groundFloor.psiOfWallJunction,
			thickness_walls: groundFloor.thicknessOfWalls / 1000,
			floor_type: groundFloor.typeOfGroundFloor,
		};

		expect(groundFloorElement).toEqual(expectedGroundFloor);

		const expectedEdgeInsulation: SchemaEdgeInsulationHorizontal = {
			type: "horizontal",
			edge_thermal_resistance: groundFloorWithEdgeInsulation.edgeInsulationThermalResistance,
			width: 0.36,
		};

		expect(groundFloorWithEdgeInsulationElement.edge_insulation![0]).toEqual(expectedEdgeInsulation);

		const expectedGroundFloorSuspendedFloor: BuildingElementGround = {
			...expectedGroundFloor,
			floor_type: groundFloorWithSuspendedFloor.typeOfGroundFloor,
			height_upper_surface: groundFloorWithSuspendedFloor.heightOfFloorUpperSurface / 1000,
			thickness_walls: groundFloorWithSuspendedFloor.thicknessOfWalls / 1000,
			thermal_resist_insul: groundFloorWithSuspendedFloor.underfloorSpaceThermalResistance,
			thermal_transm_walls: groundFloorWithSuspendedFloor.thermalTransmittanceOfWallsAboveGround,
			area_per_perimeter_vent: groundFloorWithSuspendedFloor.ventilationOpeningsArea / 1e6,
			shield_fact_location: groundFloorWithSuspendedFloor.windShieldingFactor,
		};

		expect(groundFloorWithSuspendedFloorElement).toEqual(expectedGroundFloorSuspendedFloor);

		const expectedGroundFloorWithHeatedBasement: BuildingElementGround = {
			...expectedGroundFloor,
			floor_type: groundFloorWithHeatedBasement.typeOfGroundFloor,
			depth_basement_floor: groundFloorWithHeatedBasement.depthOfBasementFloorBelowGround,
			thermal_resist_walls_base: groundFloorWithHeatedBasement.thermalResistanceOfBasementWalls,
		};

		expect(groundFloorWithHeatedBasementElement).toEqual(expectedGroundFloorWithHeatedBasement);

		const expectedGroundFloorWithUnheatedBasement: BuildingElementGround = {
			...expectedGroundFloor,
			floor_type: groundFloorWithUnheatedBasement.typeOfGroundFloor,
			thermal_transm_envi_base: groundFloorWithUnheatedBasement.thermalTransmittanceOfFloorAboveBasement,
			height_basement_walls: groundFloorWithUnheatedBasement.heightOfBasementWallsAboveGround,
			thermal_transm_walls: groundFloorWithUnheatedBasement.thermalTransmittanceOfWallsAboveGround,
			depth_basement_floor: groundFloorWithUnheatedBasement.depthOfBasementFloorBelowGround,
			thermal_resist_walls_base: groundFloorWithUnheatedBasement.thermalResistanceOfBasementWalls,
		};

		expect(groundFloorWithUnheatedBasementElement).toEqual(expectedGroundFloorWithUnheatedBasement);

		const expectedInternalFloor: BuildingElementAdjacentUnconditionedSpaceSimple = {
			type: "BuildingElementAdjacentUnconditionedSpace_Simple",
			area: internalFloor.surfaceAreaOfElement,
			pitch: 180,
			u_value: 0.01,
			areal_heat_capacity: internalFloor.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(internalFloor.massDistributionClass),
			thermal_resistance_unconditioned_space: internalFloor.thermalResistanceOfAdjacentUnheatedSpace,
		};

		expect(internalFloorElement).toEqual(expectedInternalFloor);

		const expectedExposedFloor: BuildingElementOpaque = {
			type: "BuildingElementOpaque",
			area: exposedFloor.surfaceArea,
			height: exposedFloor.length,
			width: exposedFloor.width,
			base_height: exposedFloor.elevationalHeight,
			solar_absorption_coeff: exposedFloor.solarAbsorption,
			pitch: exposedFloor.pitch,
			u_value: exposedFloor.uValue,
			areal_heat_capacity: exposedFloor.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(exposedFloor.massDistributionClass),
			orientation360: exposedFloor.orientation,
			is_external_door: false,
		};

		expect(exposedFloorElement).toEqual(expectedExposedFloor);
	});

	it("maps wall input state to FHS input request", () => {
		// Arrange
		const externalWall: EcaasForm<ExternalWallData> = {
			...baseForm,
			data: {
				name: "External wall 1",
				pitchOption: "90",
				pitch: 90,
				orientation: 0,
				length: 20,
				height: 0.5,
				elevationalHeight: 20,
				surfaceArea: 10,
				solarAbsorption: 0.1,
				uValue: 1,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
			},
		};

		const internalWall: EcaasForm<InternalWallData> = {
			...baseForm,
			data: {
				name: "Internal 1",
				surfaceAreaOfElement: 5,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
				pitchOption: "90",
				pitch: 90,
			},
		};

		const partyWall: EcaasForm<PartyWallData> = {
			...baseForm,
			data: {
				name: "Party wall 1",
				pitchOption: "90",
				pitch: 90,
				surfaceArea: 10,
				uValue: 1,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
			},
		};

		const wallToUnheatedSpace: EcaasForm<WallsToUnheatedSpaceData> = {
			...baseForm,
			data: {
				name: "Wall to unheated space 1",
				surfaceAreaOfElement: 500,
				uValue: 10,
				arealHeatCapacity: "Very light",
				massDistributionClass: "E",
				pitchOption: "90",
				pitch: 90,
				thermalResistanceOfAdjacentUnheatedSpace: 1,
			},
		};

		const wallSuffix = " (wall)";

		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: { ...baseForm, data: [externalWall] },
					dwellingSpaceInternalWall: { ...baseForm, data: [internalWall] },
					dwellingSpacePartyWall: { ...baseForm, data: [partyWall] },
					dwellingSpaceWallToUnheatedSpace: { ...baseForm, data: [wallToUnheatedSpace] },
				},
			},
		});

		// Act
		const fhsInputData = mapWallData(resolveState(store.$state));

		// Assert
		const externalWallElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[externalWall.data.name + wallSuffix]! as BuildingElementOpaque;
		const internalWallElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[internalWall.data.name + wallSuffix]! as BuildingElementAdjacentConditionedSpace;
		const partyWallElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[partyWall.data.name + wallSuffix]! as BuildingElementOpaque;
		const wallToUnheatedSpaceElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[wallToUnheatedSpace.data.name + wallSuffix] as BuildingElementAdjacentUnconditionedSpaceSimple;

		const expectedExternalWall: BuildingElementOpaque = {
			type: "BuildingElementOpaque",
			pitch: externalWall.data.pitch!,
			orientation360: externalWall.data.orientation,
			height: externalWall.data.height,
			width: externalWall.data.length,
			base_height: externalWall.data.elevationalHeight,
			area: externalWall.data.surfaceArea,
			solar_absorption_coeff: externalWall.data.solarAbsorption,
			u_value: externalWall.data.uValue,
			areal_heat_capacity: externalWall.data.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(externalWall.data.massDistributionClass),
			is_external_door: false,
		};

		expect(externalWallElement).toEqual(expectedExternalWall);

		const expectedInternalWall: BuildingElementAdjacentConditionedSpace = {
			type: "BuildingElementAdjacentConditionedSpace",
			pitch: internalWall.data.pitch!,
			area: internalWall.data.surfaceAreaOfElement,
			u_value: 0.01,
			areal_heat_capacity: internalWall.data.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(internalWall.data.massDistributionClass),
		};

		expect(internalWallElement).toEqual(expectedInternalWall);

		const expectedPartyWall: BuildingElementAdjacentConditionedSpace = {
			type: "BuildingElementAdjacentConditionedSpace",
			pitch: partyWall.data.pitch!,
			area: partyWall.data.surfaceArea,
			u_value: partyWall.data.uValue,
			areal_heat_capacity: partyWall.data.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(partyWall.data.massDistributionClass),
		};

		expect(partyWallElement).toEqual(expectedPartyWall);

		const expectedWallToUnheatedSpace: BuildingElementAdjacentUnconditionedSpaceSimple = {
			type: "BuildingElementAdjacentUnconditionedSpace_Simple",
			pitch: wallToUnheatedSpace.data.pitch!,
			area: wallToUnheatedSpace.data.surfaceAreaOfElement,
			u_value: wallToUnheatedSpace.data.uValue,
			areal_heat_capacity: wallToUnheatedSpace.data.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(wallToUnheatedSpace.data.massDistributionClass),
			thermal_resistance_unconditioned_space: wallToUnheatedSpace.data.thermalResistanceOfAdjacentUnheatedSpace,
		};

		expect(wallToUnheatedSpaceElement).toEqual(expectedWallToUnheatedSpace);
	});

	it("maps ceiling and roof input state to FHS input request", () => {
		// Arrange
		const ceiling: CeilingData = {
			type: AdjacentSpaceType.unheatedSpace,
			name: "Ceiling 1",
			surfaceArea: 5,
			uValue: 1,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
			pitchOption: "0",
			pitch: 0,
			thermalResistanceOfAdjacentUnheatedSpace: 1,
		};

		const roof: RoofData = {
			name: "Roof 1",
			typeOfRoof: "flat",
			pitchOption: "custom",
			pitch: 0,
			length: 1,
			width: 1,
			elevationalHeightOfElement: 2,
			surfaceArea: 1,
			solarAbsorptionCoefficient: 0.5,
			uValue: 1,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
		};

		const ceilingSuffix = " (ceiling)";
		const roofSuffix = " (roof)";

		store.$patch({
			dwellingFabric: {
				dwellingSpaceCeilingsAndRoofs: {
					dwellingSpaceCeilings: { ...baseForm, data: [{ ...baseForm, data: ceiling }] },
					dwellingSpaceRoofs: { ...baseForm, data: [{ ...baseForm, data: roof }] },
				},
			},
		});

		// Act
		const fhsInputData = mapCeilingAndRoofData(resolveState(store.$state));

		// Assert
		const ceilingElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[ceiling.name + ceilingSuffix]! as BuildingElementAdjacentUnconditionedSpaceSimple;
		const roofElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[roof.name + roofSuffix]! as BuildingElementOpaque;

		const expectedCeiling: BuildingElementAdjacentUnconditionedSpaceSimple = {
			type: "BuildingElementAdjacentUnconditionedSpace_Simple",
			pitch: extractPitch(ceiling),
			area: ceiling.surfaceArea,
			u_value: ceiling.uValue,
			areal_heat_capacity: ceiling.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(ceiling.massDistributionClass),
			thermal_resistance_unconditioned_space: ceiling.thermalResistanceOfAdjacentUnheatedSpace,
		};

		expect(ceilingElement).toEqual(expectedCeiling);

		const expectedRoof: BuildingElementOpaque = {
			type: "BuildingElementOpaque",
			pitch: roof.pitch,
			orientation360: 0,
			height: roof.length,
			width: roof.width,
			base_height: roof.elevationalHeightOfElement,
			area: roof.surfaceArea,
			solar_absorption_coeff: roof.solarAbsorptionCoefficient,
			u_value: roof.uValue,
			areal_heat_capacity: roof.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(roof.massDistributionClass),
			is_external_door: false,
			is_unheated_pitched_roof: false,
		};

		expect(roofElement).toEqual(expectedRoof);
	});

	it("maps door input state to FHS input request", () => {
		// Arrange
		const internalDoor: InternalDoorData = {
			typeOfInternalDoor: AdjacentSpaceType.unheatedSpace,
			name: "Internal 1",
			surfaceArea: 5,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
			pitchOption: "90",
			pitch: 90,
			uValue: 0.001,
			thermalResistanceOfAdjacentUnheatedSpace: 1,
		};

		const externalGlazedDoor: ExternalGlazedDoorData = {
			name: "External glazed door 1",
			orientation: 1,
			height: 1,
			width: 1,
			uValue: 1,
			pitchOption: "90",
			pitch: 90,
			solarTransmittance: 0.1,
			elevationalHeight: 1,
			midHeight: 1,
			openingToFrameRatio: 0.3,
			midHeightOpenablePart1: 1,
			maximumOpenableArea: 1,
			heightOpenableArea: 1,
		};

		const externalUnglazedDoor: ExternalUnglazedDoorData = {
			name: "External unglazed door 1",
			pitchOption: "90",
			pitch: 90,
			orientation: 0,
			height: 0.5,
			width: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorption: 0.1,
			uValue: 1,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
		};

		const doorSuffix = " (door)";

		store.$patch({
			dwellingFabric: {
				dwellingSpaceDoors: {
					dwellingSpaceInternalDoor: { ...baseForm, data: [{ ...baseForm, data: internalDoor }] },
					dwellingSpaceExternalGlazedDoor: { ...baseForm, data: [{ ...baseForm, data: externalGlazedDoor }] },
					dwellingSpaceExternalUnglazedDoor: { ...baseForm, data: [{ ...baseForm, data: externalUnglazedDoor }] },
				},
			},
		});

		// Act
		const fhsInputData = mapDoorData(resolveState(store.$state));

		// Assert
		const internalDoorElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[internalDoor.name + doorSuffix]! as BuildingElementAdjacentUnconditionedSpaceSimple;
		const externalGlazedDoorElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[externalGlazedDoor.name + doorSuffix]! as BuildingElementTransparent;
		const externalUnglazedDoorElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[externalUnglazedDoor.name + doorSuffix]! as BuildingElementOpaque;

		const expectedInternalDoor: BuildingElementAdjacentUnconditionedSpaceSimple = {
			type: "BuildingElementAdjacentUnconditionedSpace_Simple",
			pitch: internalDoor.pitch!,
			area: internalDoor.surfaceArea,
			u_value: internalDoor.uValue,
			areal_heat_capacity: internalDoor.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(internalDoor.massDistributionClass),
			thermal_resistance_unconditioned_space: internalDoor.thermalResistanceOfAdjacentUnheatedSpace,
		};

		expect(internalDoorElement).toEqual(expectedInternalDoor);

		const expectedExternalGlazedDoor: BuildingElementTransparent = {
			type: "BuildingElementTransparent",
			pitch: expectedInternalDoor.pitch,
			orientation360: externalGlazedDoor.orientation,
			height: externalGlazedDoor.height,
			width: externalGlazedDoor.width,
			mid_height: externalGlazedDoor.midHeight,
			base_height: externalGlazedDoor.elevationalHeight,
			g_value: externalGlazedDoor.solarTransmittance,
			u_value: externalGlazedDoor.uValue,
			frame_area_fraction: 1 - externalGlazedDoor.openingToFrameRatio,
			max_window_open_area: externalGlazedDoor.maximumOpenableArea,
			free_area_height: externalGlazedDoor.heightOpenableArea,
			window_part_list: [
				{ mid_height_air_flow_path: externalGlazedDoor.midHeightOpenablePart1 },
			],
			shading: [],
		};

		expect(externalGlazedDoorElement).toEqual(expectedExternalGlazedDoor);

		const expectedUnglazedDoor: BuildingElementOpaque = {
			type: "BuildingElementOpaque",
			pitch: externalUnglazedDoor.pitch!,
			orientation360: externalUnglazedDoor.orientation,
			height: externalUnglazedDoor.height,
			width: externalUnglazedDoor.width,
			base_height: externalUnglazedDoor.elevationalHeight,
			area: externalUnglazedDoor.surfaceArea,
			solar_absorption_coeff: externalUnglazedDoor.solarAbsorption,
			u_value: externalUnglazedDoor.uValue,
			areal_heat_capacity: externalUnglazedDoor.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(externalUnglazedDoor.massDistributionClass),
			is_external_door: true,
		};

		expect(externalUnglazedDoorElement).toEqual(expectedUnglazedDoor);
	});

	it("maps windows input state to FHS input request", () => {
		// Arrange
		const window: WindowData = {
			name: "Window 1",
			orientation: 180,
			// surfaceArea: 1,
			height: 1,
			width: 1,
			uValue: 1,
			pitchOption: "90",
			pitch: 90,
			solarTransmittance: 0.1,
			elevationalHeight: 1,
			midHeight: 1,
			numberOpenableParts: "1",
			overhangDepth: unitValue(1000, millimetre),
			overhangDistance: unitValue(1000, millimetre),
			sideFinRightDepth: unitValue(1000, millimetre),
			sideFinRightDistance: unitValue(1000, millimetre),
			sideFinLeftDepth: unitValue(1000, millimetre),
			sideFinLeftDistance: unitValue(1000, millimetre),
			curtainsOrBlinds: true,
			treatmentType: "blinds",
			thermalResistivityIncrease: 1,
			solarTransmittanceReduction: 0.1,
			midHeightOpenablePart1: 1,
			openingToFrameRatio: 0.3,
			maximumOpenableArea: 1,
			heightOpenableArea: 1,
		};

		const windowSuffix = " (window)";

		store.$patch({
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: [{
						data: window,
						complete: true,
					}],
					complete: true,
				},
			},
		});

		// Act
		const fhsInputData = mapWindowData(resolveState(store.$state));

		// Assert
		const windowElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[window.name + windowSuffix]! as BuildingElementTransparent;

		const expectedWindow: BuildingElementTransparent = {
			type: "BuildingElementTransparent",
			pitch: window.pitch!,
			orientation360: window.orientation,
			height: window.height,
			width: window.width,
			base_height: window.elevationalHeight,
			u_value: window.uValue,
			g_value: window.solarTransmittance,
			mid_height: window.midHeight,
			frame_area_fraction: 1 - window.openingToFrameRatio,
			max_window_open_area: window.maximumOpenableArea,
			free_area_height: window.heightOpenableArea,
			window_part_list: [{
				mid_height_air_flow_path: window.midHeightOpenablePart1,
			}],
			shading: [
				{
					type: "overhang",
					depth: 1,
					distance: 1,
				},
				{
					type: "sidefinleft",
					depth: 1,
					distance: 1,
				},
				{
					type: "sidefinright",
					depth: 1,
					distance: 1,
				},
			],
		};
		expect(windowElement).toEqual(expectedWindow);
	});

	it("maps thermal bridging input state to FHS input request", () => {
		// Arrange
		const linearThermalBridge: LinearThermalBridgeData = {
			name: "E1: Steel lintel with perforated steel base plate",
			typeOfThermalBridge: "E1",
			linearThermalTransmittance: 1,
			length: 2,
		};

		const pointThermalBridge: PointThermalBridgeData = {
			name: "Point 1",
			heatTransferCoefficient: 1,
		};

		const dwellingSpaceThermalBridging: ThermalBridgingData = {
			dwellingSpaceLinearThermalBridges: { ...baseForm, data: [{ ...baseForm, data: linearThermalBridge }] },
			dwellingSpacePointThermalBridges: { ...baseForm, data: [{ ...baseForm, data: pointThermalBridge }] },
		};

		const bridgeSuffix = " (bridge)";

		store.$patch({
			dwellingFabric: {
				dwellingSpaceThermalBridging,
			},
		});

		// Act
		const fhsInputData = mapThermalBridgingData(resolveState(store.$state));

		// Assert
		type ThermalBridging = { [key: string]: SchemaThermalBridgingLinearFhs | SchemaThermalBridgingPoint; };

		const thermalBridging = fhsInputData.Zone[defaultZoneName]!.ThermalBridging as ThermalBridging;

		const linearThermalBridgeElement = thermalBridging[linearThermalBridge.name + bridgeSuffix]! as SchemaThermalBridgingLinearFhs;
		const pointThermalBridgeElement = thermalBridging[pointThermalBridge.name + bridgeSuffix]! as SchemaThermalBridgingPoint;

		const expectedLinearThermalBridge: SchemaThermalBridgingLinearFhs = {
			type: "ThermalBridgeLinear",
			junction_type: "E1",
			linear_thermal_transmittance: linearThermalBridge.linearThermalTransmittance,
			length: linearThermalBridge.length,
		};

		expect(linearThermalBridgeElement).toEqual(expectedLinearThermalBridge);
		expect(pointThermalBridgeElement.heat_transfer_coeff).toBe(pointThermalBridge.heatTransferCoefficient);
	});
});