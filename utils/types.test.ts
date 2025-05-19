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

describe('SnakeToSentenceCase', () => {
	it('should convert snake_case to Sentence Case', () => {
		enum SnakeCase {
			SNAKE_CASE_EXAMPLE = 'snake_case_example',
			ANOTHER_EXAMPLE = 'another_example'
		}
		type Result = SnakeToSentenceCase<SnakeCase>;

		const _result: Result = 'Snake case example'; // This should be valid
	});

	it('should not allow invalid conversions', () => {
		type SnakeCase = 'snake_case_example' | 'another_example';
		type Result = SnakeToSentenceCase<SnakeCase>;

		// @ts-expect-error this should be invalid
		const _result: Result = 'Invalid example'; // This should be invalid
	});
});