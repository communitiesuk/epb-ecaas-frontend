export interface EcaasState {
	dwellingDetails: DwellingDetails;
	domesticHotWater: DomesticHotWater;
	livingSpaceFabric: LivingSpaceFabric;
	infiltrationAndVentilation: InfiltrationAndVentilation;
	heatingSystems: HeatingSystems;
}

export interface EcaasForm<T> {
	complete?: boolean;
	data: T;
}

export interface DwellingDetails {
	generalSpecifications: EcaasForm<GeneralSpecificationsData>;
	appliances: EcaasForm<AppliancesData>;
	shading: EcaasForm<ShadingData[]>;
	externalFactors: EcaasForm<ExternalFactorsData>;
}

export interface GeneralSpecificationsData {
	typeOfDwelling?: string;
	storeysInDwelling?: number;
	storeyOfFlat?: number;
	numOfBedrooms?: number;
	partGCompliance?: string;
	coolingRequired?: string;
}

export interface AppliancesData {
	appliances?: string[];
}

export type ShadingData = {
	name: string;
	startAngle: number;
	endAngle: number;
	objectType: string;
	height: number;
	distance: number;
};

export interface ExternalFactorsData {
	altitude?: number;
	typeOfExposure?: string;
	terrainType?: string;
	noiseNuisance?: string;
}

export interface LivingSpaceFabric {
	livingSpaceFloors: FloorsData;
	livingSpaceWalls: WallsData;
	livingSpaceCeilingsAndRoofs: CeilingsAndRoofsData;
	livingSpaceDoors: DoorsData;
	livingSpaceWindows: EcaasForm<WindowData[]>;
	livingSpaceThermalBridging: ThermalBridgingData;
	livingSpaceZoneParameters: EcaasForm<LivingSpaceZoneParametersData>;
}

export interface FloorsData {
	livingSpaceGroundFloor: EcaasForm<GroundFloorData[]>,
	livingSpaceInternalFloor?: EcaasForm<InternalFloorData[]>,
	livingSpaceExposedFloor?: EcaasForm<ExposedFloorData[]>
}

export type InternalFloorData = {
	name: string;
	typeOfInternalFloor: string;
	surfaceAreaOfElement: number;
	uValue: number;
	kappaValue: number;
	massDistributionClass: string;
	pitch: number;
	thermalResistanceOfAdjacentUnheatedSpace?: 0;
};

export type ExposedFloorData = {
	name: string;
	pitch: number;
	orientation: number;
	length: number;
	width: number;
	elevationalHeight: number;
	surfaceArea: number;
	solarAbsorbtion: number;
	uValue: number;
	kappaValue: number;
	massDistributionClass: string;
};

export type GroundFloorData = {
	name: string;
	surfaceAreaInZone: number;
	surfaceAreaAllZones: number;
	pitch: number;
	uValue: number;
	kappaValue: number;
	massDistributionClass: string;
	perimeter: number;
	psiOfWallJunction: number;
	typeOfGroundFloor: string;
	edgeInsulationType?: string;
	edgeInsulationWidth?: number;
	edgeInsulationThermalResistance?: number;
	heightOfFloorUpperSurface?: number;
	underfloorSpaceThermalResistance?: number;
	thermalTransmittanceOfWallsAboveGround?: number;
	ventilationOpeningsArea?: number;
	depthOfBasementFloorBelowGround?: number;
	thermalResistanceOfBasementWalls?: number;
	thermalResistanceOfFloorAboveBasement?: number;
	thermalResistanceOfWallsAboveGround?: number;
	thermalTransmittanceOfFloorAboveBasement?: number;
	thermalTransmittanceOfBasementWalls?: number;
	thicknessOfWalls?: number;
	heightOfBasementWallsAboveGround?: number
};

export interface WallsData {
	livingSpaceExternalWall: EcaasForm<ExternalWallData[]>;
	livingSpaceInternalWall: EcaasForm<InternalWallData[]>;
	livingSpaceWallToUnheatedSpace?: EcaasForm<WallsToUnheatedSpaceData[]>;
	livingSpacePartyWall?: EcaasForm<PartyWallData[]>;
}

export type ExternalWallData = {
	name: string;
	pitchOption: string;
	pitch?: number;
	orientation: number;
	length: number;
	width: number;
	elevationalHeight: number;
	surfaceArea: number;
	solarAbsorbtion: number;
	uValue: number;
	kappaValue: number;
	massDistributionClass: string;
};

