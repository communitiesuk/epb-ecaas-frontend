// definitions for Zod constraints relating to string unions as we aren't using TypeScript enums

import type { UnionToTuple } from "type-fest";
import * as z from "zod";
import type { CombustionFuelType, SchemaWindShieldLocation, SchemaDuctType, SchemaDuctShape, SchemaBatteryLocation, SchemaCombustionAirSupplySituation, SchemaFlueGasExhaustSituation, SchemaInverterType, MVHRLocation, SchemaPhotovoltaicVentilationStrategy, SchemaWaterPipeworkLocation, SchemaWaterPipeContentsType, SchemaWindowTreatmentType, SchemaWindowTreatmentControl, SchemaShadingObjectType, SchemaVentilationShieldClass, SchemaTerrainClass, SchemaHeatPumpBackupControlType, SchemaHeatPumpSinkType, SchemaHeatPumpSourceType, SchemaLeaksTestPressure, SchemaArealHeatCapacity, SchemaThermalBridgeJunctionType, SchemaColour, SchemaConvectiveType, SchemaApplianceType, SchemaFuelTypeExtended } from "~/schema/aliases";
import type { ConciseMassDistributionClass } from "./ecaasStore.schema";

type NoneEmptyArray = readonly unknown[] & { 0: unknown };
type CompareUnionWithArray<P, Q extends NoneEmptyArray> = Exclude<P, Q[number]> extends never
	? (Exclude<Q[number], P> extends never ? Q : ReadonlyArray<P>)
	: readonly [...Q, Exclude<P, Q[number]>];
/** a passthrough function that does a type-level check that the passed array contains all members of the references union type */
function ensureAllUnion<P, Q extends NoneEmptyArray>(values: CompareUnionWithArray<P, Q>) {
	return values;
}

/** make a zod definition, making sure we've previously ensured we have all members of the type we're interested in */
function zodForTypeOptions<T extends readonly string[]>(options: T) {
	return z.enum(options);
}

export function zodLiteralFromUnionType<T, U extends UnionToTuple<T>[number] & string>(field: U): z.ZodLiteral<U> {
	return z.literal(field);
}

// The following is necessary because we are not generating enums from the API schema, but string unions instead
// We need to be able to validate at runtime that a value is a member of such a union, which means declaring real values
// containing the members. The following both declares these values and also typechecks that no values are missing or incorrect.

const arealHeatCapacities = ["Very light", "Light", "Medium", "Heavy", "Very heavy"] as const satisfies SchemaArealHeatCapacity[];
const batteryLocations = ["inside", "outside"] as const satisfies SchemaBatteryLocation[];
const colours = ["Light", "Intermediate", "Dark"] as const satisfies SchemaColour[];
const combustionAirSupplySituations = ["outside", "room_air"] as const satisfies SchemaCombustionAirSupplySituation[];
const combustionFuelTypes = ["wood", "gas", "oil", "coal"] as const satisfies CombustionFuelType[];
const convectiveTypes = ["Air heating (convectors, fan coils etc.)",
	"Free heating surface (radiators, radiant panels etc.)",
	"Floor heating, low temperature radiant tube heaters, luminous heaters, wood stoves",
	"Wall heating, radiant ceiling panels, accumulation stoves",
	"Ceiling heating, radiant ceiling electric heating"] as const satisfies SchemaConvectiveType[];
