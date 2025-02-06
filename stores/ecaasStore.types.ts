export interface EcaasState {
	dwellingDetails: DwellingDetails;
}

export interface DwellingDetails {
	generalSpecifications: EcaasForm<GeneralSpecificationsData>;
	appliancesAndElectricity: EcaasForm<AppliancesAndElectricityData>;
	hotWaterDistribution: EcaasForm<HotWaterDistribution>;
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

export interface AppliancesAndElectricityData {
	fridgeFreezerEnergyRating?: string;
	dishwasherEnergyRating?: string;
	ovenCookerEnergyRating?: string;
	washingMachineEnergyRating?: string;
	tumbleDryerEnergyRating?: string;
	electricVehicleCharger?: string;
	electricityGridConnection?: string;
	electricityTariff?: string;
}

export type HotWaterDistributionData = {
	name: string;
	length: number;
	location: string;
	internalDiameter?: number;
	externalDiameter?: number;
	insulationThickness?: number;
	insulationThermalConductivity?: number;
	pipeContents?: string;
	surfaceReflectivity?: string;
};

export interface HotWaterDistribution {
	distributions?: HotWaterDistributionData[]
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
