import { _private, resolveState } from "./resolve";
import type { Resolved } from "./resolve";

describe("Resolved Type", () => {
	it("should match a resolved state with complete EcaasForm", () => {
        type TestState = {
        	simpleForm: { complete: true; data: { value: string } };
        	incompleteForm: { complete: false; data: { value: string } };
        };
        type ResolvedTestState = Resolved<TestState>;
        expectTypeOf<ResolvedTestState>().toMatchTypeOf<{
        	simpleForm: { value: string };
        }>();
	});
});

describe("resolveState", () => {
	it("should resolve a simple state with complete EcaasForm", () => {
		const state = {
			simpleForm: { complete: true, data: { value: "test" } },
			incompleteForm: { complete: false, data: {} },
		};

		const resolved = _private.resolveStateTree(state);
    
		expect(resolved.simpleForm).toEqual({ value: "test" });
		expect(resolved.incompleteForm).toBeUndefined();
	});

	it("should resolve nested state with complete EcaasForm", () => {
		const state = {
			nestedForm: {
				level1: {
					level2: { complete: true, data: { value: "nested" } },
					incompleteForm: { complete: false, data: {} },
				},
			},
		};

		const resolved = _private.resolveStateTree(state);
    
		expect(resolved.nestedForm.level1.level2).toEqual({ value: "nested" });
		expect(resolved.nestedForm.level1.incompleteForm).toBeUndefined();
	});

	it("should resolve state with mixed EcaasForm and non-EcaasForm values", () => {
		const state = {
			mixedForm: {
				completeForm: { complete: true, data: { value: "complete" } },
				incompleteForm: { complete: false, data: {} },
				regularValue: 42,
			},
		};

		const resolved = _private.resolveStateTree(state);
    
		expect(resolved.mixedForm.completeForm).toEqual({ value: "complete" });
		expect(resolved.mixedForm.incompleteForm).toBeUndefined();
		expect(resolved.mixedForm.regularValue).toBe(42);
	});

	it("should handle empty state", () => {
		const state = {};

		const resolved = resolveState(state as EcaasState);
    
		expect(resolved).toEqual({});
	});

	it("should resolve lists of forms", () => {
		const state = {
			listOfForms: {
				data: [
					{
						data: {
							name: "Acme",
							size: 20,
						},
						complete: true,
					},
					{
						data: {
							name: "Cyberdyne",
							size: 30,
						},
						complete: true,
					},
					{
						data: {
							name: "Tyrell",
							size: 40,
						},
						complete: true,
					},
				],
				complete: true,
			},
		};

		const expectedResolvedState = {
			listOfForms: [
				{
					name: "Acme",
					size: 20,
				},
				{
					name: "Cyberdyne",
					size: 30,
				},
				{
					name: "Tyrell",
					size: 40,
				},
			],
		};

		expect(_private.resolveStateTree(state)).toStrictEqual(expectedResolvedState);
	});

	it("should resolve lists of part-incomplete forms", () => {
		const state = {
			listOfForms: {
				data: [
					{
						data: {
							name: "Acme",
							size: 20,
						},
						complete: true,
					},
					{
						data: {
							name: "Cyberdyne",
							size: 30,
						},
						complete: false,
					},
					{
						data: {
							name: "Tyrell",
							size: 40,
						},
						complete: true,
					},
				],
				complete: true,
			},
		};

		const expectedResolvedState = {
			listOfForms: [
				{
					name: "Acme",
					size: 20,
				},
				{
					name: "Tyrell",
					size: 40,
				},
			],
		};

		expect(_private.resolveStateTree(state)).toStrictEqual(expectedResolvedState);
	});
});