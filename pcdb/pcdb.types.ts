import * as z from "zod";
import { objectKeys } from "ts-extras";
import { heatPumpBackupControlTypeZod, heatPumpSinkTypeZod, heatPumpSourceTypeZod } from "~/stores/zod";

const IntString = z.string().regex(/^\d+$/);

export const technologyGroups = ["heatPump"] as const;
const technologyGroupsZod = z.enum(technologyGroups);

export const manufacturerZod = z.object({
	id: IntString,
	manufacturerReferenceNo: IntString,
	currentName: z.string(),
	secondaryAddressable: z.nullable(z.string()),
	primaryAddressable: z.nullable(z.string()),
	streetName: z.nullable(z.string()),
	localityName: z.nullable(z.string()),
	townName: z.string(),
	administrativeAreaName: z.nullable(z.string()),
	postcode: z.string(),
	country: z.nullable(z.string()),
	phoneNumber: z.string(),
	url: z.string().regex(z.regexes.domain),
	updated: z.string().regex(/(19|20)\d{2}-(0[1-9]|1[1,2])-(0[1-9]|[12][0-9]|3[01])\s([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])/),
});

const BaseProduct = z.object({
	id: z.string(),
	brandName: z.string(),
	modelName: z.string(),
	modelQualifier: z.optional(z.nullable(z.string())),
	firstYearOfManufacture: z.string().optional(),
	finalYearOfManufacture: z.string().optional(),
	technologyGroup: z.optional(technologyGroupsZod),
});

export const heatPumpTestDataZod = z.object({
	designFlowTemp: z.int(),
	testLetter: z.enum(["A", "B", "C", "D", "E", "F"]), // there is a possible 'E' value here, which diverges from SchemaTestLetter
	tempTest: z.int(),
	tempSource: z.number(),
	tempOutlet: z.number(),
	capacity: z.number(),
	cop: z.number(),
	degradationCoeff: z.number(),
});

export const heatPumpProductTypes = z.enum([
	"AirSourceHeatPump",
	"GroundSourceHeatPump",
	"WaterSourceHeatPump",
	"BoosterHeatPump",
	"HotWaterOnlyHeatPump",
	"ExhaustAirMevHeatPump",
	"ExhaustAirMvhrHeatPump",
	"ExhaustAirMixedHeatPump",
	"HybridHeatPump",
]);

export type HeatPumpProductTypes = z.infer<typeof heatPumpProductTypes>;

export const heatPumpProductTypesMap = {
	"AirSourceHeatPump": "airSource",
	"GroundSourceHeatPump": "groundSource",
	"WaterSourceHeatPump": "waterSource",
	"BoosterHeatPump": "booster",
	"HotWaterOnlyHeatPump": "hotWaterOnly",
	"ExhaustAirMevHeatPump": "exhaustAirMev",
	"ExhaustAirMvhrHeatPump": "exhaustAirMvhr",
	"ExhaustAirMixedHeatPump": "exhaustAirMixed",
	"HybridHeatPump": "hybridHeatPump",
} as const satisfies Record<HeatPumpProductTypes, HeatPumpType>;

const spaceHeatingHeatPumpProductTypes = z.enum([
	"AirSourceHeatPump",
	"GroundSourceHeatPump",
	"WaterSourceHeatPump",
	"BoosterHeatPump",
	"ExhaustAirMevHeatPump",
	"ExhaustAirMvhrHeatPump",
	"ExhaustAirMixedHeatPump",
]);

const vesselTypes = z.enum(["Integral", "Separate limiting characteristics", "Separate fixed characteristics"]);
export type VesselType = z.infer<typeof vesselTypes>;

