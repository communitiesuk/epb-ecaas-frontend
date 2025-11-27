import userEvent from "@testing-library/user-event";
import { renderSuspended } from "@nuxt/test-utils/runtime";
import { screen } from "@testing-library/vue";
import Import from "./import.vue";

describe("import page", () => {
	const store = useEcaasStore();

	beforeEach(() => {
		store.$patch({
			...getInitialState(),
		});
	});

	afterEach(() => {
		store.$reset();
	});

	const goodFileName = "exported-form.json";

	const goodFile = new File(
		['{"dwellingDetails":{"generalSpecifications":{"data":{"typeOfDwelling":"house","storeysInDwelling":2,"numOfBedrooms":3,"coolingRequired":true},"typeOfDwelling":"house","storeysInDwelling":2,"numOfBedrooms":3,"coolingRequired":true,"complete":true},"shading":{"data":[]},"externalFactors":{"data":{}}},"infiltrationAndVentilation":{"mechanicalVentilation":{"data":[]},"ductwork":{"data":[]},"vents":{"data":[]},"combustionAppliances":{"open_fireplace":{"data":[]},"closed_with_fan":{"data":[]},"open_gas_flue_balancer":{"data":[]},"open_gas_kitchen_stove":{"data":[]},"open_gas_fire":{"data":[]},"closed_fire":{"data":[]}},"naturalVentilation":{"data":{}},"airPermeability":{"data":{}}},"domesticHotWater":{"waterHeating":{"hotWaterCylinder":{"data":[]},"immersionHeater":{"data":[]},"solarThermal":{"data":[]},"pointOfUse":{"data":[]},"heatPump":{"data":[]},"combiBoiler":{"data":[]},"heatBattery":{"data":[]},"smartHotWaterTank":{"data":[]},"heatInterfaceUnit":{"data":[]}},"hotWaterOutlets":{"mixedShower":{"data":[]},"electricShower":{"data":[]},"bath":{"data":[]},"otherOutlets":{"data":[]}},"pipework":{"primaryPipework":{"data":[]},"secondaryPipework":{"data":[]}},"wwhrs":{"data":[]}},"dwellingFabric":{"dwellingSpaceFloors":{"dwellingSpaceGroundFloor":{"data":[]},"dwellingSpaceInternalFloor":{"data":[]},"dwellingSpaceExposedFloor":{"data":[]}},"dwellingSpaceWalls":{"dwellingSpaceExternalWall":{"data":[]},"dwellingSpaceInternalWall":{"data":[]},"dwellingSpaceWallToUnheatedSpace":{"data":[]},"dwellingSpacePartyWall":{"data":[]}},"dwellingSpaceCeilingsAndRoofs":{"dwellingSpaceCeilings":{"data":[]},"dwellingSpaceRoofs":{"data":[]},"dwellingSpaceUnheatedPitchedRoofs":{"data":[]}},"dwellingSpaceDoors":{"dwellingSpaceExternalUnglazedDoor":{"data":[]},"dwellingSpaceExternalGlazedDoor":{"data":[]},"dwellingSpaceInternalDoor":{"data":[]}},"dwellingSpaceWindows":{"data":[]},"dwellingSpaceThermalBridging":{"dwellingSpaceLinearThermalBridges":{"data":[]},"dwellingSpacePointThermalBridges":{"data":[]}},"dwellingSpaceZoneParameters":{"data":{}}},"spaceHeating":{"heatGeneration":{"heatPump":{"data":[]},"boiler":{"data":[]},"heatBattery":{"data":[]},"heatNetwork":{"data":[]},"heatInterfaceUnit":{"data":[]}},"energySupply":{"data":{}},"heatEmitting":{"wetDistribution":{"data":[]},"instantElectricHeater":{"data":[]},"electricStorageHeater":{"data":[]},"warmAirHeatPump":{"data":[]}}},"pvAndBatteries":{"pvSystem":{"data":[]},"electricBattery":{"data":[]}},"cooling":{"airConditioning":{"data":[]}}}'],
		goodFileName,
		{ type: "application/json" },
	);

	const badFile = new File(
		["i am not a valid JSON file"],
		"nonjson.json",
		{ type: "application/json" },
	);

	const user = userEvent.setup();

	const renderAndUploadFile = async (file: File) => {
		await renderSuspended(Import);

		const input = screen.getByLabelText("Upload a JSON file");

		return user.upload(input, file);
	};

	it("merges the file contents into the store if the file is good", async () => {
		await renderAndUploadFile(goodFile);

		await user.click(screen.getByTestId("import-button"));

		// wait half a second for import to have happened
		setTimeout(() => expect(store.dwellingDetails.generalSpecifications.data.typeOfDwelling).toBe("house"), 500);
	});

	it("shows error message if import is bad", async () => {
		await renderAndUploadFile(badFile);

		await user.click(screen.getByTestId("import-button"));

		await screen.findByText("The provided file is not recognised as containing JSON.");
	});
});