import type { TaggedUnion } from "type-fest";
import type { PageId } from "~/data/pages/pages";
import { CombustionAirSupplySituation, FlueGasExhaustSituation, MassDistributionClass, WaterPipeContentsType, OnSiteGenerationVentilationStrategy, BatteryLocation, BuildType, CombustionFuelType, DuctShape, DuctType, FloorType, FuelType, InverterType, MVHRLocation, ShadingObjectType, TerrainClass, VentilationShieldClass, VentType, WaterPipeworkLocation, WindowTreatmentControl, WindowTreatmentType, WindShieldLocation, WwhrsType, type CombustionApplianceType, type SchemaFhsComplianceResponse, type SchemaJsonApiOnePointOneErrorLinks, type SchemaJsonApiOnePointOneErrorSource, type SchemaJsonApiOnePointOneMeta } from "~/schema/api-schema.types";
import * as z from "zod";
import { zeroPitchOption } from "~/utils/pitchOptions";
import { zodUnit } from "~/utils/units/zod";

const fraction = z.number().min(0).max(1);
const percentage = z.number().min(0).max(100);
const named = z.object({
	name: z.string().trim().min(1),
});
const namedWithId = named.extend({
	id: z.uuidv4().readonly(),
});

// some standard field definitions
const orientation = z.number().min(0).lt(360);
const massDistributionClass = z.enum(MassDistributionClass);
const uValue = z.number().min(0.01).max(10);
const thermalResistanceOfAdjacentUnheatedSpace = z.number().min(0).max(3);

export type EcaasState = AssertEachKeyIsPageId<{
	dwellingDetails: DwellingDetails;
	domesticHotWater: DomesticHotWater;
	dwellingFabric: DwellingFabric;
	infiltrationAndVentilation: InfiltrationAndVentilation;
	heatingSystems: HeatingSystems;
	pvAndBatteries: PvAndBatteries;
}> & { 
	cooling: Cooling; // cooling doesn't have a corresponding page yet
	lastResult?: ComplianceResult;
};

export interface EcaasForm<T> {
	complete?: boolean;
	data: T;
}

export type DwellingDetails = AssertFormKeysArePageIds<{
	generalSpecifications: EcaasForm<GeneralDetailsData>;
	shading: EcaasForm<ShadingData[]>;
	externalFactors: EcaasForm<ExternalFactorsData>;
}>;


const baseGeneralDetails = z.object({
	storeysInDwelling: z.int().min(1).max(250),
	numOfBedrooms: z.int().min(1),
	coolingRequired: z.boolean(),
});

const _generalDetailsData = z.discriminatedUnion("typeOfDwelling", [
	baseGeneralDetails.extend({ typeOfDwelling: z.literal(BuildType.flat), storeyOfFlat: z.number().min(-50).max(199) }),
	baseGeneralDetails.extend({ typeOfDwelling: z.literal(BuildType.house) })
]);

export type GeneralDetailsData = z.infer<typeof _generalDetailsData>;

const _shadingData = named.extend({
	startAngle: z.number().min(0).lt(360),
	endAngle: z.number().min(0).lt(360),
	objectType: z.enum(ShadingObjectType),
	height: z.number(),
	distance: z.number(),
});

export type ShadingData = z.infer<typeof _shadingData>;

const _externalFactorsData = z.object({
	altitude: z.number().min(-150).max(7200),
	typeOfExposure: z.enum(VentilationShieldClass),
	terrainType: z.enum(TerrainClass),
	noiseNuisance: z.boolean(),
});

export type ExternalFactorsData = z.infer<typeof _externalFactorsData>;

export interface DwellingFabric {
	dwellingSpaceZoneParameters: EcaasForm<DwellingSpaceZoneParametersData>;
	dwellingSpaceFloors: FloorsData;
	dwellingSpaceWalls: WallsData;
	dwellingSpaceCeilingsAndRoofs: CeilingsAndRoofsData;
	dwellingSpaceDoors: DoorsData;
	dwellingSpaceWindows: EcaasForm<WindowData[]>;
	dwellingSpaceThermalBridging: ThermalBridgingData;
	dwellingSpaceLighting: EcaasForm<DwellingSpaceLightingData>;
}

export interface FloorsData {
	dwellingSpaceGroundFloor: EcaasForm<GroundFloorData[]>,
	dwellingSpaceInternalFloor: EcaasForm<InternalFloorData[]>,
	dwellingSpaceExposedFloor: EcaasForm<ExposedFloorData[]>
}

