import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import MechanicalVentilationOverview from "./index.vue";
import MechanicalVentilationForm from "./[mechanical].vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import InfiltrationAndVentilationTaskPage from "../index.vue";
import { DuctShape, DuctType, MVHRLocation } from "~/schema/api-schema.types";
import { VentType } from "~/schema/aliases";

describe("mechanical ventilation overview", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const navigateToMock = vi.hoisted(() => vi.fn());
	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});

	const mechanicalVentilation1: MechanicalVentilationData = {
		id: "5124f2fe-f15b-4a56-ba5a-1a7751ac506f",
		name: "Mechanical name 1",
		typeOfMechanicalVentilationOptions: VentType.MVHR,
		airFlowRate: 12,
		mvhrLocation: MVHRLocation.inside,
		mvhrEfficiency: 0.1,

	};

	const mechanicalVentilation2: MechanicalVentilationData = {
		id: "7184f2fe-a78f-4a56-ba5a-1a7751ac506d",
		name: "Mechanical name 2",
		typeOfMechanicalVentilationOptions: VentType.Decentralised_continuous_MEV,
		airFlowRate: 14,
	};

	const mechanicalVentilation3: MechanicalVentilationData = {
		id: "6380f2fe-a78f-4a56-ba5a-1a7751ac502a",
		name: "Mechanical name 3",
		typeOfMechanicalVentilationOptions: VentType.Intermittent_MEV,
		airFlowRate: 14,
	};

	const mechanicalVentilation4: MechanicalVentilationData = {
		id: "6746f2fe-f15b-4a56-ba5a-1a7751ac89hh",
		name: "Mechanical name 4",
		typeOfMechanicalVentilationOptions: VentType.MVHR,
		airFlowRate: 12,
		mvhrLocation: MVHRLocation.inside,
		mvhrEfficiency: 0.1,

	};

	// linked to mechanicalVentilation1
	const ductwork1: DuctworkData = {
		name: "Ductwork 1",
		mvhrUnit: "5124f2fe-f15b-4a56-ba5a-1a7751ac506f",
		ductworkCrossSectionalShape: DuctShape.circular,
		ductType: DuctType.intake,
		internalDiameterOfDuctwork: 300,
		externalDiameterOfDuctwork: 1000,
		insulationThickness: 100,
		lengthOfDuctwork: 100,
		thermalInsulationConductivityOfDuctwork: 10,
		surfaceReflectivity: true,
	};

	// linked to mechanicalVentilation1
	const ductwork2: DuctworkData = {
		name: "Ductwork 2",
		mvhrUnit: "5124f2fe-f15b-4a56-ba5a-1a7751ac506f",
		ductworkCrossSectionalShape: DuctShape.circular,
		ductType: DuctType.intake,
		internalDiameterOfDuctwork: 300,
		externalDiameterOfDuctwork: 1000,
		insulationThickness: 100,
		lengthOfDuctwork: 100,
		thermalInsulationConductivityOfDuctwork: 10,
		surfaceReflectivity: true,
	};

	// linked to mechanicalVentilation4
	const ductwork3: DuctworkData = {
		name: "Ductwork 3",
		mvhrUnit: "6746f2fe-f15b-4a56-ba5a-1a7751ac89hh",
		ductworkCrossSectionalShape: DuctShape.circular,
		ductType: DuctType.intake,
		internalDiameterOfDuctwork: 300,
		externalDiameterOfDuctwork: 1000,
		insulationThickness: 100,
		lengthOfDuctwork: 100,
		thermalInsulationConductivityOfDuctwork: 10,
		surfaceReflectivity: true,
	};

	afterEach(() => {
		store.$reset();
	});

	it("mechanical ventilation is removed when remove button is clicked", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [mechanicalVentilation1],
				},
			},
		});

		await renderSuspended(MechanicalVentilationOverview);

		expect(screen.getAllByTestId("mechanicalVentilation_items")).toBeDefined();

		await user.click(screen.getByTestId("mechanicalVentilation_remove_0"));

		expect(screen.queryByTestId("mechanicalVentilation_items")).toBeNull();
	});

	it("should only remove the mechanical ventilation object that is clicked", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [
						mechanicalVentilation1,
						mechanicalVentilation2,
						mechanicalVentilation3
					],
				},
			},
		});
		await renderSuspended(MechanicalVentilationOverview);
		expect(
			screen.getAllByTestId("mechanicalVentilation_items")
		).toBeDefined();
		await user.click(screen.getByTestId("mechanicalVentilation_remove_1"));
		expect(screen.queryByTestId("mechanicalVentilation_1")).toBeNull();
		expect(screen.queryByTestId("mechanicalVentilation_0")).toBeDefined();
		expect(screen.queryByTestId("mechanicalVentilation_2")).toBeDefined();
	});

	it("should remove the associated ductwork when a MVHR mechanical ventilation object is removed", async() => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [
						mechanicalVentilation1,
						mechanicalVentilation4,
					],
				},
				ductwork :{
					data: [
						ductwork1,
						ductwork2,
						ductwork3
					]
				}
			},
		});
		await renderSuspended(MechanicalVentilationOverview);
		await user.click(screen.getByTestId("mechanicalVentilation_remove_0"));
		expect(store.infiltrationAndVentilation.ductwork.data).toEqual([ductwork3]);

		await user.click(screen.getByTestId("mechanicalVentilation_remove_0"));
		expect(store.infiltrationAndVentilation.ductwork.data).toEqual([]);

		await renderSuspended(InfiltrationAndVentilationTaskPage,{
			route: {
				path: "/infiltration-and-ventilation"
			}
		});
		expect(screen.queryByText("MVHR ductwork")).toBeNull();
	});

	it("should duplicate mechanical ventilation object when duplicate button is clicked", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [
						mechanicalVentilation1,
						mechanicalVentilation2
					],
				},
			},
		});
		await renderSuspended(MechanicalVentilationOverview);

		await renderSuspended(MechanicalVentilationOverview);
		await userEvent.click(
			screen.getByTestId("mechanicalVentilation_duplicate_0")
		);
		await userEvent.click(
			screen.getByTestId("mechanicalVentilation_duplicate_0")
		);
		await userEvent.click(
			screen.getByTestId("mechanicalVentilation_duplicate_2")
		);
		await userEvent.click(
			screen.getByTestId("mechanicalVentilation_duplicate_2")
		);

		expect(screen.queryAllByTestId("mechanicalVentilation_item").length).toBe(
			6
		);
		expect(screen.getByText("Mechanical name 1")).toBeDefined();
		expect(screen.getByText("Mechanical name 1 (1)")).toBeDefined();
		expect(screen.getByText("Mechanical name 1 (2)")).toBeDefined();
		expect(screen.getByText("Mechanical name 1 (1) (1)")).toBeDefined();
		expect(screen.getByText("Mechanical name 1 (1) (2)")).toBeDefined();
	});

	it("should not duplicate the id when duplicating the mechanical ventilation object", async() => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [
						mechanicalVentilation1
					],
				},
			},
		});
		await renderSuspended(MechanicalVentilationOverview);
		await userEvent.click(
			screen.getByTestId("mechanicalVentilation_duplicate_0")
		);
		expect(store.infiltrationAndVentilation.mechanicalVentilation.data[0]?.id).not.toBe(store.infiltrationAndVentilation.mechanicalVentilation.data[1]?.id);
	});

	it("should only display warning message when mechanical ventilations of type mvhr have been added", async() => {

		const warningMessage = "Note if you remove a MVHR this will also remove any associated ductwork";
		await renderSuspended(MechanicalVentilationOverview);

		expect(screen.queryByText(warningMessage)).toBeNull();
		
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [
						mechanicalVentilation1
					],
				},
			},
		});
		await renderSuspended(MechanicalVentilationOverview);

		expect(screen.getByText(warningMessage)).toBeDefined();

	});

	it("marks mechanical ventilation as complete when mark section as complete button is clicked", async () => {
	
		await renderSuspended(MechanicalVentilationOverview);
		expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		const completedStatusElement = screen.queryByTestId("completeSectionCompleted");
		expect(completedStatusElement?.style.display).toBe("none");
	
		await user.click(screen.getByTestId("completeSectionButton"));
	
		const { complete } = store.infiltrationAndVentilation.mechanicalVentilation;
	
		expect(complete).toBe(true);
		expect(screen.queryByRole("button", { name: "Mark section as complete" })).toBeNull();
		expect(completedStatusElement?.style.display).not.toBe("none");
	
		expect(navigateToMock).toHaveBeenCalledWith("/infiltration-and-ventilation");
	});
	
	it("marks shading as not complete when complete button is clicked then user removes a shading item", async () => {
				
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [
						mechanicalVentilation1, mechanicalVentilation2
					],
				},
			},
		});
		await renderSuspended(MechanicalVentilationOverview);
		
		await user.click(screen.getByTestId("completeSectionButton"));
		expect(store.infiltrationAndVentilation.mechanicalVentilation.complete).toBe(true);
		
		await user.click(screen.getByTestId("mechanicalVentilation_remove_0"));
		expect(store.infiltrationAndVentilation.mechanicalVentilation.complete).toBe(false);
		expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		
	});

	it("marks mechanical ventilation as not complete when complete button is clicked then user duplicates a mechanical ventilation item", async () => {

		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [mechanicalVentilation1]
				}
			}
		});
			
		await renderSuspended(MechanicalVentilationOverview);
			
		await user.click(screen.getByTestId("completeSectionButton"));
		expect(store.infiltrationAndVentilation.mechanicalVentilation.complete).toBe(true);
			
		await user.click(screen.getByTestId("mechanicalVentilation_duplicate_0"));
		expect(store.infiltrationAndVentilation.mechanicalVentilation.complete).toBe(false);
		expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			
	});
	it("marks mechanical ventilation as not complete when user saves a new or edited form after marking section as complete", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [mechanicalVentilation1]
				}
			}
		});
			
		await renderSuspended(MechanicalVentilationOverview);
		await user.click(screen.getByTestId("completeSectionButton"));
			
		await renderSuspended(MechanicalVentilationForm, {
			route: {
				params: { mechanical: "0" }
			}
		});
		
		await user.click(screen.getByRole("button")); 
			
		const { complete } = store.infiltrationAndVentilation.mechanicalVentilation;
		expect(complete).toBe(false);
			
		await renderSuspended(MechanicalVentilationOverview);
		expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
	});
	it("should navigate to the infiltration and ventilation overview page when return to overview is clicked", async () => {
		await renderSuspended(MechanicalVentilationOverview);
	
		const returnToOverviewButton = screen.getByRole("button", { name : "Return to infiltration and ventilation" });
		expect(returnToOverviewButton.getAttribute("href")).toBe("/infiltration-and-ventilation");

	} );
});
