import { standardPitchOption } from "./../utils/pitchOptions";
import type { TaggedUnion } from "type-fest";
import type { PageId } from "~/data/pages/pages";
import type { SchemaFhsComplianceResponse, SchemaJsonApiOnePointOneErrorLinks, SchemaJsonApiOnePointOneErrorSource, SchemaJsonApiOnePointOneMeta } from "~/schema/api-schema.types";
import type { FloorType, SchemaMechVentType, MassDistributionClass } from "~/schema/aliases";
import * as z from "zod";
import { zeroPitchOption } from "~/utils/pitchOptions";
import { zodUnit } from "~/utils/units/zod";
import { arealHeatCapacityZod, batteryLocationZod, boilerLocationZod, colourZod, ductShapeZod, inverterTypeZod, massDistributionClassZod, mvhrLocationZod, partyWallCavityTypeZod, partyWallLiningTypeZod, photovoltaicVentilationStrategyZod, shadingObjectTypeZod, terrainClassZod, testPressureZod, ventilationShieldClassZod, waterPipeContentsTypeZod, windowTreatmentTypeZod, windShieldLocationZod, zodLiteralFromUnionType } from "./zod";
import type { TechnologyType } from "~/pcdb/pcdb.types";

export const fraction = z.number().min(0).max(1);
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
const thermalResistance = z.number().min(0.00001).max(50);

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
	storeysInDwelling: z.int().min(1),
	buildingLength: z.number().min(0),
	buildingWidth: z.number().min(0),
	numOfBedrooms: z.int().min(0),
	numOfUtilityRooms: z.int().min(0),
	numOfBathrooms: z.int().min(0),
	numOfWCs: z.int().min(0),
	numOfHabitableRooms: z.int().min(1),
	numOfRoomsWithTappingPoints: z.int().min(1),
	numOfWetRooms: z.int().min(0),
	fuelType: z.array(fuelTypeZod),
	canExportToGrid: z.enum(["yes", "no_export", "no_generation"]),
	isPartGCompliant: z.boolean(),
	partOActiveCoolingRequired: z.boolean(),
});

export const storeyOfFlatZod = z.int().min(-50).max(199);

const generalDetailsDataZod = z.discriminatedUnion("typeOfDwelling", [
	baseGeneralDetails.extend({
		typeOfDwelling: z.literal("flat"),
		storeyOfFlat: storeyOfFlatZod,
		storeysInBuilding: z.int().min(1),
	}),
	baseGeneralDetails.extend({ typeOfDwelling: z.literal("house") }),
]);

export type GeneralDetailsData = z.infer<typeof generalDetailsDataZod>;

export const heightShadingZod = z.number().gt(0).max(400);
export const distanceShadingZod = z.number().gt(0).max(72000);

