import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen, within } from "@testing-library/vue";
import type { VentData } from "~/stores/ecaasStore.schema";
import Vents from "./index.vue";
import VentsForm from "./[vent].vue";
import formStatus from "~/constants/formStatus";

describe("vents", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const navigateToMock = vi.hoisted(() => vi.fn());
	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});
	const vent1: VentData = {
		name: "Vent 1",
		typeOfVent: "trickle",
		associatedItemId: "0b77e247-53c5-42b8-9dbd-83cbfc8c3f4f",
		effectiveVentilationArea: 10,
		openingRatio: 1,
		midHeightOfZone: 1,
	};

	const vent2: VentData = {
		...vent1,
		name: "Vent 2",
	};

	const vent3: VentData = {
		...vent1,
		name: "Vent 3",
	};

	afterEach(() => {
		store.$reset();
	});

	test("vent is removed when remove link is clicked", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					data: [{ data: vent1 }],
				},
			},
		});

		await renderSuspended(Vents);

		expect(screen.getAllByTestId("vents_items")).toBeDefined();

		await user.click(screen.getByTestId("vents_remove_0"));

		expect(screen.queryByTestId("vents_items")).toBeNull();
	});

	it("should only remove the vent that is clicked", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					data: [{ data: vent1 }, { data: vent2 }, { data: vent3 }],
				},
			},
		});

		await renderSuspended(Vents);
		await user.click(screen.getByTestId("vents_remove_1"));

		const populatedList = screen.getByTestId("vents_items");

		expect(within(populatedList).getByText("Vent 1")).toBeDefined();
		expect(within(populatedList).getByText("Vent 3")).toBeDefined();
		expect(within(populatedList).queryByText("Vent 2")).toBeNull();
	});

	test("vent is duplicated when duplicate link is clicked", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					data: [{ data: vent1 }, { data: vent2 }],
				},
			},
		});

		await renderSuspended(Vents);
		await userEvent.click(screen.getByTestId("vents_duplicate_0"));
		await userEvent.click(screen.getByTestId("vents_duplicate_0"));
		await userEvent.click(screen.getByTestId("vents_duplicate_2"));
		await userEvent.click(screen.getByTestId("vents_duplicate_2"));

		expect(screen.queryAllByTestId("vents_item").length).toBe(6);
		expect(screen.getByText("Vent 1")).toBeDefined();
		expect(screen.getByText("Vent 1 (1)")).toBeDefined();
		expect(screen.getByText("Vent 1 (2)")).toBeDefined();
		expect(screen.getByText("Vent 1 (1) (1)")).toBeDefined();
		expect(screen.getByText("Vent 1 (1) (2)")).toBeDefined();
	});

	it("should navigate to the infiltration and ventilation overview page when return to overview is clicked", async () => {
		await renderSuspended(Vents);

		const returnToOverviewButton = screen.getByRole("button", {
			name: "Return to infiltration and ventilation",
		});
		expect(returnToOverviewButton.getAttribute("href")).toBe(
			"/infiltration-and-ventilation",
		);
	});

	it("should display an in-progress indicator when an entry is not marked as complete", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					data: [
						{
							data: { name: "Vent 1" },
						},
					],
				},
			},
		});

		await renderSuspended(Vents);

		expect(screen.getByTestId("vents_status_0").textContent).toBe(
			formStatus.inProgress.text,
		);
	});

	it("should display a complete indicator when an entry is marked as complete", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					data: [
						{
							data: vent1,
							complete: true,
						},
					],
				},
			},
		});

		await renderSuspended(Vents);

		expect(screen.getByTestId("vents_status_0").textContent).toBe(
			formStatus.complete.text,
		);
	});
	describe("mark section as complete", () => {
		const addCompleteVentsToStore = async () => {
			store.$patch({
				infiltrationAndVentilation: {
					vents: {
						data: [
							{ data: vent1, complete: true },
							{ data: vent2, complete: true },
						],
					},
				},
			});
		};

		beforeEach(async () => {
			await renderSuspended(Vents);
		});

		afterEach(() => {
			store.$reset();
		});

		it("disables the Mark section as complete button when a vent item is incomplete", async () => {
			store.$patch({
				infiltrationAndVentilation: {
					vents: {
						data: [{ data: vent1, complete: false }],
					},
				},
			});

			await renderSuspended(Vents);
			expect(
				screen.getByTestId("markAsCompleteButton").hasAttribute("disabled"),
			).toBeTruthy();
		});

		it("enables the Mark section as complete button when all vent items are complete", async () => {
			await addCompleteVentsToStore();
			await renderSuspended(Vents);

			expect(
				screen.getByTestId("markAsCompleteButton").hasAttribute("disabled"),
			).toBeFalsy();
		});

		describe("after section has been marked as complete", () => {
			beforeEach(async () => {
				await addCompleteVentsToStore();
				await renderSuspended(Vents);
				await user.click(screen.getByTestId("markAsCompleteButton"));
			});

			it("displays the 'Completed' section status indicator", async () => {
				const completed = screen.queryByTestId("completeSectionCompleted");
				expect(completed?.style.display).not.toBe("none");
			});

			it("navigates to the infiltration and ventilation page", async () => {
				expect(navigateToMock).toHaveBeenCalledWith(
					"/infiltration-and-ventilation",
				);
			});

			it("marks vents as complete when section is marked", async () => {
				expect(store.infiltrationAndVentilation.vents.complete).toBe(true);
			});

			it("marks vents as not complete if an item is removed", async () => {
				await user.click(screen.getByTestId("vents_remove_0"));

				expect(store.infiltrationAndVentilation.vents.complete).toBe(false);
			});

			it("marks vents as not complete if an item is duplicated", async () => {
				await user.click(screen.getByTestId("vents_duplicate_0"));

				expect(store.infiltrationAndVentilation.vents.complete).toBe(false);
			});

			it("vent is not complete after user adds a new ventilation item", async () => {
				await renderSuspended(VentsForm, {
					route: { params: { vent: "create" } },
				});

				await user.type(screen.getByTestId("name"), "New vent");
				await user.tab();

				expect(store.infiltrationAndVentilation.vents.complete).toBe(false);
			});

			it("vent is not complete after user edits an existing ventilation item", async () => {
				await renderSuspended(VentsForm, {
					route: { params: { vent: "0" } },
				});

				await user.clear(screen.getByTestId("name"));
				await user.type(screen.getByTestId("name"), "Updated vent");
				await user.tab();

				expect(store.infiltrationAndVentilation.vents.complete).toBe(false);
			});
		});
	});
});
