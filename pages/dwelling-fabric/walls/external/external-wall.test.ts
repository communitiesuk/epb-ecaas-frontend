import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import ExternalWall from "./[wall].vue";
import { v4 as uuidv4 } from "uuid";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

vi.mock("uuid");

describe("external wall", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const state: ExternalWallData = {
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
		massDistributionClass: "I",
	};

	afterEach(() => {
		store.$reset();
	});

	test("data is saved to store state when form is valid", async () => {
		vi.mocked(uuidv4).mockReturnValue(state.id as unknown as Buffer);
		
		await renderSuspended(ExternalWall, {
			route: {
				params: { wall: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "External wall 1");
		await user.click(screen.getByTestId("pitchOption_90"));
		await user.type(screen.getByTestId("orientation"), "0");
		await user.type(screen.getByTestId("length"), "20");
		await user.type(screen.getByTestId("height"), "0.5");
		await user.type(screen.getByTestId("elevationalHeight"), "20");
		await user.type(screen.getByTestId("grossSurfaceArea"), "10");
		await user.type(screen.getByTestId("solarAbsorption"), "0.1");
		await user.type(screen.getByTestId("uValue"), "1");
		await user.click(screen.getByTestId("kappaValue_50000"));
		await user.click(screen.getByTestId("massDistributionClass_I"));

		await user.click(screen.getByTestId("saveAndComplete"));

		const { data = [] } = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceExternalWall || {};
		
		expect(data[0]?.data).toEqual(state);
		expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric/walls");
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: {
						data: [{ data: state }],
					},
				},
			},
		});

		await renderSuspended(ExternalWall, {
			route: {
				params: { wall: "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("External wall 1");
		expect((await screen.findByTestId("pitchOption_90")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId<HTMLInputElement>("orientation")).value).toBe("0");
		expect((await screen.findByTestId<HTMLInputElement>("length")).value).toBe("20");
		expect((await screen.findByTestId<HTMLInputElement>("height")).value).toBe("0.5");
		expect((await screen.findByTestId<HTMLInputElement>("elevationalHeight")).value).toBe("20");
		expect((await screen.findByTestId<HTMLInputElement>("grossSurfaceArea")).value).toBe("10");
		expect((await screen.findByTestId<HTMLInputElement>("solarAbsorption")).value).toBe("0.1");
		expect((await screen.findByTestId<HTMLInputElement>("uValue")).value).toBe("1");
		expect((await screen.findByTestId("kappaValue_50000")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("massDistributionClass_I")).hasAttribute("checked")).toBe(true);
	});
		
	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(ExternalWall);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("pitchOption_error"))).toBeDefined();
		expect((await screen.findByTestId("orientation_error"))).toBeDefined();
		expect((await screen.findByTestId("length_error"))).toBeDefined();
		expect((await screen.findByTestId("height_error"))).toBeDefined();
		expect((await screen.findByTestId("elevationalHeight_error"))).toBeDefined();
		expect((await screen.findByTestId("grossSurfaceArea_error"))).toBeDefined();
		expect((await screen.findByTestId("solarAbsorption_error"))).toBeDefined();
		expect((await screen.findByTestId("uValue_error"))).toBeDefined();
		expect((await screen.findByTestId("kappaValue_error"))).toBeDefined();
		expect((await screen.findByTestId("massDistributionClass_error"))).toBeDefined();

	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(ExternalWall);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("externalWallErrorSummary"))).toBeDefined();
	});

	test("requires pitch when custom pitch option is selected", async () => {
		await renderSuspended(ExternalWall);
    
		await user.click(screen.getByTestId("pitchOption_custom"));
		await user.click(screen.getByTestId("saveAndComplete"));
    
		expect((await screen.findByTestId("pitch_error"))).toBeDefined();
	});

	test("updated form data is automatically saved to store", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: {
						data: [{
							data: { ...state },
						}],
					},
				},
			},
		});

		await renderSuspended(ExternalWall, {
			route: {
				params: { wall: "0" },
			},
		});
	
		await user.clear(screen.getByTestId("name"));
		await user.tab();
		await user.clear(screen.getByTestId("height"));

		await user.type(screen.getByTestId("name"), "External wall 2");
		await user.type(screen.getByTestId("height"), "3");
		await user.tab();

		const { data } = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceExternalWall;

		expect(data[0]?.data.name).toBe("External wall 2");
		expect(data[0]?.data.height).toBe(3);
	});
	
	test("partial form data is saved automatically with default name to store", async () => {
		await renderSuspended(ExternalWall, {
			route: {
				params: { wall: "create" },
			},
		});
		
		await user.type(screen.getByTestId("height"), "3");
		await user.tab();

		const { data } = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceExternalWall;

		expect(data[0]?.data.name).toBe("External wall");
		expect(data[0]?.data.height).toBe(3);
	});

	describe("a wall is tagged to an item", () => {
    test("when the wall's gross surface area has not been added", async () => {
      const externalWall1: Partial<ExternalWallData> = {
        id: "80fd1ffe-a83a-4d95-bd2c-66666666666",
        name: "External wall 1",
      };

      store.$patch({
        dwellingFabric: {
          dwellingSpaceWalls: {
            dwellingSpaceExternalWall: {
              data: [{ data: externalWall1, complete: false }],
            },
          },
        },
      });

      await renderSuspended(ExternalWall);

      await user.type(screen.getByTestId("name"), "External wall 1");
      await user.tab();

      await user.click(screen.getByTestId("saveAndComplete"));

      const errorSummary = await screen.findByTestId(
        "externalWallErrorSummary"
      );

      expect(errorSummary.textContent.includes("The gross surface area cannot be less than the combined area of items its tagged to.")).toBe(
        false
      );
    });

  	test("when the wall's gross surface area is less than the total area of completed items it's tagged to", async () => {
      
			const externalGlazed1: ExternalGlazedDoorData = {
        name: "externalGlazed1 name",
        associatedItemId: state.id,
        height: 3,
        width: 2,
        uValue: 1,
        solarTransmittance: 0.1,
        elevationalHeight: 1,
        midHeight: 1,
        openingToFrameRatio: 0.2,
        midHeightOpenablePart1: 2,
        heightOpenableArea: 1,
        maximumOpenableArea: 1,
      };

      const externalGlazed2: ExternalGlazedDoorData = {
        name: "externalGlazed2 name",
        associatedItemId: state.id,
        height: 1,
        width: 1,
        uValue: 1,
        solarTransmittance: 0.1,
        elevationalHeight: 1,
        midHeight: 1,
        openingToFrameRatio: 0.2,
        midHeightOpenablePart1: 2,
        heightOpenableArea: 1,
        maximumOpenableArea: 1,
      };

      const unglazedDoor: ExternalUnglazedDoorData = {
        name: "External unglazed door 1",
        associatedItemId: state.id,
        height: 2,
        width: 1,
        elevationalHeight: 20,
        surfaceArea: 9,
        solarAbsorption: 0.1,
        uValue: 1,
        kappaValue: 50000,
        massDistributionClass: "I",
      };
			

      store.$patch({
        dwellingFabric: {
					 dwellingSpaceWalls: {
            dwellingSpaceExternalWall: {
              data: [{ data: state, complete: false }],
            },
          },
	        dwellingSpaceDoors: {
            dwellingSpaceExternalGlazedDoor: {
              data: [
                { data: externalGlazed1, complete: true },
                { data: externalGlazed2, complete: false },
              ],
            },
          dwellingSpaceExternalUnglazedDoor: {
              data: [{ data: unglazedDoor, complete: true }],
            },
          },
        },
      });

		await renderSuspended(ExternalWall, {
			route: {
				params: { wall: "0" },
			},
		});

      await user.click(screen.getByTestId("saveAndComplete"));

      const errorSummary = await screen.findByTestId(
        "externalWallErrorSummary"
      );

      expect(errorSummary.textContent.includes("The gross surface area cannot be less than the combined area of items its tagged to.")).toBe(
        true
      );
    });
  });
});