export type InternalWallData = {
	name: string;
	surfaceAreaOfElement: number;
	uValue: number;
	kappaValue: number;
	massDistributionClass: string;
	pitchOption: string;
	pitch: number;
};

export type WallsToUnheatedSpaceData = {
	name: string;
	surfaceAreaOfElement: number;
	uValue: number;
	arealHeatCapacity: number;
	massDistributionClass: string;
	pitchOption: string;
	pitch?: number;
	thermalResistanceOfAdjacentUnheatedSpace: number;
};

export type PartyWallData = {
	name: string;
	pitchOption: string;
	pitch?: number;
	orientation: number;
	height: number;
	width: number;
	elevationalHeight: number;
	surfaceArea: number;
	solarAbsorbtion: number;
	uValue: number;
	kappaValue: number;
	massDistributionClass: string;
};

export interface CeilingsAndRoofsData {
	livingSpaceCeilings: EcaasForm<CeilingData[]>;
	livingSpaceRoofs: EcaasForm<RoofData[]>;
}

export type CeilingData = {
	type: string;
	name: string;
	surfaceArea: number;
	uValue: number;
	kappaValue: number;
	massDistributionClass: string;
	pitchOption?: string;
	pitch: number;
	thermalResistanceOfAdjacentUnheatedSpace?: number;
};

export type RoofData = {
	name: string;
	typeOfRoof: string;
	pitchOption?: string;
	pitch: number;
	orientation?: number;
	height: number;
	width: number;
	elevationalHeightOfElement: number;
	surfaceArea: number;
	solarAbsorbtionCoefficient: number;
	uValue: number;
	kappaValue: number;
	massDistributionClass: string;
};

export interface DoorsData {
	livingSpaceExternalUnglazedDoor: EcaasForm<ExternalUnglazedDoorData[]>;
	livingSpaceExternalGlazedDoor: EcaasForm<ExternalGlazedDoorData[]>;
	livingSpaceInternalDoor: EcaasForm<InternalDoorData[]>;
};

export type ExternalUnglazedDoorData = {
	name: string;
	pitchOption: string;
	pitch?: number;
	orientation: number;
	height: number;
	width: number;
	elevationalHeight: number;
	surfaceArea: number;
	solarAbsorbtion: number;
	uValue: number;
	kappaValue: number;
	massDistributionClass: string;
};

export type ExternalGlazedDoorData = {
	name: string;
	orientation: number;
	surfaceArea: number;
	height: number;
	width: number;
	uValue: number;
	pitchOption: string;
	pitch?: number;
	solarTransmittence: number;
	elevationalHeight: number;
	midHeight: number;
	numberOpenableParts: string;
	frameToOpeningRatio?: number;
	maximumOpenableArea?: number;
	heightOpenableArea?: number;
	midHeightOpenablePart1?: number;
	midHeightOpenablePart2?: number;
	midHeightOpenablePart3?: number;
	midHeightOpenablePart4?: number;
};

export type InternalDoorData = {
	typeOfCeiling: string;
	name: string;
	surfaceArea: number;
	uValue: number;
	kappaValue: number;
	massDistributionClass: string;
	pitchOption: string;
	pitch?: number;
	thermalResistanceOfAdjacentUnheatedSpace?: number;
};

export type WindowData = {
	name: string;
	orientation: number;
	surfaceArea: number;
	height: number;
	width: number;
	uValue: number;
	pitchOption: string;
	pitch?: number;
	solarTransmittence: number;
	elevationalHeight: number;
	midHeight: number;
	numberOpenableParts: string;
	frameToOpeningRatio?: number;
	maximumOpenableArea?: number;
	heightOpenableArea?: number;
	midHeightOpenablePart1?: number;
	midHeightOpenablePart2?: number;
	midHeightOpenablePart3?: number;
	midHeightOpenablePart4?: number;
	overhangDepth?: number;
	overhangDistance?: number;
	sideFinRightDepth?: number;
	sideFinRightDistance?: number;
	sideFinLeftDepth?: number;
	sideFinLeftDistance?: number;
	type?: string;
	curtainsControlObject?: string;
	thermalResistivityIncrease?: number;
	solarTransmittenceReduction?: number;
};

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
	area?: number;
	volume?: number;
	heatingControlType?: string;
	spaceHeatingSystemForThisZone?: SpaceHeatingSystemData[];
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
}