const ductShapes = ["circular", "rectangular"] as const satisfies SchemaDuctShape[];
const ductTypes = ["intake", "supply", "extract", "exhaust"] as const satisfies SchemaDuctType[];
const flueGasExhaustSituations = [
	"into_room",
	"into_separate_duct",
	"into_mech_vent",
] as const satisfies SchemaFlueGasExhaustSituation[];
const fuelTypes = [
	"lpg_bulk",
	"mains_gas",
	"elecOnly",
] as const satisfies SchemaFuelTypeExtended[];
const heatPumpBackupControlTypes = ["None", "Substitute", "TopUp"] as const satisfies SchemaHeatPumpBackupControlType[];
const heatPumpSinkTypes = ["Air", "Water"] as const satisfies SchemaHeatPumpSinkType[];
const heatPumpSourceTypes = [
	"ExhaustAirMEV",
	"ExhaustAirMVHR",
	"ExhaustAirMixed",
	"Ground",
	"OutsideAir",
	"WaterGround",
	"WaterSurface"] as const satisfies SchemaHeatPumpSourceType[];
const inverterTypes = ["optimised_inverter", "string_inverter"] as const satisfies SchemaInverterType[];
const massDistributionClasses = ["D", "E", "I", "IE", "M"] as const satisfies ConciseMassDistributionClass[];
const mhvrLocations = ["inside", "outside"] as const satisfies MVHRLocation[];
const photovoltaicVentilationStrategies = [
	"unventilated",
	"moderately_ventilated",
	"strongly_or_forced_ventilated",
	"rear_surface_free",
] as const satisfies SchemaPhotovoltaicVentilationStrategy[];
const shadingObjectTypes = ["obstacle", "overhang"] as const satisfies SchemaShadingObjectType[];
const terrainClasses = ["OpenWater", "OpenField", "Suburban", "Urban"] as const satisfies SchemaTerrainClass[];
const testPressures = ["Standard", "Pulse test only"] as const satisfies SchemaLeaksTestPressure[];
const thermalBridgeJunctionTypes = ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "E10", "E11", "E12", "E13", "E14", "E15", "E16", "E17", "E18", "E19", "E20", "E21", "E22", "E23", "E24", "E25", "P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9", "R10", "R11"] as const satisfies SchemaThermalBridgeJunctionType[];
const ventilationShieldClasses = ["Open", "Normal", "Shielded"] as const satisfies SchemaVentilationShieldClass[];
const waterPipeContentsTypes = ["water", "glycol25"] as const satisfies SchemaWaterPipeContentsType[];
const waterPipeworkLocations = ["internal", "external"] as const satisfies SchemaWaterPipeworkLocation[];
const windowTreatmentControls = ["auto_motorised", "manual"] as const satisfies SchemaWindowTreatmentControl[];
const windowTreatmentTypes = ["blinds", "curtains"] as const satisfies SchemaWindowTreatmentType[];
const windShieldLocations = ["Sheltered", "Average", "Exposed"] as const satisfies SchemaWindShieldLocation[];
const applianceTypes = ["Oven", "Hobs", "Fridge-Freezer", "Dishwasher", "Clothes_washing", "Clothes_drying", "Fridge", "Freezer"] as const satisfies SchemaApplianceType[];

