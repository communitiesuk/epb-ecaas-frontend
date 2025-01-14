export interface EcaasState {
    dwellingDetails: DwellingDetails;
}

export interface DwellingDetails {
    generalSpecifications: EcaasForm<GeneralSpecificationsData>;
	appliancesAndElectricity: EcaasForm<AppliancesAndElectricityData>;
    hotWaterDistribution: EcaasForm<HotWaterDistributionData>;
	shading: EcaasForm<ShadingData>;
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

export interface HotWaterDistributionData {
    name?: String;
    length?: number;
	location?: string;
    internalDiameter?: number;
    externalDiameter?: number;
    insulationThickness?: number;
    insulationThermalConductivity?: number;
    pipeContents?: string;
    surfaceReflectivity?: string;
}

export interface ShadingDistribution {
	name: string;
	length: number;
	diameter: number;
	thickness: number;
	thermalConductivity: number;
	surfaceReflectivity: string;
}

export interface ShadingData {
	distributions?: ShadingDistribution[]
}

export interface EcaasForm<T> {
    complete?: boolean;
    data: T;
}
