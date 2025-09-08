import InfiltrationAndVentilationTaskPage from "./index.vue";
import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { v4 as uuidv4 } from "uuid";
import { MVHRLocation, VentType } from "~/schema/api-schema.types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("the ventilation task page", async ()=>{
	const store = useEcaasStore();

	const mechanicalVentilation1: MechanicalVentilationData = {
		id: uuidv4(),
		name: "Mechanical name 1",
		typeOfMechanicalVentilationOptions: VentType.MVHR,
		airFlowRate: 12,
		mvhrLocation: MVHRLocation.inside,
		mvhrEfficiency: 0.1,
	};

	afterEach(() => {
		store.$reset();
	});

	it("should find the header", async ()=> {
		await renderSuspended(InfiltrationAndVentilationTaskPage, {
			route: {
				path: "/infiltration-and-ventilation"
			}
		});
		expect(screen.getByRole("heading", { name: "Infiltration and ventilation" }));
	});

	it("should find a list item", async ()=> {
		await renderSuspended(InfiltrationAndVentilationTaskPage, {
			route: {
				path: "/infiltration-and-ventilation"
			}
		});
		expect(screen.getByText("Mechanical ventilation")).toBeDefined();
	});

	it("does not show ductwork", async ()=> {
		await renderSuspended(InfiltrationAndVentilationTaskPage, {
			route: {
				path: "/infiltration-and-ventilation"
			}
		});
		expect(screen.queryByText("MVHR ductwork")).toBeNull();
	});

	it("shows ductwork when there is a MVHR mechanical ventilation object", async ()=>{
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [
						mechanicalVentilation1,
					],
				}
			},
		});
		await renderSuspended(InfiltrationAndVentilationTaskPage, {
			route: {
				path: "/infiltration-and-ventilation"
			}
		});
		expect(screen.getByText("MVHR ductwork")).toBeDefined();
	});
});

