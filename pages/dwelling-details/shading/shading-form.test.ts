import ShadingForm from "./[shading].vue";
import type { ShadingData } from "~/stores/ecaasStore.schema";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import { ShadingObjectType } from "~/schema/api-schema.types";

describe("shading form", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	const shading1: ShadingData = {
		name: "Big Tree",
		startAngle: 10,
		endAngle: 20,
		objectType: ShadingObjectType.obstacle,
		height: 3,
		distance: 2
	};

	const shading2: ShadingData = {
		...shading1,
		name: "Small Tree"
	};

	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(ShadingForm, {
			route: {
				params: { shading: "create" }
			}
		});

		await user.type(screen.getByTestId("name"), "Big Tree");
		await user.type(screen.getByTestId("startAngle"), "10");
		await user.type(screen.getByTestId("endAngle"), "20");
		await user.click(screen.getByTestId("objectType_obstacle"));
		await user.type(screen.getByTestId("height"), "3");
		await user.type(screen.getByTestId("distance"), "2");
		await user.tab();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.dwellingDetails.shading;

		expect(data[0]).toEqual({
			data: shading1,
			complete: true
		});
		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-details/shading");
	});

	test("data is saved to correct object in store state when form is valid", async () => {
		store.$patch({
			dwellingDetails: {
				shading: {
					data: [{
						data: { ...shading1 }
					}, {
						data: { ...shading2 }
					}]
				}
			} }
		);

		await renderSuspended(ShadingForm, {
			route: {
				params: { shading: "1" }
			}
		});

		await user.clear(screen.getByTestId("name"));
		await user.type(screen.getByTestId("name"), "Wall");
		await user.tab();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.dwellingDetails.shading;

		expect(data[1]?.data.name).toEqual("Wall");
	});

	test("form is prepopulated correctly when data exists in state", async () => {
		store.$patch({
			dwellingDetails: {
				shading: {
					data: [{
						data: { ...shading1 }
					}, {
						data: { ...shading2 }
					}]
				}
			} }
		);

		await renderSuspended(ShadingForm, {
			route: {
				params: { shading: "0" }
			}
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Big Tree");
		expect((await screen.findByTestId<HTMLInputElement>("startAngle")).value).toBe("10");
		expect((await screen.findByTestId<HTMLInputElement>("endAngle")).value).toBe("20");
		expect(((await screen.findByTestId("objectType_obstacle")).hasAttribute("checked"))).toBe(true);
		expect((await screen.findByTestId<HTMLInputElement>("height")).value).toBe("3");
		expect((await screen.findByTestId<HTMLInputElement>("distance")).value).toBe("2");

		await renderSuspended(ShadingForm, {
			route: {
				params: { shading: "1" }
			}
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Small Tree");
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(ShadingForm, {
			route: {
				params: { shading: "create" }
			}
		});

		await user.click(screen.getByTestId("saveAndComplete"));

		expect(await screen.findByTestId("name_error")).toBeDefined();
		expect(await screen.findByTestId("startAngle_error")).toBeDefined();
		expect(await screen.findByTestId("endAngle_error")).toBeDefined();
		expect(await screen.findByTestId("objectType_error")).toBeDefined();
		expect(await screen.findByTestId("height_error")).toBeDefined();
		expect(await screen.findByTestId("distance_error")).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(ShadingForm);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("ShadingErrorSummary"))).toBeDefined();
	});

	test("updated form data is automatically saved to store", async () => {
		store.$patch({
			dwellingDetails: {
				shading: {
					data: [{
						data: { ...shading1 }
					}]
				}
			}
		});

		await renderSuspended(ShadingForm, {
			route: {
				params: { shading: "0" },
			},
		});
	
		await user.clear(screen.getByTestId("name"));

		await user.type(screen.getByTestId("name"), "Small Tree");
		await user.type(screen.getByTestId("startAngle"), "10");

		const { data } = store.dwellingDetails.shading;

		expect(data[0]?.data.name).toBe("Small Tree");
		expect(data[0]?.data.startAngle).toBe(10);
	});
	
	test("partial form data is saved automatically with default name to store when adding new heater", async () => {
		await renderSuspended(ShadingForm, {
			route: {
				params: { shading: "create" },
			},
		});
		
		await user.type(screen.getByTestId("startAngle"), "10");
		await user.type(screen.getByTestId("endAngle"), "20");
		await user.tab();

		const { data } = store.dwellingDetails.shading;

		expect(data[0]?.data.name).toBe("Shading");
		expect(data[0]?.data.startAngle).toBe(10);
		expect(data[0]?.data.endAngle).toBe(20);
	});

	test("creates a new heater automatically with given name", async () => {
		await renderSuspended(ShadingForm, {
			route: {
				params: { shading: "create" },
			},
		});
		
		await user.type(screen.getByTestId("name"), "Shading 1");
		await user.tab();

		const { data } = store.dwellingDetails.shading;

		expect(data[0]?.data.name).toBe("Shading 1");
	});
});
