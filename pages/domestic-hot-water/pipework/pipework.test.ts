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

		beforeEach(async () => {
			store.$patch({
				domesticHotWater: {
					pipework: {
						primaryPipework: { data: [pipework1] },
						secondaryPipework: { data: [pipework2] },
					},
					waterHeating: {
						hotWaterCylinder: {
							data: [
								{
									name: "Cylinder 1",
									id: "4346aa5c-c8c7-41ea-99d4-a3cf5e3d21a36",
								},
							],
						},
					},
				},
			});
			await renderSuspended(Pipework);
		});

		const pipeworkForms = {
			primaryPipework: PrimaryPipeworkForm,		
			secondaryPipework: SecondaryPipeworkForm,			
		};

    type PipeworkType = keyof typeof store.domesticHotWater.pipework;

    it("marks pipework section as complete when button is clicked", async () => {
    	const completedStatusElement = screen.queryByTestId(
    		"completeSectionCompleted",
    	);
    	expect(completedStatusElement?.style.display).toBe("none");

    	await user.click(screen.getByTestId("markAsCompleteButton"));

    	const { primaryPipework, secondaryPipework } =
        store.domesticHotWater.pipework;

    	expect(primaryPipework?.complete).toBe(true);
    	expect(secondaryPipework?.complete).toBe(true);
    	expect(
    		screen.queryByTestId("markAsCompleteButton")?.style.display).toBe("none");
    	expect(completedStatusElement?.style.display).not.toBe("none");

    	expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water");
    });

    it("marks section as not complete if an item is removed after marking complete", async () => {
    
    	for (const pipework of Object.keys(store.domesticHotWater.pipework) as PipeworkType[]) {

    		await user.click(screen.getByTestId("markAsCompleteButton"));
    		expect(store.domesticHotWater.pipework[pipework]?.complete).toBe(true);

    		await user.click(screen.getByTestId(`${pipework}_remove_0`));
    		expect(store.domesticHotWater.pipework[pipework]?.complete).toBe(false);
    		expect(
    			screen.queryByTestId("markAsCompleteButton")?.style.display,
    		).not.toBe("none");
    	}
    });

    it("marks section as not complete if an item is duplicated after marking complete", async () => {

    	for (const pipework of Object.keys(store.domesticHotWater.pipework) as PipeworkType[]) {

    		await user.click(screen.getByTestId("markAsCompleteButton"));
    		expect(store.domesticHotWater.pipework[pipework]?.complete).toBe(true);

    		await user.click(screen.getByTestId(`${pipework}_duplicate_0`));
    		expect(store.domesticHotWater.pipework[pipework]?.complete).toBe(false);
    		expect(
    			screen.queryByTestId("markAsCompleteButton")?.style.display,
    		).not.toBe("none");
    	}
    });

    it("marks section as not complete after adding a new pipework item", async () => {
    	for (const pipework of Object.keys(store.domesticHotWater.pipework) as PipeworkType[]) {

    		await user.click(screen.getByTestId("markAsCompleteButton"));
    		expect(store.domesticHotWater.pipework[pipework]?.complete).toBe(true);

    		await renderSuspended(pipeworkForms[pipework], {
    			route: {
    				params: { pipe: "create" },
    			},
    		});

    		await user.type(screen.getByTestId("name"), "New pipework");
    		await user.tab();

    		await user.click(screen.getByTestId("saveAndComplete"));

    		expect(store.domesticHotWater.pipework[pipework].complete).toBe(false);

    		await renderSuspended(Pipework);
    		expect(screen.queryByTestId(
    			"markAsCompleteButton",
    		)?.style.display).not.toBe("none");
    	}
    });

    it("marks section as not complete after editing a pipework item", async () => {
    	for (const pipework of Object.keys(store.domesticHotWater.pipework) as PipeworkType[]) {

    		await user.click(screen.getByTestId("markAsCompleteButton"));
    		expect(store.domesticHotWater.pipework[pipework]?.complete).toBe(true);

    		await renderSuspended(pipeworkForms[pipework], {
    			route: {
    				params: { pipe: "0" },
    			},
    		});

    		await user.clear(screen.getByTestId("name"));
    		await user.type(screen.getByTestId("name"), "Updated pipework");
    		await user.tab();

    		await user.click(screen.getByTestId("saveAndComplete"));

    		expect(store.domesticHotWater.pipework[pipework].complete).toBe(false);

    		await renderSuspended(Pipework);
    		expect(screen.queryByTestId(
    			"markAsCompleteButton",
    		)?.style.display).not.toBe("none");
    	}
    });
	});
});
