import * as immutable from 'object-path-immutable';
import { BuildType, MassDistributionClass } from "~/schema/api-schema.types";

// define some structures for the test fixtures using types

const simpleCaseOnlyOneForm: Pick<EcaasState, 'dwellingDetails'> = {
	"dwellingDetails": {
		"generalSpecifications": {
			"data": {
				"typeOfDwelling": BuildType.house,
				"storeysInDwelling": 3,
				"numOfBedrooms": 3,
				"coolingRequired": false
			},
			"complete": true
		},
		"shading": {
			"data": []
		},
		"externalFactors": {
			"data": {} as ExternalFactorsData
		}
	}
};

const simpleCaseOneFieldOutOfRange = immutable.set(simpleCaseOnlyOneForm, 'dwellingDetails.generalSpecifications.data.storeysInDwelling', 666); // max storeysInDwelling should be 250

const simpleCaseFieldMissing = immutable.del(simpleCaseOnlyOneForm, 'dwellingDetails.generalSpecifications.data.numOfBedrooms');

const twoCompleteValidWalls: Pick<WallsData, 'dwellingSpaceExternalWall'> = {
	"dwellingSpaceExternalWall": {
		"data": [
			{
				"name": "Wall 1",
				"pitchOption": "90",
				"pitch": 90,
				"orientation": 140,
				"height": 6,
				"length": 5,
				"elevationalHeight": 25,
				"surfaceArea": 40,
				"solarAbsorption": 0.9,
				"uValue": 5,
				"kappaValue": 110000,
				"massDistributionClass": MassDistributionClass.E
			},
			{
				"name": "Wall 2",
				"pitchOption": "90",
				"pitch": 90,
				"orientation": 90,
				"height": 30,
				"length": 34,
				"elevationalHeight": 20,
				"surfaceArea": 30,
				"solarAbsorption": 0.7,
				"uValue": 6,
				"kappaValue": 175000,
				"massDistributionClass": MassDistributionClass.I
			}
		],
		"complete": true
	}
};

const twoWallsOneMissingField = immutable.del(twoCompleteValidWalls, 'dwellingSpaceExternalWall.data.1.solarAbsorption');

const twoWallsOneMissingFieldOneInvalidValue = immutable.set(twoWallsOneMissingField, 'dwellingSpaceExternalWall.data.0.massDistributionClass', 'X'); // 'X' is invalid for a mass distribution class value

const cases: [string, Record<string, unknown>, boolean, Record<string, unknown> | undefined, number][] = [
	[
		'simple case with only one form complete',
		simpleCaseOnlyOneForm,
		false,
		undefined,
		0,
	],
	[
		'simple case with a form marked complete but missing a field',
		simpleCaseFieldMissing,
		true,
		immutable.set(simpleCaseFieldMissing, 'dwellingDetails.generalSpecifications.complete', false),
		1,
	],
	[
		'simple case where form marked complete but a value is out of expected range',
		simpleCaseOneFieldOutOfRange,
		true,
		immutable.set(simpleCaseOneFieldOutOfRange, 'dwellingDetails.generalSpecifications.complete', false),
		1,
	],
	[
		'case where there are two valid walls already marked complete',
		{
			"dwellingFabric": {
				"dwellingSpaceWalls": twoCompleteValidWalls,
			}
		},
		false,
		undefined,
		0
	],
	[
		'case where there are two walls already marked complete but one is missing a field',
		{
			"dwellingFabric": {
				"dwellingSpaceWalls": twoWallsOneMissingField,
			}
		},
		true,
		{
			"dwellingFabric": {
				"dwellingSpaceWalls": immutable.set(twoWallsOneMissingField, 'dwellingSpaceExternalWall.complete', false),
			}
		},
		1,
	],
	[
		'case where there are two walls already marked complete but one is missing a field and one has an illegal value',
		{
			"dwellingFabric": {
				"dwellingSpaceWalls": twoWallsOneMissingFieldOneInvalidValue,
			}
		},
		true,
		{
			"dwellingFabric": {
				"dwellingSpaceWalls": immutable.set(twoWallsOneMissingFieldOneInvalidValue, 'dwellingSpaceExternalWall.complete', false),
			}
		},
		2,
	]
];

describe('revalidate ECaaS states', () => {
	test.each(cases)('revalidating: %s', (_message, state, stateChanged, newState, expectedErrorCount) => {
		const validationResult = revalidateState(state);
		expect(validationResult.changed).toBe(stateChanged);
		if (newState) {
			expect(validationResult.newState).toEqual(newState);
		}
		if (validationResult.changed) {
			expect(validationResult.errors).toHaveLength(expectedErrorCount);
		}
	});
});