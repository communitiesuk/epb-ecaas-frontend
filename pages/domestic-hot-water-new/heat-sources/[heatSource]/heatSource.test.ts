import { renderSuspended } from "@nuxt/test-utils/runtime";
import HeatSourceForm from "./index.vue";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
const user = userEvent.setup();

describe("Heat Source Page", () => {
  

	test("should display the base form when no data has been added ", async () => {
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		expect(screen.getByTestId("coldWaterSource")).toBeDefined();
		expect(screen.getByTestId("heatSourceId")).toBeDefined();
	});

	test("should not display heat source form when add new heat source option is not selected", async () => {
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		expect(screen.getByTestId("heatSourceId_newHeatSource").hasAttribute("checked")).toBe(false);
		expect(screen.queryByTestId("typeOfHeatSource")).toBeNull();
	});

	test("should display heat source form when add new heat source option is selected", async () => {
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		await user.click(screen.getByTestId("heatSourceId_newHeatSource"));
		expect(screen.getByTestId("typeOfHeatSource")).toBeDefined();
	});

});

describe("Heat pump section", () => {

	test("'HeatPumpSection' component displays when type of heat source is heat pump", async () => {
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		await user.click(screen.getByTestId("heatSourceId_newHeatSource"));
		await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
		await user.click(screen.getByTestId("typeOfHeatPump_booster"));
		expect(screen.getByTestId("name")).toBeDefined();
		expect(screen.queryByTestId("selectHeatPump")).toBeDefined();
	});
  
});