import { screen } from "@testing-library/vue";
import { renderSuspended } from "@nuxt/test-utils/runtime";
import Banner from "./ChangeOrientationSuccessBanner.vue";

describe("Change orientation success banner", () => {

	it("displays new orientation", async () => {
		await renderSuspended(Banner, {
			props: {
				difference: 20,
				orientation: 100,
			},
		});

		expect(screen.getByTestId("orientationChange").innerText)
			.toContain("100° from true north");
	});

	it("when the difference is positive it displays clockwise", async () => {
		await renderSuspended(Banner, {
			props: {
				difference: 40,
				orientation: 100,
			},
		});

		expect(screen.getByTestId("orientationChange").innerText)
			.toContain("40° clockwise");
	});

	it("when the difference is negative it displays anticlockwise", async () => {
		await renderSuspended(Banner, {
			props: {
				difference: -20,
				orientation: 100,
			},
		});

		expect(screen.getByTestId("orientationChange").innerText)
			.toContain("20° anticlockwise");
	});
});