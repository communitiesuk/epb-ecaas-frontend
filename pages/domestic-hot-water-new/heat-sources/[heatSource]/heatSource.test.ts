import { renderSuspended } from "@nuxt/test-utils/runtime";
import HeatSourceForm from "./index.vue";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

describe.skip("Heat Source Page", () => {

	const user = userEvent.setup();

	test("should display the base form when no data has been added ", async () => {
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		expect(screen.getByTestId("coldWaterSource")).toBeDefined();
		expect(screen.getByTestId("heatSource")).toBeDefined();
	});

	test("should not display heat source form when add new heat source option is selected", async () => {
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		expect(screen.getByTestId("heatSource_addNewHeatSource").hasAttribute("checked")).toBe(false);
		expect(screen.getByTestId("typeOfHeatSource")).toBeUndefined();
	});

	test("should display heat source form when add new heat source option is selected", async () => {
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		await user.click(screen.getByTestId("heatSource_addNewHeatSource"));
		expect(screen.getByTestId("typeOfHeatSource")).toBeDefined();
	});
});