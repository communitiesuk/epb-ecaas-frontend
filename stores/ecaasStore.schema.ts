import { standardPitchOption } from "./../utils/pitchOptions";
import type { TaggedUnion } from "type-fest";
import type { PageId } from "~/data/pages/pages";
import type { SchemaFhsComplianceResponse, SchemaJsonApiOnePointOneErrorLinks, SchemaJsonApiOnePointOneErrorSource, SchemaJsonApiOnePointOneMeta } from "~/schema/api-schema.types";
import type { FloorType, SchemaMechVentType, MassDistributionClass } from "~/schema/aliases";
import * as z from "zod";
import { zeroPitchOption } from "~/utils/pitchOptions";
import { zodUnit } from "~/utils/units/zod";
import { arealHeatCapacityZod, batteryLocationZod, colourZod, ductShapeZod, fuelTypeWithElecOnlyZod, inverterTypeZod, massDistributionClassZod, mvhrLocationZod, partyWallCavityTypeZod, partyWallLiningTypeZod, photovoltaicVentilationStrategyZod, shadingObjectTypeZod, terrainClassZod, testPressureZod, ventilationShieldClassZod, waterPipeContentsTypeZod, windowTreatmentTypeZod, windShieldLocationZod, zodLiteralFromUnionType } from "./zod";
import type { TechnologyType } from "~/pcdb/pcdb.types";

const fraction = z.number().min(0).max(1);
const named = z.object({
	name: z.string().trim().min(1),
});
const namedWithId = named.extend({
	id: z.uuidv4().readonly(),
});

// local simpler MassDistributionClass containing e.g. "M" instead of "M: Mass concentrated inside"
type Prefixes<T extends string> = T extends `${infer Prefix}:${string}` ? Prefix : never;
export type ConciseMassDistributionClass = Prefixes<MassDistributionClass>;

// some standard field definitions
const orientation = z.number().min(0).lt(360);
const massDistributionClass = massDistributionClassZod;
const uValue = z.number().min(0.01).max(10);
const thermalResistanceOfAdjacentUnheatedSpace = z.number().min(0).max(3);

export type EcaasState = AssertEachKeyIsPageId<{
	dwellingDetails: DwellingDetails;
	domesticHotWater: DomesticHotWater;
	dwellingFabric: DwellingFabric;
	infiltrationAndVentilation: InfiltrationAndVentilation;
	spaceHeating: SpaceHeating;
	pvAndBatteries: PvAndBatteries;
	cooling: Cooling;
}> & {
	lastResult?: ComplianceResult;
};

export type PartialExceptName<T extends { name: string }> = Pick<T, "name"> & Partial<Omit<T, "name">>;

export type EcaasForm<T, AlwaysRequired = ""> = {
	complete?: false,
	data: [AlwaysRequired] extends [keyof T] ? Pick<T, AlwaysRequired> & Partial<Omit<T, AlwaysRequired>> : T,
} | {
	complete: true,
	data: T
};

export type EcaasFormList<T> = {
	complete?: boolean,
	data: EcaasForm<T, "name">[]
};

export function isEcaasForm(value: unknown): value is EcaasForm<unknown> {
	return typeof value === "object" && value !== null && "data" in value;
}

const baseGeneralDetails = z.object({
	storeysInDwelling: z.int().min(1).max(250),
	buildingLength: z.number().positive(),
	buildingWidth: z.number().positive(),
	numOfBedrooms: z.int().min(1),
	numOfUtilityRooms: z.int(),
	numOfBathrooms: z.int().min(1),
	numOfWCs: z.int(),
	numOfHabitableRooms: z.int().min(1),
	numOfRoomsWithTappingPoints: z.int().min(1),
	fuelType: z.array(fuelTypeWithElecOnlyZod),
});

const generalDetailsDataZod = z.discriminatedUnion("typeOfDwelling", [
	baseGeneralDetails.extend({
		typeOfDwelling: z.literal("flat"),
		storeyOfFlat: z.int().min(-50).max(199),
		storeysInBuilding: z.int().min(1),
	}),
	baseGeneralDetails.extend({ typeOfDwelling: z.literal("house") }),
]);

export type GeneralDetailsData = z.infer<typeof generalDetailsDataZod>;

const shadingDataZod = named.extend({
	startAngle: z.number().min(0).lt(360),
	endAngle: z.number().min(0).lt(360),
	objectType: shadingObjectTypeZod,
	height: z.number(),
	distance: z.number().positive(),
});

export type ShadingData = z.infer<typeof shadingDataZod>;

const externalFactorsDataZod = z.object({
	altitude: z.number().min(-150).max(7200),
	typeOfExposure: ventilationShieldClassZod,
	terrainType: terrainClassZod,
	noiseNuisance: z.boolean(),
});

export type ExternalFactorsData = z.infer<typeof externalFactorsDataZod>;

export const kitchenExtractorHoodExternalKey = "KitchenExtractorHoodExternal";

const appliancesDataZod = z.object({
	applianceType: z.array(z.union([applianceTypeZod, z.literal(kitchenExtractorHoodExternalKey)])),
});
export type AppliancesData = z.infer<typeof appliancesDataZod>;
export type ApplianceKey = AppliancesData["applianceType"][number];

export type DwellingDetails = AssertFormKeysArePageIds<{
	generalSpecifications: EcaasForm<GeneralDetailsData>;
	shading: EcaasFormList<ShadingData>;
	externalFactors: EcaasForm<ExternalFactorsData>;
	appliances: EcaasForm<AppliancesData>
}>;

export interface DwellingFabric {
	dwellingSpaceZoneParameters: EcaasForm<DwellingSpaceZoneParametersData>;
	dwellingSpaceFloors: FloorsData;
	dwellingSpaceWalls: WallsData;
	dwellingSpaceCeilingsAndRoofs: CeilingsAndRoofsData;
	dwellingSpaceDoors: DoorsData;
	dwellingSpaceWindows: EcaasFormList<WindowData>;
	dwellingSpaceThermalBridging: ThermalBridgingData;
	dwellingSpaceLighting: EcaasFormList<DwellingSpaceLightingData>;
}

export interface FloorsData {
	dwellingSpaceGroundFloor: EcaasFormList<GroundFloorData>,
	dwellingSpaceInternalFloor: EcaasFormList<InternalFloorData>,
	dwellingSpaceExposedFloor: EcaasFormList<ExposedFloorData>,
	dwellingSpaceFloorAboveUnheatedBasement: EcaasFormList<FloorAboveUnheatedBasementData>
	dwellingSpaceFloorOfHeatedBasement: EcaasFormList<FloorOfHeatedBasementData>
}

export const adjacentSpaceTypes = ["heatedSpace", "unheatedSpace"] as const;

export type AdjacentSpaceType = typeof adjacentSpaceTypes[number];

const baseInternalFloorData = named.extend({
	surfaceAreaOfElement: z.number(),
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
});
const internalFloorDataZod = z.discriminatedUnion(
	"typeOfInternalFloor",
	[
		baseInternalFloorData.extend({
			typeOfInternalFloor: z.literal("unheatedSpace"),
			thermalResistanceOfAdjacentUnheatedSpace,
		}),
		baseInternalFloorData.extend({
			typeOfInternalFloor: z.literal("heatedSpace"),
		}),
	],
);

export type InternalFloorData = z.infer<typeof internalFloorDataZod>;

export const exposedFloorDataZod = named.extend({
	pitch: z.number().min(0).max(180),
	length: z.number().min(0.001).max(50),
	width: z.number().min(0.001).max(50),
	elevationalHeight: z.number().min(0).max(500),
	surfaceArea: z.number().min(0.01).max(10000),
	uValue,
	colour: colourZod,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
});

export type ExposedFloorData = z.infer<typeof exposedFloorDataZod>;

