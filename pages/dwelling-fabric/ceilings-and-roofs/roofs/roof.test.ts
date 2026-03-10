import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import Roof from "./[roof].vue";
import { v4 as uuidv4 } from "uuid";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

vi.mock("uuid");

describe("roof", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const roof: EcaasForm<RoofData> = {
		data: {
			id: "ec8e8ec6-0fcb-43dc-81e0-9e2e9afb9e20",
			name: "Roof 1",
			typeOfRoof: "flat",
			pitchOption: "0",
			pitch: 0,
			length: 1,
			width: 1,
			elevationalHeightOfElement: 2,
			surfaceArea: 1,
			thermalResistance: 1,
			colour: "Light",
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
		},
	};
	const pitchedRoof: EcaasForm<RoofData> = {
		data: {
			id: "ec8e8ec6-0fcb-43dc-81e0-9e2e9afb9e20",
			name: "Roof 1",
			typeOfRoof: "pitchedInsulatedAtRoof",
			pitch: 30,
			orientation: 90,
			length: 1,
			width: 1,
			elevationalHeightOfElement: 2,
			surfaceArea: 1,
			thermalResistance: 1,
			colour: "Light",
			arealHeatCapacity: "Very light",
			massDistributionClass: "I",
		},
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Roof 1");
		await user.click(screen.getByTestId("typeOfRoof_flat"));
		await user.click(screen.getByTestId("pitchOption_0"));
		await user.type(screen.getByTestId("length"), "1");
		await user.type(screen.getByTestId("width"), "1");
		await user.type(screen.getByTestId("elevationalHeightOfElement"), "2");
		await user.type(screen.getByTestId("surfaceArea"), "1");
		await user.type(screen.getByTestId("thermalResistance"), "1");
		await user.click(screen.getByTestId("colour_Light"));
		await user.click(screen.getByTestId("arealHeatCapacity_Very_light"));
		await user.click(screen.getByTestId("massDistributionClass_I"));
	};

	test("data is saved to store state when form is valid", async () => {
		vi.mocked(uuidv4).mockReturnValue(roof.data.id as unknown as Buffer);

		await renderSuspended(Roof, {
			route: {
				params: { roof: "create" },
			},
		});

		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { dwellingSpaceRoofs } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

		expect(dwellingSpaceRoofs.data[0]).toEqual({ ...roof, complete: true });
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceCeilingsAndRoofs: {
					dwellingSpaceRoofs: {
						data: [roof],
					},
				},
			},
		});

		await renderSuspended(Roof, {
			route: {
				params: { roof: "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Roof 1");
		expect((await screen.findByTestId("typeOfRoof_flat")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("pitchOption_0")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId<HTMLInputElement>("length")).value).toBe("1");
		expect((await screen.findByTestId<HTMLInputElement>("width")).value).toBe("1");
		expect((await screen.findByTestId<HTMLInputElement>("elevationalHeightOfElement")).value).toBe("2");
		expect((await screen.findByTestId<HTMLInputElement>("surfaceArea")).value).toBe("1");
		expect((await screen.findByTestId<HTMLInputElement>("thermalResistance")).value).toBe("1");
		expect((await screen.findByTestId("arealHeatCapacity_Very_light")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("massDistributionClass_I")).hasAttribute("checked")).toBe(true);
	});

	test("form is prepopulted with pitched roof data when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceCeilingsAndRoofs: {
					dwellingSpaceRoofs: {
						data: [pitchedRoof],
					},
				},
			},
		});

		await renderSuspended(Roof, {
			route: {
				params: { roof: "0" },
			},
		});

		expect((await screen.findByTestId("typeOfRoof_pitchedInsulatedAtRoof")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId<HTMLInputElement>("pitch")).value).toBe("30");
		expect((await screen.findByTestId<HTMLInputElement>("orientation")).value).toBe("90");
		expect((await screen.findByTestId<HTMLInputElement>("thermalResistance")).value).toBe("1");
		expect(screen.queryByTestId("uValue")).toBeNull();
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(Roof);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("typeOfRoof_error"))).toBeDefined();
		expect((await screen.findByTestId("length_error"))).toBeDefined();
		expect((await screen.findByTestId("width_error"))).toBeDefined();
		expect((await screen.findByTestId("elevationalHeightOfElement_error"))).toBeDefined();
		expect((await screen.findByTestId("surfaceArea_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(Roof);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("roofErrorSummary"))).toBeDefined();
	});

	it("requires pitch option when type of roof is flat", async () => {
		await renderSuspended(Roof);
		await user.click(screen.getByTestId("typeOfRoof_flat"));
		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("pitchOption_error"))).toBeDefined();
	});

	it("requires pitch when custom pitch option is selected", async () => {
		await renderSuspended(Roof);

		await user.click(screen.getByTestId("typeOfRoof_flat"));
		await user.click(screen.getByTestId("pitchOption_custom"));
		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("pitch_error"))).toBeDefined();
	});

	it("saves custom pitch when custom pitch option is selected", async () => {
		await renderSuspended(Roof, {
			route: {
				params: { roof: "create" },
			},
		});

		await populateValidForm();
		await user.click(screen.getByTestId("pitchOption_custom"));
		await user.type(screen.getByTestId("pitch"), "90");
		await user.tab();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { dwellingSpaceRoofs } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

		expect(dwellingSpaceRoofs.data[0]!.data.pitch).toEqual(90);
	});

	it("requires additional fields when type of roof is pitched", async () => {
		await renderSuspended(Roof);
		await user.click(screen.getByTestId("typeOfRoof_pitchedInsulatedAtRoof"));
		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("pitch_error"))).toBeDefined();
		expect((await screen.findByTestId("orientation_error"))).toBeDefined();
		expect((await screen.findByTestId("thermalResistance_error"))).toBeDefined();
		expect((await screen.findByTestId("arealHeatCapacity_error"))).toBeDefined();
		expect((await screen.findByTestId("massDistributionClass_error"))).toBeDefined();
	});

	it("saves additional fields when type of roof is pitched", async () => {
		await renderSuspended(Roof, {
			route: {
				params: { roof: "create" },
			},
		});

		await populateValidForm();
		await user.click(screen.getByTestId("typeOfRoof_pitchedInsulatedAtRoof"));
		await user.type(screen.getByTestId("pitch"), "90");
		await user.type(screen.getByTestId("orientation"), "90");
		await user.type(screen.getByTestId("thermalResistance"), "1");
		await user.tab();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { dwellingSpaceRoofs } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

		expect(dwellingSpaceRoofs.data[0]!.data.pitch).toEqual(90);
		expect(dwellingSpaceRoofs.data[0]!.data.orientation).toEqual(90);
	});


	it.each(["0", "180"])("if a roof is tagged to a front door and its pitch is updated to %s the door is updated to a regular door that is not complete", async (pitch) => {
	
		const roof: Partial<RoofData> = {
			id: "ec8e8ec6-0fcb-43dc-81e0-9e2e9afb9e20",
			name: "Roof 1",
			typeOfRoof: "pitchedInsulatedAtCeiling",
			pitch: 30,
		};
	
		const unglazedDoor: Partial<ExternalUnglazedDoorData> = {
			name: "External unglazed door 1",
			associatedItemId: roof.id,
			isTheFrontDoor: true,
		};
	
		const glazedDoor: Partial<ExternalGlazedDoorData> = {
			name: "External glazed door 1",
			associatedItemId: roof.id,
			isTheFrontDoor: true,
		};
	
		store.$patch({
			dwellingFabric: {
				dwellingSpaceCeilingsAndRoofs: {
					dwellingSpaceRoofs: {
						data: [{ data: roof }],
					},
				},
				dwellingSpaceDoors: {
					dwellingSpaceExternalUnglazedDoor: {
						data: [{ data: unglazedDoor, complete: true }],
					},
					dwellingSpaceExternalGlazedDoor: {
						data: [{ data: glazedDoor, complete: true }],
					},
				}, 
			},
		});
				
		await renderSuspended(Roof, {
			route: {
				params: { roof: "0" },
			},
		});
								
		await user.clear(screen.getByTestId("pitch"));
		await user.type(screen.getByTestId("pitch"), pitch);
		await user.tab();
		const { dwellingSpaceExternalGlazedDoor, dwellingSpaceExternalUnglazedDoor } = store.dwellingFabric.dwellingSpaceDoors;
	
		expect(dwellingSpaceExternalGlazedDoor.data[0]?.complete).toBeFalsy();
		expect(dwellingSpaceExternalGlazedDoor.data[0]?.data.isTheFrontDoor).toBeUndefined();
	
		expect(dwellingSpaceExternalUnglazedDoor.data[0]?.complete).toBeFalsy();
		expect(dwellingSpaceExternalUnglazedDoor.data[0]?.data.isTheFrontDoor).toBeUndefined();
	});

	it("navigates to ceilings and roofs page when valid form is completed", async () => {
		await renderSuspended(Roof);

		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/ceilings-and-roofs");
	});

	it("navigates to ceilings and roofs page when save progress button is clicked", async () => {
		await renderSuspended(Roof);

		await user.type(screen.getByTestId("name"), "Test roof");
		await user.click(screen.getByTestId("saveProgress"));

		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/ceilings-and-roofs");
	});

	test("roof and roofs section are set as 'not complete' after user edits an item", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceCeilingsAndRoofs: {
					dwellingSpaceRoofs: {
						data: [{ ...roof, complete: true }],
						complete: true,
					},
				},
			},
		});

		await renderSuspended(Roof, {
			route: {
				params: { roof: "0" },
			},
		});

		await user.type(screen.getByTestId("name"), "Roof");
		await user.tab();

		const roofs = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs;

		expect(roofs.data[0]!.complete).not.toBe(true);
		expect(roofs.complete).not.toBe(true);
	});
});