export const heatPumpProductZod = BaseProduct.extend({
	energySupply: z.string(), // need a better type for this
	sourceType: heatPumpSourceTypeZod,
	sinkType: heatPumpSinkTypeZod,
	backupCtrlType: heatPumpBackupControlTypeZod,
	modulatingControl: z.boolean(),
	timeConstantOnoffOperation: z.nullable(z.int()),
	tempReturnFeedMax: z.nullable(z.number()),
	tempLowerOperatingLimit: z.nullable(z.number()),
	minTempDiffFlowReturnForHpToOperate: z.nullable(z.int()),
	varFlowTempCtrlDuringTest: z.boolean(),
	powerHeatingCircPump: z.nullable(z.number()),
	powerSourceCircPump: z.nullable(z.number()),
	powerHeatingWarmAirFan: z.nullable(z.number()),
	powerStandby: z.number(),
	powerCrankcaseHeater: z.nullable(z.number()),
	powerOff: z.nullable(z.number()),
	powerMaxBackup: z.optional(z.number()),
	standardRatingCapacity20C: z.nullable(z.number()),
	standardRatingCapacity35C: z.nullable(z.number()),
	standardRatingCapacity55C: z.nullable(z.number()),
	minimumModulationRate: z.nullable(z.number()),
	minimumModulationRate35: z.nullable(z.number()),
	vesselType: z.optional(vesselTypes),
	tankVolumeDeclared: z.optional(z.number()),
	dailyLossesDeclared: z.optional(z.number()),
	heatExchangerSurfaceAreaDeclared: z.optional(z.number()),
	testData: z.array(heatPumpTestDataZod),
	technologyType: spaceHeatingHeatPumpProductTypes,
	technologyGroup: z.literal("heatPump"),
});

export type HeatPumpProduct = z.infer<typeof heatPumpProductZod>;

export const hybridHeatPumpProductZod = BaseProduct.extend({
	technologyType: z.literal("HybridHeatPump"),
	technologyGroups: z.literal("heatPump"),
	minModulationRate55: z.optional(z.number()),
	minModulationRate35: z.optional(z.number()),
	tempReturnFeedMax: z.optional(z.number()),
	fuel: z.optional(z.string()),
	tempLowerOperatingLimit: z.optional(z.number()),
	powerOff: z.optional(z.number()),
	modulatingControl: z.boolean(),
	backupCtrlType: heatPumpBackupControlTypeZod,
	hasCostRatioControl: z.boolean(),
	varFlowTempCtrlDuringTest: z.boolean(),
	powerStandby: z.optional(z.number()),
	sinkType: heatPumpSinkTypeZod,
	hybridBoilerType: z.enum(["combi", "regular"]),
	boilerProductID: z.string(),
	sourceType: heatPumpSourceTypeZod,
	powerSourceCircPump: z.optional(z.number()),
	powerHeatingCircPump: z.optional(z.number()),
	powerCrankcaseHeater: z.optional(z.number()),
	timeConstantOnoffOperation: z.optional(z.int()),
	minTempDiffFlowReturnForHpToOperate: z.optional(z.int()),
});

export type HybridHeatPumpProduct = z.infer<typeof hybridHeatPumpProductZod>;

export const hotWaterOnlyHeatPumpProductZod = BaseProduct.extend({
	technologyType: z.literal("HotWaterOnlyHeatPump"),
	productID: z.number(),
	fuel: z.string(),
	dataType: z.string(),
	type: z.string(),
	powerMax: z.number(),
	vesselType: z.string(),
	testVesselVolume: z.number(),
	tankVolumeDeclared: z.number(),
	heatExchangerSurfaceAreaDeclared: z.optional(z.number()),
	dailyLossesDeclared: z.number(),
	hwVesselLossDaily: z.number(),
});

export type HotWaterOnlyHeatPumpProduct = z.infer<typeof hotWaterOnlyHeatPumpProductZod>;

export const boilerBase = BaseProduct.extend({
	flueType: z.enum(["open", "room-sealed"]),
	electricityCircPump: z.nullable(z.number()),
	ignition: z.enum(["yes", "no", "unknown"]),
	fanAssistance: z.enum(["fan", "no fan"]),
	condensing: z.enum(["condensing", "Non-condensing"]),
	modulationLoad: z.nullable(z.number()),
	efficiencyFullLoad: z.nullable(z.number()),
	mountingPosition: z.nullable(z.string()),
	electricityPartLoad: z.nullable(z.number()),
	electricityFullLoad: z.nullable(z.number()),
	ratedPower: z.nullable(z.number()),
	electricityStandby: z.nullable(z.number()),
	boilerLocation: z.nullable(z.enum(["internal", "external", "unknown"])),
	efficiencyPartLoad: z.nullable(z.number()),
	erpSpaceEfficiencyClass: z.nullable(z.string()),
	erpSpaceEfficiencyPerc: z.nullable(z.number()),
	powerBottomRange: z.nullable(z.number()),
	burnerControl: z.nullable(z.string()),
});

