import type { Simplify } from "type-fest";
import type { components, SchemaMassDistributionClass, SchemaBuildingElementGround, SchemaBuildingElementOpaque, SchemaRadiatorWithProductReference, SchemaUfhWithProductReference, SchemaFancoilWithProductReference } from "./api-schema.types";

// Some aliases to names in the API schema generated types, sometimes for more graceful backwards compatibility
// as different names get used in the upstream schemas

type FhsSchema = components["schemas"]["fhs_input.schema"];
type SchemaDefs = FhsSchema["$defs"];
export type SchemaInfiltrationVentilation = FhsSchema["InfiltrationVentilation"];
export type SchemaMechanicalVentilation = NonNullable<SchemaInfiltrationVentilation["MechanicalVentilation"]>[string];
export type VentType = SchemaMechanicalVentilation["vent_type"];
type OnSiteGeneration = NonNullable<FhsSchema["OnSiteGeneration"]>;
export type OnSiteGenerationVentilationStrategy = OnSiteGeneration[string]["ventilation_strategy"];
export type SchemaSpaceHeatSystem = NonNullable<FhsSchema["SpaceHeatSystem"]>;
export type SchemaSpaceHeatSystemDetails = NonNullable<FhsSchema["SpaceHeatSystem"]>[string];
export type SchemaSpaceCoolSystemDetails = NonNullable<FhsSchema["SpaceCoolSystem"]>[string];
export type SchemaZoneInput = FhsSchema["Zone"][string];
export type SchemaHotWaterSourceDetails = NonNullable<FhsSchema["HotWaterSource"]["hw cylinder"]>;
export type MassDistributionClass = SchemaMassDistributionClass;
export type MVHRLocation = SchemaDefs["MechVentMVHR"]["mvhr_location"];
export type FloorType = SchemaBuildingElementGround["floor_type"];
export type SchemaBuildingElement = FhsSchema["Zone"][string]["BuildingElement"][string];
type BuildingElementType = SchemaBuildingElement["type"];
export type BuildingElementOfType<T extends BuildingElementType> = Extract<SchemaBuildingElement, { type: T }>;
export type BuildingElementGroundForSchema = BuildingElementOfType<"BuildingElementGround">;
export type BuildingElementPartyWallForSchema = BuildingElementOfType<"BuildingElementPartyWall">;
export type SchemaHeatSourceWetDetails = SchemaBoilerWithProductReference | SchemaHeatSourceWetHeatBatteryInput | SchemaHeatSourceWetHeatPumpInput | SchemaHeatSourceWetHiuInput;
export type SchemaHeatSourceWetHeatEmitterDetails = SchemaRadiatorWithProductReference | SchemaUfhWithProductReference | SchemaFancoilWithProductReference;
// utility function to make shading into valid external conditions
type SchemaExternalConditionsInputFhs = FhsSchema["ExternalConditions"];
export type SchemaShadingSegment = SchemaExternalConditionsInputFhs["shading_segments"][number];

