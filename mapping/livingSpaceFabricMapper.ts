import { FloorType, SpaceHeatControlType, WindowShadingObjectType, type SchemaBuildingElement, type SchemaHeatingControlType, type SchemaThermalBridgingDetails, type SchemaWindowPart, type SchemaZoneInput, type SchemaZoneLighting } from "~/schema/api-schema.types";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import merge from 'deepmerge';

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
	const { livingSpaceZoneParameters } = state.livingSpaceFabric;

	const lightingData: SchemaZoneLighting = {
		efficacy: 56.0,
		bulbs: {
			incandescent: {
				count: livingSpaceZoneParameters.numberOfIncandescentBulbs,
				power: 60,
				efficacy: 14
			},
			led: {
				count: livingSpaceZoneParameters.numberOfLEDBulbs,
				power: 6,
				efficacy: 120
			}
		}
	};

	return {
		HeatingControlType: livingSpaceZoneParameters.heatingControlType as SchemaHeatingControlType,
		Zone: {
			"zone 1": {
				SpaceHeatSystem: livingSpaceZoneParameters.spaceHeatingSystemForThisZone,
				// SpaceCoolSystem: livingSpaceZoneParameters.spaceCoolingSystemForThisZone?.map(x => x.name),
				SpaceHeatControl: SpaceHeatControlType.livingroom,
				area: livingSpaceZoneParameters.area,
				volume: livingSpaceZoneParameters.volume,
				Lighting: lightingData,
			} as Partial<SchemaZoneInput>
		}
	} as Pick<FhsInputSchema, 'HeatingControlType' | 'Zone'>;
}

