import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen, within } from "@testing-library/vue";
import Wwhrs from "./index.vue";
import WwhrsForm from "./[wwhrs].vue";
import type { WwhrsData } from "~/stores/ecaasStore.schema";

describe("wwhrs", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const navigateToMock = vi.hoisted(() => vi.fn());
	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});
	const wwhrs1: Partial<WwhrsData> = {
		name: "WWHRS 1",
		outlet: "7184f2fe-a78f-4a56-ba5a-1a7751ac509z",
		type: "WWHRS_InstantaneousSystemA",
		flowRate: 100,
		efficiency: 50,
		proportionOfUse: 1,
	};

	const wwhrs2: Partial<WwhrsData> = {
		...wwhrs1,
		name: "WWHRS 2",
	};

	const wwhrs3: Partial<WwhrsData> = {
		...wwhrs1,
		name: "WWHRS 3",
	};

	afterEach(() => {
		store.$reset();
	});

	test("wwhrs is removed when remove link is clicked", async () => {
		store.$patch({
			domesticHotWater: {
				wwhrs: {
					data: [wwhrs1],
				},
			},
		});

		await renderSuspended(Wwhrs);

		expect(screen.getAllByTestId("wwhrs_items")).toBeDefined();

		await user.click(screen.getByTestId("wwhrs_remove_0"));

		expect(screen.queryByTestId("wwhrs_items")).toBeNull();
	});

	it("should only remove the wwhrs thats is clicked", async () => {
		store.$patch({
			domesticHotWater: {
				wwhrs: {
					data: [wwhrs1, wwhrs2, wwhrs3],
				},
			},
		});

		await renderSuspended(Wwhrs);
		await user.click(screen.getByTestId("wwhrs_remove_1"));

		const populatedList = screen.getByTestId("wwhrs_items");

		expect(within(populatedList).getByText("WWHRS 1")).toBeDefined();
		expect(within(populatedList).getByText("WWHRS 3")).toBeDefined();
		expect(within(populatedList).queryByText("WWHRS 2")).toBeNull();
	});

	test("wwhrs is duplicated when duplicate link is clicked", async () => {
		store.$patch({
			domesticHotWater: {
				wwhrs: {
					data: [wwhrs1, wwhrs2],
				},
			},
		});

		await renderSuspended(Wwhrs);
		await userEvent.click(screen.getByTestId("wwhrs_duplicate_0"));
		await userEvent.click(screen.getByTestId("wwhrs_duplicate_0"));
		await userEvent.click(screen.getByTestId("wwhrs_duplicate_2"));
		await userEvent.click(screen.getByTestId("wwhrs_duplicate_2"));

		expect(screen.queryAllByTestId("wwhrs_item").length).toBe(6);
		expect(screen.getByText("WWHRS 1")).toBeDefined();
		expect(screen.getByText("WWHRS 1 (1)")).toBeDefined();
		expect(screen.getByText("WWHRS 1 (2)")).toBeDefined();
		expect(screen.getByText("WWHRS 1 (1) (1)")).toBeDefined();
		expect(screen.getByText("WWHRS 1 (1) (2)")).toBeDefined();
	});

	it("marks wwhrs as complete when mark section as complete button is clicked", async () => {
		await renderSuspended(Wwhrs);
		expect(
			screen.getByRole("button", { name: "Mark section as complete" }),
		).not.toBeNull();

		const completedStatusElement = screen.queryByTestId(
			"completeSectionCompleted",
		);
		expect(completedStatusElement?.style.display).toBe("none");

		await user.click(screen.getByTestId("markAsCompleteButton"));

		const { complete } = store.domesticHotWater.wwhrs;

		expect(complete).toBe(true);
		expect(
			screen.queryByRole("button", { name: "Mark section as complete" }),
		).toBeNull();
		expect(completedStatusElement?.style.display).not.toBe("none");

		expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water");
	});
	it("marks wwhrs as not complete when complete button is clicked then user removes a wwhr item", async () => {
		store.$patch({
			domesticHotWater: {
				wwhrs: {
					data: [wwhrs1, wwhrs2],
				},
			},
		});

		await renderSuspended(Wwhrs);

		await user.click(screen.getByTestId("markAsCompleteButton"));
		expect(store.domesticHotWater.wwhrs.complete).toBe(true);

		await user.click(screen.getByTestId("wwhrs_remove_0"));
		expect(store.domesticHotWater.wwhrs.complete).toBe(false);
		expect(
			screen.getByRole("button", { name: "Mark section as complete" }),
		).not.toBeNull();
	});

	it("marks wwhrs as not complete when complete button is clicked then user duplicates a wwhr item", async () => {
		store.$patch({
			domesticHotWater: {
				wwhrs: {
					data: [wwhrs1],
				},
			},
		});

		await renderSuspended(Wwhrs);

		await user.click(screen.getByTestId("markAsCompleteButton"));
		expect(store.domesticHotWater.wwhrs.complete).toBe(true);

		await user.click(screen.getByTestId("wwhrs_duplicate_0"));
		expect(store.domesticHotWater.wwhrs.complete).toBe(false);
		expect(
			screen.getByRole("button", { name: "Mark section as complete" }),
		).not.toBeNull();
	});

	it("marks wwhrs as not complete when user saves a new or edited form after marking section as complete", async () => {
		store.$patch({
			domesticHotWater: {
				wwhrs: {
					data: [wwhrs1],
				},
			},
		});

		await renderSuspended(Wwhrs);
		await user.click(screen.getByTestId("markAsCompleteButton"));

		await renderSuspended(WwhrsForm, {
			route: {
				params: { wwhrs: "0" },
			},
		});

		await user.click(screen.getByRole("button"));

		const { complete } = store.domesticHotWater.wwhrs;
		expect(complete).toBe(false);

		await renderSuspended(Wwhrs);
		expect(
			screen.getByRole("button", { name: "Mark section as complete" }),
		).not.toBeNull();
	});

	it("should navigate to the domestic hot water overview page when return to overview is clicked", async () => {
		await renderSuspended(Wwhrs);

		const returnToOverviewButton = screen.getByRole("button", {
			name: "Return to domestic hot water",
		});
		expect(returnToOverviewButton.getAttribute("href")).toBe(
			"/domestic-hot-water",
		);
	});
});
