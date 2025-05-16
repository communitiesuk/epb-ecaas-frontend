import type { SchemaApplianceEntry, SchemaBuildType, SchemaFhsInputSchema, SchemaShadingObjectType, SchemaTerrainClass, SchemaVentilationShieldClass } from "~/schema/api-schema.types";
import type { StripDefs } from "./mapping.types";

export function mapDwellingDetailsData(state: EcaasState): Partial<StripDefs<SchemaFhsInputSchema>> {
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

function mapGeneralSpecificationsData(state: EcaasState): Partial<StripDefs<SchemaFhsInputSchema>> {
	const { generalSpecifications } = state.dwellingDetails;

	return {
		General: {
			build_type: generalSpecifications.data.typeOfDwelling as SchemaBuildType,
			storeys_in_building: generalSpecifications.data.storeysInDwelling!,
			storey_of_dwelling: generalSpecifications.data.storeyOfFlat
		},
		NumberOfBedrooms: generalSpecifications.data.numOfBedrooms,
		PartGcompliance: generalSpecifications.data.partGCompliance,
		PartO_active_cooling_required: generalSpecifications.data.coolingRequired
	};
}

function mapExternalFactorsData(state: EcaasState): Partial<StripDefs<SchemaFhsInputSchema>> {
	const { externalFactors } = state.dwellingDetails;

	return {
		InfiltrationVentilation: {
			altitude: externalFactors.data.altitude!,
			shield_class: externalFactors.data.typeOfExposure as SchemaVentilationShieldClass,
			terrain_class: externalFactors.data.terrainType as SchemaTerrainClass,
			noise_nuisance: externalFactors.data.noiseNuisance ? externalFactors.data.noiseNuisance === 'yes' : undefined
		}
	} as Partial<StripDefs<SchemaFhsInputSchema>>;
}

function mapDistantShadingData(state: EcaasState): Partial<StripDefs<SchemaFhsInputSchema>> {
	const { shading } = state.dwellingDetails;

	return {
		ExternalConditions: {
			shading_segments: shading.data.map((x, i) => {
				return {
					number: i + 1,
					start360: x.startAngle,
					end360: x.endAngle,
					shading: [{
						type: x.objectType as SchemaShadingObjectType,
						height: x.height,
						distance: x.distance
					}]
				};
			})
		}
	};
}

function mapApplianceData(state: EcaasState): Partial<StripDefs<SchemaFhsInputSchema>> {
	const { appliances } = state.dwellingDetails.appliances.data;

	const applianceData: Record<string, SchemaApplianceEntry> = {};
	appliances?.forEach(x => applianceData[x] = 'Default');

	return {
		Appliances: applianceData
	};
}