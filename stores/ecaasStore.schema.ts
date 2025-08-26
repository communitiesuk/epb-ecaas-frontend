import type { EmptyObject, TaggedUnion } from "type-fest";
import type { PageId } from "~/data/pages/pages";
import type { Length } from "~/utils/units/length";
import type { Volume } from "~/utils/units/volume";
import type { ProductReference } from "~/pcdb/products";
import { CombustionAirSupplySituation, FlueGasExhaustSituation, MassDistributionClass, WaterPipeContentsType, OnSiteGenerationVentilationStrategy, type BuildType, BatteryLocation, CombustionFuelType, FuelType, InverterType, ShadingObjectType, TerrainClass, VentilationShieldClass, WaterPipeworkLocation, WwhrsType, type CombustionApplianceType, type DuctShape, type DuctType, type FloorType, type MVHRLocation, type VentType, type WindowTreatmentControl, type WindowTreatmentType, type SchemaFhsComplianceResponse, type SchemaJsonApiOnePointOneErrorLinks, type SchemaJsonApiOnePointOneErrorSource, type SchemaJsonApiOnePointOneMeta, type WindShieldLocation } from "~/schema/api-schema.types";
import type { FlowRate } from "~/utils/units/flowRate";
import * as z from "zod";
import { zeroPitchOption } from "~/utils/pitchOptions";

const fraction = z.number().min(0).max(1);
const orientation = z.number().min(0).lt(360);
const percentage = z.number().min(0).max(100);
const named = z.object({
	name: z.string().trim().min(1),
});
const namedWithId = named.extend({
	id: z.uuidv4().readonly(),
});
const massDistributionClass = z.enum(MassDistributionClass);

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
	generalSpecifications: EcaasForm<Partial<GeneralDetailsData>>;
	shading: EcaasForm<ShadingData[]>;
	externalFactors: EcaasForm<ExternalFactorsData>;
}>;

export type GeneralDetailsData = {
	typeOfDwelling: BuildType;
	storeysInDwelling: number;
	numOfBedrooms: number;
	coolingRequired: boolean;
} & TaggedUnion<'typeOfDwelling', {
	[BuildType.flat]: {
		storeyOfFlat: number;
	};
	[BuildType.house]: EmptyObject;
}>;

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

export type InternalFloorData = {
	name: string;
	surfaceAreaOfElement: number;
	kappaValue: number;
	massDistributionClass: MassDistributionClass;
} & TaggedUnion<'typeOfInternalFloor', {
	[AdjacentSpaceType.unheatedSpace]: {thermalResistanceOfAdjacentUnheatedSpace: number;}
	[AdjacentSpaceType.heatedSpace]: EmptyObject;
}>;

const _exposedFloorData = named.extend({
	pitch: z.number().min(0).lt(180),
	orientation,
	length: z.number().min(0.001).max(50),
	width: z.number().min(0.001).max(50),
	elevationalHeight: z.number().min(0).max(500),
	surfaceArea: z.number().min(0.01).max(10000),
	solarAbsorption: z.number(),
	uValue: z.number().min(0.01).max(10),
	kappaValue: z.number(),
	massDistributionClass,
});

export type ExposedFloorData = z.infer<typeof _exposedFloorData>;

