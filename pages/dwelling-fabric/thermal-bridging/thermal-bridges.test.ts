import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import ThermalBridges from "./index.vue";
import LinearThermalBridgeForm from "./linear/[bridging].vue";
import PointThermalBridgeForm from "./point/[bridging].vue";

import { screen } from "@testing-library/vue";
import { within } from "@testing-library/dom";
import formStatus from "~/constants/formStatus";

describe("thermal bridges", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	const linear1: EcaasForm<LinearThermalBridgeData> = {
		data: {
			name: "Linear 1",
			typeOfThermalBridge: "E1",
			linearThermalTransmittance: 1,
			length: 2,
		},
	};

	const linear2: EcaasForm<LinearThermalBridgeData> = {
		data: {
			...linear1.data,
			name: "Linear 2",
		},
	};

	const linear3: EcaasForm<LinearThermalBridgeData> = {
		data: {
			...linear1.data,
			name: "Linear 3",
		},
	};

	const point1: EcaasForm<PointThermalBridgeData> = {
		data: {
			name: "Point 1",
			heatTransferCoefficient: 1,
		},
	};

	const point2: EcaasForm<PointThermalBridgeData> = {
		data: {
			...point1.data,
			name: "Point 2",
		},
	};

	const point3: EcaasForm<PointThermalBridgeData> = {
		data: {
			...point1.data,
			name: "Point 3",
		},
	};

	describe("linear thermal bridges", () => {
		it("linear thermal bridge is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceThermalBridging: {
						dwellingSpaceLinearThermalBridges: {
							data: [linear1],
						},
					},
				},
			});

			await renderSuspended(ThermalBridges);

			expect(screen.getAllByTestId("linearThermalBridges_items")).toBeDefined();

			await user.click(screen.getByTestId("linearThermalBridges_remove_0"));

			expect(screen.queryByTestId("linearThermalBridges_items")).toBeNull();
		});

		it("should only remove the linear thermal bridge object thats is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceThermalBridging: {
						dwellingSpaceLinearThermalBridges: {
							data: [linear1, linear2, linear3],
						},
					},
				},
			});

			await renderSuspended(ThermalBridges);
			await user.click(screen.getByTestId("linearThermalBridges_remove_1"));

			const populatedList = screen.getByTestId("linearThermalBridges_items");

			expect(within(populatedList).getByText("Linear 1")).toBeDefined();
			expect(within(populatedList).getByText("Linear 3")).toBeDefined();
			expect(within(populatedList).queryByText("Linear 2")).toBeNull();
		});

		it("linear thermal bridge is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceThermalBridging: {
						dwellingSpaceLinearThermalBridges: {
							data: [linear1, linear2],
						},
					},
				},
			});

			await renderSuspended(ThermalBridges);
			await userEvent.click(
				screen.getByTestId("linearThermalBridges_duplicate_0"),
			);
			await userEvent.click(
				screen.getByTestId("linearThermalBridges_duplicate_0"),
			);
			await userEvent.click(
				screen.getByTestId("linearThermalBridges_duplicate_2"),
			);
			await userEvent.click(
				screen.getByTestId("linearThermalBridges_duplicate_2"),
			);

			expect(screen.queryAllByTestId("linearThermalBridges_item").length).toBe(
				6,
			);
			expect(screen.getByText("Linear 1")).toBeDefined();
			expect(screen.getByText("Linear 1 (1)")).toBeDefined();
			expect(screen.getByText("Linear 1 (2)")).toBeDefined();
			expect(screen.getByText("Linear 1 (1) (1)")).toBeDefined();
			expect(screen.getByText("Linear 1 (1) (2)")).toBeDefined();
		});
	});

	describe("point thermal bridges", () => {
		it("point thermal bridge is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceThermalBridging: {
						dwellingSpacePointThermalBridges: {
							data: [point1],
						},
					},
				},
			});

			await renderSuspended(ThermalBridges);

			expect(screen.getAllByTestId("pointThermalBridges_items")).toBeDefined();

			await user.click(screen.getByTestId("pointThermalBridges_remove_0"));

			expect(screen.queryByTestId("pointThermalBridges_items")).toBeNull();
		});

		it("should only remove the point thermal bridge object thats is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceThermalBridging: {
						dwellingSpacePointThermalBridges: {
							data: [point1, point2, point3],
						},
					},
				},
			});

			await renderSuspended(ThermalBridges);
			await user.click(screen.getByTestId("pointThermalBridges_remove_1"));

			const populatedList = screen.getByTestId("pointThermalBridges_items");

			expect(within(populatedList).getByText("Point 1")).toBeDefined();
			expect(within(populatedList).getByText("Point 3")).toBeDefined();
			expect(within(populatedList).queryByText("Point 2")).toBeNull();
		});

		it("point thermal bridge is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceThermalBridging: {
						dwellingSpacePointThermalBridges: {
							data: [point1, point2],
						},
					},
				},
			});

			await renderSuspended(ThermalBridges);
			await userEvent.click(
				screen.getByTestId("pointThermalBridges_duplicate_0"),
			);
			await userEvent.click(
				screen.getByTestId("pointThermalBridges_duplicate_0"),
			);
			await userEvent.click(
				screen.getByTestId("pointThermalBridges_duplicate_2"),
			);
			await userEvent.click(
				screen.getByTestId("pointThermalBridges_duplicate_2"),
			);

			expect(screen.queryAllByTestId("pointThermalBridges_item").length).toBe(
				6,
			);
			expect(screen.getByText("Point 1")).toBeDefined();
			expect(screen.getByText("Point 1 (1)")).toBeDefined();
			expect(screen.getByText("Point 1 (2)")).toBeDefined();
			expect(screen.getByText("Point 1 (1) (1)")).toBeDefined();
			expect(screen.getByText("Point 1 (1) (2)")).toBeDefined();
		});
		it("an in-progress indicator is shown when an entry is not marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceThermalBridging: {
						dwellingSpacePointThermalBridges: {
							data: [point1],
						},
					},
				},
			});

			await renderSuspended(ThermalBridges);

			expect(
				screen.getByTestId("pointThermalBridges_status_0").textContent,
			).toBe(formStatus.inProgress.text);
		});
	});

	describe("mark section as complete", () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const navigateToMock = vi.hoisted(() => vi.fn());
		mockNuxtImport("navigateTo", () => navigateToMock);

		const addThermalBridgingDataToStore = async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceThermalBridging: {
						dwellingSpaceLinearThermalBridges: { data: [{ ...linear1, complete: true }] },
						dwellingSpacePointThermalBridges: { data: [{ ...point1, complete: true }] },
					},
				},
			});
		};

		beforeEach(async () => {
			await renderSuspended(ThermalBridges);
		});

		afterEach(() => {
			store.$reset();
		});

		it("disables the Mark section as complete button when a thermal bridge is incomplete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceThermalBridging: {
						dwellingSpaceLinearThermalBridges: { data: [{ ...linear1, complete: false }] },
						dwellingSpacePointThermalBridges: { data: [{ ...point1, complete: false }] },
					},
				},
			});

			await renderSuspended(ThermalBridges);

			expect(screen.getByTestId("markAsCompleteButton").hasAttribute("disabled")).toBeTruthy();
		});

		it("enables the Mark section as complete button when all thermal bridges are complete", async () => {
			await addThermalBridgingDataToStore();

			await renderSuspended(ThermalBridges);
			expect(screen.getByTestId("markAsCompleteButton").hasAttribute("disabled")).toBeFalsy();
		});

		describe("after section has been marked as complete", () => {
			beforeEach(async () => {
				await addThermalBridgingDataToStore();
				await renderSuspended(ThermalBridges);
				await user.click(screen.getByTestId("markAsCompleteButton"));
			});

			it("displays the 'Completed' section status indicator", async () => {
				const completed = screen.queryByTestId("completeSectionCompleted");
				expect(completed?.style.display).not.toBe("none");
			});

			it("navigates to the dwelling fabric page", async () => {
				expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric");
			});

			it("marks each thermal bridging section as complete when button is clicked", async () => {
				const { dwellingSpaceLinearThermalBridges, dwellingSpacePointThermalBridges } =
        store.dwellingFabric.dwellingSpaceThermalBridging;

				expect(dwellingSpaceLinearThermalBridges?.complete).toBe(true);
				expect(dwellingSpacePointThermalBridges?.complete).toBe(true);
			});

			it("marks corresponding thermal bridging section as not complete if an item is removed", async () => {
				await user.click(screen.getByTestId("linearThermalBridges_remove_0"));
				await user.click(screen.getByTestId("pointThermalBridges_remove_0"));

				const { dwellingSpaceLinearThermalBridges, dwellingSpacePointThermalBridges } =
        store.dwellingFabric.dwellingSpaceThermalBridging;

				expect(dwellingSpaceLinearThermalBridges?.complete).toBe(false);
				expect(dwellingSpacePointThermalBridges?.complete).toBe(false);
			});

			it("marks corresponding thermal bridging section as not complete if an item is duplicated", async () => {
				await user.click(screen.getByTestId("linearThermalBridges_duplicate_0"));
				await user.click(screen.getByTestId("pointThermalBridges_duplicate_0"));

				const { dwellingSpaceLinearThermalBridges, dwellingSpacePointThermalBridges } =
        store.dwellingFabric.dwellingSpaceThermalBridging;

				expect(dwellingSpaceLinearThermalBridges?.complete).toBe(false);
				expect(dwellingSpacePointThermalBridges?.complete).toBe(false);
			});
		});

		it("marks correspondiing section as not complete after adding a new linear thermal bridge item", async () => {

			await renderSuspended(LinearThermalBridgeForm, {
				route: {
					params: { linear: "create" },
				},
			});
			await user.type(screen.getByTestId("length"), "13");
			await user.tab();
			await user.click(screen.getByTestId("saveAndComplete"));
			expect(
				store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges.complete,
			).toBe(false);
		});

		it("marks correspondiing section as not complete after editing a linear thermal bridge item", async () => {

			await renderSuspended(LinearThermalBridgeForm, {
				route: {
					params: { linear: "0" },
				},
			});

			await user.clear(screen.getByTestId("length"));
			await user.type(screen.getByTestId("length"), "13");
			await user.tab();
			expect(
				store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges?.complete,
			).toBe(false);
		});
		it("marks correspondiing section as not complete after adding a new point thermal bridge item", async () => {

			await renderSuspended(PointThermalBridgeForm, {
				route: {
					params: { point: "create" },
				},
			});
			await user.type(screen.getByTestId("name"), "New bridge");
			await user.tab();
			await user.click(screen.getByTestId("saveAndComplete"));
			expect(
				store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpacePointThermalBridges.complete,
			).toBe(false);
		});

		it("marks correspondiing section as not complete after editing a point thermal bridge item", async () => {

			await renderSuspended(PointThermalBridgeForm, {
				route: {
					params: { point: "0" },
				},
			});

			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), "Updated bridge");
			await user.tab();
			expect(
				store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpacePointThermalBridges?.complete,
			).toBe(false);
		});
	});
});
