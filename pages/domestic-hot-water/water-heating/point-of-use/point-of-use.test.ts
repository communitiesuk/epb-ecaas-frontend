import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import PointOfUse from "./[pointOfUse].vue";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("point of use", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const pointOfUse: PointOfUseData = {
		name: "Point of use",
		setpointTemperature: 25,
		heaterEfficiency: 0.5,
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Point of use");
		await user.type(screen.getByTestId("setpointTemperature"), "25");
		await user.type(screen.getByTestId("heaterEfficiency"), "0.5");
		await user.tab();
	};

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(PointOfUse);

		await populateValidForm();
		await user.click(screen.getByRole("button"));

		const { data } = store.domesticHotWater.waterHeating.pointOfUse;

		expect(data[0]).toEqual(pointOfUse);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			domesticHotWater: {
				waterHeating: {
					pointOfUse: {
						data: [pointOfUse],
					},
				},
			},
		});

		await renderSuspended(PointOfUse, {
			route: {
				params: { "pointOfUse": "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Point of use");
		expect((await screen.findByTestId<HTMLInputElement>("setpointTemperature")).value).toBe("25");
		expect((await screen.findByTestId<HTMLInputElement>("heaterEfficiency")).value).toBe("0.5");
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(PointOfUse);

		await user.click(screen.getByRole("button"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("setpointTemperature_error"))).toBeDefined();
		expect((await screen.findByTestId("heaterEfficiency_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(PointOfUse);

		await user.click(screen.getByRole("button"));

		expect((await screen.findByTestId("pointOfUseErrorSummary"))).toBeDefined();
	});

	test("navigates to water heating page when valid form is completed", async () => {
		await renderSuspended(PointOfUse);

		await populateValidForm();
		await user.click(screen.getByRole("button"));

		expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water/water-heating");
	});
});