import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { screen } from "@testing-library/vue";
import GetBrelEmailConfirmation from "./get-brel-email-confirmation.vue";

const { navigateToMock } = vi.hoisted(() => ({
	navigateToMock: vi.fn(),
}));

mockNuxtImport("navigateTo", () => navigateToMock);

describe("Get BREL Report email confirmation page", () => {
	beforeEach(() => {
		navigateToMock.mockReset();

		const emailState = useState<string | null>("brel-assessor-email");
		emailState.value = "test.assessor@homes.co.uk";
	});

	it("displays the page title", async () => {
		await renderSuspended(GetBrelEmailConfirmation);

		expect(screen.getByRole("heading", { name: "Get BREL Report" })).toBeTruthy();
	});

	it("displays the confirmation panel", async () => {
		await renderSuspended(GetBrelEmailConfirmation);

		expect(screen.getByTestId("getBrelEmailConfirmationPanel")).toBeDefined();
		expect(screen.getByText("BREL Report sent")).toBeDefined();
	});

	it("displays the dynamic masked assessor email", async () => {
		const emailState = useState<string | null>("brel-assessor-email");
		emailState.value = "test.assessor@homes.co.uk";

		await renderSuspended(GetBrelEmailConfirmation);

		expect(
			screen.getByText(
				/The BREL Report will be sent to .*@homes\.co\.uk in the next 5 minutes/i,
			),
		).toBeDefined();
	});

	it("has a back link to the results page", async () => {
		await renderSuspended(GetBrelEmailConfirmation);

		expect(screen.getByTestId("getBrelEmailConfirmationPanel")).toBeDefined();

		const backLink = screen.getByTestId("backLink");
		expect(backLink).toBeDefined();
		expect(backLink.getAttribute("href")).toBe("/outputs");
	});

	it("has a support email link", async () => {
		await renderSuspended(GetBrelEmailConfirmation);

		const emailLink = screen.getByTestId("supportEmailLink");
		expect(emailLink).toBeDefined();
		expect(emailLink.getAttribute("href")).toBe("mailto:support@epb.gov.uk");
	});

	it("has a return to results button", async () => {
		await renderSuspended(GetBrelEmailConfirmation);

		const returnToResultsButton = screen.getByTestId("returnToResultsButton");
		expect(returnToResultsButton).toBeDefined();
		expect(returnToResultsButton.getAttribute("href")).toBe("/outputs");
	});

	it("redirects back to the form if no assessor email is stored in state", async () => {
		const emailState = useState<string | null>("brel-assessor-email");
		emailState.value = null;

		await renderSuspended(GetBrelEmailConfirmation);

		expect(navigateToMock).toHaveBeenCalledWith("/get-brel-report");
	});
});