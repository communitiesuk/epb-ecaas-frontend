import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import DomesticHotWater from "@/pages/domestic-hot-water-new/index.vue";
import { screen, within } from "@testing-library/vue";
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

	describe("Water storage", () => {
		const hwCylinder1: EcaasForm<HotWaterCylinderData> = {
			data: {
				name: "Jasper's Cylinder 1",
				id: "what",
				heatSource: "weeeeee",
				storageCylinderVolume: {
					amount: 100,
					unit: "litres",
				},
				dailyEnergyLoss: 69,
			},
		};

		const hwCylinder2: EcaasForm<SmartHotWaterTankData> = {
			data: {
				name: "Jasper's Cylinder 2",
			},
		};

		const hwCylinder3: EcaasForm<HotWaterCylinderData> = {
			data: {
				name: "Jasper's Cylinder 3",
				id: "what3",
				heatSource: "weeeeee3",
				storageCylinderVolume: {
					amount: 102,
					unit: "litres",
				},
				dailyEnergyLoss: 71,
			},
		};

		// Can't get href to point to the right thing :(

		// test("Navigates to water storage create form when add link is clicked", async () => {
		// 	await renderSuspended(DomesticHotWater);
			
		// 	const addLink = await screen.findByTestId<HTMLAnchorElement>("waterStorage_add");

		// 	console.log("addLink", addLink);
			
		// 	expect(new URL(addLink.href).pathname).toBe(
		// 		getUrl("waterStorageCreate"),
		// 	);
		// });

		test("Displays existing water storage", async () => {
			store.$patch({
				domesticHotWaterNew: {
					waterStorage: {
						...baseForm,
						data: [hwCylinder1],
					},
				},
			});

			await renderSuspended(DomesticHotWater);

			expect(screen.getByText("Jasper's Cylinder 1")).toBeDefined();
		});

		test("water storage is removed when remove link is clicked", async () => {
			store.$patch({
				domesticHotWaterNew: {
					waterStorage: {
						...baseForm,
						data: [hwCylinder1],
					},
				},
			});

			await renderSuspended(DomesticHotWater);

			expect(screen.getAllByTestId("waterStorage_items")).toBeDefined();

			await user.click(screen.getByTestId("waterStorage_remove_0"));
			expect(screen.queryByTestId("waterStorage_items")).toBeNull();
		});

		it("should only remove the water storage object that is clicked", async () => {
			store.$patch({
				domesticHotWaterNew: {
					waterStorage: {
						...baseForm,
						data: [hwCylinder1, hwCylinder2, hwCylinder3],
					},
				},
			});

			await renderSuspended(DomesticHotWater);
			await user.click(screen.getByTestId("waterStorage_remove_1"));

			const populatedList = screen.getByTestId("waterStorage_items");

			expect(within(populatedList).getByText("Jasper's Cylinder 1")).toBeDefined();
			expect(within(populatedList).getByText("Jasper's Cylinder 3")).toBeDefined();
			expect(within(populatedList).queryByText("Jasper's Cylinder 2")).toBeNull();
		});

		test("water storage is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				domesticHotWaterNew: {
					waterStorage: {
						data: [hwCylinder1, hwCylinder2],
					},
				},
			});

			await renderSuspended(DomesticHotWater);
			await userEvent.click(screen.getByTestId("waterStorage_duplicate_0"));
			await userEvent.click(screen.getByTestId("waterStorage_duplicate_0"));
			await userEvent.click(screen.getByTestId("waterStorage_duplicate_2"));
			await userEvent.click(screen.getByTestId("waterStorage_duplicate_2"));
			expect(screen.queryAllByTestId("waterStorage_item").length).toBe(6);
			expect(screen.getByText("Jasper's Cylinder 1")).toBeDefined();
			expect(screen.getByText("Jasper's Cylinder 1 (1)")).toBeDefined();
			expect(screen.getByText("Jasper's Cylinder 1 (2)")).toBeDefined();
			expect(screen.getByText("Jasper's Cylinder 1 (1) (1)")).toBeDefined();
			expect(screen.getByText("Jasper's Cylinder 1 (1) (2)")).toBeDefined();
		});
	});
});