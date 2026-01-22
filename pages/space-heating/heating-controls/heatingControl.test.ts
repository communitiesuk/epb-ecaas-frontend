import HeatingControls from "./index.vue";
import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("Heating controls", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	const heatingControl: HeatingControlData = {
		name: "Separate temperature control",
		heatingControlType: "separateTemperatureControl",
	};

	const populateValidForm = async () => {
		await user.click(screen.getByTestId("heatingControlType_separateTemperatureControl"));
		await user.tab();
	};

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(HeatingControls, {
			route: {
				params: { "heatingControl": "create" },
			},
		});
		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.spaceHeating.heatingControls;

		expect(data[0]?.data).toEqual(heatingControl);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			spaceHeating: {
				heatingControls: {
					data: [{ data: heatingControl }],
				},
			},
		});

		await renderSuspended(HeatingControls, {
			route: {
				params: { "heatingControl": "0" },
			},
		});

		expect((await screen.findByTestId("heatingControlType_separateTemperatureControl")).hasAttribute("checked")).toBe(true);
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(HeatingControls, {
			route: {
				params: { "heatingControl": "create" },
			},
		});

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("heatingControlType_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(HeatingControls, {
			route: {
				params: { "heatingControl": "create" },
			},
		});

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("heatingControlsErrorSummary"))).toBeDefined();
	});

	describe("partially saving data", () => {
		test("updated form data is automatically saved to store ", async () => {
			store.$patch({
				spaceHeating: {
					heatingControls: { data: [{ data: heatingControl }] },
				},
			});

			await renderSuspended(HeatingControls, {
				route: {
					params: { "heatingControl": "0" },
				},
			});
			await user.click(screen.getByTestId("heatingControlType_separateTimeAndTemperatureControl"));
			await user.tab();

			expect(store.spaceHeating.heatingControls.data[0]?.data.name).toBe("Separate time and temperature control");
			expect(store.spaceHeating.heatingControls.data[0]?.data.heatingControlType).toBe("separateTimeAndTemperatureControl");
		});
	});
});