const shadingDataZod = named.extend({
	startAngle: z.number().min(0).max(360),
	endAngle: z.number().min(0).max(360),
	objectType: shadingObjectTypeZod,
	height: heightShadingZod,
	distance: distanceShadingZod,
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
	applianceType: z.array(applianceTypeZod),
	kitchenExtractorHoodExternal: z.boolean(),
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

export const surfaceAreaAdjacentSpaceZod = z.number().min(0.01).max(10000);

const baseInternalFloorData = named.extend({
	surfaceAreaOfElement: surfaceAreaAdjacentSpaceZod,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	uValue,
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

export const surfaceAreaOpaqueZod = z.number().min(0.01).max(10000);
export const heightOpaqueZod = z.number().min(0.001).max(50);
export const widthOpaqueZod = z.number().min(0.001).max(100);
export const baseHeightOpaqueZod = z.number().min(0).max(500);

export const exposedFloorDataZod = named.extend({
	pitch: z.number().min(0).max(180),
	length: heightOpaqueZod,
	width: widthOpaqueZod,
	elevationalHeight: baseHeightOpaqueZod,
	surfaceArea: surfaceAreaOpaqueZod,
	uValue,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
});

export type ExposedFloorData = z.infer<typeof exposedFloorDataZod>;

export const groundSurfaceAreaZod = z.number().min(5).max(10000);
export const groundTotalAreaZod = z.number().min(5);
export const groundPerimeterZod = z.number().min(0).max(1000);

export const thicknessOfWallsZod = z.number().min(0).max(100);

const baseGroundFloorData = named.extend({
	surfaceArea: groundSurfaceAreaZod,
	totalArea: groundTotalAreaZod,
	uValue,
	thermalResistance,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	perimeter: groundPerimeterZod,
	psiOfWallJunction: z.number().min(0).max(2),
	thicknessOfWalls: thicknessOfWallsZod,
});

const slabEdgeInsulationBase = baseGroundFloorData.extend({
	typeOfGroundFloor: zodLiteralFromUnionType<FloorType, "Slab_edge_insulation">("Slab_edge_insulation"),
});

const horizontalEdgeInsulation = z.object({
	edgeInsulationType: z.tuple([z.literal("horizontal")]),
	// TODO constraints have not been put on zodUnit yet!
	horizontalEdgeInsulationWidth: zodUnit("length"),
	horizontalEdgeInsulationThermalResistance: z.number(),
});

const verticalEdgeInsulation = z.object({
	edgeInsulationType: z.tuple([z.literal("vertical")]),
	// TODO constraints have not been put on zodUnit yet!
	verticalEdgeInsulationDepth: zodUnit("length"),
	verticalEdgeInsulationThermalResistance: z.number(),
});

const horizontalAndVerticalEdgeInsulation = z.object({
	edgeInsulationType: z.union([z.tuple([z.literal("horizontal"), z.literal("vertical")]), z.tuple([z.literal("vertical"), z.literal("horizontal")])]),
	// TODO constraints have not been put on zodUnit yet!
	horizontalEdgeInsulationWidth: zodUnit("length"),
	horizontalEdgeInsulationThermalResistance: z.number(),
	verticalEdgeInsulationDepth: zodUnit("length"),
	verticalEdgeInsulationThermalResistance: z.number(),
});

export const heightUpperSurfaceZod = z.number().min(0).max(100);

const groundFloorDataZod = z.union(
	[
		slabEdgeInsulationBase.extend(horizontalEdgeInsulation.shape),
		slabEdgeInsulationBase.extend(verticalEdgeInsulation.shape),
		slabEdgeInsulationBase.extend(horizontalAndVerticalEdgeInsulation.shape),
		baseGroundFloorData.extend({
			typeOfGroundFloor: zodLiteralFromUnionType<FloorType, "Slab_no_edge_insulation">("Slab_no_edge_insulation"),
		}),
		baseGroundFloorData.extend({
			typeOfGroundFloor: zodLiteralFromUnionType<FloorType, "Suspended_floor">("Suspended_floor"),
			heightOfFloorUpperSurface: heightUpperSurfaceZod,
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
	surfaceArea: groundSurfaceAreaZod,
	totalArea: groundTotalAreaZod,
	uValue,
	thermalResistance,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	perimeter: groundPerimeterZod,
	psiOfWallJunction: z.number().min(0).max(2),
	thicknessOfWalls: thicknessOfWallsZod,
	depthOfBasementFloor: z.number(),
	heightOfBasementWalls: z.number(),
	thermalResistanceOfBasementWalls: z.number(),
	thermalTransmittanceOfBasementWalls: z.number(),
	thermalTransmittanceOfFoundations: z.number(),
});

export type FloorAboveUnheatedBasementData = z.infer<typeof floorAboveUnheatedBasementDataZod>;

const floorOfHeatedBasementDataZod = namedWithId.extend({
	netSurfaceArea: groundSurfaceAreaZod,
	totalArea: groundTotalAreaZod,
	uValue,
	thermalResistance,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	depthOfBasementFloor: z.number(),
	psiOfWallJunction: z.number().min(0).max(2),
	thicknessOfWalls: thicknessOfWallsZod,
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
	pitch: z.optional(z.number().min(0).max(180)),
	orientation,
	height: heightOpaqueZod,
	length: widthOpaqueZod,
	elevationalHeight: baseHeightOpaqueZod,
	surfaceArea: surfaceAreaOpaqueZod,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	colour: colourZod,
	uValue,
});

export type ExternalWallData = z.infer<typeof externalWallDataZod>;

const internalWallDataZod = namedWithId.extend({
	surfaceAreaOfElement: surfaceAreaAdjacentSpaceZod,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).max(180)),
	uValue,
});

export type InternalWallData = z.infer<typeof internalWallDataZod>;

const wallsToUnheatedSpaceDataZod = namedWithId.extend({
	surfaceAreaOfElement: surfaceAreaAdjacentSpaceZod,
	uValue,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).max(180)),
	thermalResistanceOfAdjacentUnheatedSpace,
});

export type WallsToUnheatedSpaceData = z.infer<typeof wallsToUnheatedSpaceDataZod>;

export const thermalResistanceCavityZod = z.optional(z.number().gt(0));

export const surfaceAreaPartyWallZod = z.number().gt(0);

const partyWallDataZod = namedWithId.extend({
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(60).max(120)),
	surfaceArea: surfaceAreaPartyWallZod,
	arealHeatCapacity: arealHeatCapacityZod,
	uValue,
	massDistributionClass,
	partyWallCavityType: partyWallCavityTypeZod,
	partyWallLiningType: z.optional(partyWallLiningTypeZod),
	thermalResistanceCavity: thermalResistanceCavityZod,
});

export type PartyWallData = z.infer<typeof partyWallDataZod>;

const wallOfHeatedBasementDataZod = namedWithId.extend({
	netSurfaceArea: z.number().min(0.01).max(10000),
	uValue,
	thermalResistance,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	perimeter: groundPerimeterZod,
	associatedBasementFloorId: z.uuidv4(),
});

export type WallOfHeatedBasementData = z.infer<typeof wallOfHeatedBasementDataZod>;

export type CeilingsAndRoofsData = AssertFormKeysArePageIds<{
	dwellingSpaceCeilings: EcaasFormList<CeilingData>;
	dwellingSpaceRoofs: EcaasFormList<RoofData>;
}>;

const baseCeilingData = namedWithId.extend({
	surfaceArea: surfaceAreaAdjacentSpaceZod,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	pitchOption: zeroPitchOption,
	pitch: z.optional(z.number().min(0).max(180)),
	uValue,
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
		}),
	],
);

export type CeilingData = z.infer<typeof ceilingDataZod>;

const roofType = z.enum(["flatAboveHeatedSpace", "flatAboveUnheatedSpace", "pitchedInsulatedAtRoof", "pitchedInsulatedAtCeiling", "unheatedPitched"]);

export type RoofType = z.infer<typeof roofType>;

const roofDataBaseZod = namedWithId.extend({
	typeOfRoof: roofType,
	pitchOption: z.optional(zeroPitchOption),
	pitch: z.number().min(0).max(180),
	orientation: z.optional(orientation),
	length: heightOpaqueZod,
	width: widthOpaqueZod,
	elevationalHeightOfElement: baseHeightOpaqueZod,
	surfaceArea: surfaceAreaOpaqueZod,
	colour: colourZod,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
});

const roofDataZod = z.discriminatedUnion("typeOfRoof", [
	roofDataBaseZod.extend({
		typeOfRoof: z.enum(["unheatedPitched"]),
		uValue,
	}),
	roofDataBaseZod.extend({
		typeOfRoof: z.enum(["pitchedInsulatedAtRoof", "pitchedInsulatedAtCeiling", "flatAboveHeatedSpace", "flatAboveUnheatedSpace"]),
		uValue,
	})]);

