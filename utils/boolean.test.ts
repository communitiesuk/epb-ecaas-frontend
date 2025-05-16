describe('Show boolean in display', () => {
	it('should return Yes when value is true', () => {
		const result = displayBoolean(true);
		expect(result).toBe('Yes');
	});

	it('should return No when value is false', () => {
		const result = displayBoolean(false);
		expect(result).toBe('No');
	});

	it('should return undefined when value is undefined', () => {
		const result = displayBoolean(undefined);
		expect(result).toBe(undefined);
	});
});
