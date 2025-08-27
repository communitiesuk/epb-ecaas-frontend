import type { FormKitFrameworkContext } from '@formkit/core';

describe('Show error state', () => {
	it('returns true when state is invalid', () => {
		const context = {
			messages: {
				rule_required: {
					value: 'Field is required.',
					visible: true
				}
			},
			state: {
				invalid: true
			}
		} as unknown as FormKitFrameworkContext;

		const result = showErrorState(context);

		expect(result).toBe(true);
	});

	it('returns true when context contains at least 1 visible error message', () => {
		const context = {
			messages: {
				rule_required: {
					value: 'Field is required.',
					visible: false
				},
				rule_length: {
					value: 'Invalid length.',
					visible: true
				}
			},
			state: {
				invalid: true
			}
		} as unknown as FormKitFrameworkContext;

		const result = showErrorState(context);

		expect(result).toBe(true);
	});

	it('returns false when no visible error message is present', () => {
		const context = {
			messages: {
				rule_required: {
					value: 'Field is required.',
					visible: false
				}
			},
			state: {
				invalid: true
			}
		} as unknown as FormKitFrameworkContext;

		const result = showErrorState(context);

		expect(result).toBe(false);
	});

	it('returns false when no error message is present', () => {
		const context = {
			messages: {},
			state: {
				invalid: true
			}
		} as unknown as FormKitFrameworkContext;

		const result = showErrorState(context);

		expect(result).toBe(false);
	});

	it('returns false when error message is not visible', () => {
		const context = {
			messages: {
				rule_required: {
					value: 'Field is required.',
					visible: false
				}
			},
			state: {
				invalid: true
			}
		} as unknown as FormKitFrameworkContext;

		const result = showErrorState(context);

		expect(result).toBe(false);
	});

	it('returns false when state is valid', () => {
		const context = {
			messages: {},
			state: {
				invalid: false
			}
		} as unknown as FormKitFrameworkContext;

		const result = showErrorState(context);

		expect(result).toBe(false);
	});
});

describe('Get error message', () => {
	it('returns error message when context has error messages', () => {
		const context = {
			messages: {
				rule_required: {
					value: 'Field is required.',
					visible: true
				}
			}
		} as unknown as FormKitFrameworkContext;

		const result = getErrorMessage(context);

		expect(result).toBe('Field is required.');
	});

	it('returns undefined when context has no error messages', () => {
		const context = {
			messages: {}
		} as unknown as FormKitFrameworkContext;

		const result = getErrorMessage(context);

		expect(result).toBeUndefined();
	});

	it('returns first visible error message when context has multiple error messages', () => {
		const context = {
			messages: {
				rule_required: {
					value: 'Field is required.',
					visible: false
				},
				rule_length: {
					value: 'Invalid length.',
					visible: true
				}
			}
		} as unknown as FormKitFrameworkContext;

		const result = getErrorMessage(context);

		expect(result).toBe('Invalid length.');
	});
});

describe('Is integer', () => {
	const makeNode = (value: string | number | null | undefined): FormKitNode => ({
		value
	} as unknown as FormKitNode);

	it('returns true for integer numbers', () => {
		expect(isInteger(makeNode(0))).toBe(true);
		expect(isInteger(makeNode(42))).toBe(true);
		expect(isInteger(makeNode(-7))).toBe(true);
	});

	it('returns true for integer strings', () => {
		expect(isInteger(makeNode('0'))).toBe(true);
		expect(isInteger(makeNode('42'))).toBe(true);
		expect(isInteger(makeNode('-7'))).toBe(true);
	});

	it('returns false for decimal numbers', () => {
		expect(isInteger(makeNode(3.14))).toBe(false);
		expect(isInteger(makeNode(-2.7))).toBe(false);
	});

	it('returns false for decimal strings', () => {
		expect(isInteger(makeNode('3.14'))).toBe(false);
		expect(isInteger(makeNode('-2.7'))).toBe(false);
	});

	it('returns false for non-numeric strings', () => {
		expect(isInteger(makeNode('abc'))).toBe(false);
		expect(isInteger(makeNode('42abc'))).toBe(false);
		expect(isInteger(makeNode('abc42'))).toBe(false);
	});
});