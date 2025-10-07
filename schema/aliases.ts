import type { Simplify, TaggedUnion } from "type-fest";
import type { components, SchemaBuildingElementAdjacentConditionedSpace, SchemaBuildingElementAdjacentUnconditionedSpaceSimple, SchemaBuildingElementGroundHeatedBasement, SchemaBuildingElementGroundSlabEdgeInsulation, SchemaBuildingElementGroundSlabNoEdgeInsulation, SchemaBuildingElementGroundSuspendedFloor, SchemaBuildingElementGroundUnheatedBasement, SchemaBuildingElementOpaqueFhs, SchemaBuildingElementTransparentFhs, SchemaCombustionFuelType, SchemaExternalConditionsInputFhs, SchemaHeatSourceWetBoiler, SchemaHeatSourceWetHeatBattery, SchemaHeatSourceWetHeatPump, SchemaHeatSourceWetHiu, SchemaHotWaterSourceCombiBoiler, SchemaHotWaterSourceHeatBattery, SchemaHotWaterSourceHui, SchemaHotWaterSourcePointOfUse, SchemaHotWaterSourceSmartHotWaterTankFhs, SchemaInfiltrationVentilationFhs, SchemaMassDistributionClass, SchemaMechanicalVentilationFhs, SchemaMvhrLocation, SchemaOtherWaterUse, SchemaShadingSegmentFhs, SchemaShowerInstantElectric, SchemaShowerMixer, SchemaSpaceCoolSystemFhs, SchemaSpaceHeatSystemElectricStorageHeater, SchemaSpaceHeatSystemInstantElectricHeaterFhs, SchemaSpaceHeatSystemWarmAirFhs, SchemaSpaceHeatSystemWetDistributionFhs, SchemaWaterHeatingEvents, SchemaZoneFhs, SchemaWasteWaterHeatRecoverySystemType, SchemaMechVentType, SchemaPhotovoltaicVentilationStrategy, SchemaWindowShadingType, SchemaBuildingElementGround, SchemaStorageTank   } from "./api-schema.types";

// Some aliases to names in the API schema generated types, sometimes for more graceful backwards compatibility
// as different names get used in the upstream schemas

export type WwhrsType = SchemaWasteWaterHeatRecoverySystemType;
export type VentType = SchemaMechVentType;
export type OnSiteGenerationVentilationStrategy = SchemaPhotovoltaicVentilationStrategy;
export type WindowShadingObjectType = SchemaWindowShadingType;
export type SchemaInfiltrationVentilation = SchemaInfiltrationVentilationFhs;
export type SchemaMechanicalVentilation = SchemaMechanicalVentilationFhs;
export type SchemaSpaceHeatSystemDetails = SchemaSpaceHeatSystemInstantElectricHeaterFhs | SchemaSpaceHeatSystemElectricStorageHeater | SchemaSpaceHeatSystemWetDistributionFhs | SchemaSpaceHeatSystemWarmAirFhs;
export type SchemaSpaceCoolSystemDetails = SchemaSpaceCoolSystemFhs;
export type SchemaShadingSegment = SchemaShadingSegmentFhs;
export type SchemaZoneInput = SchemaZoneFhs;
export type SchemaShower = TaggedUnion<"type", {
	MixerShower: SchemaShowerMixer,
	InstantElecShower: SchemaShowerInstantElectric,
}>;
export type SchemaOtherWaterUseDetails = SchemaOtherWaterUse;
export type SchemaHotWaterSourceDetails = TaggedUnion<"type", {
	StorageTank: SchemaStorageTank,
	CombiBoiler: SchemaHotWaterSourceCombiBoiler,
	HIU: SchemaHotWaterSourceHui,
	PointOfUse: SchemaHotWaterSourcePointOfUse,
	SmartHotWaterTank: SchemaHotWaterSourceSmartHotWaterTankFhs,
	HeatBattery: SchemaHotWaterSourceHeatBattery,
}>;
export type MassDistributionClass = SchemaMassDistributionClass;
export type CombustionFuelType = SchemaCombustionFuelType;
export type MVHRLocation = SchemaMvhrLocation;
export type ApplianceKey = keyof components["schemas"]["fhs_input.schema"]["Appliances"];
export type FloorType = SchemaBuildingElementGround["floor_type"];
// work round apparent bug in type generation
export type BuildingElementGround = TaggedUnion<"floor_type", {
	Slab_no_edge_insulation: SchemaBuildingElementGroundSlabNoEdgeInsulation,
	Slab_edge_insulation: SchemaBuildingElementGroundSlabEdgeInsulation,
	Suspended_floor: SchemaBuildingElementGroundSuspendedFloor,
	Heated_basement: SchemaBuildingElementGroundHeatedBasement,
	Unheated_basement: SchemaBuildingElementGroundUnheatedBasement,
}>;
export type SchemaBuildingElement = TaggedUnion<"type", {
	BuildingElementGround: BuildingElementGround,
	BuildingElementOpaque: SchemaBuildingElementOpaqueFhs,
	BuildingElementAdjacentConditionedSpace: SchemaBuildingElementAdjacentConditionedSpace,
	BuildingElementAdjacentUnconditionedSpace_Simple: SchemaBuildingElementAdjacentUnconditionedSpaceSimple,
	BuildingElementTransparent: SchemaBuildingElementTransparentFhs,
}>;
export type SchemaHeatSourceWetDetails = SchemaHeatSourceWetBoiler | SchemaHeatSourceWetHeatBattery | SchemaHeatSourceWetHeatPump | SchemaHeatSourceWetHiu;
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
// value representing default water heating events for sending
export const noEvents: SchemaWaterHeatingEvents = {
	Bath: null,
	Shower: null,
	Other: null,
};
type InfiltrationVentilation = components["schemas"]["fhs_input.schema"]["InfiltrationVentilation"];
export type SchemaCombustionAirSupplySituation = InfiltrationVentilation["CombustionAppliances"][string]["supply_situation"];
type HotWaterDemand = Simplify<Required<components["schemas"]["fhs_input.schema"]["HotWaterDemand"]>>;
export type SchemaBathDetails = Exclude<HotWaterDemand, undefined>["Bath"][string];