
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
		};

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
		};

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
		};

		const result = showErrorState(context);

		expect(result).toBe(false);
	});

	it('returns false when no error message is present', () => {
		const context = {
			messages: {},
			state: {
				invalid: true
			}
		};

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
		};

		const result = showErrorState(context);

		expect(result).toBe(false);
	});

	it('returns false when state is valid', () => {
		const context = {
			messages: {},
			state: {
				invalid: false
			}
		};

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
		};

		const result = getErrorMessage(context);

		expect(result).toBe('Field is required.');
	});

	it('returns undefined when context has no error messages', () => {
		const context = {
			messages: {}
		};

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
		};

		const result = getErrorMessage(context);

		expect(result).toBe('Invalid length.');
	});
});