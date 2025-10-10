import AirConditioning from "./[airConditioning].vue";
import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";
import type { AirConditioningData } from "~/stores/ecaasStore.schema";
import { FuelType } from "~/schema/api-schema.types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("Air conditioning", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	const state: AirConditioningData = {
		name: "Air conditioner 1",
		coolingCapacity: 10,
		seasonalEnergyEfficiencyRatio: 10,
		convectionFraction: 1,
		energySupply: FuelType.electricity,
	};

	const energySupplyState: EnergySupplyData = {
		fuelType: [FuelType.electricity],
		exported: true,
	};

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Air conditioner 1");
		await user.type(screen.getByTestId("coolingCapacity"), "10");
		await user.type(screen.getByTestId("seasonalEnergyEfficiencyRatio"), "10");
		await user.type(screen.getByTestId("convectionFraction"), "1");
		await user.click(screen.getByTestId("energySupply_electricity"));
		await user.tab();
	};

	test("data is saved to store state when form is valid", async () => {
		store.$patch({
			heatingSystems: {
				energySupply: {
					data: energySupplyState,
				},
			},
		});

		await renderSuspended(AirConditioning, {
			route: {
				params: { airConditioning: "create" },
			},
		});


		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.heatingSystems.cooling.airConditioning;

		expect(data[0]?.data).toEqual(state);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			heatingSystems: {
				cooling: {
					airConditioning: {
						data: [{ data: state }],
					},
				},
				energySupply: {
					data: energySupplyState,
				},
			},
		});

		await renderSuspended(AirConditioning, {
			route: {
				params: { airConditioning: "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Air conditioner 1");
		expect((await screen.findByTestId<HTMLInputElement>("coolingCapacity")).value).toBe("10");
		expect((await screen.findByTestId<HTMLInputElement>("seasonalEnergyEfficiencyRatio")).value).toBe("10");
		expect((await screen.findByTestId<HTMLInputElement>("convectionFraction")).value).toBe("1");
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(AirConditioning);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("coolingCapacity_error"))).toBeDefined();
		expect((await screen.findByTestId("seasonalEnergyEfficiencyRatio_error"))).toBeDefined();
		expect((await screen.findByTestId("convectionFraction_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(AirConditioning);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("airConditioningErrorSummary"))).toBeDefined();
	});

});