export enum AdjacentSpaceType {
	heatedSpace = "heatedSpace",
	unheatedSpace = "unheatedSpace"
}

const baseInternalFloorData = named.extend({
	surfaceAreaOfElement: z.number(),
	kappaValue: z.number(),
	massDistributionClass,
});
const _internalFloorData = z.discriminatedUnion(
	"typeOfInternalFloor",
	[
		baseInternalFloorData.extend({
			typeOfInternalFloor: z.literal(AdjacentSpaceType.unheatedSpace),
			thermalResistanceOfAdjacentUnheatedSpace,
		}),
		baseInternalFloorData.extend({ 
			typeOfInternalFloor: z.literal(AdjacentSpaceType.heatedSpace)
		}),
	]
);

export type InternalFloorData = z.infer<typeof _internalFloorData>;

const _exposedFloorData = named.extend({
	pitch: z.number().min(0).lt(180),
	orientation,
	length: z.number().min(0.001).max(50),
	width: z.number().min(0.001).max(50),
	elevationalHeight: z.number().min(0).max(500),
	surfaceArea: z.number().min(0.01).max(10000),
	solarAbsorption: z.number(),
	uValue,
	kappaValue: z.number(),
	massDistributionClass,
});

export type ExposedFloorData = z.infer<typeof _exposedFloorData>;

const baseGroundFloorData = named.extend({
	surfaceArea: z.number().min(1),
	pitch: z.number(),
	uValue,
	thermalResistance: z.number().min(0.00001).max(50),
	kappaValue: z.number(),
	massDistributionClass,
	perimeter: z.number().min(0).max(1000),
	psiOfWallJunction: z.number().min(0).max(2),
	thicknessOfWalls: z.number(),
});
const _groundFloorData = z.discriminatedUnion(
	"typeOfGroundFloor",
	[
		baseGroundFloorData.extend({
			typeOfGroundFloor: z.literal(FloorType.Slab_edge_insulation),
			edgeInsulationType: z.enum(['horizontal', 'vertical']),
			// TODO constraints have not been put on zodUnit yet!
			edgeInsulationWidth: z.union([zodUnit('length'), z.number().min(0).max(10000)]), // number will be deprecated, preserved for backwards compatibility with old input data files
			edgeInsulationThermalResistance: z.number(),
		}),
		baseGroundFloorData.extend({
			typeOfGroundFloor: z.literal(FloorType.Slab_no_edge_insulation),
		}),
		baseGroundFloorData.extend({
			typeOfGroundFloor: z.literal(FloorType.Suspended_floor),
			heightOfFloorUpperSurface: z.number().min(0).max(100000),
			underfloorSpaceThermalResistance: z.number(),
			thermalTransmittanceOfWallsAboveGround: z.number(),
			ventilationOpeningsArea: z.number(),
			windShieldingFactor: z.enum(WindShieldLocation),
		}),
		baseGroundFloorData.extend({
			typeOfGroundFloor: z.literal(FloorType.Heated_basement),
			depthOfBasementFloorBelowGround: z.number(),
			thermalResistanceOfBasementWalls: z.number(),
		}),
		baseGroundFloorData.extend({
			typeOfGroundFloor: z.literal(FloorType.Unheated_basement),
			thermalTransmittanceOfFloorAboveBasement: z.number(),
			thermalTransmittanceOfWallsAboveGround: z.number(),
			depthOfBasementFloorBelowGround: z.number(),
			heightOfBasementWallsAboveGround: z.number(),
		}),
	]
);

export type GroundFloorData = z.infer<typeof _groundFloorData>;

export type WallsData = AssertFormKeysArePageIds<{
	dwellingSpaceExternalWall: EcaasForm<ExternalWallData[]>;
	dwellingSpaceInternalWall: EcaasForm<InternalWallData[]>;
	dwellingSpaceWallToUnheatedSpace: EcaasForm<WallsToUnheatedSpaceData[]>;
	dwellingSpacePartyWall: EcaasForm<PartyWallData[]>;
}>;

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type NonZeroDigit = Exclude<Digit, "0">;
type AngleString = `${'' | '-'}${NonZeroDigit | ''}${NonZeroDigit | ''}${Digit | ''}`;

export type PitchOption = AngleString | 'custom';

