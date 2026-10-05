import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import GetBrelReport from "./get-brel-report.vue";

describe("Get BREL Report", () => {
	const user = userEvent.setup();

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
});