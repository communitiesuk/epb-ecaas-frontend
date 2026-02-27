import * as immutable from "object-path-immutable";

// define some structures for the test fixtures using types

const simpleCaseOnlyOneForm: Pick<EcaasState, "dwellingDetails"> = {
	"dwellingDetails": {
		"generalSpecifications": {
			"data": {
				"typeOfDwelling": "house",
				"storeysInDwelling": 3,
				"numOfBedrooms": 3,
				"numOfBathrooms": 1,
				"numOfWCs": 1,
				"numOfHabitableRooms": 4,
				"numOfRoomsWithTappingPoints": 2,
				"numOfWetRooms": 3,
				"numOfUtilityRooms": 1,
				"buildingLength": 7,
				"buildingWidth": 7,
				"fuelType": [],
			},
			"complete": true,
		},
		"shading": {
			"data": [],
		},
		"externalFactors": {
			"data": {} as ExternalFactorsData,
		},
		"appliances": {
			"data": {} as AppliancesData,
		},
	},
};

const simpleCaseOneFieldOutOfRange = immutable.set(simpleCaseOnlyOneForm, "dwellingDetails.generalSpecifications.data.storeysInDwelling", 666); // max storeysInDwelling should be 250

const simpleCaseFieldMissing = immutable.del(simpleCaseOnlyOneForm, "dwellingDetails.generalSpecifications.data.numOfBedrooms");

const twoCompleteValidWalls: Pick<WallsData, "dwellingSpaceExternalWall"> = {
	"dwellingSpaceExternalWall": {
		"data": [
			{
				"data": {
					"id": "5c809256-0702-48a5-bce0-7d1617e852fc",
					"name": "Wall 1",
					"pitchOption": "90",
					"pitch": 90,
					"orientation": 140,
					"height": 6,
					"length": 5,
					"elevationalHeight": 25,
					"surfaceArea": 40,
					"thermalResistance": 0.5,
					"colour": "Light",
					"arealHeatCapacity": "Medium",
					"massDistributionClass": "E",
				},
				"complete": true,
			},
			{
				"data": {
					"id": "81b62646-eac0-4f1f-8d26-a785a565c751",
					"name": "Wall 2",
					"pitchOption": "90",
					"pitch": 90,
					"orientation": 90,
					"height": 30,
					"length": 34,
					"elevationalHeight": 20,
					"surfaceArea": 30,
					"thermalResistance": 0.6,
					"colour": "Intermediate",
					"arealHeatCapacity": "Heavy",
					"massDistributionClass": "I",
				},
				"complete": true,
			},
		],
		"complete": true,
	},
};

const twoLegacyCompleteValidWalls = {
	"dwellingFabric": {
		"dwellingSpaceWalls": {
			"dwellingSpaceExternalWall": {
				"data": [
					{
						"id": "5c809256-0702-48a5-bce0-7d1617e852fc",
						"name": "Wall 1",
						"pitchOption": "90",
						"pitch": 90,
						"orientation": 140,
						"height": 6,
						"length": 5,
						"elevationalHeight": 25,
						"surfaceArea": 40,
						"thermalResistance": 0.5,
						"arealHeatCapacity": "Medium",
						"massDistributionClass": "E",
						"colour": "Light",
					},
					{
						"id": "81b62646-eac0-4f1f-8d26-a785a565c751",
						"name": "Wall 2",
						"pitchOption": "90",
						"pitch": 90,
						"orientation": 90,
						"height": 30,
						"length": 34,
						"elevationalHeight": 20,
						"surfaceArea": 30,
						"thermalResistance": 0.6,
						"arealHeatCapacity": "Heavy",
						"massDistributionClass": "I",
						"colour": "Intermediate",
					},
				],
				"complete": true,
			},
		},
	},
};

const twoWallsOneMissingField = immutable.del(twoCompleteValidWalls, "dwellingSpaceExternalWall.data.1.data.elevationalHeight");

