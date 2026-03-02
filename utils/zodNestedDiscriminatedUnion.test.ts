import * as z from "zod";
import { nestedDiscriminatedUnion, type NDUNFromUnions } from "./zodNestedDiscriminatedUnion";

describe.only("nested discriminated union", () => {
	const commonFieldsSchema = z.object({
		name: z.string(),
		value: z.number(),
	});

	const squareParamsRawShape = {
		typeOfShape: z.literal("square"),
		sideLength: z.number().min(0.0001),
	};
	const circleParamsRawShape = {
		typeOfShape: z.literal("circle"),
		radius: z.number().min(0.0001),
	};

	const discriminatedUnionParams1 = {
		discriminator: "typeOfShape",
		variants: [
			z.object(squareParamsRawShape),
			z.object(circleParamsRawShape),
		] satisfies [z.core.$ZodTypeDiscriminable, ...z.core.$ZodTypeDiscriminable[]],
	} ;

	type TestTypeDepthOne = z.infer<NDUNFromUnions<
		typeof commonFieldsSchema,
		[typeof discriminatedUnionParams1]
	>>;

	const _testShapeDepthOne: TestTypeDepthOne = {
		name: "hi",
		value: 2,
		typeOfShape: "circle",
		radius: 0,
	};

	const oneColourRawShape = {
		numberOfColours: z.literal(1),
		colour1: z.string(),
	};

	const twoColorRawShape = {
		numberOfColours: z.literal(2),
		colour1: z.string(),
		colour2: z.string(),
	};
    
	const threeColorRawShape = {
		numberOfColours: z.literal(3),
		colour1: z.string(),
		colour2: z.string(),
		colour3: z.string(),
	};

	const discriminatedUnionParams2 = {
		discriminator: "numberOfColours",
		variants: [
			z.object(oneColourRawShape),
			z.object(twoColorRawShape),
			z.object(threeColorRawShape),
		] satisfies [z.core.$ZodTypeDiscriminable, ...z.core.$ZodTypeDiscriminable[]],
	};

	type TestTypeDepthTwo = z.infer<NDUNFromUnions<
		typeof commonFieldsSchema,
		[typeof discriminatedUnionParams1, typeof discriminatedUnionParams2]
	>>;

	const _testShapeDepthTwo: TestTypeDepthTwo = {
		name: "hi",
		value: 2,
		typeOfShape: "circle",
		radius: 0,
		numberOfColours: 2,
		colour1: "blah",
		colour2: "colour2",
	};

	describe("one level deep", () => {
		test("should parse valid square", () => {
			const result = nestedDiscriminatedUnion(commonFieldsSchema, discriminatedUnionParams1);
			type ResultType = z.infer<typeof result>;
			const validSquare: ResultType = { name: "A", value: 1, typeOfShape: "square", sideLength: 2 };
			expect(result.parse(validSquare)).toEqual(validSquare);
		});

		test("should parse valid circle", () => {
			const result = nestedDiscriminatedUnion(commonFieldsSchema, discriminatedUnionParams1);
			type ResultType = z.infer<typeof result>;
			const validCircle: ResultType = { name: "B", value: 2, typeOfShape: "circle", radius: 3 };
			expect(result.parse(validCircle)).toEqual(validCircle);
		});

		test("should fail on invalid type", () => {
			const result = nestedDiscriminatedUnion(commonFieldsSchema, discriminatedUnionParams1);
			type ResultType = z.infer<typeof result>;
			// @ts-expect-error 'triangle' isn't a valid typeOfShape in this schema, our ResultType should reflect this
			const invalid: ResultType = { name: "C", value: 3, typeOfShape: "triangle", base: 4 };
			expect(() =>
				result.parse(invalid),
			).toThrow();
		});
	});

	describe("two levels deep", () => {
		test("should parse valid square with one colour", () => {
			const schema = nestedDiscriminatedUnion(
				commonFieldsSchema,
				discriminatedUnionParams1,
				discriminatedUnionParams2,
			);
			type SchemaType = z.infer<typeof schema>;

			const valid: SchemaType = {
				name: "A",
				value: 1,
				typeOfShape: "square",
				sideLength: 2,
				numberOfColours: 1,
				colour1: "#ff0000",
			};
			expect(schema.parse(valid)).toEqual(valid);
		});

		test("should parse valid circle with three colours", () => {
			const schema = nestedDiscriminatedUnion(
				commonFieldsSchema,
				discriminatedUnionParams1,
				discriminatedUnionParams2,
			);
			type SchemaType = z.infer<typeof schema>;

			const valid: SchemaType = {
				name: "B",
				value: 2,
				typeOfShape: "circle",
				radius: 3,
				numberOfColours: 3,
				colour1: "#00ff00",
				colour2: "#0000ff",
				colour3: "#ffff00",
			};
			expect(schema.parse(valid)).toEqual(valid);
		});

		test("should fail on invalid colour count", () => {
			const schema = nestedDiscriminatedUnion(
				commonFieldsSchema,
				discriminatedUnionParams1,
				discriminatedUnionParams2,
			);
			type SchemaType = z.infer<typeof schema>;

			const invalid: SchemaType = {
				name: "C",
				value: 3,
				typeOfShape: "square",
				sideLength: 4,
				// @ts-expect-error 4 isn't a valid numberOfColours in this schema, our SchemaType should reflect this
				numberOfColours: 4,
				colour1: "#123456",
				colour2: "#654321",
				colour3: "#abcdef",
				colour4: "#fedcba",
			};
			expect(() => schema.parse(invalid)).toThrow();
		});

		test("should fail on missing required colour fields", () => {
			const schema = nestedDiscriminatedUnion(
				commonFieldsSchema,
				discriminatedUnionParams1,
				discriminatedUnionParams2,
			);
			type SchemaType = z.infer<typeof schema>;

			// @ts-expect-error we're missing colour2 which should be required in SchemaType
			const invalid: SchemaType = {
				name: "D",
				value: 4,
				typeOfShape: "circle",
				radius: 5,
				numberOfColours: 2,
				colour1: "#123456",
				// missing colour2
			};
			expect(() => schema.parse(invalid)).toThrow();
		});
	});

	describe("radiators vs previous implementation", () => {
		const radiatorCommonFields = radiatorBase;

		const standardRadiatorRaw = {
			typeOfRadiator: z.literal("standard"),
			length: z.number(),
		};
		const towelRadiatorRaw = {
			typeOfRadiator: z.literal("towel"),
		};

		const eco2367Raw = {
			ecoDesignControllerClass: z.enum(["2", "3", "6", "7"]),
			minFlowTemp: z.number(),
			minOutdoorTemp: z.number(),
			maxOutdoorTemp: z.number(),
		};
		const eco1458Raw = {
			ecoDesignControllerClass: z.enum(["1", "4", "5", "8"]),
		};

		const variableFlowRaw = {
			hasVariableFlowRate: z.literal(true),
			minFlowRate: z.number(),
			maxFlowRate: z.number(),
		};
		const fixedFlowRaw = {
			hasVariableFlowRate: z.literal(false),
			designFlowRate: z.number(),
		};

		const typeOfRadiatorParams = {
			discriminator: "typeOfRadiator",
			variants: [
				z.object(standardRadiatorRaw),
				z.object(towelRadiatorRaw),
			] satisfies [z.core.$ZodTypeDiscriminable, ...z.core.$ZodTypeDiscriminable[]],
		};
		const ecoControllerParams = {
			discriminator: "ecoDesignControllerClass",
			variants: [
				z.object(eco2367Raw),
				z.object(eco1458Raw),
			] satisfies [z.core.$ZodTypeDiscriminable, ...z.core.$ZodTypeDiscriminable[]],
		};
		const flowRateParams = {
			discriminator: "hasVariableFlowRate",
			variants: [
				z.object(variableFlowRaw),
				z.object(fixedFlowRaw),
			] satisfies [z.core.$ZodTypeDiscriminable, ...z.core.$ZodTypeDiscriminable[]] };

		const radiatorSchemaNew = nestedDiscriminatedUnion(
			radiatorCommonFields,
			flowRateParams,
			ecoControllerParams,
			typeOfRadiatorParams,
		);

		type RadiatorSchemaNew = z.infer<typeof radiatorSchemaNew>;

		const validCases: RadiatorSchemaNew[] = [
			{
				name: "Rad1",
				id: "11111111-1111-4111-a111-111111111111",
				typeOfHeatEmitter: "radiator",
				productReference: "PR1",
				heatSource: "HS1",
				designFlowTemp: 55,
				designTempDiffAcrossEmitters: 10,
				numOfRadiators: 2,
				hasVariableFlowRate: true,
				minFlowRate: 1,
				maxFlowRate: 2,
				ecoDesignControllerClass: "2",
				minFlowTemp: 40,
				minOutdoorTemp: -5,
				maxOutdoorTemp: 15,
				typeOfRadiator: "standard",
				length: 100,
			},
			// variable, eco1458, towel
			{
				name: "Rad2",
				id: "22222222-2222-4222-a222-222222222222",
				typeOfHeatEmitter: "radiator",
				productReference: "PR2",
				heatSource: "HS2",
				designFlowTemp: 50,
				designTempDiffAcrossEmitters: 8,
				numOfRadiators: 1,
				hasVariableFlowRate: true,
				minFlowRate: 1.5,
				maxFlowRate: 2.5,
				ecoDesignControllerClass: "4",
				typeOfRadiator: "towel",
			},
			// fixed, eco2367, towel
			{
				name: "Rad3",
				id: "33333333-3333-4333-a333-333333333333",
				typeOfHeatEmitter: "radiator",
				productReference: "PR3",
				heatSource: "HS3",
				designFlowTemp: 60,
				designTempDiffAcrossEmitters: 12,
				numOfRadiators: 3,
				hasVariableFlowRate: false,
				designFlowRate: 3.5,
				ecoDesignControllerClass: "6",
				minFlowTemp: 42,
				minOutdoorTemp: -3,
				maxOutdoorTemp: 17,
				typeOfRadiator: "towel",
			},
			// fixed, eco1458, standard
			{
				name: "Rad4",
				id: "44444444-4444-4444-a444-444444444444",
				typeOfHeatEmitter: "radiator",
				productReference: "PR4",
				heatSource: "HS4",
				designFlowTemp: 65,
				designTempDiffAcrossEmitters: 15,
				numOfRadiators: 4,
				hasVariableFlowRate: false,
				designFlowRate: 4.5,
				ecoDesignControllerClass: "8",
				typeOfRadiator: "standard",
				length: 120,
			},
		];

		test.each(validCases)("parses valid radiator case %# the same as old implementation", (radiator) => {
			expect(radiatorSchemaOld.parse(radiator)).toEqual(radiator);
			expect(radiatorSchemaNew.parse(radiator)).toEqual(radiator);
		});

		test("fails on invalid ecoDesignControllerClass", () => {
			const invalid: RadiatorSchemaNew = {
				...validCases[0],
				// @ts-expect-error '9' isn't a valid ecoDesignControllerClass in this schema, our SchemaType should reflect this
				ecoDesignControllerClass: "9", // not allowed
			};
			expect(() => radiatorSchemaOld.parse(invalid)).toThrow();
			expect(() => radiatorSchemaNew.parse(invalid)).toThrow();
		});

		test("fails on missing required field", () => {
			// @ts-expect-error we're missing length which should be required in SchemaType
			const invalid: RadiatorSchemaNew = {
				name: "Rad1",
				id: "11111111-1111-4111-a111-111111111111",
				typeOfHeatEmitter: "radiator",
				productReference: "PR1",
				heatSource: "HS1",
				designFlowTemp: 55,
				designTempDiffAcrossEmitters: 10,
				numOfRadiators: 2,
				hasVariableFlowRate: true,
				minFlowRate: 1,
				maxFlowRate: 2,
				ecoDesignControllerClass: "2",
				minFlowTemp: 40,
				minOutdoorTemp: -5,
				maxOutdoorTemp: 15,
				typeOfRadiator: "standard",
			};

			expect(() => radiatorSchemaOld.parse(invalid)).toThrow();
			expect(() => radiatorSchemaNew.parse(invalid)).toThrow();
		});
	});
});

