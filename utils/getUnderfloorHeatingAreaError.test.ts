
describe("getTotalFloorArea", () => {
	it("should return the total area of all floor types", () => {
		const groundFloor1: Partial<GroundFloorData> = {
			name: "Ground Floor 1",
			surfaceArea: 50,
		};

		const groundFloor2: Partial<GroundFloorData> = {
			name: "Ground Floor 2",
			surfaceArea: 20,
		};

		const floorAboveUnheatedBasement: Partial<FloorAboveUnheatedBasementData> = {
			name: "Floor Above Unheated Basement",
			surfaceArea: 30,
		};

		const exposedFloor: Partial<ExposedFloorData> = {
			name: "Exposed Floor",
			surfaceArea: 10,
		};

		const floorOfHeatedBasement: Partial<FloorOfHeatedBasementData> = {
			name: "Floor of Heated Basement",
			netSurfaceArea: 40,
		};

		const internalFloor: Partial<InternalFloorData> = {
			name: "Internal floor",
			surfaceAreaOfElement: 25,
		};

		const floors = {
			dwellingSpaceGroundFloor: {
				data: [
					{ data: groundFloor1 },
					{ data: groundFloor2 },
				],
			},
			dwellingSpaceFloorAboveUnheatedBasement: {
				data: [
					{ data: floorAboveUnheatedBasement },
				],
			},
			dwellingSpaceExposedFloor: {
				data: [
					{ data: exposedFloor },
				],
			},
			dwellingSpaceFloorOfHeatedBasement: {
				data: [
					{ data: floorOfHeatedBasement },
				],
			},
			dwellingSpaceInternalFloor: {
				data: [
					{ data: internalFloor },
				],
			},
		} as FloorsData;

		expect(getTotalFloorArea(floors)).toBe(175);
	});

	it("should return 0 when there are no floors", () => {
		const floors = {} as FloorsData;

		expect(getTotalFloorArea(floors)).toBe(0);
	});
});

describe("getUnderfloorHeatingArea", () => {
	const wetDistributionSystem: Partial<HeatEmittingData> = {
		name: "Wet Distribution System",
		typeOfHeatEmitter: "wetDistributionSystem",
		emitters: [ {
			id: "emitter_1",
			name: "Underfloor Heating 1",
			typeOfHeatEmitter: "underFloorHeating",
			areaOfUnderFloorHeating: 30,
			productReference: "1000",
		},
		{
			id: "emitter_2",
			name: "Underfloor Heating 2",
			typeOfHeatEmitter: "underFloorHeating",
			areaOfUnderFloorHeating: 20,
			productReference: "1001",
		}],
	};

	it("should return the total area of underfloor heating emitters", () => {
		const heatEmitters = [{ 
			data: wetDistributionSystem, 
			complete: true as const, 
		}] as SpaceHeating["heatEmitters"]["data"];

		expect(getUnderfloorHeatingArea(heatEmitters)).toBe(50);
	});

	it("should ignore emitters that are not underfloor heating", () => {
		const heatEmitters = [
			{
				data: {
					...wetDistributionSystem,
					emitters: [
						{
							id: "emitter_1",
							name: "Underfloor Heating",
							typeOfHeatEmitter: "underFloorHeating",
							areaOfUnderFloorHeating: 30,
							productReference: "1000",
						},
						{
							id: "emitter_2",
							name: "Radiator",
							typeOfHeatEmitter: "radiator",
							numOfRadiators: 2,
							length: 10,
							productReference: "1001",
						},
					],
				},
			},
		] as SpaceHeating["heatEmitters"]["data"];

		expect(getUnderfloorHeatingArea(heatEmitters)).toBe(30);
	});

	it("should ignore heat emitters that are not wet distribution systems", () => {
		const heatEmitters = [
			{
				data: {
					typeOfHeatEmitter: "warmAirHeater",
				},
			},
		] as SpaceHeating["heatEmitters"]["data"];

		expect(getUnderfloorHeatingArea(heatEmitters)).toBe(0);
	});

	it("should return 0 when there are no heat emitters", () => {
		expect(getUnderfloorHeatingArea([])).toBe(0);
	});

	it("should return 0 when a wet distribution system has no emitters", () => {
		const heatEmitters = [
			{
				data: {
					...wetDistributionSystem,
					emitters: [],
				},
				complete: true,
			},
		] as SpaceHeating["heatEmitters"]["data"];

		expect(getUnderfloorHeatingArea(heatEmitters)).toBe(0);
	});

	it("should return the total area across multiple wet distribution systems", () => {
		const heatEmitters = [
			{
				data: {
					...wetDistributionSystem,
					emitters: [
						{
							id: "emitter_1",
							name: "Underfloor Heating 1",
							typeOfHeatEmitter: "underFloorHeating",
							areaOfUnderFloorHeating: 30,
							productReference: "1000",
						},
					],
				},
			},
			{
				data: {
					...wetDistributionSystem,
					emitters: [
						{
							id: "emitter_2",
							name: "Underfloor Heating 2",
							typeOfHeatEmitter: "underFloorHeating",
							areaOfUnderFloorHeating: 20,
							productReference: "1001",
						},
					],
				},
			},
		] as SpaceHeating["heatEmitters"]["data"];

		expect(getUnderfloorHeatingArea(heatEmitters)).toBe(50);
	});

	it("should return 0 when there is no underfloor heating emitter", () => {
		const heatEmitters = [
			{
				data: {
					typeOfHeatEmitter: "warmAirHeater",
				},
			},
		] as SpaceHeating["heatEmitters"]["data"];

		expect(getUnderfloorHeatingArea(heatEmitters)).toBe(0);
	});
});

