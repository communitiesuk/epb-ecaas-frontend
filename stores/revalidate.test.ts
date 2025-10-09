import * as immutable from "object-path-immutable";

// define some structures for the test fixtures using types

const simpleCaseOnlyOneForm: Pick<EcaasState, "dwellingDetails"> = {
	"dwellingDetails": {
		"generalSpecifications": {
			"data": {
				"typeOfDwelling": "house",
				"storeysInDwelling": 3,
				"numOfBedrooms": 3,
				"coolingRequired": false,
			},
			"complete": true,
		},
		"shading": {
			"data": [],
		},
		"externalFactors": {
			"data": {} as ExternalFactorsData,
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
					"arealHeatCapacity": "Medium",
					"massDistributionClass": "E",
				},
				"complete": true,
			},
			{
				"data": {
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
						"arealHeatCapacity": "Medium",
						"massDistributionClass": "E",
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
						"arealHeatCapacity": "Heavy",
						"massDistributionClass": "I",
					},
				],
				"complete": true,
			},
		},
	},
};

const twoWallsOneMissingField = immutable.del(twoCompleteValidWalls, "dwellingSpaceExternalWall.data.1.data.solarAbsorption");

const twoWallsOneMissingFieldOneInvalidValue = immutable.set(twoWallsOneMissingField, "dwellingSpaceExternalWall.data.0.massDistributionClass", "X"); // 'X' is invalid for a mass distribution class value

const twoHeatPumps: Pick<EcaasState, "heatingSystems"> = {
	"heatingSystems": {
		"heatGeneration": {
			"heatPump": {
				"data": [
					{
						"data": {
							"id": "1049a8a3-e520-4058-8f18-fdfbf2dde19a",
							"name": "Heat pump 1",
							"productReference": "HEATPUMP-SMALL",
						},
						"complete": true,
					},
					{
						"data": {
							"id": "2fa843a1-b774-42f8-b3ca-1f5f5a8a576a",
							"name": "Heat pump 2",
							"productReference": "HEATPUMP-LARGE",
						},
						"complete": true,
					},
				],
				"complete": true,
			},
			"boiler": {
				"data": [],
				"complete": true,
			},
			"heatBattery": {
				"data": [],
				"complete": true,
			},
			"heatNetwork": {
				"data": [],
				"complete": true,
			},
			"heatInterfaceUnit": {
				"data": [],
				"complete": true,
			},
		},
		"energySupply": {
			"data": {} as EnergySupplyData,
		},
		"heatEmitting": {
			"wetDistribution": {
				"data": [],
			},
			"instantElectricHeater": {
				"data": [],
			},
			"electricStorageHeater": {
				"data": [],
			},
			"warmAirHeatPump": {
				"data": [],
			},
		},
		"cooling": {
			"airConditioning": { "data": [] },
		},
	},
};

const twoHeatPumpsOneWithMissingFields = immutable.del(twoHeatPumps, "heatingSystems.heatGeneration.heatPump.data.1.data.productReference");

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
		immutable.set(immutable.set(twoHeatPumpsOneWithMissingFields, "heatingSystems.heatGeneration.heatPump.data.1.complete", false), "heatingSystems.heatGeneration.heatPump.complete", false),
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