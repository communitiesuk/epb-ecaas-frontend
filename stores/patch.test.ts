describe("ECaaS store patch", () => {
	const store = useEcaasStore();
	const state = store.$state;

	it("patches packageProductIds with deprecated packageProductId in heat sources", () => {
		const legacyPackagedProducts: Record<string, unknown> = {
			"domesticHotWater": {
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
});