import { FloorType, MassDistributionClass, WindowShadingObjectType, WindowTreatmentType, type SchemaBuildingElement, type SchemaEdgeInsulation, type SchemaThermalBridgingDetails } from "~/schema/api-schema.types";
import { mapLivingSpaceFabricData } from "./livingSpaceFabricMapper";

type BuildingElementGround = Extract<SchemaBuildingElement, { type: 'BuildingElementGround' }>;
type BuildingElementOpaque = Extract<SchemaBuildingElement, { type: 'BuildingElementOpaque' }>;
type BuildingElementAdjacentConditionedSpace = Extract<SchemaBuildingElement, { type: 'BuildingElementAdjacentConditionedSpace' }>;
type BuildingElementAdjacentUnconditionedSpaceSimple = Extract<SchemaBuildingElement, { type: 'BuildingElementAdjacentUnconditionedSpace_Simple' }>;
type BuildingElementTransparent = Extract<SchemaBuildingElement, { type: 'BuildingElementTransparent' }>;

describe('living space fabric mapper', () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it('maps zone parameters input state to FHS input request', () => {
		// Arrange
		const state: LivingSpaceZoneParametersData = {
			area: 10,
			volume: 10,
			heatingControlType: 'separateTempControl',
			spaceHeatingSystemForThisZone: [],
			spaceCoolingSystemForThisZone: [],
			spaceHeatControlSystemForThisZone: []
		};

		store.$patch({
			livingSpaceFabric: {
				livingSpaceZoneParameters: {
					data: state
				}
			}
		});

		// Act
		const fhsInputData = mapLivingSpaceFabricData(store);

		// Assert
		expect(fhsInputData.Zone!['zone 1']?.area).toBe(state.area);
		expect(fhsInputData.Zone!['zone 1']?.volume).toBe(state.volume);
		expect(fhsInputData.Zone!['zone 1']?.SpaceHeatSystem).toEqual([]);
		expect(fhsInputData.Zone!['zone 1']?.SpaceCoolSystem).toEqual([]);
		expect(fhsInputData.Zone!['zone 1']?.SpaceHeatControl).toBe('livingroom');
	});

	it('maps floor input state to FHS input request', () => {
		// Arrange
		const groundFloor: GroundFloorData = {
			name: "Ground 1",
			surfaceAreaInZone: 5,
			surfaceAreaAllZones: 0,
			pitch: 180,
			uValue: 1,
			thermalResistanceOfFloorConstruction: 1,
			kappaValue: 50000,
			massDistributionClass: MassDistributionClass.I,
			perimeter: 0,
			psiOfWallJunction: 0,
			typeOfGroundFloor: FloorType.Slab_no_edge_insulation
		};

		const groundFloorWithEdgeInsulation: GroundFloorData = {
			...groundFloor,
			name: 'Ground 2',
			typeOfGroundFloor: FloorType.Slab_edge_insulation,
			edgeInsulationType: "horizontal",
			edgeInsulationWidth: 0,
			edgeInsulationThermalResistance: 0
		};

		const groundFloorWithSuspendedFloor: GroundFloorData = {
			...groundFloor,
			name: 'Ground 3',
			typeOfGroundFloor: FloorType.Suspended_floor,
			heightOfFloorUpperSurface: 1,
			thicknessOfWalls: 1,
			underfloorSpaceThermalResistance: 1,
			thermalTransmittanceOfWallsAboveGround: 1,
			ventilationOpeningsArea: 1
		};

		const groundFloorWithHeatedBasement: GroundFloorData = {
			...groundFloor,
			name: 'Ground 4',
			typeOfGroundFloor: FloorType.Heated_basement,
			thicknessOfWalls: 1,
			depthOfBasementFloorBelowGround: 1,
			thermalResistanceOfBasementWalls: 1
		};

		const groundFloorWithUnheatedBasement: GroundFloorData = {
			...groundFloor,
			name: 'Ground 5',
			typeOfGroundFloor: FloorType.Unheated_basement,
			thermalTransmittanceOfFloorAboveBasement: 1,
			thermalTransmittanceOfWallsAboveGround: 1,
			thicknessOfWalls: 1,
			depthOfBasementFloorBelowGround: 1,
			heightOfBasementWallsAboveGround: 1
		};

		const internalFloor: InternalFloorData = {
			typeOfInternalFloor: InternalFloorType.unheatedSpace,
			name: "Internal 1",
			surfaceAreaOfElement: 5,
			kappaValue: 50000,
			massDistributionClass: MassDistributionClass.I,
			thermalResistanceOfAdjacentUnheatedSpace: 1
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
			kappaValue: 50000,
			massDistributionClass: MassDistributionClass.I
		};

		store.$patch({
			livingSpaceFabric: {
				livingSpaceFloors: {
					livingSpaceGroundFloor: { data: [
						groundFloor,
						groundFloorWithEdgeInsulation,
						groundFloorWithSuspendedFloor,
						groundFloorWithHeatedBasement,
						groundFloorWithUnheatedBasement
					] },
					livingSpaceInternalFloor: { data: [internalFloor] },
					livingSpaceExposedFloor: { data: [exposedFloor] }
				}
			}
		});

		// Act
		const fhsInputData = mapLivingSpaceFabricData(store);

		// Assert
		const groundFloorElement = fhsInputData.Zone!['zone 1']!.BuildingElement[groundFloor.name]! as BuildingElementGround;
		const groundFloorWithEdgeInsulationElement = fhsInputData.Zone!['zone 1']!.BuildingElement[groundFloorWithEdgeInsulation.name]! as BuildingElementGround;
		const groundFloorWithSuspendedFloorElement = fhsInputData.Zone!['zone 1']!.BuildingElement[groundFloorWithSuspendedFloor.name]! as BuildingElementGround;
		const groundFloorWithHeatedBasementElement = fhsInputData.Zone!['zone 1']!.BuildingElement[groundFloorWithHeatedBasement.name]! as BuildingElementGround;
		const groundFloorWithUnheatedBasementElement = fhsInputData.Zone!['zone 1']!.BuildingElement[groundFloorWithUnheatedBasement.name]! as BuildingElementGround;
		const internalFloorElement = fhsInputData.Zone!['zone 1']!.BuildingElement[internalFloor.name] as BuildingElementAdjacentUnconditionedSpaceSimple;
		const exposedFloorElement = fhsInputData.Zone!['zone 1']!.BuildingElement[exposedFloor.name] as BuildingElementOpaque;

		const expectedGroundFloor: BuildingElementGround = {
			type: 'BuildingElementGround',
			area: groundFloor.surfaceAreaInZone,
			total_area: groundFloor.surfaceAreaAllZones,
			pitch: groundFloor.pitch,
			u_value: groundFloor.uValue,
			thermal_resistance_floor_construction: groundFloor.thermalResistanceOfFloorConstruction,
			areal_heat_capacity: groundFloor.kappaValue,
			mass_distribution_class: groundFloor.massDistributionClass,
			perimeter: groundFloor.perimeter,
			psi_wall_floor_junc: groundFloor.psiOfWallJunction,
			floor_type: groundFloor.typeOfGroundFloor,
			thickness_walls: 0
		};

		expect(groundFloorElement).toEqual(expectedGroundFloor);

		const expectedEdgeInsulation: SchemaEdgeInsulation = {
			type: 'horizontal',
			edge_thermal_resistance: groundFloorWithEdgeInsulation.edgeInsulationThermalResistance!,
			width: groundFloorWithEdgeInsulation.edgeInsulationWidth!
		};

		expect(groundFloorWithEdgeInsulationElement.edge_insulation![0]).toEqual(expectedEdgeInsulation);

		const expectedGroundFloorSuspendedFloor: BuildingElementGround = {
			...expectedGroundFloor,
			floor_type: groundFloorWithSuspendedFloor.typeOfGroundFloor,
			height_upper_surface: groundFloorWithSuspendedFloor.heightOfFloorUpperSurface,
			thickness_walls: groundFloorWithSuspendedFloor.thicknessOfWalls!,
			thermal_resist_insul: groundFloorWithSuspendedFloor.underfloorSpaceThermalResistance,
			thermal_transm_walls: groundFloorWithSuspendedFloor.thermalTransmittanceOfWallsAboveGround,
			area_per_perimeter_vent: groundFloorWithSuspendedFloor.ventilationOpeningsArea
		};

		expect(groundFloorWithSuspendedFloorElement).toEqual(expectedGroundFloorSuspendedFloor);

		const expectedGroundFloorWithHeatedBasement: BuildingElementGround = {
			...expectedGroundFloor,
			floor_type: groundFloorWithHeatedBasement.typeOfGroundFloor,
			depth_basement_floor: groundFloorWithHeatedBasement.depthOfBasementFloorBelowGround,
			thermal_resist_walls_base: groundFloorWithHeatedBasement.thermalResistanceOfBasementWalls,
			thickness_walls: groundFloorWithHeatedBasement.thicknessOfWalls!
		};

		expect(groundFloorWithHeatedBasementElement).toEqual(expectedGroundFloorWithHeatedBasement);

		const expectedGroundFloorWithUnheatedBasement: BuildingElementGround = {
			...expectedGroundFloor,
			floor_type: groundFloorWithUnheatedBasement.typeOfGroundFloor,
			thermal_transm_envi_base: groundFloorWithUnheatedBasement.thermalTransmittanceOfFloorAboveBasement,
			height_basement_walls: groundFloorWithUnheatedBasement.heightOfBasementWallsAboveGround,
			thickness_walls: groundFloorWithUnheatedBasement.thicknessOfWalls!,
			thermal_transm_walls: groundFloorWithUnheatedBasement.thermalTransmittanceOfWallsAboveGround,
			depth_basement_floor: groundFloorWithUnheatedBasement.depthOfBasementFloorBelowGround
		};

		expect(groundFloorWithUnheatedBasementElement).toEqual(expectedGroundFloorWithUnheatedBasement);

		const expectedInternalFloor: BuildingElementAdjacentUnconditionedSpaceSimple = {
			type: 'BuildingElementAdjacentUnconditionedSpace_Simple',
			area: internalFloor.surfaceAreaOfElement,
			pitch: 180,
			u_value: 0.01,
			areal_heat_capacity: internalFloor.kappaValue,
			mass_distribution_class: internalFloor.massDistributionClass,
			thermal_resistance_unconditioned_space: internalFloor.thermalResistanceOfAdjacentUnheatedSpace!
		};

		expect(internalFloorElement).toEqual(expectedInternalFloor);

		const expectedExposedFloor: BuildingElementOpaque = {
			type: 'BuildingElementOpaque',
			area: exposedFloor.surfaceArea,
			height: exposedFloor.length,
			width: exposedFloor.width,
			base_height: exposedFloor.elevationalHeight,
			solar_absorption_coeff: exposedFloor.solarAbsorption,
			pitch: exposedFloor.pitch,
			u_value: exposedFloor.uValue,
			areal_heat_capacity: exposedFloor.kappaValue,
			mass_distribution_class: exposedFloor.massDistributionClass,
			orientation360: exposedFloor.orientation,
			is_external_door: false
		};

		expect(exposedFloorElement).toEqual(expectedExposedFloor);
	});

	it('maps wall input state to FHS input request', () => {
		// Arrange
		const externalWall: ExternalWallData = {
			name: "External wall 1",
			pitchOption: '90',
			pitch: 90,
			orientation: 0,
			length: 20,
			height: 0.5,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorption: 0.1,
			uValue: 1,
			kappaValue: 50000,
			massDistributionClass: MassDistributionClass.I
		};

		const internalWall: InternalWallData = {
			name: "Internal 1",
			surfaceAreaOfElement: 5,
			kappaValue: 50000,
			massDistributionClass: MassDistributionClass.I,
			pitchOption: '90',
			pitch: 90
		};

		const partyWall: PartyWallData = {
			name: "Party wall 1",
			pitchOption: '90',
			pitch: 90,
			orientation: 0,
			length: 0.5,
			height: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorption: 0,
			uValue: 1,
			kappaValue: 50000,
			massDistributionClass: MassDistributionClass.I
		};

		const wallToUnheatedSpace: WallsToUnheatedSpaceData ={
			name: 'Wall to unheated space 1',
			surfaceAreaOfElement: 500,
			uValue: 10,
			arealHeatCapacity: 50000,
			massDistributionClass: MassDistributionClass.E,
			pitchOption: '90',
			pitch: 90,
			thermalResistanceOfAdjacentUnheatedSpace: 1
		};

		store.$patch({
			livingSpaceFabric: {
				livingSpaceWalls: {
					livingSpaceExternalWall: { data: [externalWall] },
					livingSpaceInternalWall: { data: [internalWall] },
					livingSpacePartyWall: { data: [partyWall] },
					livingSpaceWallToUnheatedSpace: { data: [wallToUnheatedSpace] }
				}
			}
		});

		// Act
		const fhsInputData = mapLivingSpaceFabricData(store);

		// Assert
		const externalWallElement = fhsInputData.Zone!['zone 1']!.BuildingElement[externalWall.name]! as BuildingElementOpaque;
		const internalWallElement = fhsInputData.Zone!['zone 1']!.BuildingElement[internalWall.name]! as BuildingElementAdjacentConditionedSpace;
		const partyWallElement = fhsInputData.Zone!['zone 1']!.BuildingElement[partyWall.name]! as BuildingElementOpaque;
		const wallToUnheatedSpaceElement = fhsInputData.Zone!['zone 1']!.BuildingElement[wallToUnheatedSpace.name] as BuildingElementAdjacentUnconditionedSpaceSimple;

		const expectedExternalWall: BuildingElementOpaque = {
			type: 'BuildingElementOpaque',
			pitch: externalWall.pitch!,
			orientation360: externalWall.orientation,
			height: externalWall.height,
			width: externalWall.length,
			base_height: externalWall.elevationalHeight,
			area: externalWall.surfaceArea,
			solar_absorption_coeff: externalWall.solarAbsorption,
			u_value: externalWall.uValue,
			areal_heat_capacity: externalWall.kappaValue,
			mass_distribution_class: externalWall.massDistributionClass,
			is_external_door: false
		};

		expect(externalWallElement).toEqual(expectedExternalWall);

		const expectedInternalWall: BuildingElementAdjacentConditionedSpace = {
			type: 'BuildingElementAdjacentConditionedSpace',
			pitch: internalWall.pitch!,
			area: internalWall.surfaceAreaOfElement,
			u_value: 0,
			areal_heat_capacity: internalWall.kappaValue,
			mass_distribution_class: internalWall.massDistributionClass
		};

		expect(internalWallElement).toEqual(expectedInternalWall);

		const expectedPartyWall: BuildingElementOpaque = {
			type: 'BuildingElementOpaque',
			pitch: partyWall.pitch!,
			orientation360: partyWall.orientation,
			height: partyWall.height,
			width: partyWall.length,
			base_height: partyWall.elevationalHeight,
			area: partyWall.surfaceArea,
			solar_absorption_coeff: partyWall.solarAbsorption,
			u_value: partyWall.uValue,
			areal_heat_capacity: partyWall.kappaValue,
			mass_distribution_class: partyWall.massDistributionClass,
			is_external_door: false
		};

		expect(partyWallElement).toEqual(expectedPartyWall);

		const expectedWallToUnheatedSpace: BuildingElementAdjacentUnconditionedSpaceSimple = {
			type: 'BuildingElementAdjacentUnconditionedSpace_Simple',
			pitch: wallToUnheatedSpace.pitch!,
			area: wallToUnheatedSpace.surfaceAreaOfElement,
			u_value: wallToUnheatedSpace.uValue,
			areal_heat_capacity: wallToUnheatedSpace.arealHeatCapacity,
			mass_distribution_class: wallToUnheatedSpace.massDistributionClass,
			thermal_resistance_unconditioned_space: wallToUnheatedSpace.thermalResistanceOfAdjacentUnheatedSpace
		};

		expect(wallToUnheatedSpaceElement).toEqual(expectedWallToUnheatedSpace);
	});

	it('maps ceiling and roof input state to FHS input request', () => {
		// Arrange
		const ceiling: CeilingData = {
			type: 'unheatedSpace',
			name: "Ceiling 1",
			surfaceArea: 5,
			uValue: 1,
			kappaValue: 50000,
			massDistributionClass: MassDistributionClass.I,
			pitchOption: '0',
			pitch: 0,
			thermalResistanceOfAdjacentUnheatedSpace: 1
		};

		const roof: RoofData = {
			name: "Roof 1",
			typeOfRoof: 'flat',
			pitchOption: '0',
			pitch: 0,
			length: 1,
			width: 1,
			elevationalHeightOfElement: 2,
			surfaceArea: 1,
			solarAbsorptionCoefficient: 0.5,
			uValue: 1,
			kappaValue: 50000,
			massDistributionClass: MassDistributionClass.I
		};

		const unheatedPitchedRoof: RoofData = {
			name: "Unheated pitched roof 1",
			typeOfRoof: 'unheatedPitched',
			pitch: 0,
			orientation: 90,
			length: 1,
			width: 1,
			elevationalHeightOfElement: 2,
			surfaceArea: 1,
			solarAbsorptionCoefficient: 0.5,
			uValue: 1,
			kappaValue: 50000,
			massDistributionClass: MassDistributionClass.I
		};

		store.$patch({
			livingSpaceFabric: {
				livingSpaceCeilingsAndRoofs: {
					livingSpaceCeilings: { data: [ceiling] },
					livingSpaceRoofs: { data: [roof] },
					livingSpaceUnheatedPitchedRoofs: { data: [unheatedPitchedRoof] }
				}
			}
		});

		// Act
		const fhsInputData = mapLivingSpaceFabricData(store);

		// Assert
		const ceilingElement = fhsInputData.Zone!['zone 1']!.BuildingElement[ceiling.name]! as BuildingElementAdjacentUnconditionedSpaceSimple;
		const roofElement = fhsInputData.Zone!['zone 1']!.BuildingElement[roof.name]! as BuildingElementOpaque;
		const unheatedPitchedRoofElement = fhsInputData.Zone!['zone 1']!.BuildingElement[unheatedPitchedRoof.name]! as BuildingElementOpaque;

		const expectedCeiling: BuildingElementAdjacentUnconditionedSpaceSimple = {
			type: 'BuildingElementAdjacentUnconditionedSpace_Simple',
			pitch: ceiling.pitch,
			area: ceiling.surfaceArea,
			u_value: ceiling.uValue,
			areal_heat_capacity: ceiling.kappaValue,
			mass_distribution_class: ceiling.massDistributionClass,
			thermal_resistance_unconditioned_space: ceiling.thermalResistanceOfAdjacentUnheatedSpace
		};

		expect(ceilingElement).toEqual(expectedCeiling);

		const expectedRoof: BuildingElementOpaque = {
			type: 'BuildingElementOpaque',
			pitch: roof.pitch,
			orientation360: 0,
			height: roof.length,
			width: roof.width,
			base_height: roof.elevationalHeightOfElement,
			area: roof.surfaceArea,
			solar_absorption_coeff: roof.solarAbsorptionCoefficient,
			u_value: roof.uValue,
			areal_heat_capacity: roof.kappaValue,
			mass_distribution_class: roof.massDistributionClass,
			is_external_door: false,
			is_unheated_pitched_roof: false
		};

		expect(roofElement).toEqual(expectedRoof);

		const expectedUnpitchedRoof: BuildingElementOpaque = {
			type: 'BuildingElementOpaque',
			pitch: unheatedPitchedRoof.pitch,
			orientation360: unheatedPitchedRoof.orientation!,
			height: unheatedPitchedRoof.length,
			width: unheatedPitchedRoof.width,
			base_height: unheatedPitchedRoof.elevationalHeightOfElement,
			area: unheatedPitchedRoof.surfaceArea,
			solar_absorption_coeff: unheatedPitchedRoof.solarAbsorptionCoefficient,
			u_value: unheatedPitchedRoof.uValue,
			areal_heat_capacity: unheatedPitchedRoof.kappaValue,
			mass_distribution_class: unheatedPitchedRoof.massDistributionClass,
			is_external_door: false,
			is_unheated_pitched_roof: true
		};

		expect(unheatedPitchedRoofElement).toEqual(expectedUnpitchedRoof);
	});

	it('maps door input state to FHS input request', () => {
		// Arrange
		const internalDoor: InternalDoorData = {
			typeOfCeiling: 'unheatedSpace',
			name: "Internal 1",
			surfaceArea: 5,
			kappaValue: 50000,
			massDistributionClass: MassDistributionClass.I,
			pitchOption: '90',
			pitch: 90,
			thermalResistanceOfAdjacentUnheatedSpace: 1
		};

		const externalGlazedDoor: ExternalGlazedDoorData = {
			name: "External glazed door 1",
			orientation: 1,
			surfaceArea: 1,
			height: 1,
			width: 1,
			uValue: 1,
			pitchOption: '90',
			pitch: 90,
			solarTransmittance: 0.1,
			elevationalHeight: 1,
			midHeight: 1,
			numberOpenableParts: '1',
			frameToOpeningRatio: 1,
			midHeightOpenablePart1: 1,
			maximumOpenableArea: 1,
			heightOpenableArea: 1
		};

		const externalUnglazedDoor: ExternalUnglazedDoorData = {
			name: "External unglazed door 1",
			pitchOption: '90',
			pitch: 90,
			orientation: 0,
			height: 0.5,
			width: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorption: 0.1,
			uValue: 1,
			kappaValue: 50000,
			massDistributionClass: MassDistributionClass.I
		};

		store.$patch({
			livingSpaceFabric: {
				livingSpaceDoors: {
					livingSpaceInternalDoor: { data: [internalDoor] },
					livingSpaceExternalGlazedDoor: { data: [externalGlazedDoor] },
					livingSpaceExternalUnglazedDoor: { data: [externalUnglazedDoor] }
				}
			}
		});

		// Act
		const fhsInputData = mapLivingSpaceFabricData(store);

		// Assert
		const internalDoorElement = fhsInputData.Zone!['zone 1']!.BuildingElement[internalDoor.name]! as BuildingElementAdjacentUnconditionedSpaceSimple;
		const externalGlazedDoorElement = fhsInputData.Zone!['zone 1']!.BuildingElement[externalGlazedDoor.name]! as BuildingElementTransparent;
		const externalUnglazedDoorElement = fhsInputData.Zone!['zone 1']!.BuildingElement[externalUnglazedDoor.name]! as BuildingElementOpaque;

		const expectedInternalDoor: BuildingElementAdjacentUnconditionedSpaceSimple = {
			type: 'BuildingElementAdjacentUnconditionedSpace_Simple',
			pitch: internalDoor.pitch!,
			area: internalDoor.surfaceArea,
			u_value: 0,
			areal_heat_capacity: internalDoor.kappaValue,
			mass_distribution_class: internalDoor.massDistributionClass,
			thermal_resistance_unconditioned_space: internalDoor.thermalResistanceOfAdjacentUnheatedSpace
		};

		expect(internalDoorElement).toEqual(expectedInternalDoor);

		const expectedExternalGlazedDoor: BuildingElementTransparent = {
			type: 'BuildingElementTransparent',
			pitch: expectedInternalDoor.pitch,
			orientation360: externalGlazedDoor.orientation,
			height: externalGlazedDoor.height,
			width: externalGlazedDoor.width,
			mid_height: externalGlazedDoor.midHeight,
			base_height: externalGlazedDoor.elevationalHeight,
			area: externalGlazedDoor.surfaceArea,
			g_value: externalGlazedDoor.solarTransmittance,
			u_value: externalGlazedDoor.uValue,
			frame_area_fraction: externalGlazedDoor.frameToOpeningRatio!,
			max_window_open_area: externalGlazedDoor.maximumOpenableArea,
			free_area_height: externalGlazedDoor.heightOpenableArea,
			window_part_list: [
				{ mid_height_air_flow_path: externalGlazedDoor.midHeightOpenablePart1 }
			],
			shading: []
		};

		expect(externalGlazedDoorElement).toEqual(expectedExternalGlazedDoor);

		const expectedUnglazedDoor: BuildingElementOpaque = {
			type: 'BuildingElementOpaque',
			pitch: externalUnglazedDoor.pitch!,
			orientation360: externalUnglazedDoor.orientation,
			height: externalUnglazedDoor.height,
			width: externalUnglazedDoor.width,
			base_height: externalUnglazedDoor.elevationalHeight,
			area: externalUnglazedDoor.surfaceArea,
			solar_absorption_coeff: externalUnglazedDoor.solarAbsorption,
			u_value: externalUnglazedDoor.uValue,
			areal_heat_capacity: externalUnglazedDoor.kappaValue,
			mass_distribution_class: externalUnglazedDoor.massDistributionClass,
			is_external_door: true
		};

		expect(externalUnglazedDoorElement).toEqual(expectedUnglazedDoor);
	});

	it('maps windows input state to FHS input request', () => {
		// Arrange
		const window: WindowData = {
			name: "Window 1",
			orientation: 180,
			surfaceArea: 1,
			height: 1,
			width: 1,
			uValue: 1,
			pitchOption: '90',
			pitch: 90,
			solarTransmittance: 0.1,
			elevationalHeight: 1,
			midHeight: 1,
			numberOpenableParts: '1',
			overhangDepth: 1,
			overhangDistance: 1,
			sideFinRightDepth: 1,
			sideFinRightDistance: 1,
			sideFinLeftDepth: 1,
			sideFinLeftDistance: 1,
			treatmentType: WindowTreatmentType.blinds,
			thermalResistivityIncrease: 1,
			solarTransmittanceReduction: 0.1,
			midHeightOpenablePart1: 1,
			frameToOpeningRatio: 1,
			maximumOpenableArea: 1,
			heightOpenableArea: 1
		};

		store.$patch({
			livingSpaceFabric: {
				livingSpaceWindows: { data: [window] }
			}
		});

		// Act
		const fhsInputData = mapLivingSpaceFabricData(store);

		// Assert
		const windowElement = fhsInputData.Zone!['zone 1']!.BuildingElement[window.name]! as BuildingElementTransparent;

		const expectedWindow: BuildingElementTransparent = {
			type: 'BuildingElementTransparent',
			pitch: window.pitch!,
			orientation360: window.orientation,
			height: window.height,
			width: window.width,
			base_height: window.elevationalHeight,
			area: window.surfaceArea,
			u_value: window.uValue,
			g_value: window.solarTransmittance,
			mid_height: window.midHeight,
			frame_area_fraction: window.frameToOpeningRatio!,
			max_window_open_area: window.maximumOpenableArea,
			free_area_height: window.heightOpenableArea,
			window_part_list: [{
				mid_height_air_flow_path: window.midHeightOpenablePart1!
			}],
			shading: [
				{
					type: WindowShadingObjectType.overhang,
					depth: window.overhangDepth,
					distance: window.overhangDistance
				},
				{
					type: WindowShadingObjectType.sidefinleft,
					depth: window.sideFinLeftDepth,
					distance: window.sideFinLeftDistance
				},
				{
					type: WindowShadingObjectType.sidefinright,
					depth: window.sideFinRightDepth,
					distance: window.sideFinRightDistance
				}
			]
		};

		expect(windowElement).toEqual(expectedWindow);
	});

	it('maps thermal bridging input state to FHS input request', () => {
		// Arrange
		const linearThermalBridge: LinearThermalBridgeData = {
			name: 'E1: Steel lintel with perforated steel base plate',
			typeOfThermalBridge: 'e1',
			linearThermalTransmittance: 1,
			length: 2
		};

		const pointThermalBridge: PointThermalBridgeData = {
			name: 'Point 1',
			heatTransferCoefficient: 1
		};

		store.$patch({
			livingSpaceFabric: {
				livingSpaceThermalBridging: {
					livingSpaceLinearThermalBridges: { data: [linearThermalBridge] },
					livingSpacePointThermalBridges: { data: [pointThermalBridge] }
				}
			}
		});

		// Act
		const fhsInputData = mapLivingSpaceFabricData(store);

		// Assert
		type ThermalBridging = { [key: string]: SchemaThermalBridgingDetails; };
		type ThermalBridgeLinear = Extract<SchemaThermalBridgingDetails, { type: 'ThermalBridgeLinear' }>;
		type ThermalBridgePoint = Extract<SchemaThermalBridgingDetails, { type: 'ThermalBridgePoint' }>;

		const thermalBridging = fhsInputData.Zone!['zone 1']!.ThermalBridging as ThermalBridging;

		const linearThermalBridgeElement = thermalBridging[linearThermalBridge.name]! as ThermalBridgeLinear;
		const pointThermalBridgeElement = thermalBridging[pointThermalBridge.name]! as ThermalBridgePoint;

		const expectedLinearThermalBridge: ThermalBridgeLinear = {
			type: 'ThermalBridgeLinear',
			junction_type: 'E1',
			linear_thermal_transmittance: linearThermalBridge.linearThermalTransmittance,
			length: linearThermalBridge.length
		};

		expect(linearThermalBridgeElement).toEqual(expectedLinearThermalBridge);
		expect(pointThermalBridgeElement.heat_transfer_coeff).toBe(pointThermalBridge.heatTransferCoefficient);
	});
});