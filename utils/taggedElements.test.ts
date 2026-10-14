const externalWall1 = {
	id: "ex-wall-id",
	name: "External wall 1",
	pitchOption: "custom",
	pitch: 66,
	orientation: 77,
	length: 20,
	height: 0.5,
	elevationalHeight: 20,
	surfaceArea: 10,
	uValue: 1,
	colour: "Intermediate",
	arealHeatCapacity: "Very light",
	massDistributionClass: "I",
} as const satisfies ExternalWallData;

const externalWall2 = {
	...externalWall1,
	id: "ex-wall-id-2",
	name: "External wall 2",
	pitchOption: "custom",
	pitch: 11,
	orientation: 0,
} as const satisfies ExternalWallData;

const vent1 = {
	name: "Vent 1",
	associatedItemId: externalWall1.id,
	effectiveVentilationArea: 10,
	openingRatio: 1,
	midHeightOfZone: 1,
	hasAssociatedItem: true,
} as const satisfies VentData;

const vent2 = {
	...vent1,
	name: "Vent 2",
	associatedItemId: externalWall2.id,
} as const satisfies VentData;

const window = {
	id: "window-id",
	name: "Window 1",
	associatedItemId: externalWall1.id,
	height: 1,
	width: 1,
	uValue: 1,
	solarTransmittance: 0.1,
	elevationalHeight: 1,
	numberOpenableParts: "0",
	freeAreaHeight: 0,
	openingToFrameRatio: 0.2,
	curtainsOrBlinds: false,
	securityRisk: false,
	hasShading: false,
} as const satisfies WindowData;

const roof = {
	id: "roof-id",
	name: "Roof 1",
	typeOfRoof: "flatAboveHeatedSpace",
	pitch: 180,
	length: 4,
	width: 3,
	elevationalHeightOfElement: 5,
	surfaceArea: 12,
	colour: "Intermediate",
	arealHeatCapacity: "Medium",
	massDistributionClass: "I",
	uValue: 2,
} as const satisfies RoofData;

const roofWindow = {
	id: "window-id",
	name: "Window 1",
	associatedItemId: roof.id,
	height: 1,
	width: 1,
	uValue: 1,
	solarTransmittance: 0.1,
	elevationalHeight: 1,
	numberOpenableParts: "0",
	freeAreaHeight: 0,
	openingToFrameRatio: 0.2,
	curtainsOrBlinds: false,
	securityRisk: false,
	hasShading: false,
} as const satisfies WindowData;

const internalWall = {
	id: "e36223a9-420f-422f-ad3f-ccfcec1455c7",
	name: "Internal 1",
	surfaceAreaOfElement: 5,
	arealHeatCapacity: "Very light",
	massDistributionClass: "I",
	pitchOption: "90",
	pitch: 90,
	uValue: 1,
} as const satisfies InternalWallData;

const internalDoorUnheatedSpace = {
	typeOfInternalDoor: "unheatedSpace",
	name: "Internal 1",
	isTheFrontDoor: false,
	associatedItemId: internalWall.id,
	surfaceArea: 5,
	arealHeatCapacity: "Very light",
	massDistributionClass: "I",
	uValue: 0.001,
	thermalResistanceOfAdjacentUnheatedSpace: 1,
} as const satisfies InternalDoorData;

const walls = [externalWall1, externalWall2, internalWall];
const windows = [window];
const roofs = [roof];

describe("getInheritedPitchAndOrientation", () => {
	test("returns pitch and orientation for directly tagged top-level item", () => {
		const idOfTaggedWall = vent1.associatedItemId;

		const actual = getInheritedPitchAndOrientation([walls], idOfTaggedWall);
		const expected = {
			pitch: externalWall1.pitch,
			orientation: externalWall1.orientation,
		};

		expect(actual).toEqual(expected);
	});

	test("returns pitch and orientation for a directly tagged top-level item even when multiple tagged and nested items exist", () => {
		const idOfTaggedWall = vent2.associatedItemId;

		const actual = getInheritedPitchAndOrientation([walls, windows], idOfTaggedWall);
		const expected = {
			pitch: externalWall2.pitch,
			orientation: externalWall2.orientation,
		};

		expect(actual).toEqual(expected);
	});

	test("returns pitch and orientation for a directly tagged top-level item when nested tagged item is set to 'none'", () => {
		const untaggedWindow = {
			...window,
			associatedItemId: "none",
			pitch: 45,
			orientation: 180,
		} as const satisfies WindowData;
		const actual = getInheritedPitchAndOrientation([[untaggedWindow]], untaggedWindow.id);
		const expected = {
			orientation: untaggedWindow.orientation,
			pitch: untaggedWindow.pitch,
		};

		expect(actual).toEqual(expected);
	});

	test("returns pitch and orientation for window inherited from flat roof with no explicit orientation", () => {
		const idOfTaggedRoof = roofWindow.associatedItemId;

		const actual = getInheritedPitchAndOrientation([windows, walls, roofs], idOfTaggedRoof);

		const expected = {
			pitch: roof.pitch,
			orientation: 0,
		};

		expect(actual).toEqual(expected);
	});

	
});

describe("getInheritedPitch", () => {
	test("returns pitch and orientation for door inherited from wall", () => {
		const idOfTaggedWall = internalDoorUnheatedSpace.associatedItemId;

		const actual = getInheritedPitch([windows, walls, roofs], idOfTaggedWall);

		const expected = internalWall.pitch;

		expect(actual).toEqual(expected);
	});
});

describe("getResolvedTaggedItem", () => {
	test("returns the correct values for a directly tagged top-level item", () => {
		const idOfTaggedWall = vent1.associatedItemId;
		const actual = getResolvedTaggedItem([walls], idOfTaggedWall);

		const expected = {
			id: externalWall1.id,
			orientation: externalWall1.orientation,
			pitch: externalWall1.pitch,
		};
		expect(actual).toEqual(expected);
	});

	test("returns the correct values for a directly tagged top-level item even when multiple tagged and nested items exist", () => {
		const idOfTaggedWall = vent2.associatedItemId;

		const actual = getResolvedTaggedItem([walls, windows], idOfTaggedWall);
		const expected = {
			id: externalWall2.id,
			orientation: externalWall2.orientation,
			pitch: externalWall2.pitch,
		};
		expect(actual).toEqual(expected);
	});

	test("returns the correct values for a directly tagged top-level item when nested tagged item is set to 'none'", () => {
		const untaggedWindow: WindowData = {
			...window,
			associatedItemId: "none",
			pitch: 45,
			orientation: 180,
		};

		const actual = getResolvedTaggedItem([[untaggedWindow]], untaggedWindow.id);

		const expected = {
			id: untaggedWindow.id,
			orientation: untaggedWindow.orientation,
			pitch: untaggedWindow.pitch,
		};
		expect(actual).toEqual(expected);
	});

	test("resolves a nested item that references a top-level tagged item", () => {
		const idOfTaggedWall = vent1.associatedItemId;
		const actual = getResolvedTaggedItem([walls, windows], idOfTaggedWall);

		const expected = {
			id: externalWall1.id,
			orientation: externalWall1.orientation,
			pitch: externalWall1.pitch,
		};
		expect(actual).toEqual(expected);
	});
});