const baseGroundFloorData = named.extend({
	surfaceArea: z.number().min(1),
	uValue,
	thermalResistance: z.number().min(0.00001).max(50),
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	perimeter: z.number().min(0).max(1000),
	psiOfWallJunction: z.number().min(0).max(2),
	thicknessOfWalls: z.number(),
});
const groundFloorDataZod = z.discriminatedUnion(
	"typeOfGroundFloor",
	[
		baseGroundFloorData.extend({
			typeOfGroundFloor: zodLiteralFromUnionType<FloorType, "Slab_edge_insulation">("Slab_edge_insulation"),
			edgeInsulationType: z.enum(["horizontal", "vertical"]),
			// TODO constraints have not been put on zodUnit yet!
			edgeInsulationWidth: z.union([zodUnit("length"), z.number().min(0).max(10000)]), // number will be deprecated, preserved for backwards compatibility with old input data files
			edgeInsulationThermalResistance: z.number(),
		}),
		baseGroundFloorData.extend({
			typeOfGroundFloor: zodLiteralFromUnionType<FloorType, "Slab_no_edge_insulation">("Slab_no_edge_insulation"),
		}),
		baseGroundFloorData.extend({
			typeOfGroundFloor: zodLiteralFromUnionType<FloorType, "Suspended_floor">("Suspended_floor"),
			heightOfFloorUpperSurface: z.number().min(0).max(100000),
			underfloorSpaceThermalResistance: z.number(),
			thermalTransmittanceOfWallsAboveGround: z.number(),
			ventilationOpeningsArea: z.number(),
			windShieldingFactor: windShieldLocationZod,
		}),
		baseGroundFloorData.extend({
			typeOfGroundFloor: zodLiteralFromUnionType<FloorType, "Heated_basement">("Heated_basement"),
			depthOfBasementFloorBelowGround: z.number(),
			thermalResistanceOfBasementWalls: z.number(),
		}),
		baseGroundFloorData.extend({
			typeOfGroundFloor: zodLiteralFromUnionType<FloorType, "Unheated_basement">("Unheated_basement"),
			thermalTransmittanceOfFloorAboveBasement: z.number(),
			thermalTransmittanceOfWallsAboveGround: z.number(),
			thermalResistanceOfBasementWalls: z.number(),
			depthOfBasementFloorBelowGround: z.number(),
			heightOfBasementWallsAboveGround: z.number(),
		}),
	],
);

export type GroundFloorData = z.infer<typeof groundFloorDataZod>;

const floorAboveUnheatedBasementDataZod = named.extend({
	surfaceArea: z.number().min(1),
	uValue,
	thermalResistance: z.number().min(0.00001).max(50),
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	perimeter: z.number().min(0).max(1000),
	psiOfWallJunction: z.number().min(0).max(2),
	thicknessOfWalls: z.number(),
	depthOfBasementFloor: z.number(),
	heightOfBasementWalls: z.number(),
	thermalResistanceOfBasementWalls: z.number().min(0.00001).max(50),
	thermalTransmittanceOfBasementWalls: z.number(),
	thermalTransmittanceOfFoundations: z.number(),
});

export type FloorAboveUnheatedBasementData = z.infer<typeof floorAboveUnheatedBasementDataZod>;

const floorOfHeatedBasementDataZod = namedWithId.extend({
	surfaceArea: z.number().min(1),
	uValue,
	thermalResistance: z.number().min(0.00001).max(50),
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	depthOfBasementFloor: z.number(),
	perimeter: z.number().min(0).max(1000),
	psiOfWallJunction: z.number().min(0).max(2),
	thicknessOfWalls: z.number(),
});

export type FloorOfHeatedBasementData = z.infer<typeof floorOfHeatedBasementDataZod>;


export type WallsData = AssertFormKeysArePageIds<{
	dwellingSpaceExternalWall: EcaasForm<EcaasForm<ExternalWallData>[]>;
	dwellingSpaceInternalWall: EcaasForm<EcaasForm<InternalWallData>[]>;
	dwellingSpaceWallToUnheatedSpace: EcaasForm<EcaasForm<WallsToUnheatedSpaceData>[]>;
	dwellingSpacePartyWall: EcaasForm<EcaasForm<PartyWallData>[]>;
	dwellingSpaceWallOfHeatedBasement: EcaasForm<EcaasForm<WallOfHeatedBasementData>[]>;
}>;

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type NonZeroDigit = Exclude<Digit, "0">;
type AngleString = `${"" | "-"}${NonZeroDigit | ""}${NonZeroDigit | ""}${Digit | ""}`;

export type PitchOption = AngleString | "custom";

const externalWallDataZod = namedWithId.extend({
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
	orientation,
	height: z.number().min(0.001).max(50),
	length: z.number().min(0.001).max(50),
	elevationalHeight: z.number().min(0).max(500),
	surfaceArea: z.number().min(0.01).max(10000),
	uValue,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	colour: colourZod,
});

export type ExternalWallData = z.infer<typeof externalWallDataZod>;

const internalWallDataZod = namedWithId.extend({
	surfaceAreaOfElement: z.number().min(0).max(10000),
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
});

export type InternalWallData = z.infer<typeof internalWallDataZod>;

const wallsToUnheatedSpaceDataZod = namedWithId.extend({
	surfaceAreaOfElement: z.number().min(0).max(10000),
	uValue,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
	thermalResistanceOfAdjacentUnheatedSpace,
});

export type WallsToUnheatedSpaceData = z.infer<typeof wallsToUnheatedSpaceDataZod>;

export const thermalResistanceCavityZod = z.optional(z.number().gt(0));

const partyWallDataZod = namedWithId.extend({
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(60).max(120)),
	surfaceArea: z.number().min(0.01).max(10000),
	uValue,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	partyWallCavityType: partyWallCavityTypeZod,
	partyWallLiningType: z.optional(partyWallLiningTypeZod),
	thermalResistanceCavity: thermalResistanceCavityZod,
});

export type PartyWallData = z.infer<typeof partyWallDataZod>;

const wallOfHeatedBasementDataZod = namedWithId.extend({
	netSurfaceArea: z.number().min(0.01).max(10000),
	uValue,
	thermalResistance: z.number().min(0.00001).max(50),
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	associatedBasementFloorId: z.uuidv4(),
});

export type WallOfHeatedBasementData = z.infer<typeof wallOfHeatedBasementDataZod>;

export type CeilingsAndRoofsData = AssertFormKeysArePageIds<{
	dwellingSpaceCeilings: EcaasFormList<CeilingData>;
	dwellingSpaceRoofs: EcaasFormList<RoofData>;
}>;

const baseCeilingData = namedWithId.extend({
	surfaceArea: z.number().min(0).max(10000),
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	pitchOption: zeroPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
});
const ceilingDataZod = z.discriminatedUnion(
	"type",
	[
		baseCeilingData.extend({
			type: z.literal("heatedSpace"),
		}),
		baseCeilingData.extend({
			type: z.literal("unheatedSpace"),
			thermalResistanceOfAdjacentUnheatedSpace,
			uValue,
		}),
	],
);

export type CeilingData = z.infer<typeof ceilingDataZod>;

const roofType = z.enum(["flat", "pitchedInsulatedAtRoof", "pitchedInsulatedAtCeiling", "unheatedPitched"]);

export type RoofType = z.infer<typeof roofType>;

const roofDataZod = namedWithId.extend({
	typeOfRoof: roofType,
	pitchOption: z.optional(zeroPitchOption),
	pitch: z.number().min(0).lt(180),
	orientation: z.optional(orientation),
	length: z.number().min(0.001).max(50),
	width: z.number().min(0.001).max(50),
	elevationalHeightOfElement: z.number().min(0).max(500),
	surfaceArea: z.number().min(0.01).max(10000),
	uValue,
	colour: colourZod,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
});

export type RoofData = z.infer<typeof roofDataZod>;

