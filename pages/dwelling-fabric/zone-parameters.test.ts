import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { screen, waitFor } from "@testing-library/vue";
import ZoneParameters from "./zone-parameters.vue";
import userEvent from "@testing-library/user-event";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("zone parameters", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const zoneParametersData: DwellingSpaceZoneParametersData = {
		volume: 250,
		livingZoneArea: 40,
		restOfDwellingArea: 60,
		groundFloorArea: 50,
	};

	afterEach(() => {
		store.$reset();
	});

	type ZoneParametersOverrides = Partial<DwellingSpaceZoneParametersData>;

	const populateValidForm = async (overrides: ZoneParametersOverrides = {}) => {
		const defaults: DwellingSpaceZoneParametersData = {
			volume: 250,
			livingZoneArea: 40,
			restOfDwellingArea: 60,
			groundFloorArea: 50,
		};

		const values: DwellingSpaceZoneParametersData = { ...defaults, ...overrides };
		await user.type(screen.getByTestId("volume"), String(values.volume));
		await user.type(screen.getByTestId("livingZoneArea"), String(values.livingZoneArea));
		await user.type(screen.getByTestId("groundFloorArea"), String(values.groundFloorArea));
		await user.type(screen.getByTestId("restOfDwellingArea"), String(values.restOfDwellingArea));
	};

	describe("zone parameters", () => {

		// store.$patch({
		// 	spaceHeating: {
		// 		heatEmitting: {
		// 			wetDistribution: {
		// 				data: [{
		// 					name: 'radiators'
		// 				}]
		// 			},
		// 			instantElectricHeater: {
		// 				data: [{
		// 					name: 'instant electric heater'
		// 				}]
		// 			}
		// 		}
		// 	}
		// });
		// });

		// it('populates heat emitting system options from state', async () => {
		// 	await renderSuspended(ZoneParameters);
		//
		// 	expect(screen.getByTestId('spaceHeatingSystemForThisZone_radiators')).toBeDefined();
		// 	expect(screen.getByTestId('spaceHeatingSystemForThisZone_instant_electric_heater')).toBeDefined();
		// });



		test("data is saved to store state and marked as complete when form is valid", async () => {
			await renderSuspended(ZoneParameters);

			await populateValidForm();
			await user.click(screen.getByTestId("saveAndComplete"));

			await waitFor(() => {
				const { data, complete } = store.dwellingFabric.dwellingSpaceZoneParameters;
				expect(data).toEqual(zoneParametersData);
				expect(complete).toBe(true);
			});

			expect(navigateToMock).toBeCalledWith("/dwelling-fabric");
		});

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceZoneParameters: { data: zoneParametersData },
				},
			});

			await renderSuspended(ZoneParameters);

			expect((await screen.findByTestId<HTMLInputElement>("volume")).value).toBe("250");
			expect((await screen.findByTestId<HTMLInputElement>("livingZoneArea")).value).toBe("40");
			expect((await screen.findByTestId<HTMLInputElement>("groundFloorArea")).value).toBe("50");
			expect((await screen.findByTestId<HTMLInputElement>("restOfDwellingArea")).value).toBe("60");
		});

		test("required error messages are displayed when empty form is submitted", async () => {
			await renderSuspended(ZoneParameters);

			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("volume_error"))).toBeDefined();
			expect((await screen.findByTestId("livingZoneArea_error"))).toBeDefined();
			expect((await screen.findByTestId("groundFloorArea_error"))).toBeDefined();
			expect((await screen.findByTestId("restOfDwellingArea_error"))).toBeDefined();
		});

		test("error summary is displayed when an invalid form is submitted", async () => {
			await renderSuspended(ZoneParameters);

			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("zoneParametersErrorSummary"))).toBeDefined();
		});

		test("save and complete navigates to dwelling fabric page", async () => {
			await renderSuspended(ZoneParameters);

			await populateValidForm();
			await user.click(screen.getByTestId("saveAndComplete"));

			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric");
		});

		test("save progress button navigates user to the dwelling fabric overview page", async () => {
			await renderSuspended(ZoneParameters);

			await user.click(screen.getByTestId("saveProgress"));

			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric");
		});

		test("does not mark as complete when form has validation errors", async () => {
			await renderSuspended(ZoneParameters);

			// Only fill some fields
			await user.type(screen.getByTestId("volume"), "250");
			await user.click(screen.getByTestId("saveAndComplete"));

			expect(store.dwellingFabric.dwellingSpaceZoneParameters.complete).not.toBe(true);
		});

		describe("boundary value tests", () => {
			test("accepts zero for volume", async () => {
				await renderSuspended(ZoneParameters);

				await populateValidForm({ volume: 0 });
				await user.click(screen.getByTestId("saveAndComplete"));

				const { data } = store.dwellingFabric.dwellingSpaceZoneParameters;
				expect(data.volume).toBe(0);
			});

			test("accepts large values for volume", async () => {
				await renderSuspended(ZoneParameters);

				await populateValidForm({ volume: 50000 });
				await user.click(screen.getByTestId("saveAndComplete"));

				const { data } = store.dwellingFabric.dwellingSpaceZoneParameters;
				expect(data.volume).toBe(50000);
			});

			test("accepts zero for livingZoneArea", async () => {
				await renderSuspended(ZoneParameters);

				await populateValidForm({ livingZoneArea: 0 });
				await user.click(screen.getByTestId("saveAndComplete"));

				const { data } = store.dwellingFabric.dwellingSpaceZoneParameters;
				expect(data.livingZoneArea).toBe(0);
			});

			test("accepts large values for livingZoneArea", async () => {
				await renderSuspended(ZoneParameters);

				await populateValidForm({ livingZoneArea: 10000 });
				await user.click(screen.getByTestId("saveAndComplete"));

				const { data } = store.dwellingFabric.dwellingSpaceZoneParameters;
				expect(data.livingZoneArea).toBe(10000);
			});

			test("accepts zero for groundFloorArea", async () => {
				await renderSuspended(ZoneParameters);

				await populateValidForm({ groundFloorArea: 0 });
				await user.click(screen.getByTestId("saveAndComplete"));

				const { data } = store.dwellingFabric.dwellingSpaceZoneParameters;
				expect(data.groundFloorArea).toBe(0);
			});

			test("accepts large values for groundFloorArea", async () => {
				await renderSuspended(ZoneParameters);

				await populateValidForm({ groundFloorArea: 10000 });
				await user.click(screen.getByTestId("saveAndComplete"));

				const { data } = store.dwellingFabric.dwellingSpaceZoneParameters;
				expect(data.groundFloorArea).toBe(10000);
			});

			test("accepts zero for restOfDwellingArea", async () => {
				await renderSuspended(ZoneParameters);

				await populateValidForm({ restOfDwellingArea: 0 });
				await user.click(screen.getByTestId("saveAndComplete"));

				const { data } = store.dwellingFabric.dwellingSpaceZoneParameters;
				expect(data.restOfDwellingArea).toBe(0);
			});

			test("accepts large values for restOfDwellingArea", async () => {
				await renderSuspended(ZoneParameters);

				await populateValidForm({ restOfDwellingArea: 10000 });
				await user.click(screen.getByTestId("saveAndComplete"));

				const { data } = store.dwellingFabric.dwellingSpaceZoneParameters;
				expect(data.restOfDwellingArea).toBe(10000);
			});
		});
	});

});

describe("Partially saving data", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	test("form data is automatically saved to store", async () => {
		await renderSuspended(ZoneParameters);

		await user.type(screen.getByTestId("volume"), "11");
		await user.type(screen.getByTestId("livingZoneArea"), "13");
		await user.tab();

		expect(store.dwellingFabric.dwellingSpaceZoneParameters.data.volume).toBe(11);
		expect(store.dwellingFabric.dwellingSpaceZoneParameters.data.livingZoneArea).toBe(13);
	});

	test("partial data is saved when navigating away", async () => {
		await renderSuspended(ZoneParameters);

		await user.type(screen.getByTestId("volume"), "300");
		await user.type(screen.getByTestId("livingZoneArea"), "45");
		await user.click(screen.getByTestId("saveProgress"));

		expect(store.dwellingFabric.dwellingSpaceZoneParameters.data.volume).toBe(300);
		expect(store.dwellingFabric.dwellingSpaceZoneParameters.data.livingZoneArea).toBe(45);
		expect(store.dwellingFabric.dwellingSpaceZoneParameters.complete).toBe(false);
	});
});
