describe("extractSectionItems", () => {
	const store = useEcaasStore();

	beforeEach(() => {
		store.$reset();
	});

	test("item has pitch option, pitch and orientation fields", () => {
		const externalWall1: EcaasForm<ExternalWallData, "name"> = {
			data: {
				id: "external1-id",
				name: "External wall 1",
				pitchOption: "90",
				pitch: 90,
				orientation: 22,
			},
		};

		const externalWall2: EcaasForm<ExternalWallData, "name"> = {
			data: {
				id: "external2-id",
				name: "External wall 2",
				pitchOption: "custom",
				pitch: 80,
				orientation: 0,
			},
		};

		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: {
						data: [externalWall1, externalWall2],
					},
				},
			},
		});

		const { dwellingSpaceExternalWall } =
			store.dwellingFabric.dwellingSpaceWalls;

		const actual = extractSectionItems(dwellingSpaceExternalWall);

		expect(actual).toEqual([
			{ id: "external1-id", name: "External wall 1", pitch: 90, orientation: 22 },
			{ id: "external2-id", name: "External wall 2", pitch: 80, orientation: 0 },
		]);
	});

	test("item has no pitch option or no orientation field", () => {

		const roof1: EcaasForm<RoofData, "name"> = {
			data: {
				id: "roof1-id",
				name: "Roof 1",
				typeOfRoof: "flatAboveHeatedSpace",
				pitchOption: "0",
				pitch: 0,
			},
		};

		const roof2: EcaasForm<RoofData, "name"> = {
			data: {
				id: "roof2-id",
				name: "Roof 2",
				typeOfRoof: "pitchedInsulatedAtRoof",
				pitch: 60,
				orientation: 80,
			},
		};

		store.$patch({
			dwellingFabric: {
				dwellingSpaceCeilingsAndRoofs: {
					dwellingSpaceRoofs: {
						data: [roof1, roof2],
					},
				},
			},
		});

		const { dwellingSpaceRoofs } =
			store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

		const actual = extractSectionItems(dwellingSpaceRoofs);

		expect(actual).toEqual([
			{ id: "roof1-id", name: "Roof 1", pitch: 0 },
			{ id: "roof2-id", name: "Roof 2", pitch: 60, orientation: 80 },
		]);
	});

	test("item pitch or orientation can be undefined", () => {
		const roof1: EcaasForm<RoofData, "name"> = {
			data: {
				id: "roof1-id",
				name: "Roof 1",
				typeOfRoof: "pitchedInsulatedAtRoof",
				pitch: undefined,
				orientation: undefined,
			},
		};

		store.$patch({
			dwellingFabric: {
				dwellingSpaceCeilingsAndRoofs: {
					dwellingSpaceRoofs: {
						data: [roof1],
					},
				},
			},
		});

		const { dwellingSpaceRoofs } =
			store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

		const actual = extractSectionItems(dwellingSpaceRoofs);

		expect(actual).toEqual([
			{ id: "roof1-id", name: "Roof 1", pitch: undefined, orientation: undefined },
		]);
	});

	test("when there is no section data", () => {

		store.$patch({
			dwellingFabric: {
				dwellingSpaceCeilingsAndRoofs: {
					dwellingSpaceRoofs: {
						data: [],
					},
				},
			},
		});
		const { dwellingSpaceRoofs } =
			store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

		const actual = extractSectionItems(dwellingSpaceRoofs);

		expect(actual).toEqual([]);
	});
});