/**
 * The following is the old implementation for radiator schema, used to ensure
 * that the new schema will function equivalently
 */

const named = z.object({
	name: z.string().trim().min(1),
});

const namedWithId = named.extend({
	id: z.uuidv4().readonly(),
});

const radiatorBase = namedWithId.extend({
	typeOfHeatEmitter: z.literal("radiator"),
	productReference: z.string(),
	heatSource: z.string(),
	designFlowTemp: z.number(),
	designTempDiffAcrossEmitters: z.number(),
	numOfRadiators: z.number(),
});

function makeStandardRadiator<
	T extends z.ZodRawShape & { typeOfRadiator?: never },
>(base: z.ZodObject<T>) {
	return base.extend({
		typeOfRadiator: z.literal("standard"),
		length: z.number(),
	});
}

function makeTowelRadiator<
	T extends z.ZodRawShape & { typeOfRadiator?: never },
>(base: z.ZodObject<T>) {
	return base.extend({
		typeOfRadiator: z.literal("towel"),
	});
}

function makeEco2367Item<
	T extends z.ZodRawShape & { ecoDesignControllerClass?: never },
>(base: z.ZodObject<T>) {
	return base.extend({
		ecoDesignControllerClass: z.enum(["2", "3", "6", "7"]),
		minFlowTemp: z.number(),
		minOutdoorTemp: z.number(),
		maxOutdoorTemp: z.number(),
	});
}

