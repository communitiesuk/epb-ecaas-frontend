import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import GetBrelReport from "./get-brel-report.vue";

const { navigateToMock } = vi.hoisted(() => ({
	navigateToMock: vi.fn(),
}));

mockNuxtImport("navigateTo", () => navigateToMock);


describe("Get BREL Report", () => {
	const user = userEvent.setup();

	beforeEach(() => {
		navigateToMock.mockReset();
	});

	it("displays get BREL report form correctly", async () => {
		await renderSuspended(GetBrelReport);
	
		expect(screen.getByTestId("typeOfReport")).toBeDefined();
		expect(screen.getByTestId("siteReference")).toBeDefined();
		expect(screen.getByTestId("assessorId")).toBeDefined();
		expect(screen.getByTestId("backLink")).toBeDefined();
	});

	it("navigates to email confirmation page when valid form is completed", async () => {

		await renderSuspended(GetBrelReport);
		
		await user.click(screen.getByRole("radio", { name: "Design" }));

		await user.type(screen.getByLabelText(/plot reference/i), "Plot 123");
		await user.type(screen.getByLabelText(/site reference/i), "Site 456");

		await user.type(screen.getByLabelText(/client name/i), "Jane Smith");
		await user.type(screen.getByLabelText(/client organisation/i), "Example Ltd");
		await user.type(screen.getByLabelText(/client address/i), "1 Example Street");

		await user.type(screen.getByLabelText(/assessor name/i), "Test Assessor");
		await user.type(screen.getByLabelText(/assessor id/i), "TEST123");

		await user.click(
			screen.getByRole("checkbox", {
				name: /i confirm that this is my name and assessor credentials/i,
			}),
		);

		await user.click(screen.getByTestId("getBrelReport"));
		
		expect(navigateToMock).toHaveBeenCalledWith("/get-brel-email-confirmation");
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
		
		expect((await screen.findByTestId("typeOfReport_error"))).toBeDefined();
		expect((await screen.findByTestId("siteReference_error"))).toBeDefined();
		expect((await screen.findByTestId("assessorName_error"))).toBeDefined();
		expect((await screen.findByTestId("assessorId_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid get BREL report form is submitted", async () => {
		await renderSuspended(GetBrelReport);
		
		await user.click(screen.getByTestId("getBrelReport"));
		
		expect((await screen.findByTestId("getBrelReportErrorSummary"))).toBeDefined();
	});
});