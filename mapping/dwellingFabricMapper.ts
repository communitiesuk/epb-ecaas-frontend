import { FloorType, HeatingControlType, SpaceHeatControlType, WindowShadingObjectType      } from "~/schema/api-schema.types";
import type {SchemaBuildingElement, SchemaThermalBridgingDetails, SchemaWindowPart, SchemaZoneInput, SchemaZoneLighting} from "~/schema/api-schema.types";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import merge from 'deepmerge';
import { defaultZoneName } from "./common";

export function mapLivingSpaceFabricData(state: ResolvedState): Partial<FhsInputSchema> {
	const zoneParameterData = mapZoneParametersData(state);
	const floorData = mapFloorData(state);
	const wallData = mapWallData(state);
	const ceilingAndRoofData = mapCeilingAndRoofData(state);
	const doorData = mapDoorData(state);
	const windowData = mapWindowData(state);
	const thermalBridgingData = mapThermalBridgingData(state);

	return merge.all([
		zoneParameterData,
		floorData,
		wallData,
		ceilingAndRoofData,
		doorData,
		windowData,
		thermalBridgingData,
	]);
}

const defaultUValue = 0.01;

export function mapZoneParametersData(state: ResolvedState): Pick<FhsInputSchema, 'HeatingControlType' | 'Zone'> {
	const { dwellingSpaceZoneParameters } = state.dwellingFabric;

	const lightingData: SchemaZoneLighting = {
		efficacy: 56.0,
		bulbs: {
			incandescent: {
				count: dwellingSpaceZoneParameters.numberOfIncandescentBulbs,
				power: 60,
				efficacy: 14
			},
			led: {
				count: dwellingSpaceZoneParameters.numberOfLEDBulbs,
				power: 6,
				efficacy: 120
			}
		}
	};

	const spaceHeatingSystemNames = [
		state.heatingSystems.heatEmitting.wetDistribution.map(x => x.name),
		state.heatingSystems.heatEmitting.instantElectricHeater.map(x => x.name),
	].flat();

	return {
		HeatingControlType: HeatingControlType.SeparateTempControl, // sending this as a default value while we are only sending one zone
		Zone: {
			[defaultZoneName]: {
				...(spaceHeatingSystemNames.length ? {SpaceHeatSystem: spaceHeatingSystemNames} : {}),
				// SpaceCoolSystem: dwellingSpaceZoneParameters.spaceCoolingSystemForThisZone?.map(x => x.name),
				SpaceHeatControl: SpaceHeatControlType.livingroom,
				area: dwellingSpaceZoneParameters.area,
				volume: dwellingSpaceZoneParameters.volume,
				Lighting: lightingData,
			} as Partial<SchemaZoneInput>
		}
	} as Pick<FhsInputSchema, 'HeatingControlType' | 'Zone'>;
}

