export interface EcaasState {
    dwellingDetails: DwellingDetails;
}

export interface DwellingDetails {
    generalSpecifications: EcaasForm<GeneralSpecifications>;
}

export interface GeneralSpecifications {
    typeOfResidence: string;
    weatherDataLocation: string;
    sizeGroundFloorArea?: number;
    numOfBedrooms?: number;
    storiesInDwelling?: number;
}

export interface EcaasForm<T> {
    complete?: boolean;
    data: T;
}