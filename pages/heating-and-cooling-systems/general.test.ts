import General from "./general.vue";
import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("General", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	const state: EcaasForm<GeneralHeatingAndCoolingSystems> = {
		data: {
			heatingControlType: "separateTemperatureControl",
			coolingRequired: true,
		},
	};

	const populateValidForm = async () => {
		await user.click(screen.getByTestId("heatingControlType_separateTemperatureControl"));
		await user.click(screen.getByTestId("coolingRequired_yes"));
		await user.tab();
	};

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(General);
		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.heatingAndCoolingSystems.general;

		expect(data).toEqual(state.data);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			heatingAndCoolingSystems: {
				general: state,
			},
		});

		await renderSuspended(General);

		expect((await screen.findByTestId("heatingControlType_separateTemperatureControl")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("coolingRequired_yes")).hasAttribute("checked")).toBe(true);

	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(General);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("heatingControlType_error"))).toBeDefined();
		expect((await screen.findByTestId("coolingRequired_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(General);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("generalErrorSummary"))).toBeDefined();
	});

	describe("partially saving data", () => {
		test("updated form data is automatically saved to store ", async () => {
			store.$patch({
				heatingAndCoolingSystems: {
					general: state,
				},
			});

			await renderSuspended(General);
			await user.click(screen.getByTestId("coolingRequired_no"));

			expect(store.heatingAndCoolingSystems.general.data.coolingRequired).toBe(false);
		});
	});
});
