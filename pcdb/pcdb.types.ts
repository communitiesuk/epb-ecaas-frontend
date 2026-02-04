import * as z from "zod";
import { objectKeys } from "ts-extras";
import { heatPumpBackupControlTypeZod, heatPumpSinkTypeZod, heatPumpSourceTypeZod } from "~/stores/zod";

const IntString = z.string().regex(/^\d+$/);

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

const heatPumpBase = BaseProduct.extend({
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
	powerMaxBackup: z.nullable(z.number()),
	standardRatingCapacity20C: z.nullable(z.number()),
	standardRatingCapacity35C: z.nullable(z.number()),
	standardRatingCapacity55C: z.nullable(z.number()),
	minimumModulationRate: z.nullable(z.number()),
	minimumModulationRate35: z.nullable(z.number()),
	testData: z.array(heatPumpTestDataZod),
});

export type HeatPumpProduct = z.infer<typeof heatPumpBase>;

export const airSourceHeatPumpZod = heatPumpBase.extend({
	technologyType: z.literal("AirSourceHeatPump"),
});

export const groundSourceHeatPumpZod = heatPumpBase.extend({
	technologyType: z.literal("GroundSourceHeatPump"),
});

export const waterSourceHeatPumpZod = heatPumpBase.extend({
	technologyType: z.literal("WaterSourceHeatPump"),
});

export const boosterHeatPumpZod = heatPumpBase.extend({
	technologyType: z.literal("BoosterHeatPump"),
});

export const hotWaterOnlyPumpZod = heatPumpBase.extend({
	technologyType: z.literal("HotWaterOnlyHeatPump"),
});

export const exhaustAirMevPumpZod = heatPumpBase.extend({
	technologyType: z.literal("ExhaustAirMevHeatPump"),
});

export const exhaustAirMvhrHeatPumpZod = heatPumpBase.extend({
	technologyType: z.literal("ExhaustAirMvhrHeatPump"),
});

export const exhaustAirMixedHeatPump = heatPumpBase.extend({
	technologyType: z.literal("ExhaustAirMixedHeatPump"),
});

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
	boilerLocation: z.nullable(z.string()),
	efficiencyPartLoad: z.nullable(z.number()),
	erpSpaceEfficiencyClass: z.nullable(z.string()),
	erPSpaceEfficiencyPerc: z.nullable(z.number()),
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
	heatStorageZoneMaterialKjPerKDuringPhaseTransition: z.nullable(z.number()),
	electricityStandby: z.nullable(z.number()),
	inletDiameterMm: z.nullable(z.number()),
	heatStorageZoneMaterialKjPerKBelowPhaseTransition: z.nullable(z.number()),
	serviceProvision: z.nullable(z.string()),
	heatStorageZoneMaterialKjPerKAbovePhaseTransition: z.nullable(z.number()),
	velocityInHexTubeAt1LPerMinMPerS: z.nullable(z.number()),
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
	pumpPower: z.nullable(z.number()),
	maxFlowRatePumpLPerMin: z.nullable(z.number()),
	heatExchangerSurfaceArea: z.nullable(z.number()),
	heaterPosition: z.nullable(z.number()),
	usableTemp: z.nullable(z.number()),
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
	airFlowType: z.nullable(z.number()),
	convectiveFraction: z.nullable(z.number()),
	heatRetention: z.nullable(z.number()),
	ratedFanPower: z.nullable(z.number()),
	pwrIn: z.nullable(z.number()),
	outputPower: z.nullable(z.number()),
	highHeatRetention: z.nullable(z.number()),
	controlType: z.nullable(z.string()),
});

export type ElectricStorageHeaterProduct = z.infer<typeof electricStorageHeaterZod>;

export const productSchema = z.discriminatedUnion("technologyType", [
	airSourceHeatPumpZod,
	groundSourceHeatPumpZod,
	waterSourceHeatPumpZod,
	boosterHeatPumpZod,
	hotWaterOnlyPumpZod,
	exhaustAirMevPumpZod,
	exhaustAirMvhrHeatPumpZod,
	exhaustAirMixedHeatPump,
	combiBoilerZod,
	regularBoilerZod,
	heatBatteryPcmZod,
	heatBatteryDryCoreZod,
	smartHotWaterTankZod,
	fancoilZod,
	electricStorageHeaterZod,
]);

export type Product = z.infer<typeof productSchema>;

export const Products = z.array(productSchema);

export type TechnologyType = Product["technologyType"];

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
	],
	boiler: [
		"CombiBoiler",
		"RegularBoiler",
	],
	heatBattery: [
		"HeatBatteryPCM",
		"HeatBatteryDryCore",
	],
	waterStorage: ["SmartHotWaterTank"],
	heatEmitting: [
		"FanCoils",
		"StorageHeater",
	],
} as const satisfies Record<string, TechnologyType[]>;

export const technologyTypes: string[] = objectKeys(categoryTechnologies).flatMap(x => categoryTechnologies[x]);

export type DisplayProduct = Pick<z.infer<typeof BaseProduct>, "id" | "brandName" | "modelName" | "modelQualifier"> & { technologyType: TechnologyType };

export type DisplayProductWithFlowTemp = DisplayProduct & {
	designFlowTemperature?: number;
};

export interface PaginatedResult<T> {
	data: T[];
	lastEvaluationKey?: string;
}