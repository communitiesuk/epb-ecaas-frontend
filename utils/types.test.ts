describe('EnumRecord ensures all members of an enumeration are used as keys', () => {
	it('should create a record with all enum members as keys', () => {
		enum TestEnum {
			A = 'A',
			B = 'B',
			C = 'C'
		}

        type TestEnumRecord = EnumRecord<TestEnum, number>;

        const testEnumRecord: TestEnumRecord = {
        	A: 1,
        	B: 2,
        	C: 3
        };

        expectTypeOf(testEnumRecord).toMatchTypeOf({
        	A: 1,
        	B: 2,
        	C: 3
        });
	});

	it('should not allow missing enum members', () => {
		enum TestEnum {
			A = 'A',
			B = 'B',
			C = 'C'
		}

        type TestEnumRecord = EnumRecord<TestEnum, number>;

        // @ts-expect-error this record is missing the C member and so is expected to be invalid
        const _testEnumRecord: TestEnumRecord = {
        	A: 1,
        	B: 2
        	// C is missing
        };
	});
});