export function mapFloorData(state: ResolvedState): Pick<FhsInputSchema, 'GroundFloorArea' | 'Zone'> {
	const { dwellingSpaceGroundFloor, dwellingSpaceInternalFloor, dwellingSpaceExposedFloor } = state.dwellingFabric.dwellingSpaceFloors;

	function mapEdgeInsulation(data: Extract<GroundFloorData, { typeOfGroundFloor: FloorType.Slab_edge_insulation }>) {
		if (data.edgeInsulationType === 'horizontal') {
			return [{
				type: data.edgeInsulationType!,
				width: data.edgeInsulationWidth!,
				edge_thermal_resistance: data.edgeInsulationThermalResistance!
			}];
		}

		if (data.edgeInsulationType === 'vertical') {
			return [{
				type: data.edgeInsulationType!,
				depth: data.edgeInsulationWidth!,
				edge_thermal_resistance: data.edgeInsulationThermalResistance!
			}];
		}
	}

	const groundFloorData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceGroundFloor.map(x => ({
		[x.name]: {
			type: 'BuildingElementGround',
			area: x.surfaceArea,
			total_area: x.surfaceArea,
			u_value: x.uValue,
			thermal_resistance_floor_construction: x.thermalResistance,
			areal_heat_capacity: x.kappaValue,
			mass_distribution_class: x.massDistributionClass,
			perimeter: x.perimeter,
			psi_wall_floor_junc: x.psiOfWallJunction,
			thickness_walls: x.thicknessOfWalls,
			floor_type: x.typeOfGroundFloor as FloorType,
			...(x.typeOfGroundFloor === FloorType.Slab_edge_insulation ? {edge_insulation: mapEdgeInsulation(x)} : {}),
			...(x.typeOfGroundFloor === FloorType.Suspended_floor ? {height_upper_surface: x.heightOfFloorUpperSurface} : {}),
			pitch: x.pitch,
			...('ventilationOpeningsArea' in x ? {area_per_perimeter_vent: x.ventilationOpeningsArea} : {}),
			...('windShieldingFactor' in x ? {shield_fact_location: x.windShieldingFactor} : {}),
			...('depthOfBasementFloorBelowGround' in x ? {depth_basement_floor: x.depthOfBasementFloorBelowGround} : {}),
			...('heightOfBasementWallsAboveGround' in x ? {height_basement_walls: x.heightOfBasementWallsAboveGround} : {}),
			...('underfloorSpaceThermalResistance' in x ? {thermal_resist_insul: x.underfloorSpaceThermalResistance} : {}),
			...('thermalTransmittanceOfWallsAboveGround' in x ? {thermal_transm_walls: x.thermalTransmittanceOfWallsAboveGround} : {}),
			...('thermalResistanceOfBasementWalls' in x ? {thermal_resist_walls_base: x.thermalResistanceOfBasementWalls} : {}),
			...('thermalTransmittanceOfFloorAboveBasement' in x ? {thermal_transm_envi_base: x.thermalTransmittanceOfFloorAboveBasement} : {}),
		}
	}));

	const internalFloorData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceInternalFloor?.map(x => {
		const commonFields = {
			area: x.surfaceAreaOfElement,
			areal_heat_capacity: x.kappaValue,
			mass_distribution_class: x.massDistributionClass,
			pitch: 180,
			u_value: defaultUValue
		};


		let internalFloor: SchemaBuildingElement;

		if (x.typeOfInternalFloor === AdjacentSpaceType.unheatedSpace) {
			internalFloor = {
				...commonFields,
				type: 'BuildingElementAdjacentUnconditionedSpace_Simple',
				thermal_resistance_unconditioned_space: x.thermalResistanceOfAdjacentUnheatedSpace,
			};
		} else {
			internalFloor = {
				...commonFields,
				type: 'BuildingElementAdjacentConditionedSpace',
			};
		}
		
		return {[x.name]: internalFloor};
	}) || [];

	const exposedFloorData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceExposedFloor.map(x => ({
		[x.name]: {
			type: 'BuildingElementOpaque',
			height: x.length,
			width: x.width,
			base_height: x.elevationalHeight,
			area: x.surfaceArea,
			solar_absorption_coeff: x.solarAbsorption,
			u_value: x.uValue,
			areal_heat_capacity: x.kappaValue,
			mass_distribution_class: x.massDistributionClass,
			pitch: x.pitch,
			orientation360: x.orientation,
			is_external_door: false
		}
	})) || [];

	return {
		GroundFloorArea: dwellingSpaceGroundFloor.reduce((sum, floor) => sum + floor.surfaceArea, 0),
		Zone: {
			[defaultZoneName]: {
				BuildingElement: Object.assign(
					{},
					...groundFloorData,
					...internalFloorData,
					...exposedFloorData
				)
			} as Partial<SchemaZoneInput>
		}
	} as Pick<FhsInputSchema, 'GroundFloorArea' | 'Zone'>;
}

