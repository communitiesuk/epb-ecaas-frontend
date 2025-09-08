describe("SnakeToSentenceCase", () => {
	it("should convert snake_case to Sentence Case", () => {
		enum SnakeCase {
			SNAKE_CASE_EXAMPLE = "snake_case_example",
			ANOTHER_EXAMPLE = "another_example"
		}
		type Result = SnakeToSentenceCase<SnakeCase>;

		const _result: Result = "Snake case example"; // This should be valid
	});

	it("should not allow invalid conversions", () => {
		type SnakeCase = "snake_case_example" | "another_example";
		type Result = SnakeToSentenceCase<SnakeCase>;

		// @ts-expect-error this should be invalid
		const _result: Result = "Invalid example"; // This should be invalid
	});
});

describe("PascalToSentenceCase", () => {
	it("should convert PascalCase to sentence case", () => {
		type PascalCase = "PascalCaseExample" | "AnotherExample";
		type Result = PascalToSentenceCase<PascalCase>;

		expectTypeOf<"Pascal case example">().toMatchTypeOf<Result>();
	});

	it("should not allow invalid conversions", () => {
		type PascalCase = "PascalCaseExample" | "AnotherExample";
		type Result = PascalToSentenceCase<PascalCase>;

		// @ts-expect-error this should be invalid
		const _result: Result = "Invalid example"; // This should be invalid
	});
});