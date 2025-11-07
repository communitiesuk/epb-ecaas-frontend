import type { SchemaShadingObject } from "~/schema/aliases";
import { mapAppliancesData, mapDistantShadingData, mapEnergySupplyFuelTypeData, mapExternalFactorsData, mapGeneralDetailsData } from "./dwellingDetailsMapper";
import { resolveState } from "~/stores/resolve";
import type { FhsInputSchema } from "./fhsInputMapper";

describe("dwelling details mapper", () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	const state: GeneralDetailsData = {
		typeOfDwelling: "flat",
		storeysInDwelling: 3,
		storeyOfFlat: 1,
		buildingLength: 10,
		buildingWidth: 20,
		numOfBedrooms: 2,
		numOfUtilityRooms: 2,
		numOfBathrooms: 1,
		numOfWCs: 1,
		numOfHabitableRooms: 3,
		numOfRoomsWithTappingPoints: 2,
		fuelType: ["electricity"],
	};

	it("maps general details input state to FHS input request", () => {
		// Arrange

		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					complete: true,
					data: state,
				},
			},
		});

		// Act
		const fhsInputData = mapGeneralDetailsData(resolveState(store.$state));

		// Assert
		expect(fhsInputData.General.build_type).toBe(state.typeOfDwelling);
		expect(fhsInputData.General.storeys_in_building).toBe(state.storeysInDwelling);
		expect(fhsInputData.General.build_type === "flat" ? fhsInputData.General.storey_of_dwelling : undefined).toBe(state.storeyOfFlat);
		expect(fhsInputData.BuildingLength).toBe(state.buildingLength);
		expect(fhsInputData.BuildingWidth).toBe(state.buildingWidth);
		expect(fhsInputData.NumberOfBedrooms).toBe(state.numOfBedrooms);
		expect(fhsInputData.NumberOfUtilityRooms).toBe(state.numOfUtilityRooms);
		expect(fhsInputData.NumberOfBathrooms).toBe(state.numOfBathrooms);
		expect(fhsInputData.NumberOfSanitaryAccommodations).toBe(state.numOfWCs);
		expect(fhsInputData.NumberOfHabitableRooms).toBe(state.numOfHabitableRooms);
		expect(fhsInputData.NumberOfTappedRooms).toBe(state.numOfRoomsWithTappingPoints);
		expect(fhsInputData.PartGcompliance).toBe(true);
	});

	it("maps fueltype from general details input state to FHS input request", () => {
	// Arrange

		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					complete: true,
					data: state,
				},
			},
		});

		// Act
		const fhsInputDataEnergySupply = mapEnergySupplyFuelTypeData(resolveState(store.$state));

		// Assert
		const expectedResult: Pick<FhsInputSchema, "EnergySupply"> = {
			EnergySupply: {
				"mains elec": {
					fuel: "electricity",
				},
			},
		};
		
		expect(fhsInputDataEnergySupply).toEqual(expectedResult);	
	});

	it("sets is_export_capable to false if fueltype includes LPG", () => {
		// Arrange

		const state: GeneralDetailsData = {
			typeOfDwelling: "flat",
			storeysInDwelling: 3,
			storeyOfFlat: 1,
			buildingLength: 10,
			buildingWidth: 20,
			numOfBedrooms: 2,
			numOfUtilityRooms: 2,
			numOfBathrooms: 1,
			numOfWCs: 1,
			numOfHabitableRooms: 3,
			numOfRoomsWithTappingPoints: 2,
			fuelType: ["mains_gas", "lpg_bulk"],
		};

		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					complete: true,
					data: state,
				},
			},
		});

		// Act
		const fhsInputDataEnergySupply = mapEnergySupplyFuelTypeData(resolveState(store.$state));

		// Assert
		const expectedResult: Pick<FhsInputSchema, "EnergySupply"> = {
			EnergySupply: {
				mains_gas: {
					fuel: "mains_gas",
				},
				"lpg_bulk": {
					fuel: "lpg_bulk",
					factor: {
						is_export_capable: false,
					},	
				},
			},
		};

		expect(fhsInputDataEnergySupply).toEqual(expectedResult);
	});

	it("maps external factors input state to FHS input request", () => {
		// Arrange
		const state: ExternalFactorsData = {
			altitude: 30,
			typeOfExposure: "Normal",
			terrainType: "OpenField",
			noiseNuisance: true,
		};

		store.$patch({
			dwellingDetails: {
				externalFactors: {
					complete: true,
					data: state,
				},
			},
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
			distance: 2,
		};

		store.$patch({
			dwellingDetails: {
				shading: {
					complete: true,
					data: [{
						data: state,
						complete: true,
					}],
				},
			},
		});

		// Act
		const fhsInputData = mapDistantShadingData(resolveState(store.$state));

		const expectedShading: SchemaShadingObject = {
			type: state.objectType,
			height: state.height,
			distance: state.distance,
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
	});

	it("maps appliances input state to FHS input request", () => {
		// Arrange
		const state: AppliancesData = {
			applianceType: ["Oven", "Clothes_drying", "Clothes_washing", "Fridge"],
		};

		store.$patch({
			dwellingDetails: {
				appliances: {
					complete: true,
					data: state,
				},
			},
		});

		// Act
		const fhsInputData = mapAppliancesData(resolveState(store.$state));

		// Assert
		expect(fhsInputData.Appliances?.Oven).toBe("Default");
		expect(fhsInputData.Appliances?.Clothes_drying).toBe("Default");
		expect(fhsInputData.Appliances?.Clothes_washing).toBe("Default");
		expect(fhsInputData.Appliances?.Fridge).toBe("Default");

		expect(fhsInputData.Appliances?.Hobs).toBe("Not Installed");
		expect(fhsInputData.Appliances?.["Fridge-Freezer"]).toBe("Not Installed");
		expect(fhsInputData.Appliances?.Dishwasher).toBe("Not Installed");
		expect(fhsInputData.Appliances?.Freezer).toBe("Not Installed");
	});
});