import type { SchemaShadingObject } from "~/schema/api-schema.types";
import { mapDistantShadingData, mapExternalFactorsData, mapGeneralDetailsData } from "./dwellingDetailsMapper";
import { resolveState } from "~/stores/resolve";

describe("dwelling details mapper", () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it("maps general details input state to FHS input request", () => {
		// Arrange
		const state: GeneralDetailsData = {
			typeOfDwelling: "flat",
			storeysInDwelling: 3,
			storeyOfFlat: 1,
			numOfBedrooms: 2,
			coolingRequired: false
		};

		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					complete: true,
					data: state
				}
			}
		});

		// Act
		const fhsInputData = mapGeneralDetailsData(resolveState(store.$state));

		// Assert
		expect(fhsInputData.General?.build_type).toBe(state.typeOfDwelling);
		expect(fhsInputData.General?.storeys_in_building).toBe(state.storeysInDwelling);
		expect(fhsInputData.General?.storey_of_dwelling).toBe(state.storeyOfFlat);
		expect(fhsInputData.NumberOfBedrooms).toBe(state.numOfBedrooms);
		expect(fhsInputData.PartGcompliance).toBe(true);
		expect(fhsInputData.PartO_active_cooling_required).toBe(false);
	});

	it("maps external factors input state to FHS input request", () => {
		// Arrange
		const state: ExternalFactorsData = {
			altitude: 30,
			typeOfExposure: "Normal",
			terrainType: "OpenField",
			noiseNuisance: true
		};

		store.$patch({
			dwellingDetails: {
				externalFactors: {
					complete: true,
					data: state
				}
			}
		});

		// Act
		const fhsInputData = mapExternalFactorsData(resolveState(store.$state));

		// Assert
		expect(fhsInputData.InfiltrationVentilation?.altitude).toBe(state.altitude);
		expect(fhsInputData.InfiltrationVentilation?.shield_class).toBe("Normal");
		expect(fhsInputData.InfiltrationVentilation?.terrain_class).toBe("OpenField");
		expect(fhsInputData.InfiltrationVentilation?.noise_nuisance).toBe(true);
	});

	it("maps shading input state to FHS input request", () => {
		// Arrange
		const state: ShadingData = {
			name: "Big Tree",
			startAngle: 5,
			endAngle: 25,
			objectType: "obstacle",
			height: 3,
			distance: 2
		};

		store.$patch({
			dwellingDetails: {
				shading: {
					complete: true,
					data: [{
						data: state,
						complete: true
					}]
				}
			}
		});

		// Act
		const fhsInputData = mapDistantShadingData(resolveState(store.$state));

		const expectedShading: SchemaShadingObject = {
			type: state.objectType,
			height: state.height,
			distance: state.distance
		};

		const shadingSegments = fhsInputData.ExternalConditions?.shading_segments;
		const expectedSegmentNumbers = [1, 2, 3];
		const segmentsWithShading = shadingSegments?.filter(x => x.shading);

		// Assert
		expect(shadingSegments?.length).toBe(36);
		expect(segmentsWithShading?.length).toBe(expectedSegmentNumbers.length);

		segmentsWithShading?.forEach(x => {
			expect(x.shading).toEqual([expectedShading]);
		});

		expect(segmentsWithShading?.every(x => expectedSegmentNumbers.includes(x.number!))).toBe(true);
	});
});