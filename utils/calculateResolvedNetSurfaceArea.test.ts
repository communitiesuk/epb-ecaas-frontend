import { millimetre } from "./units/length";

describe("calculateResolvedNetSurfaceArea", () => {
	const externalWall: ExternalWallData = {
		id: "80fd1ffe-a83a-4d95-bd2c-ad8fdc37b421",
		name: "External wall 1",
		pitchOption: "90",
		pitch: 90,
		orientation: 0,
		length: 10,
		height: 5,
		elevationalHeight: 20,
		grossSurfaceArea: 55,
		solarAbsorption: 0.1,
		uValue: 1,
		kappaValue: 50000,
		massDistributionClass: "I",
	};

	const externalGlazedDoor: ExternalGlazedDoorData = {
		name: "External glazed door 1",
		associatedItemId: externalWall.id,
		height: 6.5,
		width: 2,
		uValue: 0.45,
		solarTransmittance: 0.1,
		elevationalHeight: 14,
		midHeight: 11,
		openingToFrameRatio: 0.2,
		heightOpenableArea: 14,
		maximumOpenableArea: 13,
		midHeightOpenablePart1: 11,
	};

	const externalUnglazedDoor: ExternalUnglazedDoorData = {
		name: "External unglazed door 1",
		associatedItemId: externalWall.id,
		height: 0.5,
		width: 20,
		surfaceArea: 10,
		elevationalHeight: 20,
		solarAbsorption: 0.1,
		uValue: 1,
		kappaValue: 50000,
		massDistributionClass: "I",
	};

	const window: WindowData = {
		id: "80fd1ffe-a83a-4d95-bd2c-ad8fdc37b321",
		name: "Window 1",
		taggedItem: externalWall.id,
		surfaceArea: 1,
		height: 1,
		width: 1,
		uValue: 1,
		solarTransmittance: 0.1,
		elevationalHeight: 1,
		midHeight: 1,
		openingToFrameRatio: 0.8,
		numberOpenableParts: "0",
		overhangDepth: unitValue(60, millimetre),
		overhangDistance: unitValue(60, millimetre),
		sideFinRightDepth: unitValue(60, millimetre),
		sideFinRightDistance: unitValue(60, millimetre),
		sideFinLeftDepth: unitValue(60, millimetre),
		sideFinLeftDistance: unitValue(60, millimetre),
		curtainsOrBlinds: true,
		treatmentType: "blinds",
		thermalResistivityIncrease: 1,
		solarTransmittanceReduction: 0.1,
	};

	test("returns undefined when given sections with no data", () => {
		const itemsWithTags = [[]];

		const actual = calculateResolvedNetSurfaceArea(externalWall, itemsWithTags);
		expect(actual).toBeUndefined();
	});

	test("calculates net surface area when there are tagged items but none are associated with the main item", () => {
		const externalGlazedDoor2: ExternalGlazedDoorData = {
			name: "External glazed door 1",
			associatedItemId: "other-wall-id",
			height: 6.5,
			width: 2,
			uValue: 0.45,
			solarTransmittance: 0.1,
			elevationalHeight: 14,
			midHeight: 11,
			openingToFrameRatio: 0.2,
			heightOpenableArea: 14,
			maximumOpenableArea: 13,
			midHeightOpenablePart1: 11,
		};
		const itemsWithTags = [[externalGlazedDoor2]];

		const actual = calculateResolvedNetSurfaceArea(externalWall, itemsWithTags);
		expect(actual).toBe(55);
	});

	test("calculates net surface area when there are tagged items and they are associated with the main item", () => {
		const itemsWithTags = [
			[externalGlazedDoor],
			[externalUnglazedDoor],
			[window],
		];

		const actual = calculateResolvedNetSurfaceArea(externalWall, itemsWithTags);
		expect(actual).toBe(31);
	});
});
