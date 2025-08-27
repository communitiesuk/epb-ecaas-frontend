const cases: [string, Record<string, unknown>, boolean, Record<string, unknown> | undefined, number][] = [
	[
		'simple case with only one form complete',
		{
			"dwellingDetails": {
				"generalSpecifications": {
					"data": {
						"typeOfDwelling": "house",
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
					"data": {}
				}
			}
		},
		false,
		undefined,
		0,
	],
	[
		'simple case with a form marked complete but missing a field',
		{
			"dwellingDetails": {
				"generalSpecifications": {
					"data": {
						"typeOfDwelling": "house",
						"storeysInDwelling": 3,
						"coolingRequired": false
					},
					"complete": true
				},
				"shading": {
					"data": []
				},
				"externalFactors": {
					"data": {}
				}
			}
		},
		true,
		{
			"dwellingDetails": {
				"generalSpecifications": {
					"data": {
						"typeOfDwelling": "house",
						"storeysInDwelling": 3,
						"coolingRequired": false
					},
					"complete": false
				},
				"shading": {
					"data": []
				},
				"externalFactors": {
					"data": {}
				}
			}
		},
		1,
	],
	[
		'simple case where form marked complete but a value is out of expected range',
		{
			"dwellingDetails": {
				"generalSpecifications": {
					"data": {
						"typeOfDwelling": "house",
						"storeysInDwelling": 666, // max is 250
						"numOfBedrooms": 3,
						"coolingRequired": false
					},
					"complete": true
				},
				"shading": {
					"data": []
				},
				"externalFactors": {
					"data": {}
				}
			}
		},
		true,
		{
			"dwellingDetails": {
				"generalSpecifications": {
					"data": {
						"typeOfDwelling": "house",
						"storeysInDwelling": 666,
						"numOfBedrooms": 3,
						"coolingRequired": false
					},
					"complete": false
				},
				"shading": {
					"data": []
				},
				"externalFactors": {
					"data": {}
				}
			}
		},
		1,
	],
	[
		'case where there are two valid walls already marked complete',
		{
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
								"kappaValue": 110000,
								"massDistributionClass": "E"
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
								"massDistributionClass": "I"
							}
						],
						"complete": true
					}
				}
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
								"kappaValue": 110000,
								"massDistributionClass": "E"
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
								"uValue": 6,
								"kappaValue": 175000,
								"massDistributionClass": "I"
							}
						],
						"complete": true
					}
				}
			}
		},
		true,
		{
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
								"kappaValue": 110000,
								"massDistributionClass": "E"
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
								"uValue": 6,
								"kappaValue": 175000,
								"massDistributionClass": "I"
							}
						],
						"complete": false
					}
				}
			}
		},
		1,
	],
	[
		'case where there are two walls already marked complete but one is missing a field and one has an illegal value',
		{
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
								"solarAbsorption": 0.9,
								"uValue": 5,
								"kappaValue": 110000,
								"massDistributionClass": "E"
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
								"uValue": 6,
								"kappaValue": 175000,
								"massDistributionClass": "X" // unknown value
							}
						],
						"complete": true
					}
				}
			}
		},
		true,
		{
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
								"solarAbsorption": 0.9,
								"uValue": 5,
								"kappaValue": 110000,
								"massDistributionClass": "E"
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
								"uValue": 6,
								"kappaValue": 175000,
								"massDistributionClass": "X" // unknown value
							}
						],
						"complete": false
					}
				}
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