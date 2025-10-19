
describe("getTagItem", () => {
  const externalWall1: EcaasForm<Partial<ExternalWallData>> = {
    data: {
      id: "80fd1ffe-a83a-4d95-bd2c-1111111111",
      name: "External wall 1",
    }, 
  };

  const externalWall2: EcaasForm<Partial<ExternalWallData>> = {
    data: {
      id: "80fd1ffe-a83a-4d95-bd2c-22222222222",
      name: "External wall 2",
      grossSurfaceArea: 15,
    },
  };

  const roof1: EcaasForm<Partial<RoofData>> = {
    data: {
      id: "80fd1ffe-a83a-4d95-bd2c-333333333333",
      name: "Roof 1"
    },
  };
  

  const store = useEcaasStore();
  
  beforeEach(() => {
    store.$patch({
      dwellingFabric: {
        dwellingSpaceWalls: {
          dwellingSpaceExternalWall: {
            data: [externalWall1, externalWall2],
          },
        },
        dwellingSpaceCeilingsAndRoofs: {
					dwellingSpaceRoofs: {
						data: [roof1],
					},
				},
      },
    });
  });
  
  test("returns tag item with given id", () => {
    
    const externalWalls = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceExternalWall;
    const roofs = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs;
    
    const actual = getTagItem("80fd1ffe-a83a-4d95-bd2c-1111111111", [externalWalls, roofs]);

    expect(actual).toEqual(externalWall1);
  });
})