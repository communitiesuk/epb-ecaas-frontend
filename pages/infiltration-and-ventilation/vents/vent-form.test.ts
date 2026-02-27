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
		thermalResistance: 1,
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

	test("displays a link to the windows and walls page", async () => {
		store.$reset();

		await renderSuspended(Vent, {
			route: {
				params: { vent: "create" },
			},
		});

		const addWallsLink: HTMLAnchorElement = screen.getByRole("link", {
			name: "Click here to add walls",
		});

		const addWindowsLink: HTMLAnchorElement = screen.getByRole("link", {
			name: "Click here to add windows",
		});

		expect(new URL(addWallsLink.href).pathname).toBe(
			getUrl("dwellingSpaceWalls"),
		);

		expect(new URL(addWindowsLink.href).pathname).toBe(
			getUrl("dwellingSpaceWindows"),
		);
	});
});