export type DoorsData = AssertFormKeysArePageIds<{
	dwellingSpaceExternalUnglazedDoor: EcaasFormList<ExternalUnglazedDoorData>;
	dwellingSpaceExternalGlazedDoor: EcaasFormList<ExternalGlazedDoorData>;
	dwellingSpaceInternalDoor: EcaasFormList<InternalDoorData>;
}>;

const externalUnglazedDoorDataZod = named.extend({
	associatedItemId: z.guid().optional(),
	pitchOption: standardPitchOption.optional(),
	pitch: z.number().min(0).max(180).optional(),
	orientation: z.number().min(0).lt(360).optional(),
	height: z.number().min(0.001).max(50),
	width: z.number().min(0.001).max(50),
	elevationalHeight: z.number().min(0).max(500),
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	colour: colourZod,
	thermalResistance: z.number().min(0.00001).max(50),
});

export type ExternalUnglazedDoorData = z.infer<typeof externalUnglazedDoorDataZod>;

const baseExternalGlazedDoorDataZod = named.extend({
	associatedItemId: z.guid().optional(),
	pitchOption: standardPitchOption.optional(),
	pitch: z.number().min(0).max(180).optional(),
	orientation: z.number().min(0).lt(360).optional(),
	height: z.number().min(0.001).max(50),
	width: z.number().min(0.001).max(50),
	thermalResistance: z.number().min(0.00001).max(50),
	securityRisk: z.boolean(),
	solarTransmittance: z.number().min(0.01).max(1),
	elevationalHeight: z.number().min(0).max(500),
	midHeight: z.number().min(0).max(100),
	openingToFrameRatio: fraction,
	maximumOpenableArea: z.number().min(0.01).max(10000),
	heightOpenableArea: z.number().min(0.001).max(50),
});

const externalGlazedDoorDataWithOpenablePartsZod = z.discriminatedUnion(
	"numberOpenableParts",
	[
		baseExternalGlazedDoorDataZod.extend({
			numberOpenableParts: z.literal("0"),
		}),
		baseExternalGlazedDoorDataZod.extend({
			numberOpenableParts: z.literal("1"),
			maximumOpenableArea: z.number().min(0.01).max(10000),
			midHeightOpenablePart1: z.number().min(0).max(100),
		}),
		baseExternalGlazedDoorDataZod.extend({
			numberOpenableParts: z.literal("2"),
			maximumOpenableArea: z.number().min(0.01).max(10000),
			midHeightOpenablePart1: z.number().min(0).max(100),
			midHeightOpenablePart2: z.number().min(0).max(100),
		}),
		baseExternalGlazedDoorDataZod.extend({
			numberOpenableParts: z.literal("3"),
			maximumOpenableArea: z.number().min(0.01).max(10000),
			midHeightOpenablePart1: z.number().min(0).max(100),
			midHeightOpenablePart2: z.number().min(0).max(100),
			midHeightOpenablePart3: z.number().min(0).max(100),
		}),
		baseExternalGlazedDoorDataZod.extend({
			numberOpenableParts: z.literal("4"),
			maximumOpenableArea: z.number().min(0.01).max(10000),
			midHeightOpenablePart1: z.number().min(0).max(100),
			midHeightOpenablePart2: z.number().min(0).max(100),
			midHeightOpenablePart3: z.number().min(0).max(100),
			midHeightOpenablePart4: z.number().min(0).max(100),
		}),
	],
);

const curtainsOrBlindsFields = z.union([
	z.object({
		curtainsOrBlinds: z.literal(true),
		treatmentType: windowTreatmentTypeZod,
		thermalResistivityIncrease: z.number().min(0).max(100),
		solarTransmittanceReduction: fraction,
	}),
	z.object({
		curtainsOrBlinds: z.literal(false),
	}),
]);

const externalGlazedDoorData = z.intersection(externalGlazedDoorDataWithOpenablePartsZod, curtainsOrBlindsFields);

export type ExternalGlazedDoorData = z.infer<typeof externalGlazedDoorData>;

const baseInternalDoorData = named.extend({
	associatedItemId: z.guid(),
	surfaceArea: z.number().min(0).max(10000),
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
});
const internalDoorDataZod = z.discriminatedUnion(
	"typeOfInternalDoor",
	[
		baseInternalDoorData.extend({
			typeOfInternalDoor: z.literal("heatedSpace"),
		}),
		baseInternalDoorData.extend({
			typeOfInternalDoor: z.literal("unheatedSpace"),
			uValue,
			thermalResistanceOfAdjacentUnheatedSpace,
		}),
	],
);

export type InternalDoorData = z.infer<typeof internalDoorDataZod>;

const baseWindowData = namedWithId.extend({
	taggedItem: z.guid().optional(),
	pitch: z.number().min(0).max(180).optional(),
	orientation: z.number().min(0).lt(360).optional(),
	height: z.number().min(0.001).max(50),
	width: z.number().min(0.001).max(50),
	uValue,
	securityRisk: z.boolean(),
	solarTransmittance: z.number().min(0.01).max(1),
	elevationalHeight: z.number().min(0).max(500),
	midHeight: z.number().min(0).max(100),
	openingToFrameRatio: fraction,
});
const baseWindowPlusOpenableParts = z.discriminatedUnion(
	"numberOpenableParts",
	[
		baseWindowData.extend({
			numberOpenableParts: z.literal("0"),
		}),
		baseWindowData.extend({
			numberOpenableParts: z.literal("1"),
			maximumOpenableArea: z.number().min(0.01).max(10000),
			midHeightOpenablePart1: z.number().min(0).max(100),
		}),
		baseWindowData.extend({
			numberOpenableParts: z.literal("2"),
			maximumOpenableArea: z.number().min(0.01).max(10000),
			midHeightOpenablePart1: z.number().min(0).max(100),
			midHeightOpenablePart2: z.number().min(0).max(100),
		}),
		baseWindowData.extend({
			numberOpenableParts: z.literal("3"),
			maximumOpenableArea: z.number().min(0.01).max(10000),
			midHeightOpenablePart1: z.number().min(0).max(100),
			midHeightOpenablePart2: z.number().min(0).max(100),
			midHeightOpenablePart3: z.number().min(0).max(100),
		}),
		baseWindowData.extend({
			numberOpenableParts: z.literal("4"),
			maximumOpenableArea: z.number().min(0.01).max(10000),
			midHeightOpenablePart1: z.number().min(0).max(100),
			midHeightOpenablePart2: z.number().min(0).max(100),
			midHeightOpenablePart3: z.number().min(0).max(100),
			midHeightOpenablePart4: z.number().min(0).max(100),
		}),
	],
);

const overhangFields = z.union([
	z.object({
		overhangDepth: z.union([zodUnit("length"), z.number()]), // number will be deprecated, preserved for backwards compatibility with old input data files
		overhangDistance: z.union([zodUnit("length"), z.number()]), // number will be deprecated, preserved for backwards compatibility with old input data files
	}),
	z.object({
		overhangDepth: z.optional(z.undefined()),
		overhangDistance: z.optional(z.undefined()),
	}),
]);

const sideFinRightFields = z.union([
	z.object({
		sideFinRightDepth: z.union([zodUnit("length"), z.number()]), // number will be deprecated, preserved for backwards compatibility with old input data files
		sideFinRightDistance: z.union([zodUnit("length"), z.number()]), // number will be deprecated, preserved for backwards compatibility with old input data files
	}),
	z.object({
		sideFinRightDepth: z.optional(z.undefined()),
		sideFinRightDistance: z.optional(z.undefined()),
	}),
]);

const sideFinLeftFields = z.union([
	z.object({
		sideFinLeftDepth: z.union([zodUnit("length"), z.number()]), // number will be deprecated, preserved for backwards compatibility with old input data files
		sideFinLeftDistance: z.union([zodUnit("length"), z.number()]), // number will be deprecated, preserved for backwards compatibility with old input data files
	}),
	z.object({
		sideFinLeftDepth: z.optional(z.undefined()),
		sideFinLeftDistance: z.optional(z.undefined()),
	}),
]);


