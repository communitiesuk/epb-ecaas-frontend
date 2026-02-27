import type { SchemaBuildingElement, SchemaZoneInput, SchemaLighting, SchemaThermalBridgingLinearFhs, SchemaThermalBridgingPoint, SchemaWindowPart, SchemaEdgeInsulation, BuildingElementGroundForSchema } from "~/schema/aliases";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import merge from "deepmerge";
import { defaultZoneName } from "./common";
import type { Length } from "../utils/units/length";
import { asMetres } from "../utils/units/length";

function calculateFrameToOpeningRatio(openingToFrameRatio: number): number {
	// note - use parseFloat and toFixed to avoid JS precision issues
	return parseFloat((1 - openingToFrameRatio).toFixed(10));
}

export function mapLivingSpaceFabricData(
	state: ResolvedState,
): Partial<FhsInputSchema> {
	const zoneParameterData = mapZoneParametersData(state);
	const lightingData = mapLightingData(state);
	const floorData = mapFloorData(state);
	const wallData = mapWallData(state);
	const ceilingAndRoofData = mapCeilingAndRoofData(state);
	const doorData = mapDoorData(state);
	const windowData = mapWindowData(state);
	const thermalBridgingData = mapThermalBridgingData(state);

	return merge.all([
		zoneParameterData,
		lightingData,
		floorData,
		wallData,
		ceilingAndRoofData,
		doorData,
		windowData,
		thermalBridgingData,
	]);
}

const defaultUValue = 0.01;
const suffixName = (name: string, suffix: string) => `${name} (${suffix})`;

export function mapZoneParametersData(
	state: ResolvedState,
): Pick<FhsInputSchema, "HeatingControlType" | "Zone"> {
	const { dwellingSpaceZoneParameters } = state.dwellingFabric;
	const wetDistributionSystems = state.spaceHeating.heatEmitters?.filter(he => {
		return he.typeOfHeatEmitter === "radiator"
			|| he.typeOfHeatEmitter === "underfloorHeating"
			|| he.typeOfHeatEmitter === "fanCoil";
	});
	const instantElectricHeaters = state.spaceHeating.heatEmitters.filter(he => he.typeOfHeatEmitter === "instantElectricHeater");
	const spaceHeatingSystemNames = [
		wetDistributionSystems.map(x => x.name),
		instantElectricHeaters.map(x => x.name),
	].flat();

	return {
		HeatingControlType: "SeparateTempControl", // sending this as a default value while we are only sending one zone
		Zone: {
			[defaultZoneName]: {
				...(spaceHeatingSystemNames.length ? { SpaceHeatSystem: spaceHeatingSystemNames } : {}),
				// SpaceCoolSystem: dwellingSpaceZoneParameters.spaceCoolingSystemForThisZone?.map(x => x.name),
				volume: dwellingSpaceZoneParameters.volume,
				livingroom_area: dwellingSpaceZoneParameters.livingZoneArea,
				restofdwelling_area: dwellingSpaceZoneParameters.restOfDwellingArea,
			} as Partial<SchemaZoneInput>,
		},
	} as Pick<FhsInputSchema, "HeatingControlType" | "Zone">;
}

export function mapLightingData(state: ResolvedState): Pick<FhsInputSchema, "Zone"> {
	const { dwellingSpaceLighting } = state.dwellingFabric;

	const lightingData: SchemaLighting = {
		bulbs: dwellingSpaceLighting.map(({ numberOfBulbs, power, efficacy }) => ({
			count: numberOfBulbs,
			power,
			efficacy,
		})),
	};

	return {
		Zone: {
			[defaultZoneName]: {
				Lighting: lightingData,
			} as Partial<SchemaZoneInput>,
		},
	} as Pick<FhsInputSchema, "HeatingControlType" | "Zone">;
}

