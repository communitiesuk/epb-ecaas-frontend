import type { EmptyObject, TaggedUnion } from "type-fest";
import type { BuildType, BatteryLocation, CombustionAirSupplySituation, CombustionApplianceType, CombustionFuelType, DuctShape, DuctType, FloorType, FlueGasExhaustSituation, MassDistributionClass, MVHRLocation, OnSiteGenerationVentilationStrategy, ShadingObjectType, SupplyAirFlowRateControlType, TerrainClass, VentilationShieldClass, VentType, WaterPipeContentsType, WaterPipeworkLocation, WindowTreatmentControl, WindowTreatmentType, WwhrsType, InverterType, FuelType, SchemaFhsComplianceResponse, SchemaJsonApiOnePointOneErrorLinks, SchemaJsonApiOnePointOneErrorSource, SchemaJsonApiOnePointOneMeta } from "~/schema/api-schema.types";

export interface EcaasState {
	dwellingDetails: DwellingDetails;
	domesticHotWater: DomesticHotWater;
	livingSpaceFabric: LivingSpaceFabric;
	infiltrationAndVentilation: InfiltrationAndVentilation;
	heatingSystems: HeatingSystems;
	pvAndBatteries: PvAndBatteries;
	cooling: Cooling;
	lastResult?: ComplianceResult;
}

export interface EcaasForm<T> {
	complete?: boolean;
	data: T;
}

export interface DwellingDetails {
	generalSpecifications: EcaasForm<Partial<GeneralSpecificationsData>>;
	shading: EcaasForm<ShadingData[]>;
	externalFactors: EcaasForm<ExternalFactorsData>;
}