const _externalWallData = named.extend({
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
	orientation,
	height: z.number().min(0.001).max(50),
	length: z.number().min(0.001).max(50),
	elevationalHeight: z.number().min(0).max(500),
	surfaceArea: z.number().min(0.01).max(10000),
	solarAbsorption: z.number(),
	uValue,
	kappaValue: z.number(),
	massDistributionClass,
});

export type ExternalWallData = z.infer<typeof _externalWallData>;

const _internalWallData = named.extend({
	surfaceAreaOfElement: z.number().min(0).max(10000),
	kappaValue: z.number(),
	massDistributionClass,
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
});

export type InternalWallData = z.infer<typeof _internalWallData>;

const _wallsToUnheatedSpaceData = named.extend({
	surfaceAreaOfElement: z.number().min(0).max(10000),
	uValue,
	arealHeatCapacity: z.number(),
	massDistributionClass,
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
	thermalResistanceOfAdjacentUnheatedSpace,
});

export type WallsToUnheatedSpaceData = z.infer<typeof _wallsToUnheatedSpaceData>;

const _partyWallData = named.extend({
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
	orientation,
	length: z.number().min(0.001).max(50),
	height: z.number().min(0.001).max(50),
	elevationalHeight: z.number().min(0).max(500),
	surfaceArea: z.number().min(0.01).max(10000),
	solarAbsorption: z.number(),
	uValue,
	kappaValue: z.number(),
	massDistributionClass,
});

export type PartyWallData = z.infer<typeof _partyWallData>;

export type CeilingsAndRoofsData = AssertFormKeysArePageIds<{
	dwellingSpaceCeilings: EcaasForm<CeilingData[]>;
	dwellingSpaceRoofs: EcaasForm<RoofData[]>;
}>;

const baseCeilingData = named.extend({
	surfaceArea: z.number().min(0).max(10000),
	kappaValue: z.number(),
	massDistributionClass,
	pitchOption: zeroPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
});
const _ceilingData = z.discriminatedUnion(
	'type',
	[
		baseCeilingData.extend({
			type: z.literal(AdjacentSpaceType.heatedSpace),
		}),
		baseCeilingData.extend({
			type: z.literal(AdjacentSpaceType.unheatedSpace),
			thermalResistanceOfAdjacentUnheatedSpace,
			uValue,
		}),
	]
);

export type CeilingData = z.infer<typeof _ceilingData>;

const roofType = z.enum(['flat', 'pitchedInsulatedAtRoof', 'pitchedInsulatedAtCeiling', 'unheatedPitched']);

export type RoofType = z.infer<typeof roofType>;

const _roofData = named.extend({
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
	kappaValue: z.number(),
	massDistributionClass,
});

export type RoofData = z.infer<typeof _roofData>;

export type DoorsData = AssertFormKeysArePageIds<{
	dwellingSpaceExternalUnglazedDoor: EcaasForm<ExternalUnglazedDoorData[]>;
	dwellingSpaceExternalGlazedDoor: EcaasForm<ExternalGlazedDoorData[]>;
	dwellingSpaceInternalDoor: EcaasForm<InternalDoorData[]>;
}>;

const _externalUnglazedDoorData = named.extend({
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
	orientation,
	height: z.number().min(0.001).max(50),
	width: z.number().min(0.001).max(50),
	elevationalHeight: z.number().min(0).max(500),
	surfaceArea: z.number().min(0.01).max(10000),
	solarAbsorption: z.number().min(0.01).max(1),
	uValue,
	kappaValue: z.number(),
	massDistributionClass,
});

export type ExternalUnglazedDoorData = z.infer<typeof _externalUnglazedDoorData>;

const commonOpenablePartsFields = {
	maximumOpenableArea: z.number().min(0.01).max(10000),
	heightOpenableArea: z.number().min(0.001).max(50),
};

