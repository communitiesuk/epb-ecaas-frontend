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
export type FloorType = SchemaBuildingElementGround["floor_type"];
export type SchemaBuildingElement = FhsSchema["Zone"][string]["BuildingElement"][string];
type BuildingElementType = SchemaBuildingElement["type"];
export type BuildingElementOfType<T extends BuildingElementType> = Extract<SchemaBuildingElement, { type: T }>;
export type BuildingElementGround = BuildingElementOfType<"BuildingElementGround">;
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
export type SchemaWaterPipework = Exclude<SchemaDefs["HotWaterTankCommon"]["primary_pipework"], undefined>[number];
export type SchemaWaterPipeworkLocation = Exclude<SchemaWaterPipework["location"], undefined>;
export type SchemaWaterPipeContentsType = Exclude<SchemaWaterPipework["pipe_contents"], undefined | "air">;
export type SchemaWindowShadingObject = SchemaDefs["BuildingElementTransparent"]["shading"][number];
export type SchemaCombustionApplianceType = Exclude<SchemaInfiltrationVentilation["CombustionAppliances"][string]["appliance_type"], undefined>;
export type SchemaMechVentType = VentType;
export type SchemaFuelType = Exclude<FhsSchema["EnergySupply"][string]["fuel"], "gas" | "custom" | "wood" | "gas" | "oil" | "coal" | "electricity" >;
export type SchemaFuelTypeExtended = SchemaFuelType | "elecOnly";
export type SchemaPhotovoltaicVentilationStrategy = OnSiteGenerationVentilationStrategy;
type HeatPump = SchemaDefs["HeatSourceWetHeatPump"];
export type SchemaHeatSourceWetHeatPumpWithProductReference = Extract<HeatPump, { product_reference: string }>;
type HeatPumpFull = Exclude<HeatPump, { product_reference: string }>;
export type SchemaHeatPumpBackupControlType = HeatPumpFull["backup_ctrl_type"];
export type SchemaHeatPumpSinkType = HeatPumpFull["sink_type"];
export type SchemaHeatPumpSourceType = HeatPumpFull["source_type"];
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
export type SchemaSimulationTime = {
	start: number;
	end: number;
	step: number;
};
export type SchemaConvectiveType = SchemaDefs["InstantElecHeater"]["convective_type"];
export type SchemaEdgeInsulation = SchemaDefs["SlabEdgeInsulation"]["edge_insulation"];
export type SchemaLightingBulbs = FhsSchema["Zone"][string]["Lighting"]["bulbs"];
export type SchemaApplianceType = Exclude<keyof FhsSchema["Appliances"], "Kettle" | "Microwave" | "Otherdevices">;