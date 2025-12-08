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

export const airSourceHeatPumpTestDataZod = z.object({
	designFlowTemperature: z.int(),
	testCondition: z.enum(["A", "B", "C", "D", "E", "F"]), // there is a possible 'E' value here, which diverges from SchemaTestLetter
	testConditionTemperature: z.int(),
	inletTemperature: z.number(),
	outletTemperature: z.number(),
	heatingCapacity: z.number(),
	coefficientOfPerformance: z.number(),
	degradationCoefficient: z.number(),
});

export const airSourceHeatPumpZod = BaseProduct.extend({
	technologyType: z.literal("Air source heat pumps"),
	fuel: z.string(), // need a better type for this
	sourceType: heatPumpSourceTypeZod,
	sinkType: heatPumpSinkTypeZod,
	backupControlType: heatPumpBackupControlTypeZod,
	modulatingControl: z.boolean(),
	standardRatingCapacity20C: z.nullable(z.number()),
	standardRatingCapacity35C: z.nullable(z.number()),
	standardRatingCapacity55C: z.nullable(z.number()),
	minimumModulationRate20: z.nullable(z.number()),
	minimumModulationRate35: z.nullable(z.number()),
	minimumModulationRate55: z.nullable(z.number()),
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
	testData: z.array(airSourceHeatPumpTestDataZod),
});

export const productSchema = z.discriminatedUnion("technologyType", [
	airSourceHeatPumpZod,
]);
export type Product = z.infer<typeof productSchema>;

export const Products = z.array(productSchema);

export type TechnologyType = Product["technologyType"];

export const categoryTechnologies = {
	heatPump: [
		"Air source heat pumps",
	],
} as const satisfies Record<string, TechnologyType[]>;

export const technologyTypes: string[] = objectKeys(categoryTechnologies).flatMap(x => categoryTechnologies[x]);

export const knownCategories = objectKeys(categoryTechnologies);

export type Category = keyof typeof categoryTechnologies;

export type ProductForCategory<T extends Category> = Extract<Product, { technologyType: (typeof categoryTechnologies)[T][number] }>;

export type DisplayProduct = Pick<z.infer<typeof BaseProduct>, "id" | "brandName" | "modelName" | "modelQualifier" > & { technologyType: TechnologyType };

export type DisplayProductWithFlowTemp = DisplayProduct & {
	designFlowTemperature?: number;
};

export interface PaginatedResult<T> {
	data: T[];
	lastEvaluationKey?: string;
}