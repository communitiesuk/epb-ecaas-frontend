import { MassDistributionClass } from "~/schema/api-schema.types";

describe("getResolvedTaggedItem", () => {

	const externalWall1: ExternalWallData = {
		id: "ex-wall-id",
		name: "External wall 1",
		pitchOption: "custom",
		pitch: 66,
		orientation: 77,
		length: 20,
		height: 0.5,
		elevationalHeight: 20,
		surfaceArea: 10,
		solarAbsorption: 0.1,
		uValue: 1,
		kappaValue: 50000,
		massDistributionClass: MassDistributionClass.I,
	};

	const externalWall2: ExternalWallData = {
		...externalWall1,
		id: "ex-wall-id-2",
		name: "External wall 2",
		pitchOption: "custom",
		pitch: 11,
		orientation: 0,
	};
		
	const vent1: VentData = {
		name: "Vent 1",
		typeOfVent: "trickle",
		associatedWallRoofWindowId: externalWall1.id,
		effectiveVentilationArea: 10,
		openingRatio: 1,
		midHeightOfZone: 1,
	};

	const vent2: VentData = {
		...vent1,
		name: "Vent 2",
		associatedWallRoofWindowId: externalWall2.id,
	};

	const window: WindowData = {
		id: "window-id",
		name: "Window 1",
		taggedItem: externalWall1.id,
		surfaceArea: 1,
		height: 1,
		width: 1,
		uValue: 1,
		solarTransmittance: 0.1,
		elevationalHeight: 1,
		midHeight: 1,
		numberOpenableParts: "0",
		openingToFrameRatio: 0.2,
		curtainsOrBlinds: false,
	};
   
	const walls = [externalWall1, externalWall2];
	const windows = [window];

	test("returns the correct values for a directly tagged top-level item", () => {

		const idOfTaggedWall = vent1.associatedWallRoofWindowId;
		const actual = getResolvedTaggedItem([walls], idOfTaggedWall);
		
		const expected =  { id: externalWall1.id, orientation: externalWall1.orientation, pitch: externalWall1.pitch };
		expect(actual).toEqual(expected);
	});

	test("returns the correct values for a directly tagged top-level item even when multiple tagged and nested items exist", () => {

		const idOfTaggedWall = vent2.associatedWallRoofWindowId;

		const actual = getResolvedTaggedItem([walls, windows], idOfTaggedWall);
		const expected = { id: externalWall2.id, orientation: externalWall2.orientation, pitch: externalWall2.pitch };
		expect(actual).toEqual(expected);
	});

	test("resolves a nested item that references a top-level tagged item", () => {

		const idOfTaggedWall = vent1.associatedWallRoofWindowId;
		const actual = getResolvedTaggedItem([walls, windows], idOfTaggedWall);
		
		const expected =  { id: externalWall1.id, orientation: externalWall1.orientation, pitch: externalWall1.pitch };
		expect(actual).toEqual(expected);
	});
});