export const combiBoilerZod = boilerBase.extend({
	technologyType: z.literal("CombiBoiler"),
	volumePrimary: z.nullable(z.number()),
	volumeSecondary: z.nullable(z.number()),
});

export const regularBoilerZod = boilerBase.extend({
	technologyType: z.literal("RegularBoiler"),
	heatLossStandby: z.nullable(z.number()),
});

const _boilerProductSchema = z.discriminatedUnion("technologyType", [
	combiBoilerZod,
	regularBoilerZod,
]);

export type BoilerProduct = z.infer<typeof _boilerProductSchema>;

export const heatBatteryPcmZod = BaseProduct.extend({
	technologyType: z.literal("HeatBatteryPCM"),
	maxTemperature: z.nullable(z.number()),
	electricityCircPump: z.nullable(z.number()),
	phaseTransitionTemperatureLower: z.nullable(z.number()),
	phaseTransitionTemperatureUpper: z.nullable(z.number()),
	ratedChargePower: z.nullable(z.number()),
	maxRatedLosses: z.nullable(z.number()),
	flowRateLPerMin: z.nullable(z.number()),
	heatStorageKJPerKDuringPhaseTransition: z.nullable(z.number()),
	electricityStandby: z.nullable(z.number()),
	inletDiameterMm: z.nullable(z.number()),
	heatStorageKJPerKBelowPhaseTransition: z.nullable(z.number()),
	serviceProvision: z.nullable(z.string()),
	heatStorageKJPerKAbovePhaseTransition: z.nullable(z.number()),
	velocityInHEXTubeAt1LPerMinMPerS: z.nullable(z.number()),
	simultaneousChargingAndDischarging: z.nullable(z.number()),
});

export type HeatBatteryPcmProduct = z.infer<typeof heatBatteryPcmZod>;

export const heatBatteryDryCoreZod = BaseProduct.extend({
	technologyType: z.literal("HeatBatteryDryCore"),
	heatStorageCapacity: z.nullable(z.number()),
	electricityCircPump: z.nullable(z.number()),
	fanPwr: z.nullable(z.number()),
	setpointTempWater: z.nullable(z.number()),
	ratedPowerInstant: z.nullable(z.number()),
	electricityStandby: z.nullable(z.number()),
	pwrIn: z.nullable(z.number()),
});

export type HeatBatteryDryCoreProduct = z.infer<typeof heatBatteryDryCoreZod>;

export const smartHotWaterTankZod = BaseProduct.extend({
	technologyType: z.literal("SmartHotWaterTank"),
	volume: z.nullable(z.number()),
	dailyLosses: z.nullable(z.number()),
	powerPumpKW: z.nullable(z.number()),
	maxFlowRatePumpLPerMin: z.nullable(z.number()),
	heatExchangerSurfaceArea: z.nullable(z.number()),
	heaterPosition: z.nullable(z.number()),
	tempUsable: z.nullable(z.number()),
	heatSource: z.nullable(z.string()),
});

export type SmartHotWaterTankProduct = z.infer<typeof smartHotWaterTankZod>;

export const fancoilZod = BaseProduct.extend({
	technologyType: z.literal("FanCoils"),
	numberOfFanSpeeds: z.nullable(z.number()),
	numberOfTestPointDeltaT: z.nullable(z.number()),
	fracConvective: z.nullable(z.number()),
});

export type FanCoilProduct = z.infer<typeof fancoilZod>;

export const electricStorageHeaterZod = BaseProduct.extend({
	technologyType: z.literal("StorageHeater"),
	backupPower: z.nullable(z.number()),
	storageCapacity: z.nullable(z.number()),
	ratedPower: z.nullable(z.number()),
	airFlowType: z.nullable(z.string()),
	fracConvective: z.nullable(z.number()),
	heatRetention: z.nullable(z.number()),
	fanPwr: z.nullable(z.number()),
	pwrIn: z.nullable(z.number()),
	outputPower: z.nullable(z.number()),
	highHeatRetention: z.nullable(z.number()),
	controlType: z.nullable(z.string()),
});

export type ElectricStorageHeaterProduct = z.infer<typeof electricStorageHeaterZod>;

