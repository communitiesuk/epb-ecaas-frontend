import type { components, SchemaExternalConditionsInputFhs, SchemaHeatSourceWetBoiler, SchemaHeatSourceWetHeatBattery, SchemaHeatSourceWetHeatPump, SchemaHeatSourceWetHiu, SchemaInfiltrationVentilationFhs, SchemaMechanicalVentilationFhs, SchemaShadingObject, SchemaShadingSegmentFhs, SchemaSpaceCoolSystemFhs } from "./api-schema.types";
import { BuildingElementGroundHeatedBasementFloor_type, BuildingElementGroundSlabEdgeInsulationFloor_type, BuildingElementGroundSlabNoEdgeInsulationFloor_type, BuildingElementGroundSuspendedFloorFloor_type, BuildingElementGroundUnheatedBasementFloor_type, MechVentType, PhotovoltaicVentilationStrategy, WasteWaterHeatRecoverySystemType, WindowShadingType } from "./api-schema.types";

// Some aliases to names in the API schema generated types, sometimes for more graceful backwards compatibility
// as different names get used in the upstream schemas

export { WasteWaterHeatRecoverySystemType as WwhrsType };
export { MechVentType as VentType };
export { PhotovoltaicVentilationStrategy as OnSiteGenerationVentilationStrategy };
export { WindowShadingType as WindowShadingObjectType };
export type SchemaInfiltrationVentilation = SchemaInfiltrationVentilationFhs;
export type SchemaMechanicalVentilation = SchemaMechanicalVentilationFhs;
export type SchemaSpaceCoolSystemDetails = SchemaSpaceCoolSystemFhs;
export type SchemaShadingSegment = SchemaShadingSegmentFhs;
export type ApplianceKey = keyof components['schemas']['Appliances'];
export const FloorType = {
	...BuildingElementGroundHeatedBasementFloor_type,
	...BuildingElementGroundSlabEdgeInsulationFloor_type,
	...BuildingElementGroundSlabNoEdgeInsulationFloor_type,
	...BuildingElementGroundSuspendedFloorFloor_type,
	...BuildingElementGroundUnheatedBasementFloor_type,
};
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