export const arealHeatCapacityZod = zodForTypeOptions(ensureAllUnion<SchemaArealHeatCapacity, (typeof arealHeatCapacities)>(arealHeatCapacities));
export const batteryLocationZod = zodForTypeOptions(ensureAllUnion<SchemaBatteryLocation, (typeof batteryLocations)>(batteryLocations));
export const colourZod = zodForTypeOptions(ensureAllUnion<SchemaColour, (typeof colours)>(colours));
export const combustionAirSupplySituationZod = zodForTypeOptions(ensureAllUnion<SchemaCombustionAirSupplySituation, (typeof combustionAirSupplySituations)>(combustionAirSupplySituations));
export const combustionFuelTypeZod = zodForTypeOptions(ensureAllUnion<CombustionFuelType, (typeof combustionFuelTypes)>(combustionFuelTypes));
export const convectiveTypeZod = zodForTypeOptions(ensureAllUnion<SchemaConvectiveType, (typeof convectiveTypes)>(convectiveTypes));
export const ductShapeZod = zodForTypeOptions(ensureAllUnion<SchemaDuctShape, (typeof ductShapes)>(ductShapes));
export const ductTypeZod = zodForTypeOptions(ensureAllUnion<SchemaDuctType, (typeof ductTypes)>(ductTypes));
export const flueGasExhaustSituationZod = zodForTypeOptions(ensureAllUnion<SchemaFlueGasExhaustSituation, (typeof flueGasExhaustSituations)>(flueGasExhaustSituations));;
export const fuelTypeZod = zodForTypeOptions(ensureAllUnion<SchemaFuelTypeExtended, (typeof fuelTypes)>(fuelTypes));
export const heatPumpBackupControlTypeZod = zodForTypeOptions(ensureAllUnion<SchemaHeatPumpBackupControlType, (typeof heatPumpBackupControlTypes)>(heatPumpBackupControlTypes));
export const heatPumpSinkTypeZod = zodForTypeOptions(ensureAllUnion<SchemaHeatPumpSinkType, (typeof heatPumpSinkTypes)>(heatPumpSinkTypes));
export const heatPumpSourceTypeZod = zodForTypeOptions(ensureAllUnion<SchemaHeatPumpSourceType, (typeof heatPumpSourceTypes)>(heatPumpSourceTypes));
export const inverterTypeZod = zodForTypeOptions(ensureAllUnion<SchemaInverterType, (typeof inverterTypes)>(inverterTypes));
export const massDistributionClassZod = zodForTypeOptions(ensureAllUnion<ConciseMassDistributionClass, (typeof massDistributionClasses)>(massDistributionClasses));
export const mvhrLocationZod = zodForTypeOptions(ensureAllUnion<MVHRLocation, (typeof mhvrLocations)>(mhvrLocations));
export const photovoltaicVentilationStrategyZod = zodForTypeOptions(ensureAllUnion<SchemaPhotovoltaicVentilationStrategy, (typeof photovoltaicVentilationStrategies)>(photovoltaicVentilationStrategies));
export const shadingObjectTypeZod = zodForTypeOptions(ensureAllUnion<SchemaShadingObjectType, (typeof shadingObjectTypes)>(shadingObjectTypes));
export const terrainClassZod = zodForTypeOptions(ensureAllUnion<SchemaTerrainClass, (typeof terrainClasses)>(terrainClasses));
export const testPressureZod = zodForTypeOptions(ensureAllUnion<SchemaLeaksTestPressure, (typeof testPressures)>(testPressures));
export const thermalBridgeJunctionTypeZod = zodForTypeOptions(ensureAllUnion<SchemaThermalBridgeJunctionType, (typeof thermalBridgeJunctionTypes)>(thermalBridgeJunctionTypes));
export const ventilationShieldClassZod = zodForTypeOptions(ensureAllUnion<SchemaVentilationShieldClass, (typeof ventilationShieldClasses)>(ventilationShieldClasses));
export const waterPipeContentsTypeZod = zodForTypeOptions(ensureAllUnion<SchemaWaterPipeContentsType, (typeof waterPipeContentsTypes)>(waterPipeContentsTypes));
export const waterPipeworkLocationZod = zodForTypeOptions(ensureAllUnion<SchemaWaterPipeworkLocation, (typeof waterPipeworkLocations)>(waterPipeworkLocations));
export const windowTreatmentControlZod = zodForTypeOptions(ensureAllUnion<SchemaWindowTreatmentControl, (typeof windowTreatmentControls)>(windowTreatmentControls));
export const windowTreatmentTypeZod = zodForTypeOptions(ensureAllUnion<SchemaWindowTreatmentType, (typeof windowTreatmentTypes)>(windowTreatmentTypes));
export const windShieldLocationZod = zodForTypeOptions(ensureAllUnion<SchemaWindShieldLocation, (typeof windShieldLocations)>(windShieldLocations));
export const applianceTypeZod = zodForTypeOptions(ensureAllUnion<SchemaApplianceType, (typeof applianceTypes)>(applianceTypes));