export const convectorRadiatorInputZod = z.object({
	technologyType: z.literal("ConvectorRadiator"),
	ID: z.number(),
	water_contents: z.number(),
	c: z.number(),
	wetEmitterType: z.string(),
	dataType: z.string(),
	thermal_mass_per_m: z.number(),
	thermal_output_delta_50k: z.number(),
	weight: z.number(),
	frac_convective: z.number(),
	type: z.string(),
	n: z.number(),
	height: z.number(),
});

export const convectorRadiatorZod = convectorRadiatorInputZod;

export type ConvectorRadiatorProduct = z.infer<typeof convectorRadiatorZod>;

export const heatInterfaceUnitZod = BaseProduct.extend({
	technologyType: z.literal("HeatInterfaceUnit"),
	powerCircPump: z.nullable(z.number()),
	maxPowerWater70: z.nullable(z.number()),
	vwart70: z.nullable(z.number()),
	maxPowerWater55: z.nullable(z.number()),
	hiuDailyLoss: z.nullable(z.number()),
	vwart55: z.nullable(z.number()),
	powerAux: z.nullable(z.number()),
});

export type HeatInterfaceUnitProduct = z.infer<typeof heatInterfaceUnitZod>;

export const centralisedMvhrZod = BaseProduct.extend({
	technologyType: z.literal("CentralisedMvhr"),
	summerBypass: z.nullable(z.number()),
	integralOnly: z.nullable(z.number()),
});

export type CentralisedMvhrProduct = z.infer<typeof centralisedMvhrZod>;

export const centralisedContinuousMevZod = BaseProduct.extend({
	technologyType: z.literal("CentralisedMev"),
	integralOnly: z.nullable(z.number()),
});

export type CentralisedContinuousMevProduct = z.infer<typeof centralisedContinuousMevZod>;

export const decentralisedContinuousMevZod = BaseProduct.extend({
	technologyType: z.literal("DecentralisedMev"),
});

export type DecentralisedMevProduct = z.infer<typeof decentralisedContinuousMevZod>;

const _mevProductSchema = z.discriminatedUnion("technologyType", [
	centralisedContinuousMevZod,
	decentralisedContinuousMevZod,
]);

export type MevProduct = z.infer<typeof _mevProductSchema>;

const directElectricHeaterZod = BaseProduct.extend({
	technologyType: z.literal("DirectElectricHeaters"),
	c: z.nullable(z.number()),
	thermalMass: z.nullable(z.number()),
	n: z.nullable(z.number()),
});

export type DirectElectricHeaterProduct = z.infer<typeof directElectricHeaterZod>;

const heatNetworkZod = BaseProduct.extend({
	technologyType: z.literal("HeatNetworks"),
	percentageOfHeat1: z.nullable(z.number()),
	percentageOfHeat2: z.nullable(z.number()),
	percentageOfHeat3: z.nullable(z.number()),
	year: z.nullable(z.number()),
	communityHeatNetworkVersionNumber: z.nullable(z.number()),
	heatSource2: z.nullable(z.string()),
	numberOfSubheatNetworks: z.nullable(z.number()),
	fifthGearHeatNetwork: z.nullable(z.number()),
	heatSource1: z.nullable(z.string()),
	validityEndDate: z.nullable(z.string()),
	communityHeatNetworkName: z.nullable(z.string()),
	postcodeOfThePrimaryEnergyCentre: z.nullable(z.string()),
	descriptionOfNetwork: z.nullable(z.string()),
});

export type HeatNetworkProduct = z.infer<typeof heatNetworkZod>;

const airPoweredShowerZod = BaseProduct.extend({
	technologyType: z.literal("AirPoweredShowers"),
	allowLowFlowrate: z.boolean(),
	inuseFactor: z.optional(z.number()),
	originalFlowrate: z.optional(z.number()),
	flowrate: z.optional(z.number()),
});

export type AirPoweredShowerProduct = z.infer<typeof airPoweredShowerZod>;

const wwhrsZod = BaseProduct.extend({
	technologyType: z.literal("InstantaneousWwhrSystem"),
	pipeLength: z.optional(z.number()),
	heatExchangerWasteConnection: z.optional(z.number()),
	heatExchangerVolumeOfWater: z.optional(z.number()),
	heatExchangerColdWaterConnection: z.optional(z.number()),
	heatExchangerWetWeight: z.optional(z.number()),
	numberOfFlowRates: z.optional(z.number()),
	utilisationFactor: z.optional(z.number()),
	heatExchangerLength: z.optional(z.number()),
	heatExchangerDryWeight: z.optional(z.number()),
});

