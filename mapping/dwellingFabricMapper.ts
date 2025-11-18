import type { BuildingElementGround, SchemaBuildingElement, SchemaZoneInput, SchemaLighting, SchemaThermalBridgingLinearFhs, SchemaThermalBridgingPoint, SchemaWindowPart, SchemaEdgeInsulation } from "~/schema/aliases";
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

	const spaceHeatingSystemNames = [
		state.heatingAndCoolingSystems.heatEmitting.wetDistribution.map(x => x.name),
		state.heatingAndCoolingSystems.heatEmitting.instantElectricHeater.map(x => x.name),
	].flat();

	return {
		HeatingControlType: "SeparateTempControl", // sending this as a default value while we are only sending one zone
		Zone: {
			[defaultZoneName]: {
				...(spaceHeatingSystemNames.length ? { SpaceHeatSystem: spaceHeatingSystemNames } : {}),
				// SpaceCoolSystem: dwellingSpaceZoneParameters.spaceCoolingSystemForThisZone?.map(x => x.name),
				volume: dwellingSpaceZoneParameters.volume,
				livingroom_area: dwellingSpaceZoneParameters.livingRoomArea,
				restofdwelling_area: dwellingSpaceZoneParameters.restOfDwellingArea,
			} as Partial<SchemaZoneInput>,
		},
	} as Pick<FhsInputSchema, "HeatingControlType" | "Zone">;
}

export function mapLightingData(state: ResolvedState): Pick<FhsInputSchema, "Zone"> {
	const { dwellingSpaceLighting: { numberOfBulbs, power, efficacy } } = state.dwellingFabric;

	const lightingData: SchemaLighting = {
		bulbs: {
			count: numberOfBulbs,
			power,
			efficacy,
		},
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
	const { dwellingSpaceGroundFloor, dwellingSpaceInternalFloor, dwellingSpaceExposedFloor } = state.dwellingFabric.dwellingSpaceFloors;
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
				return {
					type: "horizontal" as const,
					width: edgeInsulationWidthInMetres,
					edge_thermal_resistance: data.edgeInsulationThermalResistance,
				};
			case "vertical":
				return {
					type: "vertical" as const,
					width: edgeInsulationWidthInMetres,
					edge_thermal_resistance: data.edgeInsulationThermalResistance,
				};
			default:
				edgeInsulationType satisfies never;
				throw new Error(`Unknown edge insulation type '${edgeInsulationType}' encountered`);
		}
	}

	const groundFloorData: { [key: string]: BuildingElementGround }[] = dwellingSpaceGroundFloor.map(x => {
		const nameWithSuffix = suffixName(x.name, floorSuffix);

		let groundFloor: BuildingElementGround;

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

		if (x.typeOfInternalFloor === AdjacentSpaceType.unheatedSpace) {
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
				u_value: x.uValue,
				colour: x.colour,
				areal_heat_capacity: x.arealHeatCapacity,
				mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
				pitch: x.pitch,
				orientation360: x.orientation,
				is_external_door: false,
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
				),
			} as Partial<SchemaZoneInput>,
		},
	} as Pick<FhsInputSchema, "GroundFloorArea" | "Zone">;
}