export function mapWallData(state: ResolvedState): Pick<FhsInputSchema, 'Zone'> {
	const { dwellingSpaceExternalWall, dwellingSpaceInternalWall, dwellingSpacePartyWall, dwellingSpaceWallToUnheatedSpace } = state.dwellingFabric.dwellingSpaceWalls;

	const externalWallData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceExternalWall?.map(x => ({
		[x.name]: {
			type: 'BuildingElementOpaque',
			pitch: extractPitch(x)!,
			orientation360: x.orientation,
			height: x.height,
			width: x.length,
			base_height: x.elevationalHeight,
			area: x.surfaceArea,
			solar_absorption_coeff: x.solarAbsorption,
			u_value: x.uValue,
			areal_heat_capacity: x.kappaValue,
			mass_distribution_class: x.massDistributionClass,
			is_external_door: false
		}
	})) || [];

	const internalWallData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceInternalWall?.map(x => ({
		[x.name]: {
			type: 'BuildingElementAdjacentConditionedSpace',
			pitch: extractPitch(x),
			area: x.surfaceAreaOfElement,
			u_value: defaultUValue,
			areal_heat_capacity: x.kappaValue,
			mass_distribution_class: x.massDistributionClass
		}
	})) || [];

	const partyWallData: { [key: string]: SchemaBuildingElement }[] = dwellingSpacePartyWall?.map(x => ({
		[x.name]: {
			type: 'BuildingElementOpaque',
			pitch: extractPitch(x),
			orientation360: x.orientation,
			height: x.height,
			width: x.length,
			base_height: x.elevationalHeight,
			area: x.surfaceArea,
			solar_absorption_coeff: x.solarAbsorption,
			u_value: x.uValue,
			areal_heat_capacity: x.kappaValue,
			mass_distribution_class: x.massDistributionClass,
			is_external_door: false
		}
	})) || [];

	const wallToUnheatedSpaceData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceWallToUnheatedSpace?.map(x => ({
		[x.name]: {
			type: 'BuildingElementAdjacentUnconditionedSpace_Simple',
			pitch: extractPitch(x),
			area: x.surfaceAreaOfElement,
			u_value: x.uValue,
			areal_heat_capacity: x.arealHeatCapacity,
			mass_distribution_class: x.massDistributionClass,
			thermal_resistance_unconditioned_space: x.thermalResistanceOfAdjacentUnheatedSpace
		}
	})) || [];

	return {
		Zone: {
			[defaultZoneName]: {
				BuildingElement: Object.assign(
					{},
					...externalWallData,
					...internalWallData,
					...partyWallData,
					...wallToUnheatedSpaceData
				)
			} as Partial<SchemaZoneInput>
		}
	} as Pick<FhsInputSchema, 'Zone'>;
}

export function mapCeilingAndRoofData(state: ResolvedState): Pick<FhsInputSchema, 'Zone'> {
	const { dwellingSpaceCeilings, dwellingSpaceRoofs, dwellingSpaceUnheatedPitchedRoofs } = state.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

	const ceilingData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceCeilings.map(x => {
		const commonFields = {
			pitch: extractPitch(x),
			area: x.surfaceArea,
			areal_heat_capacity: x.kappaValue,
			mass_distribution_class: x.massDistributionClass,
		};

		let ceiling: SchemaBuildingElement;

		if (x.type === AdjacentSpaceType.unheatedSpace) {
			ceiling = {
				...commonFields,
				type: "BuildingElementAdjacentUnconditionedSpace_Simple",
				thermal_resistance_unconditioned_space: x.thermalResistanceOfAdjacentUnheatedSpace,
				u_value: x.uValue
			};
		} else {
			ceiling = {
				...commonFields,
				type: "BuildingElementAdjacentConditionedSpace",
				u_value: defaultUValue
			};
		};

		return {[x.name]: ceiling};
	});

	const roofData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceRoofs.map(x => ({
		[x.name]: {
			type: 'BuildingElementOpaque',
			pitch: x.pitch,
			orientation360: x.orientation ?? 0,
			height: x.length,
			width: x.width,
			base_height: x.elevationalHeightOfElement,
			area: x.surfaceArea,
			solar_absorption_coeff: x.solarAbsorptionCoefficient,
			u_value: x.uValue,
			areal_heat_capacity: x.kappaValue,
			mass_distribution_class: x.massDistributionClass,
			is_external_door: false,
			is_unheated_pitched_roof: false
		}
	}));

	const unheatedPitchedRoofData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceUnheatedPitchedRoofs.map(x => ({
		[x.name]: {
			type: 'BuildingElementOpaque',
			pitch: x.pitch,
			orientation360: x.orientation!,
			height: x.length,
			width: x.width,
			base_height: x.elevationalHeightOfElement,
			area: x.surfaceArea,
			solar_absorption_coeff: x.solarAbsorptionCoefficient,
			u_value: x.uValue,
			areal_heat_capacity: x.kappaValue,
			mass_distribution_class: x.massDistributionClass,
			is_external_door: false,
			is_unheated_pitched_roof: true
		}
	}));

	return {
		Zone: {
			[defaultZoneName]: {
				BuildingElement: Object.assign(
					{},
					...ceilingData,
					...roofData,
					...unheatedPitchedRoofData
				)
			} as Partial<SchemaZoneInput>
		}
	} as Pick<FhsInputSchema, 'Zone'>;
}

