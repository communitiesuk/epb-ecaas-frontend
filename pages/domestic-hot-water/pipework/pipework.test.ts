import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import Pipework from "./index.vue";
import type { PipeworkData } from "~/stores/ecaasStore.types";

describe("Pipeworks", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const pipework1: PipeworkData = {
		name: "Pipework Kitchen Sink",
		length: 3,
		location: "internal",
		internalDiameter: 30,
	};

	const pipework2: PipeworkData = {
		name: "Pipework Kitchen",
		length: 4,
		location: "internal",
	};

	afterEach(() => {
		store.$reset();
	});

	it("pipework is removed when remove link is clicked", async () => {
		store.$patch({
			domesticHotWater: {
				pipework: {
					data: [pipework1],
				},
			},
		});

		await renderSuspended(Pipework);

		const populatedList = screen.queryByTestId("secondary_items");

		await user.click(screen.getByTestId("secondary_remove_0"));

		expect(populatedList).toBeDefined();
		expect(screen.queryByTestId("secondary_items")).toBeNull();
	});

	it("duplicates pipework in list when duplicate link is clicked", async () => {
		store.$patch({
			domesticHotWater: {
				pipework: {
					data: [pipework1, pipework2],
				},
			},
		});

		await renderSuspended(Pipework);

		await user.click(screen.getByTestId("secondary_duplicate_0"));
		await user.click(screen.getByTestId("secondary_duplicate_0"));
		await user.click(screen.getByTestId("secondary_duplicate_1"));

		expect(screen.queryAllByTestId("secondary_item").length).toBe(5);
		expect(screen.getByText("Pipework Kitchen Sink (1)")).toBeDefined();
		expect(screen.getByText("Pipework Kitchen Sink (2)")).toBeDefined();
		expect(screen.getByText("Pipework Kitchen (1)")).toBeDefined();
	});
});
