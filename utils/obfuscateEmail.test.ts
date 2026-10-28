import { obfuscateEmail } from "./obfuscateEmail";

describe("obfuscateEmail", () => {
	test("shows the first two characters, obfuscates the remaining username characters, and keeps the domain", () => {
		const email = "joe.bloggs@mhclg.co.uk";

		const result = obfuscateEmail(email);

		expect(result).toBe("jo********@mhclg.co.uk");
	});

	test("does not add asterisks when the username has only two characters", () => {
		const email = "jo@example.com";

		const result = obfuscateEmail(email);

		expect(result).toBe("jo@example.com");
	});

	test("keeps a one-character username unchanged", () => {
		const email = "j@example.com";

		const result = obfuscateEmail(email);

		expect(result).toBe("j@example.com");
	});

	test("returns the original string if there is no @ symbol", () => {
		const email = "joebloggs";

		const result = obfuscateEmail(email);

		expect(result).toBe("joebloggs");
	});

	test("returns an empty string when the email is empty", () => {
		const email = "";

		const result = obfuscateEmail(email);

		expect(result).toBe("");
	});
});