export type RoofData = z.infer<typeof roofDataZod>;

export type DoorsData = AssertFormKeysArePageIds<{
	dwellingSpaceExternalUnglazedDoor: EcaasFormList<ExternalUnglazedDoorData>;
	dwellingSpaceExternalGlazedDoor: EcaasFormList<ExternalGlazedDoorData>;
	dwellingSpaceInternalDoor: EcaasFormList<InternalDoorData>;
}>;

const externalUnglazedDoorDataZod = named.extend({
	isTheFrontDoor: z.boolean().optional(),
	associatedItemId: z.guid().optional(),
	pitchOption: standardPitchOption.optional(),
	pitch: z.number().min(0).max(180).optional(),
	orientation: z.number().min(0).lt(360).optional(),
	height: heightOpaqueZod,
	width: widthOpaqueZod,
	elevationalHeight: baseHeightOpaqueZod,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	colour: colourZod,
	uValue,
});

export type ExternalUnglazedDoorData = z.infer<typeof externalUnglazedDoorDataZod>;

export const heightTransparentZod = z.number().min(0.001).max(50);
export const widthTransparentZod = z.number().min(0.001).max(100);
export const baseHeightTransparentZod = z.number().min(0).max(500);
export const gValueZod = fraction;
export const maxWindowOpenAreaZod = z.number().min(0).max(100);
export const freeAreaHeightZod = z.number().min(0).max(100);
export const midHeightAirFlowPathZod = z.number().min(0).max(100);

const baseExternalGlazedDoorDataZod = named.extend({
	isTheFrontDoor: z.boolean().optional(),
	associatedItemId: z.guid().optional(),
	pitchOption: standardPitchOption.optional(),
	pitch: z.number().min(0).max(180).optional(),
	orientation: z.number().min(0).lt(360).optional(),
	height: heightTransparentZod,
	width: widthTransparentZod,
	uValue,
	securityRisk: z.boolean(),
	solarTransmittance: gValueZod,
	elevationalHeight: baseHeightTransparentZod,
	openingToFrameRatio: fraction,
	maximumOpenableArea: maxWindowOpenAreaZod,
	heightOpenableArea: freeAreaHeightZod,
});

const openablePartsFields = {
	discriminator: "numberOpenableParts",
	variants: [
		z.object({
			numberOpenableParts: z.literal("0"),
		}),
		z.object({
			numberOpenableParts: z.literal("1"),
			maximumOpenableArea: maxWindowOpenAreaZod,
			midHeightOpenablePart1: midHeightAirFlowPathZod,
		}),
		z.object({
			numberOpenableParts: z.literal("2"),
			maximumOpenableArea: maxWindowOpenAreaZod,
			midHeightOpenablePart1: midHeightAirFlowPathZod,
			midHeightOpenablePart2: midHeightAirFlowPathZod,
		}),
		z.object({
			numberOpenableParts: z.literal("3"),
			maximumOpenableArea: maxWindowOpenAreaZod,
			midHeightOpenablePart1: midHeightAirFlowPathZod,
			midHeightOpenablePart2: midHeightAirFlowPathZod,
			midHeightOpenablePart3: midHeightAirFlowPathZod,
		}),
		z.object({
			numberOpenableParts: z.literal("4"),
			maximumOpenableArea: maxWindowOpenAreaZod,
			midHeightOpenablePart1: midHeightAirFlowPathZod,
			midHeightOpenablePart2: midHeightAirFlowPathZod,
			midHeightOpenablePart3: midHeightAirFlowPathZod,
			midHeightOpenablePart4: midHeightAirFlowPathZod,
		}),
	] satisfies Tuple,
};

export const deltaRZod = z.number().gt(0).max(100);

const curtainsOrBlindsFields = {
	discriminator: "curtainsOrBlinds",
	variants: [
		z.object({
			curtainsOrBlinds: z.literal(true),
			treatmentType: windowTreatmentTypeZod,
			thermalResistivityIncrease: deltaRZod,
			solarTransmittanceReduction: fraction,
			treatmentControls: z.enum(["auto_motorised", "manual"]),
		}),
		z.object({
			curtainsOrBlinds: z.literal(false),
		}),
	] satisfies Tuple,
};

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

export type ShadingObjectData = z.infer<typeof shadingObjectDataZod>;

const shadingDataFields = {
	discriminator: "hasShading",
	variants: [
		z.object({
			hasShading: z.literal(false),
		}),
		z.object({
			hasShading: z.literal(true),
			shading: z.array(shadingObjectDataZod),
		}),
	] satisfies Tuple,
};

const externalGlazedDoorData = nestedDiscriminatedUnion(
	baseExternalGlazedDoorDataZod,
	openablePartsFields,
	curtainsOrBlindsFields,
	shadingDataFields,
);

export type ExternalGlazedDoorData = z.infer<typeof externalGlazedDoorData>;

const baseInternalDoorData = named.extend({
	associatedItemId: z.guid(),
	surfaceArea: surfaceAreaAdjacentSpaceZod,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
});

const typeOfInternalDoorFields = {
	discriminator: "typeOfInternalDoor",
	variants: [
		z.object({
			typeOfInternalDoor: z.literal("heatedSpace"),
			uValue,
		}),
		z.object({
			typeOfInternalDoor: z.literal("unheatedSpace"),
			uValue,
			thermalResistanceOfAdjacentUnheatedSpace,
		}),
	] satisfies Tuple,
};