export function mapFloorData(state: ResolvedState): Pick<FhsInputSchema, "GroundFloorArea" | "Zone"> {
	const { dwellingSpaceGroundFloor, dwellingSpaceInternalFloor, dwellingSpaceExposedFloor, dwellingSpaceFloorAboveUnheatedBasement, dwellingSpaceFloorOfHeatedBasement } = state.dwellingFabric.dwellingSpaceFloors;
	const floorSuffix = "floor";

	function mapEdgeInsulation(data: Extract<GroundFloorData, { typeOfGroundFloor: "Slab_edge_insulation" }>): SchemaEdgeInsulation {
		let edgeInsulationWidthInMetres: number;

		if (typeof data.edgeInsulationWidth === "number") {
			edgeInsulationWidthInMetres = data.edgeInsulationWidth;
		} else {
			edgeInsulationWidthInMetres = asMetres(data.edgeInsulationWidth);
		}

		const { edgeInsulationType } = data;

		switch (edgeInsulationType) {
			case "horizontal":
				return [{
					type: "horizontal" as const,
					width: edgeInsulationWidthInMetres,
					edge_thermal_resistance: data.edgeInsulationThermalResistance,
				}];
			case "vertical":
				return [{
					type: "vertical" as const,
					depth: edgeInsulationWidthInMetres,
					edge_thermal_resistance: data.edgeInsulationThermalResistance,
				}];
			default:
				edgeInsulationType satisfies never;
				throw new Error(`Unknown edge insulation type '${edgeInsulationType}' encountered`);
		}
	}

	const groundFloorData: { [key: string]: BuildingElementGroundForSchema }[] = dwellingSpaceGroundFloor.map(x => {
		const nameWithSuffix = suffixName(x.name, floorSuffix);

		let groundFloor: BuildingElementGroundForSchema;

		switch (x.typeOfGroundFloor) {
			case "Slab_edge_insulation": {
				groundFloor = {
					type: "BuildingElementGround",
					area: x.surfaceArea,
					total_area: x.surfaceArea,
					u_value: x.uValue,
					thermal_resistance_floor_construction: x.thermalResistance,
					areal_heat_capacity: x.arealHeatCapacity,
					mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
					perimeter: x.perimeter,
					psi_wall_floor_junc: x.psiOfWallJunction,
					thickness_walls: x.thicknessOfWalls / 1000,
					floor_type: x.typeOfGroundFloor,
					edge_insulation: mapEdgeInsulation(x),
				};
				break;
			}
			case "Slab_no_edge_insulation": {
				groundFloor = {
					type: "BuildingElementGround",
					area: x.surfaceArea,
					total_area: x.surfaceArea,
					u_value: x.uValue,
					thermal_resistance_floor_construction: x.thermalResistance,
					areal_heat_capacity: x.arealHeatCapacity,
					mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
					perimeter: x.perimeter,
					psi_wall_floor_junc: x.psiOfWallJunction,
					thickness_walls: x.thicknessOfWalls / 1000,
					floor_type: x.typeOfGroundFloor,
				};
				break;
			}
			case "Suspended_floor": {
				groundFloor = {
					type: "BuildingElementGround",
					area: x.surfaceArea,
					total_area: x.surfaceArea,
					u_value: x.uValue,
					thermal_resistance_floor_construction: x.thermalResistance,
					areal_heat_capacity: x.arealHeatCapacity,
					mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
					perimeter: x.perimeter,
					psi_wall_floor_junc: x.psiOfWallJunction,
					thickness_walls: x.thicknessOfWalls / 1000,
					floor_type: x.typeOfGroundFloor,
					height_upper_surface: x.heightOfFloorUpperSurface / 1000,
					area_per_perimeter_vent: x.ventilationOpeningsArea / 1e6,
					shield_fact_location: x.windShieldingFactor,
					thermal_resist_insul: x.underfloorSpaceThermalResistance,
					thermal_transm_walls: x.thermalTransmittanceOfWallsAboveGround,
				};
				break;
			}
			case "Heated_basement": {
				groundFloor = {
					type: "BuildingElementGround",
					area: x.surfaceArea,
					total_area: x.surfaceArea,
					u_value: x.uValue,
					thermal_resistance_floor_construction: x.thermalResistance,
					areal_heat_capacity: x.arealHeatCapacity,
					mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
					perimeter: x.perimeter,
					psi_wall_floor_junc: x.psiOfWallJunction,
					thickness_walls: x.thicknessOfWalls / 1000,
					floor_type: x.typeOfGroundFloor,
					depth_basement_floor: x.depthOfBasementFloorBelowGround,
					thermal_resist_walls_base: x.thermalResistanceOfBasementWalls,
				};
				break;
			}
			case "Unheated_basement": {
				groundFloor = {
					type: "BuildingElementGround",
					area: x.surfaceArea,
					total_area: x.surfaceArea,
					u_value: x.uValue,
					thermal_resistance_floor_construction: x.thermalResistance,
					areal_heat_capacity: x.arealHeatCapacity,
					mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
					perimeter: x.perimeter,
					psi_wall_floor_junc: x.psiOfWallJunction,
					thickness_walls: x.thicknessOfWalls / 1000,
					floor_type: x.typeOfGroundFloor,
					height_basement_walls: x.heightOfBasementWallsAboveGround,
					thermal_transm_walls: x.thermalTransmittanceOfWallsAboveGround,
					thermal_resist_walls_base: x.thermalResistanceOfBasementWalls,
					thermal_transm_envi_base: x.thermalTransmittanceOfFloorAboveBasement,
					depth_basement_floor: x.depthOfBasementFloorBelowGround,
				};
				break;
			}
			default:
				throw new Error(`Unexpected ground floor type: ${(x as { typeOfGroundFloor: string }).typeOfGroundFloor}`);
		}

		return { [nameWithSuffix]: groundFloor };
	});

	const internalFloorData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceInternalFloor?.map(x => {
		const commonFields = {
			area: x.surfaceAreaOfElement,
			areal_heat_capacity: x.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
			pitch: 180,
			u_value: defaultUValue,
		};
		const nameWithSuffix = suffixName(x.name, floorSuffix);

		let internalFloor: SchemaBuildingElement;

		if (x.typeOfInternalFloor === "unheatedSpace") {
			internalFloor = {
				...commonFields,
				type: "BuildingElementAdjacentUnconditionedSpace_Simple",
				thermal_resistance_unconditioned_space: x.thermalResistanceOfAdjacentUnheatedSpace,
			};
		} else {
			internalFloor = {
				...commonFields,
				type: "BuildingElementAdjacentConditionedSpace",
			};
		}

		return { [nameWithSuffix]: internalFloor };
	}) || [];

	const exposedFloorData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceExposedFloor.map(x => {
		const nameWithSuffix = suffixName(x.name, floorSuffix);

		return {
			[nameWithSuffix]: {
				type: "BuildingElementOpaque",
				height: x.length,
				width: x.width,
				base_height: x.elevationalHeight,
				area: x.surfaceArea,
				thermal_resistance_construction: x.thermalResistance,
				colour: x.colour,
				areal_heat_capacity: x.arealHeatCapacity,
				mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
				pitch: x.pitch,
				is_external_door: false,
				is_unheated_pitched_roof: false, // this may need to be limited to opaque elements with pitch <= 60
			},
		};
	}) || [];

	const floorAboveUnheatedBasementData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceFloorAboveUnheatedBasement?.map(x => {
		const nameWithSuffix = suffixName(x.name, floorSuffix);
		return {
			[nameWithSuffix]: {
				type: "BuildingElementGround",
				thermal_resistance_construction: x.thermalResistance,
				u_value: x.uValue,
				total_area: x.surfaceArea,
				floor_type: "Unheated_basement",
				thickness_walls: x.thicknessOfWalls / 1000,
				perimeter: x.perimeter,
				psi_wall_floor_junc: x.psiOfWallJunction,
				thermal_resistance_floor_construction: x.thermalResistance,
				areal_heat_capacity: x.arealHeatCapacity,
				mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
				area: x.surfaceArea,
				depth_basement_floor: x.depthOfBasementFloor,
				thermal_resist_walls_base: x.thermalResistanceOfBasementWalls,
				thermal_transm_envi_base: x.thermalTransmittanceOfFoundations,
				thermal_transm_walls: x.thermalTransmittanceOfBasementWalls,
				height_basement_walls: x.heightOfBasementWalls,
			},
		};
	}) || [];

	const floorOfHeatedBasementData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceFloorOfHeatedBasement?.map(x => {
		if (!x.id) {
			throw new Error(`Floor of heated basement '${x.name}' must have an ID`);
		}
		const nameWithSuffix = suffixName(x.name, floorSuffix);
		const wallOfHeatedBasement = state.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallOfHeatedBasement?.find(wall => wall.associatedBasementFloorId === x.id);
		if (!wallOfHeatedBasement) {
			throw new Error(`No wall of heated basement found associated with floor of heated basement with id ${x.id}`);
		}
		return {
			[nameWithSuffix]: {
				type: "BuildingElementGround",
				area: x.surfaceArea,
				total_area: x.surfaceArea,
				u_value: x.uValue,
				thermal_resistance_floor_construction: x.thermalResistance,
				areal_heat_capacity: x.arealHeatCapacity,
				mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
				depth_basement_floor: x.depthOfBasementFloor,
				perimeter: x.perimeter,
				psi_wall_floor_junc: x.psiOfWallJunction,
				thickness_walls: x.thicknessOfWalls / 1000,
				floor_type: "Heated_basement",
				thermal_resistance_construction: x.thermalResistance,
				thermal_resist_walls_base: wallOfHeatedBasement?.thermalResistance,
			},
		};
	}) || [];

	return {
		GroundFloorArea: dwellingSpaceGroundFloor.reduce((sum, floor) => sum + floor.surfaceArea, 0),
		Zone: {
			[defaultZoneName]: {
				BuildingElement: Object.assign(
					{},
					...groundFloorData,
					...internalFloorData,
					...exposedFloorData,
					...floorAboveUnheatedBasementData,
					...floorOfHeatedBasementData,
				),
			} as Partial<SchemaZoneInput>,
		},
	} as Pick<FhsInputSchema, "GroundFloorArea" | "Zone">;
}

