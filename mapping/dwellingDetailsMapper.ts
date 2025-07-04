import { BuildType   } from "~/schema/api-schema.types";
import type {SchemaInfiltrationVentilation, SchemaShadingSegment} from "~/schema/api-schema.types";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";

export function mapDwellingDetailsData(state: ResolvedState): Partial<FhsInputSchema> {
	const generalSpecificationsData = mapGeneralSpecificationsData(state);
	const externalFactorsData = mapExternalFactorsData(state);
	const distantShadingData = mapDistantShadingData(state);

	return {
		...generalSpecificationsData,
		...externalFactorsData,
		...distantShadingData
	};
}

export function mapGeneralSpecificationsData(state: ResolvedState): Pick<FhsInputSchema, 'General' | 'NumberOfBedrooms' | 'PartGcompliance' | 'PartO_active_cooling_required'> {
	const { generalSpecifications } = state.dwellingDetails;
	
	return {
		General: {
			build_type: generalSpecifications.typeOfDwelling!,
			storeys_in_building: generalSpecifications.storeysInDwelling!,
			...(generalSpecifications.typeOfDwelling === BuildType.flat ? {storey_of_dwelling: generalSpecifications.storeyOfFlat} : {}),
		},
		NumberOfBedrooms: generalSpecifications.numOfBedrooms,
		PartGcompliance: true,
		...(generalSpecifications.coolingRequired !== undefined ? {PartO_active_cooling_required: generalSpecifications.coolingRequired} : {}),
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

	const range = 10;
	const max = 360;
	const segmentCount = max / range;
	const segments: SchemaShadingSegment[] = [];

	for (let index = 0; index < segmentCount; index++) {
		segments.push({
			number: index + 1,
			start360: index * range,
			end360: (index * range) + range
		});
	}

	shading.forEach(s => {
		const startSegments = segments.filter(x => x.start360 < s.endAngle);
		const endSegments = segments.filter(x => x.end360 > s.startAngle);
		const matchingSegments = startSegments.filter(x => endSegments.includes(x));

		segments.forEach(x => {
			if (matchingSegments.includes(x)) {
				x.shading ??= [];

				x.shading.push({
					type: s.objectType,
					distance: s.distance,
					height: s.height
				});
			}
		});
	});

	return {
		ExternalConditions: {
			shading_segments: segments
		}
	};
}
