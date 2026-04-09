import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";
import Vent from "./[vent].vue";
import type { VentData } from "~/stores/ecaasStore.schema";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("vent", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	const externalWall: ExternalWallData = {
		id: "0b77e247-53c5-42b8-9dbd-83cbfc8c8a9e",
		name: "External wall 1",
		pitchOption: "90",
		pitch: 90,
		orientation: 3,
		length: 20,
		height: 0.5,
		elevationalHeight: 20,
		surfaceArea: 10,
		uValue: 1,
		colour: "Intermediate",
		arealHeatCapacity: "Very light",
		massDistributionClass: "I",
	};

	const state: VentData = {
		name: "Vent 1",
		associatedItemId: externalWall.id,
		effectiveVentilationArea: 10,
		openingRatio: 1,
		midHeightOfZone: 1,
		hasAssociatedItem: true,
	};

	beforeEach(() => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: {
						data: [{ data: externalWall }],
					},
				},
			},
		});
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Vent 1");
		await user.click(screen.getByTestId(`associatedItemId_${externalWall.id}`));
		await user.type(screen.getByTestId("effectiveVentilationArea"), "10");
		await user.type(screen.getByTestId("midHeightOfZone"), "1");
		await user.tab();
	};

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(Vent, {
			route: {
				params: { vent: "create" },
			},
		});

		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.infiltrationAndVentilation.vents;

		expect(data[0]?.data).toEqual(state);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					data: [{ data: state }],
				},
			},
		});

		await renderSuspended(Vent, {
			route: {
				params: { vent: "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe(
			"Vent 1",
		);
		expect(
			(
				await screen.findByTestId<HTMLInputElement>(
					`associatedItemId_${externalWall.id}`,
				)
			).hasAttribute("checked"),
		).toBe(true);
		expect(
			(await screen.findByTestId<HTMLInputElement>("effectiveVentilationArea"))
				.value,
		).toBe("10");
		expect(
			(await screen.findByTestId<HTMLInputElement>("midHeightOfZone")).value,
		).toBe("1");
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(Vent);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect(await screen.findByTestId("name_error")).toBeDefined();
		expect(await screen.findByTestId("associatedItemId_error")).toBeDefined();
		expect(
			await screen.findByTestId("effectiveVentilationArea_error"),
		).toBeDefined();
		expect(await screen.findByTestId("midHeightOfZone_error")).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(Vent);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect(await screen.findByTestId("ventErrorSummary")).toBeDefined();
	});

	test("updated form data is automatically saved to store", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					data: [
						{
							data: { ...state },
						},
					],
				},
			},
		});

		await renderSuspended(Vent, {
			route: {
				params: { vent: "0" },
			},
		});

		await user.clear(screen.getByTestId("name"));

		await user.type(screen.getByTestId("name"), "Vent 2");
		await user.tab();

		const { data } = store.infiltrationAndVentilation.vents;

		expect(data[0]?.data.name).toBe("Vent 2");
	});

	test("partial form data is saved automatically with default name to store when adding new heater", async () => {
		await renderSuspended(Vent, {
			route: {
				params: { vent: "create" },
			},
		});

		await user.click(screen.getByTestId(`associatedItemId_${externalWall.id}`));
		await user.tab();

		const { data } = store.infiltrationAndVentilation.vents;

		expect(data[0]?.data.name).toBe("Vent");
	});

	test("renders pitch and orientation questions when no associated items added", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: {
						data: [],
					},
				},
			},
		});

		await renderSuspended(Vent, {
			route: {
				params: { vent: "create" },
			},
		});

		expect(screen.getByTestId("pitch")).toBeDefined();
		expect(screen.getByTestId("orientation")).toBeDefined();
	});

	test("renders pitch and orientation questions when selected associated item is 'None of the above'", async () => {
		await renderSuspended(Vent, {
			route: {
				params: { vent: "create" },
			},
		});

		await user.click(screen.getByTestId("associatedItemId_none"));

		expect(screen.getByTestId("pitch")).toBeDefined();
		expect(screen.getByTestId("orientation")).toBeDefined();
	});

	test("does not render pitch and orientation questions when no associated item is selected", async () => {
		await renderSuspended(Vent, {
			route: {
				params: { vent: "create" },
			},
		});

		expect(screen.queryByTestId("pitch")).toBeNull();
		expect(screen.queryByTestId("orientation")).toBeNull();
	});

	test("does not render pitch and orientation questions when associated item is selected", async () => {
		await renderSuspended(Vent, {
			route: {
				params: { vent: "create" },
			},
		});

		await user.click(screen.getByTestId(`associatedItemId_${externalWall.id}`));
		await user.tab();

		expect(screen.queryByTestId("pitch")).toBeNull();
		expect(screen.queryByTestId("orientation")).toBeNull();
	});
});
