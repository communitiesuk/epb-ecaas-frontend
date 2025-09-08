import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import Pipework from "./index.vue";
import PrimaryPipeworkForm from "./primary/[pipe].vue";
import SecondaryPipeworkForm from "./secondary/[pipe].vue";


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
			pipeContents: "water",
			hotWaterCylinder: "4346aa5c-c8c7-41ea-99d4-a3cf5e3d21a36",
			location: "internal",
		}, 
		complete: true
	};

	const pipework2: EcaasForm<Partial<SecondaryPipeworkData>> = {
		data: {
			name: "Pipework Kitchen",
			length: 3,
			location: "internal",
			internalDiameter: 9
		},
		complete: true
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
							data: [pipework1]
						}
					}
				}
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
							data: [pipework1, pipework2]
						}
					}
				}
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
							data: [pipework1]
						}
					}
				}
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
							data: [pipework1, pipework2]
						}
					}
				}
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

	
		const addPipeworkDataToStore = async () => {
			store.$patch({
				domesticHotWater: {
					pipework: {
						primaryPipework: { data: [pipework1] },
						secondaryPipework: { data: [pipework2] },
					},
					waterHeating:{
						hotWaterCylinder: { data: [{ name: "Cylinder 1", id: "4346aa5c-c8c7-41ea-99d4-a3cf5e3d21a36" }] }
					}
				},
					
			});
		};
	
		beforeEach(async () => {
			await addPipeworkDataToStore();
			await renderSuspended(Pipework);
		});
	
		const getPipeworkData = async (action: string) => {
			return [
				{
					key: "primaryPipework",
					testId: `primaryPipework_${action}_0`,
					form: PrimaryPipeworkForm,
				},
				{
					key: "secondaryPipework",
					testId: `secondaryPipework_${action}_0`,
					form: SecondaryPipeworkForm,
				},
			];
		};
	
			type PipeworkType = keyof typeof store.domesticHotWater.pipework;
	
			it("marks pipework section as complete when button is clicked", async () => {
				expect(
					screen.getByRole("button", { name: "Mark section as complete" })
				).not.toBeNull();
				const completedStatusElement = screen.queryByTestId("completeSectionCompleted");
				expect(completedStatusElement?.style.display).toBe("none");
	
				await user.click(screen.getByTestId("completeSectionButton"));
	
				const { primaryPipework, secondaryPipework } = store.domesticHotWater.pipework;
	
				expect(primaryPipework?.complete).toBe(true);
				expect(secondaryPipework?.complete).toBe(true);
				expect(
					screen.queryByRole("button", { name: "Mark section as complete" })
				).toBeNull();
				expect(completedStatusElement?.style.display).not.toBe("none");
	
				expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water");
			});
	
			it("marks as not complete if an item is removed after marking complete", async () => {
				const pipeworkData = await getPipeworkData("remove");
	
				for (const [key] of Object.entries(store.domesticHotWater.pipework)) {
					const typedKey = key as PipeworkType;
	
					await user.click(screen.getByTestId("completeSectionButton"));
					expect(store.domesticHotWater.pipework[typedKey]?.complete).toBe(true);
	
					const pipeworkItem = pipeworkData.find((e) => e.key === typedKey);
					await user.click(screen.getByTestId(pipeworkItem!.testId));
					expect(store.domesticHotWater.pipework[typedKey]?.complete).toBe(false);
					expect(
						screen.getByRole("button", { name: "Mark section as complete" })
					).not.toBeNull();
				}
			});
	
			it("marks as not complete if an item is duplicated after marking complete", async () => {
				const pipeworkData = await getPipeworkData("duplicate");
	
				for (const [key] of Object.entries(store.domesticHotWater.pipework)) {
					const typedKey = key as PipeworkType;
	
					await user.click(screen.getByTestId("completeSectionButton"));
					expect(store.domesticHotWater.pipework[typedKey]?.complete).toBe(true);
	
					const pipeworkItem = pipeworkData.find((e) => e.key === typedKey);
					await user.click(screen.getByTestId(pipeworkItem!.testId));
					expect(store.domesticHotWater.pipework[typedKey]?.complete).toBe(false);
					expect(
						screen.getByRole("button", { name: "Mark section as complete" })
					).not.toBeNull();
				}
			});
	
			it("marks as not complete after saving a new or edited pipework item", async () => {
				for (const [key] of Object.entries(store.domesticHotWater.pipework)) {
					const pipeworkData = await getPipeworkData("");
					const typedKey = key as PipeworkType;
	
					await user.click(screen.getByTestId("completeSectionButton"));
					expect(store.domesticHotWater.pipework[typedKey]?.complete).toBe(true);
	
					const pipeworkItem = pipeworkData.find((e) => e.key === typedKey);

					await renderSuspended(pipeworkItem?.form, {
						route: {
							params: { pipe: "0" },
						},
					});
				 
					await(user.click(screen.getByRole("button", { name: "Save and mark as complete" })));

					expect(store.domesticHotWater.pipework[typedKey].complete).toBe(false);
	
					await renderSuspended(Pipework);
					expect(
						screen.getByRole("button", { name: "Mark section as complete" })
					).not.toBeNull();
				}
			});
	});
});