export const windowDataZod = z.intersection(
	baseWindowPlusOpenableParts,
	z.intersection(
		overhangFields,
		z.intersection(
			sideFinRightFields,
			z.intersection(
				sideFinLeftFields,
				curtainsOrBlindsFields,
			),
		),
	),
);

export type WindowData = z.infer<typeof windowDataZod>;

export type ThermalBridgingData = AssertFormKeysArePageIds<{
	dwellingSpaceLinearThermalBridges: EcaasFormList<LinearThermalBridgeData>;
	dwellingSpacePointThermalBridges: EcaasFormList<PointThermalBridgeData>;
}>;

const linearThermalBridgeDataZod = named.extend({
	typeOfThermalBridge: thermalBridgeJunctionTypeZod,
	linearThermalTransmittance: z.number().min(0).max(2),
	length: z.number().min(0).max(10000),
});

export type LinearThermalBridgeData = z.infer<typeof linearThermalBridgeDataZod>;

const pointThermalBridgeDataZod = named.extend({
	heatTransferCoefficient: z.number(),
});

export type PointThermalBridgeData = z.infer<typeof pointThermalBridgeDataZod>;

const _spaceCoolingSystemData = named;
const _spaceHeatControlSystemData = named;

const dwellingSpaceZoneParameterDataZod = z.object({
	livingZoneArea: z.number().min(0).max(10000),
	restOfDwellingArea: z.number().min(0).max(10000),
	groundFloorArea: z.number().min(0).max(10000),
	volume: z.number().min(0),
});

export type DwellingSpaceZoneParametersData = z.infer<typeof dwellingSpaceZoneParameterDataZod>;

const dwellingSpaceLightingDataZod = named.extend({
	numberOfBulbs: z.int().min(0),
	power: z.int().min(0),
	efficacy: z.int().min(0),
});

export type DwellingSpaceLightingData = z.infer<typeof dwellingSpaceLightingDataZod>;

const _spaceHeatingSystemDataZod = named;

export type SpaceHeatingSystemData = z.infer<typeof _spaceHeatingSystemDataZod>;

export type SpaceCoolingSystemData = z.infer<typeof _spaceCoolingSystemData>;

export type SpaceHeatControlSystemData = z.infer<typeof _spaceHeatControlSystemData>;

const pcdbProduct = namedWithId.extend({
	productReference: z.string().trim().min(1),
});

export type InfiltrationAndVentilation = AssertFormKeysArePageIds<{
	mechanicalVentilation: EcaasFormList<MechanicalVentilationData>;
	ductwork: EcaasFormList<DuctworkData>;
	vents: EcaasFormList<VentData>;
	naturalVentilation: EcaasForm<VentilationData>;
	airPermeability: EcaasForm<AirPermeabilityData>;
}>;

const baseMechanicalVentilationData = pcdbProduct.extend({
	airFlowRate: z.union([zodUnit("flow rate"), z.number()]),
});

const mechanicalVentilationDataZod = z.discriminatedUnion(
	"typeOfMechanicalVentilationOptions",
	[
		baseMechanicalVentilationData.extend({
			typeOfMechanicalVentilationOptions: zodLiteralFromUnionType<SchemaMechVentType, "Intermittent MEV">("Intermittent MEV"),
		}),
		baseMechanicalVentilationData.extend({
			typeOfMechanicalVentilationOptions: zodLiteralFromUnionType<SchemaMechVentType, "Centralised continuous MEV">("Centralised continuous MEV"),
		}),
		baseMechanicalVentilationData.extend({
			typeOfMechanicalVentilationOptions: zodLiteralFromUnionType<SchemaMechVentType, "Decentralised continuous MEV">("Decentralised continuous MEV"),
		}),
		baseMechanicalVentilationData.extend({
			typeOfMechanicalVentilationOptions: zodLiteralFromUnionType<SchemaMechVentType, "MVHR">("MVHR"),
			mvhrLocation: mvhrLocationZod,
			mvhrEfficiency: fraction,
			midHeightOfAirFlowPathForIntake: z.number(),
			orientationOfIntake: orientation,
			pitchOfIntake: z.number().min(0).max(180),
			midHeightOfAirFlowPathForExhaust: z.number(),
			orientationOfExhaust: orientation,
			pitchOfExhaust: z.number().min(0).max(180),
		}),
	],
);

export type MechanicalVentilationData = z.infer<typeof mechanicalVentilationDataZod>;

const ductworkDataZod = named.extend({
	mvhrUnit: z.string(),
	ductworkCrossSectionalShape: ductShapeZod,
	ductType: ductTypeZod,
	internalDiameterOfDuctwork: z.number().min(0).max(1000),
	externalDiameterOfDuctwork: z.number().min(0).max(1000),
	insulationThickness: z.number().min(0).max(100),
	lengthOfDuctwork: z.number().min(0),
	thermalInsulationConductivityOfDuctwork: z.number().min(0),
	surfaceReflectivity: z.boolean(),
});

export type DuctworkData = z.infer<typeof ductworkDataZod>;

const ventDataZod = z.object({
	name: z.string().trim().min(1),
	associatedItemId: z.guid(),
	effectiveVentilationArea: z.number().min(1).max(999999),
	openingRatio: z.number(),
	midHeightOfZone: z.number().min(1).max(60),
});

export type VentData = z.infer<typeof ventDataZod>;

const ventilationDataZod = z.object({
	ventilationZoneHeight: z.number().min(1).max(20),
	dwellingEnvelopeArea: z.number().min(5).max(72000),
	dwellingElevationalLevelAtBase: z.number().min(-150).max(750),
	crossVentilationPossible: z.boolean(),
	maxRequiredAirChangeRate: z.number(),
});

export type VentilationData = z.infer<typeof ventilationDataZod>;

const airPermeabilityDataZod = z.object({
	testPressure: testPressureZod,
	airTightnessTestResult: z.number(),
});

export type AirPermeabilityData = z.infer<typeof airPermeabilityDataZod>;


const heatingControlType = z.enum(["separateTemperatureControl", "separateTimeAndTemperatureControl"]);

const _generalSpaceHeatingDataZod = z.object({
	heatingControlType,
	coolingRequired: z.boolean(),
});

export type GeneralSpaceHeating = z.infer<typeof _generalSpaceHeatingDataZod>;

export type HeatGeneration = AssertFormKeysArePageIds<{
	heatPump: EcaasFormList<HeatPumpData>;
	boiler: EcaasForm<BoilerData[]>;
	heatBattery: EcaasForm<HeatBatteryData[]>;
	heatNetwork: EcaasForm<HeatNetworkData[]>;
	heatInterfaceUnit: EcaasForm<HeatInterfaceUnitData[]>;
}>;

const typeOfHeatPump = z.enum([
	"airSource",
	"groundSource",
	"waterSource",
	"booster",
	"hotWaterOnly",
	"exhaustAirMev",
	"exhaustAirMvhr",
	"exhaustAirMixed",
]);
const typeOfBoiler = z.enum(["combiBoiler", "regularBoiler"]);
const typeOfHeatNetwork = z.enum(["sleevedDistrictHeatNetwork", "unsleevedDistrictHeatNetwork", "communalHeatNetwork"]);
const typeOfHeatBattery = z.enum(["heatBatteryPcm", "heatBatteryDryCore"]);
const typeOflocationOfLoopPiping = z.enum(["outside", "heatedSpace", "unheatedSpace"]);
const _typeOfMechanicalVentilation = z.enum(["mvhr", "centralisedContinuousMev", "decentralisedContinuousMev"]);

const _heatPumpDataZod = namedWithId.extend({
	productReference: z.string().trim().min(1),
	typeOfHeatPump,
});

export type HeatPumpData = z.infer<typeof _heatPumpDataZod>;

