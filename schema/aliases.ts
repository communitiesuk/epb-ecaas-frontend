import type { Simplify } from "type-fest";
import type { components, SchemaHeatSourceWetBoiler, SchemaHeatSourceWetHeatBattery, SchemaHeatSourceWetHeatPump, SchemaHeatSourceWetHiu, SchemaMassDistributionClass, SchemaBuildingElementGround } from "./api-schema.types";

// Some aliases to names in the API schema generated types, sometimes for more graceful backwards compatibility
// as different names get used in the upstream schemas

type FhsSchema = components["schemas"]["fhs_input.schema"];
type SchemaDefs = FhsSchema["$defs"];
export type SchemaInfiltrationVentilation = FhsSchema["InfiltrationVentilation"];
export type SchemaMechanicalVentilation = Exclude<SchemaInfiltrationVentilation["MechanicalVentilation"], undefined>;
export type WwhrsType = Exclude<FhsSchema["WWHRS"], undefined>[string]["type"];
export type VentType = SchemaMechanicalVentilation[string]["vent_type"];
export type OnSiteGenerationVentilationStrategy = Exclude<FhsSchema["OnSiteGeneration"], undefined>[string]["ventilation_strategy"];
export type SchemaSpaceHeatSystemDetails = Exclude<FhsSchema["SpaceHeatSystem"], undefined>[string];
export type SchemaSpaceCoolSystemDetails = Exclude<FhsSchema["SpaceCoolSystem"], undefined>[string];
export type SchemaZoneInput = FhsSchema["Zone"][string];
export type SchemaHotWaterSourceDetails = Exclude<FhsSchema["HotWaterSource"]["hw cylinder"], undefined>;
export type MassDistributionClass = SchemaMassDistributionClass;
export type CombustionFuelType = SchemaInfiltrationVentilation["CombustionAppliances"][string]["fuel_type"];
export type MVHRLocation = SchemaDefs["MechVentMVHR"]["mvhr_location"];
export type ApplianceKey = keyof components["schemas"]["fhs_input.schema"]["Appliances"];
export type FloorType = SchemaBuildingElementGround["floor_type"];
// work round apparent bug in type generation
export type BuildingElementGround = components["schemas"]["BuildingElementGround"];
export type SchemaBuildingElement = FhsSchema["Zone"][string]["BuildingElement"];
export type SchemaHeatSourceWetDetails = SchemaHeatSourceWetBoiler | SchemaHeatSourceWetHeatBattery | SchemaHeatSourceWetHeatPump | SchemaHeatSourceWetHiu;
// utility function to make shading into valid external conditions
type SchemaExternalConditionsInputFhs = FhsSchema["ExternalConditions"];
export type SchemaShadingSegment = SchemaExternalConditionsInputFhs["shading_segments"][number];

export function externalConditions(shading: SchemaShadingSegment[]): SchemaExternalConditionsInputFhs {
	return {
		shading_segments: shading,
	};
}
export type SchemaCombustionAirSupplySituation = SchemaInfiltrationVentilation["CombustionAppliances"][string]["supply_situation"];
type HotWaterDemand = Simplify<Exclude<Required<FhsSchema["HotWaterDemand"]>, undefined>>;
export type SchemaBathDetails = HotWaterDemand["Bath"][string];
export type SchemaOtherWaterUseDetails = HotWaterDemand["Other"][string];
export type SchemaShower = HotWaterDemand["Shower"][string];