const onePartFields = { ...commonOpenablePartsFields, midHeightOpenablePart1: z.number().min(0).max(100) };
const twoPartFields = { ...onePartFields, midHeightOpenablePart2: z.number().min(0).max(100) };
const threePartFields = { ...twoPartFields, midHeightOpenablePart3: z.number().min(0).max(100) };
const fourPartFields = { ...threePartFields, midHeightOpenablePart4: z.number().min(0).max(100) };
const baseExternalGlazedDoorData = named.extend({
	orientation,
	surfaceArea: z.number().min(0.01).max(10000),
	height: z.number().min(0.001).max(50),
	width: z.number().min(0.001).max(50),
	uValue,
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
	solarTransmittance: z.number().min(0.01).max(1),
	elevationalHeight: z.number().min(0).max(500),
	midHeight: z.number().min(0).max(100),
	openingToFrameRatio: fraction,
});
const _externalGlazedDoorData = z.discriminatedUnion(
	'numberOpenableParts',
	[
		baseExternalGlazedDoorData.extend({
			numberOpenableParts: z.literal('0'),
		}),
		baseExternalGlazedDoorData.extend({
			numberOpenableParts: z.literal('1'),
			...onePartFields,
		}),
		baseExternalGlazedDoorData.extend({
			numberOpenableParts: z.literal('2'),
			...twoPartFields,
		}),
		baseExternalGlazedDoorData.extend({
			numberOpenableParts: z.literal('3'),
			...threePartFields,
		}),
		baseExternalGlazedDoorData.extend({
			numberOpenableParts: z.literal('4'),
			...fourPartFields,
		}),
	]
);

export type ExternalGlazedDoorData = z.infer<typeof _externalGlazedDoorData>;

const baseInternalDoorData = named.extend({
	surfaceArea: z.number().min(0).max(10000),
	kappaValue: z.number(),
	massDistributionClass,
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
});
const _internalDoorData = z.discriminatedUnion(
	'typeOfInternalDoor',
	[
		baseInternalDoorData.extend({
			typeOfInternalDoor: z.literal(AdjacentSpaceType.heatedSpace),
		}),
		baseInternalDoorData.extend({
			typeOfInternalDoor: z.literal(AdjacentSpaceType.unheatedSpace),
			uValue,
			thermalResistanceOfAdjacentUnheatedSpace,
		}),
	]
);

export type InternalDoorData = z.infer<typeof _internalDoorData>;

const baseWindowData = named.extend({
	orientation,
	surfaceArea: z.number().min(0.01).max(10000),
	height: z.number().min(0.001).max(50),
	width: z.number().min(0.001).max(50),
	uValue,
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
	solarTransmittance: z.number().min(0.01).max(1),
	elevationalHeight: z.number().min(0).max(500),
	midHeight: z.number().min(0).max(100),
	openingToFrameRatio: fraction,
});
const baseWindowPlusOpenableParts = z.discriminatedUnion(
	'numberOpenableParts',
	[
		baseWindowData.extend({
			numberOpenableParts: z.literal('0'),
		}),
		baseWindowData.extend({
			numberOpenableParts: z.literal('1'),
			...onePartFields,
		}),
		baseWindowData.extend({
			numberOpenableParts: z.literal('2'),
			...twoPartFields,
		}),
		baseWindowData.extend({
			numberOpenableParts: z.literal('3'),
			...threePartFields,
		}),
		baseWindowData.extend({
			numberOpenableParts: z.literal('4'),
			...fourPartFields,
		}),
	]
);

const overhangFields = z.union([
	z.object({
		overhangDepth: z.union([zodUnit('length'), z.number()]), // number will be deprecated, preserved for backwards compatibility with old input data files
		overhangDistance: z.union([zodUnit('length'), z.number()]), // number will be deprecated, preserved for backwards compatibility with old input data files
	}),
	z.object({
		overhangDepth: z.optional(z.undefined()),
		overhangDistance: z.optional(z.undefined()),
	}),
]);

const sideFinRightFields = z.union([
	z.object({
		sideFinRightDepth: z.union([zodUnit('length'), z.number()]), // number will be deprecated, preserved for backwards compatibility with old input data files
		sideFinRightDistance: z.union([zodUnit('length'), z.number()]), // number will be deprecated, preserved for backwards compatibility with old input data files
	}),
	z.object({
		sideFinRightDepth: z.optional(z.undefined()),
		sideFinRightDistance: z.optional(z.undefined()),
	}),
]);

const sideFinLeftFields = z.union([
	z.object({
		sideFinLeftDepth: z.union([zodUnit('length'), z.number()]), // number will be deprecated, preserved for backwards compatibility with old input data files
		sideFinLeftDistance: z.union([zodUnit('length'), z.number()]), // number will be deprecated, preserved for backwards compatibility with old input data files
	}),
	z.object({
		sideFinLeftDepth: z.optional(z.undefined()),
		sideFinLeftDistance: z.optional(z.undefined()),
	}),
]);

const curtainsOrBlindsFields = z.union([
	z.object({
		curtainsOrBlinds: z.literal(true),
		treatmentType: z.enum(WindowTreatmentType),
		curtainsControlObject: z.optional(z.enum(WindowTreatmentControl)),
		thermalResistivityIncrease: z.number().min(0).max(100),
		solarTransmittanceReduction: fraction,
	}),
	z.object({
		curtainsOrBlinds: z.literal(false),
	})
]);