export function mapWallData(state: ResolvedState): Pick<FhsInputSchema, "Zone"> {
	const { dwellingSpaceExternalWall, dwellingSpaceInternalWall, dwellingSpacePartyWall, dwellingSpaceWallToUnheatedSpace, dwellingSpaceWallOfHeatedBasement } = state.dwellingFabric.dwellingSpaceWalls;
	const wallSuffix = "wall";

	const externalWallData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceExternalWall?.map(x => {
		const nameWithSuffix = suffixName(x.name, wallSuffix);

		return {
			[nameWithSuffix]: {
				type: "BuildingElementOpaque",
				pitch: extractPitch(x),
				orientation360: x.orientation,
				height: x.height,
				width: x.length,
				base_height: x.elevationalHeight,
				area: x.surfaceArea,
				colour: x.colour,
				thermal_resistance_construction: x.thermalResistance,
				areal_heat_capacity: x.arealHeatCapacity,
				mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
				is_external_door: false,
				is_unheated_pitched_roof: false, // this may need to be limited to opaque elements with a pitch <= 60
			},
		};
	}) || [];

	const internalWallData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceInternalWall?.map(x => {
		const nameWithSuffix = suffixName(x.name, wallSuffix);

		return {
			[nameWithSuffix]: {
				type: "BuildingElementAdjacentConditionedSpace",
				pitch: extractPitch(x),
				area: x.surfaceAreaOfElement,
				thermal_resistance_construction: x.thermalResistance,
				areal_heat_capacity: x.arealHeatCapacity,
				mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
			},
		};
	}) || [];

	const partyWallData = dwellingSpacePartyWall?.map(x => {
		const nameWithSuffix = suffixName(x.name, wallSuffix);

		return {
			[nameWithSuffix]: {
				type: "BuildingElementPartyWall",
				pitch: extractPitch(x),
				area: x.surfaceArea,
				u_value: x.uValue,
				thermal_resistance_cavity: x.thermalResistanceCavity,
				areal_heat_capacity: x.arealHeatCapacity,
				mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
				party_wall_cavity_type: x.partyWallCavityType,
				...(["unfilled_unsealed", "unfilled_sealed", "filled_unsealed"].includes(x.partyWallCavityType) && { party_wall_lining_type: x.partyWallLiningType }),
				...(x.partyWallCavityType === "defined_resistance" && { thermal_resistance_cavity: x.thermalResistanceCavity }),
			},
		};
	}) || [];

	const wallToUnheatedSpaceData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceWallToUnheatedSpace?.map(x => {
		const nameWithSuffix = suffixName(x.name, wallSuffix);

		return {
			[nameWithSuffix]: {
				type: "BuildingElementAdjacentUnconditionedSpace_Simple",
				pitch: extractPitch(x),
				area: x.surfaceAreaOfElement,
				thermal_resistance_construction: x.thermalResistance,
				areal_heat_capacity: x.arealHeatCapacity,
				mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
				thermal_resistance_unconditioned_space: x.thermalResistanceOfAdjacentUnheatedSpace,
			},
		};
	}) || [];

	const wallOfHeatedBasementData: { [key: string]: BuildingElementGroundForSchema }[] = dwellingSpaceWallOfHeatedBasement?.map(wall => {
		const nameWithSuffix = suffixName(wall.name, wallSuffix);
		const floorOfHeatedBasement = state.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorOfHeatedBasement?.find(floor => floor.id === wall.associatedBasementFloorId);
		if (!floorOfHeatedBasement) {
			throw new Error(`Wall of heated basement '${wall.name}' references floor ID '${wall.associatedBasementFloorId}' which does not exist`);
		};
		return {
			[nameWithSuffix]: {
				type: "BuildingElementGround",
				floor_type: "Heated_basement",
				area: wall.netSurfaceArea,
				total_area: wall.netSurfaceArea,
				u_value: wall.uValue,
				thermal_resistance_construction: wall.thermalResistance,
				areal_heat_capacity: wall.arealHeatCapacity,
				mass_distribution_class: fullMassDistributionClass(wall.massDistributionClass),
				thermal_resist_walls_base: wall.thermalResistance,
				thermal_resistance_floor_construction: wall.thermalResistance,
				depth_basement_floor: floorOfHeatedBasement.depthOfBasementFloor,
				perimeter: wall.perimeter,
				psi_wall_floor_junc: floorOfHeatedBasement.psiOfWallJunction,
				thickness_walls: floorOfHeatedBasement.thicknessOfWalls / 1000,
			},
		};
	}) || [];

	return {
		Zone: {
			[defaultZoneName]: {
				BuildingElement: Object.assign(
					{},
					...externalWallData,
					...internalWallData,
					...partyWallData,
					...wallToUnheatedSpaceData,
					...wallOfHeatedBasementData,
				),
			} as Partial<SchemaZoneInput>,
		},
	} as Pick<FhsInputSchema, "Zone">;
}

