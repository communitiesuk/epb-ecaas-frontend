import { ApplianceReference, BuildType, type SchemaApplianceEntry, type SchemaInfiltrationVentilation } from "~/schema/api-schema.types";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";

export function mapDwellingDetailsData(state: ResolvedState): Partial<FhsInputSchema> {
	const generalSpecificationsData = mapGeneralSpecificationsData(state);
	const externalFactorsData = mapExternalFactorsData(state);
	const distantShadingData = mapDistantShadingData(state);
	const applianceData = mapApplianceData(state);

	return {
		...generalSpecificationsData,
		...externalFactorsData,
		...distantShadingData,
		...applianceData
	};
}

export function mapGeneralSpecificationsData(state: ResolvedState): Pick<FhsInputSchema, 'General' | 'NumberOfBedrooms' | 'PartGcompliance' | 'PartO_active_cooling_required'> {
	const { generalSpecifications } = state.dwellingDetails;
	
	return {
		General: {
			build_type: generalSpecifications.typeOfDwelling!,
			storeys_in_building: generalSpecifications.storeysInDwelling!,
			storey_of_dwelling: generalSpecifications.typeOfDwelling === BuildType.flat ? generalSpecifications.storeyOfFlat : undefined,
		},
		NumberOfBedrooms: generalSpecifications.numOfBedrooms,
		PartGcompliance: generalSpecifications.partGCompliance,
		PartO_active_cooling_required: generalSpecifications.coolingRequired
	};
}

export type InfiltrationFieldsFromDwelling = 'altitude' | 'shield_class' | 'terrain_class' | 'noise_nuisance';

export function mapExternalFactorsData(state: ResolvedState): Pick<FhsInputSchema, 'InfiltrationVentilation'> {
	const { externalFactors } = state.dwellingDetails;

	const infiltrationVentilation: Pick<SchemaInfiltrationVentilation, InfiltrationFieldsFromDwelling> = {
		altitude: externalFactors.altitude!,
		shield_class: externalFactors.typeOfExposure!,
		terrain_class: externalFactors.terrainType!,
		noise_nuisance: externalFactors.noiseNuisance
	};

	return {
		InfiltrationVentilation: {
			...infiltrationVentilation,
		}
	} as Pick<FhsInputSchema, 'InfiltrationVentilation'>;
}

export function mapDistantShadingData(state: ResolvedState): Pick<FhsInputSchema, 'ExternalConditions'> {
	const { shading } = state.dwellingDetails;

	return {
		ExternalConditions: {
			shading_segments: (shading ?? []).map((x, i) => {
				return {
					number: i + 1,
					start360: x.startAngle,
					end360: x.endAngle,
					shading: [{
						type: x.objectType,
						height: x.height,
						distance: x.distance
					}]
				};
			})
		}
	};
}

export function mapApplianceData(state: ResolvedState): Pick<FhsInputSchema, 'Appliances'> {
	console.log("Appliance data:", state.dwellingDetails.appliances);
	const { appliances } = state.dwellingDetails.appliances;

	const applianceData: Record<string, SchemaApplianceEntry> = {};
	appliances?.forEach(x => applianceData[x] = ApplianceReference.Default);

	return {
		Appliances: applianceData
	};
}