import { BuildType, type SchemaInfiltrationVentilation } from "~/schema/api-schema.types";
import type { FhsInputSchema } from "./fhsInputMapper";

export function mapDwellingDetailsData(state: EcaasState): Partial<FhsInputSchema> {
	const generalSpecificationsData = mapGeneralSpecificationsData(state);
	const externalFactorsData = mapExternalFactorsData(state);
	const distantShadingData = mapDistantShadingData(state);

	return {
		...generalSpecificationsData,
		...externalFactorsData,
		...distantShadingData
	};
}

function mapGeneralSpecificationsData(state: EcaasState): Pick<FhsInputSchema, 'General' | 'NumberOfBedrooms' | 'PartGcompliance' | 'PartO_active_cooling_required'> {
	const { generalSpecifications } = state.dwellingDetails;

	return {
		General: {
			build_type: generalSpecifications.data.typeOfDwelling!,
			storeys_in_building: generalSpecifications.data.storeysInDwelling!,
			...(generalSpecifications.data.typeOfDwelling === BuildType.flat ? {storey_of_dwelling: generalSpecifications.data.storeyOfFlat} : {}),
		},
		NumberOfBedrooms: generalSpecifications.data.numOfBedrooms,
		...(generalSpecifications.data.partGCompliance !== undefined ? {PartGcompliance: generalSpecifications.data.partGCompliance} : {}),
		...(generalSpecifications.data.coolingRequired !== undefined ? {PartO_active_cooling_required: generalSpecifications.data.coolingRequired} : {}),
	};
}

export type InfiltrationFieldsFromDwelling = 'altitude' | 'shield_class' | 'terrain_class' | 'noise_nuisance';

function mapExternalFactorsData(state: EcaasState): Pick<FhsInputSchema, 'InfiltrationVentilation'> {
	const { externalFactors } = state.dwellingDetails;

	const infiltrationVentilation: Pick<SchemaInfiltrationVentilation, InfiltrationFieldsFromDwelling> = {
		altitude: externalFactors.data.altitude!,
		shield_class: externalFactors.data.typeOfExposure!,
		terrain_class: externalFactors.data.terrainType!,
		noise_nuisance: externalFactors.data.noiseNuisance
	};

	return {
		InfiltrationVentilation: {
			...infiltrationVentilation,
		}
	} as Pick<FhsInputSchema, 'InfiltrationVentilation'>;
}

function mapDistantShadingData(state: EcaasState): Pick<FhsInputSchema, 'ExternalConditions'> {
	const { shading } = state.dwellingDetails;

	return {
		ExternalConditions: {
			shading_segments: shading.data.map((x, i) => {
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