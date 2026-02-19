import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import BulbPage from "./[bulb].vue";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("bulb page", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const bulbData: EcaasForm<DwellingSpaceLightingData> = {
		data: {
			name: "Existing bulb",
			numberOfBulbs: 4,
			power: 9,
			efficacy: 100,
		},
		complete: true,
	};

	beforeEach(() => {
		store.$reset();
		navigateToMock.mockReset();
	});

	test("form fields are displayed", async () => {
		await renderSuspended(BulbPage, {
			route: {
				params: { bulb: "create" },
			},
		});

		expect(screen.getByTestId("name")).toBeDefined();
		expect(screen.getByTestId("numberOfBulbs")).toBeDefined();
		expect(screen.getByTestId("power")).toBeDefined();
		expect(screen.getByTestId("efficacy")).toBeDefined();
		expect(screen.getByTestId("saveAndComplete")).toBeDefined();
		expect(screen.getByTestId("saveProgress")).toBeDefined();
	});

	test("save progress button links to lighting index page", async () => {
		await renderSuspended(BulbPage, {
			route: {
				params: { bulb: "create" },
			},
		});

		expect(screen.getByTestId("saveProgress").getAttribute("href")).toBe(getUrl("dwellingSpaceLighting"));
	});

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(BulbPage, {
			route: {
				params: { bulb: "create" },
			},
		});

		const name = screen.getByTestId("name");
		const numberOfBulbs = screen.getByTestId("numberOfBulbs");
		const power = screen.getByTestId("power");
		const efficacy = screen.getByTestId("efficacy");

		await user.type(name, "Bulb 1");
		await user.type(numberOfBulbs, "10");
		await user.type(power, "12");
		await user.type(efficacy, "95");
		await user.tab();
		await user.click(screen.getByText("Save and mark as complete"));

		expect(store.dwellingFabric.dwellingSpaceLighting.data[0]).toEqual({
			data: {
				name: "Bulb 1",
				numberOfBulbs: 10,
				power: 12,
				efficacy: 95,
			},
			complete: true,
		});
		expect(store.dwellingFabric.dwellingSpaceLighting.complete).toBe(false);
		expect(navigateToMock).toHaveBeenCalledWith(getUrl("dwellingSpaceLighting"));
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(BulbPage, {
			route: {
				params: { bulb: "create" },
			},
		});

		await user.click(screen.getByText("Save and mark as complete"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("numberOfBulbs_error"))).toBeDefined();
		expect((await screen.findByTestId("power_error"))).toBeDefined();
		expect((await screen.findByTestId("efficacy_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form is submitted", async () => {
		await renderSuspended(BulbPage, {
			route: {
				params: { bulb: "create" },
			},
		});

		await user.click(screen.getByText("Save and mark as complete"));

		expect((await screen.findByTestId("lightingErrorSummary"))).toBeDefined();
	});

	test("name must be unique", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceLighting: {
					data: [bulbData],
				},
			},
		});

		await renderSuspended(BulbPage, {
			route: {
				params: { bulb: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Existing bulb");
		await user.type(screen.getByTestId("numberOfBulbs"), "1");
		await user.type(screen.getByTestId("power"), "1");
		await user.type(screen.getByTestId("efficacy"), "1");
		await user.click(screen.getByText("Save and mark as complete"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect(navigateToMock).not.toHaveBeenCalled();
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceLighting: {
					data: [bulbData],
				},
			},
		});

		await renderSuspended(BulbPage, {
			route: {
				params: { bulb: "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Existing bulb");
		expect((await screen.findByTestId<HTMLInputElement>("numberOfBulbs")).value).toBe("4");
		expect((await screen.findByTestId<HTMLInputElement>("power")).value).toBe("9");
		expect((await screen.findByTestId<HTMLInputElement>("efficacy")).value).toBe("100");
	});

	test("changes are autosaved when editing existing bulb", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceLighting: {
					data: [bulbData],
				},
			},
		});

		await renderSuspended(BulbPage, {
			route: {
				params: { bulb: "0" },
			},
		});

		await user.clear(screen.getByTestId("numberOfBulbs"));
		await user.type(screen.getByTestId("numberOfBulbs"), "6");
		await user.tab();

		expect(store.dwellingFabric.dwellingSpaceLighting.data[0]).toMatchObject({
			data: {
				name: "Existing bulb",
				numberOfBulbs: 6,
				power: 9,
				efficacy: 100,
			},
		});
		expect(store.dwellingFabric.dwellingSpaceLighting.data[0]?.complete).not.toBe(true);
		expect(store.dwellingFabric.dwellingSpaceLighting.complete).toBe(false);
		expect(navigateToMock).not.toHaveBeenCalled();
	});

	test("existing bulb is updated when editing", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceLighting: {
					data: [bulbData],
				},
			},
		});

		await renderSuspended(BulbPage, {
			route: {
				params: { bulb: "0" },
			},
		});

		await user.clear(screen.getByTestId("name"));
		await user.type(screen.getByTestId("name"), "Updated bulb");
		await user.clear(screen.getByTestId("numberOfBulbs"));
		await user.type(screen.getByTestId("numberOfBulbs"), "12");
		await user.tab();
		await user.click(screen.getByText("Save and mark as complete"));

		expect(store.dwellingFabric.dwellingSpaceLighting.data[0]).toEqual({
			data: {
				name: "Updated bulb",
				numberOfBulbs: 12,
				power: 9,
				efficacy: 100,
			},
			complete: true,
		});
		expect(navigateToMock).toHaveBeenCalledWith(getUrl("dwellingSpaceLighting"));
	});
});
