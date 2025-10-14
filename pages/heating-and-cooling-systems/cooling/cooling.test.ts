import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Cooling from "./index.vue";
import AirConditioningForm from "./air-conditioning/[airConditioning].vue";
import { screen } from "@testing-library/vue";
import { within } from "@testing-library/dom";
import type { AirConditioningData } from "~/stores/ecaasStore.schema";

describe("cooling", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	const airConditioning1: Partial<AirConditioningData> = {
		name: "Air conditioner 1",
		coolingCapacity: 1,
		seasonalEnergyEfficiencyRatio: 1,
		convectionFraction: 1,
		energySupply: "electricity",
	};

	const airConditioning2: Partial<AirConditioningData> = {
		name: "Air conditioner 2",
	};

	const airConditioning3: Partial<AirConditioningData> = {
		name: "Air conditioner 3",
	};

	describe("cooling", () => {
		it("air conditioning is removed when remove link is clicked", async () => {
			store.$patch({
				heatingAndCoolingSystems: {
					cooling: {
						airConditioning: {
							data: [{ data: airConditioning1 }],
						},
					},
				},
			});

			await renderSuspended(Cooling);

			expect(screen.getAllByTestId("airConditioning_items")).toBeDefined();

			await user.click(screen.getByTestId("airConditioning_remove_0"));

			expect(screen.queryByTestId("airConditioning_items")).toBeNull();
		});

		it("should only remove the air conditioning object that is clicked", async () => {
			store.$patch({
				heatingAndCoolingSystems: {
					cooling: {
						airConditioning: {
							data: [{ data: airConditioning1 }, { data: airConditioning2 }, { data: airConditioning3 }],
						},
					},
				},
			});

			await renderSuspended(Cooling);
			await user.click(screen.getByTestId("airConditioning_remove_1"));

			const populatedList = screen.getByTestId("airConditioning_items");

			expect(
				within(populatedList).getByText("Air conditioner 1"),
			).toBeDefined();
			expect(
				within(populatedList).getByText("Air conditioner 3"),
			).toBeDefined();
			expect(within(populatedList).queryByText("Air conditioner 2")).toBeNull();
		});

		it("air conditioning is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				heatingAndCoolingSystems: {
					cooling: {
						airConditioning: {
							data: [{ data: airConditioning1 }, { data: airConditioning2 }],
						},
					},
				},
			});

			await renderSuspended(Cooling);
			await userEvent.click(screen.getByTestId("airConditioning_duplicate_0"));
			await userEvent.click(screen.getByTestId("airConditioning_duplicate_0"));
			await userEvent.click(screen.getByTestId("airConditioning_duplicate_2"));
			await userEvent.click(screen.getByTestId("airConditioning_duplicate_2"));

			expect(screen.queryAllByTestId("airConditioning_item").length).toBe(6);
			expect(screen.getByText("Air conditioner 1")).toBeDefined();
			expect(screen.getByText("Air conditioner 1 (1)")).toBeDefined();
			expect(screen.getByText("Air conditioner 1 (2)")).toBeDefined();
			expect(screen.getByText("Air conditioner 1 (1) (1)")).toBeDefined();
			expect(screen.getByText("Air conditioner 1 (1) (2)")).toBeDefined();

		});
	});
	describe("mark section as complete", () => {
		it("marks cooling as complete when mark section as complete button is clicked and disables the mark section as complete button", async () => {
			await renderSuspended(Cooling);

			expect(screen.getByTestId("markAsCompleteButton").style.display).not.toBe("none");

			await user.click(screen.getByTestId("markAsCompleteButton"));

			expect(store.heatingAndCoolingSystems.cooling.airConditioning.complete).toBe(true);
			expect(screen.getByTestId("markAsCompleteButton").style.display).toBe("none");
			expect(screen.queryByTestId("completeSectionCompleted")?.style.display).not.toBe("none");
			expect(navigateToMock).toHaveBeenCalledWith("/heating-and-cooling-systems");
		});

		describe("after section has been marked as complete", () => {
			const addCoolingDataToStore = async () => {
				store.$patch({
					heatingAndCoolingSystems: {
						cooling: {
							airConditioning: {
								data: [{ data: airConditioning1, complete: true }],
							},
						},
					},
				});
			};

			beforeEach(async () => {
				addCoolingDataToStore();
				await renderSuspended(Cooling);
				await user.click(screen.getByTestId("markAsCompleteButton"));
			});

			it("displays 'Completed' section status indicator", async () => {
				const completed = screen.queryByTestId("completeSectionCompleted");
				expect(completed?.style.display).not.toBe("none");
			});

			it("navigates to heating systems page", async () => {
				expect(navigateToMock).toHaveBeenCalledWith("/heating-and-cooling-systems");
			});

			it("marks all cooling items as complete", async () => {
				const { airConditioning } = store.heatingAndCoolingSystems.cooling;
				expect(airConditioning?.complete).toBe(true);
			});

			it("marks cooling items as not complete if an item is removed", async () => {
				await user.click(screen.getByTestId("airConditioning_remove_0"));

				const { airConditioning } = store.heatingAndCoolingSystems.cooling;
				expect(airConditioning?.complete).toBe(false);
				expect(screen.getByTestId("markAsCompleteButton")).not.toBeNull();
				expect(screen.getByTestId("markAsCompleteButton").hasAttribute("disabled")).toBeFalsy();
			});

			it("marks heat emitters as not complete if an item is duplicated", async () => {
				await user.click(screen.getByTestId("airConditioning_duplicate_0"));

				const { airConditioning } = store.heatingAndCoolingSystems.cooling;
				expect(airConditioning?.complete).toBe(false);
				expect(screen.getByTestId("markAsCompleteButton")).not.toBeNull();
				expect(screen.getByTestId("markAsCompleteButton").hasAttribute("disabled")).toBeFalsy();
			});

			it("marks cooling as not complete after adding a new cooling item", async () => {
				await renderSuspended(AirConditioningForm, {
					route: {
						params: { airConditioning: "create" },
					},
				});

				await user.type(screen.getByTestId("name"), "New AC");
				await user.tab();

				expect(store.heatingAndCoolingSystems.cooling.airConditioning.complete).toBe(false);
			});

			it("marks cooling as not complete after editing an existing cooling item", async () => {
				await renderSuspended(AirConditioningForm, {
					route: {
						params: { airConditioning: "0" },
					},
				});

				await user.clear(screen.getByTestId("name"));
				await user.type(screen.getByTestId("name"), "Updated AC");
				await user.tab();

				expect(store.heatingAndCoolingSystems.cooling.airConditioning.complete).toBe(false);
			});
		});
	});
});
