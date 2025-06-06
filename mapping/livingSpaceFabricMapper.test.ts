import { FloorType, MassDistributionClass, WindowShadingObjectType, WindowTreatmentType, type SchemaBuildingElement, type SchemaThermalBridgingDetails } from "~/schema/api-schema.types";
import { mapLivingSpaceFabricData } from "./livingSpaceFabricMapper";

type BuildingElementGround = Extract<SchemaBuildingElement, { type: 'BuildingElementGround' }>;
type BuildingElementOpaque = Extract<SchemaBuildingElement, { type: 'BuildingElementOpaque' }>;
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
		expect(fhsInputData.Zone!['zone 1']?.SpaceHeatControl).toBeUndefined();
	});

	it('maps floor input state to FHS input request', () => {
		// Arrange
		const groundFloor: GroundFloorData = {
			name: "Ground 1",
			surfaceAreaInZone: 5,
			surfaceAreaAllZones: 0,
			pitch: 180,
			uValue: 1,
			kappaValue: 50000,
			massDistributionClass: MassDistributionClass.I,
			perimeter: 0,
			psiOfWallJunction: 0,
			typeOfGroundFloor: FloorType.Slab_no_edge_insulation
		};

		const groundFloorWithEdgeInsulation: GroundFloorData = {
			...groundFloor,
			typeOfGroundFloor: FloorType.Slab_edge_insulation,
			edgeInsulationType: "horizontal",
			edgeInsulationWidth: 0,
			edgeInsulationThermalResistance: 0
		};

		const groundFloorWithSuspendedFloor: GroundFloorData = {
			...groundFloor,
			typeOfGroundFloor: FloorType.Suspended_floor,
			heightOfFloorUpperSurface: 1,
			thicknessOfWalls: 1,
			underfloorSpaceThermalResistance: 1,
			thermalTransmittanceOfWallsAboveGround: 1,
			ventilationOpeningsArea: 1
		};

		const groundFloorWithHeatedBasement: GroundFloorData = {
			...groundFloor,
			typeOfGroundFloor: FloorType.Heated_basement,
			thicknessOfWalls: 1,
			depthOfBasementFloorBelowGround: 1,
			thermalResistanceOfBasementWalls: 1
		};

		const groundFloorWithUnheatedBasement: GroundFloorData = {
			...groundFloor,
			typeOfGroundFloor: FloorType.Unheated_basement,
			thermalTransmittanceOfFloorAboveBasement: 1,
			thermalTransmittanceOfWallsAboveGround: 1,
			thermalTransmittanceOfBasementWalls: 1,
			thicknessOfWalls: 1,
			depthOfBasementFloorBelowGround: 1,
			heightOfBasementWallsAboveGround: 1
		};

		const internalFloor: InternalFloorData = {
			typeOfInternalFloor: 'unheatedSpace',
			name: "Internal 1",
			surfaceAreaOfElement: 5,
			uValue: 0,
			kappaValue: 50000,
			massDistributionClass: MassDistributionClass.I,
			pitch: 180,
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
					livingSpaceGroundFloor: { data: [groundFloor] },
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
		const internalFloorElement = fhsInputData.Zone!['zone 1']!.BuildingElement[internalFloor.name] as BuildingElementAdjacentUnconditionedSpaceSimple;
		const exposedFloorElement = fhsInputData.Zone!['zone 1']!.BuildingElement[exposedFloor.name] as BuildingElementOpaque;

		expect(groundFloorElement.area).toBe(groundFloor.surfaceAreaInZone);
		expect(groundFloorElement.total_area).toBe(groundFloor.surfaceAreaAllZones);
		expect(groundFloorElement.pitch).toBe(groundFloor.pitch);
		expect(groundFloorElement.u_value).toBe(groundFloor.uValue);
		expect(groundFloorElement.areal_heat_capacity).toBe(groundFloor.kappaValue);
		expect(groundFloorElement.mass_distribution_class).toBe(groundFloor.massDistributionClass);
		expect(groundFloorElement.perimeter).toBe(groundFloor.perimeter);
		expect(groundFloorElement.psi_wall_floor_junc).toBe(groundFloor.psiOfWallJunction);

		expect(groundFloorWithEdgeInsulationElement.edge_insulation![0]?.type).toBe(groundFloorWithEdgeInsulation.edgeInsulationType);
		expect(groundFloorWithEdgeInsulationElement.edge_insulation![0]?.edge_thermal_resistance).toBe(groundFloorWithEdgeInsulation.edgeInsulationThermalResistance);
		expect(groundFloorWithEdgeInsulationElement.edge_insulation![0]?.type === 'horizontal' ?
			groundFloorWithEdgeInsulationElement.edge_insulation![0]?.width : undefined)
			.toBe(groundFloorWithEdgeInsulation.edgeInsulationWidth);

		// TODO: Add tests with other ground floor types

		expect(internalFloorElement.area).toBe(internalFloor.surfaceAreaOfElement);
		expect(internalFloorElement.pitch).toBe(internalFloor.pitch);
		expect(internalFloorElement.u_value).toBe(internalFloor.uValue);
		expect(internalFloorElement.areal_heat_capacity).toBe(internalFloor.kappaValue);
		expect(internalFloorElement.mass_distribution_class).toBe(internalFloor.massDistributionClass);
		expect(internalFloorElement.thermal_resistance_unconditioned_space).toBe(internalFloor.thermalResistanceOfAdjacentUnheatedSpace);

		expect(exposedFloorElement.area).toBe(exposedFloor.surfaceArea);
		expect(exposedFloorElement.height).toBe(exposedFloor.length);
		expect(exposedFloorElement.width).toBe(exposedFloor.width);
		expect(exposedFloorElement.base_height).toBe(exposedFloor.elevationalHeight);
		expect(exposedFloorElement.solar_absorption_coeff).toBe(exposedFloor.solarAbsorption);
		expect(exposedFloorElement.pitch).toBe(exposedFloor.pitch);
		expect(exposedFloorElement.u_value).toBe(exposedFloor.uValue);
		expect(exposedFloorElement.areal_heat_capacity).toBe(exposedFloor.kappaValue);
		expect(exposedFloorElement.mass_distribution_class).toBe(exposedFloor.massDistributionClass);
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
			uValue: 1,
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
		const internalWallElement = fhsInputData.Zone!['zone 1']!.BuildingElement[internalWall.name]! as BuildingElementOpaque;
		const partyWallElement = fhsInputData.Zone!['zone 1']!.BuildingElement[partyWall.name]! as BuildingElementOpaque;

		expect(externalWallElement.pitch).toBe(externalWall.pitch);
		expect(externalWallElement.orientation360).toBe(externalWall.orientation);
		expect(externalWallElement.height).toBe(externalWall.height);
		expect(externalWallElement.width).toBe(externalWall.length);
		expect(externalWallElement.base_height).toBe(externalWall.elevationalHeight);
		expect(externalWallElement.area).toBe(externalWall.surfaceArea);
		expect(externalWallElement.solar_absorption_coeff).toBe(externalWall.solarAbsorption);
		expect(externalWallElement.u_value).toBe(externalWall.uValue);
		expect(externalWallElement.areal_heat_capacity).toBe(externalWall.kappaValue);
		expect(externalWallElement.mass_distribution_class).toBe(externalWall.massDistributionClass);

		expect(internalWallElement.pitch).toBe(internalWall.pitch);
		expect(internalWallElement.area).toBe(internalWall.surfaceAreaOfElement);
		expect(internalWallElement.u_value).toBe(internalWall.uValue);
		expect(internalWallElement.areal_heat_capacity).toBe(internalWall.kappaValue);
		expect(internalWallElement.mass_distribution_class).toBe(internalWall.massDistributionClass);

		expect(partyWallElement.pitch).toBe(partyWall.pitch);
		expect(partyWallElement.orientation360).toBe(partyWall.orientation);
		expect(partyWallElement.height).toBe(partyWall.height);
		expect(partyWallElement.width).toBe(partyWall.length);
		expect(partyWallElement.base_height).toBe(partyWall.elevationalHeight);
		expect(partyWallElement.area).toBe(partyWall.surfaceArea);
		expect(partyWallElement.solar_absorption_coeff).toBe(partyWall.solarAbsorption);
		expect(partyWallElement.u_value).toBe(partyWall.uValue);
		expect(partyWallElement.areal_heat_capacity).toBe(partyWall.kappaValue);
		expect(partyWallElement.mass_distribution_class).toBe(partyWall.massDistributionClass);
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

		expect(ceilingElement.pitch).toBe(ceiling.pitch);
		expect(ceilingElement.area).toBe(ceiling.surfaceArea);
		expect(ceilingElement.u_value).toBe(ceiling.uValue);
		expect(ceilingElement.areal_heat_capacity).toBe(ceiling.kappaValue);
		expect(ceilingElement.mass_distribution_class).toBe(ceiling.massDistributionClass);
		expect(ceilingElement.thermal_resistance_unconditioned_space).toBe(ceiling.thermalResistanceOfAdjacentUnheatedSpace);

		expect(roofElement.pitch).toBe(roof.pitch);
		expect(roofElement.orientation360).toBe(0);
		expect(roofElement.height).toBe(roof.length);
		expect(roofElement.width).toBe(roof.width);
		expect(roofElement.base_height).toBe(roof.elevationalHeightOfElement);
		expect(roofElement.area).toBe(roof.surfaceArea);
		expect(roofElement.solar_absorption_coeff).toBe(roof.solarAbsorptionCoefficient);
		expect(roofElement.u_value).toBe(roof.uValue);
		expect(roofElement.areal_heat_capacity).toBe(roof.kappaValue);
		expect(roofElement.mass_distribution_class).toBe(roof.massDistributionClass);

		expect(unheatedPitchedRoofElement.pitch).toBe(unheatedPitchedRoof.pitch);
		expect(unheatedPitchedRoofElement.orientation360).toBe(unheatedPitchedRoof.orientation);
		expect(unheatedPitchedRoofElement.width).toBe(unheatedPitchedRoof.length);
		expect(unheatedPitchedRoofElement.base_height).toBe(unheatedPitchedRoof.elevationalHeightOfElement);
		expect(unheatedPitchedRoofElement.area).toBe(unheatedPitchedRoof.surfaceArea);
		expect(unheatedPitchedRoofElement.solar_absorption_coeff).toBe(unheatedPitchedRoof.solarAbsorptionCoefficient);
		expect(unheatedPitchedRoofElement.u_value).toBe(unheatedPitchedRoof.uValue);
		expect(unheatedPitchedRoofElement.areal_heat_capacity).toBe(unheatedPitchedRoof.kappaValue);
		expect(unheatedPitchedRoofElement.mass_distribution_class).toBe(unheatedPitchedRoof.massDistributionClass);
	});

	it('maps door input state to FHS input request', () => {
		// Arrange
		const internalDoor: InternalDoorData = {
			typeOfCeiling: 'unheatedSpace',
			name: "Internal 1",
			surfaceArea: 5,
			uValue: 1,
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

		expect(internalDoorElement.pitch).toBe(internalDoor.pitch);
		expect(internalDoorElement.area).toBe(internalDoor.surfaceArea);
		expect(internalDoorElement.u_value).toBe(internalDoor.uValue);
		expect(internalDoorElement.areal_heat_capacity).toBe(internalDoor.kappaValue);
		expect(internalDoorElement.mass_distribution_class).toBe(internalDoor.massDistributionClass);
		expect(internalDoorElement.thermal_resistance_unconditioned_space).toBe(internalDoor.thermalResistanceOfAdjacentUnheatedSpace);

		expect(externalGlazedDoorElement.pitch).toBe(externalGlazedDoor.pitch);
		expect(externalGlazedDoorElement.orientation360).toBe(externalGlazedDoor.orientation);
		expect(externalGlazedDoorElement.height).toBe(externalGlazedDoor.height);
		expect(externalGlazedDoorElement.width).toBe(externalGlazedDoor.width);
		expect(externalGlazedDoorElement.base_height).toBe(externalGlazedDoor.elevationalHeight);
		expect(externalGlazedDoorElement.area).toBe(externalGlazedDoor.surfaceArea);
		expect(externalGlazedDoorElement.g_value).toBe(externalGlazedDoor.solarTransmittance);
		expect(externalGlazedDoorElement.u_value).toBe(externalGlazedDoor.uValue);
		expect(externalGlazedDoorElement.frame_area_fraction).toBe(externalGlazedDoor.frameToOpeningRatio);
		expect(externalGlazedDoorElement.max_window_open_area).toBe(externalGlazedDoor.maximumOpenableArea);
		expect(externalGlazedDoorElement.free_area_height).toBe(externalGlazedDoor.heightOpenableArea);
		expect(externalGlazedDoorElement.window_part_list).toEqual([
			{ mid_height_air_flow_path: externalGlazedDoor.midHeightOpenablePart1 }
		]);

		expect(externalUnglazedDoorElement.pitch).toBe(externalUnglazedDoor.pitch);
		expect(externalUnglazedDoorElement.orientation360).toBe(externalUnglazedDoor.orientation);
		expect(externalUnglazedDoorElement.height).toBe(externalUnglazedDoor.height);
		expect(externalUnglazedDoorElement.width).toBe(externalUnglazedDoor.width);
		expect(externalUnglazedDoorElement.base_height).toBe(externalUnglazedDoor.elevationalHeight);
		expect(externalUnglazedDoorElement.area).toBe(externalUnglazedDoor.surfaceArea);
		expect(externalUnglazedDoorElement.solar_absorption_coeff).toBe(externalUnglazedDoor.solarAbsorption);
		expect(externalUnglazedDoorElement.u_value).toBe(externalUnglazedDoor.uValue);
		expect(externalUnglazedDoorElement.areal_heat_capacity).toBe(externalUnglazedDoor.kappaValue);
		expect(externalUnglazedDoorElement.mass_distribution_class).toBe(externalUnglazedDoor.massDistributionClass);
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

		expect(windowElement.pitch).toBe(window.pitch);
		expect(windowElement.orientation360).toBe(window.orientation);
		expect(windowElement.height).toBe(window.height);
		expect(windowElement.width).toBe(window.width);
		expect(windowElement.base_height).toBe(window.elevationalHeight);
		expect(windowElement.area).toBe(window.surfaceArea);
		expect(windowElement.u_value).toBe(window.uValue);
		expect(windowElement.g_value).toBe(window.solarTransmittance);
		expect(windowElement.mid_height).toBe(window.midHeight);
		expect(windowElement.frame_area_fraction).toBe(window.frameToOpeningRatio);
		expect(windowElement.max_window_open_area).toBe(window.maximumOpenableArea);
		expect(windowElement.free_area_height).toBe(window.heightOpenableArea);
		expect(windowElement.window_part_list).toEqual([{
			mid_height_air_flow_path: window.midHeightOpenablePart1!
		}]);
		expect(windowElement.shading).toEqual([
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
		]);
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

		expect(linearThermalBridgeElement.junction_type).toBe(linearThermalBridge.typeOfThermalBridge);
		expect(linearThermalBridgeElement.linear_thermal_transmittance).toBe(linearThermalBridge.linearThermalTransmittance);
		expect(linearThermalBridgeElement.length).toBe(linearThermalBridge.length);
		expect(pointThermalBridgeElement.heat_transfer_coeff).toBe(pointThermalBridge.heatTransferCoefficient);
	});
});