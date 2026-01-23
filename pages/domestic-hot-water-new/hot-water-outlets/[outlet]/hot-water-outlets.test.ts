import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import HotWaterOutlets from "./index.vue";
import { v4 as uuidv4 } from "uuid";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

vi.mock("uuid");

describe("hot water outlets", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const heatPumpId = "463c94f6-566c-49b2-af27-57e5c68b5c30";

	const mixerShower: EcaasForm<MixedShowerDataNew> = {
		data: {
			name: "Mixer shower 1",
			id: "c84528bb-f805-4f1e-95d3-2bd1717deca1",
			typeOfHotWaterOutlet: "mixedShower",
			flowRate: 10,
			hotWaterSource: heatPumpId,
			wwhrs: false,
		},
	};
	
	afterEach(() => {
		store.$reset();
	});
	
	const addHeatPumpStoreData = () => {
		store.$patch({
			domesticHotWaterNew: {
				heatSources: {
					data: [
						{
							data: {
								id: heatPumpId,
								name: "Heat pump 1",
							},
							complete: true,
						},
					],
				},
			},
		});
	};
	
	const populateValidFormMS = async () => {
		await user.click(screen.getByTestId("typeOfHotWaterOutlet_mixedShower"));
		await user.type(screen.getByTestId("name"), "Mixer shower 1");
		await user.click(screen.getByTestId("hotWaterSource_0"));
		await user.type(screen.getByTestId("flowRate"), "10");
		await user.tab();
	};
	
	// const populateValidFormSHWT = async () => {
	// 	await user.click(screen.getByTestId("typeOfWaterStorage_smartHotWaterTank"));
	// 	await user.type(screen.getByTestId("name"), "Smart hot water tank 1");
	// 	await user.click(screen.getByTestId("chooseAProductButton"));
	// 	// await user.click(screen.getByTestId("selectProductButton_0"));
	// 	// Can't do this :( idk why)
	// 	await user.click(screen.getByTestId(`heatSource_${heatPumpId}`));
	// 	await user.type(screen.getByTestId("heaterPosition"), "0.8");
	// 	await user.type(screen.getByTestId("thermostatPosition"), "0.5");
	// 	await user.tab();
	// };
	
	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(HotWaterOutlets, {
			route: {
				params: { "hotWaterOutlet": "create" },
			},
		});

		//shared properties
        
		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("typeOfHotWaterOutlet_error"))).toBeDefined();
        
		//mixer shower specific

		await user.click(screen.getByTestId("typeOfHotWaterOutlet_mixedShower"));
		await user.click(screen.getByTestId("saveAndComplete"));
        
		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("hotWaterSource_error"))).toBeDefined();
		expect((await screen.findByTestId("flowRate_error"))).toBeDefined();
        
		//electric shower specific
        
		await user.click(screen.getByTestId("typeOfHotWaterOutlet_electricShower"));
		await user.click(screen.getByTestId("saveAndComplete"));
        
		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("ratedPower_error"))).toBeDefined();
        
		//bath specific
        
		await user.click(screen.getByTestId("typeOfHotWaterOutlet_bath"));
		await user.click(screen.getByTestId("saveAndComplete"));
        
		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("size_error"))).toBeDefined();
        
		//other hot water outlet specific
        
		await user.click(screen.getByTestId("typeOfHotWaterOutlet_otherHotWaterOutlet"));
		await user.click(screen.getByTestId("saveAndComplete"));
        
		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("flowRateOther_error"))).toBeDefined();
	});

	//awaiting pcdb merge
	// test("navigate to pcdb product select page for wwhrs when choose a product button is clicked", async () => {
	// 	await renderSuspended(HotWaterOutlets, {
	// 		route: {
	// 			path: "/domestic-hot-water-new/hot-water-outlets/create",
	// 		},
	// 	});

	// 	await user.click(screen.getByTestId("typeOfHotWaterOutlet_electricShower"));
		
	// 	const chooseProductButton = await screen.findByTestId<HTMLAnchorElement>("chooseAProductButton");
	// 	expect(chooseProductButton).toBeDefined();
	// 	expect(chooseProductButton.pathname).toContain("/domestic-hot-water-new/water-storage/0/air-source");
	// });

	[
		{ 
			type: "mixedShower",
			populateValidForm: populateValidFormMS,
			hotWaterOutlet: mixerShower,
		},
		// { 
		// 	type: "electricShower",
		// 	populateValidForm: populateValidFormES,
		// 	hotWaterOutlet: electricShower,
		// },
		// { 
		// 	type: "bath",
		// 	populateValidForm: populateValidFormBath,
		// 	hotWaterOutlet: bath,
		// },
		// { 
		// 	type: "otherHotWaterOutlet",
		// 	populateValidForm: populateValidFormOHWO,
		// 	hotWaterOutlet: otherHotWaterOutlet,
		// },
	].forEach(({ type, populateValidForm, hotWaterOutlet }) => {
		describe(type, () => {
			test("data is saved to store state when form is valid", async () => {
				addHeatPumpStoreData();

				vi.mocked(uuidv4).mockReturnValue(hotWaterOutlet.data.id as unknown as Buffer);
				await renderSuspended(HotWaterOutlets, {
					route: {
						params: { "hotWaterOutlet": "create" },
					},
				});

				await populateValidForm();
		
				await user.click(screen.getByTestId("saveAndComplete"));

				const { data } = store.domesticHotWaterNew.hotWaterOutlets;
		
				expect(data[0]?.data).toEqual(hotWaterOutlet.data);
				expect(data[0]?.complete).toEqual(true);
			});

			test("form is prepopulated when data exists in state", async () => {
				store.$patch({
					domesticHotWaterNew: {
						hotWaterOutlets: {
							data: [{ ...hotWaterOutlet }],
						},
					},
				});

				addHeatPumpStoreData();
				await renderSuspended(HotWaterOutlets, {
					route: {
						params: { "hotWaterOutlet": "0" },
					},
				});

				expect(
					(await screen.findByTestId<HTMLInputElement>(`typeOfHotWaterOutlet_${type}`)).value,
				).toBe(type);

				(Object.keys(hotWaterOutlet.data))
					.filter(e => e !== "id")
					.forEach(async (key) => {
						expect((await screen.findByTestId<HTMLInputElement>(key)).value)
							.toBe(String((hotWaterOutlet.data)[key as (keyof typeof hotWaterOutlet.data)]));
					});
			});


			test("error summary is displayed when an invalid form in submitted", async () => {
				await renderSuspended(HotWaterOutlets);

				await user.click(screen.getByTestId("saveAndComplete"));

				expect((await screen.findByTestId("hotWaterOutletErrorSummary"))).toBeDefined();
			});

			test("navigates to domestic hot water page when valid form is completed", async () => {
				addHeatPumpStoreData();
				await renderSuspended(HotWaterOutlets);

				await populateValidForm();
				await user.click(screen.getByTestId("saveAndComplete"));

				expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water-new");
			});
		});
	});
});