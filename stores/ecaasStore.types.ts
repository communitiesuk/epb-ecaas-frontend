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
    typeOfResidence?: string;
    weatherDataLocation?: string;
    sizeGroundFloorArea?: number;
    numOfBedrooms?: number;
    storiesInDwelling?: number;
    levelOfShelter?: string;
    numOfShelteredSides?: number;
    heatingControlType?: string;
    cookingFuelType?: string;
    coldWaterSource?: string;
	numOfADFWetRooms?: number;
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
}

export interface HotWaterDistribution {
    distributions?: HotWaterDistributionData[]
}

export type ShadingObject = {
	name: string;
}

export interface Shading {
	shadingObjects?: ShadingObject[]
}

export interface EcaasForm<T> {
    complete?: boolean;
    data: T;
}