export function mapDoorData(state: ResolvedState): Pick<FhsInputSchema, 'Zone'> {
	const { dwellingSpaceInternalDoor, dwellingSpaceExternalGlazedDoor, dwellingSpaceExternalUnglazedDoor } = state.dwellingFabric.dwellingSpaceDoors;

	const internalDoorData: Record<string, SchemaBuildingElement>[] = dwellingSpaceInternalDoor.map(x => {
		const commonFields = {
			pitch: extractPitch(x),
			area: x.surfaceArea,
			u_value: defaultUValue,
			areal_heat_capacity: x.kappaValue,
			mass_distribution_class: x.massDistributionClass,
		};

		let internalDoor: SchemaBuildingElement;

		if (x.typeOfInternalDoor === AdjacentSpaceType.unheatedSpace) {
			internalDoor = {
				...commonFields,
				type: "BuildingElementAdjacentUnconditionedSpace_Simple",
				thermal_resistance_unconditioned_space: x.thermalResistanceOfAdjacentUnheatedSpace
			};
		} else {
			internalDoor = {
				...commonFields,
				type: "BuildingElementAdjacentConditionedSpace",
			};
		};

		return {[x.name]: internalDoor};
	});

	const externalGlazedDoorData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceExternalGlazedDoor.map(x => {

		function mapWindowPartList(data: ExternalGlazedDoorData): SchemaWindowPart[] {
			if (data.numberOpenableParts === '1') {
				return [
					{ mid_height_air_flow_path: data.midHeightOpenablePart1 }
				];
			}

			if (data.numberOpenableParts === '2') {
				return [
					{ mid_height_air_flow_path: data.midHeightOpenablePart1 },
					{ mid_height_air_flow_path: data.midHeightOpenablePart2 }
				];
			}

			if (data.numberOpenableParts === '3') {
				return [
					{ mid_height_air_flow_path: data.midHeightOpenablePart1 },
					{ mid_height_air_flow_path: data.midHeightOpenablePart2 },
					{ mid_height_air_flow_path: data.midHeightOpenablePart3 }
				];
			}

			if (data.numberOpenableParts === '4') {
				return [
					{ mid_height_air_flow_path: data.midHeightOpenablePart1 },
					{ mid_height_air_flow_path: data.midHeightOpenablePart2 },
					{ mid_height_air_flow_path: data.midHeightOpenablePart3 },
					{ mid_height_air_flow_path: data.midHeightOpenablePart4 }
				];
			}

			return [];
		}

		return {
			[x.name]: {
				type: 'BuildingElementTransparent',
				pitch: extractPitch(x),
				orientation360: x.orientation,
				height: x.height,
				mid_height: x.midHeight,
				width: x.width,
				base_height: x.elevationalHeight,
				area: x.surfaceArea,
				g_value: x.solarTransmittance,
				u_value: x.uValue,
				window_part_list: mapWindowPartList(x),
				frame_area_fraction: x.numberOpenableParts === '0' ? 0 : x.frameToOpeningRatio!,
				max_window_open_area: x.numberOpenableParts === '0' ? 0 : x.maximumOpenableArea,
				free_area_height: x.numberOpenableParts === '0' ? 0 : x.heightOpenableArea,
				shading: []
			}
		};
	});

	const externalUnglazedDoorData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceExternalUnglazedDoor.map(x => ({
		[x.name]: {
			type: 'BuildingElementOpaque',
			pitch: extractPitch(x),
			orientation360: x.orientation,
			height: x.height,
			width: x.width,
			base_height: x.elevationalHeight,
			area: x.surfaceArea,
			solar_absorption_coeff: x.solarAbsorption,
			u_value: x.uValue,
			areal_heat_capacity: x.kappaValue,
			mass_distribution_class: x.massDistributionClass,
			is_external_door: true
		}
	}));

	return {
		Zone: {
			[defaultZoneName]: {
				BuildingElement: Object.assign(
					{},
					...internalDoorData,
					...externalGlazedDoorData,
					...externalUnglazedDoorData
				)
			} as Partial<SchemaZoneInput>
		}
	} as Pick<FhsInputSchema, 'Zone'>;
}

