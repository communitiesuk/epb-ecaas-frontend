import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import { within } from "@testing-library/dom";
import Shading from "./index.vue";
import ShadingForm from "./[shading].vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import formStatus from "~/constants/formStatus";

describe("shading", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const navigateToMock = vi.hoisted(() => vi.fn());
	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});
	const shading1: EcaasForm<ShadingData> = {
		data: {
			name: "Cherry Tree",
			startAngle: 10,
			endAngle: 20,
			objectType: "obstacle",
			height: 3,
			distance: 2,
		},
	};

	const shading2: EcaasForm<ShadingData> = {
		data: {
			...shading1.data,
			name: "Apple Tree",
		},
	};

	beforeEach(async() => {
		store.$patch({
			dwellingDetails: {
				shading: {
					data: [
						{
							data: { ...shading1.data },
							complete: true,
						},
						{
							data: { ...shading2.data },
							complete: true,
						},
					],
				},
			},
		});
		await renderSuspended(Shading);
	});

	afterEach(() => {
		store.$reset();
	});

	test("shading is removed when remove link is clicked", async () => {
		store.$patch({
			dwellingDetails: {
				shading: {
					data: [shading1],
				},
			},
		});

		await renderSuspended(Shading);

		expect(screen.getAllByTestId("shading_items")).toBeDefined();

		await user.click(screen.getByTestId("shading_remove_0"));

		expect(screen.queryByTestId("shading_items")).toBeNull();
		expect(store.dwellingDetails.shading.complete).toBe(false);
	});

	test("only second shading object is removed when corresponding remove link is clicked", async () => {

		await user.click(screen.getByTestId("shading_remove_1"));

		const populatedList = screen.getByTestId("shading_items");
		expect(within(populatedList).getByText("Cherry Tree")).toBeDefined();
		expect(within(populatedList).queryByText("Apple Tree")).toBeNull();
	});

	test("shading is duplicated when duplicate link is clicked", async () => {

		await user.click(screen.getByTestId("shading_duplicate_0"));
		await user.click(screen.getByTestId("shading_duplicate_0"));
		await user.click(screen.getByTestId("shading_duplicate_2"));
		await user.click(screen.getByTestId("shading_duplicate_2"));

		expect(screen.queryAllByTestId("shading_item").length).toBe(6);
		expect(screen.getByText("Cherry Tree")).toBeDefined();
		expect(screen.getByText("Cherry Tree (1)")).toBeDefined();
		expect(screen.getByText("Cherry Tree (2)")).toBeDefined();
		expect(screen.getByText("Cherry Tree (1) (1)")).toBeDefined();
		expect(screen.getByText("Cherry Tree (1) (2)")).toBeDefined();
	});

	it("should display an 'In progress' status indicator when an entry is not marked as complete", async () => {
		store.$patch({
			dwellingDetails: {
				shading: {
					data: [
						{
							data: { name: "Shading 1" },
						},
					],
				},
			},
		});

		await renderSuspended(Shading);

		expect(screen.getByTestId("shading_status_0").textContent).toBe(
			formStatus.inProgress.text,
		);
	});

	it("should display a 'Completed' status indicator when an entry is marked as complete", async () => {

		await renderSuspended(Shading);

		expect(screen.getByTestId("shading_status_0").textContent).toBe(
			formStatus.complete.text,
		);
	});

	describe("Mark section as complete", () => {

		test("disables the Mark section as complete button when shading element is incomplete", async () => {
			store.$patch({
				dwellingDetails: {
					shading: {
						data: [{ data: { ...shading1.data }, complete: false }],
					},
				},
			});

			await renderSuspended(Shading);
			expect(screen.getByTestId("markAsCompleteButton").hasAttribute("disabled")).toBeTruthy();
		});

		test("enables the Mark section as complete button when all shading items are complete", async () => {

			expect(screen.getByTestId("markAsCompleteButton").hasAttribute("disabled")).toBeFalsy();
		});

		test("the 'Completed' section status indicator is not shown when section has not been marked as complete", async () => {

			const completed = screen.queryByTestId("completeSectionCompleted");
			expect(completed?.style.display).toBe("none");
		});
	
		describe("after section has been marked as complete", () => {

			beforeEach(async () => {
				await user.click(screen.getByTestId("markAsCompleteButton"));
			});

			test("the 'Completed' section status indicator is shown", async () => {
				const completed = screen.queryByTestId("completeSectionCompleted");
				expect(completed?.style.display).not.toBe("none");
			});

			test("shading section is complete", async () => {

				expect(store.dwellingDetails.shading.complete).toBe(true);
			});

			test("user is navigated to the dwelling details overview page", async () => {

				expect(navigateToMock).toHaveBeenCalledWith("/dwelling-details");
				;
			});

			test("shading is not complete after user removes a shading", async () => {

				await user.click(screen.getByTestId("shading_remove_0"));
				expect(store.dwellingDetails.shading.complete).toBe(false);
			});

			test("shadings is not complete after user duplicates a shading", async () => {

				await user.click(screen.getByTestId("shading_duplicate_0"));
				expect(store.dwellingDetails.shading.complete).toBe(false);
			});

			test("shading is not complete after user adds a new shading item", async () => {

				await renderSuspended(ShadingForm, {
					route: {
						params: { shading: "create" },
					},
				});

				await user.type(screen.getByTestId("name"), "New shading");
				await user.tab();
				expect(store.dwellingDetails.shading.complete).toBe(false);
			});

			test("shading is not complete after user edits a shading item", async () => {

				await renderSuspended(ShadingForm, {
					route: {
						params: { shading: "0" },
					},
				});
				await user.clear(screen.getByTestId("name"));
				await user.type(screen.getByTestId("name"), "Updated shading");
				await user.tab();
				expect(store.dwellingDetails.shading.complete).toBe(false);
			});
		});
	});
});