const _boilerDataZod = namedWithId;

export type BoilerData = z.infer<typeof _boilerDataZod>;

const _heatBatteryDataZod = namedWithId;

export type HeatBatteryData = z.infer<typeof _heatBatteryDataZod>;

const _heatNetworkDataZod = namedWithId;

export type HeatNetworkData = z.infer<typeof _heatNetworkDataZod>;

const _heatInterfaceUnitDataZod = namedWithId;

export type HeatInterfaceUnitData = z.infer<typeof _heatInterfaceUnitDataZod>;

// export type HeatEmitting = AssertFormKeysArePageIds<{
// 	wetDistribution: EcaasFormList<WetDistributionData>;
// 	instantElectricHeater: EcaasFormList<InstantElectricStorageData>;
// 	electricStorageHeater: EcaasForm<ElectricStorageHeaterData[]>;
// 	warmAirHeatPump: EcaasForm<WarmAirHeatPumpData[]>;
// }>;

// const electricStorageHeaterDataZod = named;

// export type ElectricStorageHeaterData = z.infer<typeof electricStorageHeaterDataZod>;

// const instantElectricStorageDataZod = named.extend({
// 	ratedPower: z.number().min(0).max(70),
// 	convectiveType: convectiveTypeZod,
// });

// export type InstantElectricStorageData = z.infer<typeof instantElectricStorageDataZod>;

// const warmAirHeatPumpDataZod = named;

// export type WarmAirHeatPumpData = z.infer<typeof warmAirHeatPumpDataZod>;

// const baseWetDistributionData = named.extend({
// 	heatSource: z.string(),
// 	thermalMass: z.number(),
// 	designTempDiffAcrossEmitters: z.number(),
// 	designFlowTemp: z.number(),
// 	designFlowRate: z.number(),
// 	ecoDesignControllerClass: z.enum(["1", "2", "3", "4", "5", "6", "7", "8"]),
// 	minimumFlowTemp: z.number().min(20).max(120),
// 	minOutdoorTemp: z.number(),
// 	maxOutdoorTemp: z.number(),
// 	convectionFractionWet: fraction,
// });
// const wetDistributionDataZod = z.discriminatedUnion(
// 	"typeOfSpaceHeater",
// 	[
// 		baseWetDistributionData.extend({
// 			typeOfSpaceHeater: z.literal("radiator"),
// 			numberOfRadiators: z.int().min(1),
// 			exponent: z.number(),
// 			constant: z.number(),
// 		}),
// 		baseWetDistributionData.extend({
// 			typeOfSpaceHeater: z.literal("ufh"),
// 			emitterFloorArea: z.number(),
// 			equivalentThermalMass: z.number(),
// 			systemPerformanceFactor: z.number(),
// 		}),
// 	],
// );

//export type WetDistributionData = z.infer<typeof wetDistributionDataZod>;

export type SpaceHeatingNew = AssertEachKeyIsPageId<{
	heatSource: EcaasFormList<HeatSourceData>,
	heatEmitters: EcaasFormList<HeatEmittingData>
	heatingControls: EcaasFormList<HeatingControlData>
}>;

export type HeatPumpType = z.infer<typeof typeOfHeatPump>;
export type TypeOfBoiler = z.infer<typeof typeOfBoiler>;
export type TypeOfHeatBattery = z.infer<typeof typeOfHeatBattery>;
export type TypeOfHeatNetwork = z.infer<typeof typeOfHeatNetwork>;
export type LocationOfCollectorLoopPipingType = z.infer<typeof typeOflocationOfLoopPiping>;

export type HeatSourceType =
	"heatPump" |
	"boiler" |
	"heatNetwork" |
	"heatBattery" |
	"solarThermalSystem";

export type PcdbProduct = z.infer<typeof pcdbProduct>;

const heatPumpBase = pcdbProduct.extend({
	typeOfHeatSource: z.literal("heatPump"),
	typeOfHeatPump,
});

const boilerBase = pcdbProduct.extend({
	typeOfHeatSource: z.literal("boiler"),
	typeOfBoiler,
	locationOfBoiler: z.enum(["heatedSpace", "unheatedSpace"]),
	locationFromPcdb: z.optional(z.boolean()),
});
const heatBatteryBase = pcdbProduct.extend({
	typeOfHeatSource: z.literal("heatBattery"),
	typeOfHeatBattery,
	numberOfUnits: z.number(),
	energySupply: fuelTypeZod.optional(),
});

const solarThermalSystemBase = namedWithId.extend({
	typeOfHeatSource: z.literal("solarThermalSystem"),
	locationOfCollectorLoopPiping: typeOflocationOfLoopPiping,
	collectorModuleArea: z.number(),
	numberOfCollectorModules: z.number(),
	peakCollectorEfficiency: fraction,
	incidenceAngleModifier: fraction,
	firstOrderHeatLossCoefficient: z.number(),
	secondOrderHeatLossCoefficient: z.number(),
	heatLossCoefficientOfSolarLoopPipe: z.number(),
	collectorMassFlowRate: z.number(),
	powerOfCollectorPump: z.number(),
	powerOfCollectorPumpController: z.number(),
	pitch: z.number().min(0).max(90),
	orientation,
});

const heatNetworkBase = namedWithId.extend({
	typeOfHeatSource: z.literal("heatNetwork"),
	typeOfHeatNetwork,
});

const heatNetworkBaseShape = heatNetworkBase.shape;

function heatNetworkZodDataFromBase<
	T extends typeof heatNetworkBaseShape | typeof heatNetworkHotWaterSourceBaseShape,
>(baseShape: T) {
	return z.discriminatedUnion("isHeatNetworkInPcdb", [
		z.object({
			isHeatNetworkInPcdb: z.literal(true),
			productReference: z.string().trim().min(1),
			energySupply: fuelTypeZod.optional(),
			usesHeatInterfaceUnits: z.literal(true),
			heatInterfaceUnitProductReference: z.string().trim().min(1),
		}).extend(baseShape),
		z.object({
			isHeatNetworkInPcdb: z.literal(true),
			productReference: z.string().trim().min(1),
			energySupply: fuelTypeZod.optional(),
			usesHeatInterfaceUnits: z.literal(false),
		}).extend(baseShape),
		z.object({
			isHeatNetworkInPcdb: z.literal(false),
			emissionsFactor: z.number(),
			outOfScopeEmissionsFactor: z.number(),
			primaryEnergyFactor: z.number(),
			canEnergyBeExported: z.boolean(),
			usesHeatInterfaceUnits: z.literal(true),
			heatInterfaceUnitProductReference: z.string().trim().min(1),
		}).extend(baseShape),
		z.object({
			isHeatNetworkInPcdb: z.literal(false),
			emissionsFactor: z.number(),
			outOfScopeEmissionsFactor: z.number(),
			primaryEnergyFactor: z.number(),
			canEnergyBeExported: z.boolean(),
			usesHeatInterfaceUnits: z.literal(false),
		}).extend(baseShape),
	]);
}

const heatNetworkZodData = heatNetworkZodDataFromBase(heatNetworkBaseShape);

const heatSourceDataZod = z.discriminatedUnion("typeOfHeatSource", [
	heatPumpBase,
	boilerBase,
	heatBatteryBase,
	solarThermalSystemBase,
	heatNetworkZodData,
]);

const _typeOfHeatSource = z.enum({
	...typeOfHeatPump.enum,
	...typeOfBoiler.enum,
	...z.enum(["heatNetwork"]).enum,
	...typeOfHeatBattery.enum,
	...z.enum(["heatInterfaceUnit"]).enum,
});

export const typeOfHeatSource = _typeOfHeatSource.enum;

export type HeatSourceProductType = z.infer<typeof _typeOfHeatSource>;
export type HeatSourceData = z.infer<typeof heatSourceDataZod>;

const _typeOfWaterStorage = z.enum(["smartHotWaterTank"]);