export const windowData = z.intersection(
	baseWindowPlusOpenableParts,
	z.intersection(
		overhangFields,
		z.intersection(
			sideFinRightFields,
			z.intersection(
				sideFinLeftFields,
				curtainsOrBlindsFields,
			)
		),
	),
);

export type WindowData = z.infer<typeof windowData>;

export type ThermalBridgingData = AssertFormKeysArePageIds<{
	dwellingSpaceLinearThermalBridges: EcaasForm<LinearThermalBridgeData[]>;
	dwellingSpacePointThermalBridges: EcaasForm<PointThermalBridgeData[]>;
}>;

const _linearThermalBridgeData = named.extend({
	typeOfThermalBridge: z.string(),
	linearThermalTransmittance: z.number().min(0).max(2),
	length: z.number().min(0).max(10000),
});

export type LinearThermalBridgeData = z.infer<typeof _linearThermalBridgeData>;

const _pointThermalBridgeData = named.extend({
	heatTransferCoefficient: z.number(),
});

export type PointThermalBridgeData = z.infer<typeof _pointThermalBridgeData>;

const spaceCoolingSystemData = named;
const spaceHeatControlSystemData = named;

const _dwellingSpaceZoneParameterData = z.object({
	area: z.number().min(0),
	volume: z.number().min(0),
	spaceHeatingSystemForThisZone: z.optional(z.string()),
	spaceCoolingSystemForThisZone: z.optional(z.array(spaceCoolingSystemData)),
	spaceHeatControlSystemForThisZone: z.optional(z.array(spaceHeatControlSystemData)),
});

export type DwellingSpaceZoneParametersData = z.infer<typeof _dwellingSpaceZoneParameterData>;

const _dwellingSpaceLightingData = z.object({
	numberOfLEDBulbs: z.int().min(0),
	numberOfIncandescentBulbs: z.int().min(0),
});

export type DwellingSpaceLightingData = z.infer<typeof _dwellingSpaceLightingData>;

const _spaceHeatingSystemData = named;

export type SpaceHeatingSystemData = z.infer<typeof _spaceHeatingSystemData>;

export type SpaceCoolingSystemData = z.infer<typeof spaceCoolingSystemData>;

export type SpaceHeatControlSystemData = z.infer<typeof spaceHeatControlSystemData>;

export interface DomesticHotWater {
	waterHeating: WaterHeating;
	hotWaterOutlets: HotWaterOutlets;
	pipework: Pipework;
	wwhrs: EcaasForm<WwhrsData[]>
}

export type WaterHeating = AssertFormKeysArePageIds<{
	hotWaterCylinder: EcaasForm<HotWaterCylinderData[]>;
	immersionHeater: EcaasForm<ImmersionHeaterData[]>;
	solarThermal: EcaasForm<SolarThermalData[]>;
	pointOfUse: EcaasForm<PointOfUseData[]>;
	heatPump: EcaasForm<HotWaterHeatPumpData[]>;
	combiBoiler: EcaasForm<CombiBoilerData[]>;
	heatBattery: EcaasForm<WaterHeatingHeatBatteryData[]>;
	smartHotWaterTank: EcaasForm<SmartHotWaterTankData[]>;
	heatInterfaceUnit: EcaasForm<WaterHeatingHeatInterfaceUnitData[]>;
}>;

const _hotWaterCylinderData = namedWithId.extend({
	heatSource: z.string(),
	storageCylinderVolume: z.union([zodUnit('volume'), z.number()]), // number will be deprecated, preserved for backwards compatibility with old input data files
	dailyEnergyLoss: z.number(),
});

export type HotWaterCylinderData = z.infer<typeof _hotWaterCylinderData>;

const immersionHeaterPosition = z.enum(['top', 'middle', 'bottom']);

export type ImmersionHeaterPosition = z.infer<typeof immersionHeaterPosition>;

const _immersionHeaterData = named.extend({
	ratedPower: z.number(),
	heaterPosition: immersionHeaterPosition,
	thermostatPosition: immersionHeaterPosition,
});

export type ImmersionHeaterData = z.infer<typeof _immersionHeaterData>;

export type SolarThermalData = z.infer<typeof named>;

const _pointOfUseData = named.extend({
	setpointTemperature: z.number(),
	heaterEfficiency: fraction,
});

