import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import { nextTick } from "vue";
import { hasCompleteState } from "~/stores/ecaasStore";
import { isEcaasForm } from "~/stores/ecaasStore.schema";
import CalculateButton from "./CalculateButton.vue";
import CalculateButtonDryRun from "./CalculateButtonDryRun.vue";

const mocks = vi.hoisted(() => ({
	fetch: vi.fn(),
	map: vi.fn(() => ({})),
	navigateTo: vi.fn(),
	metric: vi.fn(),
}));

mockNuxtImport("$fetch", () => mocks.fetch);
mockNuxtImport("navigateTo", () => mocks.navigateTo);
vi.mock("~/mapping/fhsInputMapper", () => ({ mapFhsInputData: mocks.map }));
vi.mock("~/server/services/sentryMetrics", () => ({ reportCalculateMetric: mocks.metric }));

function markFormsComplete(value: unknown): void {
	if (isEcaasForm(value)) {
		value.complete = true;
	} else if (typeof value === "object" && value !== null) {
		Object.values(value).forEach(markFormsComplete);
	}
}

describe.each([
	["Calculate", CalculateButton, "/api/check-compliance", "/outputs"],
	["Calculate dry run", CalculateButtonDryRun, "/api/check-schema", "/outputs-dry-run"],
])("%s button", (_name, component, endpoint, destination) => {
	let store: ReturnType<typeof useEcaasStore>;

	beforeEach(() => {
		vi.clearAllMocks();
		store = useEcaasStore();
		store.$reset();
		markFormsComplete(store.$state);
	});

	afterEach(() => {
		store.$reset();
	});

	it("becomes disabled when revalidation marks an invalid roof incomplete", async () => {
		const roof: RoofData = {
			id: "ec8e8ec6-0fcb-43dc-81e0-9e2e9afb9e20",
			name: "Roof 1",
			typeOfRoof: "flatAboveHeatedSpace",
			pitch: -1,
			length: 1,
			width: 1,
			elevationalHeightOfElement: 2,
			surfaceArea: 1,
			uValue: 1,
			colour: "Light",
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
		};
		store.$patch({
			dwellingFabric: {
				dwellingSpaceRoofs: {
					data: [{ data: roof, complete: true }],
				},
			},
		});

		expect(hasCompleteState(store.$state)).toBe(true);
		await renderSuspended(component);
		const button = screen.getByRole<HTMLButtonElement>("button", { name: "Calculate" });
		expect(button.disabled).toBe(false);

		store.revalidate();
		await nextTick();

		expect(store.dwellingFabric.dwellingSpaceRoofs).toEqual({
			data: [{ data: roof, complete: false }],
			complete: false,
		});
		expect(hasCompleteState(store.$state)).toBe(false);
		expect(button.disabled).toBe(true);
	});

	it("updates when the store becomes complete or incomplete", async () => {
		store.dwellingFabric.dwellingSpaceRoofs.complete = false;
		await renderSuspended(component, { props: { onError: vi.fn() } });
		const button = screen.getByRole<HTMLButtonElement>("button", { name: "Calculate" });
		expect(button.disabled).toBe(true);

		store.dwellingFabric.dwellingSpaceRoofs.complete = true;
		await nextTick();
		expect(button.disabled).toBe(false);

		store.dwellingFabric.dwellingSpaceRoofs.complete = false;
		await nextTick();
		expect(button.disabled).toBe(true);
	});

	it("disables while a calculation is pending and follows completeness after it succeeds", async () => {
		const { promise, resolve } = Promise.withResolvers<{ data: object; success: boolean }>();
		// Mock the fetch response to simulate a pending calculation
		mocks.fetch.mockReturnValue(promise);

		await renderSuspended(component);
		const button = screen.getByRole<HTMLButtonElement>("button", { name: "Calculate" });
		const user = userEvent.setup();

		await user.click(button);
		expect(button.disabled).toBe(true);
		expect(mocks.fetch).toHaveBeenCalledOnce();
		expect(mocks.fetch).toHaveBeenCalledWith(endpoint, expect.objectContaining({ method: "POST" }));

		await user.click(button);
		expect(mocks.fetch).toHaveBeenCalledOnce();

		store.dwellingFabric.dwellingSpaceRoofs.complete = false;
		// Resolve simulates the fetch response completing
		resolve({ data: {}, success: true });
		await vi.waitFor(() => expect(mocks.navigateTo).toHaveBeenCalledWith(destination));
		await nextTick();
		expect(button.disabled).toBe(true);

		store.dwellingFabric.dwellingSpaceRoofs.complete = true;
		await nextTick();
		expect(button.disabled).toBe(false);
	});

	it("re-enables and reports errors when a calculation fails", async () => {
		mocks.fetch.mockRejectedValue(new Error("Request failed"));
		const onError = vi.fn();

		
		await renderSuspended(component, { props: { onError } });
		const button = screen.getByRole<HTMLButtonElement>("button", { name: "Calculate" });
		await userEvent.setup().click(button);
		await vi.waitFor(() => expect(onError).toHaveBeenCalledOnce());
		await nextTick();
		expect(button.disabled).toBe(false);
		expect(mocks.navigateTo).not.toHaveBeenCalled();
		
	});
});