export function mapCeilingAndRoofData(state: ResolvedState): Pick<FhsInputSchema, "Zone"> {
	const { dwellingSpaceCeilings, dwellingSpaceRoofs } = state.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
	const ceilingSuffix = "ceiling";
	const roofSuffix = "roof";

	const ceilingData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceCeilings.map((x) => {
		const commonFields = {
			pitch: extractPitch(x),
			area: x.surfaceArea,
			areal_heat_capacity: x.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
		};
		const nameWithSuffix = suffixName(x.name, ceilingSuffix);

		let ceiling: SchemaBuildingElement;

		if (x.type === "unheatedSpace") {
			ceiling = {
				...commonFields,
				type: "BuildingElementAdjacentUnconditionedSpace_Simple",
				thermal_resistance_unconditioned_space: x.thermalResistanceOfAdjacentUnheatedSpace,
				u_value: x.uValue,
			};
		} else {
			ceiling = {
				...commonFields,
				type: "BuildingElementAdjacentConditionedSpace",
				u_value: defaultUValue,
			};
		};

		return { [nameWithSuffix]: ceiling };
	});

	const roofData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceRoofs.map((x) => {
		const nameWithSuffix = suffixName(x.name, roofSuffix);

		return {
			[nameWithSuffix]: {
				type: "BuildingElementOpaque",
				pitch: x.pitch,
				orientation360: x.orientation ?? 0,
				height: x.length,
				width: x.width,
				base_height: x.elevationalHeightOfElement,
				area: x.surfaceArea,
				u_value: x.uValue,
				colour: x.colour,
				areal_heat_capacity: x.arealHeatCapacity,
				mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
				is_external_door: false,
				is_unheated_pitched_roof: x.typeOfRoof === "pitchedInsulatedAtCeiling",
			},
		};
	});

	return {
		Zone: {
			[defaultZoneName]: {
				BuildingElement: Object.assign(
					{},
					...ceilingData,
					...roofData,
				),
			} as Partial<SchemaZoneInput>,
		},
	} as Pick<FhsInputSchema, "Zone">;
}

