import type { BuildingElementGroundForSchema, BuildingElementOfType, SchemaThermalBridgingLinearFhs, SchemaThermalBridgingPoint, SchemaEdgeInsulationHorizontal, SchemaEdgeInsulationVertical } from "~/schema/aliases";
import { mapCeilingAndRoofData, mapDoorData, mapFloorData, mapLightingData, mapThermalBridgingData, mapWallData, mapWindowData, mapZoneParametersData } from "./dwellingFabricMapper";
import { defaultZoneName } from "./common";
import type {
	DwellingSpaceLightingData,
	DwellingSpaceZoneParametersData,
	EcaasForm,
	ExternalUnglazedDoorData,
	PartyWallData,
} from "~/stores/ecaasStore.schema";
import { asMetres, centimetre, type Length } from "~/utils/units/length";

type BuildingElementOpaque = BuildingElementOfType<"BuildingElementOpaque">;
type BuildingElementAdjacentConditionedSpace = BuildingElementOfType<"BuildingElementAdjacentConditionedSpace">;
type BuildingElementAdjacentUnconditionedSpaceSimple = BuildingElementOfType<"BuildingElementAdjacentUnconditionedSpace_Simple">;
type BuildingElementTransparent = BuildingElementOfType<"BuildingElementTransparent">;
type BuildingElementPartyWall = BuildingElementOfType<"BuildingElementPartyWall">;

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
			volume: 10,
			livingZoneArea: 5,
			groundFloorArea: 8,
			restOfDwellingArea: 0,
		};

		store.$patch({
			spaceHeating: {
				heatEmitters: {
					data: [{
						data: { name: "radiator 1", typeOfHeatEmitter: "radiator" }, complete: true,
					},
					{
						data: { name: "ieh 1", typeOfHeatEmitter: "instantElectricHeater" }, complete: true,
					},
					], complete: true,
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
		expect(fhsInputData.Zone[defaultZoneName]?.volume).toBe(state.volume);
		expect(fhsInputData.Zone[defaultZoneName]?.livingroom_area).toBe(state.livingZoneArea);
		expect(fhsInputData.Zone[defaultZoneName]?.restofdwelling_area).toBe(state.restOfDwellingArea);
		expect(fhsInputData.Zone[defaultZoneName]?.SpaceHeatSystem).toEqual(["radiator 1", "ieh 1"]);
	});

	it("maps lighting input state to FHS input request", () => {
		// Arrange
		const bulb1: DwellingSpaceLightingData = {
			name: "Bulb 1",
			numberOfBulbs: 5,
			power: 5,
			efficacy: 120,
		};
		const bulb2: DwellingSpaceLightingData = {
			name: "Bulb 2",
			numberOfBulbs: 3,
			power: 7,
			efficacy: 110,
		};

		store.$patch({
			dwellingFabric: {
				dwellingSpaceLighting: {
					data: [{ data: bulb1, complete: true }, { data: bulb2, complete: true }],
					complete: true,
				},
			},
		});

		// Act
		const fhsInputData = mapLightingData(resolveState(store.$state));

		let bulbs = fhsInputData.Zone[defaultZoneName]?.Lighting?.bulbs;

		bulbs = bulbs as NonNullable<typeof bulbs>;

		// Assert
		expect(bulbs).toEqual([
			{
				count: bulb1.numberOfBulbs,
				power: bulb1.power,
				efficacy: bulb1.efficacy,
			},
			{
				count: bulb2.numberOfBulbs,
				power: bulb2.power,
				efficacy: bulb2.efficacy,
			},
		]);
	});
	it("maps floor input state to FHS input request", () => {
		// Arrange
		const groundFloor: GroundFloorData = {
			name: "Ground 1",
			surfaceArea: 5,
			totalArea: 7,
			uValue: 1,
			thermalResistance: 1,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
			perimeter: 0,
			psiOfWallJunction: 0,
			thicknessOfWalls: 30,
			typeOfGroundFloor: "Slab_no_edge_insulation",
		};

		const groundFloorWithHorizontalEdgeInsulation: GroundFloorData = {
			...groundFloor,
			name: "Ground 2",
			typeOfGroundFloor: "Slab_edge_insulation",
			edgeInsulationType: ["horizontal"],
			horizontalEdgeInsulationThermalResistance: 36,
			horizontalEdgeInsulationWidth: unitValue(6, centimetre),
		};

		const groundFloorWithVerticalEdgeInsulation: GroundFloorData = {
			...groundFloor,
			name: "Ground 6",
			typeOfGroundFloor: "Slab_edge_insulation",
			edgeInsulationType: ["vertical"],
			verticalEdgeInsulationThermalResistance: 36,
			verticalEdgeInsulationDepth: unitValue(6, centimetre),
		};

		const groundFloorWithHorizontalAndVerticalEdgeInsulation: GroundFloorData = {
			...groundFloor,
			name: "Ground 7",
			typeOfGroundFloor: "Slab_edge_insulation",
			edgeInsulationType: ["horizontal", "vertical"],
			horizontalEdgeInsulationThermalResistance: 36,
			horizontalEdgeInsulationWidth: unitValue(6, centimetre),
			verticalEdgeInsulationThermalResistance: 36,
			verticalEdgeInsulationDepth: unitValue(6, centimetre),
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

		const internalFloorUnheatedSpace: InternalFloorData = {
			typeOfInternalFloor: "unheatedSpace",
			name: "Internal 1",
			surfaceAreaOfElement: 5,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
			thermalResistanceOfAdjacentUnheatedSpace: 1,
			uValue: 1,
		};

		const internalFloorHeatedSpace: InternalFloorData = {
			typeOfInternalFloor: "heatedSpace",
			name: "Internal 2",
			surfaceAreaOfElement: 5,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
			uValue: 1,
		};

		const exposedFloor: ExposedFloorData = {
			name: "Exposed Floor 1",
			pitch: 180,
			length: 0.5,
			width: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			uValue: 1,
			colour: "Dark",
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
		};
		const floorAboveUnheatedBasement: FloorAboveUnheatedBasementData = {
			name: "Floor above unheated basement 1",
			surfaceArea: 3,
			totalArea: 5,
			uValue: 1,
			thermalResistance: 2,
			arealHeatCapacity: "Light",
			massDistributionClass: "E",
			perimeter: 5,
			psiOfWallJunction: 1.2,
			thicknessOfWalls: 20,
			depthOfBasementFloor: 1,
			heightOfBasementWalls: 0.9,
			thermalResistanceOfBasementWalls: 0.6,
			thermalTransmittanceOfBasementWalls: 0.7,
			thermalTransmittanceOfFoundations: 0.8,
		};
		const floorAboveHeatedBasement: FloorOfHeatedBasementData = {
			id: "974e8749-f465-4f43-a38a-3d0b97060a64",
			name: "Floor above heated basement 1",
			netSurfaceArea: 5,
			totalArea: 10,
			uValue: 1,
			thermalResistance: 1,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
			depthOfBasementFloor: 1,
			psiOfWallJunction: 1,
			thicknessOfWalls: 30,
		};
		const wallOfHeatedBasement: WallOfHeatedBasementData = {
			id: "heated-basement-wall-id",
			name: "Wall of heated basement 1",
			uValue: 1,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
			associatedBasementFloorId: "974e8749-f465-4f43-a38a-3d0b97060a64",
			netSurfaceArea: 500,
			thermalResistance: 1.5,
			perimeter: 120,
		};
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceGroundFloor: {
						...baseForm,
						data: [
							{ ...baseForm, data: groundFloor },
							{ ...baseForm, data: groundFloorWithHorizontalEdgeInsulation },
							{ ...baseForm, data: groundFloorWithVerticalEdgeInsulation },
							{ ...baseForm, data: groundFloorWithHorizontalAndVerticalEdgeInsulation },
							{ ...baseForm, data: groundFloorWithSuspendedFloor },
							{ ...baseForm, data: groundFloorWithHeatedBasement },
							{ ...baseForm, data: groundFloorWithUnheatedBasement },
						],
					},
					dwellingSpaceInternalFloor: { ...baseForm, data: [{ ...baseForm, data: internalFloorUnheatedSpace }, { ...baseForm, data: internalFloorHeatedSpace }] },
					dwellingSpaceExposedFloor: { ...baseForm, data: [{ ...baseForm, data: exposedFloor }] },
					dwellingSpaceFloorAboveUnheatedBasement: { ...baseForm, data: [{ ...baseForm, data: floorAboveUnheatedBasement }] },
					dwellingSpaceFloorOfHeatedBasement: { ...baseForm, data: [{ ...baseForm, data: floorAboveHeatedBasement }] },
				},
				dwellingSpaceWalls: {
					dwellingSpaceWallOfHeatedBasement: { ...baseForm, data: [{ ...baseForm, data: wallOfHeatedBasement }] },

				},
			},
		});

		const groundFloorsTotalArea = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.data.length * groundFloor.surfaceArea;
		const floorSuffix = " (floor)";

		// Act
		const fhsInputData = mapFloorData(resolveState(store.$state));

		// Assert
		const groundFloorElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[groundFloor.name + floorSuffix]! as BuildingElementGroundForSchema;
		const groundFloorWithHorizontalEdgeInsulationElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[groundFloorWithHorizontalEdgeInsulation.name + floorSuffix]! as BuildingElementGroundForSchema;
		const groundFloorWithVerticalEdgeInsulationElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[groundFloorWithVerticalEdgeInsulation.name + floorSuffix]! as BuildingElementGroundForSchema;
		const groundFloorWithHorizontalAndVerticalEdgeInsulationElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[groundFloorWithHorizontalAndVerticalEdgeInsulation.name + floorSuffix]! as BuildingElementGroundForSchema;
		const groundFloorWithSuspendedFloorElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[groundFloorWithSuspendedFloor.name + floorSuffix]! as BuildingElementGroundForSchema;
		const groundFloorWithHeatedBasementElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[groundFloorWithHeatedBasement.name + floorSuffix]! as BuildingElementGroundForSchema;
		const groundFloorWithUnheatedBasementElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[groundFloorWithUnheatedBasement.name + floorSuffix]! as BuildingElementGroundForSchema;
		const internalFloorUnheatedSpaceElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[internalFloorUnheatedSpace.name + floorSuffix] as BuildingElementAdjacentUnconditionedSpaceSimple;
		const internalFloorHeatedSpaceElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[internalFloorHeatedSpace.name + floorSuffix] as BuildingElementAdjacentConditionedSpace;
		const exposedFloorElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[exposedFloor.name + floorSuffix] as BuildingElementOpaque;
		const floorAboveUnheatedBasementElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[floorAboveUnheatedBasement.name + floorSuffix] as BuildingElementGroundForSchema;
		const floorAboveHeatedBasementElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[floorAboveHeatedBasement.name + floorSuffix] as BuildingElementGroundForSchema;

		expect(fhsInputData.GroundFloorArea).toBe(groundFloorsTotalArea);

		const expectedGroundFloor: BuildingElementGroundForSchema = {
			type: "BuildingElementGround",
			area: groundFloor.surfaceArea,
			total_area: groundFloor.totalArea,
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

		const expectedHorizonalEdgeInsulation: SchemaEdgeInsulationHorizontal[] = [{
			type: "horizontal" as const,
			edge_thermal_resistance: groundFloorWithHorizontalEdgeInsulation.horizontalEdgeInsulationThermalResistance,
			width: asMetres(groundFloorWithHorizontalEdgeInsulation.horizontalEdgeInsulationWidth as Length),
		}];

		expect("edge_insulation" in groundFloorWithHorizontalEdgeInsulationElement && groundFloorWithHorizontalEdgeInsulationElement.edge_insulation).toEqual(expectedHorizonalEdgeInsulation);

		const expectedVerticalEdgeInsulation: SchemaEdgeInsulationVertical[] = [{
			type: "vertical" as const,
			edge_thermal_resistance: groundFloorWithVerticalEdgeInsulation.verticalEdgeInsulationThermalResistance,
			depth: asMetres(groundFloorWithVerticalEdgeInsulation.verticalEdgeInsulationDepth as Length),
		}];

		expect("edge_insulation" in groundFloorWithVerticalEdgeInsulationElement && groundFloorWithVerticalEdgeInsulationElement.edge_insulation).toEqual(expectedVerticalEdgeInsulation);

		const expectedHorizontalAndVerticalEdgeInsulation: (SchemaEdgeInsulationHorizontal | SchemaEdgeInsulationVertical)[] = [
			{
				type: "horizontal" as const,
				edge_thermal_resistance: groundFloorWithHorizontalAndVerticalEdgeInsulation.horizontalEdgeInsulationThermalResistance,
				width: asMetres(groundFloorWithHorizontalAndVerticalEdgeInsulation.horizontalEdgeInsulationWidth as Length),
			},
			{
				type: "vertical" as const,
				edge_thermal_resistance: groundFloorWithHorizontalAndVerticalEdgeInsulation.verticalEdgeInsulationThermalResistance,
				depth: asMetres(groundFloorWithHorizontalAndVerticalEdgeInsulation.verticalEdgeInsulationDepth as Length),
			},
		];

		expect("edge_insulation" in groundFloorWithHorizontalAndVerticalEdgeInsulationElement && groundFloorWithHorizontalAndVerticalEdgeInsulationElement.edge_insulation).toEqual(expectedHorizontalAndVerticalEdgeInsulation);

		const expectedGroundFloorSuspendedFloor: BuildingElementGroundForSchema = {
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

		const expectedGroundFloorWithHeatedBasement: BuildingElementGroundForSchema = {
			...expectedGroundFloor,
			floor_type: groundFloorWithHeatedBasement.typeOfGroundFloor,
			depth_basement_floor: groundFloorWithHeatedBasement.depthOfBasementFloorBelowGround,
			thermal_resist_walls_base: groundFloorWithHeatedBasement.thermalResistanceOfBasementWalls,
		};

		expect(groundFloorWithHeatedBasementElement).toEqual(expectedGroundFloorWithHeatedBasement);

		const expectedGroundFloorWithUnheatedBasement: BuildingElementGroundForSchema = {
			...expectedGroundFloor,
			floor_type: groundFloorWithUnheatedBasement.typeOfGroundFloor,
			thermal_transm_envi_base: groundFloorWithUnheatedBasement.thermalTransmittanceOfFloorAboveBasement,
			height_basement_walls: groundFloorWithUnheatedBasement.heightOfBasementWallsAboveGround,
			thermal_transm_walls: groundFloorWithUnheatedBasement.thermalTransmittanceOfWallsAboveGround,
			depth_basement_floor: groundFloorWithUnheatedBasement.depthOfBasementFloorBelowGround,
			thermal_resist_walls_base: groundFloorWithUnheatedBasement.thermalResistanceOfBasementWalls,
		};

		expect(groundFloorWithUnheatedBasementElement).toEqual(expectedGroundFloorWithUnheatedBasement);

		const expectedInternalFloorUnheatedSpace: BuildingElementAdjacentUnconditionedSpaceSimple = {
			type: "BuildingElementAdjacentUnconditionedSpace_Simple",
			area: internalFloorUnheatedSpace.surfaceAreaOfElement,
			pitch: 180,
			u_value: internalFloorUnheatedSpace.uValue,
			areal_heat_capacity: internalFloorUnheatedSpace.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(internalFloorUnheatedSpace.massDistributionClass),
			thermal_resistance_unconditioned_space: internalFloorUnheatedSpace.thermalResistanceOfAdjacentUnheatedSpace,
		};
		const expectedInternalFloorHeatedSpace: BuildingElementAdjacentConditionedSpace = {
			type: "BuildingElementAdjacentConditionedSpace",
			area: internalFloorHeatedSpace.surfaceAreaOfElement,
			pitch: 180,
			u_value: internalFloorHeatedSpace.uValue,
			areal_heat_capacity: internalFloorHeatedSpace.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(internalFloorHeatedSpace.massDistributionClass),
		};

		expect(internalFloorUnheatedSpaceElement).toEqual(expectedInternalFloorUnheatedSpace);
		expect(internalFloorHeatedSpaceElement).toEqual(expectedInternalFloorHeatedSpace);

		const expectedExposedFloor: BuildingElementOpaque = {
			type: "BuildingElementOpaque",
			area: exposedFloor.surfaceArea,
			height: exposedFloor.length,
			width: exposedFloor.width,
			base_height: exposedFloor.elevationalHeight,
			pitch: exposedFloor.pitch,
			u_value: exposedFloor.uValue,
			colour: exposedFloor.colour,
			areal_heat_capacity: exposedFloor.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(exposedFloor.massDistributionClass),
			is_external_door: false,
			is_unheated_pitched_roof: false,
		};

		expect(exposedFloorElement).toEqual(expectedExposedFloor);

		const expectedFloorAboveUnheatedBasement: BuildingElementGroundForSchema = {
			type: "BuildingElementGround",
			thermal_resistance_construction: floorAboveUnheatedBasement.thermalResistance,
			u_value: floorAboveUnheatedBasement.uValue,
			total_area: floorAboveUnheatedBasement.totalArea,
			floor_type: "Unheated_basement",
			thickness_walls: floorAboveUnheatedBasement.thicknessOfWalls / 1000,
			perimeter: floorAboveUnheatedBasement.perimeter,
			psi_wall_floor_junc: floorAboveUnheatedBasement.psiOfWallJunction,
			thermal_resistance_floor_construction: floorAboveUnheatedBasement.thermalResistance,
			areal_heat_capacity: floorAboveUnheatedBasement.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(floorAboveUnheatedBasement.massDistributionClass),
			area: floorAboveUnheatedBasement.surfaceArea,
			depth_basement_floor: floorAboveUnheatedBasement.depthOfBasementFloor,
			thermal_resist_walls_base: floorAboveUnheatedBasement.thermalResistanceOfBasementWalls,
			thermal_transm_envi_base: floorAboveUnheatedBasement.thermalTransmittanceOfFoundations,
			thermal_transm_walls: floorAboveUnheatedBasement.thermalTransmittanceOfBasementWalls,
			height_basement_walls: floorAboveUnheatedBasement.heightOfBasementWalls,
		};

		expect(floorAboveUnheatedBasementElement).toEqual(expectedFloorAboveUnheatedBasement);

		const expectedFloorOfHeatedBasement: BuildingElementGroundForSchema = {
			type: "BuildingElementGround",
			total_area: floorAboveHeatedBasement.totalArea,
			mass_distribution_class: fullMassDistributionClass(floorAboveHeatedBasement.massDistributionClass),
			areal_heat_capacity: floorAboveHeatedBasement.arealHeatCapacity,
			depth_basement_floor: floorAboveHeatedBasement.depthOfBasementFloor,
			perimeter: 0,
			psi_wall_floor_junc: floorAboveHeatedBasement.psiOfWallJunction,
			thickness_walls: floorAboveHeatedBasement.thicknessOfWalls / 1000,
			floor_type: "Heated_basement",
			area: floorAboveHeatedBasement.netSurfaceArea,
			thermal_resistance_construction: floorAboveHeatedBasement.thermalResistance,
			thermal_resistance_floor_construction: floorAboveHeatedBasement.thermalResistance,
			u_value: floorAboveHeatedBasement.uValue,
			thermal_resist_walls_base: wallOfHeatedBasement.thermalResistance,
		};

		expect(floorAboveHeatedBasementElement).toEqual(expectedFloorOfHeatedBasement);

	});

	it("maps wall input state to FHS input request", () => {
		// Arrange
		const externalWall: EcaasForm<ExternalWallData> = {
			...baseForm,
			data: {
				id: "ex-id",
				name: "External wall 1",
				pitchOption: "90",
				pitch: 90,
				orientation: 0,
				length: 20,
				height: 0.5,
				elevationalHeight: 20,
				surfaceArea: 10,
				colour: "Light",
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
				uValue: 1,
			},
		};

		const internalWall: EcaasForm<InternalWallData> = {
			...baseForm,
			data: {
				id: "in-id",
				name: "Internal 1",
				surfaceAreaOfElement: 5,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
				pitchOption: "90",
				pitch: 90,
				uValue: 1,
			},
		};

		const partyWallWithLiningType: EcaasForm<PartyWallData> = {
			...baseForm,
			data: {
				id: "party-id-with-lining-type",
				name: "Party wall 1",
				pitchOption: "90",
				pitch: 90,
				surfaceArea: 10,
				uValue: 1,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
				partyWallCavityType: "filled_unsealed",
				partyWallLiningType: "dry_lined",
			},
		};

		const partyWallWithThermalResistanceCavity: EcaasForm<PartyWallData> = {
			...baseForm,
			data: {
				id: "party-id-with-thermal-resistance-cavity",
				name: "Party wall 2",
				pitchOption: "90",
				pitch: 90,
				surfaceArea: 10,
				uValue: 2,
				arealHeatCapacity: "Light",
				massDistributionClass: "E",
				partyWallCavityType: "defined_resistance",
				thermalResistanceCavity: 24,
			},
		};

		const partyWallWithoutExtraAttributes: EcaasForm<PartyWallData> = {
			...baseForm,
			data: {
				id: "party-id-without-extra-attrs",
				name: "Party wall 3",
				pitchOption: "90",
				pitch: 90,
				surfaceArea: 10,
				uValue: 1.5,
				arealHeatCapacity: "Medium",
				massDistributionClass: "D",
				partyWallCavityType: "solid",
			},
		};

		const wallToUnheatedSpace: EcaasForm<WallsToUnheatedSpaceData> = {
			...baseForm,
			data: {
				id: "unheated-id",
				name: "Wall to unheated space 1",
				surfaceAreaOfElement: 500,
				uValue: 1,
				arealHeatCapacity: "Very light",
				massDistributionClass: "E",
				pitchOption: "90",
				pitch: 90,
				thermalResistanceOfAdjacentUnheatedSpace: 1,
			},
		};
		const wallOfHeatedBasement: EcaasForm<WallOfHeatedBasementData> = {
			...baseForm,
			data: {
				id: "heated-basement-wall-id",
				name: "Wall of heated basement 1",
				uValue: 10,
				arealHeatCapacity: "Very light",
				massDistributionClass: "E",
				associatedBasementFloorId: "974e8749-f465-4f43-a38a-3d0b97060a64",
				netSurfaceArea: 500,
				thermalResistance: 1,
				perimeter: 120,
			},
		};
		const floorOfHeatedBasement: EcaasForm<FloorOfHeatedBasementData> = {
			...baseForm,
			data: {
				id: "974e8749-f465-4f43-a38a-3d0b97060a64",
				name: "Floor above heated basement 1",
				netSurfaceArea: 5,
				totalArea: 10,
				uValue: 1,
				thermalResistance: 1,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
				depthOfBasementFloor: 1,
				psiOfWallJunction: 1,
				thicknessOfWalls: 30,
			},
		};
		const wallSuffix = " (wall)";

		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: { ...baseForm, data: [externalWall] },
					dwellingSpaceInternalWall: { ...baseForm, data: [internalWall] },
					dwellingSpacePartyWall: { ...baseForm, data: [partyWallWithLiningType, partyWallWithThermalResistanceCavity, partyWallWithoutExtraAttributes] },
					dwellingSpaceWallToUnheatedSpace: { ...baseForm, data: [wallToUnheatedSpace] },
					dwellingSpaceWallOfHeatedBasement: { ...baseForm, data: [wallOfHeatedBasement] },

				},
				dwellingSpaceFloors: {
					dwellingSpaceFloorOfHeatedBasement: { ...baseForm, data: [floorOfHeatedBasement] },
				},
			},
		});

		// Act
		const fhsInputData = mapWallData(resolveState(store.$state));

		// Assert
		const externalWallElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[externalWall.data.name + wallSuffix]! as BuildingElementOpaque;
		const internalWallElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[internalWall.data.name + wallSuffix]! as BuildingElementAdjacentConditionedSpace;
		const partyWallWithLiningTypeElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[partyWallWithLiningType.data.name + wallSuffix]! as BuildingElementPartyWall;
		const partyWallWithThermalResistanceCavityElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[partyWallWithThermalResistanceCavity.data.name + wallSuffix]! as BuildingElementPartyWall;
		const partyWallWithoutExtraAttributesElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[partyWallWithoutExtraAttributes.data.name + wallSuffix]! as BuildingElementPartyWall;
		const wallToUnheatedSpaceElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[wallToUnheatedSpace.data.name + wallSuffix] as BuildingElementAdjacentUnconditionedSpaceSimple;

		const expectedExternalWall: BuildingElementOpaque = {
			type: "BuildingElementOpaque",
			pitch: externalWall.data.pitch!,
			orientation360: externalWall.data.orientation,
			height: externalWall.data.height,
			width: externalWall.data.length,
			base_height: externalWall.data.elevationalHeight,
			area: externalWall.data.surfaceArea,
			colour: externalWall.data.colour,
			areal_heat_capacity: externalWall.data.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(externalWall.data.massDistributionClass),
			is_external_door: false,
			is_unheated_pitched_roof: false,
			u_value: externalWall.data.uValue,
		};

		expect(externalWallElement).toEqual(expectedExternalWall);

		const expectedInternalWall: BuildingElementAdjacentConditionedSpace = {
			type: "BuildingElementAdjacentConditionedSpace",
			pitch: internalWall.data.pitch!,
			area: internalWall.data.surfaceAreaOfElement,
			u_value: internalWall.data.uValue,
			areal_heat_capacity: internalWall.data.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(internalWall.data.massDistributionClass),
		};

		expect(internalWallElement).toEqual(expectedInternalWall);

		const expectedPartyWallWithLiningType: BuildingElementPartyWall = {
			type: "BuildingElementPartyWall",
			pitch: partyWallWithLiningType.data.pitch!,
			area: partyWallWithLiningType.data.surfaceArea,
			u_value: partyWallWithLiningType.data.uValue,
			areal_heat_capacity: partyWallWithLiningType.data.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(partyWallWithLiningType.data.massDistributionClass),
			party_wall_cavity_type: "filled_unsealed",
			party_wall_lining_type: "dry_lined",
		};

		expect(partyWallWithLiningTypeElement).toEqual(expectedPartyWallWithLiningType);

		const expectPartyWallWithThermalResistanceCavity: BuildingElementPartyWall = {
			type: "BuildingElementPartyWall",
			pitch: partyWallWithThermalResistanceCavity.data.pitch!,
			area: partyWallWithThermalResistanceCavity.data.surfaceArea,
			areal_heat_capacity: partyWallWithThermalResistanceCavity.data.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(partyWallWithThermalResistanceCavity.data.massDistributionClass),
			party_wall_cavity_type: "defined_resistance",
			thermal_resistance_cavity: 24,
			u_value: partyWallWithThermalResistanceCavity.data.uValue,
		};

		expect(partyWallWithThermalResistanceCavityElement).toEqual(expectPartyWallWithThermalResistanceCavity);

		const expectPartyWallWithoutExtraAttributes: BuildingElementPartyWall = {
			type: "BuildingElementPartyWall",
			pitch: partyWallWithoutExtraAttributes.data.pitch!,
			area: partyWallWithoutExtraAttributes.data.surfaceArea,
			u_value: partyWallWithoutExtraAttributes.data.uValue,
			areal_heat_capacity: partyWallWithoutExtraAttributes.data.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(partyWallWithoutExtraAttributes.data.massDistributionClass),
			party_wall_cavity_type: "solid",
		};

		expect(partyWallWithoutExtraAttributesElement).toEqual(expectPartyWallWithoutExtraAttributes);

		const expectedWallToUnheatedSpace: BuildingElementAdjacentUnconditionedSpaceSimple = {
			type: "BuildingElementAdjacentUnconditionedSpace_Simple",
			pitch: wallToUnheatedSpace.data.pitch!,
			area: wallToUnheatedSpace.data.surfaceAreaOfElement,
			areal_heat_capacity: wallToUnheatedSpace.data.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(wallToUnheatedSpace.data.massDistributionClass),
			thermal_resistance_unconditioned_space: wallToUnheatedSpace.data.thermalResistanceOfAdjacentUnheatedSpace,
			u_value: wallToUnheatedSpace.data.uValue,
		};

		expect(wallToUnheatedSpaceElement).toEqual(expectedWallToUnheatedSpace);

		const expectedWallOfHeatedBasement: BuildingElementGroundForSchema = {
			type: "BuildingElementGround",
			floor_type: "Heated_basement",
			area: wallOfHeatedBasement.data.netSurfaceArea,
			total_area: wallOfHeatedBasement.data.netSurfaceArea,
			u_value: wallOfHeatedBasement.data.uValue,
			thermal_resistance_construction: wallOfHeatedBasement.data.thermalResistance,
			mass_distribution_class: fullMassDistributionClass(wallOfHeatedBasement.data.massDistributionClass),
			areal_heat_capacity: wallOfHeatedBasement.data.arealHeatCapacity,
			thermal_resist_walls_base: wallOfHeatedBasement.data.thermalResistance,
			thermal_resistance_floor_construction: floorOfHeatedBasement.data.thermalResistance,
			psi_wall_floor_junc: floorOfHeatedBasement.data.psiOfWallJunction,
			depth_basement_floor: floorOfHeatedBasement.data.depthOfBasementFloor,
			perimeter: wallOfHeatedBasement.data.perimeter,
			thickness_walls: floorOfHeatedBasement.data.thicknessOfWalls / 1000,
		};

		expect(fhsInputData.Zone[defaultZoneName]!.BuildingElement[wallOfHeatedBasement.data.name + wallSuffix]).toEqual(expectedWallOfHeatedBasement);
	});

	it("maps ceiling and roof input state to FHS input request", () => {
		// Arrange
		const ceiling: CeilingData = {
			id: "ceiling-id",
			type: "unheatedSpace",
			name: "Ceiling 1",
			surfaceArea: 5,
			uValue: 1,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
			pitchOption: "0",
			pitch: 0,
			thermalResistanceOfAdjacentUnheatedSpace: 1,
		};

		const roofAboveHeatedSpace: RoofData = {
			id: "roof-id",
			name: "Roof above heated space",
			typeOfRoof: "flatAboveHeatedSpace",
			pitchOption: "custom",
			pitch: 0,
			length: 1,
			width: 1,
			elevationalHeightOfElement: 2,
			surfaceArea: 1,
			uValue: 1,
			colour: "Dark",
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
		};

		const roofAboveUnheatedSpace: RoofData = {
			id: "roof-unheated-space-id",
			name: "Roof above unheated space",
			typeOfRoof: "flatAboveUnheatedSpace",
			pitchOption: "custom",
			pitch: 0,
			length: 1,
			width: 1,
			elevationalHeightOfElement: 2,
			surfaceArea: 1,
			uValue: 1,
			colour: "Dark",
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
		};

		const roofPitchedInsulatedAtCeiling: RoofData = {
			id: "roof-pitched-insulated-at-joist-id",
			name: "Roof 2",
			typeOfRoof: "pitchedInsulatedAtCeiling",
			pitch: 30,
			pitchOption: "custom",
			length: 1,
			width: 1,
			elevationalHeightOfElement: 2,
			surfaceArea: 1,
			uValue: 1,
			colour: "Dark",
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
		};

		const roofPitchedInsulatedAtRoof: RoofData = {
			id: "roof-pitched-insulated-at-roof-id",
			name: "Roof 3",
			typeOfRoof: "pitchedInsulatedAtRoof",
			pitch: 30,
			pitchOption: "custom",
			length: 1,
			width: 1,
			elevationalHeightOfElement: 2,
			surfaceArea: 1,
			uValue: 1,
			colour: "Dark",
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
		};

		const ceilingSuffix = " (ceiling)";
		const roofSuffix = " (roof)";

		store.$patch({
			dwellingFabric: {
				dwellingSpaceCeilingsAndRoofs: {
					dwellingSpaceCeilings: { ...baseForm, data: [{ ...baseForm, data: ceiling }] },
					dwellingSpaceRoofs: {
						...baseForm,
						data: [
							{ ...baseForm, data: roofAboveHeatedSpace },
							{ ...baseForm, data: roofAboveUnheatedSpace },
							{ ...baseForm, data: roofPitchedInsulatedAtCeiling },
							{ ...baseForm, data: roofPitchedInsulatedAtRoof }],
					},
				},
			},
		});

		// Act
		const fhsInputData = mapCeilingAndRoofData(resolveState(store.$state));
		// Assert
		const ceilingElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[ceiling.name + ceilingSuffix]! as BuildingElementAdjacentUnconditionedSpaceSimple;
		const roofAboveHeatedSpaceElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[roofAboveHeatedSpace.name + roofSuffix]! as BuildingElementOpaque;
		const roofAboveUnheatedSpaceElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[roofAboveUnheatedSpace.name + roofSuffix] as BuildingElementAdjacentUnconditionedSpaceSimple;
		const roofPitchedInsulatedAtCeilingElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[roofPitchedInsulatedAtCeiling.name + roofSuffix] as BuildingElementOpaque;
		const roofPitchedInsulatedAtRoofElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[roofPitchedInsulatedAtRoof.name + roofSuffix] as BuildingElementOpaque;

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

		const expectedFlatRoofAboveHeatedSpace: BuildingElementOpaque = {
			type: "BuildingElementOpaque",
			pitch: roofAboveHeatedSpace.pitch,
			orientation360: 0,
			height: roofAboveHeatedSpace.length,
			width: roofAboveHeatedSpace.width,
			base_height: roofAboveHeatedSpace.elevationalHeightOfElement,
			area: roofAboveHeatedSpace.surfaceArea,
			u_value: roofAboveHeatedSpace.uValue,
			colour: roofAboveHeatedSpace.colour,
			areal_heat_capacity: roofAboveHeatedSpace.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(roofAboveHeatedSpace.massDistributionClass),
			is_external_door: false,
			is_unheated_pitched_roof: false,
		};

		expect(roofAboveHeatedSpaceElement).toEqual(expectedFlatRoofAboveHeatedSpace);

		const expectedFlatRoofAboveUnheatedSpace: BuildingElementOpaque = {
			type: "BuildingElementOpaque",
			pitch: roofAboveUnheatedSpace.pitch,
			orientation360: 0,
			height: roofAboveUnheatedSpace.length,
			width: roofAboveUnheatedSpace.width,
			base_height: roofAboveUnheatedSpace.elevationalHeightOfElement,
			area: roofAboveUnheatedSpace.surfaceArea,
			u_value: roofAboveUnheatedSpace.uValue,
			colour: roofAboveUnheatedSpace.colour,
			areal_heat_capacity: roofAboveUnheatedSpace.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(roofAboveUnheatedSpace.massDistributionClass),
			is_external_door: false,
			is_unheated_pitched_roof: false,
		};
		expect(roofAboveUnheatedSpaceElement).toEqual(expectedFlatRoofAboveUnheatedSpace);

		const expectedRoofPitchedInsulatedAtCeiling: BuildingElementOpaque = {
			type: "BuildingElementOpaque",
			pitch: roofPitchedInsulatedAtCeiling.pitch,
			orientation360: 0,
			height: roofPitchedInsulatedAtCeiling.length,
			width: roofPitchedInsulatedAtCeiling.width,
			base_height: roofPitchedInsulatedAtCeiling.elevationalHeightOfElement,
			area: roofPitchedInsulatedAtCeiling.surfaceArea,
			u_value: roofPitchedInsulatedAtCeiling.uValue,
			colour: roofPitchedInsulatedAtCeiling.colour,
			areal_heat_capacity: roofPitchedInsulatedAtCeiling.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(roofPitchedInsulatedAtCeiling.massDistributionClass),
			is_external_door: false,
			is_unheated_pitched_roof: true,
		};

		expect(roofPitchedInsulatedAtCeilingElement).toEqual(expectedRoofPitchedInsulatedAtCeiling);

		const expectedRoofPitchedInsulatedAtRoof: BuildingElementOpaque = {
			type: "BuildingElementOpaque",
			pitch: roofPitchedInsulatedAtRoof.pitch,
			orientation360: 0,
			height: roofPitchedInsulatedAtRoof.length,
			width: roofPitchedInsulatedAtRoof.width,
			base_height: roofPitchedInsulatedAtRoof.elevationalHeightOfElement,
			area: roofPitchedInsulatedAtRoof.surfaceArea,
			u_value: roofPitchedInsulatedAtRoof.uValue,
			colour: roofPitchedInsulatedAtRoof.colour,
			areal_heat_capacity: roofPitchedInsulatedAtRoof.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(roofPitchedInsulatedAtRoof.massDistributionClass),
			is_external_door: false,
			is_unheated_pitched_roof: false,
		};

		expect(roofPitchedInsulatedAtRoofElement).toEqual(expectedRoofPitchedInsulatedAtRoof);
	});

	it("maps door input state to FHS input request", () => {
		// Arrange

		const externalWall: EcaasForm<ExternalWallData> = {
			...baseForm,
			data: {
				id: "cbb78615-d2de-482b-a8f1-ce48534aaa05",
				name: "External wall 1",
				pitchOption: "90",
				pitch: 90,
				orientation: 0,
				length: 20,
				height: 0.5,
				elevationalHeight: 20,
				surfaceArea: 10,
				colour: "Light",
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
				uValue: 0.3,
			},
		};

		const internalWall: EcaasForm<InternalWallData> = {
			...baseForm,
			data: {
				id: "e36223a9-420f-422f-ad3f-ccfcec1455c7",
				name: "Internal 1",
				surfaceAreaOfElement: 5,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
				pitchOption: "90",
				pitch: 90,
				uValue: 1,
			},
		};

		const internalDoorUnheatedSpace: InternalDoorData = {
			typeOfInternalDoor: "unheatedSpace",
			name: "Internal 1",
			isTheFrontDoor: false,
			associatedItemId: internalWall.data.id,
			surfaceArea: 5,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
			uValue: 0.001,
			thermalResistanceOfAdjacentUnheatedSpace: 1,
		};

		const internalDoorHeatedSpace: InternalDoorData = {
			typeOfInternalDoor: "heatedSpace",
			name: "Internal 2",
			isTheFrontDoor: false,
			associatedItemId: internalWall.data.id,
			surfaceArea: 5,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
			uValue: 1,
		};
		const externalGlazedDoor: ExternalGlazedDoorData = {
			name: "External glazed door 1",
			isTheFrontDoor: false,
			associatedItemId: externalWall.data.id,
			height: 1,
			width: 1,
			securityRisk: false,
			solarTransmittance: 0.1,
			elevationalHeight: 1,
			openingToFrameRatio: 0.3,
			midHeightOpenablePart1: 1,
			maximumOpenableArea: 1,
			heightOpenableArea: 1,
			uValue: 7,
			numberOpenableParts: "1",
			curtainsOrBlinds: true,
			treatmentType: "curtains",
			thermalResistivityIncrease: 20,
			solarTransmittanceReduction: 0.4,
			hasShading: true,
			shading: [
				{
					name: "blep",
					typeOfShading: "overhang",
					depth: 1,
					distance: 2,
				},
				{
					name: "bleep",
					typeOfShading: "left_side_fin",
					depth: 3,
					distance: 4,
				},
				{
					name: "bloop",
					typeOfShading: "right_side_fin",
					depth: 5,
					distance: 6,
				},
				{
					name: "blomp",
					typeOfShading: "frame_or_reveal",
					depth: 7,
					distance: 8,
				},
				{
					name: "blomk",
					typeOfShading: "obstacle",
					transparency: 20,
					distance: 9,
					height: 10,
				},
			],
		};

		const externalUnglazedDoor: ExternalUnglazedDoorData = {
			name: "External unglazed door 1",
			isTheFrontDoor: false,
			associatedItemId: externalWall.data.id,
			height: 0.5,
			width: 20,
			elevationalHeight: 20,
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
			colour: "Intermediate",
			uValue: 16,
		};

		const doorSuffix = " (door)";

		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: {
						data: [externalWall],
						complete: true,
					},
					dwellingSpaceInternalWall: {
						data: [internalWall],
						complete: true,
					},
				},
				dwellingSpaceDoors: {
					dwellingSpaceInternalDoor: { ...baseForm, data: [{ ...baseForm, data: internalDoorUnheatedSpace }, { ...baseForm, data: internalDoorHeatedSpace }] },
					dwellingSpaceExternalGlazedDoor: { ...baseForm, data: [{ ...baseForm, data: externalGlazedDoor }] },
					dwellingSpaceExternalUnglazedDoor: { ...baseForm, data: [{ ...baseForm, data: externalUnglazedDoor }] },
				},
			},
		});

		// Act
		const fhsInputData = mapDoorData(resolveState(store.$state));

		// Assert
		const internalDoorElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[internalDoorUnheatedSpace.name + doorSuffix]! as BuildingElementAdjacentUnconditionedSpaceSimple;
		const internalDoorHeatedSpaceElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[internalDoorHeatedSpace.name + doorSuffix]! as BuildingElementAdjacentUnconditionedSpaceSimple;
		const externalGlazedDoorElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[externalGlazedDoor.name + doorSuffix]! as BuildingElementTransparent;
		const externalUnglazedDoorElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[externalUnglazedDoor.name + doorSuffix]! as BuildingElementOpaque;

		const expectedInternalDoorUnheatedSpace: BuildingElementAdjacentUnconditionedSpaceSimple =
		{
			type: "BuildingElementAdjacentUnconditionedSpace_Simple",
			pitch: extractPitch(internalWall.data),
			area: internalDoorUnheatedSpace.surfaceArea,
			u_value: internalDoorUnheatedSpace.uValue,
			areal_heat_capacity: internalDoorUnheatedSpace.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(internalDoorUnheatedSpace.massDistributionClass),
			thermal_resistance_unconditioned_space: internalDoorUnheatedSpace.thermalResistanceOfAdjacentUnheatedSpace,
		};

		expect(internalDoorElement).toEqual(expectedInternalDoorUnheatedSpace);

		const expectedInternalDoorHeatedSpace: BuildingElementAdjacentConditionedSpace =
		{
			type: "BuildingElementAdjacentConditionedSpace",
			pitch: extractPitch(internalWall.data),
			area: internalDoorHeatedSpace.surfaceArea,
			u_value: internalDoorHeatedSpace.uValue,
			areal_heat_capacity: internalDoorHeatedSpace.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(internalDoorHeatedSpace.massDistributionClass),
		};

		expect(internalDoorHeatedSpaceElement).toEqual(expectedInternalDoorHeatedSpace);
		const midHeight = externalGlazedDoor.elevationalHeight + externalGlazedDoor.height / 2;

		const expectedExternalGlazedDoor: BuildingElementTransparent = {
			type: "BuildingElementTransparent",
			pitch: extractPitch(externalWall.data),
			orientation360: externalWall.data.orientation,
			height: externalGlazedDoor.height,
			width: externalGlazedDoor.width,
			mid_height: midHeight,
			base_height: externalGlazedDoor.elevationalHeight,
			g_value: externalGlazedDoor.solarTransmittance,
			frame_area_fraction: 1 - externalGlazedDoor.openingToFrameRatio,
			max_window_open_area: externalGlazedDoor.maximumOpenableArea,
			free_area_height: externalGlazedDoor.heightOpenableArea,
			window_part_list: [
				{ mid_height_air_flow_path: midHeight },
				{ mid_height_air_flow_path: externalGlazedDoor.midHeightOpenablePart1 },
			],
			shading: [
				{
					type: "overhang",
					depth: 1,
					distance: 2,
				},
				{
					type: "sidefinleft",
					depth: 3,
					distance: 4,
				},
				{
					type: "sidefinright",
					depth: 5,
					distance: 6,
				},
				{
					type: "reveal",
					depth: 7,
					distance: 8,
				},
				{
					type: "obstacle",
					transparency: 0.2,
					distance: 9,
					height: 10,
				},
			],
			security_risk: false,
			u_value: externalGlazedDoor.uValue,
			treatment: [{
				type: externalGlazedDoor.treatmentType,
				controls: "manual",
				delta_r: externalGlazedDoor.thermalResistivityIncrease,
				trans_red: externalGlazedDoor.solarTransmittanceReduction,
			}],
		};

		expect(externalGlazedDoorElement).toEqual(expectedExternalGlazedDoor);

		const expectedUnglazedDoor: BuildingElementOpaque = {
			area: externalUnglazedDoor.height * externalUnglazedDoor.width,
			type: "BuildingElementOpaque",
			pitch: extractPitch(externalWall.data),
			orientation360: externalWall.data.orientation,
			height: externalUnglazedDoor.height,
			width: externalUnglazedDoor.width,
			base_height: externalUnglazedDoor.elevationalHeight,
			areal_heat_capacity: externalUnglazedDoor.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(externalUnglazedDoor.massDistributionClass),
			is_external_door: true,
			is_unheated_pitched_roof: false,
			colour: "Intermediate",
			u_value: externalUnglazedDoor.uValue,
		};

		expect(externalUnglazedDoorElement).toEqual(expectedUnglazedDoor);
	});

	it("maps windows input state to FHS input request", () => {
		// Arrange
		const externalWall: EcaasForm<ExternalWallData> = {
			...baseForm,
			data: {
				id: "cbb78615-d2de-482b-a8f1-ce48534aaa05",
				name: "External wall 1",
				pitchOption: "90",
				pitch: 90,
				orientation: 0,
				length: 20,
				height: 0.5,
				elevationalHeight: 20,
				surfaceArea: 10,
				colour: "Intermediate",
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
				uValue: 0.3,
			},
		};

		const window: WindowData = {
			id: "test-id-1",
			name: "Window 1",
			taggedItem: externalWall.data.id,
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
			hasShading: true,
			shading: [
				{
					name: "blep",
					typeOfShading: "overhang",
					depth: 1,
					distance: 2,
				},
				{
					name: "bleep",
					typeOfShading: "left_side_fin",
					depth: 3,
					distance: 4,
				},
				{
					name: "bloop",
					typeOfShading: "right_side_fin",
					depth: 5,
					distance: 6,
				},
				{
					name: "blomp",
					typeOfShading: "frame_or_reveal",
					depth: 7,
					distance: 8,
				},
				{
					name: "blomk",
					typeOfShading: "obstacle",
					transparency: 20,
					distance: 9,
					height: 10,
				},
			],
		};

		const windowSuffix = " (window)";

		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: {
						data: [externalWall],
						complete: true,
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
		const fhsInputData = mapWindowData(resolveState(store.$state));

		// Assert
		const windowElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[
			window.name + windowSuffix
		]! as BuildingElementTransparent;

		const expectedWindow: BuildingElementTransparent = {
			type: "BuildingElementTransparent",
			pitch: externalWall.data.pitch!,
			orientation360: externalWall.data.orientation,
			height: window.height,
			width: window.width,
			base_height: window.elevationalHeight,
			u_value: window.uValue,
			g_value: window.solarTransmittance,
			mid_height: window.elevationalHeight + window.height / 2,
			frame_area_fraction: 1 - window.openingToFrameRatio,
			security_risk: false,
			free_area_height: 0,
			max_window_open_area: window.maximumOpenableArea,
			window_part_list: [
				{
					mid_height_air_flow_path: window.midHeightOpenablePart1,
				},
			],
			shading: [
				{
					type: "overhang",
					depth: 1,
					distance: 2,
				},
				{
					type: "sidefinleft",
					depth: 3,
					distance: 4,
				},
				{
					type: "sidefinright",
					depth: 5,
					distance: 6,
				},
				{
					type: "reveal",
					depth: 7,
					distance: 8,
				},
				{
					type: "obstacle",
					transparency: 0.2,
					distance: 9,
					height: 10,
				},
			],
		};
		expect(windowElement).toEqual(expectedWindow);
	});

	it("maps windows with pitch and orientation when no wall or roof is tagged", () => {
		const window: WindowData = {
			id: "test-id-1",
			name: "Window 1",
			pitch: 90,
			orientation: 180,
			height: 1,
			width: 1,
			uValue: 1,
			solarTransmittance: 0.1,
			elevationalHeight: 1,
			numberOpenableParts: "0",
			openingToFrameRatio: 0.3,
			securityRisk: false,
			curtainsOrBlinds: false,
			hasShading: false,
		};

		const windowSuffix = " (window)";

		store.$patch({
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

		const fhsInputData = mapWindowData(resolveState(store.$state));

		const windowElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[
			window.name + windowSuffix
		]! as BuildingElementTransparent;

		expect(windowElement.pitch).toBe(window.pitch);
		expect(windowElement.orientation360).toBe(window.orientation);
		expect(windowElement.type).toBe("BuildingElementTransparent");
		expect(windowElement.height).toBe(window.height);
		expect(windowElement.width).toBe(window.width);
	});

	it("maps windows with pitch 0 and no orientation when no wall or roof is tagged", () => {
		const window: WindowData = {
			id: "test-id-2",
			name: "Window 2",
			pitch: 0,
			height: 1,
			width: 1,
			uValue: 1,
			solarTransmittance: 0.1,
			elevationalHeight: 1,
			numberOpenableParts: "0",
			openingToFrameRatio: 0.3,
			securityRisk: false,
			curtainsOrBlinds: false,
			hasShading: false,
		};

		const windowSuffix = " (window)";

		store.$patch({
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

		const fhsInputData = mapWindowData(resolveState(store.$state));

		const windowElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[
			window.name + windowSuffix
		]! as BuildingElementTransparent;

		expect(windowElement.pitch).toBe(0);
		expect(windowElement.orientation360).toBeUndefined();
		expect(windowElement.type).toBe("BuildingElementTransparent");
	});

	it("maps windows with pitch 180 and no orientation when no wall or roof is tagged", () => {
		const window: WindowData = {
			id: "test-id-3",
			name: "Window 3",
			pitch: 180,
			height: 1,
			width: 1,
			uValue: 1,
			solarTransmittance: 0.1,
			elevationalHeight: 1,
			numberOpenableParts: "0",
			openingToFrameRatio: 0.3,
			securityRisk: false,
			curtainsOrBlinds: false,
			hasShading: false,
		};

		const windowSuffix = " (window)";

		store.$patch({
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

		const fhsInputData = mapWindowData(resolveState(store.$state));

		const windowElement = fhsInputData.Zone[defaultZoneName]!.BuildingElement[
			window.name + windowSuffix
		]! as BuildingElementTransparent;

		expect(windowElement.pitch).toBe(180);
		expect(windowElement.orientation360).toBeUndefined();
		expect(windowElement.type).toBe("BuildingElementTransparent");
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

	it("throws error when wall of heated basement has no associated floor", () => {
		// Arrange
		const wallOfHeatedBasement: EcaasForm<WallOfHeatedBasementData> = {
			...baseForm,
			data: {
				id: "heated-basement-wall-id",
				name: "Wall of heated basement 1",
				netSurfaceArea: 50,
				uValue: 0.3,
				thermalResistance: 0.6,
				arealHeatCapacity: "Medium",
				massDistributionClass: "M",
				associatedBasementFloorId: "non-existent-floor-id",
				perimeter: 30,
			},
		};

		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceWallOfHeatedBasement: {
						...baseForm,
						data: [wallOfHeatedBasement],
					},
				},
				dwellingSpaceFloors: {
					dwellingSpaceFloorOfHeatedBasement: {
						...baseForm,
						data: [],
					},
				},
			},
		});

		// Act & Assert
		expect(() => mapWallData(resolveState(store.$state))).toThrow("Wall of heated basement 'Wall of heated basement 1' references floor ID 'non-existent-floor-id' which does not exist");
	});

	it("throws error when floor of heated basement has no associated wall", () => {
		// Arrange
		const floorOfHeatedBasement: EcaasForm<FloorOfHeatedBasementData> = {
			...baseForm,
			data: {
				id: "heated-basement-floor-id",
				name: "Floor of heated basement 1",
				netSurfaceArea: 45,
				totalArea: 20,
				uValue: 0.25,
				thermalResistance: 4,
				arealHeatCapacity: "Medium",
				massDistributionClass: "I",
				depthOfBasementFloor: 2.5,
				psiOfWallJunction: 0.08,
				thicknessOfWalls: 300,
			},
		};

		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceGroundFloor: { ...baseForm, data: [] },
					dwellingSpaceInternalFloor: { ...baseForm, data: [] },
					dwellingSpaceExposedFloor: { ...baseForm, data: [] },
					dwellingSpaceFloorOfHeatedBasement: {
						...baseForm,
						data: [floorOfHeatedBasement],
					},
				},
				dwellingSpaceWalls: {
					dwellingSpaceWallOfHeatedBasement: {
						...baseForm,
						data: [],
					},
				},
			},
		});

		// Act & Assert
		expect(() => mapFloorData(resolveState(store.$state))).toThrow("No wall of heated basement found associated with floor of heated basement with id heated-basement-floor-id");
	});
});