export type PointOfUseData = z.infer<typeof _pointOfUseData>;

export type HotWaterHeatPumpData = z.infer<typeof named>;

export type CombiBoilerData = z.infer<typeof named>;

export type WaterHeatingHeatBatteryData = z.infer<typeof named>;

export type SmartHotWaterTankData = z.infer<typeof named>;

export type WaterHeatingHeatInterfaceUnitData = z.infer<typeof named>;

export type HotWaterOutlets = AssertFormKeysArePageIds<{
	mixedShower: EcaasForm<MixedShowerData[]>;
	electricShower: EcaasForm<ElectricShowerData[]>;
	bath: EcaasForm<BathData[]>;
	otherOutlets: EcaasForm<OtherHotWaterOutletData[]>;
}>;

const _mixedShowerData = namedWithId.extend({
	flowRate: z.number().min(8).max(15),
});

export type MixedShowerData = z.infer<typeof _mixedShowerData>;

const _electricShowerData = namedWithId.extend({
	ratedPower: z.number().min(0).max(30),
});

export type ElectricShowerData = z.infer<typeof _electricShowerData>;

const _bathData = namedWithId.extend({
	size: z.number().min(0).max(500),
	flowRate: z.number().min(0).max(15),
});

export type BathData = z.infer<typeof _bathData>;

const _otherHotWaterOutletData = namedWithId.extend({
	flowRate: z.number().min(0).max(15),
});

export type OtherHotWaterOutletData = z.infer<typeof _otherHotWaterOutletData>;

export type Pipework = AssertFormKeysArePageIds<{
	primaryPipework: EcaasForm<PrimaryPipeworkData[]>;
	secondaryPipework: EcaasForm<SecondaryPipeworkData[]>;
}>;

const _primaryPipeworkData = z.object({
	name: z.string().trim().min(1),
	internalDiameter: z.number(),
	externalDiameter: z.number(),
	length: z.number().min(0).max(200),
	insulationThickness: z.number(),
	thermalConductivity: z.number(),
	surfaceReflectivity: z.boolean(),
	pipeContents: z.enum(WaterPipeContentsType),
	hotWaterCylinder: z.string(),
	location: z.enum(WaterPipeworkLocation),
});

export type PrimaryPipeworkData = z.infer<typeof _primaryPipeworkData>;

const _secondaryPipeworkData = z.object({
	name: z.string().trim().min(1),
	length: z.number().min(0).max(200),
	location: z.enum(WaterPipeworkLocation),
	internalDiameter: z.number().min(1).max(50),
});

export type SecondaryPipeworkData = z.infer<typeof _secondaryPipeworkData>;

const _wwhrsData = z.object({
	name: z.string().trim().min(1),
	outlet: z.string(),
	type: z.enum(WwhrsType),
	flowRate: z.number().min(0.1).max(500),
	efficiency: percentage,
	proportionOfUse: fraction,
});

export type WwhrsData = z.infer<typeof _wwhrsData>;

export type InfiltrationAndVentilation = AssertFormKeysArePageIds<{
	mechanicalVentilation: EcaasForm<MechanicalVentilationData[]>;
	ductwork: EcaasForm<DuctworkData[]>
	vents: EcaasForm<VentData[]>;
	combustionAppliances: CombustionAppliancesData;
	naturalVentilation: EcaasForm<VentilationData>;
	airPermeability: EcaasForm<AirPermeabilityData>;
}>;

const baseMechanicalVentilationData = namedWithId.extend({
	airFlowRate: z.union([zodUnit('flow rate'), z.number()]),
});

const _mechanicalVentilationData = z.discriminatedUnion(
	'typeOfMechanicalVentilationOptions',
	[
		baseMechanicalVentilationData.extend({
			typeOfMechanicalVentilationOptions: z.literal(VentType.Intermittent_MEV),
		}),
		baseMechanicalVentilationData.extend({
			typeOfMechanicalVentilationOptions: z.literal(VentType.Centralised_continuous_MEV),
		}),
		baseMechanicalVentilationData.extend({
			typeOfMechanicalVentilationOptions: z.literal(VentType.Decentralised_continuous_MEV),
		}),
		baseMechanicalVentilationData.extend({
			typeOfMechanicalVentilationOptions: z.literal(VentType.MVHR),
			mvhrLocation: z.enum(MVHRLocation),
			mvhrEfficiency: fraction,
		}),
		baseMechanicalVentilationData.extend({
			typeOfMechanicalVentilationOptions: z.literal(VentType.PIV),
		}),
	]
);