export function mapDoorData(state: ResolvedState): Pick<FhsInputSchema, "Zone"> {
	const { dwellingSpaceInternalDoor, dwellingSpaceExternalGlazedDoor, dwellingSpaceExternalUnglazedDoor } = state.dwellingFabric.dwellingSpaceDoors;
	const doorSuffix = "door";
	const { dwellingSpaceInternalWall, dwellingSpaceExternalWall } =
		state.dwellingFabric.dwellingSpaceWalls;
	const { dwellingSpaceCeilings, dwellingSpaceRoofs } =
		state.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

	const internalDoorData: Record<string, SchemaBuildingElement>[] = dwellingSpaceInternalDoor.map((x) => {
		const associatedHeatedSpaceElement = getResolvedTaggedItem(
			[dwellingSpaceInternalWall, dwellingSpaceCeilings],
			x.associatedItemId,
		)!;
		const commonFields = {
			pitch: extractPitch(associatedHeatedSpaceElement),
			area: x.surfaceArea,
			areal_heat_capacity: x.arealHeatCapacity,
			mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
		};
		const nameWithSuffix = suffixName(x.name, doorSuffix);

		let internalDoor: SchemaBuildingElement;

		if (x.typeOfInternalDoor === "unheatedSpace") {
			internalDoor = {
				...commonFields,
				type: "BuildingElementAdjacentUnconditionedSpace_Simple",
				u_value: x.uValue,
				thermal_resistance_unconditioned_space: x.thermalResistanceOfAdjacentUnheatedSpace,
			};
		} else {
			internalDoor = {
				...commonFields,
				type: "BuildingElementAdjacentConditionedSpace",
				u_value: defaultUValue, // TODO: double check this is correct behaviour
			};
		};

		return { [nameWithSuffix]: internalDoor };
	});

	const externalGlazedDoorData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceExternalGlazedDoor.map((x) => {
		const associatedWallRoof = x.associatedItemId && x.associatedItemId !== "none" ? getResolvedTaggedItem(
			[dwellingSpaceExternalWall, dwellingSpaceRoofs],
			x.associatedItemId,
		)! : undefined;
		const nameWithSuffix = suffixName(x.name, doorSuffix);

		const glazedDoor = {
			type: "BuildingElementTransparent",
			pitch: extractPitch(associatedWallRoof ?? x),
			orientation360: (associatedWallRoof ?? x).orientation!,
			height: x.height,
			mid_height: x.midHeight,
			width: x.width,
			base_height: x.elevationalHeight,
			g_value: x.solarTransmittance,
			window_part_list: [
				{ mid_height_air_flow_path: x.midHeight },
				...mapWindowPartList(x),
			],
			frame_area_fraction: calculateFrameToOpeningRatio(x.openingToFrameRatio),
			max_window_open_area: x.maximumOpenableArea,
			security_risk: x.securityRisk,
			free_area_height: x.heightOpenableArea,
			shading: [],
			thermal_resistance_construction: x.thermalResistance,
			treatment: x.curtainsOrBlinds ? [{
				type: x.treatmentType,
				controls: "manual",
				trans_red: x.solarTransmittanceReduction,
				delta_r: x.thermalResistivityIncrease,
			}] : undefined,
		} as const satisfies SchemaBuildingElement;

		return {
			[nameWithSuffix]: glazedDoor,
		};
	});

	const externalUnglazedDoorData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceExternalUnglazedDoor.map((x) => {
		const associatedWallRoof = x.associatedItemId && x.associatedItemId !== "none" ? getResolvedTaggedItem(
			[dwellingSpaceExternalWall, dwellingSpaceRoofs],
			x.associatedItemId,
		)! : undefined;
		const nameWithSuffix = suffixName(x.name, doorSuffix);

		return {
			[nameWithSuffix]: {
				type: "BuildingElementOpaque",
				pitch: extractPitch(associatedWallRoof ?? x),
				orientation360: (associatedWallRoof ?? x).orientation!,
				height: x.height,
				width: x.width,
				base_height: x.elevationalHeight,
				colour: x.colour,
				areal_heat_capacity: x.arealHeatCapacity,
				mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
				is_external_door: true,
				is_unheated_pitched_roof: false, // this may need to be limited to opaque elements with a pitch <= 60
				area: x.height * x.width, // this may be removed from the FHS schema shortly (though you could have e.g. arch shaped doors with a different area?)
				thermal_resistance_construction: x.thermalResistance,
			},
		};
	});

	return {
		Zone: {
			[defaultZoneName]: {
				BuildingElement: Object.assign(
					{},
					...internalDoorData,
					...externalGlazedDoorData,
					...externalUnglazedDoorData,
				),
			} as Partial<SchemaZoneInput>,
		},
	} as Pick<FhsInputSchema, "Zone">;
}

