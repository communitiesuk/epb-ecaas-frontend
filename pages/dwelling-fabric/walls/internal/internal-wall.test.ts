import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import InternalWall from "./[wall].vue";
import { v4 as uuidv4 } from "uuid";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

vi.mock("uuid");

describe("internal wall", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const internalWall: InternalWallData = {
		id: "06cce939-0899-42cc-aa46-0d47c11a6ede",
		name: "Internal 1",
		grossSurfaceArea: 5,
		kappaValue: 50000,
		massDistributionClass: "I",
		pitchOption: "90",
		pitch: 90,
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Internal 1");
		await user.type(screen.getByTestId("grossSurfaceArea"), "5");
		await user.click(screen.getByTestId("kappaValue_50000"));
		await user.click(screen.getByTestId("massDistributionClass_I"));
		await user.click(screen.getByTestId("pitchOption_90"));
	};
	
	test("data is saved to store state when form is valid", async () => {
		vi.mocked(uuidv4).mockReturnValue(internalWall.id as unknown as Buffer);

		await renderSuspended(InternalWall, {
			route: {
				params: { wall: "create" },
			},
		});

		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { dwellingSpaceInternalWall } = store.dwellingFabric.dwellingSpaceWalls;
		
		expect(dwellingSpaceInternalWall?.data[0]?.data).toEqual(internalWall);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceInternalWall: {
						data: [{ data: internalWall }],
					},
				},
			},
		});

		await renderSuspended(InternalWall, {
			route: {
				params: { wall: "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Internal 1");
		expect((await screen.findByTestId<HTMLInputElement>("grossSurfaceArea")).value).toBe("5");
		expect((await screen.findByTestId("kappaValue_50000")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("massDistributionClass_I")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("pitchOption_90")).hasAttribute("checked")).toBe(true);
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(InternalWall, {
			route: {
				params: { wall: "create" },
			},
		});

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("grossSurfaceArea_error"))).toBeDefined();
		expect((await screen.findByTestId("kappaValue_error"))).toBeDefined();
		expect((await screen.findByTestId("massDistributionClass_error"))).toBeDefined();
		expect((await screen.findByTestId("pitchOption_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(InternalWall, {
			route: {
				params: { wall: "create" },
			},
		});

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("internalWallErrorSummary"))).toBeDefined();
	});

	it("requires pitch when custom pitch option is selected", async () => {
		await renderSuspended(InternalWall, {
			route: {
				params: { wall: "create" },
			},
		});

		await user.click(screen.getByTestId("pitchOption_custom"));
		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("pitch_error"))).toBeDefined();
	});

	it("saves custom pitch when custom pitch option is selected", async () => {
		await renderSuspended(InternalWall, {
			route: {
				params: { wall: "create" },
			},
		});

		await populateValidForm();
		await user.click(screen.getByTestId("pitchOption_custom"));
		await user.type(screen.getByTestId("pitch"), "100");
		await user.tab();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { dwellingSpaceInternalWall } = store.dwellingFabric.dwellingSpaceWalls;
		
		expect(dwellingSpaceInternalWall?.data[0]?.data.pitch).toEqual(100);
	});

	it("navigates to walls page when valid form is completed", async () => {
		await renderSuspended(InternalWall, {
			route: {
				params: { wall: "create" },
			},
		});
	
		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/walls");
	});

	test("updated form data is automatically saved to store", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceInternalWall: {
						data: [{
							data: { ...internalWall },
						}],
					},
				},
			},
		});

		await renderSuspended(InternalWall, {
			route: {
				params: { wall: "0" },
			},
		});
	
		await user.clear(screen.getByTestId("name"));
		await user.tab();
		await user.clear(screen.getByTestId("grossSurfaceArea"));

		await user.type(screen.getByTestId("name"), "Internal wall 2");
		await user.type(screen.getByTestId("grossSurfaceArea"), "10");
		await user.tab();

		const { data } = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceInternalWall;

		expect(data[0]?.data.name).toBe("Internal wall 2");
		expect(data[0]?.data.grossSurfaceArea).toBe(10);
	});
	
	test("partial form data is saved automatically with default name to store", async () => {
		await renderSuspended(InternalWall, {
			route: {
				params: { wall: "create" },
			},
		});
		
		await user.type(screen.getByTestId("grossSurfaceArea"), "10");
		await user.tab();

		const { data } = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceInternalWall;

		expect(data[0]?.data.name).toBe("Internal wall");
		expect(data[0]?.data.grossSurfaceArea).toBe(10);
	});
});