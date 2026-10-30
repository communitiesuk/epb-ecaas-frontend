import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/vue";
import { beforeEach, describe, expect, it, test, vi } from "vitest";
import GetBrelReport from "./get-brel-report.vue";

const { navigateToMock, fetchMock } = vi.hoisted(() => ({
	navigateToMock: vi.fn(),
	fetchMock: vi.fn(),
}));

mockNuxtImport("navigateTo", () => navigateToMock);

beforeEach(() => {
	fetchMock.mockReset();
	vi.stubGlobal("$fetch", fetchMock);
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("Get BREL Report", () => {
	const user = userEvent.setup();

	const notRegisteredMessage =
        "The assessor name and ID provided don't match our records. You cannot download a BREL report without supplying accurate assessor details.";
	const noEmailMessage =
        "We found your details on the register, but there is no email address linked to your account. Please update your email address via your scheme provider.";

	interface FetchMockOptions {
		body?: {
			name?: string;
			id?: string;
		};
		[key: string]: unknown;
	}

	beforeEach(() => {
		navigateToMock.mockReset();

		fetchMock.mockImplementation(async (_url: string, options?: FetchMockOptions) => {
			const body = options?.body;
			const name = body?.name?.trim().toLowerCase();
			const id = body?.id?.trim().toUpperCase();

			if (name === "test assessor" && id === "TEST123") {
				return { isValid: true, reason: null, email: "test.assessor@homes.co.uk" };
			}

			if (name === "no email assessor" && id === "NOEMAIL123") {
				return { isValid: false, reason: "NO_EMAIL", email: null };
			}

			return { isValid: false, reason: "NOT_FOUND", email: null };
		});
	});

	const populateForm = async () => {
		await user.click(screen.getByRole("radio", { name: "Design" }));

		await user.type(screen.getByLabelText(/plot reference/i), "Plot 123");
		await user.type(screen.getByLabelText(/site reference/i), "Site 456");

		await user.type(screen.getByLabelText(/client name/i), "Jane Smith");
		await user.type(screen.getByLabelText(/client organisation/i), "Example Ltd");
		await user.type(screen.getByLabelText(/client address/i), "1 Example Street");

		await user.click(
			screen.getByRole("checkbox", {
				name: /i confirm that this is my name and assessor credentials/i,
			}),
		);
	};

	it("displays get BREL report form correctly", async () => {
		await renderSuspended(GetBrelReport);

		expect(screen.getByTestId("typeOfReport")).toBeDefined();
		expect(screen.getByTestId("siteReference")).toBeDefined();
		expect(screen.getByTestId("assessorId")).toBeDefined();
		expect(screen.getByTestId("backLink")).toBeDefined();
	});

	it("navigates to email confirmation page when valid form is completed", async () => {
		await renderSuspended(GetBrelReport);

		await populateForm();

		await user.type(screen.getByLabelText(/assessor name/i), "Test Assessor");
		await user.type(screen.getByLabelText(/assessor id/i), "TEST123");

		await user.click(screen.getByTestId("getBrelReport"));

		await waitFor(() => {
			expect(navigateToMock).toHaveBeenCalledWith("/get-brel-email-confirmation");
		});
	});

	it("does not show dwelling address for a design report", async () => {
		await renderSuspended(GetBrelReport);

		const designRadio = screen.getByRole("radio", { name: "Design" });
		await user.click(designRadio);

		expect(screen.queryByLabelText("Dwelling address")).toBeNull();
	});

	it("shows dwelling address for a build report", async () => {
		await renderSuspended(GetBrelReport);

		const buildRadio = screen.getByRole("radio", { name: "Build" });
		await user.click(buildRadio);

		expect(screen.getByLabelText("Dwelling address")).toBeDefined();
	});

	test("required error messages are displayed when empty get BREL report form is submitted", async () => {
		await renderSuspended(GetBrelReport);

		await user.click(screen.getByTestId("getBrelReport"));

		expect(await screen.findByTestId("typeOfReport_error")).toBeDefined();
		expect(await screen.findByTestId("siteReference_error")).toBeDefined();
		expect(await screen.findByTestId("assessorName_error")).toBeDefined();
		expect(await screen.findByTestId("assessorId_error")).toBeDefined();
	});

	test("error summary is displayed when an invalid get BREL report form is submitted", async () => {
		await renderSuspended(GetBrelReport);

		await user.click(screen.getByTestId("getBrelReport"));

		expect(await screen.findByTestId("getBrelReportErrorSummary")).toBeDefined();
	});

	describe("Error Handling for Check Registered Assessor", () => {
		test("error summary shows invalid assessor details error when invalid assessor name and id are submitted", async () => {
			await renderSuspended(GetBrelReport);

			await populateForm();

			await user.type(screen.getByLabelText(/assessor name/i), "Invalid Assessor");
			await user.type(screen.getByLabelText(/assessor id/i), "INVALID123");

			await user.click(screen.getByTestId("getBrelReport"));

			const errorSummary = await screen.findByTestId("getBrelReportErrorSummary");
			expect(errorSummary.textContent).toContain(notRegisteredMessage);
		});

		test("invalid assessor details error is not duplicated in the error summary", async () => {
			await renderSuspended(GetBrelReport);

			await populateForm();

			await user.type(screen.getByLabelText(/assessor name/i), "Invalid Assessor");
			await user.type(screen.getByLabelText(/assessor id/i), "INVALID123");

			await user.click(screen.getByTestId("getBrelReport"));

			const errorSummary = await screen.findByTestId("getBrelReportErrorSummary");
			const occurrences = errorSummary.textContent?.split(notRegisteredMessage).length - 1;

			expect(occurrences).toBe(1);
		});

		test("error summary shows invalid assessor details error when an invalid assessor name and a valid assessor id is submitted", async () => {
			await renderSuspended(GetBrelReport);

			await populateForm();

			await user.type(screen.getByLabelText(/assessor name/i), "Invalid Assessor");
			await user.type(screen.getByLabelText(/assessor id/i), "TEST123");

			await user.click(screen.getByTestId("getBrelReport"));

			const errorSummary = await screen.findByTestId("getBrelReportErrorSummary");
			expect(errorSummary.textContent).toContain(notRegisteredMessage);
		});

		test("error summary shows invalid assessor details error when a valid assessor name and an invalid assessor id is submitted", async () => {
			await renderSuspended(GetBrelReport);

			await populateForm();

			await user.type(screen.getByLabelText(/assessor name/i), "Test Assessor");
			await user.type(screen.getByLabelText(/assessor id/i), "INVALID123");

			await user.click(screen.getByTestId("getBrelReport"));

			const errorSummary = await screen.findByTestId("getBrelReportErrorSummary");
			expect(errorSummary.textContent).toContain(notRegisteredMessage);
		});

		test("error summary does not show invalid assessor details error when a valid assessor name and id are submitted", async () => {
			await renderSuspended(GetBrelReport);

			await populateForm();

			await user.type(screen.getByLabelText(/assessor name/i), "Test Assessor");
			await user.type(screen.getByLabelText(/assessor id/i), "TEST123");

			await user.click(screen.getByTestId("getBrelReport"));

			expect(screen.queryByTestId("getBrelReportErrorSummary")).toBeNull();
		});

		test("invalid assessor details error shows in assessor name field when invalid assessor name given", async () => {
			await renderSuspended(GetBrelReport);

			await populateForm();

			await user.type(screen.getByLabelText(/assessor name/i), "Invalid Assessor");
			await user.type(screen.getByLabelText(/assessor id/i), "TEST123");

			await user.click(screen.getByTestId("getBrelReport"));

			const error = await screen.findByTestId("assessorName_error");
			expect(error).toBeDefined();
			expect(error.textContent).toContain(notRegisteredMessage);
		});

		test("invalid assessor details error shows in assessor id field when invalid assessor id given", async () => {
			await renderSuspended(GetBrelReport);

			await populateForm();

			await user.type(screen.getByLabelText(/assessor name/i), "Test Assessor");
			await user.type(screen.getByLabelText(/assessor id/i), "INVALID123");

			await user.click(screen.getByTestId("getBrelReport"));

			const error = await screen.findByTestId("assessorId_error");
			expect(error).toBeDefined();
			expect(error.textContent).toContain(notRegisteredMessage);
		});

		test("invalid assessor details error shows in assessor name and id field when invalid assessor name and id are given", async () => {
			await renderSuspended(GetBrelReport);

			await populateForm();

			await user.type(screen.getByLabelText(/assessor name/i), "Invalid Assessor");
			await user.type(screen.getByLabelText(/assessor id/i), "INVALID123");

			await user.click(screen.getByTestId("getBrelReport"));

			const assessorNameError = await screen.findByTestId("assessorName_error");
			expect(assessorNameError).toBeDefined();
			expect(assessorNameError.textContent).toContain(notRegisteredMessage);

			const assessorIdError = await screen.findByTestId("assessorId_error");
			expect(assessorIdError).toBeDefined();
			expect(assessorIdError.textContent).toContain(notRegisteredMessage);
		});

		test("invalid assessor details error does not show in assessor name or id field when valid assessor name and id are given", async () => {
			await renderSuspended(GetBrelReport);

			await populateForm();

			await user.type(screen.getByLabelText(/assessor name/i), "Test Assessor");
			await user.type(screen.getByLabelText(/assessor id/i), "TEST123");

			await user.click(screen.getByTestId("getBrelReport"));

			const assessorNameField = screen.getByTestId("assessorName");
			expect(assessorNameField.textContent).not.toContain(notRegisteredMessage);

			const assessorIdField = screen.getByTestId("assessorId");
			expect(assessorIdField.textContent).not.toContain(notRegisteredMessage);
		});

		test("shows no email error when assessor exists but has no registered email", async () => {
			await renderSuspended(GetBrelReport);

			await populateForm();

			await user.type(screen.getByLabelText(/assessor name/i), "No Email Assessor");
			await user.type(screen.getByLabelText(/assessor id/i), "NOEMAIL123");

			await user.click(screen.getByTestId("getBrelReport"));

			const errorSummary = await screen.findByTestId("getBrelReportErrorSummary");
			expect(errorSummary.textContent).toContain(noEmailMessage);

			const assessorNameError = await screen.findByTestId("assessorName_error");
			expect(assessorNameError.textContent).toContain(noEmailMessage);

			const assessorIdError = await screen.findByTestId("assessorId_error");
			expect(assessorIdError.textContent).toContain(noEmailMessage);

			expect(navigateToMock).not.toHaveBeenCalled();
		});
	});
});