export function mapWallData(state: ResolvedState): Pick<FhsInputSchema, "Zone"> {
	const { dwellingSpaceExternalWall, dwellingSpaceInternalWall, dwellingSpacePartyWall, dwellingSpaceWallToUnheatedSpace } = state.dwellingFabric.dwellingSpaceWalls;
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
				u_value: x.uValue,
				areal_heat_capacity: x.arealHeatCapacity,
				mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
				is_external_door: false,
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
				u_value: defaultUValue,
				areal_heat_capacity: x.arealHeatCapacity,
				mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
			},
		};
	}) || [];

	const partyWallData: { [key: string]: SchemaBuildingElement }[] = dwellingSpacePartyWall?.map(x => {
		const nameWithSuffix = suffixName(x.name, wallSuffix);

		return {
			[nameWithSuffix]: {
				type: "BuildingElementAdjacentConditionedSpace",
				pitch: extractPitch(x),
				area: x.surfaceArea,
				u_value: x.uValue,
				areal_heat_capacity: x.arealHeatCapacity,
				mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
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
				u_value: x.uValue,
				areal_heat_capacity: x.arealHeatCapacity,
				mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
				thermal_resistance_unconditioned_space: x.thermalResistanceOfAdjacentUnheatedSpace,
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

		if (x.type === AdjacentSpaceType.unheatedSpace) {
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

		if (x.typeOfInternalDoor === AdjacentSpaceType.unheatedSpace) {
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
		const associatedWallRoof = getResolvedTaggedItem(
			[dwellingSpaceExternalWall, dwellingSpaceRoofs],
			x.associatedItemId,
		)!;
		const nameWithSuffix = suffixName(x.name, doorSuffix);

		const glazedDoor = {
			type: "BuildingElementTransparent",
			pitch: extractPitch(associatedWallRoof),
			orientation360: associatedWallRoof.orientation!,
			height: x.height,
			mid_height: x.midHeight,
			width: x.width,
			base_height: x.elevationalHeight,
			g_value: x.solarTransmittance,
			u_value: x.uValue,
			window_part_list: [
				{ mid_height_air_flow_path: x.midHeightOpenablePart1 },
			],
			frame_area_fraction: calculateFrameToOpeningRatio(x.openingToFrameRatio),
			max_window_open_area: x.maximumOpenableArea,
			security_risk: x.securityRisk,
			free_area_height: x.heightOpenableArea,
			shading: [],
		} as const satisfies SchemaBuildingElement;

		return {
			[nameWithSuffix]: glazedDoor,
		};
	});

	const externalUnglazedDoorData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceExternalUnglazedDoor.map((x) => {
		const associatedWallRoof = getResolvedTaggedItem(
			[dwellingSpaceExternalWall, dwellingSpaceRoofs],
			x.associatedItemId,
		)!;
		const nameWithSuffix = suffixName(x.name, doorSuffix);

		return {
			[nameWithSuffix]: {
				type: "BuildingElementOpaque",
				pitch: extractPitch(associatedWallRoof),
				orientation360: associatedWallRoof.orientation!,
				height: x.height,
				width: x.width,
				base_height: x.elevationalHeight,
				area: x.surfaceArea,
				colour: x.colour,
				u_value: x.uValue,
				areal_heat_capacity: x.arealHeatCapacity,
				mass_distribution_class: fullMassDistributionClass(x.massDistributionClass),
				is_external_door: true,
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

export function mapWindowData(state: ResolvedState): Pick<FhsInputSchema, "Zone"> {
	const { dwellingSpaceWindows } = state.dwellingFabric;
	const { dwellingSpaceExternalWall } = state.dwellingFabric.dwellingSpaceWalls;
	const { dwellingSpaceRoofs } = state.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
	const windowSuffix = "window";

	function mapWindowPartList(data: WindowData): SchemaWindowPart[] {
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
		const associatedElement = getResolvedTaggedItem(
			[dwellingSpaceExternalWall, dwellingSpaceRoofs],
			x.taggedItem,
		)!;

		return {
			[nameWithSuffix]: {
				type: "BuildingElementTransparent",
				pitch: extractPitch(associatedElement),
				orientation360: associatedElement.orientation!,
				height: x.height,
				width: x.width,
				base_height: x.elevationalHeight,
				u_value: x.uValue,
				g_value: x.solarTransmittance,
				mid_height: x.midHeight,
				security_risk: x.securityRisk,
				frame_area_fraction: x.numberOpenableParts === "0" ? 0 : calculateFrameToOpeningRatio(x.openingToFrameRatio),
				max_window_open_area: x.numberOpenableParts === "0" ? 0 : x.maximumOpenableArea,
				free_area_height: x.numberOpenableParts === "0" ? 0 : x.heightOpenableArea,
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
