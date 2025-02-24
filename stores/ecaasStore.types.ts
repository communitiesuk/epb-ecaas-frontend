export interface EcaasState {
	dwellingDetails: DwellingDetails;
	hotWaterOutlets: HotWaterOutlets;
	livingSpaceFabric: LivingSpaceFabric;
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
	latitude?: number;
	longitude?: number;
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
	thicknessOfSurroundingWalls?: number;
	underfloorSpaceThermalResistance?: number;
	wallsAboveGroundThermalTransmittance?: number;
	ventilationOpeningsArea?: number;
	basementFloorDepth?: number;
	thermalResistanceOfBasementWalls?: number;
	thermalResistanceOfFloorAboveBasement?: number;
	thermalResistanceOfWallsAboveGround?: number;
	thicknessOfWalls?: number;
	depthOfBasementFloorBelowGround?: number;
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
	pitchOption: string;
	pitch?: number;
	thermalResistanceOfAdjacentUnheatedSpace?: number;
};

export type RoofData = {
	name: string;
};

export interface HotWaterOutlets {
	hotWaterDistribution: EcaasForm<HotWaterDistribution>;
}

export type HotWaterDistributionData = {
	name: string;
	length: number;
	location: string;
	internalDiameter?: number;
};

export interface HotWaterDistribution {
	distributions?: HotWaterDistributionData[]
}
