export interface EcaasState {
    dwellingDetails: DwellingDetails;
}

export interface DwellingDetails {
    generalSpecifications: EcaasForm<GeneralSpecificationsData>;
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

export interface EcaasForm<T> {
    complete?: boolean;
    data: T;
}