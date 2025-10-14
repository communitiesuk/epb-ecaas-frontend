// wall - gets gross surface area and runs calculation to get net surface area

import { MassDistributionClass } from "~/schema/api-schema.types";

describe("calculateNetSurfaceArea", () => {
  const store = useEcaasStore()

  test("calculates the net surface area of item when it is tagged to one other item", () => {

   const externalWall: ExternalWallData = {
    id: "80fd1ffe-a83a-4d95-bd2c-ad8fdc37b421",
    name: "External wall 1",
    pitchOption: "90",
    pitch: 90,
    orientation: 0,
    length: 10,
    height: 5,
    elevationalHeight: 20,
    grossSurfaceArea: 55,
    solarAbsorption: 0.1,
    uValue: 1,
    kappaValue: 50000,
    massDistributionClass: MassDistributionClass.I,
  };
	
  const externalGlazedDoor: ExternalGlazedDoorData = {
			name: "External glazed door 1",
			associatedWallRoofId: externalWall.id,
			surfaceArea: 13,
			height: 14,
			width: 48,
			uValue: 0.45,
			solarTransmittance: 0.1,
			elevationalHeight: 14,
			midHeight: 11,
			numberOpenableParts: "1",
			openingToFrameRatio: 0.2,
			heightOpenableArea: 14,
			maximumOpenableArea: 13,
			midHeightOpenablePart1: 11,
	};

  const itemsTaggedToWall = [externalGlazedDoor]

    // const actual = calculateNetSurfaceArea(externalWall, itemsTaggedToWall)
    // expect(actual).toBe()
  })
})


