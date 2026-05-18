import { unitValidationMessages, unitValidationRules } from "./formKitUnitValidation";

type UnitRuleNode = { value: unknown };
type UnitRule = (node: UnitRuleNode, arg?: unknown) => boolean;
type UnitMessage = ((ctx: { name: string, args: unknown[] }) => string) | string;

function getValidationConfig() {
	const rules = unitValidationRules as unknown as Record<string, UnitRule>;
	const validationMessages = unitValidationMessages as Record<string, UnitMessage>;

	return { rules, validationMessages };
}

function getRule(rules: Record<string, UnitRule>, name: string): UnitRule {
	const rule = rules[name];
	if (!rule) throw new Error(`Expected FormKit rule '${name}' to be configured`);
	return rule;
}

function getMessage(messages: Record<string, UnitMessage>, name: string): (ctx: { name: string, args: unknown[] }) => string {
	const message = messages[name];
	if (!message) throw new Error(`Expected FormKit validation message '${name}' to be configured`);
	return typeof message === "string" ? () => message : message;
}

describe("FormKit unit validation", () => {
	const { rules } = getValidationConfig();
	it("zodUnitNumber accepts number and unit object amount", () => {
		const zodUnitNumber = getRule(rules, "zodUnitNumber");

		expect(zodUnitNumber({ value: 5 })).toBe(true);
		expect(zodUnitNumber({ value: { amount: 5, unit: "millimetre" } })).toBe(true);
		expect(zodUnitNumber({ value: { amount: "5", unit: "millimetre" } })).toBe(false);
		expect(zodUnitNumber({ value: undefined })).toBe(false);
	});

	it("zodUnitMin and zodUnitMax apply inclusive bounds", () => {
		const zodUnitMin = getRule(rules, "zodUnitMin");
		const zodUnitMax = getRule(rules, "zodUnitMax");

		expect(zodUnitMin({ value: { amount: 10, unit: "millimetre" } }, 10)).toBe(true);
		expect(zodUnitMin({ value: { amount: 9.9, unit: "millimetre" } }, 10)).toBe(false);
		expect(zodUnitMax({ value: { amount: 10, unit: "millimetre" } }, 10)).toBe(true);
		expect(zodUnitMax({ value: { amount: 10.1, unit: "millimetre" } }, 10)).toBe(false);
	});

	it("zodUnitGreaterThan and zodUnitLessThan apply exclusive bounds", () => {
		const { rules } = getValidationConfig();
		const zodUnitGreaterThan = getRule(rules, "zodUnitGreaterThan");
		const zodUnitLessThan = getRule(rules, "zodUnitLessThan");

		expect(zodUnitGreaterThan({ value: { amount: 10, unit: "millimetre" } }, 10)).toBe(false);
		expect(zodUnitGreaterThan({ value: { amount: 10.1, unit: "millimetre" } }, 10)).toBe(true);
		expect(zodUnitLessThan({ value: { amount: 10, unit: "millimetre" } }, 10)).toBe(false);
		expect(zodUnitLessThan({ value: { amount: 9.9, unit: "millimetre" } }, 10)).toBe(true);
	});

	it.each([
		{ ruleName: "zodUnitMin", value: undefined, arg: 1 },
		{ ruleName: "zodUnitMax", value: "", arg: 1 },
		{ ruleName: "zodUnitGreaterThan", value: { amount: "", unit: "millimetre" }, arg: 1 },
		{ ruleName: "zodUnitLessThan", value: { amount: null, unit: "millimetre" }, arg: 1 },
	])("$ruleName treats empty values as pass so required can handle emptiness", ({ ruleName, value, arg }) => {
		const rule = getRule(rules, ruleName);
		expect(rule({ value }, arg)).toBe(true);
	});

	it.each([
		{ messageName: "zodUnitMax", args: [50], expected: "Thickness of walls must be no more than 50." },
		{ messageName: "zodUnitLessThan", args: [50], expected: "Thickness of walls must be less than 50." },
		{ messageName: "zodUnitMin", args: [0], expected: "Thickness of walls must be no less than 0." },
		{ messageName: "zodUnitGreaterThan", args: [0], expected: "Thickness of walls must be greater than 0." },
	])("$messageName message matches app style", ({ messageName, args, expected }) => {
		const { validationMessages } = getValidationConfig();
		const message = getMessage(validationMessages, messageName);
		expect(message({ name: "Thickness of walls", args })).toBe(expected);
	});
});