export type GeneralSpecificationsData = {
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

export type ShadingData = {
	name: string;
	startAngle: number;
	endAngle: number;
	objectType: ShadingObjectType;
	height: number;
	distance: number;
};

export interface ExternalFactorsData {
	altitude: number;
	typeOfExposure: VentilationShieldClass;
	terrainType: TerrainClass;
	noiseNuisance: boolean;
}

export interface LivingSpaceFabric {
	livingSpaceZoneParameters: EcaasForm<LivingSpaceZoneParametersData>;
	livingSpaceFloors: FloorsData;
	livingSpaceWalls: WallsData;
	livingSpaceCeilingsAndRoofs: CeilingsAndRoofsData;
	livingSpaceDoors: DoorsData;
	livingSpaceWindows: EcaasForm<WindowData[]>;
	livingSpaceThermalBridging: ThermalBridgingData;
}

export interface FloorsData {
	livingSpaceGroundFloor: EcaasForm<GroundFloorData[]>,
	livingSpaceInternalFloor: EcaasForm<InternalFloorData[]>,
	livingSpaceExposedFloor: EcaasForm<ExposedFloorData[]>
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

export type ExposedFloorData = {
	name: string;
	pitch: number;
	orientation: number;
	length: number;
	width: number;
	elevationalHeight: number;
	surfaceArea: number;
	solarAbsorption: number;
	uValue: number;
	kappaValue: number;
	massDistributionClass: MassDistributionClass;
};

export type GroundFloorData = {
	name: string;
	surfaceAreaInZone: number;
	surfaceAreaAllZones: number;
	pitch: number;
	uValue: number;
	thermalResistanceOfFloorConstruction: number;
	kappaValue: number;
	massDistributionClass: MassDistributionClass;
	perimeter: number;
	psiOfWallJunction: number;
} & TaggedUnion<'typeOfGroundFloor', {
	[FloorType.Slab_edge_insulation]: {
		edgeInsulationType: "horizontal" | "vertical";
		edgeInsulationWidth: number;
		edgeInsulationThermalResistance: number;
	},
	[FloorType.Slab_no_edge_insulation]: EmptyObject,
	[FloorType.Suspended_floor]: {
		heightOfFloorUpperSurface: number;
		thicknessOfWalls: number;
		underfloorSpaceThermalResistance: number;
		thermalTransmittanceOfWallsAboveGround: number;
		ventilationOpeningsArea: number;
	},
	[FloorType.Heated_basement]: {
		thicknessOfWalls: number;
		depthOfBasementFloorBelowGround: number;
		thermalResistanceOfBasementWalls: number;
	},
	[FloorType.Unheated_basement]: {
		thermalTransmittanceOfFloorAboveBasement: number;
		thermalTransmittanceOfWallsAboveGround: number;
		thicknessOfWalls: number;
		depthOfBasementFloorBelowGround: number;
		heightOfBasementWallsAboveGround: number;
	}
}>;

export interface WallsData {
	livingSpaceExternalWall: EcaasForm<ExternalWallData[]>;
	livingSpaceInternalWall: EcaasForm<InternalWallData[]>;
	livingSpaceWallToUnheatedSpace: EcaasForm<WallsToUnheatedSpaceData[]>;
	livingSpacePartyWall: EcaasForm<PartyWallData[]>;
}

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type NonZeroDigit = Exclude<Digit, "0">;
type AngleString = `${'' | '-'}${NonZeroDigit | ''}${NonZeroDigit | ''}${Digit | ''}`;

export type PitchOption = AngleString | 'custom';

export type StandardPitchOption = '90' | 'custom';

export type ExternalWallData = {
	name: string;
	pitchOption: StandardPitchOption;
	pitch?: number;
	orientation: number;
	height: number;
	length: number;
	elevationalHeight: number;
	surfaceArea: number;
	solarAbsorption: number;
	uValue: number;
	kappaValue: number;
	massDistributionClass: MassDistributionClass;
};

export type InternalWallData = {
	name: string;
	surfaceAreaOfElement: number;
	kappaValue: number;
	massDistributionClass: MassDistributionClass;
	pitchOption: StandardPitchOption;
	pitch?: number;
};

export type WallsToUnheatedSpaceData = {
	name: string;
	surfaceAreaOfElement: number;
	uValue: number;
	arealHeatCapacity: number;
	massDistributionClass: MassDistributionClass;
	pitchOption: StandardPitchOption;
	pitch?: number;
	thermalResistanceOfAdjacentUnheatedSpace: number;
};

export type PartyWallData = {
	name: string;
	pitchOption: StandardPitchOption;
	pitch?: number;
	orientation: number;
	length: number;
	height: number;
	elevationalHeight: number;
	surfaceArea: number;
	solarAbsorption: number;
	uValue: number;
	kappaValue: number;
	massDistributionClass: MassDistributionClass;
};

export interface CeilingsAndRoofsData {
	livingSpaceCeilings: EcaasForm<CeilingData[]>;
	livingSpaceRoofs: EcaasForm<RoofData[]>;
	livingSpaceUnheatedPitchedRoofs: EcaasForm<RoofData[]>;
}

export type ZeroPitchOption = '0' | 'custom';

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

export type RoofType = 'flat' | 'pitchedInsulatedAtRoof' | 'pitchedInsulatedAtCeiling' | 'unheatedPitched';

export type RoofData = {
	name: string;
	typeOfRoof: RoofType;
	pitchOption?: ZeroPitchOption;
	pitch: number;
	orientation?: number;
	length: number;
	width: number;
	elevationalHeightOfElement: number;
	surfaceArea: number;
	solarAbsorptionCoefficient: number;
	uValue: number;
	kappaValue: number;
	massDistributionClass: MassDistributionClass;
};

export interface DoorsData {
	livingSpaceExternalUnglazedDoor: EcaasForm<ExternalUnglazedDoorData[]>;
	livingSpaceExternalGlazedDoor: EcaasForm<ExternalGlazedDoorData[]>;
	livingSpaceInternalDoor: EcaasForm<InternalDoorData[]>;
};

export type ExternalUnglazedDoorData = {
	name: string;
	pitchOption: StandardPitchOption;
	pitch?: number;
	orientation: number;
	height: number;
	width: number;
	elevationalHeight: number;
	surfaceArea: number;
	solarAbsorption: number;
	uValue: number;
	kappaValue: number;
	massDistributionClass: MassDistributionClass;
};

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
	frameToOpeningRatio: number;
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
	frameToOpeningRatio: number;
} & TaggedUnion<'numberOpenableParts', {
	'0': EmptyObject;
	'1': OnePartFields;
	'2': TwoPartsFields;
	'3': ThreePartsFields;
	'4': FourPartsFields;
}> & ({
	overhangDepth: number;
	overhangDistance: number;
} | EmptyObject) & ({
	sideFinRightDepth: number;
	sideFinRightDistance: number;
} | EmptyObject) & ({
	sideFinLeftDepth: number;
	sideFinLeftDistance: number;
} | EmptyObject) & ({
	treatmentType: WindowTreatmentType;
	curtainsControlObject?: WindowTreatmentControl;
	thermalResistivityIncrease: number;
	solarTransmittanceReduction: number;
} | {
	treatmentType?: undefined;
	curtainsControlObject?: never;
	thermalResistivityIncrease?: never;
	solarTransmittanceReduction?: never;
});

export interface ThermalBridgingData {
	livingSpaceLinearThermalBridges: EcaasForm<LinearThermalBridgeData[]>;
	livingSpacePointThermalBridges: EcaasForm<PointThermalBridgeData[]>;
}

export type LinearThermalBridgeData = {
	name: string;
	typeOfThermalBridge: string;
	linearThermalTransmittance: number;
	length: number;
};

export type PointThermalBridgeData = {
	name: string;
	heatTransferCoefficient: number;
};

export type LivingSpaceZoneParametersData = {
	area: number;
	volume: number;
	numberOfLEDBulbs: number;
	numberOfIncandescentBulbs: number;
	heatingControlType?: string;
	spaceHeatingSystemForThisZone: string;
	spaceCoolingSystemForThisZone?: SpaceCoolingSystemData[];
	spaceHeatControlSystemForThisZone?: SpaceHeatControlSystemData[];
};

export type SpaceHeatingSystemData = {
	name: string
};
export type SpaceCoolingSystemData = {
	name: string
};
export type SpaceHeatControlSystemData = {
	name: string
};

export interface DomesticHotWater {
	waterHeating: WaterHeating;
	hotWaterOutlets: HotWaterOutlets;
	pipework: Pipework;
	wwhrs: EcaasForm<WwhrsData[]>
}

export interface WaterHeating {
	hotWaterCylinder: EcaasForm<HotWaterCylinderData[]>;
	immersionHeater: EcaasForm<ImmersionHeaterData[]>;
	solarThermal: EcaasForm<SolarThermalData[]>;
	pointOfUse: EcaasForm<PointOfUseData[]>;
	heatPump: EcaasForm<HotWaterHeatPumpData[]>;
	combiBoiler: EcaasForm<CombiBoilerData[]>;
	heatBattery: EcaasForm<WaterHeatingHeatBatteryData[]>;
	smartHotWaterTank: EcaasForm<SmartHotWaterTankData[]>;
	heatInterfaceUnit: EcaasForm<WaterHeatingHeatInterfaceUnitData[]>;
}

export type HotWaterCylinderData = {
	readonly id: string;
	name: string;
	heatSource: string;
	tankVolume: number;
	dailyEnergyLoss: number;
};

export type ImmersionHeaterData = {
	name: string;
	ratedPower: number;
	heaterPosition: ImmersionHeaterPosition;
	thermostatPosition: ImmersionHeaterPosition;
};

export type ImmersionHeaterPosition = 'top' | 'middle' | 'bottom';

export type SolarThermalData = {
	name: string;
};

export type PointOfUseData = {
	name: string;
	setpointTemperature: number;
	heaterEfficiency: number;
};

export type HotWaterHeatPumpData = {
	name: string;
};

export type CombiBoilerData = {
	name: string;
};

export type WaterHeatingHeatBatteryData = {
	name: string;
};

export type SmartHotWaterTankData = {
	name: string;
};

export type WaterHeatingHeatInterfaceUnitData = {
	name: string;
};

export interface HotWaterOutlets {
	mixedShower: EcaasForm<MixedShowerData[]>;
	electricShower: EcaasForm<ElectricShowerData[]>;
	bath: EcaasForm<BathData[]>;
	otherOutlets: EcaasForm<OtherHotWaterOutletData[]>;
}

export type MixedShowerData = {
	readonly id: string;
	name: string;
	flowRate: number;
};

export type ElectricShowerData = {
	readonly id: string;
	name: string;
	ratedPower: number;
};

export type BathData = {
	readonly id: string;
	name: string;
	size: number;
	flowRate: number;
};

export type OtherHotWaterOutletData = {
	readonly id: string;
	name: string;
	flowRate: number;
};

export interface Pipework {
	primaryPipework: EcaasForm<PrimaryPipeworkData[]>;
	secondaryPipework: EcaasForm<SecondaryPipeworkData[]>;
}

export type PrimaryPipeworkData = {
	name: string;
	internalDiameter: number;
	externalDiameter: number;
	length: number;
	insulationThickness: number;
	thermalConductivity: number;
	surfaceReflectivity: boolean;
	pipeContents: WaterPipeContentsType;
	hotWaterCylinder: string;
	location: WaterPipeworkLocation;
};

export type SecondaryPipeworkData = {
	name: string;
	length: number;
	location: WaterPipeworkLocation;
	internalDiameter: number;
};

export type WwhrsData = {
	name: string;
	outlet: string;
	type: WwhrsType;
	flowRate: number;
	efficiency: number;
	proportionOfUse: number;
};

export interface InfiltrationAndVentilation {
	mechanicalVentilation: EcaasForm<MechanicalVentilationData[]>;
	ductwork: EcaasForm<DuctworkData[]>
	vents: EcaasForm<VentData[]>;
	combustionAppliances: CombustionAppliancesData;
	naturalVentilation: EcaasForm<VentilationData>;
	airPermeability: EcaasForm<AirPermeabilityData>;
}

export type MechanicalVentilationData = {
	readonly id: string;
	name: string;
	typeOfMechanicalVentilationOptions: VentType;
	controlForSupplyAirflow: SupplyAirFlowRateControlType;
	supplyAirTemperatureControl: string;
	airFlowRate: number;
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

export type VentData = {
	name: string;
	typeOfVent: string;
	effectiveVentilationArea: number;
	openingRatio: number;
	midHeightOfZone: number;
	orientation: number;
	pitch: number;
};

export type CombustionAppliancesData = Record<CombustionApplianceType, EcaasForm<CombustionApplianceData[]>>;

export type CombustionApplianceData = {
	name: string;
	airSupplyToAppliance: CombustionAirSupplySituation;
	exhaustMethodFromAppliance: FlueGasExhaustSituation;
	typeOfFuel: CombustionFuelType;
};

export interface VentilationData {
	ventilationZoneHeight: number;
	dwellingEnvelopeArea: number;
	dwellingElevationalLevelAtBase: number;
	crossVentFactor: boolean;
	maxRequiredAirChangeRate: number;
}

export interface AirPermeabilityData {
	testPressure: number;
	airTightnessTestResult: number;
}

export interface HeatingSystems {
	heatGeneration: HeatGeneration,
	energySupply: EcaasForm<EnergySupplyData>;
	heatEmitting: HeatEmitting;
}

export interface HeatGeneration {
	heatPump: EcaasForm<HeatPumpData[]>;
	boiler: EcaasForm<BoilerData[]>;
	heatBattery: EcaasForm<HeatBatteryData[]>;
	heatNetwork: EcaasForm<HeatNetworkData[]>;
	heatInterfaceUnit: EcaasForm<HeatInterfaceUnitData[]>;
}

export type HeatPumpData = {
	readonly id: string;
	name: string;
};

export type BoilerData = {
	readonly id: string;
	name: string;
};

export type HeatBatteryData = {
	readonly id: string;
	name: string;
};

export type HeatNetworkData = {
	readonly id: string;
	name: string;
};

export type HeatInterfaceUnitData = {
	readonly id: string;
	name: string;
};

export interface EnergySupplyData {
	fuelType: FuelType[];
	co2PerKwh?: number;
	co2PerKwhIncludingOutOfScope?: number;
	kwhPerKwhDelivered?: number;
	exported?: boolean;
}

export interface HeatEmitting {
	wetDistribution: EcaasForm<WetDistributionData[]>;
	instantElectricHeater: EcaasForm<InstantElectricStorageData[]>;
	electricStorageHeater: EcaasForm<ElectricStorageHeaterData[]>;
	warmAirHeatPump: EcaasForm<WarmAirHeatPumpData[]>;
}

export type ElectricStorageHeaterData = {
	name: string,
};

export type InstantElectricStorageData = {
	name: string,
	ratedPower: number,
	convectionFractionInstant: number,
};

export type WarmAirHeatPumpData = {
	name: string,
};

export type WetDistributionData = {
	name: string
	zoneReference: string,
	heatSource: string,
	thermalMass: number,
	designTempDiffAcrossEmitters: number,
	designFlowTemp: number,
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

export interface PvAndBatteries {
	pvSystem: EcaasForm<PvSystemData[]>;
	electricBattery: EcaasForm<ElectricBatteryData[]>;
}

export type PvSystemData = {
	name: string;
	peakPower: number;
	ventilationStrategy: OnSiteGenerationVentilationStrategy;
	pitch: number;
	orientation: number;
	elevationalHeight: number;
	lengthOfPV: number;
	widthOfPV: number;
	inverterPeakPowerAC: number;
	inverterPeakPowerDC: number;
	inverterIsInside: boolean;
	inverterType: InverterType;
	aboveDepth?: number;
	aboveDistance?: number;
	leftDepth?: number;
	leftDistance?: number;
	rightDepth?: number;
	rightDistance?: number;
};

export type ElectricBatteryData = {
	name: string;
	capacity: number;
	batteryAge: number;
	chargeEfficiency: number;
	location: BatteryLocation;
	gridChargingPossible: boolean;
	maximumChargeRate: number;
	minimumChargeRate: number;
	maximumDischargeRate: number;
};

export type PvDiverterData = {
	name: string;
} & ({ energyDivertedToHeatGeneration: string; } | { energyDivertedToHotWaterCylinder: string; });

export interface Cooling {
	airConditioning: EcaasForm<AirConditioningData[]>;
}

export type AirConditioningData = {
	name: string;
	coolingCapacity: number;
	seasonalEnergyEfficiencyRatio: number;
	convectionFraction: number;
};

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