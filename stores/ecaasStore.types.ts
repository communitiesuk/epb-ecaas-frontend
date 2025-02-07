export interface EcaasState {
	dwellingDetails: DwellingDetails;
	hotWaterOutlets: HotWaterOutlets;
}

export interface DwellingDetails {
	generalSpecifications: EcaasForm<GeneralSpecificationsData>;
	appliances: EcaasForm<AppliancesData>;
	shading: EcaasForm<Shading>;
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

export interface EcaasForm<T> {
	complete?: boolean;
	data: T;
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
