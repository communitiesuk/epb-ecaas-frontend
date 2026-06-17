describe("ECaaS store patch", () => {
	const store = useEcaasStore();
	const state = store.$state;

	it("patches packageProductIds with deprecated packageProductId in heat sources", () => {
		const legacyPackagedProducts: Record<string, unknown> = {
			"domesticHotWater": {
				...state.domesticHotWater,
				"heatSources": {
					"data": [
						{
							"data": { "packageProductId": "1c66db39-fe76-4ccf-aad4-e266d3626afa" },
						},
					],
					"complete": false,
				},
			},
			"spaceHeating": {
				...state.spaceHeating,
				"heatSource": {
					"data": [
						{
							"data": { "packageProductId": "5164a35f-476c-4324-a706-a375c3d8d273" },
						},
					],
					"complete": false,
				},
			},
		};

		const patchedState = patchState({
			...state,
			...legacyPackagedProducts,
		});

		const expectedPackagedProducts: Record<string, unknown> = {
			"domesticHotWater": {
				...state.domesticHotWater,
				"heatSources": {
					"data": [
						{
							"data": { "packageProductIds": ["1c66db39-fe76-4ccf-aad4-e266d3626afa"] },
						},
					],
					"complete": false,
				},
			},
			"spaceHeating": {
				...state.spaceHeating,
				"heatSource": {
					"data": [
						{
							"data": { "packageProductIds": ["5164a35f-476c-4324-a706-a375c3d8d273"] },
						},
					],
					"complete": false,
				},
			},
		};

		expect(patchedState).toEqual(expect.objectContaining({
			...state,
			...expectedPackagedProducts,
		}));
	});

	it("patches lighting as an array when imported data is an object", () => {
		const legacyLighting: Record<string, unknown> = {
			"dwellingFabric": {
				...state.dwellingFabric,
				"dwellingSpaceLighting": {
					"data": {
						"numberOfLEDBulbs": 35,
						"numberOfIncandescentBulbs": 1,
					},
				},
			},
		};

		const patchedState = patchState({
			...state,
			...legacyLighting,
		});

		const expectedLighting: Record<string, unknown> = {
			"dwellingFabric": {
				...state.dwellingFabric,
				"dwellingSpaceLighting": {
					"data": [],
				},
			},
		};

		expect(patchedState).toEqual(expect.objectContaining({
			...state,
			...expectedLighting,
		}));
	});

	describe("patches legacy domestic hot water data", () => {
		it("patches legacy hot water outlets", () => {
			const legacyHotWaterOutlets: Record<string, unknown> = {
				"domesticHotWater": {
					...state.domesticHotWater,
					"hotWaterOutlets": {
						"mixerShower": { "data": [] },
						"electricShower": { "data": [] },
						"bath": { "data": [] },
						"otherOutlets": { "data": [] },
					},
				},
			};

			const patchedState = patchState({
				...state,
				...legacyHotWaterOutlets,
			});

			const expectedHotWaterOutlets: Record<string, unknown> = {
				"domesticHotWater": {
					...state.domesticHotWater,
					"hotWaterOutlets": {
						"data": [],
						"complete": false,
					},
				},
			};

			expect(patchedState).toEqual(expect.objectContaining({
				...state,
				...expectedHotWaterOutlets,
			}));
		});

		it("patches legacy pipework data", () => {
			const legacyPipework: Record<string, unknown> = {
				"domesticHotWater": {
					...state.domesticHotWater,
					"pipework": {
						"primaryPipework": { "data": [] },
						"secondaryPipework": { "data": [] },
					},
				},
			};

			const patchedState = patchState({
				...state,
				...legacyPipework,
			});

			const expectedPipework: Record<string, unknown> = {
				"domesticHotWater": {
					...state.domesticHotWater,
					"pipework": {
						"data": [],
						"complete": false,
					},
				},
			};

			expect(patchedState).toEqual(expect.objectContaining({
				...state,
				...expectedPipework,
			}));
		});
	});

	it("patches heat emitter ids", () => {
		const emittersWithoutIds: Record<string, unknown> = {
			"spaceHeating": {
				...state.spaceHeating,
				"heatEmitters": {
					"data": [
						{
							"data": {
								"emitters": [
									{
										"name": "T21",
										"typeOfHeatEmitter": "radiator",
										"productReference": "33",
										"numOfRadiators": 1,
										"length": 0.6,
									},
									{
										"id": "84d03439-d746-4a96-9d3a-279786ef9ce6",
										"name": "T2",
										"typeOfHeatEmitter": "radiator",
										"productReference": "48",
										"numOfRadiators": 9,
										"length": 0.8,
									},
								],
							},
						},
					],
				},
			},
		};

		const patchedState = patchState({
			...state,
			...emittersWithoutIds,
		}) as EcaasState;

		const patchedEmitterData = patchedState.spaceHeating.heatEmitters.data[0]!.data;

		expect("emitters" in patchedEmitterData).toBe(true);

		if ("emitters" in patchedEmitterData) {
			expect(patchedEmitterData.emitters[0]?.id).toBeDefined();
			expect(patchedEmitterData.emitters[1]?.id).toBe("84d03439-d746-4a96-9d3a-279786ef9ce6");
		}
	});

	it("patches legacy radiator product references to include CR prefix", () => {
		const legacyRadiatorProductReferences: Record<string, unknown> = {
			"spaceHeating": {
				...state.spaceHeating,
				"heatEmitters": {
					"data": [
						{
							"data": {
								"emitters": [
									{
										"id": "12345",
										"name": "Legacy radiator",
										"typeOfHeatEmitter": "radiator",
										"productReference": "33",
										"numOfRadiators": 2,
										"length": 1.2,
									},
									{
										"id": "67890",
										"name": "Already prefixed radiator",
										"typeOfHeatEmitter": "radiator",
										"productReference": "CR34",
										"numOfRadiators": 1,
										"length": 0.6,
									},
									{
										"id": "FC100",
										"name": "Fan coil",
										"typeOfHeatEmitter": "fanCoil",
										"productReference": "35",
										"numOfFanCoils": 1,
									},
								],
							},
						},
					],
				},
			},
		};

		const patchedState = patchState({
			...state,
			...legacyRadiatorProductReferences,
		}) as EcaasState;

		const patchedEmitterData = patchedState.spaceHeating.heatEmitters.data[0]!.data;

		expect("emitters" in patchedEmitterData).toBe(true);

		if ("emitters" in patchedEmitterData) {
			expect(patchedEmitterData.emitters[0]?.productReference).toBe("CR33");
			expect(patchedEmitterData.emitters[1]?.productReference).toBe("CR34");
			expect(patchedEmitterData.emitters[2]?.productReference).toBe("35");
			expect(patchedEmitterData.emitters[0]?.id).toBe("12345");
			expect(patchedEmitterData.emitters[1]?.id).toBe("67890");
		}
	});

	it("converts legacy numeric radiator length values to millimetres", () => {
		const legacyRadiatorLengths: Record<string, unknown> = {
			"spaceHeating": {
				...state.spaceHeating,
				"heatEmitters": {
					"data": [
						{
							"data": {
								"emitters": [
									{
										"id": "12345",
										"name": "Legacy radiator",
										"typeOfHeatEmitter": "radiator",
										"productReference": "33",
										"numOfRadiators": 2,
										"length": 0.6,
									},
								],
							},
						},
					],
				},
			},
		};

		const patchedState = patchState({
			...state,
			...legacyRadiatorLengths,
		}) as EcaasState;

		const patchedEmitterData = patchedState.spaceHeating.heatEmitters.data[0]!.data;

		if ("emitters" in patchedEmitterData) {
			const radiator = patchedEmitterData.emitters[0] as { length?: { amount: number; unit: string } };
			expect(radiator?.length).toEqual({
				"amount": 600,
				"unit": "millimetres",
			});
		}
	});

	it("patches floor ids", () => {
		const floorsWithoutIds: Record<string, unknown> = {
			"dwellingFabric": {
				...state.dwellingFabric,
				"dwellingSpaceFloors": {
					"dwellingSpaceGroundFloor": {
						"data": [
							{
								"data": {
									"name": "Floor 1",
								},
							},
						],
					},
					"dwellingSpaceFloorAboveUnheatedBasement": {
						"data": [
							{
								"data": {
									"name": "Floor 2",
								},
							},
						],
					},
					"dwellingSpaceFloorOfHeatedBasement": {
						"data": [
							{
								"data": {
									"name": "Floor 3",
								},
							},
						],
					},
				},
			},
		};

		const patchedState = patchState({
			...state,
			...floorsWithoutIds,
		}) as EcaasState;

		const { dwellingSpaceGroundFloor, dwellingSpaceFloorAboveUnheatedBasement, dwellingSpaceFloorOfHeatedBasement } = patchedState.dwellingFabric.dwellingSpaceFloors;

		expect(dwellingSpaceGroundFloor.data[0]?.data.id).toBeDefined();
		expect(dwellingSpaceFloorAboveUnheatedBasement.data[0]?.data.id).toBeDefined();
		expect(dwellingSpaceFloorOfHeatedBasement.data[0]?.data.id).toBeDefined();
	});
});