export interface EcaasState {
	dwellingDetails: DwellingDetails;
	hotWaterOutlets: HotWaterOutlets;
	livingSpaceFabric: LivingSpaceFabric;
	infiltrationAndVentilation: InfiltrationAndVentilation;
}

export interface EcaasForm<T> {
	complete?: boolean;
	data: T;
}

export interface DwellingDetails {
	generalSpecifications: EcaasForm<GeneralSpecificationsData>;
	appliances: EcaasForm<AppliancesData>;
	shading: EcaasForm<Shading>;
	externalFactors: EcaasForm<ExternalFactorsData>;
}

export interface GeneralSpecificationsData {
	typeOfDwelling?: string;
	storeysInDwelling?: number;
	storeyOfFlat?: number;
	numOfBedrooms?: number;
	partGCompliance?: string;
	coolingRequired?: string;
	heatingControlType?: string;
}

export interface AppliancesData {
	appliances?: string[];
}

export type ShadingObject = {
	name: string;
	direction: number;
	objectType: string;
	height: number;
	distance: number;
};

export interface Shading {
	shadingObjects?: ShadingObject[]
}

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
	pitchOption: string;
	pitch?: number;
	thermalResistanceOfAdjacentUnheatedSpace?: 0;
};

export type ExposedFloorData = {
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

export type GroundFloorData = {
	name: string;
	surfaceAreaInZone: number;
	surfaceAreaAllZones: number;
	pitchOption: string;
	pitch?: number;
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
	height: number;
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
	orientation: number;
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
	spaceHeatingSystemForThisZone?: SpaceHeatingSystemData[];
	spaceCoolingSystemForThisZone?: SpaceCoolingSystemData[];
	spaceHeatControlSystemForThisZone?: SpaceHeatControlSystemData[];
};

export type SpaceHeatingSystemData= {
	name:string
};
export type SpaceCoolingSystemData = {
	name:string
};
export type SpaceHeatControlSystemData = {
	name:string
};

export interface HotWaterOutlets {
	hotWaterDistribution: EcaasForm<HotWaterDistributionData[]>;
}

export type HotWaterDistributionData = {
	name: string;
	length: number;
	location: string;
	internalDiameter?: number;
};

export interface InfiltrationAndVentilation {
	mechanicalVentilation: EcaasForm<MechanicalVentilation>
}

export interface MechanicalVentilation {
	mechanicalVentilationObjects?: MechanicalVentilationObject[]
}
export type MechanicalVentilationObject = {
	name: string;
	typeOfMechanicalVentilationOptions: string;
	controlForSupplyAirflow: string;
	supplyAirTemperatureControl: string;
	airFlowRate: number;
	mvhrLocation?: string;
	mvhrEfficiency?: number;
	ductworkCrossSectionalShape?: string;
	ductTape?: string;
	internalDiameterOfDuctwork?: number;
	externalDiameterOfDuctwork?: number;
	insulationThickness?: number;
	lengthOfDucwork?: number;
	thermalInsulationConductivityOfDuctwork?: number;
	surfaceReflectivity?: string;
};