import { show, dim } from "./display";

describe("Show function to make showable value", () => {
	it("renders a string as-is", () => {
		const str = "Acme";
		expect(show(str)).toEqual(str);
	});

	it("renders a number as a string", () => {
		expect(show(4.2)).toBe("4.2");
	});

	it("renders null as a hyphen", () => {
		expect(show(null)).toBe("-");
	});

	it("renders undefined as a hyphen", () => {
		expect(show(undefined)).toBe("-");
	});
});

describe("dim function to show an amount with units", () => {
	it("renders an empty value if undefined passed", () => {
		expect(dim(undefined, "centimetres")).toEqual("-");
	});

	it("renders an amount in metres with correct suffix if metres unit is given", () => {
		expect(dim(30, "metres")).toEqual("30 m");
	});

	it("renders an amount in degrees using correct suffix if degrees given", () => {
		expect(dim(45, "degrees")).toEqual("45 °");
	});

	it("renders a unitless amount without showing suffixed value", () => {
		expect(dim(45)).toEqual("45");
	});

	it("renders a unitless amount passed as undefined as empty value", () => {
		expect(dim(undefined)).toEqual("-");
	});

	it("renders a unit object", () => {
		expect(dim(unitValue(60, "degrees"))).toEqual("60 °");
	});
});

describe("Show boolean in display", () => {
	it("should return Yes when value is true", () => {
		const result = displayBoolean(true);
		expect(result).toBe("Yes");
	});

	it("should return No when value is false", () => {
		const result = displayBoolean(false);
		expect(result).toBe("No");
	});

	it("should return undefined when value is undefined", () => {
		const result = displayBoolean(undefined);
		expect(result).toBe(undefined);
	});
});

describe("Show MassDistributionClass in display", () => {
	it("should return Internal when value is I", () => {
		const result = displayMassDistributionClass("I");
		expect(result).toBe("Internal");
	});

	it("should return External when value is E", () => {
		const result = displayMassDistributionClass("E");
		expect(result).toBe("External");
	});

	it("should return Divided when value is IE", () => {
		const result = displayMassDistributionClass("IE");
		expect(result).toBe("Divided");
	});

	it("should return Equally when value is D", () => {
		const result = displayMassDistributionClass("D");
		expect(result).toBe("Equally");
	});

	it("should return Inside when value is M", () => {
		const result = displayMassDistributionClass("M");
		expect(result).toBe("Inside");
	});

	it("should return undefined when value is undefined", () => {
		const result = displayMassDistributionClass(undefined);
		expect(result).toBe(undefined);
	});
});

describe("Show string in sentence case", () => {
	it("should return string in sentence case", () => {
		const result = sentenceCase("hello_world");
		expect(result).toBe("Hello world");
	});

	it("should return string in sentence case with multiple underscores and initial capital", () => {
		const result = sentenceCase("Hello_world_test");
		expect(result).toBe("Hello world test");
	});

	it("should return string in sentence case with no underscores", () => {
		const result = sentenceCase("helloworld");
		expect(result).toBe("Helloworld");
	});

	it("should return string in sentence with no spaces at start", () => {
		const result = sentenceCase("_energy_from_environment");
		expect(result).toBe("Energy from environment");
	});
});

describe("Show flue gas exhaust situation in display", () => {
	it('should display correct representiation of flue gas exhasut situation "into room"', () => {
		const result = displayFlueGasExhaustSituation("into_room");
		expect(result).toBe("Into room");
	});

	it('should display correct representiation of flue gas exhasut situation "into mechanical vent"', () => {
		const result = displayFlueGasExhaustSituation("into_mech_vent");
		expect(result).toBe("Into mechanical vent");
	});

	it('should display correct representiation of flue gas exhasut situation "into separate duct"', () => {
		const result = displayFlueGasExhaustSituation("into_separate_duct");
		expect(result).toBe("Into separate duct");
	});
});

describe("displaySnakeToSentenceCase", () => {
	it("should convert snake_case to Sentence Case", () => {
		const result = displaySnakeToSentenceCase("hello_world");
		expect(result).toBe("Hello world");
	});

	it("should convert snake_case with multiple underscores to sentence case", () => {
		const result = displaySnakeToSentenceCase("hello_world_test");
		expect(result).toBe("Hello world test");
	});

	it("should return the same string (but capitalised) if no underscores are present", () => {
		const result = displaySnakeToSentenceCase("helloworld");
		expect(result).toBe("Helloworld");
	});
});

describe("displayDeliveryEnergyUseKey", () => {
	it("should convert an appliance key to the correct display value", () => {
		expect(displayDeliveryEnergyUseKey("Clothes_washing")).toBe("Washing machine");
	});

	it("should pass anything else through verbatim", () => {
		expect(displayDeliveryEnergyUseKey("acme")).toBe("acme");
	});
});

describe("adjacentSpaceTypeOptions", () => {
	it("generates options correctly", () => {
		const expectedOptions = {
			[AdjacentSpaceType.heatedSpace]: "Trash compactor to heated space",
			[AdjacentSpaceType.unheatedSpace]: "Trash compactor to unheated space",
		};
		expect(adjacentSpaceTypeOptions("Trash compactor")).toStrictEqual(expectedOptions);
	});
});

describe("displayAdjacentSpaceType", () => {
	it("displays an adjacent space type correctly if provided", () => {
		const expectedDisplay = "Trash compactor to heated space";
		expect(displayAdjacentSpaceType(AdjacentSpaceType.heatedSpace, "Trash compactor")).toBe(expectedDisplay);
	});

	it("returns undefined if adjacent space type is undefined", () => {
		expect(displayAdjacentSpaceType(undefined, "Trash compactor")).toBeUndefined();
	});
});