function makeEco1458Item<
	T extends z.ZodRawShape & { ecoDesignControllerClass?: never },
>(base: z.ZodObject<T>) {
	return base.extend({
		ecoDesignControllerClass: z.enum(["1", "4", "5", "8"]),
	});
}

function makeVariableFlowRateItem<
	T extends z.ZodRawShape & { hasVariableFlowRate?: never },
>(base: z.ZodObject<T>) {
	return base.extend({
		hasVariableFlowRate: z.literal(true),
		minFlowRate: z.number(),
		maxFlowRate: z.number(),
	});
}

function makeFixedFlowRateItem<
	T extends z.ZodRawShape & { hasVariableFlowRate?: never },
>(base: z.ZodObject<T>) {
	return base.extend({
		hasVariableFlowRate: z.literal(false),
		designFlowRate: z.number(),
	});
}

const standardRadiator = makeStandardRadiator(radiatorBase);
const towelRadiator = makeTowelRadiator(radiatorBase);

const standardRadiatorEco2367 = makeEco2367Item(standardRadiator);
const towelRadiatorEco2367 = makeEco2367Item(towelRadiator);
const standardRadiatorEco1458 = makeEco1458Item(standardRadiator);
const towelRadiatorEco1458 = makeEco1458Item(towelRadiator);