export type GroundFloorData = {
	name: string;
	surfaceArea: number;
	pitch: number;
	uValue: number;
	thermalResistance: number;
	kappaValue: number;
	massDistributionClass: MassDistributionClass;
	perimeter: number;
	psiOfWallJunction: number;
	thicknessOfWalls: number;
} & TaggedUnion<'typeOfGroundFloor', {
	[FloorType.Slab_edge_insulation]: {
		edgeInsulationType: "horizontal" | "vertical";
		edgeInsulationWidth: Length | number; // number will be deprecated, preserved for backwards compatibility with old input data files
		edgeInsulationThermalResistance: number;
	},
	[FloorType.Slab_no_edge_insulation]: EmptyObject,
	[FloorType.Suspended_floor]: {
		heightOfFloorUpperSurface: number;
		underfloorSpaceThermalResistance: number;
		thermalTransmittanceOfWallsAboveGround: number;
		ventilationOpeningsArea: number;
		windShieldingFactor: WindShieldLocation;
	},
	[FloorType.Heated_basement]: {
		depthOfBasementFloorBelowGround: number;
		thermalResistanceOfBasementWalls: number;
	},
	[FloorType.Unheated_basement]: {
		thermalTransmittanceOfFloorAboveBasement: number;
		thermalTransmittanceOfWallsAboveGround: number;
		depthOfBasementFloorBelowGround: number;
		heightOfBasementWallsAboveGround: number;
	}
}>;

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
	uValue: z.number().min(0.01).max(10),
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
	uValue: z.number().min(0.01).max(10),
	arealHeatCapacity: z.number(),
	massDistributionClass,
	pitchOption: standardPitchOption,
	pitch: z.optional(z.number().min(0).lt(180)),
	thermalResistanceOfAdjacentUnheatedSpace: z.number().min(0).max(3),
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
	uValue: z.number().min(0.01).max(10),
	kappaValue: z.number(),
	massDistributionClass,
});

export type PartyWallData = z.infer<typeof _partyWallData>;

export type CeilingsAndRoofsData = AssertFormKeysArePageIds<{
	dwellingSpaceCeilings: EcaasForm<CeilingData[]>;
	dwellingSpaceRoofs: EcaasForm<RoofData[]>;
}>;

export type CeilingData = {
	name: string;
	surfaceArea: number;
	kappaValue: number;
	massDistributionClass: MassDistributionClass;
	pitchOption: ZeroPitchOption;
	pitch?: number;
} & TaggedUnion<'type', {
	[AdjacentSpaceType.heatedSpace]: EmptyObject;
	[AdjacentSpaceType.unheatedSpace]: {
		thermalResistanceOfAdjacentUnheatedSpace: number;
		uValue: number;
	}
}>;

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
	uValue: z.number().min(0.01).max(10),
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
	uValue: z.number().min(0.01).max(10),
	kappaValue: z.number(),
	massDistributionClass,
});

export type ExternalUnglazedDoorData = z.infer<typeof _externalUnglazedDoorData>;

type CommonOpenablePartsFields = {
	maximumOpenableArea: number;
	heightOpenableArea: number;
};
type OnePartFields = CommonOpenablePartsFields & {
	midHeightOpenablePart1: number;
};
type TwoPartsFields = OnePartFields & {
	midHeightOpenablePart2: number;
};
type ThreePartsFields = TwoPartsFields & {
	midHeightOpenablePart3: number;
};
type FourPartsFields = ThreePartsFields & {
	midHeightOpenablePart4: number;
};

export type ExternalGlazedDoorData = {
	name: string;
	orientation: number;
	surfaceArea: number;
	height: number;
	width: number;
	uValue: number;
	pitchOption: StandardPitchOption;
	pitch?: number;
	solarTransmittance: number;
	elevationalHeight: number;
	midHeight: number;
	openingToFrameRatio: number;
} & TaggedUnion<'numberOpenableParts', {
	'0': EmptyObject;
	'1': OnePartFields;
	'2': TwoPartsFields;
	'3': ThreePartsFields;
	'4': FourPartsFields;
}>;

export type InternalDoorData = {
	name: string;
	surfaceArea: number;
	kappaValue: number;
	massDistributionClass: MassDistributionClass;
	pitchOption: StandardPitchOption;
	pitch?: number;
} & TaggedUnion<'typeOfInternalDoor', {
	[AdjacentSpaceType.heatedSpace]: EmptyObject;
	[AdjacentSpaceType.unheatedSpace]: {
		uValue: number,
		thermalResistanceOfAdjacentUnheatedSpace: number;
	}
}>;

