import InfiltrationAndVentilationTaskPage from "./index.vue";
import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { v4 as uuidv4 } from "uuid";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("the ventilation task page", async () => {
	const store = useEcaasStore();

	const mechanicalVentilation1: MechanicalVentilationData = {
		id: uuidv4(),
		name: "Mechanical name 1",
		typeOfMechanicalVentilationOptions: "MVHR",
		airFlowRate: {
			amount: 12,
			unit: "litres per second",
		},
		mvhrLocation: "inside",
		productReference: "1000",
		midHeightOfAirFlowPathForExhaust: 1.5,
		orientationOfExhaust: 90,
		pitchOfExhaust: 10,
		midHeightOfAirFlowPathForIntake: 1.5,
		orientationOfIntake: 80,
		pitchOfIntake: 10,
		installedUnderApprovedScheme: true,
		measuredFanPowerAndAirFlowRateKnown: false,
		associatedItemId: "none",
		hasAssociatedItem: false,
		pitch: 90,
		orientation: 180,
	};

	afterEach(() => {
		store.$reset();
	});

	it("should find the header", async () => {
		await renderSuspended(InfiltrationAndVentilationTaskPage, {
			route: {
				path: "/infiltration-and-ventilation",
			},
		});
		expect(screen.getByRole("heading", { name: "Infiltration and ventilation" }));
	});

	it("should find a list item", async () => {
		await renderSuspended(InfiltrationAndVentilationTaskPage, {
			route: {
				path: "/infiltration-and-ventilation",
			},
		});
		expect(screen.getByText("Mechanical ventilation")).toBeDefined();
	});

	it("does not show ductwork", async () => {
		await renderSuspended(InfiltrationAndVentilationTaskPage, {
			route: {
				path: "/infiltration-and-ventilation",
			},
		});
		expect(screen.queryByText("MVHR ductwork")).toBeNull();
	});

	it("shows ductwork when there is a MVHR mechanical ventilation object", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [{
						data: mechanicalVentilation1,
					}],
				},
			},
		});
		await renderSuspended(InfiltrationAndVentilationTaskPage, {
			route: {
				path: "/infiltration-and-ventilation",
			},
		});
		expect(screen.getByText("MVHR ductwork")).toBeDefined();
	});
});

