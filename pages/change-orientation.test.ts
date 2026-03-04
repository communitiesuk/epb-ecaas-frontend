import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { renderSuspended } from "@nuxt/test-utils/runtime";
import ChangeOrientation from "./change-orientation.vue";


describe("Change orientation", () => {
	const user = userEvent.setup();
	
	const doorNoTag: Partial<ExternalGlazedDoorData> = {
		name: "External glazed door",
		isTheFrontDoor: true,
		orientation: 24,	
	}; 
	
	const externalWall: Partial<ExternalWallData> = {
		id: "ex-1",
		name: "External wall",
		orientation: 30,
	};

	const doorWithTag: Partial<ExternalUnglazedDoorData> = {
		name: "External unglazed door",
		isTheFrontDoor: true,
		associatedItemId: externalWall.id,
	};
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it("Displays the current front door's name and orientation", async () => {

		store.$patch({
			dwellingFabric: {
				dwellingSpaceDoors: {
					dwellingSpaceExternalGlazedDoor: {
						data: [{ data: doorNoTag, complete: true } ],
					},
				},
			},
		});

		await renderSuspended(ChangeOrientation);
		
		expect(screen.getByTestId("frontDoorName").innerText).toBe(doorNoTag.name);
		expect(screen.getByTestId("currentOrientation").innerText).toBe(String(doorNoTag.orientation));
	});

	it("When the front door is tagged with an item, it receives orientaion from that item", async () => {
	
		store.$patch({
			dwellingFabric: {
				dwellingSpaceDoors: {
					dwellingSpaceExternalGlazedDoor: {
						data: [{ data: doorWithTag, complete: true }],
					},
				},
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: {
						data: [{ data: externalWall }],
					},
				},
			},
		});

		await renderSuspended(ChangeOrientation);
		
		expect(screen.getByTestId("frontDoorName").innerText).toBe(doorWithTag.name);
		expect(screen.getByTestId("currentOrientation").innerText).toBe(String(externalWall.orientation));
	});

	it("When the front door is an internal door, it has its own orientaion despite being tagged with an item", async () => {
	
		const internalWall: Partial<PartyWallData> = {
			id: "in-1",
			name: "Party wall",
		};

		const doorWithTag: Partial<InternalDoorData> = {
			name: "Internal door",
			isTheFrontDoor: true,
			associatedItemId: internalWall.id,
			orientation: 100,
		};

		store.$patch({
			dwellingFabric: {
				dwellingSpaceDoors: {
					dwellingSpaceExternalGlazedDoor: {
						data: [{ data: doorWithTag, complete: true }],
					},
				},
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: {
						data: [{ data: internalWall }],
					},
				},
			},
		});

		await renderSuspended(ChangeOrientation);
		
		expect(screen.getByTestId("frontDoorName").innerText).toBe(doorWithTag.name);
		expect(screen.getByTestId("currentOrientation").innerText).toBe(String(doorWithTag.orientation));
	});

	it("Displays error message when there is no front door marked as complete", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceDoors: {
					dwellingSpaceExternalGlazedDoor: {
						data: [{ data: doorNoTag }, { data: doorWithTag }],
					},
				},
			},
		});

		await renderSuspended(ChangeOrientation);
		expect(screen.getByTestId("noFrontDoor_error")).toBeDefined();
	});

	it("Displays error message when there is a completed front door but it has no orientation from it's tagged item", async () => {
		const externalWall: Partial<ExternalWallData> = {
			id: "ex-1",
			name: "External wall",
		};

		const doorWithTag: Partial<ExternalUnglazedDoorData> = {
			name: "External unglazed door",
			isTheFrontDoor: true,
			associatedItemId: externalWall.id,
		};
		
		
		store.$patch({
			dwellingFabric: {
				dwellingSpaceDoors: {
					dwellingSpaceExternalGlazedDoor: {
						data: [{ data: doorWithTag, complete: true }],
					},
				},	
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: {
						data: [{ data: externalWall }],
					},
				},
			},
		});

		await renderSuspended(ChangeOrientation);
		expect(screen.getByTestId("frontDoorWithoutOrientation_error")).toBeDefined();
	});

	// windows *
	// doors *
	// walls * exernal
	// roofs *
	// PV arrays *
	// PV shading TODO

	describe("updates orienation items for: ", () => {
		
		const updateOrientation = async (newOrientation: string) => {
			await user.type(screen.getByTestId("newOrientation"), newOrientation);
			await user.tab();
			await user.click(screen.getByTestId("changeOrientationButton"));
		};
		
		let frontDoor: Partial<ExternalGlazedDoorData>; 
		beforeEach(() => {
			frontDoor = {
				name: "Front door",
				isTheFrontDoor: true,
				orientation: 100,	        
			}; 
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalGlazedDoor: {
							data: [{ data: frontDoor, complete: true }],
							
						},
					},	
				},
			});
		});
		
		it("PV arrays", async () => {
		
			const pvArray: Partial<PvArrayData> = {
				name: "PV 1",
				orientation: 20,
			};

			const pvArray2: Partial<PvArrayData> = {
				name: "PV 2",
				orientation: 340,
			};

			store.$patch({
				pvAndBatteries: {
					pvArrays: {
						data: [{ data: pvArray }, { data: pvArray2 }],
					},
				},
			});

			await renderSuspended(ChangeOrientation);
			await updateOrientation("130");
		
			const { pvArrays } = store.pvAndBatteries;
			expect(pvArrays.data[0]?.data.orientation).toBe(50);
			expect(pvArrays.data[1]?.data.orientation).toBe(10);
		});

		it("doors", async () => {

			const glazedDoor: Partial<ExternalGlazedDoorData> = {
				name: "GD 2",
				pitch: 10,
				orientation: 5,
			};

			const unglazedDoor: Partial<ExternalUnglazedDoorData> = {
				name: "UGD 1",
				orientation: 350,
			};

			const internalDoor: Partial<InternalDoorData> = {
				name: "ID 1",
				orientation: 300,
			};

			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalGlazedDoor: {
							data: [{ data: frontDoor, complete: true }, { data: glazedDoor }],
						},
						dwellingSpaceExternalUnglazedDoor: {
							data: [{ data: unglazedDoor }],
						}, 
						dwellingSpaceInternalDoor: {
							data: [{ data: internalDoor }],
						},
					},
				},
			});

			await renderSuspended(ChangeOrientation);
			await updateOrientation("130");

			const { dwellingSpaceInternalDoor, dwellingSpaceExternalUnglazedDoor, dwellingSpaceExternalGlazedDoor } = store.dwellingFabric.dwellingSpaceDoors;
			expect(dwellingSpaceExternalGlazedDoor.data[0]?.data.orientation).toBe(130);
			expect(dwellingSpaceExternalGlazedDoor.data[1]?.data.orientation).toBe(35);
			expect(dwellingSpaceExternalUnglazedDoor.data[0]?.data.orientation).toBe(20);
			expect((dwellingSpaceInternalDoor.data[0]?.data as { orientation: number }).orientation).toBe(330);
		});

		it("walls", async () => {

			const externalWall: Partial<ExternalWallData> = {
				id: "8bb5eda9-3c31-44d0-801b-f130a63b9f6a",
				name: "External wall",
				pitch: 1,
				orientation: 0,
			};
			
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceExternalWall: {
							data: [
								{ data: externalWall },
							],
						},
					},
				},
			});

			await renderSuspended(ChangeOrientation);
			await updateOrientation("20");

			expect(store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceExternalWall.data[0]?.data.orientation).toBe(280);
		});

		it("roofs", async () => {
	
			const roof: Partial<RoofData> = {
				name: "Roof",
				orientation: 360,
			};
			
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceRoofs: {
							data: [{ data: roof }],
						},
					},
				},
			});

			await renderSuspended(ChangeOrientation);
			await updateOrientation("10");

			expect(store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs.data[0]?.data.orientation).toBe(270);
		});

		it("windows", async () => {

			const window: Partial<WindowData> = {
				name: "window",
				orientation: 11,
			};
			
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWindows: {
						data: [{ data: window }],
					},
				},
			});

			await renderSuspended(ChangeOrientation);
			await updateOrientation("10");

			expect(store.dwellingFabric.dwellingSpaceWindows.data[0]?.data.orientation).toBe(281);
		});
	});
	it("'Return to overview' button navigates user to the homepage", async () => {
		await renderSuspended(ChangeOrientation);
		const returnToOverviewButton = screen.getByRole("button", {
			name: "Return to overview",
		});
		expect(returnToOverviewButton.getAttribute("href")).toBe(
			"/",
		);

	});
});