export type WindowData = {
	name: string;
	orientation: number;
	surfaceArea: number;
	height: number;
	width: number;
	uValue: number;
	pitchOption: StandardPitchOption;
	pitch?: number;
	solarTransmittance: number;
	elevationalHeight: number;
	midHeight: number;
	openingToFrameRatio: number;
} & TaggedUnion<'numberOpenableParts', {
	'0': EmptyObject;
	'1': OnePartFields;
	'2': TwoPartsFields;
	'3': ThreePartsFields;
	'4': FourPartsFields;
}> & ({
	overhangDepth: Length | number; // number will be deprecated, preserved for backwards compatibility with old input data files
	overhangDistance: Length | number; // number will be deprecated, preserved for backwards compatibility with old input data files
} | EmptyObject) & ({
	sideFinRightDepth: Length | number; // number will be deprecated, preserved for backwards compatibility with old input data files
	sideFinRightDistance: Length | number; // number will be deprecated, preserved for backwards compatibility with old input data files
} | EmptyObject) & ({
	sideFinLeftDepth: Length | number; // number will be deprecated, preserved for backwards compatibility with old input data files
	sideFinLeftDistance: Length | number; // number will be deprecated, preserved for backwards compatibility with old input data files
} | EmptyObject) & ({
	curtainsOrBlinds: true;
	treatmentType: WindowTreatmentType;
	curtainsControlObject?: WindowTreatmentControl;
	thermalResistivityIncrease: number;
	solarTransmittanceReduction: number;
} | {
	curtainsOrBlinds: false;
	treatmentType?: undefined;
	curtainsControlObject?: never;
	thermalResistivityIncrease?: never;
	solarTransmittanceReduction?: never;
});

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

export type HotWaterCylinderData = {
	readonly id: string;
	name: string;
	heatSource: string;
	storageCylinderVolume: Volume | number; // number will be deprecated, preserved for backwards compatibility with old input data files
	dailyEnergyLoss: number;
};

const immersionHeaterPosition = () => z.enum(['top', 'middle', 'bottom']);

export type ImmersionHeaterPosition = z.infer<ReturnType<typeof immersionHeaterPosition>>;

const _immersionHeaterData = named.extend({
	ratedPower: z.number(),
	heaterPosition: immersionHeaterPosition(),
	thermostatPosition: immersionHeaterPosition(),
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

export type MechanicalVentilationData = {
	readonly id: string;
	name: string;
	typeOfMechanicalVentilationOptions: VentType;
	airFlowRate: FlowRate | number; // number will be deprecated, preserved for backwards compatibility with old input data files
} & TaggedUnion<'typeOfMechanicalVentilationOptions', {
	[VentType.Intermittent_MEV]: EmptyObject;
	[VentType.Centralised_continuous_MEV]: EmptyObject;
	[VentType.Decentralised_continuous_MEV]: EmptyObject;
	[VentType.MVHR]: {
		mvhrLocation: MVHRLocation;
		mvhrEfficiency: number;
	};
	[VentType.PIV]: EmptyObject;
}>;

export type DuctworkData = {
	name: string;
	mvhrUnit: string;
	ductworkCrossSectionalShape: DuctShape;
	ductType: DuctType;
	insulationThickness: number;
	lengthOfDuctwork: number;
	thermalInsulationConductivityOfDuctwork: number;
	surfaceReflectivity: boolean;
} & TaggedUnion<'ductworkCrossSectionalShape', {
	[DuctShape.circular]: {
		internalDiameterOfDuctwork: number;
		externalDiameterOfDuctwork: number;
	};
	[DuctShape.rectangular]: {
		ductPerimeter: number;
	};
}>;

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

export type HeatPumpData = {
	readonly id: string;
	name: string;
	productReference: ProductReference;
};

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

export type WetDistributionData = {
	name: string
	heatSource: string,
	thermalMass: number,
	designTempDiffAcrossEmitters: number,
	designFlowTemp: number,
	designFlowRate: number,
	ecoDesignControllerClass: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8',
	minimumFlowTemp: number,
	minOutdoorTemp: number,
	maxOutdoorTemp: number,
	convectionFractionWet: number,
} & TaggedUnion<'typeOfSpaceHeater', {
	radiator: {
		numberOfRadiators: number,
		exponent: number, 
		constant: number,
	},
	ufh: {
		emitterFloorArea: number,
		equivalentThermalMass: number,
		systemPerformanceFactor: number,
	}
}>;

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

export type PvDiverterData = {
	name: string;
} & ({ energyDivertedToHeatGeneration: string; } | { energyDivertedToHotWaterCylinder: string; });

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