const twoWallsOneMissingFieldOneInvalidValue = immutable.set(twoWallsOneMissingField, "dwellingSpaceExternalWall.data.0.massDistributionClass", "X"); // 'X' is invalid for a mass distribution class value

const twoHeatPumps: Pick<EcaasState, "spaceHeating"> = {
	"spaceHeating": {
		"heatSource": {
			"data": [
				{
					"data": {
						"id": "1049a8a3-e520-4058-8f18-fdfbf2dde19a",
						"name": "Heat pump 1",
						"productReference": "HEATPUMP-SMALL",
						"typeOfHeatSource": "heatPump",
						"typeOfHeatPump": "airSource",
					},
					"complete": true,
				},
				{
					"data": {
						"id": "2fa843a1-b774-42f8-b3ca-1f5f5a8a576a",
						"name": "Heat pump 2",
						"productReference": "HEATPUMP-LARGE",
						"typeOfHeatSource": "heatPump",
						"typeOfHeatPump": "airSource",
					},
					"complete": true,
				},
			],
			"complete": true,
		},
		heatEmitters: {
			data: [],
			complete: true,
		},
		heatingControls: {
			data: [],
			complete: true,
		},
	},
};

const twoHeatPumpsOneWithMissingFields = immutable.del(twoHeatPumps, "spaceHeating.heatSource.data.1.data.productReference");

const cases: [string, Record<string, unknown>, boolean, Record<string, unknown> | undefined, number][] = [
	[
		"simple case with only one form complete",
		simpleCaseOnlyOneForm,
		false,
		undefined,
		0,
	],
	[
		"simple case with a form marked complete but missing a field",
		simpleCaseFieldMissing,
		true,
		immutable.set(simpleCaseFieldMissing, "dwellingDetails.generalSpecifications.complete", false),
		1,
	],
	[
		"simple case where form marked complete but a value is out of expected range",
		simpleCaseOneFieldOutOfRange,
		true,
		immutable.set(simpleCaseOneFieldOutOfRange, "dwellingDetails.generalSpecifications.complete", false),
		1,
	],
	[
		"case where there are two valid walls already marked complete",
		{
			"dwellingFabric": {
				"dwellingSpaceWalls": twoCompleteValidWalls,
			},
		},
		false,
		undefined,
		0,
	],
	[
		"case where there are two walls already marked complete but one is missing a field",
		{
			"dwellingFabric": {
				"dwellingSpaceWalls": twoWallsOneMissingField,
			},
		},
		true,
		{
			"dwellingFabric": {
				"dwellingSpaceWalls": immutable.set(twoWallsOneMissingField, "dwellingSpaceExternalWall.complete", false),
			},
		},
		1,
	],
	[
		"case where there are two walls already marked complete but one is missing a field and one has an illegal value",
		{
			"dwellingFabric": {
				"dwellingSpaceWalls": twoWallsOneMissingFieldOneInvalidValue,
			},
		},
		true,
		{
			"dwellingFabric": {
				"dwellingSpaceWalls": immutable.set(twoWallsOneMissingFieldOneInvalidValue, "dwellingSpaceExternalWall.complete", false),
			},
		},
		1,
	],
	[
		"case where there are two heat pumps (lists of items each with complete states), all complete and valid",
		twoHeatPumps,
		false,
		undefined,
		0,
	],
	[
		"case where there are two heat pumps but one has missing field: individual heat pump and whole section should be marked invalid",
		twoHeatPumpsOneWithMissingFields,
		true,
		immutable.set(immutable.set(twoHeatPumpsOneWithMissingFields, "spaceHeating.heatSource.data.1.complete", false), "spaceHeating.heatSource.complete", false),
		1,
	],
	[
		"case where there is a legacy array of form data: data should be wrapped in EcaasForm objects",
		twoLegacyCompleteValidWalls,
		false,
		{
			"dwellingFabric": {
				"dwellingSpaceWalls": twoCompleteValidWalls,
			},
		},
		0,
	],
];

describe("revalidate ECaaS states", () => {
	test.each(cases)("revalidating: %s", (_message, state, stateChanged, newState, expectedErrorCount) => {
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