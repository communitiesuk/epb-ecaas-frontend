import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import ExternalUnglazedDoor from "./[door].vue";
import { MassDistributionClass } from "~/schema/api-schema.types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("external unglazed door", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const externalWall: ExternalWallData = {
		id: "80fd1ffe-a83a-4d95-bd2c-ad8fdc37b421",
		name: "External wall 1",
		pitchOption: "90",
		pitch: 90,
		orientation: 0,
		length: 20,
		height: 0.5,
		elevationalHeight: 20,
		grossSurfaceArea: 10,
		solarAbsorption: 0.1,
		uValue: 1,
		kappaValue: 50000,
		massDistributionClass: MassDistributionClass.I,
	};

	const state: EcaasForm<ExternalUnglazedDoorData> = {
		data: {
			name: "External unglazed door 1",
			associatedItemId: externalWall.id,
			height: 0.5,
			width: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorption: 0.1,
			uValue: 1,
			kappaValue: 50000,
			massDistributionClass: MassDistributionClass.I,
		},
	};

	beforeEach(() => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: {
						data: [{ data: externalWall, complete: true }],
					},
				},
			},
		});
	});

	afterEach(() => {
		store.$reset();
	});

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(ExternalUnglazedDoor, {
			route: {
				params: { externalUnglazed: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "External unglazed door 1");
		await user.click(screen.getByTestId(`associatedItemId_${externalWall.id}`));
		await user.type(screen.getByTestId("height"), "0.5");
		await user.type(screen.getByTestId("width"), "20"); 
		await user.type(screen.getByTestId("elevationalHeight"), "20");
		await user.type(screen.getByTestId("surfaceArea"), "10");
		await user.type(screen.getByTestId("solarAbsorption"), "0.1");
		await user.type(screen.getByTestId("uValue"), "1");
		await user.click(screen.getByTestId("kappaValue_50000"));
		await user.click(screen.getByTestId("massDistributionClass_I"));

		await user.click(screen.getByTestId("saveAndComplete"));

		const { data = [] } = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor || {};
		
		expect(data[0]).toEqual({ ...state, complete: true });
		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/doors");
	});

	test("navigates to doors page when save progress button is clicked", async () => {
		await renderSuspended(ExternalUnglazedDoor);

		await user.type(screen.getByTestId("name"), "Test door");
		await user.tab();
		await user.click(screen.getByTestId("saveProgress"));

		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/doors");
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceDoors: {
					dwellingSpaceExternalUnglazedDoor: {
						data: [state],
					},
				},
			},
		});

		await renderSuspended(ExternalUnglazedDoor, {
			route: {
				params: { door: "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("External unglazed door 1");
		expect((await screen.findByTestId(`associatedItemId_${externalWall.id}`)).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId<HTMLInputElement>("height")).value).toBe("0.5");
		expect((await screen.findByTestId<HTMLInputElement>("width")).value).toBe("20");
		expect((await screen.findByTestId<HTMLInputElement>("elevationalHeight")).value).toBe("20");
		expect((await screen.findByTestId<HTMLInputElement>("surfaceArea")).value).toBe("10");
		expect((await screen.findByTestId<HTMLInputElement>("solarAbsorption")).value).toBe("0.1");
		expect((await screen.findByTestId<HTMLInputElement>("uValue")).value).toBe("1");
		expect((await screen.findByTestId("kappaValue_50000")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("massDistributionClass_I")).hasAttribute("checked")).toBe(true);
	});
		
	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(ExternalUnglazedDoor);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("associatedItemId_error"))).toBeDefined();
		expect((await screen.findByTestId("height_error"))).toBeDefined();
		expect((await screen.findByTestId("width_error"))).toBeDefined();
		expect((await screen.findByTestId("elevationalHeight_error"))).toBeDefined();
		expect((await screen.findByTestId("surfaceArea_error"))).toBeDefined();
		expect((await screen.findByTestId("solarAbsorption_error"))).toBeDefined();
		expect((await screen.findByTestId("uValue_error"))).toBeDefined();
		expect((await screen.findByTestId("kappaValue_error"))).toBeDefined();
		expect((await screen.findByTestId("massDistributionClass_error"))).toBeDefined();

	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(ExternalUnglazedDoor);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("externalUnglazedDoorErrorSummary"))).toBeDefined();
	});

	describe("partially saving data", () => {
		it("creates a new door automatically with given name", async () => {
			await renderSuspended(ExternalUnglazedDoor, {
				route: {
					params: { externalUnglazed: "create" },
				},
			});

			await user.type(screen.getByTestId("name"), "New door");
			await user.tab();

			const actualDoor = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor.data[0]!;
			expect(actualDoor.data.name).toBe("New door");
			expect(actualDoor.data.height).toBeUndefined();
			expect(actualDoor.data.kappaValue).toBeUndefined();
		});

		it("creates a new door automatically with default name after other data is entered", async () => {
			await renderSuspended(ExternalUnglazedDoor, {
				route: {
					params: { externalUnglazed: "create" },
				},
			});

			await user.type(screen.getByTestId("elevationalHeight"), "7");
			await user.tab();

			const actualDoor = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor.data[0]!;
			expect(actualDoor.data.name).toBe("External unglazed door");
			expect(actualDoor.data.height).toBeUndefined();
			expect(actualDoor.data.width).toBeUndefined();
			expect(actualDoor.data.elevationalHeight).toBe(7);
		});

		it("saves updated form data to correct store object automatically", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalUnglazedDoor: {
							data: [state, state],
						},
					},
				},
			});

			await renderSuspended(ExternalUnglazedDoor, {
				route: {
					params: { externalUnglazed: "1" },
				},
			});

			await user.clear(screen.getByTestId("name"));
			await user.clear(screen.getByTestId("elevationalHeight"));

			await user.type(screen.getByTestId("name"), "Updated door");
			await user.type(screen.getByTestId("elevationalHeight"), "12");
			await user.tab();

			const actualDoor = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor.data[1]!;
			expect(actualDoor.data.name).toBe("Updated door");
			expect(actualDoor.data.elevationalHeight).toBe(12);
		});

		test("external unglazed door and section are set as 'not complete' after user edits an item", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalUnglazedDoor: {
							data: [{ ...state, complete: true }],
							complete: true,
						},
					},
				},
			});

			await renderSuspended(ExternalUnglazedDoor, {
				route: {
					params: { externalUnglazed: "0" },
				},
			});

			await user.type(screen.getByTestId("name"), "Door");
			await user.tab();

			const externalUnglazedDoors = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor;

			expect(externalUnglazedDoors.data[0]!.complete).not.toBe(true);
			expect(externalUnglazedDoors.complete).not.toBe(true);
		});
	});
});