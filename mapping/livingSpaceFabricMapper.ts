import { type FloorType, WindowShadingObjectType, type SchemaBuildingElement, type SchemaHeatingControlType, type SchemaThermalBridgingDetails, type SchemaWindowPart, type SchemaZoneInput, type SpaceHeatControlType } from "~/schema/api-schema.types";
import type { FhsInputSchema } from "./fhsInputMapper";
import merge from 'deepmerge';

export function mapLivingSpaceFabricData(state: EcaasState): Partial<FhsInputSchema> {
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
		thermalBridgingData
	]);
}

function mapZoneParametersData(state: EcaasState): Pick<FhsInputSchema, 'HeatingControlType' | 'Zone'> {
	const { livingSpaceZoneParameters } = state.livingSpaceFabric;

	return {
		HeatingControlType: livingSpaceZoneParameters.data.heatingControlType as SchemaHeatingControlType,
		Zone: {
			"zone 1": {
				SpaceHeatSystem: livingSpaceZoneParameters.data.spaceHeatingSystemForThisZone?.map(x => x.name),
				SpaceCoolSystem: livingSpaceZoneParameters.data.spaceCoolingSystemForThisZone?.map(x => x.name),
				SpaceHeatControl: livingSpaceZoneParameters.data.spaceHeatControlSystemForThisZone?.map(x => x.name)?.[0] as SpaceHeatControlType,
				area: livingSpaceZoneParameters.data.area,
				volume: livingSpaceZoneParameters.data.volume,
			} as Partial<SchemaZoneInput>
		}
	} as Pick<FhsInputSchema, 'HeatingControlType' | 'Zone'>;
}

function mapFloorData(state: EcaasState): Pick<FhsInputSchema, 'Zone'> {
	const { livingSpaceGroundFloor, livingSpaceInternalFloor, livingSpaceExposedFloor } = state.livingSpaceFabric.livingSpaceFloors;

	function mapEdgeInsulation(data: GroundFloorData) {
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

		return undefined;
	}

	const groundFloorData: { [key: string]: SchemaBuildingElement }[] = livingSpaceGroundFloor.data.map(x => ({
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
			edge_insulation: mapEdgeInsulation(x),
			height_upper_surface: x.heightOfFloorUpperSurface,
			thickness_walls: x.thicknessOfWalls || 0,
			area_per_perimeter_vent: x.ventilationOpeningsArea,
			depth_basement_floor: x.depthOfBasementFloorBelowGround,
			height_basement_walls: x.heightOfBasementWallsAboveGround,
			thermal_resist_insul: x.underfloorSpaceThermalResistance,
			thermal_transm_walls: x.thermalTransmittanceOfWallsAboveGround,
			thermal_resist_walls_base: x.thermalResistanceOfBasementWalls,
			thermal_transm_envi_base: x.thermalTransmittanceOfFloorAboveBasement,
		}
	}));

	const internalFloorData: { [key: string]: SchemaBuildingElement }[] = livingSpaceInternalFloor?.data.map(x => ({
		[x.name]: {
			type: x.typeOfInternalFloor === 'heatedSpace' ?  'BuildingElementAdjacentConditionedSpace' : 'BuildingElementAdjacentUnconditionedSpace_Simple',
			area: x.surfaceAreaOfElement,
			areal_heat_capacity: x.kappaValue,
			mass_distribution_class: x.massDistributionClass,
			thermal_resistance_unconditioned_space: x.typeOfInternalFloor === 'heatedSpace' ? 0 : x.thermalResistanceOfAdjacentUnheatedSpace!,
			pitch: x.pitch,
			u_value: x.uValue
		}
	})) || [];

	const exposedFloorData: { [key: string]: SchemaBuildingElement }[] = livingSpaceExposedFloor?.data.map(x => ({
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
			orientation360: x.orientation
		}
	})) || [];

	return {
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
	} as Pick<FhsInputSchema, 'Zone'>;
}