const isTheFrontDoorFields = {
	discriminator: "isTheFrontDoor",
	variants: [
		z.object({
			isTheFrontDoor: z.literal(false).optional(),
		}),
		z.object({
			isTheFrontDoor: z.literal(true).optional(),
			orientation: z.number().min(0).lt(360).optional(),
		}),
	] satisfies Tuple,
};

const internalDoorDataZod = nestedDiscriminatedUnion(
	baseInternalDoorData,
	typeOfInternalDoorFields,
	isTheFrontDoorFields,
);

export type InternalDoorData = z.infer<typeof internalDoorDataZod>;

const baseWindowData = namedWithId.extend({
	taggedItem: z.guid().optional(),
	pitch: z.number().min(0).max(180).optional(),
	orientation: z.number().min(0).lt(360).optional(),
	height: heightTransparentZod,
	width: widthTransparentZod,
	uValue,
	securityRisk: z.boolean(),
	solarTransmittance: gValueZod,
	elevationalHeight: baseHeightTransparentZod,
	openingToFrameRatio: fraction,
});

export const windowDataZod = nestedDiscriminatedUnion(
	baseWindowData,
	openablePartsFields,
	curtainsOrBlindsFields,
	shadingDataFields,
);

export type WindowData = z.infer<typeof windowDataZod>;

export type ThermalBridgingData = AssertFormKeysArePageIds<{
	dwellingSpaceLinearThermalBridges: EcaasFormList<LinearThermalBridgeData>;
	dwellingSpacePointThermalBridges: EcaasFormList<PointThermalBridgeData>;
}>;

export const lengthThermalBridgeLinearZod = z.number().min(0).max(10000);

const linearThermalBridgeDataZod = named.extend({
	typeOfThermalBridge: thermalBridgeJunctionTypeZod,
	linearThermalTransmittance: z.number(),
	length: lengthThermalBridgeLinearZod,
});

export type LinearThermalBridgeData = z.infer<typeof linearThermalBridgeDataZod>;

const pointThermalBridgeDataZod = named.extend({
	heatTransferCoefficient: z.number().min(0).max(2),
});

export type PointThermalBridgeData = z.infer<typeof pointThermalBridgeDataZod>;

const _spaceCoolingSystemData = named;
const _spaceHeatControlSystemData = named;

export const dwellingPartAreaZod = z.number().min(0).max(10000);
export const dwellingGroundFloorAreaZod = z.number().min(0);
export const zoneVolumeZod = z.number().min(0).max(50000);

const dwellingSpaceZoneParameterDataZod = z.object({
	livingZoneArea: dwellingPartAreaZod,
	restOfDwellingArea: dwellingPartAreaZod,
	groundFloorArea: dwellingGroundFloorAreaZod,
	volume: zoneVolumeZod,
});

export type DwellingSpaceZoneParametersData = z.infer<typeof dwellingSpaceZoneParameterDataZod>;