export const typeOfWaterStorage = _typeOfWaterStorage.enum;

export type WaterStorageProductType = z.infer<typeof _typeOfWaterStorage>;

export const typeOfMechanicalVentilation = _typeOfMechanicalVentilation.enum;

export type MechanicalVentilationProductType = z.infer<typeof _typeOfMechanicalVentilation>;

export const productTypeMap = {
	"airSource": "AirSourceHeatPump",
	"groundSource": "GroundSourceHeatPump",
	"waterSource": "WaterSourceHeatPump",
	"booster": "BoosterHeatPump",
	"hotWaterOnly": "HotWaterOnlyHeatPump",
	"exhaustAirMev": "ExhaustAirMevHeatPump",
	"exhaustAirMvhr": "ExhaustAirMvhrHeatPump",
	"exhaustAirMixed": "ExhaustAirMixedHeatPump",
	"combiBoiler": "CombiBoiler",
	"regularBoiler": "RegularBoiler",
	"heatNetwork": "HeatNetworks",
	"heatBatteryPcm": "HeatBatteryPCM",
	"heatBatteryDryCore": "HeatBatteryDryCore",
	"fanCoil": "FanCoils",
	"electricStorageHeater": "StorageHeater",
	"smartHotWaterTank": "SmartHotWaterTank",
	"heatInterfaceUnit": "HeatInterfaceUnit",
	"mvhr": "CentralisedMvhr",
	"centralisedContinuousMev": "CentralisedMev",
	"decentralisedContinuousMev": "DecentralisedMev",
	"instantElectricHeater": "DirectElectricHeaters",
} as const satisfies Record<HeatSourceProductType | HeatEmittingProductType | WaterStorageProductType | MechanicalVentilationProductType, TechnologyType | string>;

export type HeatEmitterType =
	"radiator" |
	"underfloorHeating" |
	"fanCoil" |
	"instantElectricHeater" |
	"electricStorageHeater" |
	"warmAirHeater";

const _typeOfHeatEmitter = z.enum(["fanCoil", "electricStorageHeater", "instantElectricHeater"]);

export const typeOfHeatEmitter = _typeOfHeatEmitter.enum;

function withVariableFlowRate<
	T extends z.ZodRawShape & { hasVariableFlowRate?: never },
>(base: z.ZodObject<T>) {
	return z.discriminatedUnion("hasVariableFlowRate", [
		base.extend({
			hasVariableFlowRate: z.literal(true),
			minFlowRate: z.number(),
			maxFlowRate: z.number(),
		}),
		base.extend({
			hasVariableFlowRate: z.literal(false),
			designFlowRate: z.number(),
		}),
	]);
}

const radiatorBase = namedWithId.extend({
	typeOfHeatEmitter: z.literal("radiator"),
	productReference: z.string(),
	heatSource: z.string(),
	designFlowTemp: z.number(),
	designTempDiffAcrossEmitters: z.number(),
	numOfRadiators: z.number(),
});

export type EcoControlClassesWithExtraOptions = "2" | "3" | "6" | "7";
export const ecoClasses: EcoControlClassesWithExtraOptions[] = ["2", "3", "6", "7"];

// the monstrosity begins - I apologise (Jasper)

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

