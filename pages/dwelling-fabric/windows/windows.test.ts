import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Windows from "./index.vue";
import WindowsForm from "./[window].vue";
import { screen } from "@testing-library/vue";
import { within } from "@testing-library/dom";
import formStatus from "~/constants/formStatus";

describe("windows", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});

	const externalWall: ExternalWallData = {
		id: "80fd1ffe-a83a-4d95-bd2c-ad8fdc37b421",
		name: "External wall 1",
		pitchOption: "90",
		pitch: 90,
		orientation: 0,
		length: 20,
		height: 0.5,
		elevationalHeight: 20,
		surfaceArea: 10,
		thermalResistance: 1,
		colour: "Intermediate",
		arealHeatCapacity: "Very light",
		massDistributionClass: "I",
	};

	const window1: EcaasForm<WindowData> = {
		data: {
			id: "test-id-1",
			name: "Window 1",
			taggedItem: externalWall.id,
			height: 1,
			width: 1,
			uValue: 1,
			solarTransmittance: 0.1,
			elevationalHeight: 1,
			midHeight: 1,
			numberOpenableParts: "0",
			openingToFrameRatio: 0.2,
			curtainsOrBlinds: false,
			securityRisk: false,
		},
		complete: true,
	};

	const window2: EcaasForm<WindowData> = {
		data: {
			...window1.data,
			name: "Window 2",
		},
		complete: true,
	};

	const window3: EcaasForm<WindowData> = {
		data: {
			...window1.data,
			name: "Window 3",
		},
		complete: true,
	};

	beforeEach(async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: [window1, window2],
				},
			},
		});
		await renderSuspended(Windows);
	});

	afterEach(() => {
		store.$reset();
	});


	test("window is removed when remove link is clicked", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: [window1],
				},
			},
		});

		expect(screen.getAllByTestId("windows_items")).toBeDefined();

		await user.click(screen.getByTestId("windows_remove_0"));

		expect(screen.queryByTestId("windows_items")).toBeNull();
	});

	test("should only remove the window object thats is clicked", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: [window1, window2, window3],
				},
			},
		});
		await user.click(screen.getByTestId("windows_remove_1"));

		const populatedList = screen.getByTestId("windows_items");

		expect(within(populatedList).getByText("Window 1")).toBeDefined();
		expect(within(populatedList).getByText("Window 3")).toBeDefined();
		expect(within(populatedList).queryByText("Window 2")).toBeNull();
	});

	test("when a window is removed its also removed from any store item that references it", async () => {
		const vent1: EcaasForm<VentData> = {
			data: {
				name: "Vent 1",
				associatedItemId: window2.data.id,
				effectiveVentilationArea: 10,
				openingRatio: 1,
				midHeightOfZone: 1,
			},
		};

		store.$patch({
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: [window1, window2],
				},
			},
			infiltrationAndVentilation: {
				vents: {
					data: [vent1],
				},
			},
		});

		await renderSuspended(Windows);

		await user.click(await screen.findByTestId("windows_remove_1"));

		const vent = store.infiltrationAndVentilation.vents.data[0]?.data;
		expect(vent?.associatedItemId).toBeUndefined();
	});

	test("window is duplicated when duplicate link is clicked", async () => {

		await userEvent.click(screen.getByTestId("windows_duplicate_0"));
		await userEvent.click(screen.getByTestId("windows_duplicate_0"));
		await userEvent.click(screen.getByTestId("windows_duplicate_2"));
		await userEvent.click(screen.getByTestId("windows_duplicate_2"));

		expect(screen.queryAllByTestId("windows_item").length).toBe(6);
		expect(screen.getByText("Window 1")).toBeDefined();
		expect(screen.getByText("Window 1 (1)")).toBeDefined();
		expect(screen.getByText("Window 1 (2)")).toBeDefined();
		expect(screen.getByText("Window 1 (1) (1)")).toBeDefined();
		expect(screen.getByText("Window 1 (1) (2)")).toBeDefined();
	});

	test("window should display an 'in-progress' indicator when it is incomplete", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: [{ data: { ...window1.data }, complete: false }],
				},
			},
		});

		await renderSuspended(Windows);

		expect(screen.getByTestId("windows_status_0").textContent).toBe(
			formStatus.inProgress.text,
		);
	});

	test("window should display an 'completed' indicator when it is complete", async () => {

		await renderSuspended(Windows);

		expect(screen.getByTestId("windows_status_0").textContent).toBe(
			formStatus.complete.text,
		);
	});

	test("Return to dwelling fabric button navigates to the dwelling fabric overview page", async () => {

		const returnToOverviewButton = screen.getByRole("button", {
			name: "Return to dwelling fabric",
		});
		expect(returnToOverviewButton.getAttribute("href")).toBe(
			"/dwelling-fabric",
		);
	});

	describe("Mark section as complete", () => {

		test("disables the Mark section as complete button when window element is incomplete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWindows: {
						data: [{ data: { ...window1.data }, complete: false }],
					},
				},
			});

			await renderSuspended(Windows);
			expect(screen.getByTestId("markAsCompleteButton").hasAttribute("disabled")).toBeTruthy();
		});

		test("enables the Mark section as complete button when all window items are complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWindows: {
						data: [{ data: { ...window1.data }, complete: true }],
					},
				},
			});

			await renderSuspended(Windows);
			expect(screen.getByTestId("markAsCompleteButton").hasAttribute("disabled")).toBeFalsy();
		});

		test("displays a 'Completed' status indicator when section is marked as complete", async () => {

			await renderSuspended(Windows);
			await user.click(screen.getByTestId("markAsCompleteButton"));
			const completedStatusElement = screen.queryByTestId(
				"completeSectionCompleted",
			);
			expect(completedStatusElement?.style.display).not.toBe("none");
		});


		describe("after section has been marked as complete", () => {

			beforeEach(async () => {
				await user.click(screen.getByTestId("markAsCompleteButton"));
			});

			test("the 'Completed' section status indicator is shown", async () => {
				const completed = screen.queryByTestId("completeSectionCompleted");
				expect(completed?.style.display).not.toBe("none");
			});

			test("windows section is complete", async () => {

				expect(store.dwellingFabric.dwellingSpaceWindows.complete).toBe(true);
			});

			test("user is navigated to the dwelling fabric overview page", async () => {

				expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric");
			});

			test("windows is not complete after user removes a window", async () => {

				await user.click(screen.getByTestId("windows_remove_0"));
				expect(store.dwellingFabric.dwellingSpaceWindows.complete).toBe(false);
			});

			test("windows is not complete after user duplicates a window", async () => {

				await user.click(screen.getByTestId("windows_duplicate_0"));
				expect(store.dwellingFabric.dwellingSpaceWindows.complete).toBe(false);
			});

			test("windows is not complete after user adds a new window", async () => {

				await renderSuspended(WindowsForm, {
					route: {
						params: { window: "create" },
					},
				});

				await user.type(screen.getByTestId("name"), "New window");
				await user.tab();
				expect(store.dwellingFabric.dwellingSpaceWindows.complete).toBe(false);
			});

			test("window is not complete after user edits a window", async () => {

				await renderSuspended(WindowsForm, {
					route: {
						params: { window: "0" },
					},
				});
				await user.clear(screen.getByTestId("name"));
				await user.type(screen.getByTestId("name"), "Updated window");
				await user.tab();
				expect(store.dwellingFabric.dwellingSpaceWindows.complete).toBe(false);
			});
		});
	});
});