function mapWallData(state: EcaasState): Pick<FhsInputSchema, 'Zone'> {
	const { livingSpaceExternalWall, livingSpaceInternalWall, livingSpacePartyWall, livingSpaceWallToUnheatedSpace } = state.livingSpaceFabric.livingSpaceWalls;

	const externalWallData: { [key: string]: SchemaBuildingElement }[] = livingSpaceExternalWall?.data.map(x => ({
		[x.name]: {
			type: 'BuildingElementOpaque',
			pitch: x.pitch!,
			orientation360: x.orientation,
			height: x.height,
			width: x.length,
			base_height: x.elevationalHeight,
			area: x.surfaceArea,
			solar_absorption_coeff: x.solarAbsorption,
			u_value: x.uValue,
			areal_heat_capacity: x.kappaValue,
			mass_distribution_class: x.massDistributionClass
		}
	})) || [];

	const internalWallData: { [key: string]: SchemaBuildingElement }[] = livingSpaceInternalWall?.data.map(x => ({
		[x.name]: {
			type: 'BuildingElementAdjacentConditionedSpace',
			pitch: x.pitch!,
			area: x.surfaceAreaOfElement,
			u_value: x.uValue,
			areal_heat_capacity: x.kappaValue,
			mass_distribution_class: x.massDistributionClass
		}
	})) || [];

	const partyWallData: { [key: string]: SchemaBuildingElement }[] = livingSpacePartyWall?.data.map(x => ({
		[x.name]: {
			type: 'BuildingElementOpaque',
			pitch: x.pitch!,
			orientation360: x.orientation,
			height: x.height,
			width: x.length,
			base_height: x.elevationalHeight,
			area: x.surfaceArea,
			solar_absorption_coeff: x.solarAbsorption,
			u_value: x.uValue,
			areal_heat_capacity: x.kappaValue,
			mass_distribution_class: x.massDistributionClass
		}
	})) || [];

	const wallToUnheatedSpaceData: { [key: string]: SchemaBuildingElement }[] = livingSpaceWallToUnheatedSpace?.data.map(x => ({
		[x.name]: {
			type: 'BuildingElementAdjacentUnconditionedSpace_Simple',
			pitch: x.pitch!,
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

function mapCeilingAndRoofData(state: EcaasState): Pick<FhsInputSchema, 'Zone'> {
	const { livingSpaceCeilings, livingSpaceRoofs, livingSpaceUnheatedPitchedRoofs } = state.livingSpaceFabric.livingSpaceCeilingsAndRoofs;

	const ceilingData: { [key: string]: SchemaBuildingElement }[] = livingSpaceCeilings.data.map(x => ({
		[x.name]: {
			type: x.type === 'heatedSpace' ?
				'BuildingElementAdjacentConditionedSpace' :
				'BuildingElementAdjacentUnconditionedSpace_Simple',
			pitch: x.pitch,
			area: x.surfaceArea,
			u_value: x.uValue,
			areal_heat_capacity: x.kappaValue,
			mass_distribution_class: x.massDistributionClass,
			thermal_resistance_unconditioned_space: x.type === 'heatedSpace' ? 0 : x.thermalResistanceOfAdjacentUnheatedSpace!
		}
	}));

	const roofData: { [key: string]: SchemaBuildingElement }[] = livingSpaceRoofs.data.map(x => ({
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
		}
	}));

	const unheatedPitchedRoofData: { [key: string]: SchemaBuildingElement }[] = livingSpaceUnheatedPitchedRoofs.data.map(x => ({
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
			mass_distribution_class: x.massDistributionClass
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

function mapDoorData(state: EcaasState): Pick<FhsInputSchema, 'Zone'> {
	const { livingSpaceInternalDoor, livingSpaceExternalGlazedDoor, livingSpaceExternalUnglazedDoor } = state.livingSpaceFabric.livingSpaceDoors;

	const internalDoorData: { [key: string]: SchemaBuildingElement }[] = livingSpaceInternalDoor.data.map(x => ({
		[x.name]: {
			type: x.typeOfCeiling === 'heatedSpace' ?
				'BuildingElementAdjacentConditionedSpace' :
				'BuildingElementAdjacentUnconditionedSpace_Simple',
			pitch: x.pitch!,
			area: x.surfaceArea,
			u_value: x.uValue,
			areal_heat_capacity: x.kappaValue,
			mass_distribution_class: x.massDistributionClass,
			thermal_resistance_unconditioned_space: x.typeOfCeiling === 'heatedSpace' ? 0 : x.thermalResistanceOfAdjacentUnheatedSpace
		}
	}));

	const externalGlazedDoorData: { [key: string]: SchemaBuildingElement }[] = livingSpaceExternalGlazedDoor.data.map(x => {

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
				pitch: x.pitch!,
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

	const externalUnglazedDoorData: { [key: string]: SchemaBuildingElement }[] = livingSpaceExternalUnglazedDoor.data.map(x => ({
		[x.name]: {
			type: 'BuildingElementOpaque',
			pitch: x.pitch!,
			orientation360: x.orientation,
			height: x.height,
			width: x.width,
			base_height: x.elevationalHeight,
			area: x.surfaceArea,
			solar_absorption_coeff: x.solarAbsorption,
			u_value: x.uValue,
			areal_heat_capacity: x.kappaValue,
			mass_distribution_class: x.massDistributionClass
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

function mapWindowData(state: EcaasState): Pick<FhsInputSchema, 'Zone'> {
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

	const windowData: { [key: string]: SchemaBuildingElement }[] = livingSpaceWindows.data.map(x => ({
		[x.name]: {
			type: 'BuildingElementTransparent',
			pitch: x.pitch!,
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

function mapThermalBridgingData(state: EcaasState): Pick<FhsInputSchema, 'Zone'> {
	const { livingSpaceLinearThermalBridges, livingSpacePointThermalBridges } = state.livingSpaceFabric.livingSpaceThermalBridging;

	const linearThermalBridgesData: { [key: string]: SchemaThermalBridgingDetails }[] = livingSpaceLinearThermalBridges.data.map(x => ({
		[x.name]: {
			type: 'ThermalBridgeLinear',
			junction_type: x.typeOfThermalBridge,
			linear_thermal_transmittance: x.linearThermalTransmittance,
			length: x.length
		}
	}));

	const pointThermalBridgesData: { [key: string]: SchemaThermalBridgingDetails }[] = livingSpacePointThermalBridges.data.map(x => ({
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