export interface EcaasState {
    dwellingDetails: DwellingDetails;
}

export interface DwellingDetails {
    generalSpecifications: EcaasForm<GeneralSpecificationsData>;
	appliancesAndElectricity: EcaasForm<AppliancesAndElectricityData>;
    hotWaterDistribution: EcaasForm<HotWaterDistributionData>
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
    lengthInternal?: number,
    internalDiameterInternal?: number,
    externalDiameterInternal?: number,
    insulationThicknessInternal?: number,
    insulationThermalConductivityInternal?: number,
    lengthExternal?: number,
    internalDiameterExternal?: number,
    externalDiameterExternal?: number,
    insulationThicknessExternal?: number,
    insulationThermalConductivityExternal?: number,
    pipeContents?: string,
    surfaceReflectivity?: string
}

export interface EcaasForm<T> {
    complete?: boolean;
    data: T;
}