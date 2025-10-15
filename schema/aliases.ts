import type { Simplify } from "type-fest";
import type { components, SchemaHeatSourceWetBoiler, SchemaHeatSourceWetHeatBattery, SchemaHeatSourceWetHeatPump, SchemaHeatSourceWetHiu, SchemaMassDistributionClass, SchemaBuildingElementGround, SchemaBuildingElementOpaque } from "./api-schema.types";

// Some aliases to names in the API schema generated types, sometimes for more graceful backwards compatibility
// as different names get used in the upstream schemas

type FhsSchema = components["schemas"]["fhs_input.schema"];
type SchemaDefs = FhsSchema["$defs"];
export type SchemaInfiltrationVentilation = FhsSchema["InfiltrationVentilation"];
export type SchemaMechanicalVentilation = Exclude<SchemaInfiltrationVentilation["MechanicalVentilation"], undefined>[string];
export type WwhrsType = Exclude<FhsSchema["WWHRS"], undefined>[string]["type"];
export type VentType = SchemaMechanicalVentilation["vent_type"];
type OnSiteGeneration = Exclude<FhsSchema["OnSiteGeneration"], undefined>;
export type OnSiteGenerationVentilationStrategy = OnSiteGeneration[string]["ventilation_strategy"];
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
export type SchemaBuildingElement = FhsSchema["Zone"][string]["BuildingElement"][string];
type BuildingElementType = SchemaBuildingElement["type"];
export type BuildingElementOfType<T extends BuildingElementType> = Extract<SchemaBuildingElement, { type: T }>;
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
export type SchemaInverterType = OnSiteGeneration[string]["inverter_type"];
export type SchemaBatteryLocation = SchemaDefs["ElectricBattery"]["battery_location"];
export type SchemaFlueGasExhaustSituation = SchemaInfiltrationVentilation["CombustionAppliances"][string]["exhaust_situation"];
type Ductwork = components["schemas"]["MechVentMVHR"]["ductwork"][number];
export type SchemaDuctShape = Ductwork["cross_section_shape"];
export type SchemaDuctType = Ductwork["duct_type"];
export type SchemaWindShieldLocation = components["schemas"]["SuspendedFloor"]["shield_fact_location"];
export type SchemaShadingObject = Exclude<SchemaExternalConditionsInputFhs["shading_segments"][number]["shading"], undefined>[number];
export type SchemaShadingObjectType = SchemaShadingObject["type"];
export type SchemaBuildType = FhsSchema["General"]["build_type"];
export type SchemaTerrainClass = SchemaInfiltrationVentilation["terrain_class"];
export type SchemaVentilationShieldClass = SchemaInfiltrationVentilation["shield_class"];
type WindowTreatment = Exclude<components["schemas"]["BuildingElementTransparent"]["treatment"], undefined>[number];
export type SchemaWindowTreatmentControl = WindowTreatment["controls"];
export type SchemaWindowTreatmentType = WindowTreatment["type"];
type Pipework = components["schemas"]["WetDistribution"]["pipework"][number];
export type SchemaWaterPipeworkLocation = Exclude<Pipework["location"], undefined>;
export type SchemaWaterPipeContentsType = Exclude<Pipework["pipe_contents"], undefined>;
export type SchemaWindowShadingObject = SchemaDefs["BuildingElementTransparent"]["shading"][number];
export type SchemaCombustionApplianceType = Exclude<SchemaInfiltrationVentilation["CombustionAppliances"][string]["appliance_type"], undefined>;
export type SchemaMechVentType = VentType;
export type SchemaFuelType = FhsSchema["EnergySupply"][string]["fuel"];
export type SchemaPhotovoltaicVentilationStrategy = OnSiteGenerationVentilationStrategy;
type HeatPump = SchemaDefs["HeatSourceWetHeatPump"];
export type SchemaHeatPumpBackupControlType = HeatPump["backup_ctrl_type"];
export type SchemaHeatPumpSinkType = HeatPump["sink_type"];
export type SchemaHeatPumpSourceType = HeatPump["source_type"];
export type SchemaWindowPart = SchemaDefs["BuildingElementTransparent"]["window_part_list"][number];
export type SchemaLighting = FhsSchema["Zone"][string]["Lighting"];
export type SchemaThermalBridgingLinearFhs = SchemaDefs["ThermalBridgeLinear"]; 
export type SchemaThermalBridgingPoint = SchemaDefs["ThermalBridgePoint"];
export type SchemaEdgeInsulationHorizontal = Simplify<SchemaDefs["SlabEdgeInsulation"]["edge_insulation"] & { type: "horizontal" }>;
export type SchemaCombustionAppliance = SchemaInfiltrationVentilation["CombustionAppliances"][string];
export type SchemaMechanicalVentilationDuctwork = SchemaDefs["MechVentMVHR"]["ductwork"][number];
export type SchemaVent = FhsSchema["InfiltrationVentilation"]["Vents"][string];
export type SchemaVentilationLeaks = FhsSchema["InfiltrationVentilation"]["Leaks"];
export type SchemaLeaksTestPressure = SchemaVentilationLeaks["test_pressure"];
export type SchemaArealHeatCapacity = BuildingElementGround["areal_heat_capacity"];
export type SchemaThermalBridgeJunctionType = SchemaThermalBridgingLinearFhs["junction_type"];
export type SchemaColour = SchemaBuildingElementOpaque["colour"];