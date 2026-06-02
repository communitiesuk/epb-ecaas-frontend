import type { FormKitNode } from "@formkit/core";

type ValidationMessageContext = { name: string, args: unknown[] };

function getNumericAmount(value: unknown): number | undefined {
	if (typeof value === "number") return value;
	if (typeof value === "object" && value !== null && "amount" in value) {
		const amount = value.amount;
		return typeof amount === "number" && !Number.isNaN(amount) ? amount : undefined;
	}
	return undefined;
}

function isEmptyValue(value: unknown): boolean {
	if (value === undefined || value === null || value === "") return true;
	if (typeof value === "object" && value !== null && "amount" in value) {
		const amount = value.amount;
		return amount === undefined || amount === null || amount === "";
	}
	return false;
}

export const unitValidationMessages = {
	zodUnitNumber: ({ name }: ValidationMessageContext) => `${name} must be a number.`,
	zodUnitMin: ({ name, args }: ValidationMessageContext) => `${name} must be no less than ${args[0]}.`,
	zodUnitMax: ({ name, args }: ValidationMessageContext) => `${name} must be no more than ${args[0]}.`,
	zodUnitGreaterThan: ({ name, args }: ValidationMessageContext) => `${name} must be greater than ${args[0]}.`,
	zodUnitLessThan: ({ name, args }: ValidationMessageContext) => `${name} must be less than ${args[0]}.`,
};

export const unitValidationRules = {
	zodUnitNumber(node: FormKitNode) {
		return typeof getNumericAmount(node.value) === "number";
	},
	zodUnitMin(node: FormKitNode, min: unknown) {
		if (isEmptyValue(node.value)) return true;
		const value = getNumericAmount(node.value);
		const minimum = Number(min);
		if (typeof value !== "number" || Number.isNaN(minimum)) return false;
		return value >= minimum;
	},
	zodUnitMax(node: FormKitNode, max: unknown) {
		if (isEmptyValue(node.value)) return true;
		const value = getNumericAmount(node.value);
		const maximum = Number(max);
		if (typeof value !== "number" || Number.isNaN(maximum)) return false;
		return value <= maximum;
	},
	zodUnitGreaterThan(node: FormKitNode, min: unknown) {
		if (isEmptyValue(node.value)) return true;
		const value = getNumericAmount(node.value);
		const minimum = Number(min);
		if (typeof value !== "number" || Number.isNaN(minimum)) return false;
		return value > minimum;
	},
	zodUnitLessThan(node: FormKitNode, max: unknown) {
		if (isEmptyValue(node.value)) return true;
		const value = getNumericAmount(node.value);
		const maximum = Number(max);
		if (typeof value !== "number" || Number.isNaN(maximum)) return false;
		return value < maximum;
	},
};
