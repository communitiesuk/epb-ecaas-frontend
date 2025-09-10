import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import InternalDoor from "./[door].vue";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("internal door", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const internalDoor: EcaasForm<InternalDoorData> = {
		data: {
			typeOfInternalDoor: AdjacentSpaceType.heatedSpace,
			name: "Internal 1",
			surfaceArea: 5,
			kappaValue: 50000,
			massDistributionClass: "I",
			pitchOption: "90",
			pitch: 90
		}
	};

	const internalDoorWithUnheatedSpace: EcaasForm<InternalDoorData> = {
		data: {
			...internalDoor.data,
			typeOfInternalDoor: AdjacentSpaceType.unheatedSpace,
			uValue: 0.1,
			thermalResistanceOfAdjacentUnheatedSpace: 0
		}
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Internal 1");
		await user.type(screen.getByTestId("surfaceArea"), "5");
		await user.click(screen.getByTestId("kappaValue_50000"));
		await user.click(screen.getByTestId("massDistributionClass_I"));
		await user.click(screen.getByTestId("pitchOption_90"));
	};
	
	describe("when type of internal door is heated space", () => {
		it("data is saved to store state when form is valid", async () => {
			await renderSuspended(InternalDoor, {
				route: {
					params: { internalDoor: "create" }
				}
			});
	
			await user.click(screen.getByTestId("typeOfInternalDoor_heatedSpace"));
			await populateValidForm();
			await user.click(screen.getByTestId("saveAndComplete"));

			const { data } = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor;

			expect(data[0]).toEqual({ ...internalDoor, complete: true });
		});
	
		it("form is prepopulated when data exists in state", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceInternalDoor: {
							data: [internalDoor]
						}
					}
				}
			});
	
			await renderSuspended(InternalDoor, {
				route: {
					params: { door: "0" }
				}
			});
	
			expect((await screen.findByTestId("typeOfInternalDoor_heatedSpace")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Internal 1");
			expect((await screen.findByTestId<HTMLInputElement>("surfaceArea")).value).toBe("5");
			expect((await screen.findByTestId("kappaValue_50000")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId("massDistributionClass_I")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId("pitchOption_90")).hasAttribute("checked")).toBe(true);
		});

		it("requires additional fields when heated space is selected", async () => {
			await renderSuspended(InternalDoor);
	
			await user.click(screen.getByTestId("typeOfInternalDoor_heatedSpace"));
			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("name_error"))).toBeDefined();
			expect((await screen.findByTestId("surfaceArea_error"))).toBeDefined();
			expect((await screen.findByTestId("kappaValue_error"))).toBeDefined();
			expect((await screen.findByTestId("massDistributionClass_error"))).toBeDefined();
			expect((await screen.findByTestId("pitchOption_error"))).toBeDefined();
		});
	});
	
	describe("when type of internal door is unheated space", () => {
		it("data is saved to store state when form is valid", async () => {
			await renderSuspended(InternalDoor, {
				route: {
					params: { internalDoor: "create" }
				}
			});
	
			await user.click(screen.getByTestId("typeOfInternalDoor_unheatedSpace"));
			await populateValidForm();
			await user.type(screen.getByTestId("uValue"), "0.1");
			await user.type(screen.getByTestId("thermalResistanceOfAdjacentUnheatedSpace"), "0");
			await user.tab();
			await user.click(screen.getByTestId("saveAndComplete"));

			const { data } = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor;
			
			expect(data[0]).toEqual({ ...internalDoorWithUnheatedSpace, complete: true });
		});
	
		it("form is prepopulated when data exists in state", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceInternalDoor: {
							data: [internalDoorWithUnheatedSpace]
						}
					}
				}
			});
	
			await renderSuspended(InternalDoor, {
				route: {
					params: { door: "0" }
				}
			});
	
			expect((await screen.findByTestId("typeOfInternalDoor_unheatedSpace")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("thermalResistanceOfAdjacentUnheatedSpace")).value).toBe("0");
		});

		it("requires additional fields when heated space is selected", async () => {
			await renderSuspended(InternalDoor);
	
			await user.click(screen.getByTestId("typeOfInternalDoor_unheatedSpace"));
			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("uValue_error"))).toBeDefined();
			expect((await screen.findByTestId("thermalResistanceOfAdjacentUnheatedSpace_error"))).toBeDefined();
		});
	});

	it("shows type of internal Door required error message when empty form is submitted", async () => {
		await renderSuspended(InternalDoor);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("typeOfInternalDoor_error"))).toBeDefined();
	});

	it("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(InternalDoor);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("internalDoorErrorSummary"))).toBeDefined();
	});

	it("requires pitch when custom pitch option is selected", async () => {
		await renderSuspended(InternalDoor);

		await user.click(screen.getByTestId("typeOfInternalDoor_heatedSpace"));
		await user.click(screen.getByTestId("pitchOption_custom"));
		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("pitch_error"))).toBeDefined();
	});

	it("saves custom pitch when custom pitch option is selected", async () => {
		await renderSuspended(InternalDoor, {
			route: {
				params: { internalDoor: "create" }
			}
		});

		await user.click(screen.getByTestId("typeOfInternalDoor_heatedSpace"));
		await populateValidForm();
		await user.click(screen.getByTestId("pitchOption_custom"));
		await user.type(screen.getByTestId("pitch"), "90");
		await user.tab();
		await user.click(screen.getByTestId("saveAndComplete"));

		const actualDoor = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor.data[0]!;
		
		expect(actualDoor.data.pitch).toEqual(90);
	});

	it("navigates to doors page when valid form is completed", async () => {
		await renderSuspended(InternalDoor);
	
		await user.click(screen.getByTestId("typeOfInternalDoor_heatedSpace"));
		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-space/doors");
	});

	it("navigates to doors page when save progress button is clicked", async () => {
		await renderSuspended(InternalDoor);

		await user.click(screen.getByTestId("typeOfInternalDoor_heatedSpace"));
		await user.type(screen.getByTestId("name"), "Test door");
		await user.click(screen.getByTestId("saveProgress"));

		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-space/doors");
	});

	describe("partially saving data", () => {
		it("creates a new door automatically with given name", async () => {
			await renderSuspended(InternalDoor, {
				route: {
					params: { internalDoor: "create" }
				}
			});

			await user.click(screen.getByTestId("typeOfInternalDoor_unheatedSpace"));
			await user.type(screen.getByTestId("name"), "New door");
			await user.tab();

			const actualDoor = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor.data[0]!;
			expect(actualDoor.data.name).toBe("New door");
			expect(actualDoor.data.surfaceArea).toBeUndefined();
			expect(actualDoor.data.kappaValue).toBeUndefined();
		});

		it("creates a new door automatically with default name after other data is entered", async () => {
			await renderSuspended(InternalDoor, {
				route: {
					params: { internalDoor: "create" }
				}
			});

			await user.click(screen.getByTestId("typeOfInternalDoor_heatedSpace"));
			await user.type(screen.getByTestId("surfaceArea"), "7");
			await user.tab();

			const actualDoor = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor.data[0]!;
			expect(actualDoor.data.name).toBe("Internal door");
			expect(actualDoor.data.kappaValue).toBeUndefined();
			expect(actualDoor.data.surfaceArea).toBe(7);
		});

		it("saves updated form data to correct store object automatically", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceInternalDoor: {
							data: [internalDoor, internalDoor]
						}
					}
				}
			});

			await renderSuspended(InternalDoor, {
				route: {
					params: { internalDoor: "1" }
				}
			});

			await user.click(screen.getByTestId("typeOfInternalDoor_heatedSpace"));
			await user.clear(screen.getByTestId("name"));
			await user.clear(screen.getByTestId("surfaceArea"));

			await user.type(screen.getByTestId("name"), "Updated door");
			await user.type(screen.getByTestId("surfaceArea"), "13");
			await user.tab();

			const actualDoor = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor.data[1]!;
			expect(actualDoor.data.name).toBe("Updated door");
			expect(actualDoor.data.surfaceArea).toBe(13);
		});
	});
});