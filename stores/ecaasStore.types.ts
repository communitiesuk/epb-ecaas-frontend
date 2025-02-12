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
	floors: EcaasForm<FloorsData>;
}

export type InternalFloorData = {
	name: string; 
};

export type ExposedFloorData = {
	name: string; 
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
};

export interface FloorsData {
	groundFloor: EcaasForm<GroundFloorData[]>,
	internalFloor: EcaasForm<InternalFloorData[]>,
	exposedFloor: EcaasForm<ExposedFloorData[]>
}

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
