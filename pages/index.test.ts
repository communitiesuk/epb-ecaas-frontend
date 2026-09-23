import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import type { FhsInputSchema } from "~/mapping/fhsInputMapper";
import { mapFhsInputData } from "~/mapping/fhsInputMapper";
import type { FhsComplianceResponseIncludingErrors } from "~/server/server.types";
import Index from "./index.vue";

const mocks = vi.hoisted(() => {
	return {
		hasCompleteState: vi.fn(),
		mapFhsInputData: vi.fn(),
		$fetch: vi.fn(),
	};
});

vi.mock("~/mapping/fhsInputMapper", () => {
	return {
		mapFhsInputData: mocks.mapFhsInputData,
	};
});

vi.mock(import("~/stores/ecaasStore"), async (importOriginal) => {
	const actual = await importOriginal();

	return {
		...actual,
		hasCompleteState: mocks.hasCompleteState,
	};
});

vi.stubGlobal("$fetch", mocks.$fetch);

describe("Homepage", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	beforeEach(() => {
		vi.clearAllMocks();

		mocks.$fetch.mockResolvedValue({
			data: {},
		});
	});

	afterEach(() => {
		store.$reset();
	});

	it("shows error summary when client error has occurred", async () => {
		vi.mocked(hasCompleteState).mockReturnValue(true);

		vi.mocked(mapFhsInputData).mockImplementation(() => {
			throw Error("Mapping error");
		});

		await renderSuspended(Index);

		await user.click(screen.getByRole("button", { name: "Calculate" }));

		expect((await screen.findByTestId("resultErrorSummary"))).toBeDefined();
	});

	it("shows mapping error when a client mapping error has occurred", async () => {
		vi.mocked(hasCompleteState).mockReturnValue(true);

		vi.mocked(mapFhsInputData).mockImplementation(() => {
			throw Error("Selected hot water heat source requires water storage - no water storage present");
		});

		await renderSuspended(Index);

		await user.click(screen.getByRole("button", { name: "Calculate" }));

		const errorSummary = await screen.findByTestId("resultErrorSummary");

		expect(errorSummary.textContent).toContain(
			"Selected hot water heat source requires water storage - no water storage present",
		);
	});

	it("shows error summary when API error has occurred", async () => {
		vi.mocked(hasCompleteState).mockReturnValue(true);

		vi.mocked(mapFhsInputData).mockImplementation(() => {
			return {} as FhsInputSchema;
		});

		vi.mocked(global.$fetch<FhsComplianceResponseIncludingErrors>).mockReturnValue(new Promise((resolve) => {
			resolve({
				errors: [{
					id: "testId",
					detail: "API error",
				}],
				meta: {
					hem_version: "",
					hem_version_date: "",
					fhs_version: "",
					fhs_version_date: "",
				},
			});
		}));

		await renderSuspended(Index);

		await user.click(screen.getByRole("button", { name: "Calculate" }));

		const errorSummary = await screen.findByTestId("resultErrorSummary");
		const errorText = errorSummary.textContent;

		expect(errorSummary).toBeDefined();
		expect(errorText).toContain("Error ID: testId");
	});

	it("displays 'Change orientation' button which navigates to the change orientation page", async () => {
		await renderSuspended(Index);
		const changeOrientationButton = screen.getByRole("button", { name: "Change orientation" });
		expect(changeOrientationButton.getAttribute("href")).toBe("/change-orientation");
	});
});