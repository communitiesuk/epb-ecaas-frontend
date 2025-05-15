import { renderSuspended } from "@nuxt/test-utils/runtime";
import HeatingSystemsSummary from "./summary.vue";
import { screen } from "@testing-library/vue";

describe("Heating systems summary page", () => {
	it("should display the correct title", async () => {
		await renderSuspended(HeatingSystemsSummary);
		expect(screen.getByRole("heading", { name: "Heating system summary" }));
	});

	describe("Energy supply section", () => {
		it("should display the correct tabs for energy supply", async () => {
			await renderSuspended(HeatingSystemsSummary);
			expect(
				screen.getByRole("link", { name: "Energy supply" })
			).not.toBeNull();
		});
	});
});
