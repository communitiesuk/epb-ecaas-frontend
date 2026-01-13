import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import DomesticHotWater from "@/pages/domestic-hot-water-new/index.vue";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

const baseForm = {
	data: [],
	complete: true,
};

describe("Domestic hot water", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	describe("Heat sources", () => {
		const hwCylinder1: EcaasForm<HotWaterCylinderData> = {
			data: {
				name: "Jasper's Cylinder",
				id: "what",
				heatSource: "weeeeee",
				storageCylinderVolume: {
					amount: 100,
					unit: "litres",
				},
				dailyEnergyLoss: 69,
			},
		};

		test("Navigates to heat sources form when add link is clicked", async () => {
			await renderSuspended(DomesticHotWater);

			const addLink = await screen.findByTestId<HTMLAnchorElement>("heatSources_add");

			expect(addLink.href).toBe("/domestic-hot-water/heat-sources/create");

			await user.click(addLink);

			expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water/heat-sources/create");
		});

		test("Displays existing heat sources", async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						hotWaterCylinder: {
							...baseForm,
							data: [hwCylinder1],
						},
					},
				},
			});

			await renderSuspended(DomesticHotWater);

			expect(screen.getByText("Jasper's Cylinder")).toBeDefined();
		});
	});
});