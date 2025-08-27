import userEvent from "@testing-library/user-event";
import Index from "./index.vue";
import { renderSuspended } from "@nuxt/test-utils/runtime";
import { screen } from "@testing-library/vue";

const store = useEcaasStore();
const user = userEvent.setup();

afterEach(() => {
	store.$reset();
});

describe("Water heating index page", () => {
	const heatPump: HeatPumpData = {
		id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
		name: "Heat pump 1",
		productReference: "HEATPUMP-LARGE",
	};

	const addStoreData = () => {
		store.$patch({
			heatingSystems: {
				heatGeneration: {
					heatPump: {
						data: [
							{
								data: heatPump,
							},
						],
					},
				},
			},
		});
	};

	test("form data is automatically saved to store", async () => {
		addStoreData();
		await renderSuspended(Index);
		await user.click(screen.getByTestId("waterHeaterType_hotWaterCylinder"));
		await user.type(screen.getByTestId("name"), "Cylinder 1");
		await user.click(
			screen.getByTestId("heatSource_463c94f6-566c-49b2-af27-57e5c68b5c30")
		);
		await user.tab();

		expect(
			store.domesticHotWater.waterHeating.hotWaterCylinder.data[0]!.name
		).toBe("Cylinder 1");
		expect(
			store.domesticHotWater.waterHeating.hotWaterCylinder.data[0]!.heatSource
		).toBe("463c94f6-566c-49b2-af27-57e5c68b5c30");
	});

	test("save progress button navigates user to the Domestic hot water page", async () => {
		await renderSuspended(Index);
		const saveProcess = screen.getByRole("button", { name: "Save progress" });
		expect(saveProcess.getAttribute("href")).toBe("/domestic-hot-water");
	});
  
	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(Index);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect(await screen.findByTestId("waterHeatingErrorSummary")).toBeDefined();
	});
});
