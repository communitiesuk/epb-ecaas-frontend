import userEvent from "@testing-library/user-event";
import ClosedFire from "./[combustion].vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { screen } from "@testing-library/vue";
import { CombustionAirSupplySituation, CombustionApplianceType, CombustionFuelType, FlueGasExhaustSituation } from "~/schema/api-schema.types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("closed fire", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const closedFire: CombustionApplianceData = {
		name: "Closed fire 1",
		airSupplyToAppliance: CombustionAirSupplySituation.outside,
		exhaustMethodFromAppliance: FlueGasExhaustSituation.into_mech_vent,
		typeOfFuel: CombustionFuelType.coal,
	};

	afterEach(() => {
		store.$reset();
	});

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(ClosedFire);

		await user.type(screen.getByTestId("name"), "Closed fire 1");
		await user.click(screen.getByTestId("airSupplyToAppliance_outside"));
		await user.click(screen.getByTestId("exhaustMethodFromAppliance_into_mech_vent"));
		await user.click(screen.getByTestId("typeOfFuel_coal"));

		await user.tab();
		await user.click(screen.getByRole("button"));

		const { data } = store.infiltrationAndVentilation.combustionAppliances[CombustionApplianceType.closed_fire];

		expect(data[0]).toEqual(closedFire);
		expect(navigateToMock).toHaveBeenCalledWith("/infiltration-and-ventilation/combustion-appliances");
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.closed_fire]: {
						data: [closedFire],
					},
				},
			},
		});

		await renderSuspended(ClosedFire, {
			route: {
				params: { combustion: "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Closed fire 1");
		expect((await screen.findByTestId("airSupplyToAppliance_outside")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("exhaustMethodFromAppliance_into_mech_vent")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("typeOfFuel_coal")).hasAttribute("checked")).toBe(true);
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(ClosedFire);

		await user.click(screen.getByRole("button"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("airSupplyToAppliance_error"))).toBeDefined();
		expect((await screen.findByTestId("exhaustMethodFromAppliance_error"))).toBeDefined();
		expect((await screen.findByTestId("typeOfFuel_error"))).toBeDefined();
	});
});
