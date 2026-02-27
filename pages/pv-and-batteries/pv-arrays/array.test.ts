import { screen } from "@testing-library/vue";
import PVScreen from "./[array].vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

const store = useEcaasStore();
const user = userEvent.setup();
afterEach(() => {
	store.$reset();
});

const populateValidForm = async ({ hasShading = false } = {}) => {
	await user.type(screen.getByTestId("name"), "PV 1");
	await user.type(screen.getByTestId("peakPower"), "4");
	await user.click(screen.getByTestId("ventilationStrategy_unventilated"));
	await user.type(screen.getByTestId("pitch"), "45");
	await user.type(screen.getByTestId("orientation"), "20");
	await user.type(screen.getByTestId("elevationalHeight"), "100");
	await user.type(screen.getByTestId("lengthOfPV"), "20");
	await user.type(screen.getByTestId("widthOfPV"), "20");
	await user.type(screen.getByTestId("inverterPeakPowerAC"), "4");
	await user.type(screen.getByTestId("inverterPeakPowerDC"), "5");
	await user.click(screen.getByTestId("locationOfInverter_heated_space"));
	await user.click(screen.getByTestId("canExportToGrid_yes"));
	await user.click(screen.getByTestId("electricityPriority_electricBattery"));
	await user.click(screen.getByTestId("inverterType_optimised_inverter"));
	await user.click(screen.getByTestId(`hasShading_${hasShading ? "yes" : "no"}`));
};
describe("PV array", () => {
	const pvArray: EcaasForm<PvArrayData> = {
		data: {
			name: "PV 1",
			peakPower: 4,
			ventilationStrategy: "unventilated",
			pitch: 45,
			orientation: 20,
			elevationalHeight: 100,
			lengthOfPV: 20,
			widthOfPV: 20,
			inverterPeakPowerAC: 4,
			inverterPeakPowerDC: 5,
			locationOfInverter: "heated_space",
			canExportToGrid: true,
			electricityPriority: "electricBattery",
			inverterType: "optimised_inverter",
			hasShading: false,
		},
	};

	const pvArray2: EcaasForm<PvArrayData> = {
		data: { ...pvArray.data, name: "PV 2" },
	};

	it("should have a heading", async () => {
		await renderSuspended(PVScreen);
		expect(
			screen.getByRole("heading", { name: "PV array" }),
		).toBeDefined();
	});

	it("should have the following inputs", async () => {
		await renderSuspended(PVScreen);
		expect(screen.getByText("Name")).toBeDefined();
		expect(screen.getByText("Peak power")).toBeDefined();
		expect(screen.getAllByText("Ventilation strategy")).toBeDefined();
		expect(screen.getByText("Pitch")).toBeDefined();
		expect(screen.getByText("Orientation")).toBeDefined();
		expect(screen.getByText("Elevational height of PV array at its base")).toBeDefined();
		expect(screen.getByText("Length of PV array")).toBeDefined();
		expect(screen.getByText("Width of PV array")).toBeDefined();
		expect(screen.getByText("Inverter peak power AC")).toBeDefined();
		expect(screen.getByText("Inverter peak power DC")).toBeDefined();
		expect(screen.getByText("Location of inverter")).toBeDefined();
		expect(screen.getByLabelText("Heated space")).toBeDefined();
		expect(screen.getByLabelText("Unheated space")).toBeDefined();
		expect(screen.getByText("Can the electricity be exported to the grid?")).toBeDefined();
		expect(screen.getAllByLabelText("Yes")).toBeDefined();
		expect(screen.getAllByLabelText("No")).toBeDefined();
		expect(screen.getByText("What is the priority for generated electricity?")).toBeDefined();
		expect(screen.getByLabelText("Diverter")).toBeDefined();
		expect(screen.getByLabelText("Electric battery")).toBeDefined();
		expect(screen.getByText("Inverter type", { selector: "legend" })).toBeDefined();
		expect(screen.queryByText("PV shading")).toBeNull();
	});

	it("should error when user submits an empty form", async () => {
		await renderSuspended(PVScreen, {
			route: {
				params: { array: "create" },
			},
		});
		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("peakPower_error"))).toBeDefined();
		expect((await screen.findByTestId("ventilationStrategy_error"))).toBeDefined();
		expect((await screen.findByTestId("pitch_error"))).toBeDefined();
		expect((await screen.findByTestId("orientation_error"))).toBeDefined();
		expect((await screen.findByTestId("elevationalHeight_error"))).toBeDefined();
		expect((await screen.findByTestId("lengthOfPV_error"))).toBeDefined();
		expect((await screen.findByTestId("widthOfPV_error"))).toBeDefined();
		expect((await screen.findByTestId("inverterPeakPowerAC_error"))).toBeDefined();
		expect((await screen.findByTestId("inverterPeakPowerDC_error"))).toBeDefined();
		expect((await screen.findByTestId("locationOfInverter_error"))).toBeDefined();
		expect((await screen.findByTestId("canExportToGrid_error"))).toBeDefined();
		expect((await screen.findByTestId("electricityPriority_error"))).toBeDefined();
		expect((await screen.findByTestId("inverterType_error"))).toBeDefined();

		expect((await screen.findByTestId("photovoltaicErrorSummary"))).toBeDefined();
	});

	it("data is saved to store when form is valid", async () => {
		await renderSuspended(PVScreen, {
			route: {
				params: { array: "create" },
			},
		});
		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.pvAndBatteries.pvArrays;

		expect(data[0]).toEqual({ ...pvArray, complete: true });
	});

	it("navigates to pv and batteries page when valid form is completed", async () => {
		await renderSuspended(PVScreen);
		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));
		expect(navigateToMock).toHaveBeenCalledWith("/pv-and-batteries");
	});

	it("navigates to pv and batteries page when save progress button is clicked", async () => {
		await renderSuspended(PVScreen);

		await user.type(screen.getByTestId("name"), "Test PV");
		await user.click(screen.getByTestId("saveProgress"));
		expect(navigateToMock).toHaveBeenCalledWith("/pv-and-batteries");
	});

	describe("partially saving data", () => {
		it("creates a new pv system automatically with given name", async () => {
			await renderSuspended(PVScreen, {
				route: {
					params: { array: "create" },
				},
			});

			await user.type(screen.getByTestId("name"), "New pv system");
			await user.tab();

			const actualPvSystem = store.pvAndBatteries.pvArrays.data[0]!;
			expect(actualPvSystem.data.name).toBe("New pv system");
			expect(actualPvSystem.data.peakPower).toBeUndefined();
			expect(actualPvSystem.data.inverterType).toBeUndefined();
		});

		it("creates a new pv system automatically with default name after other data is entered", async () => {
			await renderSuspended(PVScreen, {
				route: {
					params: { array: "create" },
				},
			});

			await user.type(screen.getByTestId("elevationalHeight"), "7");
			await user.tab();

			const actualPvArray = store.pvAndBatteries.pvArrays.data[0]!;
			expect(actualPvArray.data.name).toBe("PV array");
			expect(actualPvArray.data.peakPower).toBeUndefined();
			expect(actualPvArray.data.inverterType).toBeUndefined();
			expect(actualPvArray.data.elevationalHeight).toBe(7);
		});

		it("saves updated form data to correct store object automatically", async () => {
			store.$patch({
				pvAndBatteries: {
					pvArrays: {
						data: [pvArray, pvArray2],
					},
				},
			});

			await renderSuspended(PVScreen, {
				route: {
					params: { array: "1" },
				},
			});

			await user.clear(screen.getByTestId("name"));
			await user.tab();
			await user.clear(screen.getByTestId("peakPower"));
			await user.tab();

			await user.type(screen.getByTestId("name"), "Updated PV 2");
			await user.type(screen.getByTestId("peakPower"), "22");
			await user.tab();

			const actualPvSystem = store.pvAndBatteries.pvArrays.data[1]!;
			expect(actualPvSystem.data.name).toBe("Updated PV 2");
			expect(actualPvSystem.data.peakPower).toBe(22);
		});

		test("pv system and pv systems section are set as 'not complete' after user edits an item", async () => {
			store.$patch({
				pvAndBatteries: {
					pvArrays: {
						data: [{ ...pvArray, complete: true }],
						complete: true,
					},
				},
			});

			await renderSuspended(PVScreen, {
				route: {
					params: { array: "0" },
				},
			});

			await user.type(screen.getByTestId("name"), "PV system");
			await user.tab();

			const pvArrays = store.pvAndBatteries.pvArrays;

			expect(pvArrays.data[0]!.complete).not.toBe(true);
			expect(pvArrays.complete).not.toBe(true);
		});
	});
});

