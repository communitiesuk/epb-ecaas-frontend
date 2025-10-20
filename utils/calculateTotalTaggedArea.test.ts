import { calculateTotalTaggedArea } from "./calculateTotalTaggedArea";
import { millimetre } from "./units/length";

describe("calculateTotalTaggedArea", () => {
	const externalWall1: EcaasForm<ExternalWallData> = {
		data: {
			id: "80fd1ffe-a83a-4d95-bd2c-1111111111",
			name: "External wall 1",
			pitchOption: "90",
			pitch: 90,
			orientation: 0,
			length: 10,
			height: 5,
			elevationalHeight: 20,
			grossSurfaceArea: 20,
			solarAbsorption: 0.1,
			uValue: 1,
			kappaValue: 50000,
			massDistributionClass: "I",
		},
	};

	const externalWall2: EcaasForm<Partial<ExternalWallData>> = {
		data: {
			id: "80fd1ffe-a83a-4d95-bd2c-22222222222",
			name: "External wall 2",
			grossSurfaceArea: 15,
		},
	};

	const roof1: EcaasForm<Partial<RoofData>> = {
		data: {
			id: "80fd1ffe-a83a-4d95-bd2c-333333333333",
			name: "Roof 1",
		},
	};

	const externalGlazedDoor1: EcaasForm<ExternalGlazedDoorData> = {
		data: {
			name: "External glazed door 1",
			associatedItemId: externalWall1.data.id,
			height: 1.5,
			width: 2,
			uValue: 0.45,
			solarTransmittance: 0.1,
			elevationalHeight: 14,
			midHeight: 11,
			openingToFrameRatio: 0.2,
			heightOpenableArea: 14,
			maximumOpenableArea: 13,
			midHeightOpenablePart1: 11,
		},
		complete: true,
	};

	const externalGlazedDoor2: EcaasForm<ExternalGlazedDoorData> = {
		data: {
			name: "External glazed door 1",
			associatedItemId: externalWall1.data.id,
			height: 10.5,
			width: 2,
			uValue: 0.45,
			solarTransmittance: 0.1,
			elevationalHeight: 14,
			midHeight: 11,
			openingToFrameRatio: 0.2,
			heightOpenableArea: 14,
			maximumOpenableArea: 13,
			midHeightOpenablePart1: 11,
		},
		complete: true,
	};

	const unglazedDoor1: EcaasForm<ExternalUnglazedDoorData> = {
		data: {
			name: "External unglazed door 1",
			associatedItemId: externalWall1.data.id,
			height: 0.5,
			width: 1,
			elevationalHeight: 20,
			surfaceArea: 2,
			solarAbsorption: 0.1,
			uValue: 1,
			kappaValue: 50000,
			massDistributionClass: "I",
		},
		complete: true,
	};

	const unglazedDoor2: EcaasForm<ExternalUnglazedDoorData> = {
		data: {
			name: "External unglazed door 1",
			associatedItemId: externalWall1.data.id,
			height: 4,
			width: 5,
			elevationalHeight: 20,
			surfaceArea: 20,
			solarAbsorption: 0.1,
			uValue: 1,
			kappaValue: 50000,
			massDistributionClass: "I",
		},
		complete: false,
	};

	const store = useEcaasStore();

	beforeEach(() => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: {
						data: [externalWall1, externalWall2],
					},
				},
				dwellingSpaceCeilingsAndRoofs: {
					dwellingSpaceRoofs: {
						data: [roof1],
					},
				},
			},
		});

	});

	test("when total net surface area is less than the gross surface area", () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceDoors: {
					dwellingSpaceExternalUnglazedDoor: {
						data: [unglazedDoor1],
					},
				},
			},
		});
		const glazedDoors = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor;
		const actual = calculateTotalTaggedArea(
			externalWall1.data.id,
			[glazedDoors],
		);

		expect(actual).toBe(0);
	});

	test("when total net surface area is less than the gross surface area when given multiple sections", () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceDoors: {
					dwellingSpaceExternalUnglazedDoor: {
						data: [unglazedDoor1],
					},
					dwellingSpaceExternalGlazedDoor: {
						data: [externalGlazedDoor1],
					},
				},
			},
		});
		const unglazedDoors = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor;
		const glazedDoors = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor;
		const actual = calculateTotalTaggedArea(
			externalWall1.data.id,
			[unglazedDoors, glazedDoors],
		);

		expect(actual).toBe(5);
	});

	test("when total net surface area is more than the gross surface area", () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceDoors: {
					dwellingSpaceExternalUnglazedDoor: {
						data: [unglazedDoor1],
					},
					dwellingSpaceExternalGlazedDoor: {
						data: [externalGlazedDoor1, externalGlazedDoor2],
					},
				},
			},
		});
		const unglazedDoors = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor;
		const glazedDoors = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor;
		const actual = calculateTotalTaggedArea(
			externalWall1.data.id,
			[unglazedDoors, glazedDoors],
		);

		expect(actual).toBe(26);
	});

	test("only checks section items that are complete", () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceDoors: {
					dwellingSpaceExternalUnglazedDoor: {
						data: [unglazedDoor2],
					},
				},
			},
		});

		const unglazedDoors = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor;
		const actual = calculateTotalTaggedArea(
			externalWall1.data.id,
			[unglazedDoors],
		);

		expect(actual).toBe(0);
	});
});