function mapWindowPartList(data: WindowData | ExternalGlazedDoorData): SchemaWindowPart[] {
	if (data.numberOpenableParts === "1") {
		return [
			{ mid_height_air_flow_path: data.midHeightOpenablePart1 },
		];
	}

	if (data.numberOpenableParts === "2") {
		return [
			{ mid_height_air_flow_path: data.midHeightOpenablePart1 },
			{ mid_height_air_flow_path: data.midHeightOpenablePart2 },
		];
	}

	if (data.numberOpenableParts === "3") {
		return [
			{ mid_height_air_flow_path: data.midHeightOpenablePart1 },
			{ mid_height_air_flow_path: data.midHeightOpenablePart2 },
			{ mid_height_air_flow_path: data.midHeightOpenablePart3 },
		];
	}

	if (data.numberOpenableParts === "4") {
		return [
			{ mid_height_air_flow_path: data.midHeightOpenablePart1 },
			{ mid_height_air_flow_path: data.midHeightOpenablePart2 },
			{ mid_height_air_flow_path: data.midHeightOpenablePart3 },
			{ mid_height_air_flow_path: data.midHeightOpenablePart4 },
		];
	}

	return [];
}

export function mapWindowData(state: ResolvedState): Pick<FhsInputSchema, "Zone"> {
	const { dwellingSpaceWindows } = state.dwellingFabric;
	const { dwellingSpaceExternalWall } = state.dwellingFabric.dwellingSpaceWalls;
	const { dwellingSpaceRoofs } = state.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
	const windowSuffix = "window";


	const windowData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceWindows.map(x => {
		const nameWithSuffix = suffixName(x.name, windowSuffix);

		function inMetres(length: Length | number): number {
			if (typeof length === "number") {
				return length;
			} else {
				return asMetres(length);
			}
		}

		const hasOverhang = "overhangDepth" in x && "overhangDistance" in x && x.overhangDepth && x.overhangDistance;
		const overhang = hasOverhang ? [{
			type: "overhang" as const,
			depth: inMetres(x.overhangDepth),
			distance: inMetres(x.overhangDistance),
		}] : [];

		const hasSideFinLeft = "sideFinLeftDepth" in x && "sideFinLeftDistance" in x && x.sideFinLeftDepth && x.sideFinLeftDistance;
		const sideFinLeft = hasSideFinLeft ? [{
			type: "sidefinleft" as const,
			depth: inMetres(x.sideFinLeftDepth),
			distance: inMetres(x.sideFinLeftDistance),
		}] : [];

		const hasSideFinRight = "sideFinRightDepth" in x && "sideFinRightDistance" in x && x.sideFinRightDepth && x.sideFinRightDistance;
		const sideFinRight = hasSideFinRight ? [{
			type: "sidefinright" as const,
			depth: inMetres(x.sideFinRightDepth),
			distance: inMetres(x.sideFinRightDistance),
		}] : [];


		let pitch: number;
		let orientation: number;

		if (!x.taggedItem) {
			pitch = extractPitch(x);
			orientation = x.orientation!;
		} else {
			const associatedElement = getResolvedTaggedItem(
				[dwellingSpaceExternalWall, dwellingSpaceRoofs],
				x.taggedItem,
			)!;
			pitch = extractPitch(associatedElement);
			orientation = associatedElement.orientation!;
		}

		return {
			[nameWithSuffix]: {
				type: "BuildingElementTransparent",
				pitch,
				orientation360: orientation,
				height: x.height,
				width: x.width,
				base_height: x.elevationalHeight,
				thermal_resistance_construction: x.thermalResistance,
				g_value: x.solarTransmittance,
				mid_height: x.midHeight,
				security_risk: x.securityRisk,
				frame_area_fraction: x.numberOpenableParts === "0" ? 0 : calculateFrameToOpeningRatio(x.openingToFrameRatio),
				max_window_open_area: x.numberOpenableParts === "0" ? 0 : x.maximumOpenableArea,
				window_part_list: mapWindowPartList(x),
				shading: [...overhang, ...sideFinLeft, ...sideFinRight],
			},
		};
	});

	return {
		Zone: {
			[defaultZoneName]: {
				BuildingElement: Object.assign({}, ...windowData),
			} as Partial<SchemaZoneInput>,
		},
	} as Pick<FhsInputSchema, "Zone">;
}