export interface WaterHeating {
	storageTank: EcaasForm<StorageTankData[]>;
	immersionHeater: EcaasForm<ImmersionHeaterData[]>;
	solarThermal: EcaasForm<SolarThermalData[]>;
	pointOfUse: EcaasForm<PointOfUseData[]>;
	heatPump: EcaasForm<HotWaterHeatPumpData[]>;
	combiBoiler: EcaasForm<CombiBoilerData[]>;
	heatBattery: EcaasForm<WaterHeatingHeatBatteryData[]>;
	smartHotWaterTank: EcaasForm<SmartHotWaterTankData[]>;
	heatInterfaceUnit: EcaasForm<WaterHeatingHeatInterfaceUnitData[]>;
}

export type StorageTankData = {
	name: string;
	heatSource?: string;
	tankVolume: number;
	dailyEnergyLoss: number;
};

export type ImmersionHeaterData = {
	name: string;
	ratedPower: number;
	heaterPosition: number;
	thermostatPosition: number;
};

export type SolarThermalData = {
	name: string;
};

export type PointOfUseData = {
	name: string;
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
	name: string;
	flowRate: number;
};

export type ElectricShowerData = {
	name: string;
	ratedPower: number;
};

export type BathData = {
	name: string;
	size: number;
	flowRate: number;
};

export type OtherHotWaterOutletData = {
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
	surfaceReflectivity: string;
	pipeContents: string;
	storageTank: string;
	location: string;
};

export type SecondaryPipeworkData = {
	name: string;
	length: number;
	location: string;
	internalDiameter?: number;
};

export interface InfiltrationAndVentilation {
	mechanicalVentilation: EcaasForm<MechanicalVentilationData[]>;
	vents: EcaasForm<VentData[]>;
	combustionAppliances: CombustionAppliancesData;
	ventilation: EcaasForm<VentilationData>;
	airPermeability: EcaasForm<AirPermeabilityData>;
}

export type MechanicalVentilationData = {
	name: string;
	typeOfMechanicalVentilationOptions: string;
	controlForSupplyAirflow: string;
	supplyAirTemperatureControl: string;
	airFlowRate: number;
	mvhrLocation?: string;
	mvhrEfficiency?: number;
	ductworkCrossSectionalShape?: string;
	ductType?: string;
	internalDiameterOfDuctwork?: number;
	externalDiameterOfDuctwork?: number;
	insulationThickness?: number;
	lengthOfDucwork?: number;
	thermalInsulationConductivityOfDuctwork?: number;
	surfaceReflectivity?: string;
};

export type VentData = {
	name: string;
	typeOfVent: string;
	effectiveVentilationArea: number;
	openingRatio: number;
	airFlowAtMidHeightLevel: number;
	pressureDifference: number;
	orientation: number;
	pitch: number;
};

export interface CombustionAppliancesData {
	openFireplace: EcaasForm<CombustionApplianceData[]>
	closedFireplaceWithFan: EcaasForm<CombustionApplianceData[]>
	openGasFlueBalancer: EcaasForm<CombustionApplianceData[]>
	openGasKitchenStove: EcaasForm<CombustionApplianceData[]>
	openGasFire: EcaasForm<CombustionApplianceData[]>
	closedFire: EcaasForm<CombustionApplianceData[]>
}

export type CombustionApplianceData = {
	name: string;
	airSupplyToAppliance: string;
	exhaustMethodFromAppliance: string;
	typeOfFuel: string;
};

export interface VentilationData {
	zoneElevationalLevelAtBase?: number;
	crossVentFactor?: string;
	maxRequiredAirChangeRate?: number;
}

export interface AirPermeabilityData {
	zoneHeight?: number;
	zoneEnvelopeArea?: number;
	testPressure?: number;
	airTightnessTestResult?: number;
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
	name: string;
};

export type BoilerData = {
	name: string;
};

export type HeatBatteryData = {
	name: string;
};

export type HeatNetworkData = {
	name: string;
};

export type HeatInterfaceUnitData = {
	name: string;
};

export interface EnergySupplyData {
	fuelType?: string[];
	co2PerKwh?: number;
	co2PerKwhIncludingOutOfScope?: number;
	kwhPerKwhDelivered?: number;
	exported?: string;
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
	convectionFraction: number,
};
export type WarmAirHeatPumpData = {
	name: string,
};
export type WetDistributionData = {
	name: string
};

