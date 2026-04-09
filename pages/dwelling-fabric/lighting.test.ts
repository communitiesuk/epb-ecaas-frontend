import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { screen } from "@testing-library/vue";
import Lighting from "./lighting/index.vue";
import userEvent from "@testing-library/user-event";
import formStatus from "~/constants/formStatus";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

const state: DwellingSpaceLightingData = {
	name: "Bulb 1",
	numberOfBulbs: 9,
	power: 5,
	efficacy: 120,
};

const store = useEcaasStore();
const user = userEvent.setup();

beforeEach(() => {
	store.$reset();
});

describe("lighting", () => {

	test("bulb can be removed from lighting list", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceLighting: {
					data: [{ data: state, complete: true }],
				},
			},
		});

		await renderSuspended(Lighting);

		expect(screen.getByTestId("lighting_items")).toBeDefined();
		await user.click(screen.getByTestId("lighting_remove_0"));
		expect(screen.queryByTestId("lighting_items")).toBeNull();
	});

	test("bulb can be duplicated from lighting list", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceLighting: {
					data: [{ data: state, complete: true }],
				},
			},
		});

		await renderSuspended(Lighting);
		await user.click(screen.getByTestId("lighting_duplicate_0"));

		expect(screen.getByText("Bulb 1")).toBeDefined();
		expect(screen.getByText("Bulb 1 (1)")).toBeDefined();
	});

	test("lighting section can be marked complete", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceLighting: {
					data: [{ data: state, complete: true }],
				},
			},
		});

		await renderSuspended(Lighting);
		await user.click(screen.getByTestId("markAsCompleteButton"));

		expect(store.dwellingFabric.dwellingSpaceLighting.complete).toBe(true);
		expect(navigateToMock).toBeCalledWith("/dwelling-fabric");
	});

	test("status tag shows in-progress when bulb is incomplete", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceLighting: {
					data: [{ data: state, complete: false }],
				},
			},
		});

		await renderSuspended(Lighting);

		expect(screen.getByTestId("lighting_status_0").textContent).toBe(formStatus.inProgress.text);
	});

	test("status tag shows complete when bulb is complete", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceLighting: {
					data: [{ data: state, complete: true }],
				},
			},
		});

		await renderSuspended(Lighting);

		expect(screen.getByTestId("lighting_status_0").textContent).toBe(formStatus.complete.text);
	});

	test("mark as complete button is disabled when there are incomplete bulbs", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceLighting: {
					data: [{ data: state, complete: false }],
				},
			},
		});

		await renderSuspended(Lighting);

		expect(screen.getByTestId("markAsCompleteButton").hasAttribute("disabled")).toBeTruthy();
	});

	test("mark as complete button is enabled when all bulbs are complete", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceLighting: {
					data: [{ data: state, complete: true }],
				},
			},
		});

		await renderSuspended(Lighting);

		expect(screen.getByTestId("markAsCompleteButton").hasAttribute("disabled")).toBeFalsy();
	});

	test("only selected bulb is removed from lighting list", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceLighting: {
					data: [
						{ data: state, complete: true },
						{ data: { ...state, name: "Bulb 2" }, complete: true },
					],
				},
			},
		});

		await renderSuspended(Lighting);
		await user.click(screen.getByTestId("lighting_remove_0"));

		expect(screen.queryByText("Bulb 1")).toBeNull();
		expect(screen.getByText("Bulb 2")).toBeDefined();
		expect(store.dwellingFabric.dwellingSpaceLighting.data).toHaveLength(1);
	});
});