export function mapThermalBridgingData(
	state: ResolvedState,
): Pick<FhsInputSchema, "Zone"> {
	const {
		dwellingSpaceLinearThermalBridges,
		dwellingSpacePointThermalBridges,
	} = state.dwellingFabric.dwellingSpaceThermalBridging;
	const bridgeSuffix = "bridge";

	const linearThermalBridgesData: Record<
		string,
		SchemaThermalBridgingLinearFhs
	>[] = dwellingSpaceLinearThermalBridges.map((x) => {
		const nameWithSuffix = suffixName(x.name, bridgeSuffix);

		return {
			[nameWithSuffix]: {
				type: "ThermalBridgeLinear",
				junction_type: x.typeOfThermalBridge,
				linear_thermal_transmittance: x.linearThermalTransmittance,
				length: x.length,
			},
		};
	});

	const pointThermalBridgesData: Record<string, SchemaThermalBridgingPoint>[] = dwellingSpacePointThermalBridges.map(x => {
		const nameWithSuffix = suffixName(x.name, bridgeSuffix);

		return {
			[nameWithSuffix]: {
				type: "ThermalBridgePoint",
				heat_transfer_coeff: x.heatTransferCoefficient,
			},
		};
	});

	return {
		Zone: {
			[defaultZoneName]: {
				ThermalBridging: Object.assign({},
					...linearThermalBridgesData,
					...pointThermalBridgesData,
				),
			} as Partial<SchemaZoneInput>,
		},
	} as Pick<FhsInputSchema, "Zone">;
}
