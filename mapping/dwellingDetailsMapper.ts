import { applianceKeys } from "./../utils/display";
import type { SchemaShadingSegment, SchemaInfiltrationVentilation, SchemaApplianceType } from "~/schema/aliases";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import { objectFromEntries } from "ts-extras";
import { defaultElectricityEnergySupplyName } from "./common";

export function mapDwellingDetailsData(state: ResolvedState): Partial<FhsInputSchema> {
	const generalDetailsData = mapGeneralDetailsData(state);
	const energySupplyFuelTypeData = mapEnergySupplyFuelTypeData(state);
	const externalFactorsData = mapExternalFactorsData(state);
	const distantShadingData = mapDistantShadingData(state);
	const appliancesData = mapAppliancesData(state); 
	return {
		...generalDetailsData,
		...energySupplyFuelTypeData,
		...externalFactorsData,
		...distantShadingData,
		...appliancesData,
	};
}

export type GeneralFieldsFromDwelling = "General" |
	"BuildingLength" |
	"BuildingWidth" |
	"NumberOfBedrooms" |
	"NumberOfUtilityRooms" |
	"NumberOfBathrooms" |
	"NumberOfSanitaryAccommodations" |
	"NumberOfHabitableRooms" |
	"NumberOfTappedRooms" |
	"NumberOfWetRooms" |
	"PartGcompliance";  

export function mapGeneralDetailsData(state: ResolvedState): Pick<FhsInputSchema, GeneralFieldsFromDwelling> {
	const { generalSpecifications: generalDetails } = state.dwellingDetails;
	
	return {
		General:
			generalDetails.typeOfDwelling === "flat"
				? {
					build_type: "flat",
					storeys_in_building: generalDetails.storeysInDwelling,
					storey_of_dwelling: generalDetails.storeyOfFlat,
				}
				: {
					build_type: "house",
					storeys_in_building: generalDetails.storeysInDwelling,
				},
		BuildingLength: generalDetails.buildingLength,
		BuildingWidth: generalDetails.buildingWidth,
		NumberOfBedrooms: generalDetails.numOfBedrooms,
		NumberOfUtilityRooms: generalDetails.numOfUtilityRooms,
		NumberOfBathrooms: generalDetails.numOfBathrooms,
		NumberOfSanitaryAccommodations: generalDetails.numOfWCs,
		NumberOfHabitableRooms: generalDetails.numOfHabitableRooms,
		NumberOfTappedRooms: generalDetails.numOfRoomsWithTappingPoints,
		NumberOfWetRooms: 0, // fhs needs this field set at 0.36
		PartGcompliance: true,
	};
}

export function mapEnergySupplyFuelTypeData(
	state: ResolvedState,
): Pick<FhsInputSchema, "EnergySupply"> {
	const fuelType = state.dwellingDetails.generalSpecifications.fuelType.filter(x => x !== "elecOnly"); //electricity is always required as a fueltype - so its hardcoded into the EngergySupply object - therefore we filter out elecOnly (used to represent electricity only at form level) so its not added twice

	return {
		EnergySupply: {
			[defaultElectricityEnergySupplyName]: {
				fuel: "electricity",
			},
			...objectFromEntries(
				fuelType
					? fuelType.map((fuelType) => [
						fuelType,
						{
							fuel: fuelType,
							...(fuelType === "lpg_bulk" && {
								factor: { is_export_capable: false },
							}),
						},
					])
					: [],
			),
		},
	};
}

export type InfiltrationFieldsFromDwelling = "altitude" | "shield_class" | "terrain_class" | "noise_nuisance";

export function mapExternalFactorsData(state: ResolvedState): Pick<FhsInputSchema, "InfiltrationVentilation"> {
	const { externalFactors } = state.dwellingDetails;

	const infiltrationVentilation: Pick<SchemaInfiltrationVentilation, InfiltrationFieldsFromDwelling> = {
		altitude: externalFactors.altitude,
		shield_class: externalFactors.typeOfExposure,
		terrain_class: externalFactors.terrainType,
		noise_nuisance: externalFactors.noiseNuisance,
	};

	return {
		InfiltrationVentilation: {
			...infiltrationVentilation,
		},
	} as Pick<FhsInputSchema, "InfiltrationVentilation">;
}

export function mapDistantShadingData(state: ResolvedState): Pick<FhsInputSchema, "ExternalConditions"> {
	const { shading } = state.dwellingDetails;

	const range = 10;
	const max = 360;
	const segmentCount = max / range;
	const segments: SchemaShadingSegment[] = [...Array(segmentCount).keys()].map(index => ({
		start360: index * range,
		end360: (index * range) + range,
	}));

	shading.forEach(s => {
		const startSegments = segments.filter(x => x.start360 != null && x.start360 < s.endAngle);
		const endSegments = segments.filter(x => x.end360 != null && x.end360 > s.startAngle);
		const matchingSegments = startSegments.filter(x => endSegments.includes(x));

		segments.forEach(x => {
			if (matchingSegments.includes(x)) {
				x.shading ??= [];

				x.shading.push({
					type: s.objectType,
					distance: s.distance,
					height: s.height,
				});
			}
		});
	});

	return {
		ExternalConditions: {
			shading_segments: segments,
		},
	};
}

// export type InfiltrationFieldsFromDwelling = "altitude" | "shield_class" | "terrain_class" | "noise_nuisance";

export function mapAppliancesData(
	state: ResolvedState,
): Pick<FhsInputSchema, "Appliances"> {
	function getAppliances() {
		const chosenAppliances = state.dwellingDetails.appliances.applianceType; 
		const appliancesMap = {} as Record<
			SchemaApplianceType,
      "Default" | "Not Installed"
		>;

		for (const appliance of applianceKeys) {
			if (chosenAppliances.includes(appliance)) {
				appliancesMap[appliance] = "Default";
			} else {
				appliancesMap[appliance] = "Not Installed";
			}
		}
		return appliancesMap;
	}

	return {
		Appliances: getAppliances(),
	};
}
