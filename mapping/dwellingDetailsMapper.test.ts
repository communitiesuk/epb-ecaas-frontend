import { ApplianceKey, BuildType, ShadingObjectType } from '~/schema/api-schema.types';
import { mapDwellingDetailsData } from './dwellingDetailsMapper';

describe('dwelling details mapper', () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it('maps general specifications input state to FHS input request', () => {
		// Arrange
		const state: GeneralSpecificationsData = {
			typeOfDwelling: BuildType.flat,
			storeysInDwelling: 3,
			storeyOfFlat: 1,
			numOfBedrooms: 2,
			partGCompliance: true,
			coolingRequired: false
		};

		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					data: state
				}
			}
		});

		// Act
		const fhsInputData = mapDwellingDetailsData(store);

		// Assert
		expect(fhsInputData.General!.build_type).toBe(state.typeOfDwelling);
		expect(fhsInputData.General!.storeys_in_building).toBe(state.storeysInDwelling);
		expect(fhsInputData.General!.storey_of_dwelling).toBe(state.storeyOfFlat);
		expect(fhsInputData.NumberOfBedrooms).toBe(state.numOfBedrooms);
		expect(fhsInputData.PartGcompliance).toBe(true);
		expect(fhsInputData.PartO_active_cooling_required).toBe(false);
	});

	it('maps external factors input state to FHS input request', () => {
		// Arrange
		const state: ExternalFactorsData = {
			altitude: 30,
			typeOfExposure: 'Normal',
			terrainType: 'OpenField',
			noiseNuisance: true
		};

		store.$patch({
			dwellingDetails: {
				externalFactors: {
					data: state
				}
			}
		});

		// Act
		const fhsInputData = mapDwellingDetailsData(store);

		// Assert
		expect(fhsInputData.InfiltrationVentilation?.altitude).toBe(state.altitude);
		expect(fhsInputData.InfiltrationVentilation?.shield_class).toBe('Normal');
		expect(fhsInputData.InfiltrationVentilation?.terrain_class).toBe('OpenField');
		expect(fhsInputData.InfiltrationVentilation?.noise_nuisance).toBe(true);
	});

	it('maps shading input state to FHS input request', () => {
		// Arrange
		const state: ShadingData = {
			name: "Big Tree",
			startAngle: 10,
			endAngle: 20,
			objectType: ShadingObjectType.obstacle,
			height: 3,
			distance: 2
		};

		store.$patch({
			dwellingDetails: {
				shading: {
					data: [state]
				}
			}
		});

		// Act
		const fhsInputData = mapDwellingDetailsData(store);
		const shadingSegment = fhsInputData.ExternalConditions?.shading_segments![0];

		// Assert
		expect(shadingSegment).toBeDefined();
		expect(shadingSegment?.number).toBe(1);
		expect(shadingSegment?.start360).toBe(state.startAngle);
		expect(shadingSegment?.end360).toBe(state.endAngle);
		expect(shadingSegment?.shading![0]?.type).toBe(state.objectType);
		expect(shadingSegment?.shading![0]?.height).toBe(state.height);
		expect(shadingSegment?.shading![0]?.distance).toBe(state.distance);
	});

	it('maps appliances input state to FHS input request', () => {
		// Arrange
		const state: AppliancesData = {
			appliances: [
				ApplianceKey.Fridge,
				ApplianceKey.Freezer,
				ApplianceKey.Fridge_Freezer,
				ApplianceKey.Dishwasher,
				ApplianceKey.Oven,
				ApplianceKey.Clothes_washing,
				ApplianceKey.Clothes_drying,
				ApplianceKey.Hobs,
				ApplianceKey.Kettle,
				ApplianceKey.Microwave
			]
		};

		store.$patch({
			dwellingDetails: {
				appliances: {
					data: state
				}
			}
		});

		// Act
		const fhsInputData = mapDwellingDetailsData(store);

		// Assert
		const expectedAppliances = {
			'Dishwasher': 'Default',
			'Clothes_washing': 'Default',
			'Clothes_drying': 'Default',
			'Fridge': 'Default',
			'Freezer': 'Default',
			'Fridge-Freezer': 'Default',
			'Oven': 'Default',
			'Kettle': 'Default',
			'Microwave': 'Default',
			'Hobs': 'Default'
		};

		expect(fhsInputData.Appliances).toEqual(expectedAppliances);
	});
});