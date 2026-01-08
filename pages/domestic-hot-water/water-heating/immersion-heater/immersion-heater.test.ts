import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import ImmersionHeater from "./[immersionHeater].vue";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("immersion heater", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const immersionHeater: ImmersionHeaterData = {
		name: "Immersion heater",
		ratedPower: 10,
		heaterPosition: "top",
		thermostatPosition: "top",
	};
	
	const immersionHeaterForm: EcaasForm<ImmersionHeaterData> = {
		data: immersionHeater,
		complete: true,
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Immersion heater");
		await user.type(screen.getByTestId("ratedPower"), "10");
		await user.click(screen.getByTestId("heaterPosition_top"));
		await user.click(screen.getByTestId("thermostatPosition_top"));
		await user.tab();
	};

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(ImmersionHeater);

		await populateValidForm();
		await user.click(screen.getByRole("button"));

		const { data } = store.domesticHotWater.waterHeating.immersionHeater;
		
		expect(data[0]).toEqual(immersionHeaterForm);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			domesticHotWater: {
				waterHeating: {
					immersionHeater: {
						data: [immersionHeaterForm],
					},
				},
			},
		});

		await renderSuspended(ImmersionHeater, {
			route: {
				params: { "immersionHeater": "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Immersion heater");
		expect((await screen.findByTestId<HTMLInputElement>("ratedPower")).value).toBe("10");
		expect((await screen.findByTestId("heaterPosition_top")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("thermostatPosition_top")).hasAttribute("checked")).toBe(true);
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(ImmersionHeater);

		await user.click(screen.getByRole("button"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("ratedPower_error"))).toBeDefined();
		expect((await screen.findByTestId("heaterPosition_error"))).toBeDefined();
		expect((await screen.findByTestId("thermostatPosition_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(ImmersionHeater);

		await user.click(screen.getByRole("button"));

		expect((await screen.findByTestId("immersionHeaterErrorSummary"))).toBeDefined();
	});

	test("navigates to water heating page when valid form is completed", async () => {
		await renderSuspended(ImmersionHeater);
	
		await populateValidForm();
		await user.click(screen.getByRole("button"));

		expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water/water-heating");
	});
});