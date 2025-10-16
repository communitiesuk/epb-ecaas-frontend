import type { TaggedUnion } from "type-fest";
import type { PageId } from "~/data/pages/pages";
import type { SchemaFhsComplianceResponse, SchemaJsonApiOnePointOneErrorLinks, SchemaJsonApiOnePointOneErrorSource, SchemaJsonApiOnePointOneMeta } from "~/schema/api-schema.types";
import type { SchemaCombustionApplianceType, FloorType, SchemaMechVentType, MassDistributionClass } from "~/schema/aliases";
import * as z from "zod";
import { zeroPitchOption } from "~/utils/pitchOptions";
import { zodUnit } from "~/utils/units/zod";
import { arealHeatCapacityZod, batteryLocationZod, colourZod, combustionAirSupplySituationZod, combustionFuelTypeZod, convectiveTypeZod, ductShapeZod, flueGasExhaustSituationZod, fuelTypeZod, inverterTypeZod, massDistributionClassZod, mvhrLocationZod, photovoltaicVentilationStrategyZod, shadingObjectTypeZod, terrainClassZod, testPressureZod, ventilationShieldClassZod, waterPipeContentsTypeZod, waterPipeworkLocationZod, windowTreatmentControlZod, windowTreatmentTypeZod, windShieldLocationZod, zodLiteralFromUnionType } from "./zod";

const fraction = z.number().min(0).max(1);
const percentage = z.number().min(0).max(100);
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
	heatingAndCoolingSystems: heatingAndCoolingSystems;
	pvAndBatteries: PvAndBatteries;
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
	numOfBedrooms: z.int().min(1),
	coolingRequired: z.boolean(),
});

