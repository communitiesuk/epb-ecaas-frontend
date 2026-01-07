import { renderSuspended } from "@nuxt/test-utils/runtime";
import DomesticHotWater from "@/pages/domestic-hot-water/index.vue";
import { screen } from "@testing-library/vue";

describe("Domestic hot water", () => {

	describe("Heat sources", () => {

		test("Navigates to heat sources form when add link is clicked", async () => {
			await renderSuspended(DomesticHotWater);

			const addLink = await screen.findByTestId<HTMLAnchorElement>("heatSources_add");

			expect(addLink.href).toBe("/domestic-hot-water/heat-sources/create");
		});
	});
});