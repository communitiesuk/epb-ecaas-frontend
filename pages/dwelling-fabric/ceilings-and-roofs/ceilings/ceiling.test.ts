import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import Ceiling from "./[ceiling].vue";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("ceiling", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const internalFloor: EcaasForm<CeilingData> = {
		data: {
			type: AdjacentSpaceType.heatedSpace,
			name: "Ceiling 1",
			surfaceArea: 5,
			kappaValue: 50000,
			massDistributionClass: "I",
			pitchOption: "0",
			pitch: 0 }
	};

	const internalFloorWithUnheated: EcaasForm<CeilingData> = {
		data: {
			...internalFloor.data,
			type: AdjacentSpaceType.unheatedSpace,
			uValue: 1,
			thermalResistanceOfAdjacentUnheatedSpace: 0
		}
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Ceiling 1");
		await user.type(screen.getByTestId("surfaceArea"), "5");
		await user.click(screen.getByTestId("kappaValue_50000"));
		await user.click(screen.getByTestId("massDistributionClass_I"));
		await user.click(screen.getByTestId("pitchOption_0"));
	};

	const populateValidFormUnheated = async () => {
		await populateValidForm();
		await user.type(screen.getByTestId("uValue"), "1");
	};
	
	describe("when type of ceiling is heated space", () => {
		it("data is saved to store state when form is valid", async () => {
			await renderSuspended(Ceiling, {
				route: {
					params: { ceiling: "create" },
				},
			});
	
			await user.click(screen.getByTestId("type_heatedSpace"));
			await populateValidForm();
			await user.click(screen.getByTestId("saveAndComplete"));

			const { dwellingSpaceCeilings } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
			
			expect(dwellingSpaceCeilings.data[0]).toEqual({ ...internalFloor, complete: true });
		});
	
		it("form is prepopulated when data exists in state", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: {
							data: [internalFloor]
						}
					}
				}
			});
	
			await renderSuspended(Ceiling, {
				route: {
					params: { ceiling: "0" }
				}
			});
	
			expect((await screen.findByTestId("type_heatedSpace")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Ceiling 1");
			expect((await screen.findByTestId<HTMLInputElement>("surfaceArea")).value).toBe("5");
			expect((await screen.findByTestId("kappaValue_50000")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId("massDistributionClass_I")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId("pitchOption_0")).hasAttribute("checked")).toBe(true);
		});

		it("requires additional fields when heated space is selected", async () => {
			await renderSuspended(Ceiling);
	
			await user.click(screen.getByTestId("type_heatedSpace"));
			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("name_error"))).toBeDefined();
			expect((await screen.findByTestId("surfaceArea_error"))).toBeDefined();
			expect((await screen.findByTestId("kappaValue_error"))).toBeDefined();
			expect((await screen.findByTestId("massDistributionClass_error"))).toBeDefined();
			expect((await screen.findByTestId("pitchOption_error"))).toBeDefined();
		});
	});
	
	describe("when type of ceiling is unheated space", () => {
		it("data is saved to store state when form is valid", async () => {
			await renderSuspended(Ceiling, {
				route: {
					params: { ceiling: "create" },
				},
			});
	
			await user.click(screen.getByTestId("type_unheatedSpace"));
			await populateValidFormUnheated();
			await user.type(screen.getByTestId("thermalResistanceOfAdjacentUnheatedSpace"), "0");
			await user.tab();
			await user.click(screen.getByTestId("saveAndComplete"));

			const { dwellingSpaceCeilings } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
			
			expect(dwellingSpaceCeilings?.data[0]).toEqual({ ...internalFloorWithUnheated, complete: true });
		});
	
		it("form is prepopulated when data exists in state", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: {
							data: [internalFloorWithUnheated]
						}
					}
				}
			});
	
			await renderSuspended(Ceiling, {
				route: {
					params: { ceiling: "0" }
				}
			});

			expect((await screen.findByTestId("type_unheatedSpace")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("thermalResistanceOfAdjacentUnheatedSpace")).value).toBe("0");
		});

		it("requires additional fields when heated space is selected", async () => {
			await renderSuspended(Ceiling);
	
			await user.click(screen.getByTestId("type_unheatedSpace"));
			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("thermalResistanceOfAdjacentUnheatedSpace_error"))).toBeDefined();
		});
	});

	it("shows type of ceiling required error message when empty form is submitted", async () => {
		await renderSuspended(Ceiling);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("type_error"))).toBeDefined();
	});

	it("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(Ceiling);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("ceilingErrorSummary"))).toBeDefined();
	});

	it("requires pitch when custom pitch option is selected", async () => {
		await renderSuspended(Ceiling);

		await user.click(screen.getByTestId("type_heatedSpace"));
		await user.click(screen.getByTestId("pitchOption_custom"));
		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("pitch_error"))).toBeDefined();
	});

	it("saves custom pitch when custom pitch option is selected", async () => {
		await renderSuspended(Ceiling, {
			route: {
				params: { ceiling: "create" },
			},
		});

		await user.click(screen.getByTestId("type_heatedSpace"));
		await populateValidForm();
		await user.click(screen.getByTestId("pitchOption_custom"));
		await user.type(screen.getByTestId("pitch"), "90");
		await user.tab();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { dwellingSpaceCeilings } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
		
		expect(dwellingSpaceCeilings.data[0]!.data.pitch).toEqual(90);
	});

	it("navigates to ceilings and roofs page when valid form is completed", async () => {
		await renderSuspended(Ceiling);
	
		await user.click(screen.getByTestId("type_heatedSpace"));
		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/ceilings-and-roofs");
	});

	it("navigates to ceilings and roofs page when save progress button is clicked", async () => {
		await renderSuspended(Ceiling);

		await user.click(screen.getByTestId("type_heatedSpace"));
		await user.type(screen.getByTestId("name"), "Test ceiling");
		await user.click(screen.getByTestId("saveProgress"));

		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/ceilings-and-roofs");
	});

	describe("partially saving data", () => {
		it("creates a new ceiling automatically with given name", async () => {
			await renderSuspended(Ceiling, {
				route: {
					params: { ceiling: "create" }
				}
			});

			await user.click(screen.getByTestId("type_heatedSpace"));
			await user.type(screen.getByTestId("name"), "New ceiling");
			await user.tab();

			const actualCeiling = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings.data[0]!;

			expect(actualCeiling.data.name).toBe("New ceiling");
			expect(actualCeiling.data.surfaceArea).toBeUndefined();
			expect(actualCeiling.data.kappaValue).toBeUndefined();
		});

		it("creates a new ceiling automatically with default name after other data is entered", async () => {
			await renderSuspended(Ceiling, {
				route: {
					params: { ceiling: "create" }
				}
			});

			await user.click(screen.getByTestId("type_unheatedSpace"));
			await user.type(screen.getByTestId("thermalResistanceOfAdjacentUnheatedSpace"), "0.7");
			await user.tab();

			const actualCeiling = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings.data[0]!.data as Partial<Extract<CeilingData, { type: AdjacentSpaceType.unheatedSpace }>>;

			expect(actualCeiling.name).toBe("Ceiling");
			expect(actualCeiling.thermalResistanceOfAdjacentUnheatedSpace).toBe(0.7);
			expect(actualCeiling.surfaceArea).toBeUndefined();
			expect(actualCeiling.kappaValue).toBeUndefined();
		});

		it("saves updated form data to correct store object automatically", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: {
							data: [internalFloor, internalFloorWithUnheated]
						}
					}
				}
			});

			await renderSuspended(Ceiling, {
				route: {
					params: { ceiling: "1" }
				}
			});

			await user.clear(screen.getByTestId("name"));
			await user.clear(screen.getByTestId("surfaceArea"));

			await user.type(screen.getByTestId("name"), "Updated ceiling");
			await user.type(screen.getByTestId("surfaceArea"), "17");
			await user.tab();

			const actualCeiling = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings.data[1]!;
			expect(actualCeiling.data.name).toBe("Updated ceiling");
			expect(actualCeiling.data.surfaceArea).toBe(17);
		});
	});
});