const dwellingSpaceLightingDataZod = named.extend({
	numberOfBulbs: z.int().min(0),
	power: z.number().min(0),
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

const pcdbPackagedProduct = pcdbProduct.extend({
	packageProductId: z.optional(z.string()),
});

const hasPcdbPackagedProduct = pcdbProduct.extend({
	packagedProductReference: z.optional(z.string()),
});

export type InfiltrationAndVentilation = AssertFormKeysArePageIds<{
	mechanicalVentilation: EcaasFormList<MechanicalVentilationData>;
	ductwork: EcaasFormList<DuctworkData>;
	vents: EcaasFormList<VentData>;
	naturalVentilation: EcaasForm<VentilationData>;
	airPermeability: EcaasForm<AirPermeabilityData>;
}>;

const baseMechanicalVentilationData = namedWithId.extend({
	airFlowRate: zodUnit("flow rate"),
	associatedItemId: z.string().trim().min(1),
});

const baseMvhrData = baseMechanicalVentilationData.extend(hasPcdbPackagedProduct.shape).extend({
	productReference: z.string().trim().min(1),
	typeOfMechanicalVentilationOptions: zodLiteralFromUnionType<SchemaMechVentType, "MVHR">("MVHR"),
	installedUnderApprovedScheme: z.boolean(),
	measuredFanPowerAndAirFlowRateKnown: z.boolean(),
	mvhrLocation: mvhrLocationZod,
	midHeightOfAirFlowPathForIntake: z.number(),
	orientationOfIntake: orientation,
	pitchOfIntake: z.number().min(0).max(180),
	midHeightOfAirFlowPathForExhaust: z.number(),
	orientationOfExhaust: orientation,
	pitchOfExhaust: z.number().min(0).max(180),
});

const intermittentMevData = baseMechanicalVentilationData.extend({
	typeOfMechanicalVentilationOptions: zodLiteralFromUnionType<SchemaMechVentType, "Intermittent MEV">("Intermittent MEV"),
	specificFanPower: z.number(),
	midHeightOfAirFlowPath: z.number(),
});

const baseCentralisedContinuousMevData = baseMechanicalVentilationData.extend(hasPcdbPackagedProduct.shape).extend({
	productReference: z.string().trim().min(1),
	typeOfMechanicalVentilationOptions: zodLiteralFromUnionType<SchemaMechVentType, "Centralised continuous MEV">("Centralised continuous MEV"),
	installedUnderApprovedScheme: z.boolean(),
	measuredFanPowerAndAirFlowRateKnown: z.boolean(),
	midHeightOfAirFlowPath: z.number(),
});

const decentralisedContinuousMevData = baseMechanicalVentilationData.extend(hasPcdbPackagedProduct.shape).extend({
	productReference: z.string().trim().min(1),
	typeOfMechanicalVentilationOptions: zodLiteralFromUnionType<SchemaMechVentType, "Decentralised continuous MEV">("Decentralised continuous MEV"),
	installedUnderApprovedScheme: z.boolean(),
	installationType: mechVentInstallationTypeZod,
	installationLocation: mechVentInstallationLocationZod,
	midHeightOfAirFlowPath: z.number(),
});

const baseMeasuredFanPowerAndAirFlowRateKnown = {
	measuredFanPowerAndAirFlowRateKnown: z.literal(true),
	measuredFanPower: z.number(),
	measuredAirFlowRate: z.number(),
};

function makeMVWithAssociatedItem<
	T extends z.ZodRawShape & { hasAssociatedItem?: never },
>(base: z.ZodObject<T>) {
	return base.extend({
		hasAssociatedItem: z.literal(false),
		pitch: z.number().min(0).lt(180),
		orientation: z.number().min(0).lt(360),
	});
}

function makeMVWithoutAssociatedItem<
	T extends z.ZodRawShape & { hasAssociatedItem?: never },
>(base: z.ZodObject<T>) {
	return base.extend({
		hasAssociatedItem: z.literal(true),
	});
}

const mechanicalVentilationDataZod = z.discriminatedUnion("hasAssociatedItem",
	[
		z.discriminatedUnion("typeOfMechanicalVentilationOptions",
			[
				z.discriminatedUnion("measuredFanPowerAndAirFlowRateKnown",
					[
						makeMVWithAssociatedItem(baseMechanicalVentilationData)
							.extend(baseMvhrData.shape)
							.extend({ measuredFanPowerAndAirFlowRateKnown: z.literal(false) }),
						makeMVWithAssociatedItem(baseMechanicalVentilationData)
							.extend(baseMvhrData.shape)
							.extend(baseMeasuredFanPowerAndAirFlowRateKnown),
					],
				),
				makeMVWithAssociatedItem(baseMechanicalVentilationData)
					.extend(intermittentMevData.shape),
				z.discriminatedUnion("measuredFanPowerAndAirFlowRateKnown",
					[
						makeMVWithAssociatedItem(baseMechanicalVentilationData)
							.extend(baseCentralisedContinuousMevData.shape)
							.extend({ measuredFanPowerAndAirFlowRateKnown: z.literal(false) }),
						makeMVWithAssociatedItem(baseMechanicalVentilationData)
							.extend(baseCentralisedContinuousMevData.shape)
							.extend(baseMeasuredFanPowerAndAirFlowRateKnown),
					],
				),
				makeMVWithAssociatedItem(baseMechanicalVentilationData)
					.extend(decentralisedContinuousMevData.shape),
			],
		),

		z.discriminatedUnion("typeOfMechanicalVentilationOptions",
			[
				z.discriminatedUnion("measuredFanPowerAndAirFlowRateKnown",
					[
						makeMVWithoutAssociatedItem(baseMechanicalVentilationData)
							.extend(baseMvhrData.shape)
							.extend({ measuredFanPowerAndAirFlowRateKnown: z.literal(false) }),
						makeMVWithoutAssociatedItem(baseMechanicalVentilationData)
							.extend(baseMvhrData.shape)
							.extend(baseMeasuredFanPowerAndAirFlowRateKnown),
					],
				),
				makeMVWithoutAssociatedItem(baseMechanicalVentilationData)
					.extend(intermittentMevData.shape),
				z.discriminatedUnion("measuredFanPowerAndAirFlowRateKnown",
					[
						makeMVWithoutAssociatedItem(baseMechanicalVentilationData)
							.extend(baseCentralisedContinuousMevData.shape)
							.extend({ measuredFanPowerAndAirFlowRateKnown: z.literal(false) }),
						makeMVWithoutAssociatedItem(baseMechanicalVentilationData)
							.extend(baseCentralisedContinuousMevData.shape)
							.extend(baseMeasuredFanPowerAndAirFlowRateKnown),
					],
				),
				makeMVWithoutAssociatedItem(baseMechanicalVentilationData)
					.extend(decentralisedContinuousMevData.shape),
			],
		),
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

const baseVentDataZod = z.object({
	name: z.string().trim().min(1),
	effectiveVentilationArea: z.number().min(1).max(999999),
	openingRatio: z.number(),
	midHeightOfZone: z.number().min(1).max(60),
	associatedItemId: z.string().trim().min(1),
	hasAssociatedItem: z.boolean(),
});

const ventDataZod = z.discriminatedUnion("hasAssociatedItem", [
	baseVentDataZod.extend({
		hasAssociatedItem: z.literal(false),
		pitch: z.number().min(0).lt(180),
		orientation: z.number().min(0).lt(360),
	}),
	baseVentDataZod.extend({
		hasAssociatedItem: z.literal(true),
	}),
]);

export type VentData = z.infer<typeof ventDataZod>;

const ventilationDataZod = z.object({
	ventilationZoneHeight: z.number().min(1).max(20),
	dwellingEnvelopeArea: z.number().min(5).max(72000),
	baseHeightOfVentilationZone: z.number().min(-150).max(750),
	maxRequiredAirChangeRate: z.number(),
});

export type VentilationData = z.infer<typeof ventilationDataZod>;

const airPermeabilityDataZod = z.object({
	testPressure: testPressureZod,
	airTightnessTestResult: z.number(),
});

export type AirPermeabilityData = z.infer<typeof airPermeabilityDataZod>;

const heatingControlType = z.enum(["separateTemperatureControl", "separateTimeAndTemperatureControl"]);

const typeOfHeatPump = z.enum([
	"airSource",
	"groundSource",
	"waterSource",
	"booster",
	"hotWaterOnly",
	"exhaustAirMev",
	"exhaustAirMvhr",
	"exhaustAirMixed",
	"hybridHeatPump",
]);

const typeOfBoiler = z.enum(["combiBoiler", "regularBoiler"]);
const typeOfHeatNetwork = z.enum(["sleevedDistrictHeatNetwork", "unsleevedDistrictHeatNetwork", "communalHeatNetwork"]);
const typeOfHeatBattery = z.enum(["heatBatteryPcm", "heatBatteryDryCore"]);
const typeOfLocationOfLoopPiping = z.enum(["outside", "heatedSpace", "unheatedSpace"]);
const _typeOfMechanicalVentilation = z.enum(["mvhr", "centralisedContinuousMev", "decentralisedContinuousMev"]);

export type HeatSourceSectionPage = "space heating" | "domestic hot water";

export type SpaceHeatingNew = AssertEachKeyIsPageId<{
	heatSource: EcaasFormList<HeatSourceData>,
	heatEmitters: EcaasFormList<HeatEmittingData>
	heatingControls: EcaasFormList<HeatingControlData>
}>;

export type HeatPumpType = z.infer<typeof typeOfHeatPump>;
export type TypeOfBoiler = z.infer<typeof typeOfBoiler>;
export type TypeOfHeatBattery = z.infer<typeof typeOfHeatBattery>;
export type TypeOfHeatNetwork = z.infer<typeof typeOfHeatNetwork>;
export type LocationOfCollectorLoopPipingType = z.infer<typeof typeOfLocationOfLoopPiping>;

export type HeatSourceType =
	"heatPump" |
	"boiler" |
	"heatNetwork" |
	"heatBattery" |
	"solarThermalSystem";

export type PcdbProduct = z.infer<typeof pcdbProduct>;

const heatPumpBase = pcdbPackagedProduct.extend({
	typeOfHeatSource: z.literal("heatPump"),
	typeOfHeatPump,
	maxFlowTemp: zodUnit("temperature").optional(),
});

const boilerBase = hasPcdbPackagedProduct.extend({
	typeOfHeatSource: z.literal("boiler"),
	typeOfBoiler,
	specifiedLocation: z.optional(boilerLocationZod),
	needsSpecifiedLocation: z.boolean(),
	maxFlowTemp: zodUnit("temperature").optional(),
});

export type HasPcdbPackagedProduct = z.infer<typeof hasPcdbPackagedProduct>;
export type PcdbPackagedProduct = z.infer<typeof pcdbPackagedProduct>;

const heatBatteryBase = pcdbProduct.extend({
	typeOfHeatSource: z.literal("heatBattery"),
	typeOfHeatBattery,
	maxFlowTemp: zodUnit("temperature").optional(),
	numberOfUnits: z.number(),
	energySupply: fuelTypeZod,
});

const solarThermalSystemBase = namedWithId.extend({
	typeOfHeatSource: z.literal("solarThermalSystem"),
	locationOfCollectorLoopPiping: typeOfLocationOfLoopPiping,
	collectorModuleArea: z.number(),
	numberOfCollectorModules: z.number(),
	peakCollectorEfficiency: fraction,
	incidenceAngleModifier: fraction,
	firstOrderHeatLossCoefficient: z.number(),
	secondOrderHeatLossCoefficient: z.number(),
	heatLossCoefficientOfSolarLoopPipe: z.number(),
	collectorMassFlowRate: z.number(),
	powerOfCollectorPump: zodUnit("power"),
	powerOfCollectorPumpController: zodUnit("power"),
	pitch: z.number().min(0).max(90),
	orientation,
});

const heatNetworkBase = namedWithId.extend({
	typeOfHeatSource: z.literal("heatNetwork"),
	typeOfHeatNetwork,
});


const isHeatNetworkInPcdbFields = {
	discriminator: "isHeatNetworkInPcdb",
	variants: [
		z.object({
			isHeatNetworkInPcdb: z.literal(true),
			isFifthGeneration: z.literal(true),
			productReference: z.string().trim().min(1),
			energySupply: fuelTypeZod.optional(),
			boosterHeatPumpId: z.string().trim().min(1),
		}),
		z.object({
			isHeatNetworkInPcdb: z.literal(true),
			isFifthGeneration: z.literal(false),
			productReference: z.string().trim().min(1),
			energySupply: fuelTypeZod.optional(),
		}),
		z.object({
			isHeatNetworkInPcdb: z.literal(false),
			hasBoosterHeatPump: z.literal(true),
			boosterHeatPumpId: z.string().trim().min(1),
			emissionsFactor: z.number(),
			outOfScopeEmissionsFactor: z.number(),
			primaryEnergyFactor: z.number(),
			canEnergyBeExported: z.boolean(),
		}),
		z.object({
			isHeatNetworkInPcdb: z.literal(false),
			hasBoosterHeatPump: z.literal(false),
			emissionsFactor: z.number(),
			outOfScopeEmissionsFactor: z.number(),
			primaryEnergyFactor: z.number(),
			canEnergyBeExported: z.boolean(),
		}),
	] satisfies Tuple,
};

const usesHeatInterfaceUnitsFields = {
	discriminator: "usesHeatInterfaceUnits",
	variants:
		[
			z.object({
				usesHeatInterfaceUnits: z.literal(true),
				heatInterfaceUnitProductReference: z.string().trim().min(1),
			}),
			z.object({
				usesHeatInterfaceUnits: z.literal(false),
			}),
		] satisfies Tuple,
};

const heatNetworkZodData = nestedDiscriminatedUnion(
	heatNetworkBase,
	isHeatNetworkInPcdbFields,
	usesHeatInterfaceUnitsFields,
);

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

const _typeOfShowerProduct = z.enum(["airPressureShower"]);

export const typeOfShowerProduct = _typeOfShowerProduct.enum;

export type ShowerProductType = z.infer<typeof _typeOfShowerProduct>;

export const productTypeMap = {
	"airSource": "AirSourceHeatPump",
	"groundSource": "GroundSourceHeatPump",
	"waterSource": "WaterSourceHeatPump",
	"booster": "BoosterHeatPump",
	"hotWaterOnly": "HotWaterOnlyHeatPump",
	"exhaustAirMev": "ExhaustAirMevHeatPump",
	"exhaustAirMvhr": "ExhaustAirMvhrHeatPump",
	"exhaustAirMixed": "ExhaustAirMixedHeatPump",
	"hybridHeatPump": "HybridHeatPump",
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
	"airPressureShower": "AirPoweredShowers",
} as const satisfies Record<HeatSourceProductType | HeatEmittingProductType | WaterStorageProductType | MechanicalVentilationProductType | ShowerProductType, TechnologyType | string | TechnologyType[]>;

export type HeatEmitterType =
	"wetDistributionSystem" |
	"instantElectricHeater" |
	"electricStorageHeater" |
	"warmAirHeater";

const _typeOfHeatEmitter = z.enum(["wetDistributionSystem", "electricStorageHeater", "instantElectricHeater"]);
const wetDistributionSystemEmitter = z.enum(["underfloorHeating", "fanCoil", "radiator"]);
export const typeOfHeatEmitter = _typeOfHeatEmitter.enum;
export const typeOfWetDistributionSystemEmitter = wetDistributionSystemEmitter.enum;

export type EcoControlClassesWithExtraOptions = "2" | "3" | "6" | "7";
export const ecoClasses: EcoControlClassesWithExtraOptions[] = ["2", "3", "6", "7"];

type Tuple = [unknown, ...unknown[]];


const ecoDesignControllerClassFields = {
	discriminator: "ecoDesignControllerClass",
	variants: [
		z.object({
			ecoDesignControllerClass: z.enum(["2", "3", "6", "7"]),
			minFlowTemp: z.number(),
			minOutdoorTemp: z.number(),
			maxOutdoorTemp: z.number(),
		}),
		z.object({
			ecoDesignControllerClass: z.enum(["1", "4", "5", "8"]),
		}),
	] satisfies Tuple,
};

export const flowRateWetDistributionZod = z.number().gt(0);

const variableFlowRateFields = {
	discriminator: "hasVariableFlowRate",
	variants: [
		z.object({
			hasVariableFlowRate: z.literal(true),
			minFlowRate: flowRateWetDistributionZod,
			maxFlowRate: flowRateWetDistributionZod,
		}),
		z.object({
			hasVariableFlowRate: z.literal(false),
			designFlowRate: flowRateWetDistributionZod,
		}),
	] satisfies Tuple,
};

export const emitterFloorAreaZod = z.number().gt(0);

const underfloorHeatingSchema = namedWithId.extend({
	typeOfHeatEmitter: z.literal(typeOfWetDistributionSystemEmitter.underfloorHeating),
	productReference: z.string(),
	areaOfUnderfloorHeating: emitterFloorAreaZod,
});

const fanCoilSchema = namedWithId.extend({
	typeOfHeatEmitter: z.literal(typeOfWetDistributionSystemEmitter.fanCoil),
	productReference: z.string(),
	numOfFanCoils: z.number(),
});

export const lengthRadiatorZod = z.number().gt(0);

const radiatorSchema = namedWithId.extend({
	typeOfHeatEmitter: z.literal(typeOfWetDistributionSystemEmitter.radiator),
	productReference: z.string(),
	numOfRadiators: z.number(),
	length: lengthRadiatorZod,
});
export type RadiatorData = z.infer<typeof radiatorSchema>;

const wetDistributionSystemEmittersFields = z.discriminatedUnion("typeOfHeatEmitter", [
	underfloorHeatingSchema,
	fanCoilSchema,
	radiatorSchema,
]);
export type WetDistributionEmitterData = z.infer<typeof wetDistributionSystemEmittersFields>;

const wetDistributionSystemEmitterDraftSchema = z.object({
	id: z.uuidv4().readonly(),
	name: z.string().trim().min(1).optional(),
	typeOfHeatEmitter: wetDistributionSystemEmitter.optional(),
	productReference: z.string().optional(),
	areaOfUnderfloorHeating: emitterFloorAreaZod.optional(),
	numOfFanCoils: z.number().optional(),
	numOfRadiators: z.number().optional(),
	length: z.number().min(0.001).optional(),
});

const heatingRank = z.number().int().min(1).optional();
export const tempDiffEmitDsgnWetDistributionZod = z.number().gt(0).max(70);

const wetDistributionSystemBase = namedWithId.extend({
	typeOfHeatEmitter: z.literal("wetDistributionSystem"),
	heatSource: z.string(),
	designFlowTemp: z.number(),
	designTempDiffAcrossEmitters: tempDiffEmitDsgnWetDistributionZod,
	emitters: z.array(z.union([wetDistributionSystemEmittersFields, wetDistributionSystemEmitterDraftSchema])),
	percentageRecirculated: z.number().min(0).max(100),
	heatingRank,
});

const wetDistributionSystemSchema = nestedDiscriminatedUnion(
	wetDistributionSystemBase,
	ecoDesignControllerClassFields,
	variableFlowRateFields,
);

export type WetDistributionSystemData = z.infer<typeof wetDistributionSystemSchema>;

const warmAirHeaterSchema = namedWithId.extend({
	typeOfHeatEmitter: z.literal("warmAirHeater"),
	designTempDiffAcrossEmitters: z.number(),
	heatSource: z.string(),
	convectionFraction: z.number(),
	numOfWarmAirHeaters: z.number(),
	heatingRank,
});

export const instantElectricHeaterRatedPowerZod = z.number().min(0.1).max(70);
export const numOfInstantElectricHeatersZod = z.number().min(1);

const instantElectricHeaterSchema = namedWithId.extend({
	typeOfHeatEmitter: z.literal("instantElectricHeater"),
	convectiveType: convectiveTypeZod,
	ratedPower: instantElectricHeaterRatedPowerZod,
	numOfHeaters: numOfInstantElectricHeatersZod,
	heatingRank,
});

const electricStorageHeaterSchema = namedWithId.extend({
	typeOfHeatEmitter: z.literal(typeOfHeatEmitter.electricStorageHeater),
	productReference: z.string(),
	numOfStorageHeaters: z.number(),
	heatingRank,
});

const heatEmittingDataZod = z.discriminatedUnion("typeOfHeatEmitter", [
	wetDistributionSystemSchema,
	warmAirHeaterSchema,
	instantElectricHeaterSchema,
	electricStorageHeaterSchema,
]);

export type HeatEmittingProductType = Exclude<z.infer<typeof _typeOfHeatEmitter>, "wetDistributionSystem"> | "fanCoil";
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
const immersionHeaterHotWaterSourceBase = baseImmersionHeater.extend(hotWaterHeatSourceExtension);
const pointOfUseHotWaterSourceBase = basePointOfUse.extend(hotWaterHeatSourceExtension);

const heatNetworkHotWaterSource = nestedDiscriminatedUnion(
	heatNetworkHotWaterSourceBase,
	isHeatNetworkInPcdbFields,
	usesHeatInterfaceUnitsFields,
);

const newHotWaterHeatSourceDataZod = z.discriminatedUnion("typeOfHeatSource", [
	heatPumpHotWaterSourceBase,
	boilerHotWaterSourceBase,
	heatBatteryHotWaterSourceBase,
	solarThermalHotWaterSourceBase,
	heatNetworkHotWaterSource,
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
	storageCylinderVolume: zodUnit("volume"),
	dailyEnergyLoss: z.number(),
	dhwHeatSourceId: z.string(),
	areaOfHeatExchanger: z.number().optional(),
	heaterPosition: fraction,
	thermostatPosition: fraction,
});

export type HotWaterCylinderData = z.infer<typeof hotWaterCylinderDataZod>;

const smartHotWaterTankDataZod = namedWithId.extend({
	typeOfWaterStorage: z.literal("smartHotWaterTank"),
	productReference: z.string(),
	dhwHeatSourceId: z.string(),
	heaterPosition: fraction,
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
	dhwHeatSourceId: z.uuidv4(),
});

export const showerFlowRateZod = z.number().min(8).max(15);

const hasAirPumpFields = {
	discriminator: "isAirPressureShower",
	variants: [
		z.object({ isAirPressureShower: z.literal(false), flowRate: showerFlowRateZod }),
		z.object({ isAirPressureShower: z.literal(true), airPressureShowerProductReference: z.string() }),
	] satisfies Tuple,
};

const mixedShowerWwhrsFields = {
	discriminator: "wwhrs",
	variants: [
		z.object({ wwhrs: z.literal(false) }),
		z.object({
			wwhrs: z.literal(true),
			wwhrsType: wwhrsTypeZod,
			wwhrsProductReference: z.string().optional(),
		}),
	] satisfies Tuple,
};

const mixedShowerDataZod = nestedDiscriminatedUnion(
	mixedShowerBaseZod,
	hasAirPumpFields,
	mixedShowerWwhrsFields,
);

export type MixedShowerData = z.infer<typeof mixedShowerDataZod>;

export const ratedPowerShowerZod = z.number().gt(0).max(30);

const electricShowerDataZod = namedWithId.extend({
	typeOfHotWaterOutlet: z.literal("electricShower"),
	ratedPower: ratedPowerShowerZod,
});

export type ElectricShowerData = z.infer<typeof electricShowerDataZod>;

export const bathSizeZod = z.number().gt(0);

const bathDataZod = namedWithId.extend({
	typeOfHotWaterOutlet: z.literal("bath"),
	size: bathSizeZod,
});

export type BathData = z.infer<typeof bathDataZod>;

export const otherFlowRateZod = z.number().min(0.1).max(15);

const otherHotWaterOutletDataZod = namedWithId.extend({
	typeOfHotWaterOutlet: z.literal("otherHotWaterOutlet"),
	flowRate: otherFlowRateZod,
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

export const tankPrimaryPipeworkLengthZod = z.number().min(0.05);

const pipeworkDataZod = z.object({
	name: z.string().trim().min(1),
	internalDiameter: z.number(),
	externalDiameter: z.number(),
	length: tankPrimaryPipeworkLengthZod,
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

export const peakPowerPvZod = z.number().min(0.001).max(100);
export const sideLengthPvZod = z.number().gt(0).max(100);
export const inverterPeakPowerPvZod = z.number().gt(0);

const pvArrayDataZod = z.object({
	name: z.string().trim().min(1),
	peakPower: peakPowerPvZod,
	ventilationStrategy: photovoltaicVentilationStrategyZod,
	pitch: z.number().min(0).max(90),
	orientation,
	elevationalHeight: z.number().min(0).max(500),
	lengthOfPV: sideLengthPvZod,
	widthOfPV: sideLengthPvZod,
	inverterPeakPowerAC: inverterPeakPowerPvZod,
	inverterPeakPowerDC: inverterPeakPowerPvZod,
	locationOfInverter: z.enum(["heated_space", "unheated_space"]),
	inverterType: inverterTypeZod,
	electricityPriority: z.enum(["diverter", "electricBattery"]),
	hasShading: z.boolean(),
});

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

export const capacityElectricBatteryZod = z.number().gt(0).max(50);

const electricBatteryDataZod = z.object({
	name: z.string().trim().min(1),
	capacity: capacityElectricBatteryZod,
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
	name?: string;
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