const variableStandardRadiatorEco2367 = makeVariableFlowRateItem(standardRadiatorEco2367);
const variableTowelRadiatorEco2367 = makeVariableFlowRateItem(towelRadiatorEco2367);
const variableStandardRadiatorEco1458 = makeVariableFlowRateItem(standardRadiatorEco1458);
const variableTowelRadiatorEco1458 = makeVariableFlowRateItem(towelRadiatorEco1458);
const fixedStandardRadiatorEco2367 = makeFixedFlowRateItem(standardRadiatorEco2367);
const fixedTowelRadiatorEco2367 = makeFixedFlowRateItem(towelRadiatorEco2367);
const fixedStandardRadiatorEco1458 = makeFixedFlowRateItem(standardRadiatorEco1458);
const fixedTowelRadiatorEco1458 = makeFixedFlowRateItem(towelRadiatorEco1458);

const radiatorSchemaOld = z.discriminatedUnion("hasVariableFlowRate", [
	z.discriminatedUnion("ecoDesignControllerClass", [
		z.discriminatedUnion("typeOfRadiator", [
			variableStandardRadiatorEco2367,
			variableTowelRadiatorEco2367,
		]),
		z.discriminatedUnion("typeOfRadiator", [
			variableStandardRadiatorEco1458,
			variableTowelRadiatorEco1458,
		]),
	]),
	z.discriminatedUnion("ecoDesignControllerClass", [
		z.discriminatedUnion("typeOfRadiator", [
			fixedStandardRadiatorEco2367,
			fixedTowelRadiatorEco2367,
		]),
		z.discriminatedUnion("typeOfRadiator", [
			fixedStandardRadiatorEco1458,
			fixedTowelRadiatorEco1458,
		]),
	]),
]);