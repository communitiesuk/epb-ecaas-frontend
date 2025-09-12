import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import InternalWall from "./[wall].vue";
import { MassDistributionClass } from "~/schema/api-schema.types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("internal wall", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const internalWall: InternalWallData = {
		name: "Internal 1",
		surfaceAreaOfElement: 5,
		kappaValue: 50000,
		massDistributionClass: MassDistributionClass.I,
		pitchOption: "90",
		pitch: 90,
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Internal 1");
		await user.type(screen.getByTestId("surfaceAreaOfElement"), "5");
		await user.click(screen.getByTestId("kappaValue_50000"));
		await user.click(screen.getByTestId("massDistributionClass_I"));
		await user.click(screen.getByTestId("pitchOption_90"));
	};
	
	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(InternalWall);

		await populateValidForm();
		await user.click(screen.getByRole("button"));

		const { dwellingSpaceInternalWall } = store.dwellingFabric.dwellingSpaceWalls;
		
		expect(dwellingSpaceInternalWall?.data[0]).toEqual(internalWall);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceInternalWall: {
						data: [internalWall],
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
		expect((await screen.findByTestId<HTMLInputElement>("surfaceAreaOfElement")).value).toBe("5");
		expect((await screen.findByTestId("kappaValue_50000")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("massDistributionClass_I")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("pitchOption_90")).hasAttribute("checked")).toBe(true);
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(InternalWall);

		await user.click(screen.getByRole("button"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("surfaceAreaOfElement_error"))).toBeDefined();
		expect((await screen.findByTestId("kappaValue_error"))).toBeDefined();
		expect((await screen.findByTestId("massDistributionClass_error"))).toBeDefined();
		expect((await screen.findByTestId("pitchOption_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(InternalWall);

		await user.click(screen.getByRole("button"));

		expect((await screen.findByTestId("internalWallErrorSummary"))).toBeDefined();
	});

	test("requires pitch when custom pitch option is selected", async () => {
		await renderSuspended(InternalWall);

		await user.click(screen.getByTestId("pitchOption_custom"));
		await user.click(screen.getByRole("button"));

		expect((await screen.findByTestId("pitch_error"))).toBeDefined();
	});

	test("saves custom pitch when custom pitch option is selected", async () => {
		await renderSuspended(InternalWall);

		await populateValidForm();
		await user.click(screen.getByTestId("pitchOption_custom"));
		await user.type(screen.getByTestId("pitch"), "100");
		await user.tab();
		await user.click(screen.getByRole("button"));

		const { dwellingSpaceInternalWall } = store.dwellingFabric.dwellingSpaceWalls;
		
		expect(dwellingSpaceInternalWall?.data[0]?.pitch).toEqual(100);
	});

	test("navigates to walls page when valid form is completed", async () => {
		await renderSuspended(InternalWall);
	
		await populateValidForm();
		await user.click(screen.getByRole("button"));

		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/walls");
	});
});