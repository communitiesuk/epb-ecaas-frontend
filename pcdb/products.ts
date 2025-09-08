import * as z from "zod";
import products from "./products.json";
import { HeatPumpBackupControlType, HeatPumpSinkType, HeatPumpSourceType } from "~/schema/api-schema.types";
import { objectEntries, objectKeys } from "ts-extras";

const IntString = z.string().regex(/^\d+$/);

const Manufacturer = z.object({
	ID: IntString,
	manufacturerReferenceNo: IntString,
	currentName: z.string(),
	secondaryAddressable: z.nullable(z.string()),
	primaryAddressable: z.nullable(z.string()),
	streetName: z.string(),
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
	ID: z.int(),
	manufacturer: Manufacturer,
	originalManufacturerName: z.nullable(z.string()),
	brandName: z.string(),
	modelName: z.string(),
	modelQualifier: z.string(),
	firstYearOfManufacture: z.int(),
	finalYearOfManufacture: z.union([z.literal("current"), z.int()]),
});

const AirSourceHeatPump = BaseProduct.extend({
	technologyType: z.literal("Air Source Heat Pump"),
	fuel: z.string(), // need a better type for this
	sourceType: z.enum(HeatPumpSourceType),
	sinkType: z.enum(HeatPumpSinkType),
	backupControlType: z.enum(HeatPumpBackupControlType),
	modulatingControl: z.boolean(),
	standardRatingCapacity20C: z.nullable(z.number()),
	standardRatingCapacity35C: z.nullable(z.number()),
	standardRatingCapacity55C: z.nullable(z.number()),
	minimumModulationRate: z.nullable(z.number()),
	timeConstantOnOffOperation: z.nullable(z.int()),
	tempReturnFeedMax: z.nullable(z.number()),
	tempLowerOperatingLimit: z.nullable(z.number()),
	minTempDiffFlowReturnForHpToOperate: z.nullable(z.int()),
	varFlowTempCtrlDuringTest: z.boolean(),
	powerHeatingCircPump: z.nullable(z.number()),
	powerHeatingWarmAirFan: z.nullable(z.number()),
	powerSourceCircPump: z.nullable(z.number()),
	powerStandby: z.number(),
	powerCrankcaseHeater: z.nullable(z.number()),
	powerOff: z.nullable(z.number()),
	powerMaximumBackup: z.nullable(z.number()),
	testData: z.array(z.object({
		designFlowTemperature: z.int(),
		testCondition: z.enum(["A", "B", "C", "D", "E", "F"]), // there is a possible 'E' value here, which diverges from SchemaTestLetter
		testConditionTemperature: z.int(),
		inletTemperature: z.number(),
		outletTemperature: z.number(),
		heatingCapacity: z.number(),
		coefficientOfPerformance: z.number(),
		degradationCoefficient: z.number(),
	}))
});

export const Products = z.map(z.string(), z.discriminatedUnion("technologyType", [
	AirSourceHeatPump,
]));

export type Products = z.infer<typeof Products>;

export type Product = Products extends Map<string, infer I> ? I : never;

export type TechnologyType = Product["technologyType"];

const productsMap = new Map(objectEntries(products)) as Products;

export const categoryTechnologies = {
	heatPump: [
		"Air Source Heat Pump",
	],
} as const satisfies Record<string, TechnologyType[]>;

export const knownCategories = objectKeys(categoryTechnologies);

export type Category = keyof typeof categoryTechnologies;

export type ProductForCategory<T extends Category> = Extract<Product, { technologyType: (typeof categoryTechnologies)[T][number] }>;

export type ProductReference = keyof typeof products;

export type ProductEntity<T> = {
	reference: ProductReference,
	product: T
};

export type DisplayProduct = Pick<z.infer<typeof BaseProduct>, "brandName" | "modelName" | "modelQualifier" | "firstYearOfManufacture"> & { technologyType: TechnologyType };

export default productsMap;