const generalDetailsDataZod = z.discriminatedUnion("typeOfDwelling", [
	baseGeneralDetails.extend({ typeOfDwelling: z.literal("flat"), storeyOfFlat: z.number().min(-50).max(199) }),
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

export type DwellingDetails = AssertFormKeysArePageIds<{
	generalSpecifications: EcaasForm<GeneralDetailsData>;
	shading: EcaasFormList<ShadingData>;
	externalFactors: EcaasForm<ExternalFactorsData>;
}>;

export interface DwellingFabric {
	dwellingSpaceZoneParameters: EcaasForm<DwellingSpaceZoneParametersData>;
	dwellingSpaceFloors: FloorsData;
	dwellingSpaceWalls: WallsData;
	dwellingSpaceCeilingsAndRoofs: CeilingsAndRoofsData;
	dwellingSpaceDoors: DoorsData;
	dwellingSpaceWindows: EcaasFormList<WindowData>;
	dwellingSpaceThermalBridging: ThermalBridgingData;
	dwellingSpaceLighting: EcaasForm<DwellingSpaceLightingData>;
}

export interface FloorsData {
	dwellingSpaceGroundFloor: EcaasFormList<GroundFloorData>,
	dwellingSpaceInternalFloor: EcaasFormList<InternalFloorData>,
	dwellingSpaceExposedFloor: EcaasFormList<ExposedFloorData>
}

export enum AdjacentSpaceType {
	heatedSpace = "heatedSpace",
	unheatedSpace = "unheatedSpace",
}

const baseInternalFloorData = named.extend({
	surfaceAreaOfElement: z.number(),
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
});
const internalFloorDataZod = z.discriminatedUnion(
	"typeOfInternalFloor",
	[
		baseInternalFloorData.extend({
			typeOfInternalFloor: z.literal(AdjacentSpaceType.unheatedSpace),
			thermalResistanceOfAdjacentUnheatedSpace,
		}),
		baseInternalFloorData.extend({
			typeOfInternalFloor: z.literal(AdjacentSpaceType.heatedSpace),
		}),
	],
);

export type InternalFloorData = z.infer<typeof internalFloorDataZod>;

const exposedFloorDataZod = named.extend({
	pitch: z.number().min(0).lt(180),
	orientation,
	length: z.number().min(0.001).max(50),
	width: z.number().min(0.001).max(50),
	elevationalHeight: z.number().min(0).max(500),
	surfaceArea: z.number().min(0.01).max(10000),
	solarAbsorption: z.number(),
	uValue,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
});

export type ExposedFloorData = z.infer<typeof exposedFloorDataZod>;

const baseGroundFloorData = named.extend({
	surfaceArea: z.number().min(1),
	pitch: z.number(),
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

export type WallsData = AssertFormKeysArePageIds<{
	dwellingSpaceExternalWall: EcaasForm<EcaasForm<ExternalWallData>[]>;
	dwellingSpaceInternalWall: EcaasForm<EcaasForm<InternalWallData>[]>;
	dwellingSpaceWallToUnheatedSpace: EcaasForm<EcaasForm<WallsToUnheatedSpaceData>[]>;
	dwellingSpacePartyWall: EcaasForm<EcaasForm<PartyWallData>[]>;
}>;

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type NonZeroDigit = Exclude<Digit, "0">;
type AngleString = `${"" | "-"}${NonZeroDigit | ""}${NonZeroDigit | ""}${Digit | ""}`;

export type PitchOption = AngleString | "custom";

const externalWallDataZod = named.extend({
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
	orientation,
	height: z.number().min(0.001).max(50),
	length: z.number().min(0.001).max(50),
	elevationalHeight: z.number().min(0).max(500),
	surfaceArea: z.number().min(0.01).max(10000),
	solarAbsorption: z.number(),
	uValue,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
});

export type ExternalWallData = z.infer<typeof externalWallDataZod>;

const internalWallDataZod = named.extend({
	surfaceAreaOfElement: z.number().min(0).max(10000),
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
});

export type InternalWallData = z.infer<typeof internalWallDataZod>;

const wallsToUnheatedSpaceDataZod = named.extend({
	surfaceAreaOfElement: z.number().min(0).max(10000),
	uValue,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
	thermalResistanceOfAdjacentUnheatedSpace,
});

export type WallsToUnheatedSpaceData = z.infer<typeof wallsToUnheatedSpaceDataZod>;

const partyWallDataZod = named.extend({
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
	surfaceArea: z.number().min(0.01).max(10000),
	uValue,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
});

export type PartyWallData = z.infer<typeof partyWallDataZod>;

export type CeilingsAndRoofsData = AssertFormKeysArePageIds<{
	dwellingSpaceCeilings: EcaasFormList<CeilingData>;
	dwellingSpaceRoofs: EcaasFormList<RoofData>;
}>;

const baseCeilingData = named.extend({
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
			type: z.literal(AdjacentSpaceType.heatedSpace),
		}),
		baseCeilingData.extend({
			type: z.literal(AdjacentSpaceType.unheatedSpace),
			thermalResistanceOfAdjacentUnheatedSpace,
			uValue,
		}),
	],
);

export type CeilingData = z.infer<typeof ceilingDataZod>;

const roofType = z.enum(["flat", "pitchedInsulatedAtRoof", "pitchedInsulatedAtCeiling", "unheatedPitched"]);

export type RoofType = z.infer<typeof roofType>;

const roofDataZod = named.extend({
	typeOfRoof: roofType,
	pitchOption: z.optional(zeroPitchOption),
	pitch: z.number().min(0).lt(180),
	orientation: z.optional(orientation),
	length: z.number().min(0.001).max(50),
	width: z.number().min(0.001).max(50),
	elevationalHeightOfElement: z.number().min(0).max(500),
	surfaceArea: z.number().min(0.01).max(10000),
	solarAbsorptionCoefficient: z.number().min(0.01).max(1),
	uValue,
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
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
	orientation,
	height: z.number().min(0.001).max(50),
	width: z.number().min(0.001).max(50),
	elevationalHeight: z.number().min(0).max(500),
	surfaceArea: z.number().min(0.01).max(10000),
	uValue,
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	colour: colourZod,
});

export type ExternalUnglazedDoorData = z.infer<typeof externalUnglazedDoorDataZod>;

const commonOpenablePartsFields = {
	maximumOpenableArea: z.number().min(0.01).max(10000),
	heightOpenableArea: z.number().min(0.001).max(50),
};

const onePartFields = { ...commonOpenablePartsFields, midHeightOpenablePart1: z.number().min(0).max(100) };
const twoPartFields = { ...onePartFields, midHeightOpenablePart2: z.number().min(0).max(100) };
const threePartFields = { ...twoPartFields, midHeightOpenablePart3: z.number().min(0).max(100) };
const fourPartFields = { ...threePartFields, midHeightOpenablePart4: z.number().min(0).max(100) };

const externalGlazedDoorDataZod = named.extend({
	orientation,
	height: z.number().min(0.001).max(50),
	width: z.number().min(0.001).max(50),
	uValue,
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
	solarTransmittance: z.number().min(0.01).max(1),
	elevationalHeight: z.number().min(0).max(500),
	midHeight: z.number().min(0).max(100),
	openingToFrameRatio: fraction,
	...onePartFields,
});

export type ExternalGlazedDoorData = z.infer<typeof externalGlazedDoorDataZod>;

const baseInternalDoorData = named.extend({
	surfaceArea: z.number().min(0).max(10000),
	arealHeatCapacity: arealHeatCapacityZod,
	massDistributionClass,
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
});
const internalDoorDataZod = z.discriminatedUnion(
	"typeOfInternalDoor",
	[
		baseInternalDoorData.extend({
			typeOfInternalDoor: z.literal(AdjacentSpaceType.heatedSpace),
		}),
		baseInternalDoorData.extend({
			typeOfInternalDoor: z.literal(AdjacentSpaceType.unheatedSpace),
			uValue,
			thermalResistanceOfAdjacentUnheatedSpace,
		}),
	],
);

export type InternalDoorData = z.infer<typeof internalDoorDataZod>;

const baseWindowData = named.extend({
	orientation,
	// surfaceArea: z.number().min(0.01).max(10000),
	height: z.number().min(0.001).max(50),
	width: z.number().min(0.001).max(50),
	uValue,
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
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
			...onePartFields,
		}),
		baseWindowData.extend({
			numberOpenableParts: z.literal("2"),
			...twoPartFields,
		}),
		baseWindowData.extend({
			numberOpenableParts: z.literal("3"),
			...threePartFields,
		}),
		baseWindowData.extend({
			numberOpenableParts: z.literal("4"),
			...fourPartFields,
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

const curtainsOrBlindsFields = z.union([
	z.object({
		curtainsOrBlinds: z.literal(true),
		treatmentType: windowTreatmentTypeZod,
		curtainsControlObject: z.optional(windowTreatmentControlZod),
		thermalResistivityIncrease: z.number().min(0).max(100),
		solarTransmittanceReduction: fraction,
	}),
	z.object({
		curtainsOrBlinds: z.literal(false),
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

const spaceCoolingSystemData = named;
const spaceHeatControlSystemData = named;

const dwellingSpaceZoneParameterDataZod = z.object({
	area: z.number().min(0),
	volume: z.number().min(0),
	spaceHeatingSystemForThisZone: z.optional(z.string()),
	spaceCoolingSystemForThisZone: z.optional(z.array(spaceCoolingSystemData)),
	spaceHeatControlSystemForThisZone: z.optional(z.array(spaceHeatControlSystemData)),
});

export type DwellingSpaceZoneParametersData = z.infer<typeof dwellingSpaceZoneParameterDataZod>;

const dwellingSpaceLightingDataZod = z.object({
	numberOfBulbs: z.int().min(0),
});

export type DwellingSpaceLightingData = z.infer<typeof dwellingSpaceLightingDataZod>;

const _spaceHeatingSystemDataZod = named;

export type SpaceHeatingSystemData = z.infer<typeof _spaceHeatingSystemDataZod>;

export type SpaceCoolingSystemData = z.infer<typeof spaceCoolingSystemData>;

export type SpaceHeatControlSystemData = z.infer<typeof spaceHeatControlSystemData>;

export interface DomesticHotWater {
	waterHeating: WaterHeating;
	hotWaterOutlets: HotWaterOutlets;
	pipework: Pipework;
	wwhrs: EcaasForm<WwhrsData[]>
}

export type WaterHeating = AssertFormKeysArePageIds<{
	hotWaterCylinder: EcaasFormList<HotWaterCylinderData>;
	immersionHeater: EcaasForm<ImmersionHeaterData[]>;
	solarThermal: EcaasForm<SolarThermalData[]>;
	pointOfUse: EcaasForm<PointOfUseData[]>;
	heatPump: EcaasFormList<HotWaterHeatPumpData>;
	combiBoiler: EcaasForm<CombiBoilerData[]>;
	heatBattery: EcaasForm<WaterHeatingHeatBatteryData[]>;
	smartHotWaterTank: EcaasForm<SmartHotWaterTankData[]>;
	heatInterfaceUnit: EcaasForm<WaterHeatingHeatInterfaceUnitData[]>;
}>;

const hotWaterCylinderDataZod = namedWithId.extend({
	heatSource: z.string(),
	storageCylinderVolume: z.union([zodUnit("volume"), z.number()]), // number will be deprecated, preserved for backwards compatibility with old input data files
	dailyEnergyLoss: z.number(),
});

export type HotWaterCylinderData = z.infer<typeof hotWaterCylinderDataZod>;

const immersionHeaterPosition = z.enum(["top", "middle", "bottom"]);

export type ImmersionHeaterPosition = z.infer<typeof immersionHeaterPosition>;

const immersionHeaterDataZod = named.extend({
	ratedPower: z.number(),
	heaterPosition: immersionHeaterPosition,
	thermostatPosition: immersionHeaterPosition,
});

export type ImmersionHeaterData = z.infer<typeof immersionHeaterDataZod>;

const solarThermalDataZod = named;

export type SolarThermalData = z.infer<typeof solarThermalDataZod>;

const pointOfUseDataZod = named.extend({
	setpointTemperature: z.number(),
	heaterEfficiency: fraction,
});

export type PointOfUseData = z.infer<typeof pointOfUseDataZod>;

const _hotWaterHeatPumpDataZod = named;

export type HotWaterHeatPumpData = z.infer<typeof _hotWaterHeatPumpDataZod>;

const combiBoilerDataZod = named;

export type CombiBoilerData = z.infer<typeof combiBoilerDataZod>;

const waterHeatingHeatBatteryDataZod = named;

export type WaterHeatingHeatBatteryData = z.infer<typeof waterHeatingHeatBatteryDataZod>;

const smartHotWaterTankDataZod = named;

export type SmartHotWaterTankData = z.infer<typeof smartHotWaterTankDataZod>;

const waterHeatingHeatInterfaceUnitDataZod = named;

export type WaterHeatingHeatInterfaceUnitData = z.infer<typeof waterHeatingHeatInterfaceUnitDataZod>;

export type HotWaterOutlets = AssertFormKeysArePageIds<{
	mixedShower: EcaasFormList<MixedShowerData>;
	electricShower: EcaasFormList<ElectricShowerData>;
	bath: EcaasFormList<BathData>;
	otherOutlets: EcaasFormList<OtherHotWaterOutletData>;
}>;

const mixedShowerDataZod = namedWithId.extend({
	flowRate: z.number().min(8).max(15),
});

export type MixedShowerData = z.infer<typeof mixedShowerDataZod>;

const electricShowerDataZod = namedWithId.extend({
	ratedPower: z.number().min(0).max(30),
});

export type ElectricShowerData = z.infer<typeof electricShowerDataZod>;

const bathDataZod = namedWithId.extend({
	size: z.number().min(0).max(500),
	flowRate: z.number().min(0).max(15),
});

export type BathData = z.infer<typeof bathDataZod>;

const otherHotWaterOutletDataZod = namedWithId.extend({
	flowRate: z.number().min(0).max(15),
});

export type OtherHotWaterOutletData = z.infer<typeof otherHotWaterOutletDataZod>;

export type Pipework = AssertFormKeysArePageIds<{
	primaryPipework: EcaasFormList<PrimaryPipeworkData>;
	secondaryPipework: EcaasFormList<SecondaryPipeworkData>;
}>;

const primaryPipeworkDataZod = z.object({
	name: z.string().trim().min(1),
	internalDiameter: z.number(),
	externalDiameter: z.number(),
	length: z.number().min(0).max(200),
	insulationThickness: z.number(),
	thermalConductivity: z.number(),
	surfaceReflectivity: z.boolean(),
	pipeContents: waterPipeContentsTypeZod,
	hotWaterCylinder: z.string(),
	location: waterPipeworkLocationZod,
});

export type PrimaryPipeworkData = z.infer<typeof primaryPipeworkDataZod>;

const secondaryPipeworkDataZod = z.object({
	name: z.string().trim().min(1),
	length: z.number().min(0).max(200),
	location: waterPipeworkLocationZod,
	internalDiameter: z.number().min(1).max(50),
});

export type SecondaryPipeworkData = z.infer<typeof secondaryPipeworkDataZod>;

const wwhrsDataZod = z.object({
	name: z.string().trim().min(1),
	outlet: z.string(),
	flowRate: z.number().min(0.1).max(500),
	efficiency: percentage,
	proportionOfUse: fraction,
});

export type WwhrsData = z.infer<typeof wwhrsDataZod>;

export type InfiltrationAndVentilation = AssertFormKeysArePageIds<{
	mechanicalVentilation: EcaasFormList<MechanicalVentilationData>;
	ductwork: EcaasFormList<DuctworkData>;
	vents: EcaasFormList<VentData>;
	combustionAppliances: CombustionAppliancesData;
	naturalVentilation: EcaasForm<VentilationData>;
	airPermeability: EcaasForm<AirPermeabilityData>;
}>;

const baseMechanicalVentilationData = namedWithId.extend({
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
	typeOfVent: z.enum(["trickle", "airBrick"]),
	effectiveVentilationArea: z.number().min(1).max(999999),
	openingRatio: z.number(),
	midHeightOfZone: z.number().min(1).max(60),
	orientation,
	pitch: z.number().min(0).lt(180),
});

export type VentData = z.infer<typeof ventDataZod>;

export type CombustionAppliancesData = Record<SchemaCombustionApplianceType, EcaasForm<CombustionApplianceData[]>>;

const combustionApplianceDataZod = named.extend({
	airSupplyToAppliance: combustionAirSupplySituationZod,
	exhaustMethodFromAppliance: flueGasExhaustSituationZod,
	typeOfFuel: combustionFuelTypeZod,
});

export type CombustionApplianceData = z.infer<typeof combustionApplianceDataZod>;

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

export type heatingAndCoolingSystems = AssertEachKeyIsPageId<{
	heatGeneration: HeatGeneration,
	energySupply: EcaasForm<EnergySupplyData>;
	heatEmitting: HeatEmitting;
	cooling: Cooling
}>;

export type HeatGeneration = AssertFormKeysArePageIds<{
	heatPump: EcaasFormList<HeatPumpData>;
	boiler: EcaasForm<BoilerData[]>;
	heatBattery: EcaasForm<HeatBatteryData[]>;
	heatNetwork: EcaasForm<HeatNetworkData[]>;
	heatInterfaceUnit: EcaasForm<HeatInterfaceUnitData[]>;
}>;

const heatPumpDataZod = namedWithId.extend({
	productReference: z.string().trim().min(1),
});

export type HeatPumpData = z.infer<typeof heatPumpDataZod>;

const boilerDataZod = namedWithId;

export type BoilerData = z.infer<typeof boilerDataZod>;

const heatBatteryDataZod = namedWithId;

export type HeatBatteryData = z.infer<typeof heatBatteryDataZod>;

const heatNetworkDataZod = namedWithId;

export type HeatNetworkData = z.infer<typeof heatNetworkDataZod>;

const heatInterfaceUnitDataZod = namedWithId;

export type HeatInterfaceUnitData = z.infer<typeof heatInterfaceUnitDataZod>;

const energySupplyDataZod = z.object({
	fuelType: z.array(fuelTypeZod),
	co2PerKwh: z.optional(z.number()),
	co2PerKwhIncludingOutOfScope: z.optional(z.number()),
	kwhPerKwhDelivered: z.optional(z.number()),
	exported: z.optional(z.boolean()),
});

export type EnergySupplyData = z.infer<typeof energySupplyDataZod>;

export type HeatEmitting = AssertFormKeysArePageIds<{
	wetDistribution: EcaasFormList<WetDistributionData>;
	instantElectricHeater: EcaasFormList<InstantElectricStorageData>;
	electricStorageHeater: EcaasForm<ElectricStorageHeaterData[]>;
	warmAirHeatPump: EcaasForm<WarmAirHeatPumpData[]>;
}>;

const electricStorageHeaterDataZod = named;

export type ElectricStorageHeaterData = z.infer<typeof electricStorageHeaterDataZod>;

const instantElectricStorageDataZod = named.extend({
	ratedPower: z.number().min(0).max(70),
	convectiveType: convectiveTypeZod,
});

export type InstantElectricStorageData = z.infer<typeof instantElectricStorageDataZod>;

const warmAirHeatPumpDataZod = named;

export type WarmAirHeatPumpData = z.infer<typeof warmAirHeatPumpDataZod>;

const baseWetDistributionData = named.extend({
	heatSource: z.string(),
	thermalMass: z.number(),
	designTempDiffAcrossEmitters: z.number(),
	designFlowTemp: z.number(),
	designFlowRate: z.number(),
	ecoDesignControllerClass: z.enum(["1", "2", "3", "4", "5", "6", "7", "8"]),
	minimumFlowTemp: z.number().min(20).max(120),
	minOutdoorTemp: z.number(),
	maxOutdoorTemp: z.number(),
	convectionFractionWet: fraction,
});
const wetDistributionDataZod = z.discriminatedUnion(
	"typeOfSpaceHeater",
	[
		baseWetDistributionData.extend({
			typeOfSpaceHeater: z.literal("radiator"),
			numberOfRadiators: z.int().min(1),
			exponent: z.number(),
			constant: z.number(),
		}),
		baseWetDistributionData.extend({
			typeOfSpaceHeater: z.literal("ufh"),
			emitterFloorArea: z.number(),
			equivalentThermalMass: z.number(),
			systemPerformanceFactor: z.number(),
		}),
	],
);

export type WetDistributionData = z.infer<typeof wetDistributionDataZod>;

export type PvAndBatteries = AssertFormKeysArePageIds<{
	pvSystems: EcaasFormList<PvSystemData>;
	electricBattery: EcaasFormList<ElectricBatteryData>;
	diverters: EcaasFormList<PvDiverterData>;
}>;

const pvSystemDataZod = z.object({
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
	inverterIsInside: z.boolean(),
	inverterType: inverterTypeZod,
	aboveDepth: z.optional(z.number()),
	aboveDistance: z.optional(z.number()),
	leftDepth: z.optional(z.number()),
	leftDistance: z.optional(z.number()),
	rightDepth: z.optional(z.number()),
	rightDistance: z.optional(z.number()),
});

export type PvSystemData = z.infer<typeof pvSystemDataZod>;

const electricBatteryDataZod = z.object({
	name: z.string().trim().min(1),
	capacity: z.number().min(0).max(50),
	chargeEfficiency: fraction,
	location: batteryLocationZod,
	gridChargingPossible: z.boolean(),
	maximumChargeRate: z.number(),
	minimumChargeRate: z.number(),
	maximumDischargeRate: z.number(),
}).refine((val) => val.maximumChargeRate >= val.minimumChargeRate, { error: "Maximum charge rate should be greater or equal to minimum charge rate.", abort: true });

export type ElectricBatteryData = z.infer<typeof electricBatteryDataZod>;

const pvDiverterDataZod = z.object({
	name: z.string().trim().min(1),
	hotWaterCylinder: z.optional(z.string()),
	heatSource: z.string(),
});

export type PvDiverterData = z.infer<typeof pvDiverterDataZod>;

export interface Cooling {
	airConditioning: EcaasFormList<AirConditioningData>;
}

const airConditioningDataZod = z.object({
	name: z.string().trim().min(1),
	coolingCapacity: z.number(),
	seasonalEnergyEfficiencyRatio: z.number().min(0).max(25),
	convectionFraction: fraction,
	energySupply: z.string(),
});

export type AirConditioningData = z.infer<typeof airConditioningDataZod>;

export type UsesPitchComponent = {
	pitch?: number;
	pitchOption: PitchOption;
};

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
	"domesticHotWater/waterHeating/hotWaterCylinder": hotWaterCylinderDataZod,
	"domesticHotWater/waterHeating/combiBoiler": combiBoilerDataZod,
	"domesticHotWater/waterHeating/heatBattery": waterHeatingHeatBatteryDataZod,
	"domesticHotWater/waterHeating/heatInterfaceUnit": waterHeatingHeatInterfaceUnitDataZod,
	"domesticHotWater/waterHeating/heatPump": heatPumpDataZod,
	"domesticHotWater/waterHeating/immersionHeater": immersionHeaterDataZod,
	"domesticHotWater/waterHeating/pointOfUse": pointOfUseDataZod,
	"domesticHotWater/waterHeating/smartHotWaterTank": smartHotWaterTankDataZod,
	"domesticHotWater/waterHeating/solarThermal": solarThermalDataZod,
	"domesticHotWater/hotWaterOutlets/mixedShower": mixedShowerDataZod,
	"domesticHotWater/hotWaterOutlets/electricShower": electricShowerDataZod,
	"domesticHotWater/hotWaterOutlets/bath": bathDataZod,
	"domesticHotWater/hotWaterOutlets/otherOutlets": otherHotWaterOutletDataZod,
	"domesticHotWater/pipework/primaryPipework": primaryPipeworkDataZod,
	"domesticHotWater/pipework/secondaryPipework": secondaryPipeworkDataZod,
	"domesticHotWater/wwhrs": wwhrsDataZod,
	"dwellingFabric/dwellingSpaceZoneParameters": dwellingSpaceZoneParameterDataZod,
	"dwellingFabric/dwellingSpaceFloors/dwellingSpaceExposedFloor": exposedFloorDataZod,
	"dwellingFabric/dwellingSpaceFloors/dwellingSpaceGroundFloor": groundFloorDataZod,
	"dwellingFabric/dwellingSpaceFloors/dwellingSpaceInternalFloor": internalFloorDataZod,
	"dwellingFabric/dwellingSpaceWalls/dwellingSpaceExternalWall": externalWallDataZod,
	"dwellingFabric/dwellingSpaceWalls/dwellingSpaceInternalWall": internalWallDataZod,
	"dwellingFabric/dwellingSpaceWalls/dwellingSpaceWallToUnheatedSpace": wallsToUnheatedSpaceDataZod,
	"dwellingFabric/dwellingSpaceWalls/dwellingSpacePartyWall": partyWallDataZod,
	"dwellingFabric/dwellingSpaceCeilingsAndRoofs/dwellingSpaceCeilings": ceilingDataZod,
	"dwellingFabric/dwellingSpaceCeilingsAndRoofs/dwellingSpaceRoofs": roofDataZod,
	"dwellingFabric/dwellingSpaceDoors/dwellingSpaceExternalGlazedDoor": externalGlazedDoorDataZod,
	"dwellingFabric/dwellingSpaceDoors/dwellingSpaceExternalUnglazedDoor": externalUnglazedDoorDataZod,
	"dwellingFabric/dwellingSpaceDoors/dwellingSpaceInternalDoor": internalDoorDataZod,
	"dwellingFabric/dwellingSpaceWindows": windowDataZod,
	"dwellingFabric/dwellingSpaceThermalBridging/dwellingSpaceLinearThermalBridges": linearThermalBridgeDataZod,
	"dwellingFabric/dwellingSpaceThermalBridging/dwellingSpacePointThermalBridges": pointThermalBridgeDataZod,
	"dwellingFabric/dwellingSpaceLighting": dwellingSpaceLightingDataZod,
	"infiltrationAndVentilation/mechanicalVentilation": mechanicalVentilationDataZod,
	"infiltrationAndVentilation/ductwork": ductworkDataZod,
	"infiltrationAndVentilation/vents": ventDataZod,
	"infiltrationAndVentilation/combustionAppliances/closed_fire": combustionApplianceDataZod,
	"infiltrationAndVentilation/combustionAppliances/closed_with_fan": combustionApplianceDataZod,
	"infiltrationAndVentilation/combustionAppliances/open_fireplace": combustionApplianceDataZod,
	"infiltrationAndVentilation/combustionAppliances/open_gas_fire": combustionApplianceDataZod,
	"infiltrationAndVentilation/combustionAppliances/open_gas_flue_balancer": combustionApplianceDataZod,
	"infiltrationAndVentilation/combustionAppliances/open_gas_kitchen_stove": combustionApplianceDataZod,
	"infiltrationAndVentilation/naturalVentilation": ventilationDataZod,
	"infiltrationAndVentilation/airPermeability": airPermeabilityDataZod,
	"heatingAndCoolingSystems/heatGeneration/boiler": boilerDataZod,
	"heatingAndCoolingSystems/heatGeneration/heatBattery": heatBatteryDataZod,
	"heatingAndCoolingSystems/heatGeneration/heatInterfaceUnit": heatInterfaceUnitDataZod,
	"heatingAndCoolingSystems/heatGeneration/heatNetwork": heatNetworkDataZod,
	"heatingAndCoolingSystems/heatGeneration/heatPump": heatPumpDataZod,
	"heatingAndCoolingSystems/energySupply": energySupplyDataZod,
	"heatingAndCoolingSystems/heatEmitting/wetDistribution": wetDistributionDataZod,
	"heatingAndCoolingSystems/heatEmitting/instantElectricHeater": instantElectricStorageDataZod,
	"heatingAndCoolingSystems/heatEmitting/electricStorageHeater": electricStorageHeaterDataZod,
	"heatingAndCoolingSystems/heatEmitting/warmAirHeatPump": warmAirHeatPumpDataZod,
	"heatingAndCoolingSystems/cooling/airConditioning": airConditioningDataZod,
	"pvAndBatteries/pvSystems": pvSystemDataZod,
	"pvAndBatteries/electricBattery": electricBatteryDataZod,
	"pvAndBatteries/diverters": pvDiverterDataZod,
};