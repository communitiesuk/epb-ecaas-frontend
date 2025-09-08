import Ventilation from "./natural-ventilation.vue";
import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";
import type { VentilationData } from "~/stores/ecaasStore.schema";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("Ventilation", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	const state: VentilationData = {
		ventilationZoneHeight: 1,
		dwellingEnvelopeArea: 5,
		dwellingElevationalLevelAtBase: 1,
		crossVentilationPossible: true,
		maxRequiredAirChangeRate: 2
	};

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("ventilationZoneHeight"), "1");
		await user.type(screen.getByTestId("dwellingEnvelopeArea"), "5");
		await user.type(screen.getByTestId("dwellingElevationalLevelAtBase"), "1");
		await user.click(screen.getByTestId("crossVentilationPossible_yes"));
		await user.tab();
	};

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(Ventilation);

		await populateValidForm();
		await user.click(screen.getByRole("button"));

		const { data } = store.infiltrationAndVentilation.naturalVentilation;
		
		expect(data).toEqual(state);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				naturalVentilation: {
					data: state
				}
			}
		});

		await renderSuspended(Ventilation);

		expect((await screen.findByTestId<HTMLInputElement>("ventilationZoneHeight")).value).toBe("1");
		expect((await screen.findByTestId<HTMLInputElement>("dwellingEnvelopeArea")).value).toBe("5");
		expect((await screen.findByTestId<HTMLInputElement>("dwellingElevationalLevelAtBase")).value).toBe("1");
		expect((await screen.findByTestId("crossVentilationPossible_yes")).hasAttribute("checked")).toBe(true);
	});
		
	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(Ventilation);

		await user.click(screen.getByRole("button"));

		expect((await screen.findByTestId("ventilationZoneHeight_error"))).toBeDefined();
		expect((await screen.findByTestId("dwellingEnvelopeArea_error"))).toBeDefined();
		expect((await screen.findByTestId("dwellingElevationalLevelAtBase_error"))).toBeDefined();
		expect((await screen.findByTestId("crossVentilationPossible_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(Ventilation);

		await user.click(screen.getByRole("button"));

		expect((await screen.findByTestId("ventilationErrorSummary"))).toBeDefined();
	});

	it("navigates to infiltration and ventilation page when valid form is completed", async () => {
		await renderSuspended(Ventilation);
	
		await populateValidForm();
		await user.click(screen.getByRole("button"));

		const { complete } = store.infiltrationAndVentilation.naturalVentilation;
		
		expect(complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith("/infiltration-and-ventilation");
	});
});
