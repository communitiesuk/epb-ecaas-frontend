import type { TaggedUnion } from "type-fest";
import type { BuildingElementAdjacentConditionedSpaceType, BuildingElementAdjacentUnconditionedSpace_SimpleType, BuildingElementGroundType, BuildingElementOpaqueFHSType, BuildingElementTransparentFHSType, components, SchemaBuildingElementAdjacentConditionedSpace, SchemaBuildingElementAdjacentUnconditionedSpaceSimple, SchemaBuildingElementGroundHeatedBasement, SchemaBuildingElementGroundSlabEdgeInsulation, SchemaBuildingElementGroundSlabNoEdgeInsulation, SchemaBuildingElementGroundSuspendedFloor, SchemaBuildingElementGroundUnheatedBasement, SchemaBuildingElementOpaqueFhs, SchemaBuildingElementTransparentFhs, SchemaEnergySupply, SchemaExternalConditionsInputFhs, SchemaHeatSourceWetBoiler, SchemaHeatSourceWetHeatBattery, SchemaHeatSourceWetHeatPump, SchemaHeatSourceWetHiu, SchemaInfiltrationVentilationFhs, SchemaMechanicalVentilationFhs, SchemaShadingObject, SchemaShadingSegmentFhs, SchemaSpaceCoolSystemFhs, SchemaSpaceHeatSystemElectricStorageHeater, SchemaSpaceHeatSystemInstantElectricHeaterFhs, SchemaSpaceHeatSystemWarmAirFhs, SchemaSpaceHeatSystemWetDistributionFhs, SchemaWaterHeatingEvents, SchemaZoneFhs } from "./api-schema.types";
import { BuildingElementGroundHeatedBasementFloor_type, BuildingElementGroundSlabEdgeInsulationFloor_type, BuildingElementGroundSlabNoEdgeInsulationFloor_type, BuildingElementGroundSuspendedFloorFloor_type, BuildingElementGroundUnheatedBasementFloor_type, MechVentType, PhotovoltaicVentilationStrategy, WasteWaterHeatRecoverySystemType, WindowShadingType } from "./api-schema.types";

// Some aliases to names in the API schema generated types, sometimes for more graceful backwards compatibility
// as different names get used in the upstream schemas

export { WasteWaterHeatRecoverySystemType as WwhrsType };
export { MechVentType as VentType };
export { PhotovoltaicVentilationStrategy as OnSiteGenerationVentilationStrategy };
export { WindowShadingType as WindowShadingObjectType };
export type SchemaInfiltrationVentilation = SchemaInfiltrationVentilationFhs;
export type SchemaMechanicalVentilation = SchemaMechanicalVentilationFhs;
export type SchemaSpaceHeatSystemDetails = SchemaSpaceHeatSystemInstantElectricHeaterFhs | SchemaSpaceHeatSystemElectricStorageHeater | SchemaSpaceHeatSystemWetDistributionFhs | SchemaSpaceHeatSystemWarmAirFhs;
export type SchemaSpaceCoolSystemDetails = SchemaSpaceCoolSystemFhs;
export type SchemaShadingSegment = SchemaShadingSegmentFhs;
export type SchemaZoneInput = SchemaZoneFhs;
export type ApplianceKey = keyof components['schemas']['Appliances'];
export const FloorType = {
	...BuildingElementGroundHeatedBasementFloor_type,
	...BuildingElementGroundSlabEdgeInsulationFloor_type,
	...BuildingElementGroundSlabNoEdgeInsulationFloor_type,
	...BuildingElementGroundSuspendedFloorFloor_type,
	...BuildingElementGroundUnheatedBasementFloor_type,
};
// work round apparent bug in type generation
export type BuildingElementGround = TaggedUnion<'floor_type', {
	[BuildingElementGroundSlabNoEdgeInsulationFloor_type.Slab_no_edge_insulation]: SchemaBuildingElementGroundSlabNoEdgeInsulation,
	[BuildingElementGroundSlabEdgeInsulationFloor_type.Slab_edge_insulation]: SchemaBuildingElementGroundSlabEdgeInsulation,
	[BuildingElementGroundSuspendedFloorFloor_type.Suspended_floor]: SchemaBuildingElementGroundSuspendedFloor,
	[BuildingElementGroundHeatedBasementFloor_type.Heated_basement]: SchemaBuildingElementGroundHeatedBasement,
	[BuildingElementGroundUnheatedBasementFloor_type.Unheated_basement]: SchemaBuildingElementGroundUnheatedBasement,
}>;
export type SchemaBuildingElement = TaggedUnion<'type', {
	[BuildingElementGroundType.BuildingElementGround]: BuildingElementGround,
	[BuildingElementOpaqueFHSType.BuildingElementOpaque]: SchemaBuildingElementOpaqueFhs,
	[BuildingElementAdjacentConditionedSpaceType.BuildingElementAdjacentConditionedSpace]: SchemaBuildingElementAdjacentConditionedSpace,
	[BuildingElementAdjacentUnconditionedSpace_SimpleType.BuildingElementAdjacentUnconditionedSpace_Simple]: SchemaBuildingElementAdjacentUnconditionedSpaceSimple,
	[BuildingElementTransparentFHSType.BuildingElementTransparent]: SchemaBuildingElementTransparentFhs,
}>;
export type SchemaHeatSourceWetDetails = SchemaHeatSourceWetBoiler | SchemaHeatSourceWetHeatBattery | SchemaHeatSourceWetHeatPump | SchemaHeatSourceWetHiu;
// some string-based enums seem to just be replaced by a string upstream, so retaining this from previous versions
export enum ColdWaterSourceType {
	mains_water = "mains water",
	header_tank = "header tank"
}
export enum SpaceCoolSystemType {
	AirConditioning = "AirConditioning"
}
// utility function to make shading segment compatible with new upstream type (as nulls are explicit)
const baseShading: SchemaShadingSegment = {
	end: null,
	end360: null,
	number: null,
	shading: null,
	start: null,
	start360: null
};
export function segment(shading: Partial<SchemaShadingSegment>): SchemaShadingSegment {
	return {
		...baseShading,
		...shading,
	};
}
// utility function to make shading into valid external conditions
const baseExternalConditions: SchemaExternalConditionsInputFhs = {
	air_temperatures: null,
	diffuse_horizontal_radiation: null,
	direct_beam_conversion_needed: null,
	direct_beam_radiation: null,
	latitude: null,
	longitude: null,
	shading_segments: null,
	solar_reflectivity_of_ground: null,
	wind_directions: null,
	wind_speeds: null,
};
export function externalConditions(shading: SchemaShadingSegment[]): SchemaExternalConditionsInputFhs {
	return {
		...baseExternalConditions,
		shading_segments: shading,
	};
}
// utility function to make valid energy supply object from partial
const baseEnergySupply: Omit<SchemaEnergySupply, 'fuel'> = {
	ElectricBattery: null,
	diverter: null,
	factor: null,
	is_export_capable: false,
	priority: null,
	tariff: null,
	threshold_charges: null,
	threshold_prices: null,
};
// LegacyEnergySupply allows all fields on energy supply to be missing aside from fuel
type LegacyEnergySupply = Pick<SchemaEnergySupply, 'fuel'> & Partial<Omit<SchemaEnergySupply, 'fuel'>>;
export function energySupply(supply: LegacyEnergySupply): SchemaEnergySupply {
	return {
		...baseEnergySupply,
		...supply,
	};
}
// value representing default water heating events for sending
export const noEvents: SchemaWaterHeatingEvents = {
	Bath: null,
	Shower: null,
	Other: null
};
