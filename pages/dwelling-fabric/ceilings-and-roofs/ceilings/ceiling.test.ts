import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import Ceiling from "./[ceiling].vue";
import { MassDistributionClass } from "~/schema/api-schema.types";
import { v4 as uuidv4 } from "uuid";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

vi.mock("uuid");

describe("ceiling", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const ceiling: EcaasForm<CeilingData> = {
		data: {
			id: "099342c5-07c5-4268-b66b-f85dfc5de58f",
			type: AdjacentSpaceType.heatedSpace,
			name: "Ceiling 1",
			grossSurfaceArea: 5,
			kappaValue: 50000,
			massDistributionClass: MassDistributionClass.I,
			pitchOption: "0",
			pitch: 0,
		},
	};

	const ceilingUnheatedSpace: EcaasForm<CeilingData> = {
		data: {
			...ceiling.data,
			type: AdjacentSpaceType.unheatedSpace,
			uValue: 1,
			thermalResistanceOfAdjacentUnheatedSpace: 0,
		},
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Ceiling 1");
		await user.type(screen.getByTestId("grossSurfaceArea"), "5");
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
			vi.mocked(uuidv4).mockReturnValue(ceiling.data.id as unknown as Buffer);

			await renderSuspended(Ceiling, {
				route: {
					params: { ceiling: "create" },
				},
			});
	
			await user.click(screen.getByTestId("type_heatedSpace"));
			await populateValidForm();
			await user.click(screen.getByTestId("saveAndComplete"));

			const { dwellingSpaceCeilings } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
			
			expect(dwellingSpaceCeilings.data[0]).toEqual({ ...ceiling, complete: true });
		});
	
		it("form is prepopulated when data exists in state", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: {
							data: [ceiling],
						},
					},
				},
			});
	
			await renderSuspended(Ceiling, {
				route: {
					params: { ceiling: "0" },
				},
			});
	
			expect((await screen.findByTestId("type_heatedSpace")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Ceiling 1");
			expect((await screen.findByTestId<HTMLInputElement>("grossSurfaceArea")).value).toBe("5");
			expect((await screen.findByTestId("kappaValue_50000")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId("massDistributionClass_I")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId("pitchOption_0")).hasAttribute("checked")).toBe(true);
		});

		it("requires additional fields when heated space is selected", async () => {
			await renderSuspended(Ceiling);
	
			await user.click(screen.getByTestId("type_heatedSpace"));
			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("name_error"))).toBeDefined();
			expect((await screen.findByTestId("grossSurfaceArea_error"))).toBeDefined();
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
			
			expect(dwellingSpaceCeilings?.data[0]).toEqual({ ...ceilingUnheatedSpace, complete: true });
		});
	
		it("form is prepopulated when data exists in state", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: {
							data: [ceilingUnheatedSpace],
						},
					},
				},
			});
	
			await renderSuspended(Ceiling, {
				route: {
					params: { ceiling: "0" },
				},
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
					params: { ceiling: "create" },
				},
			});

			await user.click(screen.getByTestId("type_heatedSpace"));
			await user.type(screen.getByTestId("name"), "New ceiling");
			await user.tab();

			const actualCeiling = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings.data[0]!;

			expect(actualCeiling.data.name).toBe("New ceiling");
			expect(actualCeiling.data.grossSurfaceArea).toBeUndefined();
			expect(actualCeiling.data.kappaValue).toBeUndefined();
		});

		it("creates a new ceiling automatically with default name after other data is entered", async () => {
			await renderSuspended(Ceiling, {
				route: {
					params: { ceiling: "create" },
				},
			});

			await user.click(screen.getByTestId("type_unheatedSpace"));
			await user.type(screen.getByTestId("thermalResistanceOfAdjacentUnheatedSpace"), "0.7");
			await user.tab();

			const actualCeiling = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings.data[0]!.data as Partial<Extract<CeilingData, { type: AdjacentSpaceType.unheatedSpace }>>;

			expect(actualCeiling.name).toBe("Ceiling");
			expect(actualCeiling.thermalResistanceOfAdjacentUnheatedSpace).toBe(0.7);
			expect(actualCeiling.grossSurfaceArea).toBeUndefined();
			expect(actualCeiling.kappaValue).toBeUndefined();
		});

		it("saves updated form data to correct store object automatically", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: {
							data: [ceiling, ceilingUnheatedSpace],
						},
					},
				},
			});

			await renderSuspended(Ceiling, {
				route: {
					params: { ceiling: "1" },
				},
			});

			await user.clear(screen.getByTestId("name"));
			await user.clear(screen.getByTestId("grossSurfaceArea"));

			await user.type(screen.getByTestId("name"), "Updated ceiling");
			await user.type(screen.getByTestId("grossSurfaceArea"), "17");
			await user.tab();

			const actualCeiling = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings.data[1]!;
			expect(actualCeiling.data.name).toBe("Updated ceiling");
			expect(actualCeiling.data.grossSurfaceArea).toBe(17);
		});

		test("ceiling and ceilings section are set as 'not complete' after user edits an item", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: {
							data: [{ ...ceiling, complete: true }],
							complete: true,
						},
					},
				},
			});

			await renderSuspended(Ceiling, {
				route: {
					params: { ceiling: "0" },
				},
			});

			await user.type(screen.getByTestId("name"), "Ceiling");
			await user.tab();

			const ceilings = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings;

			expect(ceilings.data[0]!.complete).not.toBe(true);
			expect(ceilings.complete).not.toBe(true);
		});
	});
});