const radiatorSchema = z.discriminatedUnion("hasVariableFlowRate", [
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

// the monstrosity ends - I apologise again (Jasper)

const underfloorHeatingBase = namedWithId.extend({
	typeOfHeatEmitter: z.literal("underfloorHeating"),
	productReference: z.string(),
	heatSource: z.string(),
	designFlowTemp: z.number(),
	designTempDiffAcrossEmitters: z.number(),
	areaOfUnderfloorHeating: z.number(),
});
const eco2367UnderfloorHeating =
	makeEco2367Item(underfloorHeatingBase);

const eco1458UnderfloorHeating =
	makeEco1458Item(underfloorHeatingBase);


const variableEco2367UnderfloorHeating = withVariableFlowRate(eco2367UnderfloorHeating);
const variableEco1458UnderfloorHeating = withVariableFlowRate(eco1458UnderfloorHeating);

export const underFloorHeatingSchema = z.discriminatedUnion("hasVariableFlowRate", [
	z.discriminatedUnion(
		"ecoDesignControllerClass",
		[
			variableEco2367UnderfloorHeating,
		]),
	z.discriminatedUnion(
		"ecoDesignControllerClass",
		[variableEco1458UnderfloorHeating]),
]);

const fanCoilBase = namedWithId.extend({
	typeOfHeatEmitter: z.literal(typeOfHeatEmitter.fanCoil),
	productReference: z.string(),
	heatSource: z.string(),
	designFlowTemp: z.number(),
	designTempDiffAcrossEmitters: z.number(),
	numOfFanCoils: z.number(),
});

const eco2367FanCoil = makeEco2367Item(fanCoilBase);
const eco1458FanCoil = makeEco1458Item(fanCoilBase);

const variableEco2367FanCoil = withVariableFlowRate(eco2367FanCoil);
const variableEco1458FanCoil = withVariableFlowRate(eco1458FanCoil);

export const fanCoilSchema = z.discriminatedUnion(
	"hasVariableFlowRate",
	[
		z.discriminatedUnion(
			"ecoDesignControllerClass",
			[variableEco2367FanCoil],
		),
		z.discriminatedUnion(
			"ecoDesignControllerClass",
			[variableEco1458FanCoil],
		),
	],
);
const warmAirHeaterSchema = namedWithId.extend({
	typeOfHeatEmitter: z.literal("warmAirHeater"),
	designTempDiffAcrossEmitters: z.number(),
	heatSource: z.string(),
	convectionFraction: z.number(),
	numOfWarmAirHeaters: z.number(),
});

const instantElectricHeaterSchema = namedWithId.extend({
	typeOfHeatEmitter: z.literal("instantElectricHeater"),
	productReference: z.string(),
	convectionFractionForHeating: z.number(),
	ratedPower: z.number(),
	numOfHeaters: z.number(),
});

const electricStorageHeaterSchema = namedWithId.extend({
	typeOfHeatEmitter: z.literal(typeOfHeatEmitter.electricStorageHeater),
	productReference: z.string(),
	numOfStorageHeaters: z.number(),
});

const heatEmittingDataZod = z.discriminatedUnion("typeOfHeatEmitter", [
	radiatorSchema,
	underFloorHeatingSchema,
	fanCoilSchema,
	warmAirHeaterSchema,
	instantElectricHeaterSchema,
	electricStorageHeaterSchema,
]);

export type HeatEmittingProductType = z.infer<typeof _typeOfHeatEmitter>;
export type HeatEmittingData = z.infer<typeof heatEmittingDataZod>;

const heatingControlsDataZod = named.extend({
	heatingControlType,
});

export type HeatingControlData = z.infer<typeof heatingControlsDataZod>;

// NEW HOT WATER START =======================================================================

export type DomesticHotWater = AssertEachKeyIsPageId<{
	heatSources: EcaasFormList<DomesticHotWaterHeatSourceData>;
	waterStorage: EcaasFormList<WaterStorageData>;
	hotWaterOutlets: EcaasFormList<HotWaterOutletsData>;
	pipework: EcaasFormList<PipeworkData>;
}>;

const hotWaterHeatSourceExtension = {
	heatSourceId: z.literal("NEW_HEAT_SOURCE"),
	coldWaterSource: z.enum(["mainsWater", "headerTank"]),
	isExistingHeatSource: z.literal(false),
};

const baseImmersionHeater = namedWithId.extend({
	typeOfHeatSource: z.literal("immersionHeater"),
	power: z.number(),
});

export type ImmersionHeaterPosition = "top" | "middle" | "bottom";

const basePointOfUse = namedWithId.extend({
	typeOfHeatSource: z.literal("pointOfUse"),
	energySupply: fuelTypeZod.optional(),
	heaterEfficiency: z.number(),
});
export type DHWHeatSourceType = HeatSourceType | "immersionHeater" | "pointOfUse";


const heatPumpHotWaterSourceBase = heatPumpBase.extend(hotWaterHeatSourceExtension);
const boilerHotWaterSourceBase = boilerBase.extend(hotWaterHeatSourceExtension);
const heatBatteryHotWaterSourceBase = heatBatteryBase.extend(hotWaterHeatSourceExtension);
const solarThermalHotWaterSourceBase = solarThermalSystemBase.extend(hotWaterHeatSourceExtension);
const heatNetworkHotWaterSourceBase = heatNetworkBase.extend(hotWaterHeatSourceExtension);
const heatNetworkHotWaterSourceBaseShape = heatNetworkHotWaterSourceBase.shape;
const immersionHeaterHotWaterSourceBase = baseImmersionHeater.extend(hotWaterHeatSourceExtension);
const pointOfUseHotWaterSourceBase = basePointOfUse.extend(hotWaterHeatSourceExtension);


const newHotWaterHeatSourceDataZod = z.discriminatedUnion("typeOfHeatSource", [
	heatPumpHotWaterSourceBase,
	boilerHotWaterSourceBase,
	heatBatteryHotWaterSourceBase,
	solarThermalHotWaterSourceBase,
	heatNetworkZodDataFromBase(heatNetworkHotWaterSourceBaseShape),
	immersionHeaterHotWaterSourceBase,
	pointOfUseHotWaterSourceBase,
]);

const domesticHotWaterHeatSourceZod = z.discriminatedUnion("isExistingHeatSource",
	[
		z.object({
			id: z.uuidv4().readonly(),
			heatSourceId: z.string(),
			coldWaterSource: z.enum(["mainsWater", "headerTank"]),
			isExistingHeatSource: z.literal(true),
		}),
		newHotWaterHeatSourceDataZod,
	],
);

export type DomesticHotWaterHeatSourceData = z.infer<typeof domesticHotWaterHeatSourceZod>;

const hotWaterCylinderDataZod = namedWithId.extend({
	typeOfWaterStorage: z.literal("hotWaterCylinder"),
	storageCylinderVolume: z.union([zodUnit("volume"), z.number()]), // number will be deprecated, preserved for backwards compatibility with old input data files
	initialTemperature: z.number(),
	dailyEnergyLoss: z.number(),
	dhwHeatSourceId: z.string(),
	areaOfHeatExchanger: z.number(),
	heaterPosition: z.number().min(0).max(1),
	thermostatPosition: z.number().min(0).max(1),
});

export type HotWaterCylinderData = z.infer<typeof hotWaterCylinderDataZod>;

const smartHotWaterTankDataZod = namedWithId.extend({
	typeOfWaterStorage: z.literal("smartHotWaterTank"),
	productReference: z.string(),
	dhwHeatSourceId: z.string(),
	heaterPosition: z.number().min(0).max(1),
});

export type SmartHotWaterTankData = z.infer<typeof smartHotWaterTankDataZod>;

export type WaterStorageType = "hotWaterCylinder" | "smartHotWaterTank";

const waterStorageDataZod = z.discriminatedUnion("typeOfWaterStorage", [
	hotWaterCylinderDataZod,
	smartHotWaterTankDataZod,
]);

export type WaterStorageData = z.infer<typeof waterStorageDataZod>;

const wwhrsTypeZod = z.enum(["instantaneousSystemA", "instantaneousSystemB", "instantaneousSystemC"]);
export type WwhrsType = z.infer<typeof wwhrsTypeZod>;

const mixedShowerBaseZod = namedWithId.extend({
	typeOfHotWaterOutlet: z.literal("mixedShower"),
	flowRate: z.number().min(8).max(15),
	dhwHeatSourceId: z.uuidv4(),
});

const mixedShowerDataZod = z.discriminatedUnion("wwhrs", [
	mixedShowerBaseZod.extend({ wwhrs: z.literal(false) }),
	mixedShowerBaseZod.extend({
		wwhrs: z.literal(true),
		wwhrsType: wwhrsTypeZod,
		wwhrsProductReference: z.string().optional(),
	}),
]);

export type MixedShowerData = z.infer<typeof mixedShowerDataZod>;

const electricShowerBaseZod = namedWithId.extend({
	typeOfHotWaterOutlet: z.literal("electricShower"),
	ratedPower: z.number().min(0).max(30),
});

const electricShowerDataZod = z.discriminatedUnion("wwhrs", [
	electricShowerBaseZod.extend({ wwhrs: z.literal(false) }),
	electricShowerBaseZod.extend({
		wwhrs: z.literal(true),
		wwhrsType: wwhrsTypeZod,
		wwhrsProductReference: z.string().optional(),
	}),
]);

export type ElectricShowerData = z.infer<typeof electricShowerDataZod>;

const bathDataZod = namedWithId.extend({
	typeOfHotWaterOutlet: z.literal("bath"),
	size: z.number().min(0).max(500),
});

export type BathData = z.infer<typeof bathDataZod>;

const otherHotWaterOutletDataZod = namedWithId.extend({
	typeOfHotWaterOutlet: z.literal("otherHotWaterOutlet"),
	flowRate: z.number().min(0).max(15),
});

export type OtherHotWaterOutletData = z.infer<typeof otherHotWaterOutletDataZod>;

const hotWaterOutletsDataZod = z.discriminatedUnion("typeOfHotWaterOutlet", [
	mixedShowerDataZod,
	electricShowerDataZod,
	bathDataZod,
	otherHotWaterOutletDataZod,
]);

export type HotWaterOutletsData = z.infer<typeof hotWaterOutletsDataZod>;

export type HotWaterOutletType =
	"mixedShower" |
	"electricShower" |
	"bath" |
	"otherHotWaterOutlet";

const pipeworkDataZod = z.object({
	name: z.string().trim().min(1),
	internalDiameter: z.number(),
	externalDiameter: z.number(),
	length: z.number().min(0).max(200),
	insulationThickness: z.number(),
	thermalConductivity: z.number(),
	surfaceReflectivity: z.boolean(),
	waterStorage: z.string(),
	pipeContents: waterPipeContentsTypeZod,
	location: z.enum(["heatedSpace", "unheatedSpace"]),
});

export type PipeworkData = z.infer<typeof pipeworkDataZod>;

// NEW HOT WATER END   =======================================================================

export type PvAndBatteries = AssertFormKeysArePageIds<{
	pvArrays: EcaasFormList<PvArrayData>;
	electricBattery: EcaasFormList<ElectricBatteryData>;
	diverters: EcaasFormList<PvDiverterData>;
}>;

const pvArrayDataZod = z.object({
	name: z.string().trim().min(1),
	peakPower: z.number().min(0.001).max(100),
	ventilationStrategy: photovoltaicVentilationStrategyZod,
	pitch: z.number().min(0).max(90),
	orientation,
	elevationalHeight: z.number().min(0).max(500),
	lengthOfPV: z.number().min(0).max(100),
	widthOfPV: z.number().min(0).max(100),
	inverterPeakPowerAC: z.number(),
	inverterPeakPowerDC: z.number(),
	locationOfInverter: z.enum(["heated_space", "unheated_space"]),
	inverterType: inverterTypeZod,
	canExportToGrid: z.boolean(),
	electricityPriority: z.enum(["diverter", "electricBattery"]),
	hasShading: z.boolean(),
});
const obstacleShadingDataZod = named.extend({
	typeOfShading: z.literal("obstacle"),
	height: z.number(),
	distance: z.number(),
	transparency: z.number(),
});
const otherShadingDataZod = named.extend({
	typeOfShading: z.enum(["left_side_fin", "right_side_fin", "overhang", "frame_or_reveal"]),
	distance: z.number(),
	depth: z.number(),
});
const shadingObjectDataZod = z.discriminatedUnion("typeOfShading", [
	obstacleShadingDataZod,
	otherShadingDataZod,
]);
const pvArrayShadingDataZod = z.discriminatedUnion("hasShading", [
	pvArrayDataZod.extend({
		hasShading: z.literal(false),
	}),
	pvArrayDataZod.extend({
		hasShading: z.literal(true),
		shading: z.array(shadingObjectDataZod),
	}),
]);


export type PvArrayData = z.infer<typeof pvArrayShadingDataZod>;

export type PvShadingData = z.infer<typeof shadingObjectDataZod>;

const electricBatteryDataZod = z.object({
	name: z.string().trim().min(1),
	capacity: z.number().min(0).max(50),
	chargeEfficiency: fraction,
	location: batteryLocationZod,
	maximumChargeRate: z.number(),
	minimumChargeRate: z.number(),
	maximumDischargeRate: z.number(),
}).refine((val) => val.maximumChargeRate >= val.minimumChargeRate, { error: "Maximum charge rate should be greater or equal to minimum charge rate.", abort: true });

export type ElectricBatteryData = z.infer<typeof electricBatteryDataZod>;

const pvDiverterDataZod = z.object({
	name: z.string().trim().min(1),
	hotWaterCylinder: z.optional(z.string()),
});

export type PvDiverterData = z.infer<typeof pvDiverterDataZod>;

export type Cooling = {
	airConditioning: EcaasFormList<AirConditioningData>;
};

const airConditioningDataZod = z.object({
	name: z.string().trim().min(1),
	coolingCapacity: z.number(),
	seasonalEnergyEfficiencyRatio: z.number().min(0).max(25),
	convectionFraction: fraction,
});

export type AirConditioningData = z.infer<typeof airConditioningDataZod>;

export type UsesPitchComponent = {
	pitch?: number;
	pitchOption?: PitchOption;
};
export type SpaceHeating = AssertEachKeyIsPageId<{
	heatSource: EcaasFormList<HeatSourceData>,
	heatEmitters: EcaasFormList<HeatEmittingData>
	heatingControls: EcaasFormList<HeatingControlData>
}>;

export type ComplianceResult = TaggedUnion<"resultType", {
	ok: {
		response: SchemaFhsComplianceResponse,
	},
	err: {
		errors: CorrectedJsonApiError[],
	}
}>;

export type CorrectedJsonApiError = {
	id?: string;
	links?: SchemaJsonApiOnePointOneErrorLinks;
	status?: string;
	code?: string;
	title?: string;
	detail?: string;
	source?: SchemaJsonApiOnePointOneErrorSource;
	meta?: SchemaJsonApiOnePointOneMeta;
};

export interface AssociatedItemValues {
	id: string;
	pitch?: number;
	orientation?: number;
}

// type that enforces that all keys of wrapped type correspond to a page ID
type AssertEachKeyIsPageId<T> = { [P in keyof T]: P extends PageId ? T[P] : never };

// type that enforces that all the keys that have forms correspond to a page ID
type AssertFormKeysArePageIds<T> = { [P in keyof T]: T[P] extends EcaasForm<unknown> ? (P extends PageId ? T[P] : never) : T[P] };

// a type representing the set of paths in EcaasState down to instances of EcaasForm
type IsEcaasForm<T> = T extends EcaasForm<unknown> ? true : false;

type Join<K, P> = K extends string | number
	? P extends string | number
		? `${K}/${P}`
		: never
	: never;

type EcaasFormPaths<T> = {
	[K in keyof T]:
	IsEcaasForm<T[K]> extends true
		? K
		: T[K] extends object
			? Join<K, EcaasFormPaths<T[K]>>
			: never
}[keyof T];

export type EcaasFormPath = Exclude<EcaasFormPaths<EcaasState>, undefined>;

// a map of paths through the EcaasState type down to forms, to the schemas used to validate them
// typing will enforce that each form has a corresponding Zod schema
export const formSchemas: Record<EcaasFormPath, z.ZodType> = {
	"dwellingDetails/generalSpecifications": generalDetailsDataZod,
	"dwellingDetails/externalFactors": externalFactorsDataZod,
	"dwellingDetails/shading": shadingDataZod,
	"dwellingDetails/appliances": appliancesDataZod,

	"domesticHotWater/waterStorage": waterStorageDataZod,
	"domesticHotWater/heatSources": domesticHotWaterHeatSourceZod,
	"domesticHotWater/hotWaterOutlets": hotWaterOutletsDataZod,
	"domesticHotWater/pipework": pipeworkDataZod,

	"dwellingFabric/dwellingSpaceZoneParameters": dwellingSpaceZoneParameterDataZod,
	"dwellingFabric/dwellingSpaceFloors/dwellingSpaceExposedFloor": exposedFloorDataZod,
	"dwellingFabric/dwellingSpaceFloors/dwellingSpaceGroundFloor": groundFloorDataZod,
	"dwellingFabric/dwellingSpaceFloors/dwellingSpaceInternalFloor": internalFloorDataZod,
	"dwellingFabric/dwellingSpaceFloors/dwellingSpaceFloorAboveUnheatedBasement": floorAboveUnheatedBasementDataZod,
	"dwellingFabric/dwellingSpaceFloors/dwellingSpaceFloorOfHeatedBasement": floorOfHeatedBasementDataZod,
	"dwellingFabric/dwellingSpaceWalls/dwellingSpaceExternalWall": externalWallDataZod,
	"dwellingFabric/dwellingSpaceWalls/dwellingSpaceInternalWall": internalWallDataZod,
	"dwellingFabric/dwellingSpaceWalls/dwellingSpaceWallToUnheatedSpace": wallsToUnheatedSpaceDataZod,
	"dwellingFabric/dwellingSpaceWalls/dwellingSpacePartyWall": partyWallDataZod,
	"dwellingFabric/dwellingSpaceWalls/dwellingSpaceWallOfHeatedBasement": wallOfHeatedBasementDataZod,
	"dwellingFabric/dwellingSpaceCeilingsAndRoofs/dwellingSpaceCeilings": ceilingDataZod,
	"dwellingFabric/dwellingSpaceCeilingsAndRoofs/dwellingSpaceRoofs": roofDataZod,
	"dwellingFabric/dwellingSpaceDoors/dwellingSpaceExternalGlazedDoor": externalGlazedDoorData,
	"dwellingFabric/dwellingSpaceDoors/dwellingSpaceExternalUnglazedDoor": externalUnglazedDoorDataZod,
	"dwellingFabric/dwellingSpaceDoors/dwellingSpaceInternalDoor": internalDoorDataZod,
	"dwellingFabric/dwellingSpaceWindows": windowDataZod,
	"dwellingFabric/dwellingSpaceThermalBridging/dwellingSpaceLinearThermalBridges": linearThermalBridgeDataZod,
	"dwellingFabric/dwellingSpaceThermalBridging/dwellingSpacePointThermalBridges": pointThermalBridgeDataZod,
	"dwellingFabric/dwellingSpaceLighting": dwellingSpaceLightingDataZod,
	"infiltrationAndVentilation/mechanicalVentilation": mechanicalVentilationDataZod,
	"infiltrationAndVentilation/ductwork": ductworkDataZod,
	"infiltrationAndVentilation/vents": ventDataZod,
	"infiltrationAndVentilation/naturalVentilation": ventilationDataZod,
	"infiltrationAndVentilation/airPermeability": airPermeabilityDataZod,
	"spaceHeating/heatSource": heatSourceDataZod,
	"spaceHeating/heatEmitters": heatEmittingDataZod,
	"spaceHeating/heatingControls": heatingControlsDataZod,
	"cooling/airConditioning": airConditioningDataZod,
	"pvAndBatteries/pvArrays": pvArrayShadingDataZod,
	"pvAndBatteries/electricBattery": electricBatteryDataZod,
	"pvAndBatteries/diverters": pvDiverterDataZod,
};