export type MechanicalVentilationData = z.infer<typeof _mechanicalVentilationData>;

const baseDuctworkData = named.extend({
	mvhrUnit: z.string(),
	ductworkCrossSectionalShape: z.enum(DuctShape),
	ductType: z.enum(DuctType),
	insulationThickness: z.number().min(0).max(100),
	lengthOfDuctwork: z.number().min(0),
	thermalInsulationConductivityOfDuctwork: z.number().min(0),
	surfaceReflectivity: z.boolean(),
});
const _ductworkData = z.discriminatedUnion(
	'ductworkCrossSectionalShape',
	[
		baseDuctworkData.extend({
			ductworkCrossSectionalShape: z.literal(DuctShape.circular),
			internalDiameterOfDuctwork: z.number().min(0).max(1000),
			externalDiameterOfDuctwork: z.number().min(0).max(1000),
		}),
		baseDuctworkData.extend({
			ductworkCrossSectionalShape: z.literal(DuctShape.rectangular),
			ductPerimeter: z.number().min(0).max(1000),
		}),
	]
);

export type DuctworkData = z.infer<typeof _ductworkData>;

const _ventData = z.object({
	name: z.string().trim().min(1),
	typeOfVent: z.enum(['trickle', 'airBrick']),
	effectiveVentilationArea: z.number().min(1).max(999999),
	openingRatio: z.number(),
	midHeightOfZone: z.number().min(1).max(60),
	orientation,
	pitch: z.number().min(0).lt(180),
});

export type VentData = z.infer<typeof _ventData>;

export type CombustionAppliancesData = Record<CombustionApplianceType, EcaasForm<CombustionApplianceData[]>>;

const _combustionApplianceData = named.extend({
	airSupplyToAppliance: z.enum(CombustionAirSupplySituation),
	exhaustMethodFromAppliance: z.enum(FlueGasExhaustSituation),
	typeOfFuel: z.enum(CombustionFuelType),
});

export type CombustionApplianceData = z.infer<typeof _combustionApplianceData>;

const _ventilationData = z.object({
	ventilationZoneHeight: z.number().min(1).max(20),
	dwellingEnvelopeArea: z.number().min(5).max(72000),
	dwellingElevationalLevelAtBase: z.number().min(-150).max(750),
	crossVentilationPossible: z.boolean(),
	maxRequiredAirChangeRate: z.number(),
});

export type VentilationData = z.infer<typeof _ventilationData>;

const _airPermeability = z.object({
	testPressure: z.number().min(0).max(500),
	airTightnessTestResult: z.number(),
});

export type AirPermeabilityData = z.infer<typeof _airPermeability>;

export type HeatingSystems = AssertEachKeyIsPageId<{
	heatGeneration: HeatGeneration,
	energySupply: EcaasForm<EnergySupplyData>;
	heatEmitting: HeatEmitting;
}>;

export type HeatGeneration = AssertFormKeysArePageIds<{
	heatPump: EcaasForm<HeatPumpData[]>;
	boiler: EcaasForm<BoilerData[]>;
	heatBattery: EcaasForm<HeatBatteryData[]>;
	heatNetwork: EcaasForm<HeatNetworkData[]>;
	heatInterfaceUnit: EcaasForm<HeatInterfaceUnitData[]>;
}>;

const _heatPumpData = namedWithId.extend({
	productReference: z.string().trim().min(1),
});

export type HeatPumpData = z.infer<typeof _heatPumpData>;

export type BoilerData = z.infer<typeof namedWithId>;

export type HeatBatteryData = z.infer<typeof namedWithId>;

export type HeatNetworkData = z.infer<typeof namedWithId>;

export type HeatInterfaceUnitData = z.infer<typeof namedWithId>;

const _energySupplyData = z.object({
	fuelType: z.array(z.enum(FuelType)),
	co2PerKwh: z.optional(z.number()),
	co2PerKwhIncludingOutOfScope: z.optional(z.number()),
	kwhPerKwhDelivered: z.optional(z.number()),
	exported: z.optional(z.boolean()),
});

export type EnergySupplyData = z.infer<typeof _energySupplyData>;

