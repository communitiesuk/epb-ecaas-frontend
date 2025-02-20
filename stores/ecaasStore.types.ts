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
}

export interface FloorsData {
	livingSpaceGroundFloor: EcaasForm<GroundFloorData[]>,
	livingSpaceInternalFloor?: EcaasForm<InternalFloorData[]>,
	livingSpaceExposedFloor?: EcaasForm<ExposedFloorData[]>
}

export type InternalFloorData = {
	name: string; 
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
	externalWalls: EcaasForm<ExternalWallData[]>;
	internalWalls: EcaasForm<InternalWallData[]>;
	wallsToUnheatedSpace?: EcaasForm<WallsToUnheatedSpaceData[]>;
	partyWalls?: EcaasForm<PartyWallData[]>;
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
	
};
export type WallsToUnheatedSpaceData = {
	name: string;
	
};
export type PartyWallData = {
	name: string;
	
};

export interface ExternalFactorsData {
	altitude?: number;
	typeOfExposure?: string;
	required?: boolean;
	terrainType?: string;
	noiseNuisance?: string;
}

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