export function mapFloorData(state: ResolvedState): Pick<FhsInputSchema, 'GroundFloorArea' | 'Zone'> {
	const { livingSpaceGroundFloor, livingSpaceInternalFloor, livingSpaceExposedFloor } = state.livingSpaceFabric.livingSpaceFloors;

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

	const groundFloorData: { [key: string]: SchemaBuildingElement }[] = livingSpaceGroundFloor.map(x => ({
		[x.name]: {
			type: 'BuildingElementGround',
			area: x.surfaceAreaInZone,
			total_area: x.surfaceAreaAllZones,
			u_value: x.uValue,
			thermal_resistance_floor_construction: x.thermalResistanceOfFloorConstruction,
			areal_heat_capacity: x.kappaValue,
			mass_distribution_class: x.massDistributionClass,
			perimeter: x.perimeter,
			psi_wall_floor_junc: x.psiOfWallJunction,
			floor_type: x.typeOfGroundFloor as FloorType,
			pitch: x.pitch,
			...(x.typeOfGroundFloor === FloorType.Slab_edge_insulation ? {edge_insulation: mapEdgeInsulation(x)} : {}),
			...(x.typeOfGroundFloor === FloorType.Suspended_floor ? {height_upper_surface: x.heightOfFloorUpperSurface} : {}),
			thickness_walls: 'thicknessOfWalls' in x ? x.thicknessOfWalls : 0,
			...('ventilationOpeningsArea' in x ? {area_per_perimeter_vent: x.ventilationOpeningsArea} : {}),
			...('depthOfBasementFloorBelowGround' in x ? {depth_basement_floor: x.depthOfBasementFloorBelowGround} : {}),
			...('heightOfBasementWallsAboveGround' in x ? {height_basement_walls: x.heightOfBasementWallsAboveGround} : {}),
			...('underfloorSpaceThermalResistance' in x ? {thermal_resist_insul: x.underfloorSpaceThermalResistance} : {}),
			...('thermalTransmittanceOfWallsAboveGround' in x ? {thermal_transm_walls: x.thermalTransmittanceOfWallsAboveGround} : {}),
			...('thermalResistanceOfBasementWalls' in x ? {thermal_resist_walls_base: x.thermalResistanceOfBasementWalls} : {}),
			...('thermalTransmittanceOfFloorAboveBasement' in x ? {thermal_transm_envi_base: x.thermalTransmittanceOfFloorAboveBasement} : {}),
		}
	}));

	const internalFloorData: { [key: string]: SchemaBuildingElement }[] = livingSpaceInternalFloor?.map(x => {
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

	const exposedFloorData: { [key: string]: SchemaBuildingElement }[] = livingSpaceExposedFloor.map(x => ({
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
		GroundFloorArea: livingSpaceGroundFloor.map(x => x.surfaceAreaAllZones)[0],
		Zone: {
			"zone 1": {
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
	const { livingSpaceExternalWall, livingSpaceInternalWall, livingSpacePartyWall, livingSpaceWallToUnheatedSpace } = state.livingSpaceFabric.livingSpaceWalls;

	const externalWallData: { [key: string]: SchemaBuildingElement }[] = livingSpaceExternalWall?.map(x => ({
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

	const internalWallData: { [key: string]: SchemaBuildingElement }[] = livingSpaceInternalWall?.map(x => ({
		[x.name]: {
			type: 'BuildingElementAdjacentConditionedSpace',
			pitch: extractPitch(x),
			area: x.surfaceAreaOfElement,
			u_value: defaultUValue,
			areal_heat_capacity: x.kappaValue,
			mass_distribution_class: x.massDistributionClass
		}
	})) || [];

	const partyWallData: { [key: string]: SchemaBuildingElement }[] = livingSpacePartyWall?.map(x => ({
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

	const wallToUnheatedSpaceData: { [key: string]: SchemaBuildingElement }[] = livingSpaceWallToUnheatedSpace?.map(x => ({
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
			"zone 1": {
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
	const { livingSpaceCeilings, livingSpaceRoofs, livingSpaceUnheatedPitchedRoofs } = state.livingSpaceFabric.livingSpaceCeilingsAndRoofs;

	const ceilingData: { [key: string]: SchemaBuildingElement }[] = livingSpaceCeilings.map(x => {
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

	const roofData: { [key: string]: SchemaBuildingElement }[] = livingSpaceRoofs.map(x => ({
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

	const unheatedPitchedRoofData: { [key: string]: SchemaBuildingElement }[] = livingSpaceUnheatedPitchedRoofs.map(x => ({
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
			"zone 1": {
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
	const { livingSpaceInternalDoor, livingSpaceExternalGlazedDoor, livingSpaceExternalUnglazedDoor } = state.livingSpaceFabric.livingSpaceDoors;

	const internalDoorData: Record<string, SchemaBuildingElement>[] = livingSpaceInternalDoor.map(x => {
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

	const externalGlazedDoorData: { [key: string]: SchemaBuildingElement }[] = livingSpaceExternalGlazedDoor.map(x => {

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

	const externalUnglazedDoorData: { [key: string]: SchemaBuildingElement }[] = livingSpaceExternalUnglazedDoor.map(x => ({
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
			"zone 1": {
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
	const { livingSpaceWindows } = state.livingSpaceFabric;

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

	const windowData: { [key: string]: SchemaBuildingElement }[] = livingSpaceWindows.map(x => ({
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
			"zone 1": {
				BuildingElement: Object.assign({}, ...windowData)
			} as Partial<SchemaZoneInput>
		}
	} as Pick<FhsInputSchema, 'Zone'>;
}

export function mapThermalBridgingData(state: ResolvedState): Pick<FhsInputSchema, 'Zone'> {
	const { livingSpaceLinearThermalBridges, livingSpacePointThermalBridges } = state.livingSpaceFabric.livingSpaceThermalBridging;

	const linearThermalBridgesData: Record<string, SchemaThermalBridgingDetails>[] = livingSpaceLinearThermalBridges.map(x => ({
		[x.name]: {
			type: 'ThermalBridgeLinear',
			junction_type: x.typeOfThermalBridge.toUpperCase(),
			linear_thermal_transmittance: x.linearThermalTransmittance,
			length: x.length
		}
	}));

	const pointThermalBridgesData: Record<string, SchemaThermalBridgingDetails>[] = livingSpacePointThermalBridges.map(x => ({
		[x.name]: {
			type: 'ThermalBridgePoint',
			heat_transfer_coeff: x.heatTransferCoefficient
		}
	}));

	return {
		Zone: {
			"zone 1": {
				ThermalBridging: Object.assign({},
					...linearThermalBridgesData,
					...pointThermalBridgesData
				)
			} as Partial<SchemaZoneInput>
		}
	} as Pick<FhsInputSchema, 'Zone'>;
}