export type HeatEmitting = AssertFormKeysArePageIds<{
	wetDistribution: EcaasForm<WetDistributionData[]>;
	instantElectricHeater: EcaasForm<InstantElectricStorageData[]>;
	electricStorageHeater: EcaasForm<ElectricStorageHeaterData[]>;
	warmAirHeatPump: EcaasForm<WarmAirHeatPumpData[]>;
}>;

export type ElectricStorageHeaterData = z.infer<typeof named>;

const _instantElectricStorageData = named.extend({
	ratedPower: z.number().min(0).max(70),
	convectionFractionInstant: z.number().min(0.01).max(1),
});

export type InstantElectricStorageData = z.infer<typeof _instantElectricStorageData>;

export type WarmAirHeatPumpData = z.infer<typeof named>;

const baseWetDistributionData = named.extend({
	heatSource: z.string(),
	thermalMass: z.number(),
	designTempDiffAcrossEmitters: z.number(),
	designFlowTemp: z.number(),
	designFlowRate: z.number(),
	ecoDesignControllerClass: z.enum(['1', '2', '3', '4', '5', '6', '7', '8']),
	minimumFlowTemp: z.number().min(20).max(120),
	minOutdoorTemp: z.number(),
	maxOutdoorTemp: z.number(),
	convectionFractionWet: fraction,
});
const _wetDistributionData = z.discriminatedUnion(
	'typeOfSpaceHeater',
	[
		baseWetDistributionData.extend({
			typeOfSpaceHeater: z.literal('radiator'),
			numberOfRadiators: z.int().min(1),
			exponent: z.number(),
			constant: z.number(),
		}),
		baseWetDistributionData.extend({
			typeOfSpaceHeater: z.literal('ufh'),
			emitterFloorArea: z.number(),
			equivalentThermalMass: z.number(),
			systemPerformanceFactor: z.number(),
		}),
	]
);

export type WetDistributionData = z.infer<typeof _wetDistributionData>;

export type PvAndBatteries = AssertFormKeysArePageIds<{
	pvSystems: EcaasForm<PvSystemData[]>;
	electricBattery: EcaasForm<ElectricBatteryData[]>;
}>;

const _pvSystemData = z.object({
	name: z.string().trim().min(1),
	peakPower: z.number().min(0.001).max(100),
	ventilationStrategy: z.enum(OnSiteGenerationVentilationStrategy),
	pitch: z.number().min(0).max(90),
	orientation,
	elevationalHeight: z.number().min(0).max(500),
	lengthOfPV: z.number().min(0).max(100),
	widthOfPV: z.number().min(0).max(100),
	inverterPeakPowerAC: z.number(),
	inverterPeakPowerDC: z.number(),
	inverterIsInside: z.boolean(),
	inverterType: z.enum(InverterType),
	aboveDepth: z.optional(z.number()),
	aboveDistance: z.optional(z.number()),
	leftDepth: z.optional(z.number()),
	leftDistance: z.optional(z.number()),
	rightDepth: z.optional(z.number()),
	rightDistance: z.optional(z.number()),
});

export type PvSystemData = z.infer<typeof _pvSystemData>;

const _electricBatteryData = z.object({
	name: z.string().trim().min(1),
	capacity: z.number().min(0).max(50),
	batteryAge: z.number().min(0).max(100),
	chargeEfficiency: fraction,
	location: z.enum(BatteryLocation),
	gridChargingPossible: z.boolean(),
	maximumChargeRate: z.number(),
	minimumChargeRate: z.number(),
	maximumDischargeRate: z.number(),
}).refine((val) => val.maximumChargeRate >= val.minimumChargeRate, { error: "Maximum charge rate should be greater or equal to minimum charge rate.", abort: true });

export type ElectricBatteryData = z.infer<typeof _electricBatteryData>;

const _pvDiverterData = named.and(z.union([
	z.object({
		energyDivertedToHeatGeneration: z.string(),
	}),
	z.object({
		energyDivertedToHotWaterCylinder: z.string(),
	}),
]));

export type PvDiverterData = z.infer<typeof _pvDiverterData>;

export interface Cooling {
	airConditioning: EcaasForm<AirConditioningData[]>;
}

const _airConditioningData = z.object({
	name: z.string().trim().min(1),
	coolingCapacity: z.number(),
	seasonalEnergyEfficiencyRatio: z.number().min(0).max(25),
	convectionFraction: fraction,
});

export type AirConditioningData = z.infer<typeof _airConditioningData>;

export type UsesPitchComponent = {
	pitch?: number;
	pitchOption: PitchOption;
};

export type ComplianceResult = TaggedUnion<'resultType', {
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