export function externalConditions(shading: SchemaShadingSegment[]): SchemaExternalConditionsInputFhs {
	return {
		shading_segments: shading,
	};
}
type HotWaterDemand = Simplify<NonNullable<Required<FhsSchema["HotWaterDemand"]>>>;
export type SchemaBathDetails = HotWaterDemand["Bath"][string];
export type SchemaOtherWaterUseDetails = HotWaterDemand["Other"][string];
export type SchemaShower = HotWaterDemand["Shower"][string];
export type SchemaInverterType = OnSiteGeneration[string]["inverter_type"];
export type SchemaBatteryLocation = SchemaDefs["ElectricBattery"]["battery_location"];
type Ductwork = components["schemas"]["MechVentMVHR"]["ductwork"][number];
export type SchemaDuctShape = Ductwork["cross_section_shape"];
export type SchemaDuctType = Ductwork["duct_type"];
export type SchemaWindShieldLocation = components["schemas"]["SuspendedFloor"]["shield_fact_location"];
export type SchemaShadingObject = NonNullable<SchemaExternalConditionsInputFhs["shading_segments"][number]["shading"]>[number];
export type SchemaShadingObjectType = SchemaShadingObject["type"];
export type SchemaBuildType = FhsSchema["General"]["build_type"];
export type SchemaTerrainClass = SchemaInfiltrationVentilation["terrain_class"];
export type SchemaVentilationShieldClass = SchemaInfiltrationVentilation["shield_class"];
type WindowTreatment = NonNullable<components["schemas"]["BuildingElementTransparent"]["treatment"]>[number];
export type SchemaWindowTreatmentControl = WindowTreatment["controls"];
export type SchemaWindowTreatmentType = WindowTreatment["type"];
export type SchemaWaterPipework = NonNullable<SchemaDefs["Tank"]["primary_pipework"]>[number];
export type SchemaWaterPipeworkLocation = NonNullable<SchemaWaterPipework["location"]>;
export type SchemaWaterPipeContentsType = Exclude<NonNullable<SchemaWaterPipework["pipe_contents"]>, "air">;
export type SchemaWindowShadingObject = SchemaDefs["BuildingElementTransparent"]["shading"][number];
export type SchemaMechVentType = VentType;
export type SchemaFuelType = Exclude<FhsSchema["EnergySupply"][string]["fuel"], "gas" | "custom" | "wood" | "gas" | "oil" | "coal">;
export type SchemaPhotovoltaicVentilationStrategy = OnSiteGenerationVentilationStrategy;
type HeatPump = SchemaDefs["HeatSourceWetHeatPump"];
export type SchemaHeatSourceWetHeatPumpWithProductReference = Extract<HeatPump, { product_reference: string }>;
type HeatPumpFull = Exclude<HeatPump, { product_reference: string }>;
export type SchemaHeatPumpBackupControlType = HeatPumpFull["backup_ctrl_type"];
export type SchemaHeatPumpSinkType = HeatPumpFull["sink_type"];
export type SchemaHeatPumpSourceType = HeatPumpFull["source_type"];
export type SchemaHeatSourceWetHeatPumpInput = Extract<NonNullable<FhsSchema["HeatSourceWet"]>[string], { type: "HeatPump" }>;
export type SchemaHeatSourceWetBoilerInput = Extract<NonNullable<FhsSchema["HeatSourceWet"]>[string], { type: "Boiler" }>;
export type SchemaHeatSourceWetHeatBatteryInput = Extract<NonNullable<FhsSchema["HeatSourceWet"]>[string], { type: "HeatBattery" }>;
export type SchemaHeatSourceWetHiuInput = Extract<NonNullable<FhsSchema["HeatSourceWet"]>[string], { type: "HIU" }>;
export type SchemaWindowPart = SchemaDefs["BuildingElementTransparent"]["window_part_list"][number];
export type SchemaLighting = FhsSchema["Zone"][string]["Lighting"];
export type SchemaThermalBridgingLinearFhs = SchemaDefs["ThermalBridgeLinear"];
export type SchemaThermalBridgingPoint = SchemaDefs["ThermalBridgePoint"];
export type SchemaEdgeInsulationHorizontal = Simplify<SchemaDefs["SlabEdgeInsulation"]["edge_insulation"][number]> & { type: "horizontal" };
export type SchemaEdgeInsulationVertical = Simplify<SchemaDefs["SlabEdgeInsulation"]["edge_insulation"][number]> & { type: "vertical" };
export type SchemaMechanicalVentilationDuctwork = SchemaDefs["MechVentMVHR"]["ductwork"][number];
export type SchemaVent = FhsSchema["InfiltrationVentilation"]["Vents"][string];
export type SchemaVentilationLeaks = FhsSchema["InfiltrationVentilation"]["Leaks"];
export type SchemaLeaksTestPressure = SchemaVentilationLeaks["test_pressure"];
export type SchemaArealHeatCapacity = SchemaBuildingElementGround["areal_heat_capacity"];
export type SchemaThermalBridgeJunctionType = SchemaThermalBridgingLinearFhs["junction_type"];
export type SchemaColour = NonNullable<SchemaBuildingElementOpaque["colour"]>;
export type SchemaConvectiveType = SchemaDefs["InstantElecHeater"]["convective_type"];
export type SchemaEdgeInsulation = SchemaDefs["SlabEdgeInsulation"]["edge_insulation"];
export type SchemaLightingBulbs = FhsSchema["Zone"][string]["Lighting"]["bulbs"];
export type SchemaApplianceType = Exclude<keyof FhsSchema["Appliances"], "Kettle" | "Microwave" | "Otherdevices">;
export type SchemaColdWaterSourceType = components["schemas"]["ColdWaterSource"]["ColdWaterSource"];
export type SchemaHeatNetworkType = (NonNullable<FhsSchema["HeatSourceWet"]>[string] & { is_heat_network: true })["heat_network_type"];
export type SchemaRadiatorType = SchemaRadiatorWithProductReference["radiator_type"];
export type SchemaStorageTank = Extract<SchemaHotWaterSourceDetails, { type: "StorageTank" }>;
export type SchemaMechanicalVentilationInstallationType = Extract<SchemaMechanicalVentilation, { vent_type: "Decentralised continuous MEV", product_reference: string }>["installation_type"];
export type SchemaMechanicalVentilationInstallationLocation = Extract<SchemaMechanicalVentilation, { vent_type: "Decentralised continuous MEV", product_reference: string }>["installation_location"];
export type SchemaBoilerLocationType = Extract<components["schemas"]["HeatSourceWetBoiler"], { rated_power: number }>["boiler_location"];
export type SchemaBoilerWithProductReference = Extract<SchemaHeatSourceWetBoilerInput, { product_reference: string, type: "Boiler" }>;

// We currently have an issue with WWHRS having a union of unkown which collapses the entire type to unkown so this is manual for now
type SchemaWWHRSKnownValue = {
	product_reference: string;
	ColdWaterSource: SchemaColdWaterSourceType;
};
export type SchemaWWHRS = Record<string, SchemaWWHRSKnownValue>; 