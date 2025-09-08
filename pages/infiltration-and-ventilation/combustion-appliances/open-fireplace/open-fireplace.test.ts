import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { screen } from "@testing-library/vue";
import OpenFireplace from "./[combustion].vue";
import userEvent from "@testing-library/user-event";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("open fireplace", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const openFireplace: CombustionApplianceData = {
		name: "Open fireplace 1",
		airSupplyToAppliance: "room_air",
		exhaustMethodFromAppliance: "into_separate_duct",
		typeOfFuel: "coal",
	};

	afterEach(() => {
		store.$reset();
	});

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(OpenFireplace);

		await user.type(screen.getByTestId("name"), "Open fireplace 1");
		await user.click(screen.getByTestId("airSupplyToAppliance_room_air"));
		await user.click(screen.getByTestId("exhaustMethodFromAppliance_into_separate_duct"));
		await user.click(screen.getByTestId("typeOfFuel_coal"));

		await user.tab();
		await user.click(screen.getByRole("button"));

		const { data } = store.infiltrationAndVentilation.combustionAppliances["open_fireplace"];

		expect(data[0]).toEqual(openFireplace);
		expect(navigateToMock).toHaveBeenCalledWith("/infiltration-and-ventilation/combustion-appliances");
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					open_fireplace: {
						data: [openFireplace]
					}
				}
			}
		});

		await renderSuspended(OpenFireplace, {
			route: {
				params: { combustion: "0" }
			}
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Open fireplace 1");
		expect((await screen.findByTestId("airSupplyToAppliance_room_air")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("exhaustMethodFromAppliance_into_separate_duct")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("typeOfFuel_coal")).hasAttribute("checked")).toBe(true);
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(OpenFireplace);

		await user.click(screen.getByRole("button"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("airSupplyToAppliance_error"))).toBeDefined();
		expect((await screen.findByTestId("exhaustMethodFromAppliance_error"))).toBeDefined();
		expect((await screen.findByTestId("typeOfFuel_error"))).toBeDefined();
	});
});