export function mapWindowData(state: ResolvedState): Pick<FhsInputSchema, 'Zone'> {
	const { dwellingSpaceWindows } = state.dwellingFabric;

	function mapWindowPartList(data: WindowData): SchemaWindowPart[] {
		if (data.numberOpenableParts === '1') {
			return [
				{ mid_height_air_flow_path: data.midHeightOpenablePart1! }
			];
		}

		if (data.numberOpenableParts === '2') {
			return [
				{ mid_height_air_flow_path: data.midHeightOpenablePart1! },
				{ mid_height_air_flow_path: data.midHeightOpenablePart2! }
			];
		}

		if (data.numberOpenableParts === '3') {
			return [
				{ mid_height_air_flow_path: data.midHeightOpenablePart1! },
				{ mid_height_air_flow_path: data.midHeightOpenablePart2! },
				{ mid_height_air_flow_path: data.midHeightOpenablePart3! }
			];
		}

		if (data.numberOpenableParts === '4') {
			return [
				{ mid_height_air_flow_path: data.midHeightOpenablePart1! },
				{ mid_height_air_flow_path: data.midHeightOpenablePart2! },
				{ mid_height_air_flow_path: data.midHeightOpenablePart3! },
				{ mid_height_air_flow_path: data.midHeightOpenablePart4! }
			];
		}

		return [];
	}

	const windowData: { [key: string]: SchemaBuildingElement }[] = dwellingSpaceWindows.map(x => ({
		[x.name]: {
			type: 'BuildingElementTransparent',
			pitch: extractPitch(x),
			orientation360: x.orientation,
			height: x.height,
			width: x.width,
			base_height: x.elevationalHeight,
			area: x.surfaceArea,
			u_value: x.uValue,
			g_value: x.solarTransmittance,
			mid_height: x.midHeight,
			frame_area_fraction: x.numberOpenableParts === '0' ? 0 : x.frameToOpeningRatio!,
			max_window_open_area: x.numberOpenableParts === '0' ? 0 : x.maximumOpenableArea,
			free_area_height: x.numberOpenableParts === '0' ? 0 : x.heightOpenableArea,
			window_part_list: mapWindowPartList(x),
			shading: x.numberOpenableParts === '0' ? [] : [
				{
					type: WindowShadingObjectType.overhang,
					depth: 'overhangDepth' in x ? x.overhangDepth! : 0,
					distance: 'overhangDistance' in x ? x.overhangDistance! : 0
				},
				{
					type: WindowShadingObjectType.sidefinleft,
					depth: 'sideFinLeftDepth' in x ? x.sideFinLeftDepth! : 0,
					distance: 'sideFinLeftDistance' in x ? x.sideFinLeftDistance! : 0
				},
				{
					type: WindowShadingObjectType.sidefinright,
					depth: 'sideFinRightDepth' in x ? x.sideFinRightDepth! : 0,
					distance: 'sideFinRightDistance' in x ? x.sideFinRightDistance! : 0
				}
			]
		}
	}));

	return {
		Zone: {
			[defaultZoneName]: {
				BuildingElement: Object.assign({}, ...windowData)
			} as Partial<SchemaZoneInput>
		}
	} as Pick<FhsInputSchema, 'Zone'>;
}

export function mapThermalBridgingData(state: ResolvedState): Pick<FhsInputSchema, 'Zone'> {
	const { dwellingSpaceLinearThermalBridges, dwellingSpacePointThermalBridges } = state.dwellingFabric.dwellingSpaceThermalBridging;

	const linearThermalBridgesData: Record<string, SchemaThermalBridgingDetails>[] = dwellingSpaceLinearThermalBridges.map(x => ({
		[x.name]: {
			type: 'ThermalBridgeLinear',
			junction_type: x.typeOfThermalBridge.toUpperCase(),
			linear_thermal_transmittance: x.linearThermalTransmittance,
			length: x.length
		}
	}));

	const pointThermalBridgesData: Record<string, SchemaThermalBridgingDetails>[] = dwellingSpacePointThermalBridges.map(x => ({
		[x.name]: {
			type: 'ThermalBridgePoint',
			heat_transfer_coeff: x.heatTransferCoefficient
		}
	}));

	return {
		Zone: {
			[defaultZoneName]: {
				ThermalBridging: Object.assign({},
					...linearThermalBridgesData,
					...pointThermalBridgesData
				)
			} as Partial<SchemaZoneInput>
		}
	} as Pick<FhsInputSchema, 'Zone'>;
}