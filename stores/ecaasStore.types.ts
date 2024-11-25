export interface EcaasState {
    dwellingDetails: DwellingDetails;
}

export interface DwellingDetails {
    generalSpecifications: EcaasForm<GeneralSpecifications>;
}

export interface GeneralSpecifications {
    typeOfResidence: string;
}

export interface EcaasForm<T> {
    complete?: boolean;
    data: T;
}