describe("getUnderfloorHeatingAreaError", () => {
	const groundFloor: Partial<GroundFloorData> = {
		name: "Ground Floor",
		surfaceArea: 50,
	};

	const wetDistributionSystem: Partial<HeatEmittingData> = {
		name: "Wet Distribution System",
		typeOfHeatEmitter: "wetDistributionSystem",
		emitters: [ {
			id: "emitter_1",
			name: "Underfloor Heating",
			typeOfHeatEmitter: "underFloorHeating",
			areaOfUnderFloorHeating: 60,
			productReference: "1000",
		}],
	};

	it("should return an error when underfloor heating area is greater than total floor area", () => {
		const floors = {
			dwellingSpaceGroundFloor: {
				data: [
					{ data: groundFloor },
				],
			},
		} as FloorsData;

		const heatEmitters = [
			{ data: wetDistributionSystem },
		] as SpaceHeating["heatEmitters"]["data"];

		expect(
			getUnderfloorHeatingAreaError(floors, heatEmitters),
		).toEqual({
			id: "underfloorHeatingAreaError",
			detail: "The area of underfloor heating is larger than the floor area",
		});
	});

	it("should not return an error when underfloor heating area equals total floor area", () => {
		const floors = {
			dwellingSpaceGroundFloor: {
				data: [
					{ data: groundFloor },
				],
			},
		} as FloorsData;

		const heatEmitters = [
			{ data: {
				...wetDistributionSystem,
				emitters: [{
					id: "emitter_1",
					name: "Underfloor Heating",
					typeOfHeatEmitter: "underFloorHeating",
					areaOfUnderFloorHeating: 50,
					productReference: "1000",
				}],
			} },
		] as SpaceHeating["heatEmitters"]["data"];

		expect(
			getUnderfloorHeatingAreaError(floors, heatEmitters),
		).toBeUndefined();
	});

	it("should not return an error when underfloor heating area is less than total floor area", () => {
		const floors = {
			dwellingSpaceGroundFloor: {
				data: [
					{ data: groundFloor },
				],
			},
		} as FloorsData;

		const heatEmitters = [
			{
				data: {
					...wetDistributionSystem,
					emitters: [{
						id: "emitter_1",
						name: "Underfloor Heating",
						typeOfHeatEmitter: "underFloorHeating",
						areaOfUnderFloorHeating: 40,
						productReference: "1000",
					}],
				},
			},
		] as SpaceHeating["heatEmitters"]["data"];

		expect(
			getUnderfloorHeatingAreaError(floors, heatEmitters),
		).toBeUndefined();
	});
});