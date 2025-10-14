import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import Pipework from "./index.vue";
import PrimaryPipeworkForm from "./primary/[pipe].vue";
import SecondaryPipeworkForm from "./secondary/[pipe].vue";
import {
	WaterPipeContentsType,
	WaterPipeworkLocation,
} from "~/schema/api-schema.types";

describe("Pipeworks", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const pipework1: EcaasForm<Partial<PrimaryPipeworkData>> = {
		data: {
			name: "Pipework Kitchen Sink",
			internalDiameter: 20,
			externalDiameter: 25,
			length: 10,
			insulationThickness: 5,
			thermalConductivity: 0.5,
			surfaceReflectivity: false,
			pipeContents: WaterPipeContentsType.water,
			hotWaterCylinder: "4346aa5c-c8c7-41ea-99d4-a3cf5e3d21a36",
			location: WaterPipeworkLocation.internal,
		},
		complete: true,
	};

	const pipework2: EcaasForm<Partial<SecondaryPipeworkData>> = {
		data: {
			name: "Pipework Kitchen",
			length: 3,
			location: WaterPipeworkLocation.internal,
			internalDiameter: 9,
		},
		complete: true,
	};

	afterEach(() => {
		store.$reset();
	});

	describe("primary pipework", () => {
		test("pipework is removed when remove link is clicked", async () => {
			store.$patch({
				domesticHotWater: {
					pipework: {
						primaryPipework: {
							data: [pipework1],
						},
					},
				},
			});

			await renderSuspended(Pipework);

			const populatedList = screen.queryByTestId("primaryPipework_items");

			await user.click(screen.getByTestId("primaryPipework_remove_0"));

			expect(populatedList).toBeDefined();
			expect(screen.queryByTestId("primaryPipework_items")).toBeNull();
		});

		it("duplicates pipework in list when duplicate link is clicked", async () => {
			store.$patch({
				domesticHotWater: {
					pipework: {
						primaryPipework: {
							data: [pipework1, pipework2],
						},
					},
				},
			});

			await renderSuspended(Pipework);

			await user.click(screen.getByTestId("primaryPipework_duplicate_0"));
			await user.click(screen.getByTestId("primaryPipework_duplicate_0"));
			await user.click(screen.getByTestId("primaryPipework_duplicate_1"));

			expect(screen.queryAllByTestId("primaryPipework_item").length).toBe(5);
			expect(screen.getByText("Pipework Kitchen Sink (1)")).toBeDefined();
			expect(screen.getByText("Pipework Kitchen Sink (2)")).toBeDefined();
			expect(screen.getByText("Pipework Kitchen (1)")).toBeDefined();
		});
	});

	describe("secondary pipework", () => {
		test("pipework is removed when remove link is clicked", async () => {
			store.$patch({
				domesticHotWater: {
					pipework: {
						secondaryPipework: {
							data: [pipework1],
						},
					},
				},
			});

			await renderSuspended(Pipework);

			const populatedList = screen.queryByTestId("secondaryPipework_items");

			await user.click(screen.getByTestId("secondaryPipework_remove_0"));

			expect(populatedList).toBeDefined();
			expect(screen.queryByTestId("secondaryPipework_items")).toBeNull();
		});

		it("duplicates pipework in list when duplicate link is clicked", async () => {
			store.$patch({
				domesticHotWater: {
					pipework: {
						secondaryPipework: {
							data: [pipework1, pipework2],
						},
					},
				},
			});

			await renderSuspended(Pipework);

			await user.click(screen.getByTestId("secondaryPipework_duplicate_0"));
			await user.click(screen.getByTestId("secondaryPipework_duplicate_0"));
			await user.click(screen.getByTestId("secondaryPipework_duplicate_1"));

			expect(screen.queryAllByTestId("secondaryPipework_item").length).toBe(5);
			expect(screen.getByText("Pipework Kitchen Sink (1)")).toBeDefined();
			expect(screen.getByText("Pipework Kitchen Sink (2)")).toBeDefined();
			expect(screen.getByText("Pipework Kitchen (1)")).toBeDefined();
		});
	});

	describe("mark pipework section as complete", () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const navigateToMock = vi.hoisted(() => vi.fn());
		mockNuxtImport("navigateTo", () => {
			return navigateToMock;
		});

	
		const addCompletePipeworkDataToStore = async () => {
			store.$patch({
				domesticHotWater: {
					pipework: {
						primaryPipework: { data: [pipework1] },
						secondaryPipework: { data: [pipework2] },
					},
					waterHeating: {
						hotWaterCylinder: {
							data: [{
								data: {
									name: "Cylinder 1",
									id: "4346aa5c-c8c7-41ea-99d4-a3cf5e3d21a36",
								},
							},
							],
						},
					},
				},
			});
		};

		beforeEach(async () => {
			await renderSuspended(Pipework);
		});

		afterEach(async () => {
			store.$reset();
		});

		const pipeworkForms = {
			primaryPipework: PrimaryPipeworkForm,		
			secondaryPipework: SecondaryPipeworkForm,			
		};

    type PipeworkType = keyof typeof store.domesticHotWater.pipework;

    it("disables the Mark section as complete button when window element is incomplete", async () => {
    	store.$patch({
    		domesticHotWater: {
    			pipework: {
    				primaryPipework: { data: [{ ...pipework1, complete: false }] },
    				secondaryPipework: { data: [{ ...pipework2, complete: false }] },
    			},
    			waterHeating: {
    				hotWaterCylinder: {
    					data: [{
    						data: {
    							name: "Cylinder 1",
    							id: "4346aa5c-c8c7-41ea-99d4-a3cf5e3d21a36",
    						},
    					},
    					],
    				},
    			},
    		},
    	});

    	await renderSuspended(Pipework);
    	expect(
    		screen.getByTestId("markAsCompleteButton").hasAttribute("disabled"),
    	).toBeTruthy();
    });

    it("enables the Mark section as complete button when all window items are complete", async () => {
    	addCompletePipeworkDataToStore();

    	await renderSuspended(Pipework);
    	expect(screen.getByTestId("markAsCompleteButton").hasAttribute("disabled")).toBeFalsy();

    });

    it("displays a 'Completed' status indicator when section is marked as complete", async () => {
    	await renderSuspended(Pipework);
    	await user.click(screen.getByTestId("markAsCompleteButton"));
    	const completedStatusElement = screen.queryByTestId(
    		"completeSectionCompleted",
    	);
    	expect(completedStatusElement?.style.display).not.toBe("none");
    });

    describe("after section has been marked as complete", () => {

    	beforeEach(async () => {
    		await addCompletePipeworkDataToStore();
    		await renderSuspended(Pipework);
    		await user.click( screen.getByTestId("markAsCompleteButton"));
    	});

    	it("displays the 'Completed' section status indicator", async () => {
    		const completed = screen.queryByTestId("completeSectionCompleted");
    		expect(completed?.style.display).not.toBe("none");
    	});

    	it("navigates to the domestic hot water page", async () => {

    		expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water");
    	});
		
    	it("marks each pipework section as complete", async () => {

    		const { primaryPipework, secondaryPipework } =
        store.domesticHotWater.pipework;

    		expect(primaryPipework?.complete).toBe(true);
    		expect(secondaryPipework?.complete).toBe(true);
    	});

    	it("marks a pipework section as not complete if an item is removed", async () => {
  
    		await user.click(screen.getByTestId("primaryPipework_remove_0"));
    		await user.click(screen.getByTestId("secondaryPipework_remove_0"));
    		const { primaryPipework, secondaryPipework } =
			store.domesticHotWater.pipework;
		
    		expect(primaryPipework?.complete).toBe(false);
    		expect(secondaryPipework?.complete).toBe(false);
    
    	});

    	it("marks a pipework section as not complete if an item is duplicated", async () => {
    		await user.click(screen.getByTestId("primaryPipework_duplicate_0"));
    		await user.click(screen.getByTestId("secondaryPipework_duplicate_0"));
			
    		const { primaryPipework, secondaryPipework } =
			store.domesticHotWater.pipework;
		
    		expect(primaryPipework?.complete).toBe(false);
    		expect(secondaryPipework?.complete).toBe(false);
    	});

    	it("marks a pipework section as not complete after adding a new pipework item", async () => {
    		for (const pipeworkType of Object.keys(store.domesticHotWater.pipework) as PipeworkType[]) {

    			await renderSuspended(pipeworkForms[pipeworkType], {
    				route: {
    					params: { pipe: "create" },
    				},
    			});

    			await user.type(screen.getByTestId("name"), "New pipework");
    			await user.tab();
    			await user.click(screen.getByTestId("saveAndComplete"));
    			expect(store.domesticHotWater.pipework[pipeworkType].complete).toBe(false);;
    		}
    	});

    	it("marks a pipework section as not complete after editing a pipework item", async () => {
    		for (const pipeworkType of Object.keys(store.domesticHotWater.pipework) as PipeworkType[]) {

    			await renderSuspended(pipeworkForms[pipeworkType], {
    				route: {
    					params: { pipe: "0" },
    				},
    			});

    			await user.clear(screen.getByTestId("name"));
    			await user.type(screen.getByTestId("name"), "Updated pipework");
    			await user.tab();

    			expect(store.domesticHotWater.pipework[pipeworkType].complete).toBe(false);
    		}
    	});
    });
	});
});