describe("PV shading section", () => {
	const pvArrayBaseFields = {
		name: "PV 1",
		peakPower: 4,
		ventilationStrategy: "unventilated" as const,
		pitch: 45,
		orientation: 20,
		elevationalHeight: 100,
		lengthOfPV: 20,
		widthOfPV: 20,
		inverterPeakPowerAC: 4,
		inverterPeakPowerDC: 5,
		locationOfInverter: "heated_space" as const,
		canExportToGrid: true,
		electricityPriority: "electricBattery" as const,
		inverterType: "optimised_inverter" as const,
	};

	// helper that adds a shading object so we can work with it below
	const saveFirstShadingObject = async (name = "Chimney") => {
		await user.click(screen.getByTestId("hasShading_yes"));
		await user.type(screen.getByTestId(`shadingName`), name);
		await user.click(screen.getByTestId("typeOfShading_obstacle"));
		await user.type(screen.getByTestId("height"), "3");
		await user.type(screen.getByTestId("distance"), "2");
		await user.type(screen.getByTestId("transparency"), "0.5");
		await user.tab();
		await user.click(screen.getByTestId("saveShadingObject"));
	};

	it("initial add form has no cancel button", async () => {
		await renderSuspended(PVScreen);
		await user.click(screen.getByTestId("hasShading_yes"));
		expect(screen.getByTestId("shading-add-form")).toBeDefined();
		expect(screen.queryByTestId("cancelShadingObject")).toBeNull();
	});

	const pvArrayWithShading: EcaasForm<PvArrayData> = {
		complete: true,
		data: {
			...pvArrayBaseFields,
			hasShading: true,
			shading: [
				{
					name: "Chimney",
					typeOfShading: "obstacle",
					height: 3,
					distance: 2,
					transparency: 0.5,
				},
			],
		},
	};

	const pvArrayWithTwoShadingItems: EcaasForm<PvArrayData> = {
		complete: true,
		data: {
			...pvArrayBaseFields,
			hasShading: true,
			shading: [
				{
					name: "Chimney",
					typeOfShading: "obstacle",
					height: 3,
					distance: 2,
					transparency: 0.5,
				},
				{
					name: "Left fin",
					typeOfShading: "left_side_fin",
					depth: 1,
					distance: 0.5,
				},
			],
		},
	};

	it("should not render by default", async () => {
		await renderSuspended(PVScreen);
		expect(screen.queryByTestId("pv-shading-section")).toBeNull();
	});

	it("should render when user selects that the array has shading", async () => {
		await renderSuspended(PVScreen);
		await user.click(screen.getByTestId("hasShading_yes"));
		expect(screen.getByTestId("pv-shading-section")).toBeDefined();
	});

	it("errors on outer submit if shading is yes but no object added", async () => {
		await renderSuspended(PVScreen, {
			route: { params: { array: "create" } },
		});
		await user.click(screen.getByTestId("hasShading_yes"));
		await user.click(screen.getByTestId("saveAndComplete"));
		expect(screen.getByTestId("shadingName_error")).toBeDefined();

		expect(screen.queryByTestId("cancelShadingObject")).toBeNull();
	});

	it("hides the shading section when hasShading is changed back to no", async () => {
		await renderSuspended(PVScreen);
		await user.click(screen.getByTestId("hasShading_yes"));
		await user.click(screen.getByTestId("hasShading_no"));
		expect(screen.queryByTestId("pv-shading-section")).toBeNull();
	});

	describe("type-conditional fields", () => {
		beforeEach(async () => {
			await renderSuspended(PVScreen);
			await user.click(screen.getByTestId("hasShading_yes"));
		});

		it("shows height, distance and transparency when obstacle type is selected", async () => {
			await user.click(screen.getByTestId("typeOfShading_obstacle"));
			expect(screen.getByTestId("height")).toBeDefined();
			expect(screen.getByTestId("distance")).toBeDefined();
			expect(screen.getByTestId("transparency")).toBeDefined();
			expect(screen.queryByTestId("depth")).toBeNull();
		});

		it.each(["left_side_fin", "right_side_fin", "overhang", "frame_or_reveal"])(
			"shows depth and distance fields for %s type",
			async (type) => {
				await user.click(screen.getByTestId(`typeOfShading_${type}`));
				expect(screen.getByTestId("depth")).toBeDefined();
				expect(screen.getByTestId("distance")).toBeDefined();
				expect(screen.queryByTestId("height")).toBeNull();
				expect(screen.queryByTestId("transparency")).toBeNull();
			},
		);

		it("hides conditional fields when no type is selected", async () => {
			expect(screen.queryByTestId("height")).toBeNull();
			expect(screen.queryByTestId("depth")).toBeNull();
		});
	});

	describe("saving a shading object", () => {
		it("collapses the add form into a summary card with the name as title after saving an obstacle", async () => {
			await renderSuspended(PVScreen);
			await saveFirstShadingObject("Chimney");
			expect(screen.queryByTestId("shading-add-form")).toBeNull();
			expect(screen.getByTestId("shading_summary_0")).toBeDefined();
			expect(screen.getByText("Chimney")).toBeDefined();
		});

		it("collapses the add form into a summary card after saving a fin/overhang/frame type", async () => {
			await renderSuspended(PVScreen);
			await user.click(screen.getByTestId("hasShading_yes"));
			await user.type(screen.getByTestId("shadingName"), "Left fin");
			await user.click(screen.getByTestId("typeOfShading_left_side_fin"));
			await user.type(screen.getByTestId("depth"), "1");
			await user.type(screen.getByTestId("distance"), "0.5");
			await user.tab();
			await user.click(screen.getByTestId("saveShadingObject"));
			expect(screen.queryByTestId("shading-add-form")).toBeNull();
			expect(screen.getByTestId("shading_summary_0")).toBeDefined();
			expect(screen.getByText("Left fin")).toBeDefined();
		});

		it("shows an 'Add another shading object' button after the first item is saved", async () => {
			await renderSuspended(PVScreen);
			await saveFirstShadingObject();
			expect(screen.getByTestId("addAnotherShadingObject")).toBeDefined();
		});

		it("saves the shading object to the store", async () => {
			store.$patch({
				pvAndBatteries: {
					pvArrays: {
						data: [{ data: { name: "PV 1", hasShading: true, shading: [] } }],
					},
				},
			});
			await renderSuspended(PVScreen, {
				route: { params: { array: "0" } },
			});
			await populateValidForm({ hasShading: true });
			await user.type(screen.getByTestId("shadingName"), "Chimney");
			await user.click(screen.getByTestId("typeOfShading_obstacle"));
			await user.type(screen.getByTestId("height"), "3");
			await user.type(screen.getByTestId("distance"), "2");
			await user.type(screen.getByTestId("transparency"), "0.5");
			await user.tab();
			await user.click(screen.getByTestId("saveShadingObject"));

			const pvArray = store.pvAndBatteries.pvArrays.data[0]!;
			expect(pvArray.data.hasShading).toBe(true);
			const { shading } = pvArray.data as Extract<PvArrayData, { hasShading: true }>;
			expect(shading).toHaveLength(1);
			expect(shading[0]).toMatchObject({
				name: "Chimney",
				typeOfShading: "obstacle",
				height: 3,
				distance: 2,
				transparency: 0.5,
			});
		});

		it("displays existing shading items when opening a pre-populated array", async () => {
			store.$patch({
				pvAndBatteries: { pvArrays: { data: [pvArrayWithShading] } },
			});
			await renderSuspended(PVScreen, {
				route: { params: { array: "0" } },
			});
			expect(screen.getByTestId("shading_summary_0")).toBeDefined();
			expect(screen.getByText("Chimney")).toBeDefined();
		});
		it("shows errors when fields are invalid in edit form", async () => {
			store.$patch({
				pvAndBatteries: { pvArrays: { data: [pvArrayWithShading] } },
			});
			await renderSuspended(PVScreen, {
				route: { params: { array: "create" } },
			});
			await populateValidForm({ hasShading: true });

			await user.click(screen.getByTestId("typeOfShading_obstacle"));

			await user.click(screen.getByTestId("saveShadingObject"));
			expect(screen.getByTestId("shadingName_error")).toBeDefined();
			expect(screen.getByTestId("height_error")).toBeDefined();
			expect(screen.getByTestId("distance_error")).toBeDefined();
			expect(screen.getByTestId("transparency_error")).toBeDefined();
		});
	});

	describe("add another shading object", () => {
		it("opens a new add form with a cancel button when 'Add another' is clicked", async () => {
			await renderSuspended(PVScreen);
			await saveFirstShadingObject();
			await user.click(screen.getByTestId("addAnotherShadingObject"));
			expect(screen.getByTestId("shading-add-form")).toBeDefined();
			expect(screen.getByTestId("cancelShadingObject")).toBeDefined();
		});

		it("closes the new add form without removing saved items when cancel is clicked", async () => {
			await renderSuspended(PVScreen);
			await saveFirstShadingObject("Chimney");
			await user.click(screen.getByTestId("addAnotherShadingObject"));
			await user.click(screen.getByTestId("cancelShadingObject"));
			expect(screen.queryByTestId("shading-add-form")).toBeNull();
			expect(screen.getByTestId("shading_summary_0")).toBeDefined();
		});

		it("saves a second shading object after clicking add another", async () => {
			await renderSuspended(PVScreen);
			await saveFirstShadingObject("Chimney");
			await user.click(screen.getByTestId("addAnotherShadingObject"));
			await user.type(screen.getByTestId("shadingName"), "Left fin");
			await user.click(screen.getByTestId("typeOfShading_left_side_fin"));
			await user.type(screen.getByTestId("depth"), "1");
			await user.type(screen.getByTestId("distance"), "0.5");
			await user.tab();
			await user.click(screen.getByTestId("saveShadingObject"));
			expect(screen.getByTestId("shading_summary_0")).toBeDefined();
			expect(screen.getByTestId("shading_summary_1")).toBeDefined();
			expect(screen.queryByTestId("shading-add-form")).toBeNull();
		});
	});

	describe("editing a shading object", () => {
		it("opens an edit form with 'Edit shading' title when edit is clicked", async () => {
			store.$patch({
				pvAndBatteries: { pvArrays: { data: [pvArrayWithShading] } },
			});
			await renderSuspended(PVScreen, {
				route: { params: { array: "0" } },
			});
			await user.click(screen.getByTestId("shading_edit_0"));
			expect(screen.getByText("Edit shading")).toBeDefined();
			expect(screen.getByTestId("shading-add-form")).toBeDefined();
		});

		it("prepopulates the edit form with the existing shading data", async () => {
			store.$patch({
				pvAndBatteries: { pvArrays: { data: [pvArrayWithShading] } },
			});
			await renderSuspended(PVScreen, {
				route: { params: { array: "0" } },
			});
			await user.click(screen.getByTestId("shading_edit_0"));
			expect((screen.getByTestId<HTMLInputElement>("shadingName")).value).toBe("Chimney");
			expect((screen.getByTestId<HTMLInputElement>("typeOfShading_obstacle")).checked).toBe(true);
			expect((screen.getByTestId<HTMLInputElement>("height")).value).toBe("3");
			expect((screen.getByTestId<HTMLInputElement>("distance")).value).toBe("2");
			expect((screen.getByTestId<HTMLInputElement>("transparency")).value).toBe("0.5");
		});

		it("updates the summary card when the edited item is saved", async () => {
			store.$patch({
				pvAndBatteries: { pvArrays: { data: [pvArrayWithShading] } },
			});
			await renderSuspended(PVScreen, {
				route: { params: { array: "0" } },
			});
			await user.click(screen.getByTestId("shading_edit_0"));
			await user.clear(screen.getByTestId("shadingName"));
			await user.type(screen.getByTestId("shadingName"), "Big Chimney");
			await user.click(screen.getByTestId("saveShadingObject"));
			expect(screen.queryByTestId("shading-add-form")).toBeNull();
			expect(screen.getByTestId("shading_summary_0")).toBeDefined();
			expect(screen.getByText("Chimney")).toBeDefined();
		});
	});

	describe("removing a shading object", () => {
		it("removes the item and opens a new empty add form when it is the only item", async () => {
			store.$patch({
				pvAndBatteries: { pvArrays: { data: [pvArrayWithShading] } },
			});
			await renderSuspended(PVScreen, {
				route: { params: { array: "0" } },
			});
			await user.click(screen.getByTestId("shading_remove_0"));
			expect(screen.queryByTestId("shading_summary_0")).toBeNull();
			expect(screen.getByTestId("shading-add-form")).toBeDefined();
			expect(screen.queryByTestId("cancelShadingObject")).toBeNull();
		});

		it("removes only the targeted item when other items exist", async () => {
			store.$patch({
				pvAndBatteries: { pvArrays: { data: [pvArrayWithTwoShadingItems] } },
			});
			await renderSuspended(PVScreen, {
				route: { params: { array: "0" } },
			});
			await user.click(screen.getByTestId("shading_remove_0"));
			expect(screen.queryByTestId("shading-add-form")).toBeNull();
			expect(screen.getByTestId("shading_summary_0")).toBeDefined();
			expect(screen.getByText("Left fin")).toBeDefined();
			expect(screen.queryByText("Chimney")).toBeNull();
		});
	});

});