export type WwhrsProduct = z.infer<typeof wwhrsZod>;

export const productSchema = z.discriminatedUnion("technologyType", [
	heatPumpProductZod,
	hybridHeatPumpProductZod,
	hotWaterOnlyHeatPumpProductZod,
	combiBoilerZod,
	regularBoilerZod,
	heatBatteryPcmZod,
	heatBatteryDryCoreZod,
	smartHotWaterTankZod,
	fancoilZod,
	electricStorageHeaterZod,
	convectorRadiatorZod,
	heatInterfaceUnitZod,
	centralisedMvhrZod,
	centralisedContinuousMevZod,
	decentralisedContinuousMevZod,
	directElectricHeaterZod,
	heatNetworkZod,
	airPoweredShowerZod,
	wwhrsZod,
]);

type ProductSchemaUnion = z.infer<typeof productSchema>;
export type Product = Exclude<ProductSchemaUnion, { technologyType: "ConvectorRadiator" }>;

export const Products = z.array(productSchema);

export type TechnologyType = ProductSchemaUnion["technologyType"];

const categoryTechnologies = {
	heatPump: [
		"AirSourceHeatPump",
		"GroundSourceHeatPump",
		"WaterSourceHeatPump",
		"BoosterHeatPump",
		"HotWaterOnlyHeatPump",
		"ExhaustAirMevHeatPump",
		"ExhaustAirMvhrHeatPump",
		"ExhaustAirMixedHeatPump",
		"HybridHeatPump",
	],
	boiler: [
		"CombiBoiler",
		"RegularBoiler",
	],
	heatBattery: [
		"HeatBatteryPCM",
		"HeatBatteryDryCore",
	],
	heatNetworks: ["HeatNetworks"],
	heatInterfaceUnit: ["HeatInterfaceUnit"],
	waterStorage: ["SmartHotWaterTank"],
	heatEmitting: [
		"FanCoils",
		"ConvectorRadiator",
		"StorageHeater",
		"DirectElectricHeaters",
	],
	mechanicalVentilation: [
		"CentralisedMvhr",
		"CentralisedMev",
		"DecentralisedMev",
	],
	hotWaterOutlets: [
		"AirPoweredShowers",
		"InstantaneousWwhrSystem",
	],
} as const satisfies Record<string, TechnologyType[]>;

export const technologyTypes: string[] = objectKeys(categoryTechnologies).flatMap(x => categoryTechnologies[x]);

export type TechnologyGroup = z.infer<typeof technologyGroupsZod>;

type DisplayProductBase = {
	displayProduct: true;
	id: string;
	technologyType: TechnologyType;
	backupCtrlType?: string;
	powerMaxBackup?: number;
	boilerLocation?: "internal" | "external" | "unknown";
	communityHeatNetworkName?: string;
	boilerProductID?: string;
	vesselType?: VesselType;
};

export type StandardDisplayProduct = DisplayProductBase & Pick<z.infer<typeof BaseProduct>, "brandName" | "modelName" | "modelQualifier"> & {
	technologyType: Exclude<TechnologyType, "ConvectorRadiator">;
	type?: never;
	height?: never;
};

export type ConvectorRadiatorDisplayProduct = Pick<DisplayProductBase, "id"> & {
	technologyType: "ConvectorRadiator";
	type: ConvectorRadiatorProduct["type"];
	height: ConvectorRadiatorProduct["height"];
	brandName?: never;
	modelName?: never;
	modelQualifier?: never;
	backupCtrlType?: never;
	powerMaxBackup?: never;
	boilerLocation?: never;
	communityHeatNetworkName?: never;
	boilerProductID?: never;
	vesselType?: never;
};

export type DisplayProduct = StandardDisplayProduct | ConvectorRadiatorDisplayProduct;

export type DisplayProductWithFlowTemp = DisplayProduct & {
	designFlowTemperature?: number;
};

export interface PaginatedResult<T> {
	data: T[];
	lastEvaluationKey?: string;
}

export function isDisplayProduct(product: object): product is DisplayProduct {
	return product !== undefined &&
		"displayProduct" in product &&
		!!product.displayProduct;
}